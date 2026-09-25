import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { getTables } from '../../db/database';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/tableScreenStyles';

function formatElapsedTime(openedAt) {
    if (!openedAt) {
        return 'ยังไม่เปิดโต๊ะ';
    }

    const openedTime = new Date(openedAt).getTime();
    const now = Date.now();

    const elapsed = Math.max(
        0,
        Math.floor((now - openedTime) / 1000)
    );

    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    return (
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`
    );
}

export default function TableScreen({ db, onBack }) {

    const [tables, setTables] = useState([]);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        loadTables();

        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const loadTables = async () => {
        try {
            const data = await getTables(db);
            setTables(data);
        } catch (error) {
            console.error(
                'Load tables error:',
                error
            );
        }
    };

    const handleTablePress = (table) => {

        console.log(
            'เลือกโต๊ะ:',
            table.table_number
        );
    };

    const renderTable = ({ item }) => {
        const isOccupied =
            item.status === 'OCCUPIED';

        return (
            <TouchableOpacity
                style={[ styles.tableCard, isOccupied ? styles.tableCardOccupied : styles.tableCardAvailable ]}
                activeOpacity={0.8}
                onPress={() =>
                    handleTablePress(item)
                }
            >
                <Text style={styles.tableNumber}>
                    โต๊ะ {item.table_number}
                </Text>

                <Text style={styles.tableCapacity}>
                    {formatElapsedTime(item.opened_at)}
                </Text>

                <View style={[ styles.tableStatus, isOccupied ? styles.tableStatusOccupied : styles.tableStatusAvailable,]}>
                    <Text style={[ styles.tableStatusText, isOccupied ? styles.tableStatusTextOccupied : styles.tableStatusTextAvailable ]}>
                        {isOccupied
                            ? 'มีลูกค้า'
                            : 'ว่าง'
                        }
                    </Text>
                </View>

                {isOccupied ? (
                    <Text style={styles.tableCustomer}>{item.customer_count} คน </Text>
                ) : (
                    <Text style={styles.tableCapacity}>รองรับ {item.capacity} คน</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.tableRoot}>
            <View style={[ styles.tableHeader , { backgroundColor: colors.primary}]}>
                <Text style={styles.tableHeaderTitle}> จัดการโต๊ะ </Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tableContent}>
                <FlatList
                    data={tables}
                    keyExtractor={item => String(item.table_id)}
                    renderItem={renderTable}
                    numColumns={4}
                    columnWrapperStyle={styles.tableRow}
                    contentContainerStyle={styles.tableList}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}