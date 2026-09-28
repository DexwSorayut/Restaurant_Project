import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME, initDB } from './src/db/database';
import { CartProvider } from './src/context/cartContext';
import { styles } from './src/styles/appStyles';
import { colors } from './src/styles/theme';
import TableScreen from './src/screen/table/tableScreen';
import FoodScreen from './src/screen/foods/foodScreen';
import KitchenScreen from './src/screen/kitchen/kitchenScreen';
import DetailScreen from './src/screen/table/detailScreen';
import SummaryScreen from './src/screen/summary/summaryScreen';

export default function App() {

    const [screen, setScreen] = useState('home');
    const [db, setDb] = useState(null);
    const [ready, setReady] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

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
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: colors.bg}}>
                <Text>กำลังเตรียมฐานข้อมูล...</Text>
            </View>
        );
    }

   return (
    <CartProvider
        db={db}
        selectedTable={selectedTable}
    >
        <MainScreen
            db={db}
            screen={screen}
            setScreen={setScreen}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
        />
    </CartProvider>
);
}

function MainScreen({
    db,
    screen,
    setScreen,
    selectedTable,
    setSelectedTable,
}) {
    if (screen === 'table') {
        return (
            <TableScreen
                db={db}
                mode="manage"
                onBack={() => setScreen('home')}
                onOpenDetail={(table) => {
                    setSelectedTable(table);
                    setScreen('detail');
                }}
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
                onBack={() => setScreen('selectTable')}
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
                onBack={() => setScreen('home')}
            />
        );
    }
    if (screen === 'detail') { 
        return ( 
        <DetailScreen 
            db={db} 
            table={selectedTable} 
            onBack={() => setScreen('table')} 
            onPaid={() => { 
                setSelectedTable(null); 
                setScreen('table'); 
            }} /> 
        ); 
    }
    if (screen === 'summary') {
        return (
            <SummaryScreen
                db={db}
                onBack={() => setScreen('home')}
            />
        );
    }

    return (
        <View style={styles.root}>

            <StatusBar backgroundColor={colors.bg} barStyle="dark-content" />
            <View style={styles.body}>
                <View style={styles.brand}>
                    <Image
                        source={require('./src/icon/cashier.png')}
                        style={styles.menuIcon}
                    />
                    <Text style={styles.shopSubtitle}>Restaurant POS</Text>
                </View>

                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={[ styles.menuButton,{ backgroundColor: colors.primary}]}
                        activeOpacity={0.8}
                        onPress={() => setScreen('table')}
                    >
                        <Image
                            source={require('./src/icon/table.png')}
                            style={styles.menuIcon}
                        />
                        <Text style={styles.menuTitle}>จัดการโต๊ะ</Text>
                        <Text style={styles.menuDescription}>เปิดโต๊ะ ดูบิล และเช็คบิล</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[ styles.menuButton,{backgroundColor: colors.green}]}
                        activeOpacity={0.8}
                        onPress={() => setScreen('selectTable')}
                    >
                        <Image
                            source={require('./src/icon/foods.png')}
                            style={styles.menuIcon}
                        />

                        <Text style={styles.menuTitle}>สั่งอาหาร</Text>
                        <Text style={styles.menuDescription}>เลือกโต๊ะและสั่งอาหาร</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[ styles.menuButton,{backgroundColor:colors.orangeLight}]}
                        activeOpacity={0.8}
                        onPress={() => setScreen('kitchen')}
                    >
                        <Image
                            source={require('./src/icon/kitchen.png')}
                            style={styles.menuIcon}
                        />
                        <Text style={[ styles.menuTitle,{color:colors.black}]}>ครัว</Text>
                        <Text style={[ styles.menuDescription,{color:colors.black}]}>จัดการรายการอาหารที่ต้องทำ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[ styles.menuButton,{backgroundColor:colors.indigo}]}
                        activeOpacity={0.8}
                        onPress={() => setScreen('summary')}
                    >
                        <Image
                            source={require('./src/icon/report.png')}
                            style={styles.menuIcon}
                        />
                        <Text style={[ styles.menuTitle, {color:colors.black}]}>เอกสาร</Text>
                        <Text style={[ styles.menuDescription, {color:colors.black}]}>รายงานและบิล</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}