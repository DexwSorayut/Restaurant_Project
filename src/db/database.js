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


/**
 * สร้าง Database
 *
 * 1. โหลด schema.sql
 * 2. CREATE TABLE
 * 3. CREATE INDEX
 * 4. Seed ข้อมูลเริ่มต้น
 */
export async function initDB(db) {

    const schema = await loadSchema();


    // สร้าง Tables และ Indexes
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