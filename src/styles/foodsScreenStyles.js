import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
    foodRoot: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    foodHeader: {
        height: 70,
        paddingHorizontal: 30,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    foodHeaderTitle: {
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
    foodContent: {
        flex: 1,
        flexDirection: 'row',
    },
    categorySidebar: {
        width: 220,
        padding: 20,
        backgroundColor: colors.surface,
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    categoryTitle: {
        color: colors.text1,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
    },
    categoryButton: {
        minHeight: 52,
        paddingHorizontal: 15,
        marginBottom: 8,
        borderRadius: 10,
        justifyContent: 'center',
    },
    categoryButtonActive: {
        backgroundColor: colors.primaryLight,
    },
    categoryText: {
        color: colors.text2,
        fontSize: 16,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: colors.primary,
        fontWeight: '700',
    },
    foodListContainer: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
    },
    foodListTitle: {
        color: colors.text1,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15,
    },
    foodList: {
        paddingBottom: 25,
    },
    foodRow: {
        gap: 16,
        marginBottom: 16,
    },
    foodCard: {
        width: '23.7%',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
    },
    foodImage: {
        width: '100%',
        height: 130,
        resizeMode: 'cover',
        backgroundColor: colors.disabled,
    },
    foodImagePlaceholder: {
        width: '100%',
        height: 130,
        backgroundColor: colors.disabled,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodImagePlaceholderText: {
        color: colors.disabledText,
        fontSize: 14,
    },
    foodInfo: {
        padding: 12,
    },
    foodName: {
        color: colors.text1,
        fontSize: 17,
        fontWeight: '600',
        minHeight: 42,
    },
    foodPrice: {
        color: colors.primary,
        fontSize: 17,
        fontWeight: '700',
        marginTop: 5,
    },
    cartButton: {
        marginTop: 'auto',
        backgroundColor: colors.primary,
        borderRadius: 10,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    addFoodButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
    },

    addFoodButtonText: {
        color: colors.white,
        fontSize: 28,
        fontWeight: '500',
        lineHeight: 30,
    },
});