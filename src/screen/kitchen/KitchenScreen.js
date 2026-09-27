import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { listOrders, updateOrderItemStatus } from '../../db/database';
import { styles } from '../../styles/kitchenScreenStyles';
import { colors } from '../../styles/theme';

const STATUS_INFO = {
    WAITING: {
        label: 'กำลังทำ',
        color: '#f59e0b',
        next: 'COOKING',
        actionLabel: 'ทำเสร็จ',
    },

    COOKING: {
        label: 'รอเสิร์ฟ',
        color: '#8b5cf6',
        next: 'SERVED',
        actionLabel: 'เสิร์ฟแล้ว',
    },

    SERVED: {
        label: 'เสิร์ฟแล้ว',
        color: colors.green ?? '#22c55e',
        next: null,
    },

    CANCELLED: {
        label: 'ยกเลิก',
        color: '#9ca3af',
        next: null,
    },
};

const STATUS_TABS = [
    null,
    'WAITING',
    'COOKING',
    'SERVED',
    'CANCELLED',
];

const AUTO_REFRESH_MS = 10000;

function formatTime(text) {
    const date = new Date(text);

    if (isNaN(date.getTime())) {
        return text ?? '';
    }

    const hours = String(
        date.getHours()
    ).padStart(2, '0');

    const minutes = String(
        date.getMinutes()
    ).padStart(2, '0');

    return `${hours}:${minutes} น.`;
}

function groupByRound(items) {
    const map = new Map();
    for (const item of items) {
        if (!map.has(item.round_id)) {
            map.set(item.round_id, {
                round_id: item.round_id,
                round_number: item.round_number,
                bill_id: item.bill_id,
                table_number: item.table_number,
                ordered_at: item.ordered_at,
                items: [],
            });
        }
        map
            .get(item.round_id)
            .items
            .push(item);
    }
    return Array.from(map.values());
}

