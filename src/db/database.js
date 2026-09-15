import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

import { seedDatabase } from './seed';

export const DATABASE_NAME = 'restaurant.db';


/**
 * อ่าน schema.sql
 */
async function loadSchema() {

    const asset = Asset.fromModule(
        require('./schema.sql')
    );


    await asset.downloadAsync();


    if (!asset.localUri) {
        throw new Error(
            'Unable to load schema.sql'
        );
    }


    return FileSystem.readAsStringAsync(
        asset.localUri
    );
}


export async function initDB(db) {
    // โหลด schema.sql
    const schema = await loadSchema();

    // สร้างตารางทั้งหมด
    await db.execAsync(schema);

    // เพิ่มข้อมูลเริ่มต้น
    await seedDatabase(db);
}

/**
 * ตรวจสอบว่ามีข้อมูลใน Database แล้วหรือยัง
 */
export async function isDatabaseSeeded(db) {

    const result = await db.getFirstAsync(`
        SELECT COUNT(*) AS count
        FROM categories
    `);


    return Number(result?.count ?? 0) > 0;
}


/**
 * ดึงรายการอาหารที่สามารถขายได้
 */
export function listFoods(db) {

    return db.getAllAsync(`
        SELECT
            f.food_id,
            f.food_name,
            f.price,
            f.status,
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


/**
 * ค้นหา OPEN BILL ของโต๊ะ
 */
export function getOpenBillByTable(
    db,
    tableId
) {

    return db.getFirstAsync(
        `
        SELECT
            bill_id,
            table_id,
            opened_at,
            closed_at,
            status

        FROM bills

        WHERE table_id = ?
          AND status = 'OPEN'

        LIMIT 1
        `,
        [tableId]
    );
}

export async function getTables(db) {
    return await db.getAllAsync(`
        SELECT
            t.table_id,
            t.table_number,
            t.capacity,
            t.status,

            b.bill_id,
            b.customer_count,
            b.opened_at

        FROM tables t

        LEFT JOIN bills b
            ON t.table_id = b.table_id
            AND b.status = 'OPEN'

        ORDER BY t.table_number ASC;
    `);
}

export async function openTable(
    db,
    tableId,
    customerCount
) {
    const openedAt = new Date().toISOString();

    await db.withTransactionAsync(async () => {

        // สร้าง Bill ใหม่สำหรับโต๊ะ
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

        // เปลี่ยนสถานะโต๊ะเป็น OCCUPIED
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