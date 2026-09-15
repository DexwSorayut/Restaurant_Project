import { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import TableScreen from './table/TableScreen';
import KitchenScreen from './kitchen/KitchenScreen';
import { styles } from '../styles/appStyles';
import { topInset } from '../styles/theme';

const MainScreen = () => {
    const [tab, setTab] = useState('Table');

    return (
        <View style={styles.root}>
            <View style={[ styles.header, { paddingTop: topInset + 10 } ]}>
                <Text style={styles.title}>
                    Restuarant Management
                </Text>

                <Pressable
                    style={styles.settingsButton}
                    onPress={() => {
                        console.log('เปิดตั้งค่า');
                    }}
                >
                    <Text style={styles.settingsIcon}>⋮</Text>
                </Pressable>
            </View>

            <View style={styles.body}>
                {tab === 'Table' 
                    ? ( <TableScreen />) 
                    : (<KitchenScreen />)
                }
            </View>

            <View style={styles.tabbar}>
                <TabButton
                    label="Table"
                    active={tab === 'Table'}
                    onPress={() => setTab('Table')}
                />

                <TabButton
                    label="Kitchen"
                    active={tab === 'Kitchen'}
                    onPress={() => setTab('Kitchen')}
                />
            </View>
        </View>
    );
};

const TabButton = ({ label, active, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.tab}
            onPress={onPress}
        >
            <Text style={[ styles.tabText, active && styles.tabActive ]}>{label}</Text>
        </TouchableOpacity>
    );
};

export default MainScreen;