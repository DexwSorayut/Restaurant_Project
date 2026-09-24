const CATEGORIES = [
    'อาหารจานเดียว',
    'ต้ม / แกง',
    'ผัด',
    'ยำ / สลัด',
    'เครื่องดื่ม'
];


const FOODS = [
    // =========================================
    // อาหารจานเดียว
    // =========================================
    ['ข้าวกะเพราไก่', 'อาหารจานเดียว', 6500 , 'kaprao_gai'],
    ['ข้าวกะเพราหมู', 'อาหารจานเดียว', 6500],
    ['ข้าวผัดไก่', 'อาหารจานเดียว', 6000],
    ['ข้าวผัดหมู', 'อาหารจานเดียว', 6000],
    ['ข้าวมันไก่', 'อาหารจานเดียว', 6000],

    // =========================================
    // ต้ม / แกง
    // =========================================
    ['ต้มยำกุ้ง', 'ต้ม / แกง', 9000],
    ['ต้มยำไก่', 'ต้ม / แกง', 8000],
    ['ต้มจืดเต้าหู้หมูสับ', 'ต้ม / แกง', 7500],
    ['แกงเขียวหวานไก่', 'ต้ม / แกง', 8500],
    ['แกงจืดสาหร่ายหมูสับ', 'ต้ม / แกง', 7500],

    // =========================================
    // ผัด
    // =========================================
    ['ผัดคะน้าหมู', 'ผัด', 7000],
    ['ผัดผักรวม', 'ผัด', 6500],
    ['ผัดพริกแกงไก่', 'ผัด', 7000],
    ['ผัดกระเทียมหมู', 'ผัด', 7000],
    ['ผัดซีอิ๊วหมู', 'ผัด', 6500],

    // =========================================
    // ยำ / สลัด
    // =========================================
    ['ยำวุ้นเส้น', 'ยำ / สลัด', 7500],
    ['ยำหมูยอ', 'ยำ / สลัด', 7500],
    ['ยำทะเล', 'ยำ / สลัด', 9500],
    ['สลัดผัก', 'ยำ / สลัด', 6500],
    ['สลัดไก่ย่าง', 'ยำ / สลัด', 8500],

    // =========================================
    // เครื่องดื่ม
    // =========================================
    ['น้ำเปล่า', 'เครื่องดื่ม', 1000],
    ['น้ำอัดลม', 'เครื่องดื่ม', 2000],
    ['ชาเย็น', 'เครื่องดื่ม', 3500],
    ['กาแฟเย็น', 'เครื่องดื่ม', 4000],
    ['น้ำมะนาว', 'เครื่องดื่ม', 3500]
];


const TABLE_COUNT = 15;


/**
 * Seed ข้อมูลเริ่มต้น
 *
 * ทำงานเฉพาะกรณีที่ยังไม่มี category
 * ดังนั้นเปิด App ครั้งต่อไปจะไม่เพิ่มข้อมูลซ้ำ
 */
export async function seedDatabase(db) {

    const result = await db.getFirstAsync(`
        SELECT COUNT(*) AS count
        FROM categories
    `);

    const categoryCount = Number(result?.count ?? 0);

    // ถ้ามีข้อมูลอยู่แล้ว ไม่ต้อง Seed ซ้ำ
    if (categoryCount > 0) {
        return;
    }


    // =========================================
    // ใช้ Transaction
    // =========================================
    await db.withTransactionAsync(async () => {

        // =========================================
        // Insert Categories
        // =========================================
        const categoryIds = new Map();

        for (const categoryName of CATEGORIES) {

            await db.runAsync(
                `
                INSERT INTO categories (
                    category_name,
                    status
                )
                VALUES (?, 'ACTIVE')
                `,
                [categoryName]
            );


            const category = await db.getFirstAsync(
                `
                SELECT category_id
                FROM categories
                WHERE category_name = ?
                `,
                [categoryName]
            );


            categoryIds.set(
                categoryName,
                category.category_id
            );
        }


        // =========================================
        // Insert Foods
        // =========================================
        for (const [foodName, categoryName, price, image] of FOODS) {

            const categoryId =
                categoryIds.get(categoryName);


            await db.runAsync(
                `
                INSERT INTO foods (
                    category_id,
                    food_name,
                    price,
                    image,
                    status
                )
                VALUES (?, ?, ?, ?, 'AVAILABLE')
                `,
                [
                    categoryId,
                    foodName,
                    price,
                    image
                ]
            );
        }


        // =========================================
        // Insert 15 Tables
        // =========================================
        for (
            let tableNumber = 1;
            tableNumber <= TABLE_COUNT;
            tableNumber++
        ) {

            // ตัวอย่าง:
            // โต๊ะ 1-10 รองรับ 4 คน
            // โต๊ะ 11-15 รองรับ 6 คน
            const capacity =
                tableNumber <= 10 ? 4 : 6;


            await db.runAsync(
                `
                INSERT INTO tables (
                    table_number,
                    capacity,
                    status
                )
                VALUES (?, ?, 'AVAILABLE')
                `,
                [
                    tableNumber,
                    capacity
                ]
            );
        }
    });
}


/**
 * Reset ข้อมูลการขาย
 *
 * ลบเฉพาะ:
 * - order_items
 * - order_rounds
 * - bills
 *
 * ไม่ลบ:
 * - categories
 * - foods
 * - tables
 */
export async function resetSalesData(db) {

    await db.withTransactionAsync(async () => {

        await db.runAsync(`
            DELETE FROM order_items
        `);


        await db.runAsync(`
            DELETE FROM order_rounds
        `);


        await db.runAsync(`
            DELETE FROM bills
        `);


        // ทำให้โต๊ะทั้งหมดกลับมาเป็น AVAILABLE
        await db.runAsync(`
            UPDATE tables
            SET status = 'AVAILABLE'
        `);
    });
}