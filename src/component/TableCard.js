import { View, Text, Pressable } from "react-native";
import { styles } from "../styles/tableCardStyles";

const getOpenDuration = (openedAt) => {
    if (!openedAt) {
        return "ยังไม่มีการเปิดโต๊ะ";
    }

    const openedTime = new Date(openedAt);
    const now = new Date();

    const diffMs = now - openedTime;

    if (diffMs < 0) {
        return "เพิ่งเปิดโต๊ะ";
    }

    const totalMinutes = Math.floor(
        diffMs / (1000 * 60)
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `ใช้งานมาแล้ว ${hours} ชม. ${minutes} นาที`;
    }

    return `ใช้งานมาแล้ว ${minutes} นาที`;
};

const TableCard = ({ table, onPress }) => {
    const isOccupied = table.status === "OCCUPIED";

    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.tableNumber}>
                    โต๊ะ {table.table_number}
                </Text>

                <Text style={styles.openTime}>
                    {getOpenDuration(table.opened_at)}
                </Text>
                {isOccupied && (
                    <Text style={styles.openTime}>
                        จำนวนลูกค้า {table.customer_count} คน
                    </Text>
                )}
            </View>
            <Pressable
                onPress={() => onPress(table)}
            >
            <View
                style={[
                    styles.status,
                    isOccupied
                        ? styles.occupied
                        : styles.available
                ]}
            >
                <Text style={styles.statusText}>
                    {isOccupied ? "ไม่ว่าง" : "เปิดโต๊ะ"}
                </Text>
            </View>
        </Pressable>
        </View>
    );
};

export default TableCard;