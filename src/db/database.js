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

/** ดึงรายการอาหารที่ครัวยังต้องทำ เรียงจากออเดอร์เก่าสุดก่อน */
export function listOrders(db) {
    return db.getAllAsync(`
        SELECT
            oi.item_id,
            oi.quantity,
            oi.note,
            oi.status,

            f.food_name,

            r.round_id,
            r.round_number,
            r.ordered_at,

            t.table_number

        FROM order_items AS oi

        INNER JOIN order_rounds AS r
            ON r.round_id = oi.round_id

        INNER JOIN bills AS b
            ON b.bill_id = r.bill_id

        INNER JOIN tables AS t
            ON t.table_id = b.table_id

        INNER JOIN foods AS f
            ON f.food_id = oi.food_id

        WHERE oi.status IN ('WAITING', 'COOKING')
          AND b.status = 'OPEN'

        ORDER BY
            r.ordered_at ASC,
            r.round_id ASC,
            oi.item_id ASC
    `);
}