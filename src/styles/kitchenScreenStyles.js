import { StyleSheet } from 'react-native';
import { colors, topInset } from './theme';

export const styles = StyleSheet.create({
    // ===== โครงหลัก =====
    kitchenRoot: {
        flex: 1,
        backgroundColor: colors.bg,
    },

    // ===== แถบฟ้าด้านบน =====
    kitchenHeader: {
        paddingTop: topInset + 12,
        paddingBottom: 16,
        paddingLeft: 20,
        paddingRight: 80,                // เว้นที่ให้ปุ่มเฟือง
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
    kitchenHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    // กล่องรวมปุ่มขวา (สรุปยอดขาย + กลับ)
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButtonGap: {
        marginLeft: 10,
    },
    backButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '600',
    },

    // ส่วนล่างแถบฟ้า: ซ้าย = แท็บสถานะ, ขวา = ออเดอร์ (เรียงแนวนอน)
    kitchenBody: {
        flex: 1,
        flexDirection: 'row',
    },

    // ===== แถบสถานะด้านซ้าย =====
    sidebar: {
        width: 200,
        flexGrow: 0,                     // ไม่ให้ยืดกินพื้นที่ฝั่งขวา
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 4,
    },
    // แท็บที่ถูกเลือก: พื้นฟ้าอ่อน
    categoryItemActive: {
        backgroundColor: '#eef4ff',
    },
    categoryText: {
        fontSize: 15,
        color: '#555',
    },
    categoryTextActive: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    // วงกลมตัวเลขจำนวนรายการ
    categoryCount: {
        minWidth: 24,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        alignItems: 'center',
    },
    categoryCountText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },

    // ===== พื้นที่ออเดอร์ด้านขวา =====
    mainArea: {
        flex: 1,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    kitchenList: {
        padding: 16,
    },
    // ใบออเดอร์ 2 คอลัมน์
    ticketGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    // ===== ใบออเดอร์ =====
    ticketCard: {
        width: '48.5%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    ticketTableText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
    },
    ticketSubText: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    ticketTimeText: {
        fontSize: 14,
        color: '#888',
    },

    // ===== รายการอาหารในใบ =====
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    itemInfo: {
        flex: 1,
        marginRight: 10,
    },
    itemFoodName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.black,
    },
    // ชื่ออาหารที่ถูกยกเลิก: ขีดฆ่า + สีจาง
    itemFoodNameCancelled: {
        textDecorationLine: 'line-through',
        color: '#aaa',
    },
    itemNote: {
        fontSize: 13,
        color: '#e67e22',
        marginTop: 2,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
        marginTop: 6,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },

    // ===== ปุ่มในแต่ละรายการ =====
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: colors.green,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    // ปุ่มยกเลิก: ขอบแดง พื้นขาว
    cancelButton: {
        marginLeft: 8,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ef4444',
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        color: '#ef4444',
        fontWeight: '600',
    },
    // ปุ่มจางลงตอนกำลังบันทึก
    actionButtonDisabled: {
        opacity: 0.5,
    },

    // ===== ตอนไม่มีข้อมูล =====
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});