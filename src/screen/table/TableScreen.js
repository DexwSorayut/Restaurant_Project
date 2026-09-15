import { useEffect, useState } from "react";
import { ScrollView, Modal, View, Text, TextInput, Pressable } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import TableCard from "../../component/TableCard";
import { getTables, openTable } from "../../db/database";
import { styles } from "../../styles/tableScreenStyles";


const TableScreen = () => {

    const db = useSQLiteContext();

    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [customerCount, setCustomerCount] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    // โหลดข้อมูลจาก Database
    async function loadTables() {
        try {
            const data = await getTables(db);
            setTables(data);
        } catch (error) {
            console.error(
                "โหลดโต๊ะไม่สำเร็จ:",
                error
            );
        }
    }

    // โหลดข้อมูลครั้งแรกเมื่อเปิดหน้า
    useEffect(() => {
        loadTables();
    }, [db]);

    // ทำงานเมื่อผู้ใช้กดที่โต๊ะ
    const handleTablePress = (table) => {
        // ถ้าโต๊ะไม่ว่าง
        // ในอนาคตสามารถเปลี่ยนเป็นการเข้า Bill เดิมได้
        if (table.status === "OCCUPIED") {
            console.log(
                "เข้าโต๊ะเดิม:",
                table.table_number
            );
            return;
        }


        // เก็บข้อมูลโต๊ะที่เลือก
        setSelectedTable(table);

        // ล้างค่าจำนวนลูกค้าจากครั้งก่อน
        setCustomerCount("");

        // แสดงหน้าต่างเปิดโต๊ะ
        setModalVisible(true);
    };

    // ทำงานเมื่อกดปุ่ม "เปิดโต๊ะ"
    const handleOpenTable = async () => {
        // ป้องกันกรณีไม่มีโต๊ะที่เลือก
        if (!selectedTable) {
            return;
        }

        // แปลงค่าจำนวนลูกค้าจาก Text เป็น Number
        const count = Number(customerCount);

        // ตรวจสอบว่ากรอกจำนวนลูกค้าหรือไม่
        if (!count || count <= 0) {
            console.log(
                "กรุณากรอกจำนวนลูกค้า"
            );
            return;
        }

        // ตรวจสอบว่าจำนวนลูกค้าเกินความจุของโต๊ะหรือไม่
        if (count > selectedTable.capacity) {
            console.log(
                `โต๊ะนี้รับได้สูงสุด ${selectedTable.capacity} คน`
            );
            return;
        }
        try {
            // สร้าง Bill และเปลี่ยนสถานะโต๊ะเป็น OCCUPIED
            await openTable(
                db,
                selectedTable.table_id,
                count
            );
            // ปิด Modal
            setModalVisible(false);

            // ล้างโต๊ะที่เลือก
            setSelectedTable(null);

            // ล้างจำนวนลูกค้า
            setCustomerCount("");

            // โหลดข้อมูลโต๊ะใหม่
            // เพื่อให้สถานะโต๊ะเปลี่ยนเป็น "ไม่ว่าง"
            await loadTables();
            console.log(
                `เปิดโต๊ะ ${selectedTable.table_number} จำนวน ${count} คน`
            );
        } catch (error) {
            console.error(
                "เปิดโต๊ะไม่สำเร็จ:",
                error
            );

        }

    };

    // ทำงานเมื่อกดปุ่ม "ยกเลิก"
    const handleCancel = () => {
        // ปิด Modal
        setModalVisible(false);

        // ล้างโต๊ะที่เลือก
        setSelectedTable(null);

        // ล้างจำนวนลูกค้า
        setCustomerCount("");
    };

    return (
        <>
            <ScrollView
                contentContainerStyle={{
                    padding: 12,
                    paddingBottom: 30,
                }}
            >
                {tables.map((table) => (
                    <TableCard
                        key={table.table_id}
                        table={table}
                        onPress={handleTablePress}
                    />
                ))}
            </ScrollView>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            เปิดโต๊ะ {selectedTable?.table_number}
                        </Text>

                        <Text style={styles.inputLabel}>
                            จำนวนลูกค้า
                        </Text>

                        <TextInput
                            value={customerCount}
                            onChangeText={setCustomerCount}
                            keyboardType="number-pad"
                            placeholder="กรอกจำนวนลูกค้า"
                            style={styles.customerInput}
                        />

                        <Text style={styles.capacityText}>
                            รองรับสูงสุด{" "}
                            {selectedTable?.capacity ?? "-"} คน
                        </Text>

                        <View style={styles.buttonContainer}>

                            <Pressable
                                onPress={handleCancel}
                                style={styles.cancelButton}
                            >
                                <Text>ยกเลิก</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleOpenTable}
                                style={styles.openButton}
                            >
                                <Text style={styles.openButtonText}>
                                    เปิดโต๊ะ
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};


export default TableScreen;