import { StyleSheet } from 'react-native';
import { colors, topInset} from './theme';

export const styles = StyleSheet.create({

    root: {
        flex: 1,
        backgroundColor: colors.bg,
    },

    header: {
        paddingTop: topInset + 12,
        paddingBottom: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
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

    headerTitle: {
        color: colors.white,
        fontSize: 24,
        fontWeight: '700',
    },

    headerRight: {
        minWidth: 80,
        alignItems: 'flex-end',
    },

    tableText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
    },

    billInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingVertical: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    billInfoLabel: {
        color: colors.text3,
        fontSize: 13,
        marginBottom: 3,
    },

    billInfoValue: {
        color: colors.text1,
        fontSize: 16,
        fontWeight: '700',
    },

    content: {
        flex: 1,
    },

    contentContainer: {
        padding: 20,
        paddingBottom: 20,
    },

    roundCard: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },

    roundHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    roundTitle: {
        color: colors.text1,
        fontSize: 18,
        fontWeight: '700',
    },

    roundTime: {
        color: colors.text3,
        fontSize: 14,
    },

    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    itemInfo: {
        flex: 1,
        paddingRight: 15,
    },

    itemName: {
        color: colors.text1,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },

    itemPrice: {
        color: colors.text2,
        fontSize: 14,
    },

    itemNote: {
        color: colors.orange,
        fontSize: 13,
        marginTop: 4,
    },

    itemStatus: {
        color: colors.green,
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
    },

    itemTotal: {
        color: colors.text1,
        fontSize: 16,
        fontWeight: '700',
        paddingTop: 2,
    },

    cancelledItem: {
        opacity: 0.5,
    },

    cancelledText: {
        textDecorationLine: 'line-through',
    },

    roundTotal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
        paddingTop: 12,
    },

    roundTotalLabel: {
        color: colors.text2,
        fontSize: 14,
    },

    roundTotalValue: {
        color: colors.text1,
        fontSize: 16,
        fontWeight: '700',
    },

    emptyContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },

    emptyText: {
        color: colors.text3,
        fontSize: 16,
    },

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
    },

    loadingText: {
        color: colors.text2,
        marginTop: 10,
        fontSize: 15,
    },

    footer: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 20,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    totalLabel: {
        color: colors.text2,
        fontSize: 17,
    },

    totalValue: {
        color: colors.text1,
        fontSize: 24,
        fontWeight: '700',
    },

    paymentButton: {
        backgroundColor: colors.green,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
    },

    paymentButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
    },
});
