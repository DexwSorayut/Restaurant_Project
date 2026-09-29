import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal, TextInput, Alert } from 'react-native';
import { listCategories, listFoods, closeBill } from '../../db/database';
import { styles } from '../../styles/foodsScreenStyles';
import { colors } from '../../styles/theme';
import CartScreen from '../cart/cartScreen';
import SummaryScreen from '../cart/summaryScreen';
import AddItemScreen from './addItemScreen';

export default function FoodScreen({
    db,
    table,
    onBack,
    onBillClosed,
}) {

    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] =useState(null);
    const [currentScreen, setCurrentScreen] = useState('food');
    const [selectedFood, setSelectedFood] = useState(null);
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const [employeePin, setEmployeePin] = useState('');
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState(null); // null | 'asc' | 'desc'
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const categoryData =
                await listCategories(db);

            const foodData =
                await listFoods(db);

            setCategories(categoryData);
            setFoods(foodData);
        } catch (error) {
            console.error(
                'Load food data error:',
                error
            );
        }
    };

    let filteredFoods = selectedCategoryId === null
        ? foods
        : foods.filter(food => food.category_id === selectedCategoryId);

    if (searchText.trim() !== '') {
        filteredFoods = filteredFoods.filter(food =>
            food.food_name.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    if (sortOrder === 'asc') {
        filteredFoods = [...filteredFoods].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
        filteredFoods = [...filteredFoods].sort((a, b) => b.price - a.price);
    }

    const formatPrice = (price) => {
        return `${(price / 100).toFixed(2)} บาท`;
    };

    const handleBack = () => {
        setEmployeePin('');
        setPinModalVisible(true);
    };

    const handleEmployeeLogin = () => {
        if (employeePin !== '1234') {
            Alert.alert(
                'รหัสไม่ถูกต้อง',
                'กรุณาตรวจสอบรหัสพนักงานอีกครั้ง'
            );
            return;
        }
        setEmployeePin('');
        setPinModalVisible(false);
        if (onBack) {
            onBack();
        }
    };

    const handleAddFood = (food) => {
        setSelectedFood(food);
        setCurrentScreen('add');
    };

    const handleOpenCart = () => {
        setCurrentScreen('cart');
    };

    const handleBackFromAdd = () => {
        setSelectedFood(null);
        setCurrentScreen('food');
    };

    const handleAdded = () => {
        setSelectedFood(null);
        setCurrentScreen('food');
    };

    const handleBackFromCart = () => {
        setCurrentScreen('food');
    };

    if (currentScreen === 'add') {
        return (
            <AddItemScreen
                db={db}
                table={table}
                food={selectedFood}
                onBack={handleBackFromAdd}
                onAdded={handleAdded}
            />
        );
    }

    if (currentScreen === 'cart') {
        return (
            <CartScreen
                db={db}
                table={table}
                onBack={handleBackFromCart}
                onGoSummary={() => {
                    setCurrentScreen('summary');
                }}
            />
        );
    }

    if (currentScreen === 'summary') {
        return (
            <SummaryScreen
                db={db}
                table={table}
                onBack={() => setCurrentScreen('cart')}
                onOrderMore={() => setCurrentScreen('food')}
                onPaid={() => {
                    setCurrentScreen('food');
                    if (onBillClosed) onBillClosed();
                }}
            />
        );
    }


    const renderFood = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.foodCard}
                activeOpacity={0.8}
            >
                {item.image ? (
                    <Image
                        source={item.image}
                        style={styles.foodImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.foodImagePlaceholder}>
                        <Text style={styles.foodImagePlaceholderText}>
                            ไม่มีรูป
                        </Text>
                    </View>
                )}

                <View style={styles.foodInfo}>
                    <Text style={styles.foodName} numberOfLines={2}>{item.food_name}</Text>
                    <Text style={styles.foodPrice}>{formatPrice(item.price)}</Text>
                    <TouchableOpacity
                        style={styles.addFoodButton}
                        activeOpacity={0.8}
                        onPress={() => handleAddFood(item)}
                    >
                        <Text style={styles.addFoodButtonText}>
                            +
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <>
        <View style={styles.foodRoot}>
            <View style={[styles.foodHeader , { backgroundColor: colors.primary}]}>
                <Text style={styles.foodHeaderTitle}>
                    สั่งอาหาร
                </Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                >
                    <Text style={styles.backButtonText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.foodContent}>
                <View style={styles.categorySidebar}>
                    <Text style={styles.categoryTitle}>
                        หมวดอาหาร
                    </Text>
                    <TouchableOpacity
                        style={[ styles.categoryButton, selectedCategoryId === null && styles.categoryButtonActive ]}
                        onPress={() =>
                            setSelectedCategoryId(null)
                        }
                    >
                        <Text style={[ styles.categoryText, selectedCategoryId === null && styles.categoryTextActive ]}>
                            ทั้งหมด
                        </Text>

                    </TouchableOpacity>

                    {categories.map(category => (
                        <TouchableOpacity
                            key={category.category_id}
                            style={[ styles.categoryButton, selectedCategoryId === category.category_id && styles.categoryButtonActive ]}
                            onPress={() =>
                                setSelectedCategoryId(
                                    category.category_id
                                )
                            }
                        >
                            <Text style={[ styles.categoryText, selectedCategoryId === category.category_id && styles.categoryTextActive ]}>
                                {category.category_name}
                           </Text>
                        </TouchableOpacity>
                    ))}
                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={() => handleOpenCart()}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cartButtonText}>
                                รายการในตะกร้า
                            </Text>
                        </TouchableOpacity>
                </View>
                <View style={styles.foodListContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={styles.foodListTitle}>
                            {selectedCategoryId === null
                                ? 'อาหารทั้งหมด'
                                : categories.find(c => c.category_id === selectedCategoryId)?.category_name
                            }
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#aaa',
                                borderRadius: 6,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                marginLeft: 10,
                                width: 180,
                                fontSize: 14,
                                backgroundColor: '#fff',
                            }}
                            placeholder="ค้นหาชื่อเมนู..."
                            value={searchText}
                            onChangeText={setSearchText}
                            keyboardType="default"
                            autoCorrect={false}
                            autoCapitalize="none"
                        />

                        <View style={{ flex: 1 }} />

                        <View style={{ position: 'relative' }}>
                            <TouchableOpacity
                                onPress={() => setShowSortDropdown(!showSortDropdown)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#aaa',
                                    borderRadius: 6,
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    backgroundColor: '#fff',
                                    minWidth: 130,
                                }}
                            >
                                <Text style={{ fontSize: 13, color: '#333', flex: 1 }}>
                                    {sortOrder === 'asc' ? 'ราคาต่ำ-สูง' : sortOrder === 'desc' ? 'ราคาสูง-ต่ำ' : 'เรียงตามราคา'}
                                </Text>
                                <Text style={{ fontSize: 11, color: '#666' }}>▼</Text>
                            </TouchableOpacity>

                            {showSortDropdown && (
                                <View style={{
                                    position: 'absolute',
                                    top: 36,
                                    right: 0,
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 6,
                                    zIndex: 999,
                                    minWidth: 130,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }}>
                                    <TouchableOpacity
                                        onPress={() => { setSortOrder('asc'); setShowSortDropdown(false); }}
                                        style={{ paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                                    >
                                        <Text style={{ fontSize: 13, color: '#333' }}>ราคาต่ำ-สูง</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { setSortOrder('desc'); setShowSortDropdown(false); }}
                                        style={{ paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                                    >
                                        <Text style={{ fontSize: 13, color: '#333' }}>ราคาสูง-ต่ำ</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { setSortOrder(null); setShowSortDropdown(false); }}
                                        style={{ paddingHorizontal: 12, paddingVertical: 10 }}
                                    >
                                        <Text style={{ fontSize: 13, color: '#888' }}>ยกเลิกการเรียง</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    <FlatList
                        data={filteredFoods}
                        keyExtractor={item => String(item.food_id)}
                        renderItem={renderFood}
                        numColumns={4}
                        columnWrapperStyle={styles.foodRow}
                        contentContainerStyle={styles.foodList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
        <Modal
            visible={pinModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                setEmployeePin('');
                setPinModalVisible(false);
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.openTableModal}>

                    <Text style={styles.modalTitle}>
                        ออกจากโต๊ะ
                    </Text>

                    <Text style={styles.modalDescription}>
                        กรุณาใส่รหัสพนักงานเพื่อกลับไปเลือกโต๊ะ
                    </Text>

                    <TextInput
                        style={styles.customerInput}
                        value={employeePin}
                        onChangeText={setEmployeePin}
                        placeholder="รหัสพนักงาน"
                        placeholderTextColor={colors.dim}
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={6}
                        autoFocus
                    />

                    <View style={styles.modalButtons}>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => {
                                setEmployeePin('');
                                setPinModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalCancelText}>
                                ยกเลิก
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalConfirmButton}
                            onPress={handleEmployeeLogin}
                        >
                            <Text style={styles.modalConfirmText}>
                                ยืนยัน
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
}