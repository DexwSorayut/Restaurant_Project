import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, Modal } from 'react-native';
import { getTables, openTable } from '../../db/database';
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

export default function TableScreen({
    db,
    onBack,
    mode = 'manage',
    onSelectTable,
}) {

    const [tables, setTables] = useState([]);
    const [now, setNow] = useState(Date.now());
    const [selectedTable, setSelectedTable] = useState(null);
    const [customerCount, setCustomerCount] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

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

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTable(null);
        setCustomerCount('');
    };

    const handleTablePress = (table) => {
        if (mode === 'select') {
            if (table.status !== 'OCCUPIED') {
                Alert.alert(
                    'โต๊ะยังไม่เปิด',
                    `กรุณาแจ้งพนักงานให้เปิดโต๊ะ ${table.table_number} ก่อน`
                );

                return;
            }

            if (onSelectTable) {
                onSelectTable(table);
            }

            return;
        }

        if (table.status === 'OCCUPIED') {

            console.log(
                'โต๊ะมีลูกค้า:',
                table.table_number
            );
            return;
        }

        setSelectedTable(table);
        setCustomerCount('');
        setModalVisible(true);
    };

    const handleOpenTable = async () => {
        if (!selectedTable) {
            return;
        }

        const count = Number(customerCount);
            if (!customerCount.trim()) {
                Alert.alert(
                    'ข้อมูลไม่ครบ',
                    'กรุณากรอกจำนวนลูกค้า'
                );
                return;
            }

            if (!Number.isInteger(count) || count <= 0) {
                Alert.alert(
                    'จำนวนลูกค้าไม่ถูกต้อง',
                    'กรุณากรอกจำนวนลูกค้าเป็นจำนวนเต็มที่มากกว่า 0'
                );
                return;
            }

            if (count > selectedTable.capacity) {
                Alert.alert(
                    'จำนวนลูกค้าเกินความจุโต๊ะ',
                    `โต๊ะ ${selectedTable.table_number} รองรับได้สูงสุด ${selectedTable.capacity} คน`
                );
                return;
            }

            try {
                await openTable(
                    db,
                    selectedTable.table_id,
                    count
                );
                closeModal();

                await loadTables();
            } catch (error) {
                console.error(
                    'Open table error:',
                    error
                );
                Alert.alert(
                    'เกิดข้อผิดพลาด',
                    'ไม่สามารถเปิดโต๊ะได้'
                );
            }
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
            <View style={[ styles.tableHeader, {backgroundColor: colors.primary}]}>
                <Text style={styles.tableHeaderTitle}>กรุณาเลือกโต๊ะ</Text>

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

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.openTableModal}>
                        <Text style={styles.modalTitle}>เปิดโต๊ะ{' '}{selectedTable?.table_number}</Text>

                        <Text style={styles.modalDescription}>รองรับสูงสุด{' '}{selectedTable?.capacity}{' '}คน</Text>

                        <Text style={styles.modalLabel}>จำนวนลูกค้า</Text>

                        <TextInput
                            style={styles.customerInput}
                            value={customerCount}
                            onChangeText={setCustomerCount}
                            placeholder="กรอกจำนวนลูกค้า"
                            placeholderTextColor={colors.dim}
                            keyboardType="number-pad"
                            maxLength={2}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.modalCancelText}>ยกเลิก</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={handleOpenTable}
                            >
                                <Text style={styles.modalConfirmText}>เปิดโต๊ะ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
