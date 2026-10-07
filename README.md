Groupwork Restaurant Order
Group Name : Tam yang ngai

1. รายชื่อสมาชิก และหน้าที่
    หัวหน้ากลุ่ม: สรยุทธ ใจสมบูรณ์ 6721651874 , หน้าที่ : ออกแบบโครงสร้างฐานข้อมูล และ หน้า UI หลักๆ ;
    สมาชิก 1: ชัญญานุช สุทธิบุตร 6721651246 , หน้าที่ : ออกแบบ Component บนหน้าต่าง และ นำข้อมูลอาหารมาใส่ ;
    สมาชิก 2: ฐิติพันธ์ ศรีสวย 6721651262 , หน้าที่ : จัดการระบบเสริม เช่น การกรองข้อมูล การค้นหาเมนู ;
    สมาชิก 3: พิชชานันท์ อนาถ 6721651629 , หน้าที่ : เบื้องหลังระบบครัว การเรียกข้อมูล ออกแบบหลักการทำงานของหน้าต่างทุกหน้า ; 

2. Link YouTube Presentation :


3. Link Github Repositories :
    https://github.com/DexwSorayut/Restaurant_Project

4. SetUp :
    1. Download Group_03_RestaurantOrder.zip and Extract folder.
    2. Open floder on Visual Studio Code.
    3. Download Android Studio(https://developer.android.com/studio?hl=th) and install it.
    4. In Android Studio click More Actions and choose Virtual Device Manager.
    5. Press " + " button add new device select tablet and choose Pixel Tablet.
    - System Image : Google Play Tablet Intel x86_64 Atom System Image .
    - Press " Next " to install and start emulator.
    6. Open Terminal and goto folder Group_03_RestaurantOrder in terminal.
    7. Check nodejs and npm version use command :
    - nodejs : node -v 
    - npm : npm -v
    8. Use this command in terminal " npm install " to download the packages used by this project. 
    9. IF everything is installed, Can run the " npm run android " command (Make sure the emulator is running).

5. Library use : 
    1. expo : npm install 
    - หน้าที่ : เตรียมทุกอย่างที่โปรเจกค์นี้ต้องใช้งาน ก่อนที่จะเริ่มการทำงาน
    2. SQLite : npx expo install expo-sqlite
    - หน้าที่ : เป็นฐานข้อมูลที่เก็บไว้ในเครื่องที่ทำงาน (ในที่นี้คือ emulator)
    3. DateTimePicker : npx expo install @react-native-community/datetimepicker
    - หน้าที่ : ทำให้ emulator ทำงานเกี่ยวกับเวลาได้ (เลือกช่วงเวลาในการดึงข้อมูลบิลต่างๆ)

6. สิ่งที่ทำครบ
    ระดับ ก :
    1. เลือกโต๊ะ เปิดบิลใหม่ และเข้าดูบิลที่เปิดอยู่ได้
    2. มีหมวดหมู่ 4 หมวดและเมนูทั้งหมด 25 เมนู
    3. เลือกจำนวนแต่ละรายการได้ และเลือกหมายเหตุได้
    4. เพิ่มของลงตะกร้าก่อน และส่งเข้าครัวเป็นรอบเดียว
    5. โต๊ะเดิมสามารถสั่งเพิ่มได้ โดยจะเป็นรอบบิลใหม่ แต่บิลสรุปจะเป้นบิลเดียวกัน
    6. สรุปบิลทุกรอบ แสดงยอดเงิน รายการอาหาร จำนวนที่สั่ง
    7. 
    8. 
    9. 
    10. 
