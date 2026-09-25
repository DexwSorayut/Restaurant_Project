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
        // flex: 1,
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
});