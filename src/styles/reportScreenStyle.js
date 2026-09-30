import { StyleSheet } from 'react-native';
import { colors, topInset } from './theme';

export const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: topInset,
    },
    header: {
        height: 70,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headertitle: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '700',
    },
    backButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.white,
    },
    backButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },

    // main layout: sidebar + content, side by side
    Body: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 220,
        padding: 20,
        backgroundColor: colors.surface,
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    sidebarTitle: {
        color: colors.text1,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
    },
    sidebarButton: {
        minHeight: 48,
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
        fontSize: 15,
        fontWeight: '500',
    },
    sidebarButtonTextActive: {
        color: colors.primary,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        padding: 20,
    },

    // summary tab: result list (left) + filter panel (right)
    summaryLayout: {
        flex: 1,
        flexDirection: 'row',
        gap: 20,
    },
    summaryResult: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    summaryResultScroll: {
        flex: 1,
    },
    summaryResultContent: {
        padding: 16,
        paddingBottom: 90,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyStateText: {
        color: colors.text3,
        fontSize: 15,
    },
    sectionTitle: {
        color: colors.text1,
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 12,
    },
    foodSummaryHeader: {
        flexDirection: 'row',
        paddingBottom: 10,
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    foodSummaryRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    foodSummaryText: {
        color: colors.text1,
        fontSize: 14,
    },
    foodNameColumn: {
        flex: 2,
    },
    foodQtyColumn: {
        flex: 1,
        textAlign: 'center',
    },
    foodAmountColumn: {
        flex: 1,
        textAlign: 'right',
        fontWeight: '600',
    },
    addonSummaryText: {
        color: colors.text3,
        fontSize: 12.5,
        marginTop: 2,
    },
    summaryBottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    summaryBottomLabel: {
        color: colors.text3,
        fontSize: 13,
        marginBottom: 2,
    },
    summaryBottomValue: {
        color: colors.text1,
        fontSize: 18,
        fontWeight: '700',
    },

    // filter panel
    summaryFilter: {
        width: 260,
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
    },
    filterLabel: {
        color: colors.text2,
        fontSize: 13,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: colors.bg,
    },
    summaryButton: {
        marginTop: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
    },
    summaryButtonText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '700',
    },
});