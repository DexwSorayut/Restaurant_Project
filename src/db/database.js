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
            b.bill_number,
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

        // หาเลขบิลล่าสุด
        const lastBill = await db.getFirstAsync(`
            SELECT
                COALESCE(MAX(bill_number), 1000) AS last_bill_number
            FROM bills
        `);

        const billNumber =
            Number(lastBill?.last_bill_number ?? 1000) + 1;

        // สร้างบิล
        await db.runAsync(
            `
            INSERT INTO bills (
                bill_number,
                table_id,
                customer_count,
                opened_at,
                status
            )
            VALUES (?, ?, ?, ?, 'OPEN')
            `,
            [
                billNumber,
                tableId,
                customerCount,
                openedAt
            ]
        );

        // เปลี่ยนสถานะโต๊ะ
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

        const totalAmount = Number(
            totalResult?.bill_total ?? 0
        );

        await db.runAsync(
            `
            UPDATE bills
            SET
                status = 'CLOSED',
                closed_at = ?,
                total_amount = ?
            WHERE bill_id = ?
              AND status = 'OPEN'
            `,
            [
                closedAt,
                totalAmount,
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

/** บันทึกรายการที่กด "สั่งอาหาร" */
export async function placeOrderRound(
    db,
    billId,
    cartItems
) {
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

export async function getSummary(
    db,
    startDateTime,
    endDateTime
) {
    // =========================
    // ยอดขาย + จำนวนบิล
    // =========================
    const salesResult = await db.getFirstAsync(
        `
        SELECT
            COALESCE(
                SUM(total_amount),
                0
            ) AS total_sales,

            COUNT(*) AS total_bills

        FROM bills

        WHERE status = 'CLOSED'
          AND closed_at >= ?
          AND closed_at <= ?
        `,
        [
            startDateTime,
            endDateTime
        ]
    );


    // =========================
    // จำนวนอาหารทั้งหมด
    // =========================
    const itemResult = await db.getFirstAsync(
        `
        SELECT
            COALESCE(
                SUM(oi.quantity),
                0
            ) AS total_items

        FROM bills AS b

        INNER JOIN order_rounds AS r
            ON r.bill_id = b.bill_id

        INNER JOIN order_items AS oi
            ON oi.round_id = r.round_id

        WHERE b.status = 'CLOSED'
          AND b.closed_at >= ?
          AND b.closed_at <= ?
          AND oi.status != 'CANCELLED'
        `,
        [
            startDateTime,
            endDateTime
        ]
    );


    // =========================
    // ยอดขายแยกตามอาหาร
    // =========================
    const foodResult = await db.getAllAsync(
        `
        SELECT
            f.food_id,
            f.food_name,

            SUM(oi.quantity) AS quantity,

            SUM(
                oi.quantity * oi.unit_price
            ) AS total_amount

        FROM bills AS b

        INNER JOIN order_rounds AS r
            ON r.bill_id = b.bill_id

        INNER JOIN order_items AS oi
            ON oi.round_id = r.round_id

        INNER JOIN foods AS f
            ON f.food_id = oi.food_id

        WHERE b.status = 'CLOSED'
          AND b.closed_at >= ?
          AND b.closed_at <= ?
          AND oi.status != 'CANCELLED'

        GROUP BY
            f.food_id,
            f.food_name

        ORDER BY
            quantity DESC
        `,
        [
            startDateTime,
            endDateTime
        ]
    );


    // =========================
    // ดึง Addon จากรายการอาหาร
    // =========================
    const addonResult = await db.getAllAsync(
        `
        SELECT
            f.food_id,
            oi.item_id,
            oi.quantity,
            oi.note

        FROM bills AS b

        INNER JOIN order_rounds AS r
            ON r.bill_id = b.bill_id

        INNER JOIN order_items AS oi
            ON oi.round_id = r.round_id

        INNER JOIN foods AS f
            ON f.food_id = oi.food_id

        WHERE b.status = 'CLOSED'
          AND b.closed_at >= ?
          AND b.closed_at <= ?
          AND oi.status != 'CANCELLED'
          AND oi.note IS NOT NULL
        `,
        [
            startDateTime,
            endDateTime
        ]
    );


    // =========================
    // รายการ Addon ที่ระบบมี
    // =========================
    const addonNames = [
        'ไข่ดาว',
        'ข้าวเพิ่ม',
        'พิเศษ'
    ];


    // =========================
    // รวม Addon แยกตามอาหาร
    // =========================
    const addonMap = {};

    for (const row of addonResult) {

        if (!row.note) {
            continue;
        }

        const foodId = row.food_id;

        if (!addonMap[foodId]) {
            addonMap[foodId] = {};
        }

        for (const addonName of addonNames) {

            const regex = new RegExp(
                `\\+${addonName} x(\\d+)`
            );

            const match = row.note.match(regex);

            if (!match) {
                continue;
            }

            const quantity = Number(
                match[1]
            );

            if (!addonMap[foodId][addonName]) {
                addonMap[foodId][addonName] = 0;
            }

            addonMap[foodId][addonName] += quantity;
        }
    }


    // =========================
    // ส่งข้อมูลกลับ
    // =========================
    return {

        totalSales: Number(
            salesResult?.total_sales ?? 0
        ),

        totalBills: Number(
            salesResult?.total_bills ?? 0
        ),

        totalItems: Number(
            itemResult?.total_items ?? 0
        ),

        foodSales: foodResult.map(item => {

            const addons =
                addonMap[item.food_id] || {};

            return {

                foodId: item.food_id,

                foodName: item.food_name,

                quantity: Number(
                    item.quantity ?? 0
                ),

                totalAmount: Number(
                    item.total_amount ?? 0
                ),

                addons: Object.entries(
                    addons
                ).map(
                    ([name, quantity]) => ({
                        name,
                        quantity
                    })
                )
            };
        })
    };
}

export async function listClosedBills(db) {
    return db.getAllAsync(`
        SELECT
            b.bill_id,
            b.bill_number,
            b.table_id,
            t.table_number,
            b.customer_count,
            b.opened_at,
            b.closed_at,
            b.total_amount,
            p.payment_method,
            p.paid_at

        FROM bills AS b

        INNER JOIN tables AS t
            ON t.table_id = b.table_id

        LEFT JOIN payments AS p
            ON p.bill_id = b.bill_id

        WHERE b.status = 'CLOSED'

        ORDER BY
            b.closed_at DESC
    `);
}

export async function getClosedBillDetail(db, billId) {

    const bill = await db.getFirstAsync(`
        SELECT
            b.bill_id,
            b.bill_number,
            b.table_id,
            t.table_number,
            b.customer_count,
            b.opened_at,
            b.closed_at,
            b.total_amount,
            p.payment_method,
            p.paid_at

        FROM bills AS b

        INNER JOIN tables AS t
            ON t.table_id = b.table_id

        LEFT JOIN payments AS p
            ON p.bill_id = b.bill_id

        WHERE b.bill_id = ?
          AND b.status = 'CLOSED'
    `, [billId]);


    const items = await db.getAllAsync(`
        SELECT
            r.round_id,
            r.round_number,
            r.ordered_at,

            oi.item_id,
            oi.food_id,
            f.food_name,
            oi.quantity,
            oi.unit_price,
            oi.note,
            oi.status

        FROM order_rounds AS r

        INNER JOIN order_items AS oi
            ON oi.round_id = r.round_id

        INNER JOIN foods AS f
            ON f.food_id = oi.food_id

        WHERE r.bill_id = ?

        ORDER BY
            r.round_number ASC,
            oi.item_id ASC
    `, [billId]);


    return {
        bill,
        items
    };
}