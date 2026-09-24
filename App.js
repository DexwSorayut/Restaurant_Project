import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar, Image, Modal, TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME, initDB } from './src/db/database';
import { styles } from './src/styles/appStyles';
import { colors } from './src/styles/theme';
import TableScreen from './src/screen/table/tableScreen';
import FoodScreen from './src/screen/foods/foodScreen';
import KitchenScreen from './src/screen/kitchen/kitchenScreen';

export default function App() {

    const [screen, setScreen] = useState('home');
    const [db, setDb] = useState(null);
    const [ready, setReady] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const [employeePin, setEmployeePin] = useState('');
    const [employeeTarget, setEmployeeTarget] = useState(null);

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                const database =
                    await SQLite.openDatabaseAsync(
                        DATABASE_NAME
                    );

                await initDB(database);

                setDb(database);
                setReady(true);

            } catch (error) {
                console.error(
                    'Database initialization error:',
                    error
                );
            }
        };

        setupDatabase();
    }, []);

    const openEmployeePin = (target) => {
        setEmployeePin('');
        setEmployeeTarget(target);
        setPinModalVisible(true);
    };

    const closeEmployeePin = () => {
        setEmployeePin('');
        setEmployeeTarget(null);
        setPinModalVisible(false);
    };

    const handleEmployeeLogin = () => {
        if (employeePin !== '1234') {

            Alert.alert(
                'รหัสไม่ถูกต้อง',
                'กรุณาตรวจสอบรหัสพนักงานอีกครั้ง'
            );

            return;
        }

        const target = employeeTarget;

        closeEmployeePin();

        if (target === 'table') {
            setScreen('table');
            return;
        }

        if (target === 'kitchen') {
            setScreen('kitchen');
            return;
        }
    };

    if (!ready || !db) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.bg,
                }}
            >
                <Text>
                    กำลังเตรียมฐานข้อมูล...
                </Text>
            </View>
        );
    }

    if (screen === 'table') {
        return (
            <TableScreen
                db={db}
                mode="manage"
                onBack={() => setScreen('home')}
            />
        );
    }

    if (screen === 'selectTable') {
        return (
            <TableScreen
                db={db}
                mode="select"
                onBack={() => setScreen('home')}
                onSelectTable={(table) => {
                    setSelectedTable(table);
                    setScreen('food');
                }}
            />
        );
    }

    if (screen === 'food') {
        return (
            <FoodScreen
                db={db}
                table={selectedTable}
                onBillClosed={() => {
                    setSelectedTable(null);
                    setScreen('selectTable');
                }}
            />
        );
    }
    if (screen === 'kitchen') {
        return (
            <KitchenScreen
                db={db}
                mode='manage'
                onBack={() =>
                    setScreen('home')
                }
            />
        );
    }

    return (
        <View style={styles.root}>

            <StatusBar
                backgroundColor={colors.bg}
                barStyle="dark-content"
            />

            <View style={styles.body}>

                <View style={styles.brand}>

                    <Image
                        source={require('./src/icon/cashier.png')}
                        style={styles.menuIcon}
                    />

                    <Text style={styles.shopSubtitle}>
                        Restaurant POS
                    </Text>

                </View>

                <View style={styles.menuContainer}>

                    <TouchableOpacity
                        style={[
                            styles.menuButton,
                            {
                                backgroundColor:
                                    colors.primary,
                            },
                        ]}
                        activeOpacity={0.8}
                        onPress={() => openEmployeePin('table')}
                    >

                        <Image
                            source={require('./src/icon/table.png')}
                            style={styles.menuIcon}
                        />

                        <Text style={styles.menuTitle}>
                            จัดการโต๊ะ
                        </Text>

                        <Text style={styles.menuDescription}>
                            เปิดโต๊ะ ดูบิล และเช็คบิล
                        </Text>

                        <Text style={styles.menuDescription}>
                            (สำหรับพนักงาน)
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.menuButton,
                            {
                                backgroundColor:
                                    colors.green,
                            },
                        ]}
                        activeOpacity={0.8}
                        onPress={() =>
                            setScreen('selectTable')
                        }
                    >

                        <Image
                            source={require('./src/icon/foods.png')}
                            style={styles.menuIcon}
                        />

                        <Text style={styles.menuTitle}>
                            สั่งอาหาร
                        </Text>

                        <Text style={styles.menuDescription}>
                            เลือกโต๊ะและสั่งอาหาร
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.menuButton,
                            {
                                backgroundColor:
                                    colors.orangeLight,
                            },
                        ]}
                        activeOpacity={0.8}
                        onPress={() => openEmployeePin('kitchen')}
                    >

                        <Image
                            source={require('./src/icon/kitchen.png')}
                            style={styles.menuIcon}
                        />

                        <Text
                            style={[
                                styles.menuTitle,
                                {
                                    color:
                                        colors.black,
                                },
                            ]}
                        >
                            ครัว
                        </Text>

                        <Text
                            style={[
                                styles.menuDescription,
                                {
                                    color:
                                        colors.black,
                                },
                            ]}
                        >
                            จัดการรายการอาหารที่ต้องทำ
                        </Text>

                        <Text
                            style={[
                                styles.menuDescription,
                                {
                                    color:
                                        colors.black,
                                },
                            ]}
                        >
                            (สำหรับพนักงาน)
                        </Text>

                    </TouchableOpacity>

                </View>
            </View>

            <Modal
                visible={pinModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeEmployeePin}
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.openTableModal}>

                        <Text style={styles.modalTitle}>
                            เข้าสู่ระบบพนักงาน
                        </Text>

                        <Text style={styles.modalDescription}>
                            กรุณาใส่รหัสพนักงาน
                        </Text>

                        <TextInput
                            style={styles.customerInput}
                            value={employeePin}
                            onChangeText={setEmployeePin}
                            placeholder="รหัสพนักงาน"
                            placeholderTextColor={
                                colors.dim
                            }
                            keyboardType="number-pad"
                            secureTextEntry
                            maxLength={6}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>

                            <TouchableOpacity
                                style={
                                    styles.modalCancelButton
                                }
                                onPress={closeEmployeePin}
                            >
                                <Text
                                    style={
                                        styles.modalCancelText
                                    }
                                >
                                    ยกเลิก
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={
                                    styles.modalConfirmButton
                                }
                                onPress={
                                    handleEmployeeLogin
                                }
                            >
                                <Text
                                    style={
                                        styles.modalConfirmText
                                    }
                                >
                                    เข้าสู่ระบบ
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

            </Modal>

        </View>
    );
}
