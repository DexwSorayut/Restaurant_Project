import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { styles } from '../../styles/addItemScreenStyles';
import { useCart } from '../../context/cartContext';

const ADDONS = [
    { id: 'egg', name: 'ไข่ดาว', price: 1000 },
    { id: 'rice', name: 'ข้าวเพิ่ม', price: 1000 },
    { id: 'special', name: 'พิเศษ', price: 2000 },
];

const FOOD_OPTIONS = [
    'ไม่เผ็ด',
    'เผ็ดน้อย',
    'เผ็ดมาก',
    'ไม่ผัก',
    'ไม่กระเทียม',
    'ไม่ใส่ผงชูรส',
    'ไม่ใส่ต้นหอม',
    'ไม่ใส่ผักชี',
    'ไม่ใส่พริก',
    'แยกน้ำจิ้ม',
    'แยกเครื่องปรุง',
    'อื่น ๆ',
];

const DRINK_OPTIONS = [
    'หวานน้อย',
    'ไม่หวาน',
    'หวานปกติ',
    'หวานมาก',
    'น้ำแข็งน้อย',
    'ไม่ใส่น้ำแข็ง',
    'แยกน้ำแข็ง',
    'เย็นปกติ',
    'เพิ่มน้ำแข็ง',
    'แยกน้ำ',
    'ไม่ใส่นม',
    'อื่น ๆ',
];

export default function AddItemScreen({ food, onBack, onAdded }) {
    const { addItem } = useCart();
    const [qty, setQty] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const selectedAddons = ADDONS.filter(a => selectedIds.includes(a.id));
    const addonSum = selectedAddons.reduce((s, a) => s + a.price, 0);
    const unitPrice = food.price + addonSum;
    const fmt = satang => `฿${satang / 100}`;
    const isDrink = food.category_name === 'เครื่องดื่ม';
    const options = isDrink ? DRINK_OPTIONS : FOOD_OPTIONS;

    const toggleAddon = id => {
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    };
    
    const toggleOption = option => {
        setSelectedOptions(prev => prev.includes(option) ? prev.filter(x => x !== option) : [...prev, option]);
    };

    const handleAdd = () => {
        const note = selectedOptions.join(', ');
        addItem(food, qty, note, selectedAddons);
        onAdded();
    };

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                
                <Text style={styles.headerTitle}>เพิ่มรายการอาหาร</Text>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={onBack}
                >
                    <Text style={styles.backButtonText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <View style={styles.dishHead}>
                    <View style={styles.dishThumb}>
                        {food.image ? (
                            <Image source={food.image} style={styles.dishThumbImage} resizeMode="cover" />
                        ) : (
                            <Text style={styles.dishThumbText}>ไม่มีรูป</Text>
                        )}
                    </View>
                    <View>
                        <Text style={styles.dishName}>{food.food_name}</Text>
                        <Text style={styles.dishUnitPrice}>{fmt(food.price)} / รายการ</Text>
                    </View>
                </View>

                <Text style={styles.fieldLabel}>บวกเพิ่ม</Text>
                <View style={styles.addonWrap}>
                    {ADDONS.map(addon => {
                        const on = selectedIds.includes(addon.id);
                        return (
                            <TouchableOpacity
                                key={addon.id}
                                style={[styles.addon, on && styles.addonOn]}
                                onPress={() => toggleAddon(addon.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.box}>{on ? '☑' : '☐'}</Text>
                                <Text style={styles.addonText}>
                                    {addon.name} +{addon.price / 100}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.fieldLabel}>ความต้องการพิเศษ</Text>
                <Text style={styles.optionGroupTitle}>{isDrink ? 'สำหรับเครื่องดื่ม' : 'สำหรับอาหาร'}</Text>
                <View style={styles.addonWrap}>
                    {options.map(option => {
                        const selected = selectedOptions.includes(option);

                        return (
                            <TouchableOpacity
                                key={option}
                                style={[styles.optionButton,selected && styles.optionButtonOn]}
                                onPress={() => toggleOption(option)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.box}>{selected ? '☑' : '☐'}</Text>

                                <Text 
                                    style={styles.addonText}
                                    numberOfLines={1}
                                >
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.fieldLabel}>จำนวน</Text>
                <View style={styles.qtyRow}>
                    <TouchableOpacity
                        style={[styles.qtyBtn, qty <= 1 && { opacity: 0.4 }]}
                        disabled={qty <= 1}
                        onPress={() => setQty(qty - 1)}
                    >
                        <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNum}>{qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                        <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>ราคารวม</Text>
                    <Text style={styles.totalValue}>{fmt(qty * unitPrice)}</Text>
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
                    <Text style={styles.primaryButtonText}>เพิ่มลงตะกร้า</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}