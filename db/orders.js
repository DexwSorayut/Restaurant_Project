import { openTable, closeBill, getBillDetails } from './database';

// Reserved table_number for orders that aren't linked to a real table yet.
// When the table-selection flow is built, swap this for the actual table_id
// the person picked and every function below keeps working unchanged.
const QUICK_TABLE_NUMBER = 9999;

async function getOrCreateQuickTable(db) {
    const existing = await db.getFirstAsync(
        `SELECT table_id FROM tables WHERE table_number = ?`,
        [QUICK_TABLE_NUMBER]
    );
    if (existing) return existing.table_id;

    await db.runAsync(
        `INSERT INTO tables (table_number, capacity, status) VALUES (?, 1, 'AVAILABLE')`,
        [QUICK_TABLE_NUMBER]
    );
    const created = await db.getFirstAsync(
        `SELECT table_id FROM tables WHERE table_number = ?`,
        [QUICK_TABLE_NUMBER]
    );
    return created.table_id;
}

/** หา OPEN bill ของโต๊ะชั่วคราว ถ้ายังไม่มีให้เปิดใหม่ */
async function getOrOpenQuickBill(db) {
    const tableId = await getOrCreateQuickTable(db);

    let bill = await db.getFirstAsync(
        `SELECT bill_id FROM bills WHERE table_id = ? AND status = 'OPEN'`,
        [tableId]
    );

    if (!bill) {
        await openTable(db, tableId, 1);
        bill = await db.getFirstAsync(
            `SELECT bill_id FROM bills WHERE table_id = ? AND status = 'OPEN'`,
            [tableId]
        );
    }

    return { billId: bill.bill_id, tableId };
}

/** หา OPEN bill ของโต๊ะชั่วคราวแบบไม่เปิดใหม่ ใช้ตอนโหลดตะกร้าคืนตอนเปิดแอป */
async function findOpenQuickBill(db) {
    const table = await db.getFirstAsync(
        `SELECT table_id FROM tables WHERE table_number = ?`,
        [QUICK_TABLE_NUMBER]
    );
    if (!table) return null;

    const bill = await db.getFirstAsync(
        `SELECT bill_id FROM bills WHERE table_id = ? AND status = 'OPEN'`,
        [table.table_id]
    );
    return bill ? { billId: bill.bill_id, tableId: table.table_id } : null;
}

/**
 * บันทึกรายการที่กด "สั่งอาหาร" เป็น order_round ใหม่ 1 รอบ + order_items ของรอบนั้น
 * cartItems: [{ food: { food_id, price, ... }, qty, note }]
 */
export async function placeOrderRound(db, cartItems) {
    const { billId } = await getOrOpenQuickBill(db);
    const orderedAt = new Date().toISOString();

    let roundId, roundNumber;

    await db.withTransactionAsync(async () => {
        const last = await db.getFirstAsync(
            `SELECT COALESCE(MAX(round_number), 0) AS maxRound FROM order_rounds WHERE bill_id = ?`,
            [billId]
        );
        roundNumber = Number(last?.maxRound ?? 0) + 1;

        await db.runAsync(
            `INSERT INTO order_rounds (bill_id, round_number, ordered_at) VALUES (?, ?, ?)`,
            [billId, roundNumber, orderedAt]
        );

        const created = await db.getFirstAsync(
            `SELECT round_id FROM order_rounds WHERE bill_id = ? AND round_number = ?`,
            [billId, roundNumber]
        );
        roundId = created.round_id;

        for (const item of cartItems) {
            await db.runAsync(
                `INSERT INTO order_items (round_id, food_id, quantity, unit_price, note, status)
                 VALUES (?, ?, ?, ?, ?, 'WAITING')`,
                [roundId, item.food.food_id, item.qty, item.food.price, item.note || null]
            );
        }
    });

    return { billId, roundId, roundNumber };
}

/**
 * ปิดบิลชั่วคราว + บันทึกการชำระเงิน
 * คืนยอดที่จ่ายจริง (0 ถ้าไม่มีบิลเปิดอยู่หรือไม่มีรายการให้จ่าย)
 */
export async function payQuickBill(db, paymentMethod = 'CASH') {
    const found = await findOpenQuickBill(db);
    if (!found) return 0;

    const { billId, tableId } = found;
    const { billTotal } = await getBillDetails(db, billId);
    if (billTotal === 0) return 0;

    const paidAt = new Date().toISOString();

    await db.runAsync(
        `INSERT INTO payments (bill_id, amount, payment_method, paid_at) VALUES (?, ?, ?, ?)`,
        [billId, billTotal, paymentMethod, paidAt]
    );

    // closeBill (จาก database.js) จะปิดบิลและคืนสถานะโต๊ะเป็น AVAILABLE ให้ในตัว
    await closeBill(db, billId, tableId);

    return billTotal;
}

/**
 * โหลดรายการที่ยืนยันแล้ว (ยังไม่จ่าย) ของบิลชั่วคราว
 * ใช้กู้ตะกร้าคืนตอนเปิดแอปใหม่ ให้หน้าตะกร้ายังเห็นรอบที่สั่งไปก่อนหน้า
 */
export async function loadOpenQuickBillOrders(db) {
    const found = await findOpenQuickBill(db);
    if (!found) return { rounds: [], billId: null };

    const { items } = await getBillDetails(db, found.billId);

    const roundMap = new Map();
    for (const row of items) {
        if (row.status === 'CANCELLED') continue;
        if (!roundMap.has(row.round_id)) {
            roundMap.set(row.round_id, {
                id: row.round_id,
                roundNumber: row.round_number,
                items: [],
            });
        }
        roundMap.get(row.round_id).items.push({
            key: `db-item-${row.item_id}`,
            food: {
                food_id: row.food_id,
                food_name: row.food_name,
                price: row.unit_price, // ราคา ณ ตอนสั่ง ไม่ใช่ราคาปัจจุบันของเมนู
            },
            qty: row.quantity,
            note: row.note || '',
        });
    }

    const rounds = Array.from(roundMap.values()).sort(
        (a, b) => a.roundNumber - b.roundNumber
    );

    return { rounds, billId: found.billId };
}