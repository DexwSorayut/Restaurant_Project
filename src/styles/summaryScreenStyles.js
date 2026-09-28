import { StyleSheet } from 'react-native';
import { colors, topInset } from './theme';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },

    // =========================
    // Header
    // =========================

    header: {
        paddingTop: topInset + 12,
        paddingBottom: 16,
        paddingLeft: 20,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },

    headertitle: {
        color: colors.white,
        fontSize: 24,
        fontWeight: '700',
    },

    backButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.primaryLight,
    },

    backButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },

    // =========================
    // Body
    // =========================

    Body: {
        flex: 1,
        flexDirection: 'row',
    },

    // =========================
    // Sidebar
    // =========================

    sidebar: {
        width: 200,
        flexGrow: 0,
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

    sidebarButton: {
        minHeight: 52,
        paddingHorizontal: 15,
        marginBottom: 8,
        borderRadius: 10,
        justifyContent: 'center',
    },

    sidebarButtonActive: {
        backgroundColor: colors.primaryLight,
    },

    sidebarButtonText: {
        color: colors.text2,
        fontSize: 16,
        fontWeight: '500',
    },

    sidebarButtonTextActive: {
        color: colors.primary,
        fontWeight: '700',
    },

    // =========================
    // Content
    // =========================

    content: {
        flex: 1,
        padding: 20,
    },

    // =========================
    // Summary Layout
    // =========================

    summaryLayout: {
        flex: 1,
        flexDirection: 'row',
        gap: 20,
    },

    // =========================
    // 60% - Summary Result
    // =========================

    summaryResult: {
        flex: 5,
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
    },

    summaryResultScroll: {
        flex: 1,
    },

    summaryResultContent: {
        padding: 20,
        flexGrow: 1,
    },

    // =========================
    // Empty State
    // =========================

    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyStateText: {
        fontSize: 20,
        color: colors.dim,
        fontWeight: '500',
    },

    // =========================
    // Section
    // =========================

    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 20,
    },

    // =========================
    // Food Table
    // =========================

    foodSummaryHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#D1D5DB',
    },

    foodSummaryRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },

    foodSummaryText: {
        fontSize: 16,
        color: colors.black,
    },

    foodNameColumn: {
        flex: 5,
    },

    foodQtyColumn: {
        flex: 2,
        textAlign: 'center',
    },

    foodAmountColumn: {
        flex: 3,
        textAlign: 'right',
    },

    // =========================
    // Bottom Summary Bar
    // =========================

    summaryBottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#D1D5DB',
        backgroundColor: '#F9FAFB',
    },

    summaryBottomLabel: {
        fontSize: 14,
        color: colors.dim,
    },

    summaryBottomValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
        marginTop: 3,
    },

    // =========================
    // 40% - Filter
    // =========================

    summaryFilter: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
    },

    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },

    dateInput: {
        height: 48,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 12,
        marginBottom: 15,
    },

    summaryButton: {
        height: 50,
        borderRadius: 8,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    summaryButtonText: {
        color: colors.white,
        fontSize: 17,
        fontWeight: 'bold',
    },
    addonSummaryText: {
        fontSize: 14,
        color: colors.dim,
        marginTop: 4,
        marginLeft: 8,
    },

    billScreen: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
    },

    billFilterRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },

    billSearchBox: {
        flex: 6,
    },

    billTableFilter: {
        flex: 4,
    },

    billFilterLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },

    billInput: {
        height: 48,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 12,
        backgroundColor: colors.white,
    },

    billInputText: {
        fontSize: 16,
        color: colors.dim,
    },

    billList: {
        flex: 1,
    },

    billListContent: {
        paddingBottom: 20,
    },

    billRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 72,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        backgroundColor: colors.white,
    },

    billMainInfo: {
        flex: 4,
    },

    billNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
    },

    billTable: {
        fontSize: 15,
        color: colors.dim,
        marginTop: 4,
    },

    billTimeInfo: {
        flex: 3,
    },

    billDate: {
        fontSize: 15,
        color: colors.black,
    },

    billTime: {
        fontSize: 14,
        color: colors.dim,
        marginTop: 3,
    },

    billAmount: {
        flex: 2,
        textAlign: 'right',
        fontSize: 17,
        fontWeight: '700',
        color: colors.black,
    },

});