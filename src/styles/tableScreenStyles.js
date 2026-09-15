import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    // พื้นหลังสีดำโปร่งใสของ Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    // กล่องหน้าต่างสำหรับเปิดโต๊ะ
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
    },

    // หัวข้อของ Modal
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },

    // ข้อความกำกับช่องกรอกจำนวนลูกค้า
    inputLabel: {
        marginBottom: 8,
    },

    // ช่องกรอกจำนวนลูกค้า
    customerInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 18,
        marginBottom: 15,
    },

    // ข้อความแสดงจำนวนลูกค้าสูงสุดของโต๊ะ
    capacityText: {
        marginBottom: 15,
        color: "#666",
    },

    // Container ของปุ่ม ยกเลิก / เปิดโต๊ะ
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },

    // ปุ่มยกเลิก
    cancelButton: {
        padding: 12,
    },

    // ปุ่มเปิดโต๊ะ
    openButton: {
        backgroundColor: "#222",
        padding: 12,
        borderRadius: 8,
    },

    // ตัวหนังสือบนปุ่มเปิดโต๊ะ
    openButtonText: {
        color: "white",
        fontWeight: "bold",
    },

});