export default function KitchenScreen({
    db,
    onBack,
}) {

    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const rows = await listOrders(db);
            setOrders(rows);
        } catch (error) {
            console.error('Load kitchen data error:',error);
        } finally {
            setLoading(false);
        }
    }, [db]);

    useEffect(() => {
        loadData();
        const timer = setInterval(loadData,AUTO_REFRESH_MS);
        return () => clearInterval(timer);
    }, [loadData]);


    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const saveStatus = async ( item, newStatus ) => {
        try {
            setUpdatingId(item.item_id);
            await updateOrderItemStatus(
                db,
                item.item_id,
                newStatus
            );
            await loadData();
        } catch (error) {
            console.error('Update status error:',error);

            Alert.alert(
                'เกิดข้อผิดพลาด',
                'เปลี่ยนสถานะไม่สำเร็จ ลองใหม่อีกครั้ง'
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleNext = (item) => {
        const info = STATUS_INFO[item.status];
        if (info?.next) {
            saveStatus( item, info.next );
        }
    };

    const handleCancel = (item) => {
        Alert.alert(
            'ยกเลิกรายการ',
            `ยกเลิก "${item.food_name} x${item.quantity}" ของโต๊ะ ${item.table_number} ใช่ไหม?`,
            [
                {
                    text: 'ไม่',
                    style: 'cancel',
                },

                {
                    text: 'ยกเลิกรายการ',
                    style: 'destructive',
                    onPress: () => saveStatus(item,'CANCELLED'),
                },
            ]
        );
    };

    const countByStatus = useMemo(() => {
        const counts = {};
        for (const order of orders) {
            counts[order.status] = (counts[order.status] || 0) + 1;
        }
        return counts;
    }, [orders]);

    const tickets = useMemo(() => {
        const filtered =
            selectedStatus === null
                ? orders
                : orders.filter(
                    order =>
                        order.status ===
                        selectedStatus
                );
        return groupByRound(
            filtered
        );
    }, [ orders, selectedStatus ]);

    const selectedName =
        selectedStatus === null
            ? 'ออเดอร์ทั้งหมด'
            : STATUS_INFO[
                selectedStatus
            ].label;

    const renderTab = (status) => {
        const active = selectedStatus === status;
        const name =
            status === null
                ? 'ทั้งหมด'
                : STATUS_INFO[
                    status
                ].label;

        const count =
            status === null
                ? orders.length
                : countByStatus[
                    status
                ] || 0;

        const badgeColor =
            status === null
                ? colors.primary
                : STATUS_INFO[
                    status
                ].color;


        return (
            <TouchableOpacity
                key={status ?? 'all'}
                onPress={() => setSelectedStatus(status)}
                style={[ styles.categoryItem, active && styles.categoryItemActive ]}
            >
                <Text style={[ styles.categoryText, active && styles.categoryTextActive ]}>
                    {name}
                </Text>

                {count > 0 && (
                    <View style={[ styles.categoryCount,{backgroundColor: badgeColor} ]}>
                        <Text style={ styles.categoryCountText }>
                            {count}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };


    const renderItem = (item) => {
        const info = STATUS_INFO[item.status];
        const isUpdating = updatingId === item.item_id;
        const isCancelled = item.status === 'CANCELLED';

        return (
            <View 
              key={item.item_id} 
              style={styles.itemRow}
            >
                <View style={styles.itemInfo}>
                    <Text style={[ styles.itemFoodName, isCancelled && styles.itemFoodNameCancelled ]}>
                        {item.food_name} x {item.quantity}
                    </Text>

                    {!!item.note && (
                        <Text style={styles.itemNote} >
                            * {item.note}
                        </Text>
                    )}

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor:
                                    info?.color ??
                                    '#999',
                            },
                        ]}
                    >

                        <Text
                            style={
                                styles.statusBadgeText
                            }
                        >
                            {info?.label ??
                                item.status}
                        </Text>
                    </View>
                </View>

                {info?.next && (

                    <View
                        style={
                            styles.itemActions
                        }
                    >

                        <TouchableOpacity
                            onPress={() =>
                                handleNext(item)
                            }
                            disabled={isUpdating}
                            style={[
                                styles.actionButton,
                                isUpdating &&
                                    styles.actionButtonDisabled,
                            ]}
                        >

                            <Text
                                style={
                                    styles.actionButtonText
                                }
                            >
                                {isUpdating
                                    ? 'กำลังบันทึก...'
                                    : info.actionLabel}
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                handleCancel(item)
                            }
                            disabled={isUpdating}
                            style={[
                                styles.cancelButton,
                                isUpdating &&
                                    styles.actionButtonDisabled,
                            ]}
                        >

                            <Text
                                style={
                                    styles.cancelButtonText
                                }
                            >
                                ยกเลิก
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const renderTicket = (ticket) => (
        <View
            key={ticket.round_id}
            style={styles.ticketCard}
        >
            <View
                style={styles.ticketHeader}
            >
                <View>

                    <Text
                        style={
                            styles.ticketTableText
                        }
                    >
                        โต๊ะ {ticket.table_number}
                    </Text>

                    <Text
                        style={
                            styles.ticketSubText
                        }
                    >
                        บิล #{ticket.bill_id}
                        {' · '}
                        รอบที่ {ticket.round_number}
                    </Text>

                </View>

                <Text
                    style={
                        styles.ticketTimeText
                    }
                >
                    {formatTime(
                        ticket.ordered_at
                    )}
                </Text>
            </View>

            {ticket.items.map(
                renderItem
            )}
        </View>
    );

    return (
        <View style={styles.kitchenRoot}>
            <View style={styles.kitchenHeader}>
                <Text style={ styles.kitchenHeaderTitle }>
                    ครัว · กำลังทำ{' '}
                    {countByStatus.WAITING || 0}
                    {' '}จาน
                </Text>

                <TouchableOpacity
                    onPress={onBack}
                    style={styles.backButton}
                >
                    <Text style={ styles.backButtonText }>
                        กลับ
                    </Text>
                </TouchableOpacity>
            </View>


            <View style={styles.kitchenBody}>
                <ScrollView style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>
                        สถานะ
                    </Text>

                    {STATUS_TABS.map(renderTab)}
                </ScrollView>

                <View style={styles.mainArea}>
                    <Text style={styles.mainTitle}>
                        {selectedName}
                    </Text>

                    {loading ? (
                        <View style={ styles.emptyContainer }>
                            <Text style={ styles.emptyText }>
                                กำลังโหลด...
                            </Text>
                        </View>
                    ) : tickets.length === 0 ? (
                        <View style={ styles.emptyContainer }>
                            <Text style={ styles.emptyText }>
                                ไม่มีรายการในสถานะนี้
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            contentContainerStyle={styles.kitchenList}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                />
                            }
                        >
                            <View style={ styles.ticketGrid }>
                                {tickets.map(renderTicket)}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
            <StatusBar style="light" />
        </View>
    );
}