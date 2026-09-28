import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getBillDetails, closeBill } from '../../db/database';
import { styles } from '../../styles/detailScreenStyles';
import { colors } from '../../styles/theme';

export default function DetailScreen({
    db,
    table,
    onBack,
    onPaid,
}) {
    const [items, setItems] = useState([]);
    const [billTotal, setBillTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBill();
    }, []);

    const loadBill = async () => {
        if (!table?.bill_id) {
            setLoading(false);
            return;
        }

        try {
            const result = await getBillDetails(
                db,
                table.bill_id
            );

            setItems(result.items);
            setBillTotal(result.billTotal);

        } catch (error) {
            console.error(
                'Load bill details error:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (satang) => {
        return `${(Number(satang) / 100).toFixed(2)} บาท`;
    };

    // แยกรายการตามรอบ
    const rounds = items.reduce((groups, item) => {
        const roundId = item.round_id;

        if (!groups[roundId]) {
            groups[roundId] = {
                round_id: roundId,
                round_number: item.round_number,
                ordered_at: item.ordered_at,
                items: [],
            };
        }

        groups[roundId].items.push(item);

        return groups;
    }, {});

    const roundList = Object.values(rounds);

    const getRoundTotal = (roundItems) => {
        return roundItems.reduce(
            (sum, item) => {
                if (item.status === 'CANCELLED') {
                    return sum;
                }

                return sum + Number(item.item_total);
            },
            0
        );
    };

    const formatTime = (dateString) => {
        if (!dateString) {
            return '-';
        }

        const date = new Date(dateString);

        return date.toLocaleTimeString(
            'th-TH',
            {
                hour: '2-digit',
                minute: '2-digit',
            }
        );
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'WAITING':
                return 'กำลังทำ';

            case 'COOKING':
                return 'รอเสิร์ฟ';

            case 'SERVED':
                return 'เสิร์ฟแล้ว';

            case 'CANCELLED':
                return 'ยกเลิก';

            default:
                return status;
        }
    };

    const handlePayment = async () => {
        if (!table?.bill_id || !table?.table_id) {
            return;
        }

        try {
            await closeBill(
                db,
                table.bill_id,
                table.table_id
            );

            if (onPaid) {
                onPaid();
            }

        } catch (error) {
            console.error(
                'Payment error:',
                error
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />

                <Text style={styles.loadingText}>
                    กำลังโหลดข้อมูลบิล...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>

            {/* Header */}
            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonText}>
                        กลับ
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    รายละเอียดบิล
                </Text>

                <View style={styles.headerRight}>
                    <Text style={styles.tableText}>
                        โต๊ะ {table?.table_number}
                    </Text>
                </View>

            </View>


            {/* Bill Information */}
            <View style={styles.billInfo}>

                <View>
                    <Text style={styles.billInfoLabel}>
                        โต๊ะ
                    </Text>

                    <Text style={styles.billInfoValue}>
                        {table?.table_number}
                    </Text>
                </View>

                <View>
                    <Text style={styles.billInfoLabel}>
                        ลูกค้า
                    </Text>

                    <Text style={styles.billInfoValue}>
                        {table?.customer_count ?? '-'} คน
                    </Text>
                </View>

                <View>
                    <Text style={styles.billInfoLabel}>
                        เปิดโต๊ะ
                    </Text>

                    <Text style={styles.billInfoValue}>
                        {formatTime(table?.opened_at)}
                    </Text>
                </View>

            </View>


            {/* Orders */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >

                {roundList.length === 0 ? (

                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            ยังไม่มีรายการอาหาร
                        </Text>
                    </View>

                ) : (

                    roundList.map(round => {

                        const roundTotal =
                            getRoundTotal(round.items);

                        return (
                            <View
                                key={round.round_id}
                                style={styles.roundCard}
                            >

                                {/* Round Header */}
                                <View style={styles.roundHeader}>

                                    <Text style={styles.roundTitle}>
                                        รอบที่ {round.round_number}
                                    </Text>

                                    <Text style={styles.roundTime}>
                                        {formatTime(
                                            round.ordered_at
                                        )}
                                    </Text>

                                </View>


                                {/* Items */}
                                {round.items.map(item => (

                                    <View
                                        key={item.item_id}
                                        style={[
                                            styles.itemRow,
                                            item.status === 'CANCELLED' &&
                                                styles.cancelledItem
                                        ]}
                                    >

                                        <View style={styles.itemInfo}>

                                            <Text
                                                style={[
                                                    styles.itemName,
                                                    item.status === 'CANCELLED' &&
                                                        styles.cancelledText
                                                ]}
                                            >
                                                {item.food_name}
                                            </Text>

                                            <Text style={styles.itemPrice}>
                                                {formatPrice(
                                                    item.unit_price
                                                )} × {item.quantity}
                                            </Text>

                                            {item.note ? (
                                                <Text style={styles.itemNote}>
                                                    หมายเหตุ: {item.note}
                                                </Text>
                                            ) : null}

                                            <Text
                                                style={[
                                                    styles.itemStatus,
                                                    item.status === 'CANCELLED' &&
                                                        styles.cancelledText
                                                ]}
                                            >
                                                {getStatusText(
                                                    item.status
                                                )}
                                            </Text>

                                        </View>

                                        <Text
                                            style={[
                                                styles.itemTotal,
                                                item.status === 'CANCELLED' &&
                                                    styles.cancelledText
                                            ]}
                                        >
                                            {formatPrice(
                                                item.item_total
                                            )}
                                        </Text>

                                    </View>

                                ))}


                                {/* Round Total */}
                                <View style={styles.roundTotal}>

                                    <Text style={styles.roundTotalLabel}>
                                        รวมรอบนี้
                                    </Text>

                                    <Text style={styles.roundTotalValue}>
                                        {formatPrice(roundTotal)}
                                    </Text>

                                </View>

                            </View>
                        );
                    })

                )}

            </ScrollView>


            {/* Footer */}
            <View style={styles.footer}>

                <View style={styles.totalRow}>

                    <Text style={styles.totalLabel}>
                        ยอดรวมทั้งหมด
                    </Text>

                    <Text style={styles.totalValue}>
                        {formatPrice(billTotal)}
                    </Text>

                </View>

                <TouchableOpacity
                    style={styles.paymentButton}
                    onPress={handlePayment}
                    activeOpacity={0.8}
                >
                    <Text style={styles.paymentButtonText}>
                        ชำระเงิน {formatPrice(billTotal)}
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}
