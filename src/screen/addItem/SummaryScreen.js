import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useCart, itemUnitPrice, itemTotal } from '../../context/CartContext';
import { listCategories, listFoods, getBillDetails } from '../../db/database';
import { colors } from '../../styles/theme';
import { s } from '../../styles/SummaryScreenStyles';

const fmt = satang => `${(Number(satang) / 100).toFixed(2)} บาท`;

// รวมยอดของรอบ โดยไม่นับรายการที่ถูกยกเลิก
const dbRoundTotal = items =>
    items.reduce((sum, it) => (it.status === 'CANCELLED' ? sum : sum + Number(it.item_total)), 0);

// การ์ดแสดงรอบที่สั่งไปแล้ว (ข้อมูลจาก SQLite เหมือนหน้า DetailScreen)
function DbRound({ title, items }) {
    return (
        <View style={s.card}>
            <Text style={s.roundTitle}>{title}</Text>
            {items.map(it => {
                const cancelled = it.status === 'CANCELLED';
                // รายการที่ยกเลิก แสดงเป็นตัวจาง + ขีดฆ่า
                const cancelStyle = cancelled
                    ? { color: '#9CA3AF', textDecorationLine: 'line-through' }
                    : null;
                return (
                    <View key={it.item_id} style={{ marginBottom: 6 }}>
                        <Text style={[s.itemName, cancelStyle]}>
                            {it.food_name} x{it.quantity}
                        </Text>
                        {it.note ? <Text style={s.note}>หมายเหตุ: {it.note}</Text> : null}
                        <Text style={[s.itemText, cancelStyle]}>
                            {fmt(it.unit_price)} x {it.quantity} = {fmt(it.item_total)}
                        </Text>
                        {cancelled ? <Text style={{ color: '#EF4444', fontSize: 12 }}>ยกเลิก</Text> : null}
                    </View>
                );
            })}
            <Text style={s.subtotal}>รวม {fmt(dbRoundTotal(items))}</Text>
        </View>
    );
}

// การ์ดแสดงของในตะกร้าที่ยังไม่กดสั่ง (ยังใช้ข้อมูลจาก CartContext เหมือนเดิม)
function CartRound({ title, items, subtotal }) {
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
    // sealedRounds ไม่ใช้แสดงผลแล้ว เก็บไว้แค่เป็นสัญญาณว่ามีการกดสั่งรอบใหม่ จะได้โหลด DB ใหม่
    const { cart, sealedRounds, payNow, roundSubtotal } = useCart();
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState([]);
    const [foodCategoryMap, setFoodCategoryMap] = useState({});     // food_id -> category_id
    const [foodNameCategoryMap, setFoodNameCategoryMap] = useState({}); // food_name -> category_id (สำรอง)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // ข้อมูลบิลจาก SQLite (ไม่หายตอนรีแอป)
    const [billItems, setBillItems] = useState([]);
    const [billTotal, setBillTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    // โหลดหมวดหมู่และเมนู เพื่อใช้กรองตามหมวด
    useEffect(() => {
        if (!db) return;
        (async () => {
            try {
                const cats = await listCategories(db);
                setCategories(cats || []);
                const foods = await listFoods(db);
                const byId = {};
                const byName = {};
                for (const f of foods) {
                    byId[f.food_id] = f.category_id;
                    byName[f.food_name] = f.category_id;
                }
                setFoodCategoryMap(byId);
                setFoodNameCategoryMap(byName);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [db]);

    // โหลดรายการทุกรอบของบิลจาก DB (ใช้ฟังก์ชันเดียวกับหน้า DetailScreen)
    const loadBill = useCallback(async () => {
        if (!db || !table?.bill_id) {
            setLoading(false);
            return;
        }
        try {
            const result = await getBillDetails(db, table.bill_id);
            setBillItems(result.items || []);
            setBillTotal(result.billTotal || 0);
        } catch (e) {
            console.error('Load bill error:', e);
        } finally {
            setLoading(false);
        }
    }, [db, table?.bill_id]);

    // โหลดตอนเปิดหน้า และโหลดใหม่ทุกครั้งที่มีการกดสั่งรอบใหม่
    useEffect(() => {
        loadBill();
    }, [loadBill, sealedRounds.length]);

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

    // หาหมวดของรายการในตะกร้า (ข้อมูลจาก context)
    const getCartCategoryId = it =>
        it.food?.category_id || foodCategoryMap[it.food?.food_id] || null;

    // หาหมวดของรายการจาก DB: ลองจาก food_id ก่อน ถ้าไม่มีค่อยใช้ชื่อเมนู
    const getDbCategoryId = it =>
        it.category_id || foodCategoryMap[it.food_id] || foodNameCategoryMap[it.food_name] || null;

    const filterBy = (items, getCat) => {
        if (selectedCategoryId === null) return items;
        return items.filter(it => getCat(it) === selectedCategoryId);
    };

    // จัดกลุ่มรายการจาก DB ตามรอบ (เหมือน DetailScreen)
    const roundList = Object.values(
        billItems.reduce((groups, it) => {
            if (!groups[it.round_id]) {
                groups[it.round_id] = {
                    round_id: it.round_id,
                    round_number: it.round_number,
                    items: [],
                };
            }
            groups[it.round_id].items.push(it);
            return groups;
        }, {})
    ).sort((a, b) => a.round_number - b.round_number);

    const keyword = searchText.trim().toLowerCase();

    // กรองตามคำค้น (เลขรอบ) และหมวดหมู่
    const filteredRounds = roundList
        .filter(r => {
            if (!keyword) return true;
            return (
                String(r.round_number) === keyword ||
                `รอบที่ ${r.round_number}`.toLowerCase().includes(keyword)
            );
        })
        .map(r => ({ ...r, items: filterBy(r.items, getDbCategoryId) }))
        .filter(r => r.items.length > 0);

    const filteredCart = filterBy(keyword === '' ? cart : [], getCartCategoryId);

    const hasAnyResults = filteredRounds.length > 0 || filteredCart.length > 0;

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

                {/* ระหว่างโหลดข้อมูลจาก DB */}
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
                ) : (
                    <>
                        {filteredRounds.map(r => (
                            <DbRound
                                key={r.round_id}
                                title={`รอบที่ ${r.round_number} (สั่งแล้ว)`}
                                items={r.items}
                            />
                        ))}

                        {filteredCart.length > 0 && (
                            <CartRound
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
                    </>
                )}
            </ScrollView>

            <View style={s.footer}>
                {/* ยอดรวมจาก DB ตรงกับหน้ารายละเอียดบิล (ไม่รวมรายการที่ยกเลิก) */}
                <Text style={s.total}>ยอดรวมทุกรอบ {fmt(billTotal)}</Text>
                <View style={s.footerRow}>
                    <TouchableOpacity style={[s.btn, s.btnMore]} onPress={onOrderMore}>
                        <Text style={s.btnText}>สั่งอาหารเพิ่ม</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}