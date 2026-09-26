import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { useCart, itemUnitPrice, itemTotal } from '../../context/cartContext';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/cartScreenStyle';

const fmt = satang => `${(satang / 100).toFixed(2)} บาท`;

export default function CartScreen({ onBack, onGoSummary }) {
    const { cart, sealedRounds, setItemQty, removeItem, placeOrder, roundSubtotal } = useCart();
    const [removeIndex, setRemoveIndex] = useState(null);

    const handleMinus = (it, i) => {
        if (it.qty > 1) setItemQty({ scope: 'current' }, i, it.qty - 1);
        else setRemoveIndex(i);
    };

    const confirmRemove = yes => {
        if (yes && removeIndex !== null) removeItem({ scope: 'current' }, removeIndex);
        setRemoveIndex(null);
    };

    const handlePlaceOrder = async () => {
        try {
            await placeOrder(); // ตะกร้าว่างทันที
        } catch (e) {
            console.error('Place order error:', e);
        }
    };

    const hasAnything = cart.length > 0 || sealedRounds.length > 0;

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ตะกร้า</Text>
                <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {cart.length === 0 && <Text style={styles.empty}>ตะกร้าว่าง</Text>}
                {cart.map((it, i) => (
                    <View key={it.key} style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{it.food.food_name}</Text>
                            {(it.addons || []).length > 0 && (
                                <Text style={styles.note}>
                                    {it.addons.map(a => `+${a.name} (${a.price / 100})`).join('  ')}
                                </Text>
                            )}
                            {it.note ? <Text style={styles.note}>หมายเหตุ: {it.note}</Text> : null}
                            <Text style={styles.itemText}>{fmt(itemUnitPrice(it))} x {it.qty} = {fmt(itemTotal(it))}</Text>
                        </View>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => handleMinus(it, i)}>
                            <Text style={styles.qtyText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyNum}>{it.qty}</Text>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => setItemQty({ scope: 'current' }, i, it.qty + 1)}
                        >
                            <Text style={styles.qtyText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                {cart.length > 0 && (
                    <Text style={styles.total}>รวมตะกร้านี้ {fmt(roundSubtotal(cart))}</Text>
                )}
                <View style={styles.footerRow}>
                    <TouchableOpacity style={[styles.btn, styles.btnLight]} onPress={onBack}>
                        <Text style={[styles.btnText, { color: colors.primary }]}>กลับไปเลือกอาหาร</Text>
                    </TouchableOpacity>
                    {cart.length > 0 && (
                        <TouchableOpacity style={[styles.btn, styles.btnOrder]} onPress={handlePlaceOrder}>
                            <Text style={styles.btnText}>สั่งอาหาร</Text>
                        </TouchableOpacity>
                    )}
                    {hasAnything && (
                        <TouchableOpacity style={[styles.btn, styles.btnPay]} onPress={onGoSummary}>
                            <Text style={styles.btnText}>สรุปยอด / ชำระเงิน</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Modal visible={removeIndex !== null} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalText}>ต้องการลบสินค้าออกจากรายการใช่หรือไม่?</Text>
                        <View style={styles.footerRow}>
                            <TouchableOpacity style={[styles.btn, styles.btnGray]} onPress={() => confirmRemove(false)}>
                                <Text style={[styles.btnText, { color: '#111' }]}>ไม่ใช่</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => confirmRemove(true)}>
                                <Text style={styles.btnText}>ใช่</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}