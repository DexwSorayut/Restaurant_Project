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
    ['ข้าวกะเพราไก่', 'อาหารจานเดียว', 6000 , 'ข้าวกระเพราไก่.jpg'],
    ['ข้าวกะเพราหมู', 'อาหารจานเดียว', 6500, 'ข้าวกะเพราหมู.jpg'],
    ['ข้าวผัดไก่', 'อาหารจานเดียว', 6000, 'ข้าวผัดไก่.jpg'],
    ['ข้าวผัดหมู', 'อาหารจานเดียว', 6000, 'ข้าวผัดหมู.jpg'],
    ['ข้าวมันไก่', 'อาหารจานเดียว', 6000, 'ข้าวมันไก่.jpg'],

    // =========================================
    // ต้ม / แกง
    // =========================================
    ['ต้มยำกุ้ง', 'ต้ม / แกง', 9000, 'ต้มยำกุ้ง.jpg'],
    ['ต้มยำไก่', 'ต้ม / แกง', 8000, 'ต้มยำไก่.jpg'],
    ['ต้มจืดเต้าหู้หมูสับ', 'ต้ม / แกง', 7500, 'ต้มจืดเต้าหู้หมูสับ.jpg'],
    ['แกงเขียวหวานไก่', 'ต้ม / แกง', 8500, 'แกงเขียวหวานไก่.jpeg'],
    ['แกงจืดสาหร่ายหมูสับ', 'ต้ม / แกง', 7500, 'แกงจืดสาหร่ายหมูสัป.jpeg'],

    // =========================================
    // ผัด
    // =========================================
    ['ผัดคะน้าหมู', 'ผัด', 7000, 'ผัดผัดคะน้า.jpg'],
    ['ผัดผักรวม', 'ผัด', 6500, 'ผัดผักรวม.jpg'],
    ['ผัดพริกแกงไก่', 'ผัด', 7000, 'ผัดพริกแกงไก่.jpg'],
    ['ผัดหมูกระเทียม', 'ผัด', 7000, 'หมูกระเทียม.jpg'],
    ['ผัดซีอิ๊วหมู', 'ผัด', 6500, 'ผัดซีอิ๋ว.jpg'],

    // =========================================
    // ยำ / สลัด
    // =========================================
   ['ยำวุ้นเส้น', 'ยำ / สลัด', 7500, 'ยำวุ้นเส้น.jpg'],
    ['ยำหมูยอ', 'ยำ / สลัด', 7500, 'ยำหมูยอ.jpg'],
    ['ยำทะเล', 'ยำ / สลัด', 9500, 'ยำทะเล.jpg'],
    ['สลัดผัก', 'ยำ / สลัด', 6500, 'ผักสลัด.jpg'],
    ['สลัดไก่ย่าง', 'ยำ / สลัด', 8500, 'สลัดไก่ย่าง.jpg'],

    // =========================================
    // เครื่องดื่ม
    // =========================================
    ['น้ำเปล่า', 'เครื่องดื่ม', 1000, 'น้ำเปล่า.jpg'],
    ['น้ำอัดลม', 'เครื่องดื่ม', 2000, 'น้ำอัดลม.jpg'],
    ['ชาเย็น', 'เครื่องดื่ม', 3500, 'ชาเย็ย.jpg'],
    ['กาแฟเย็น', 'เครื่องดื่ม', 4000, 'กาแฟ.jpg'],
    ['น้ำมะนาว', 'เครื่องดื่ม', 3500, 'มะนาว.png']
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

/**
 * อัปเดตราคาและรูปของเมนูให้ตรงกับ FOODS ด้านบน
 *
 * เรียกทุกครั้งที่เปิดแอป แก้ราคาใน seed แล้วรีแอป ราคาก็เปลี่ยนตาม
 * บิลเก่าไม่กระทบ เพราะบิลใช้ราคาที่จดไว้ใน order_items.unit_price
 */
export async function syncFoodData(db) {
    await db.withTransactionAsync(async () => {
        for (const [foodName, , price, image] of FOODS) {
            await db.runAsync(
                `
                UPDATE foods
                SET price = ?,
                    image = COALESCE(?, image)   -- ถ้าไม่ได้ใส่รูป ใช้รูปเดิม
                WHERE food_name = ?
                `,
                [price, image || null, foodName]
            );
        }
    });
}

// เก็บชื่อเดิมไว้ เผื่อมีไฟล์อื่น (เช่น App.js) เรียกใช้อยู่ จะได้ไม่พัง
export const syncFoodImages = syncFoodData;