import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { seedDatabase } from './seed';

export const DATABASE_NAME = 'restaurant.db';

/** โหลด schema.sql */
async function loadSchema() {
    const asset = Asset.fromModule(
        require('./schema.sql')
    );
    await asset.downloadAsync();
    if (!asset.localUri) {
        throw new Error('Unable to load schema.sql');
    }
    return FileSystem.readAsStringAsync(
        asset.localUri
    );
}

/** เริ่มต้น Database */
export async function initDB(db) {
    const schema = await loadSchema();
    await db.execAsync(schema);
    await seedDatabase(db);
}

/** ตรวจสอบว่ามีข้อมูลเริ่มต้นแล้วหรือยัง */
export async function isDatabaseSeeded(db) {
    const result = await db.getFirstAsync(`
        SELECT COUNT(*) AS count
        FROM categories
    `);
    return Number(result?.count ?? 0) > 0;
}

/** ดึงรายการอาหารที่สามารถขายได้ */
export function listFoods(db) {
    return db.getAllAsync(`
        SELECT
            f.food_id,
            f.food_name,
            f.price,
            f.image,
            f.description,
            c.category_id,
            c.category_name

        FROM foods AS f

        INNER JOIN categories AS c
            ON f.category_id = c.category_id

        WHERE f.status = 'AVAILABLE'
          AND c.status = 'ACTIVE'

        ORDER BY
            c.category_id,
            f.food_name
    `);
}

/** ดึงข้อมูลโต๊ะทั้งหมด พร้อมข้อมูล OPEN BILL ถ้ามี */
export function getTables(db) {
    return db.getAllAsync(`
        SELECT
            t.table_id,
            t.table_number,
            t.capacity,
            t.status,

            b.bill_id,
            b.customer_count,
            b.opened_at

        FROM tables AS t

        LEFT JOIN bills AS b
            ON t.table_id = b.table_id
            AND b.status = 'OPEN'

        ORDER BY t.table_number ASC
    `);
}


/** เปิดโต๊ะ */
export async function openTable(
    db,
    tableId,
    customerCount
) {
    const openedAt = new Date().toISOString();
    await db.withTransactionAsync(async () => {
        await db.runAsync(
            `
            INSERT INTO bills (
                table_id,
                customer_count,
                opened_at,
                status
            )
            VALUES (?, ?, ?, 'OPEN')
            `,
            [
                tableId,
                customerCount,
                openedAt
            ]
        );

        await db.runAsync(
            `
            UPDATE tables
            SET status = 'OCCUPIED'
            WHERE table_id = ?
            `,
            [tableId]
        );
    });
}


/** ปิดบิล */
export async function closeBill(
    db,
    billId,
    tableId
) {
    const closedAt = new Date().toISOString();
    await db.withTransactionAsync(async () => {
        await db.runAsync(
            `
            UPDATE bills
            SET
                status = 'CLOSED',
                closed_at = ?
            WHERE bill_id = ?
              AND status = 'OPEN'
            `,
            [
                closedAt,
                billId
            ]
        );

        await db.runAsync(
            `
            UPDATE tables
            SET status = 'AVAILABLE'
            WHERE table_id = ?
            `,
            [tableId]
        );
    });
}


/** ดึงรายการอาหารในบิล */
export async function getBillDetails(
    db,
    billId
) {
    const items = await db.getAllAsync(
        `
        SELECT
            r.round_id,
            r.round_number,
            r.ordered_at,

            oi.item_id,
            oi.quantity,
            oi.unit_price,
            oi.note,
            oi.status,

            f.food_id,
            f.food_name,

            (oi.quantity * oi.unit_price)
                AS item_total

        FROM order_rounds AS r

        INNER JOIN order_items AS oi
            ON oi.round_id = r.round_id

        INNER JOIN foods AS f
            ON f.food_id = oi.food_id

        WHERE r.bill_id = ?

        ORDER BY
            r.round_number ASC,
            oi.item_id ASC
        `,
        [billId]
    );

    const totalResult = await db.getFirstAsync(
        `
        SELECT
            COALESCE(
                SUM(
                    oi.quantity * oi.unit_price
                ),
                0
            ) AS bill_total

        FROM order_rounds AS r

        INNER JOIN order_items AS oi
            ON oi.round_id = r.round_id

        WHERE r.bill_id = ?
          AND oi.status != 'CANCELLED'
        `,
        [billId]
    );

    return {
        items,
        billTotal: Number(
            totalResult?.bill_total ?? 0
        )
    };
}

export function listCategories(db) {
    return db.getAllAsync(`
        SELECT
            category_id,
            category_name
        FROM categories
        WHERE status = 'ACTIVE'
        ORDER BY category_id ASC
    `);
}

/** ดึงรายการอาหารสำหรับหน้าครัว */
export function listOrders(db) {
    return db.getAllAsync(`
        SELECT
            oi.item_id,
            oi.quantity,
            oi.note,
            oi.status,

            f.food_id,
            f.food_name,

            r.round_id,
            r.round_number,
            r.ordered_at,

            b.bill_id,
            t.table_number

        FROM order_items AS oi

        INNER JOIN foods AS f
            ON oi.food_id = f.food_id

        INNER JOIN order_rounds AS r
            ON oi.round_id = r.round_id

        INNER JOIN bills AS b
            ON r.bill_id = b.bill_id

        INNER JOIN tables AS t
            ON b.table_id = t.table_id

        WHERE b.status = 'OPEN'

        ORDER BY
            r.ordered_at ASC,
            oi.item_id ASC
    `);
}

/** เปลี่ยนสถานะรายการอาหาร */
export function updateOrderItemStatus(
    db,
    itemId,
    status
) {
    return db.runAsync(
        `
        UPDATE order_items
        SET status = ?
        WHERE item_id = ?
        `,
        [
            status,
            itemId
        ]
    );
}

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