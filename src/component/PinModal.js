import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { colors } from '../styles/theme';

export default function PinModal({ visible, onClose, onSuccess }) {
    
    const [pin, setPin] = useState('');

    const handlePressNumber = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);

            if (newPin.length === 4) {
                setTimeout(() => {
                    if (newPin === '1234') {
                        setPin('');
                        onSuccess();
                    } else {
                        Alert.alert('รหัสผ่านไม่ถูกต้อง', 'กรุณาลองใหม่อีกครั้ง');
                        setPin('');
                    }
                }, 150);
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const handleClose = () => {
        setPin('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>รหัสผ่านเข้าครัว</Text>
                    <Text style={styles.subtitle}>กรุณากดรหัส PIN 4 หลัก</Text>

                    {/* แสดงจุดวงกลม 4 จุดตามจำนวนเลขที่กด */}
                    <View style={styles.dotRow}>
                        {[0, 1, 2, 3].map((index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    pin.length > index && styles.dotFilled,
                                ]}
                            />
                        ))}
                    </View>

                    {/* แป้นพิมพ์ตัวเลข */}
                    <View style={styles.keypad}>
                        {/* แถวที่ 1: 1 2 3 */}
                        <View style={styles.row}>
                            {['1', '2', '3'].map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    style={styles.key}
                                    onPress={() => handlePressNumber(num)}
                                >
                                    <Text style={styles.keyText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* แถวที่ 2: 4 5 6 */}
                        <View style={styles.row}>
                            {['4', '5', '6'].map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    style={styles.key}
                                    onPress={() => handlePressNumber(num)}
                                >
                                    <Text style={styles.keyText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* แถวที่ 3: 7 8 9 */}
                        <View style={styles.row}>
                            {['7', '8', '9'].map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    style={styles.key}
                                    onPress={() => handlePressNumber(num)}
                                >
                                    <Text style={styles.keyText}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* แถวที่ 4: ยกเลิก 0 ลบ */}
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.key, styles.sideKey]}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelText}>ยกเลิก</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.key}
                                onPress={() => handlePressNumber('0')}
                            >
                                <Text style={styles.keyText}>0</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.key, styles.sideKey]}
                                onPress={handleDelete}
                            >
                                <Text style={styles.deleteText}>ลบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 330,
        backgroundColor: colors.white,
        borderRadius: 18,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        elevation: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text1,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.text3,
        marginBottom: 20,
    },
    dotRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: 'transparent',
    },
    dotFilled: {
        backgroundColor: colors.orange,
        borderColor: colors.orange,
    },
    keypad: {
        width: '100%',
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    key: {
        width: 80,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg,
        borderRadius: 12,
    },
    keyText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text1,
    },
    sideKey: {
        backgroundColor: colors.borderLight,
    },
    cancelText: {
        fontSize: 15,
        color: colors.red,
        fontWeight: '600',
    },
    deleteText: {
        fontSize: 15,
        color: colors.text2,
        fontWeight: '600',
    },
});
