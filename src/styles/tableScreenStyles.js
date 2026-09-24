import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
    tableRoot: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    tableHeader: {
        height: 70,
        paddingHorizontal: 30,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tableHeaderTitle: {
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
    tableContent: {
        flex: 1,
        paddingHorizontal: 35,
        paddingTop: 25,
    },
    tableList: {
        paddingBottom: 30,
    },
    tableRow: {
        justifyContent: 'flex-start',
        gap: 20,
        marginBottom: 20,
    },
    tableCard: {
        width: '23.7%',
        minHeight: 180,
        borderRadius: 16,
        borderWidth: 2,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableCardAvailable: {
        backgroundColor: colors.surface,
        borderColor: colors.green,
    },
    tableStatusAvailable: {
        backgroundColor: colors.greenLight,
    },
    tableStatusTextAvailable: {
        color: colors.green,
    },
    tableCardOccupied: {
        backgroundColor: colors.redLight,
        borderColor: colors.red,
    },
    tableStatusOccupied: {
        backgroundColor: colors.red,
    },
    tableStatusTextOccupied: {
        color: colors.white,
    },
    tableNumber: {
        color: colors.text1,
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 15,
    },
    tableStatus: {
        minWidth: 90,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableStatusText: {
        fontSize: 16,
        fontWeight: '700',
    },
    tableCapacity: {
        color: colors.text3,
        fontSize: 15,
        marginTop: 12,
    },
    tableCustomer: {
        color: colors.red,
        fontSize: 15,
        fontWeight: '600',
        marginTop: 12,
    },
    tableElapsed: {
        color: colors.text3,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    openTableModal: {
        width: 420,
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 30,
    },
    modalTitle: {
        color: colors.text1,
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
    },
    modalDescription: {
        color: colors.text3,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 25,
    },
    modalLabel: {
        color: colors.text2,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    customerInput: {
        height: 55,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 20,
        color: colors.text1,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
    },
    modalCancelButton: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.disabled,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCancelText: {
        color: colors.text2,
        fontSize: 16,
        fontWeight: '600',
    },
    modalConfirmButton: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalConfirmText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});