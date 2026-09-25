import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useCart, itemUnitPrice, itemTotal } from '../../context/CartContext';
import { s } from '../../styles/SummaryScreenStyles';

const fmt = satang => `${(satang / 100).toFixed(2)} บาท`;

function Round({ title, items, subtotal }) {
    return (
        <View style={s.card}>
            <Text style={s.roundTitle}>{title}</Text>
            {items.map((it, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={s.itemName}>{it.food.food_name} x{it.qty}</Text>
                    {(it.addons || []).length > 0 && (
                        <Text style={s.note}>
                            {it.addons.map(a => `+${a.name} (${a.price / 100})`).join('  ')}
                        </Text>
                    )}
                    {it.note ? <Text style={s.note}>หมายเหตุ: {it.note}</Text> : null}
                    <Text style={s.itemText}>{fmt(itemUnitPrice(it))} x {it.qty} = {fmt(itemTotal(it))}</Text>
                </View>
            ))}
            <Text style={s.subtotal}>รวม {fmt(subtotal)}</Text>
        </View>
    );
}

export default function SummaryScreen({ onBack, onOrderMore, onPaid }) {
    const { cart, sealedRounds, payNow, grandTotal, roundSubtotal } = useCart();

    const handlePay = async () => {
        try {
            const total = await payNow();
            if (total > 0) onPaid(); // ชำระแล้วกลับหน้ารายการอาหาร
        } catch (e) {
            console.error('Pay error:', e);
        }
    };

    return (
        <View style={s.root}>
            <View style={s.header}>
                <Text style={s.headerTitle}>สรุปยอด</Text>
                <TouchableOpacity style={s.backBtn} onPress={onBack}>
                    <Text style={s.backText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content}>
                {sealedRounds.map(r => (
                    <Round
                        key={r.id}
                        title={`รอบที่ ${r.roundNumber} (สั่งแล้ว)`}
                        items={r.items}
                        subtotal={roundSubtotal(r.items)}
                    />
                ))}
                {cart.length > 0 && (
                    <Round title="ยังไม่ได้กดสั่ง" items={cart} subtotal={roundSubtotal(cart)} />
                )}
                {sealedRounds.length === 0 && cart.length === 0 && (
                    <Text style={s.empty}>ยังไม่มีรายการ</Text>
                )}
            </ScrollView>

            <View style={s.footer}>
                <Text style={s.total}>ยอดรวมทุกรอบ {fmt(grandTotal)}</Text>
                <View style={s.footerRow}>
                    <TouchableOpacity style={[s.btn, s.btnMore]} onPress={onOrderMore}>
                        <Text style={s.btnText}>สั่งอาหารเพิ่ม</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[s.btn, s.btnPay, grandTotal === 0 && { opacity: 0.4 }]}
                        disabled={grandTotal === 0}
                        onPress={handlePay}
                    >
                        <Text style={s.btnText}>ชำระเงิน</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

