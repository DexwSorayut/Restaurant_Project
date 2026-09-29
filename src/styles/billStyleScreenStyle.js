import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
    billScreen: {
        flex: 1,
        backgroundColor: colors.bg,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text1,
        marginBottom: 16,
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.primaryLight,
        marginBottom: 16,
    },
    backButtonText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 15,
    },

    // แถบค้นหา
    billFilterRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    billSearchBox: {
        flex: 1,
    },
    billTableFilter: {
        width: 180,
    },
    billFilterLabel: {
        fontSize: 14,
        color: colors.text2,
        marginBottom: 6,
    },
    billInput: {
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    billInputText: {
        color: colors.text2,
        fontSize: 14,
    },

    // รายการบิล
    billList: {
        flex: 1,
    },
    billListContent: {
        paddingBottom: 20,
        gap: 10,
    },
    billRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
    },
    billMainInfo: {
        flex: 1,
    },
    billNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text1,
    },
    billTable: {
        fontSize: 14,
        color: colors.text2,
        marginTop: 2,
    },
    billTimeInfo: {
        width: 100,
        alignItems: 'center',
    },
    billDate: {
        fontSize: 13,
        color: colors.text2,
    },
    billTime: {
        fontSize: 13,
        color: colors.text2,
    },
    billAmount: {
        width: 110,
        textAlign: 'right',
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
});