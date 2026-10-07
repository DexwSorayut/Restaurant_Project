import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useCart, itemUnitPrice, itemTotal } from '../../context/CartContext';
import { listCategories, listFoods } from '../../db/database';
import { colors } from '../../styles/theme';
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

export default function SummaryScreen({ db, table, onBack, onOrderMore, onPaid }) {
    const { cart, sealedRounds, payNow, grandTotal, roundSubtotal } = useCart();
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([]);
    const [foodCategoryMap, setFoodCategoryMap] = useState({});
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    useEffect(() => {
        if (!db) return;
        (async () => {
            try {
                const cats = await listCategories(db);
                setCategories(cats || []);
                const foods = await listFoods(db);
                const map = {};
                for (const f of foods) {
                    map[f.food_id] = f.category_id;
                }
                setFoodCategoryMap(map);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [db]);

    const handlePay = async () => {
        try {
            const total = await payNow();
            if (total > 0 && onPaid) {
                onPaid();
            }
        } catch (e) {
            console.error('Pay error:', e);
        }
    };

    const getCategoryId = it =>
        it.food?.category_id || foodCategoryMap[it.food?.food_id] || null;

    const filterByCategory = items => {
        if (selectedCategoryId === null) return items;
        return items.filter(it => getCategoryId(it) === selectedCategoryId);
    };

    const keyword = searchText.trim().toLowerCase();

    const filteredSealedRounds = sealedRounds
        .filter(r => {
            if (!keyword) return true;
            return (
                String(r.roundNumber) === keyword ||
                `รอบที่ ${r.roundNumber}`.toLowerCase().includes(keyword)
            );
        })
        .map(r => ({
            ...r,
            items: filterByCategory(r.items),
        }))
        .filter(r => r.items.length > 0);

    const filteredCart = filterByCategory(keyword === '' ? cart : []);

    const hasAnyResults = filteredSealedRounds.length > 0 || filteredCart.length > 0;

    return (
        <View style={s.root}>
            <View style={s.header}>
                <View>
                    <Text style={s.headerTitle}>สรุปยอด</Text>
                    <Text style={{ color: '#fff', opacity: 0.85, fontSize: 13, marginTop: 2 }}>
                        {table?.bill_id ? `บิล #${table.bill_id} · ` : ''}
                        {table?.table_number ? `โต๊ะ ${table.table_number}` : ''}
                    </Text>
                </View>
                <TouchableOpacity style={s.backBtn} onPress={onBack}>
                    <Text style={s.backText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#aaa',
                    paddingHorizontal: 12,
                    height: 42,
                    marginBottom: 10,
                }}>
                    <TextInput
                        style={{ flex: 1, fontSize: 15, color: '#333' }}
                        placeholder="ค้นหารอบที่สั่ง... (เช่น 1, 2)"
                        placeholderTextColor="#888"
                        value={searchText}
                        onChangeText={setSearchText}
                        keyboardType="number-pad"
                    />
                    {searchText !== '' && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Text style={{ color: '#888', fontSize: 14 }}>✕ ล้าง</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 6 }}
                >
                    <TouchableOpacity
                        onPress={() => setSelectedCategoryId(null)}
                        style={{
                            paddingHorizontal: 14,
                            paddingVertical: 7,
                            borderRadius: 18,
                            backgroundColor: selectedCategoryId === null ? colors.primary : '#fff',
                            marginRight: 8,
                            borderWidth: 1,
                            borderColor: selectedCategoryId === null ? colors.primary : '#ddd',
                        }}
                    >
                        <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: selectedCategoryId === null ? '#fff' : '#444',
                        }}>
                            ทั้งหมด
                        </Text>
                    </TouchableOpacity>

                    {categories.map(c => {
                        const active = selectedCategoryId === c.category_id;
                        return (
                            <TouchableOpacity
                                key={c.category_id}
                                onPress={() => setSelectedCategoryId(c.category_id)}
                                style={{
                                    paddingHorizontal: 14,
                                    paddingVertical: 7,
                                    borderRadius: 18,
                                    backgroundColor: active ? colors.primary : '#fff',
                                    marginRight: 8,
                                    borderWidth: 1,
                                    borderColor: active ? colors.primary : '#ddd',
                                }}
                            >
                                <Text style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: active ? '#fff' : '#444',
                                }}>
                                    {c.category_name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {filteredSealedRounds.map(r => (
                    <Round
                        key={r.id}
                        title={`รอบที่ ${r.roundNumber} (สั่งแล้ว)`}
                        items={r.items}
                        subtotal={roundSubtotal(r.items)}
                    />
                ))}

                {filteredCart.length > 0 && (
                    <Round
                        title="ยังไม่ได้กดสั่ง (ในตะกร้า)"
                        items={filteredCart}
                        subtotal={roundSubtotal(filteredCart)}
                    />
                )}

                {!hasAnyResults && (
                    <Text style={s.empty}>
                        {keyword ? 'ไม่พบรอบที่ค้นหา' : 'ไม่พบรายการอาหารในหมวดหมู่นี้'}
                    </Text>
                )}
            </ScrollView>

            <View style={s.footer}>
                <Text style={s.total}>ยอดรวมทุกรอบ {fmt(grandTotal)}</Text>
                <View style={s.footerRow}>
                    <TouchableOpacity style={[s.btn, s.btnMore]} onPress={onOrderMore}>
                        <Text style={s.btnText}>สั่งอาหารเพิ่ม</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
        </View>
    );
}
