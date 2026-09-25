import { StyleSheet } from "react-native";
import { colors } from "./theme";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 10,
        padding: 16,
        margin: 5,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        borderWidth: 1,
        borderColor: colors.border,
    },

    info: {
        flex: 1,
    },

    tableNumber: {
        color: colors.text1,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },

    openTime: {
        color: colors.dim,
        fontSize: 13,
    },

    status: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    available: {
        backgroundColor: colors.green,
    },

    occupied: {
        backgroundColor: colors.red,
    },

    statusText: {
        color: colors.bg,
        fontSize: 13,
        fontWeight: "700",
    },
});