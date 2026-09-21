import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME, initDB, } from './src/db/database';
import { styles } from './src/styles/appStyles'; 
import { colors } from './src/styles/theme';
import TableScreen from './src/screen/table/tableScreen';
import FoodScreen from './src/screen/foods/foodScreen';

export default function App() {

    const [screen, setScreen] = useState('home');
    const [db, setDb] = useState(null);
    const [ready, setReady] = useState(false);

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
                onBack={() =>
                    setScreen('home')
                }
            />
        );
    }
    if (screen === 'food') {
        return (
            <FoodScreen
                db={db}
                onBack={() =>
                    setScreen('home')
                }
            />
        );

    }

    const handleTablePress = () => {
        Alert.alert('โต๊ะ', 'กำลังเข้าสู่หน้าจัดการโต๊ะ');
    };

    const handleFoodPress = () => {
        Alert.alert('รายการอาหาร', 'กำลังเข้าสู่รายการอาหาร');
    };

    const handleKitchenPress = () => {
        Alert.alert('ครัว', 'ต้องใส่รหัสพนักงานก่อนเข้า');
    };

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
                        style={[ styles.menuButton,{ backgroundColor: colors.primary }]}
                        activeOpacity={0.8}
                        onPress={() => setScreen('table')}
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
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[ styles.menuButton, { backgroundColor: colors.green }]}
                        activeOpacity={0.8}
                        onPress={() => setScreen('food')}
                    >
                        <Image
                            source={require('./src/icon/foods.png')}
                            style={styles.menuIcon}
                        />
                        <Text style={styles.menuTitle}>
                            รายการอาหาร
                        </Text>
                        <Text style={styles.menuDescription}>
                            ดูและจัดการรายการอาหาร
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[ styles.menuButton, { backgroundColor: colors.orangeLight }]}
                        activeOpacity={0.8}
                        onPress={handleKitchenPress}
                    >
                        <Image
                            source={require('./src/icon/kitchen.png')}
                            style={styles.menuIcon}
                        />
                        <Text style={[ styles.menuTitle, { color: colors.black }]}>
                            ครัว
                        </Text>
                        <Text style={[ styles.menuDescription , { color: colors.black }]}>
                            จัดการรายการอาหารที่ต้องทำ
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}