import React, { useEffect, useState } from 'react'; 
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, Modal, Alert } from 'react-native'; 
import { listCategories, listFoods } from '../../db/database'; 
import { styles } from '../../styles/foodsScreenStyles'; 
import { colors } from '../../styles/theme'; 
import { useCart } from '../../context/CartContext'; 
import { AddPic } from '../../foodsPic/AddPic'; 
 
 
export default function FoodScreen({ db, onBack, onSelectFood, onGoCart }) { 
 
    const [categories, setCategories] = useState([]); 
    const [foods, setFoods] = useState([]); 
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); 
    const { cart } = useCart(); 
    const [searchText, setSearchText] = useState(''); 

    // เพิ่มสำหรับรหัสพนักงาน
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const [employeePin, setEmployeePin] = useState('');
 
    useEffect(() => { 
        loadData(); 
    }, []); 
 
    const loadData = async () => { 
        try { 
            const categoryData = await listCategories(db); 
            const foodData = await listFoods(db); 
 
            setCategories(categoryData); 
            setFoods(foodData); 
        } catch (error) { 
            console.error('Load food data error:', error); 
        } 
    }; 
 
    let filteredFoods = 
        selectedCategoryId === null 
            ? foods 
            : foods.filter(food => food.category_id === selectedCategoryId); 
 
    if (searchText.trim() !== '') { 
        filteredFoods = filteredFoods.filter(food => 
            food.food_name.toLowerCase().includes(searchText.toLowerCase()) 
        ); 
    } 
 
    const formatPrice = (price) => { 
        return `${(price / 100).toFixed(2)} บาท`; 
    }; 

    // เพิ่มสำหรับเปิดหน้ากรอกรหัสพนักงาน
    const handleBack = () => {
        setEmployeePin('');
        setPinModalVisible(true);
    };

    // เพิ่มสำหรับตรวจสอบรหัสพนักงาน
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
 
    const renderFood = ({ item }) => { 
        const imageSource = AddPic(item.image); 
 
        return ( 
            <TouchableOpacity 
                style={styles.foodCard} 
                activeOpacity={0.8} 
                onPress={() => onSelectFood(item)} 
            > 
                {imageSource ? ( 
                    <Image 
                        source={imageSource} 
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
                    <Text style={styles.foodName} numberOfLines={2}> 
                        {item.food_name} 
                    </Text> 
                    <Text style={styles.foodPrice}> 
                        {formatPrice(item.price)} 
                    </Text> 
 
                    <TouchableOpacity 
                        style={styles.addFoodButton} 
                        activeOpacity={0.8} 
                        onPress={() => onSelectFood(item)} 
                    > 
                        <Text style={styles.addFoodButtonText}>+</Text> 
                    </TouchableOpacity> 
                </View> 
            </TouchableOpacity> 
        ); 
    }; 
 
    return ( 
        <View style={styles.foodRoot}> 
            <View style={[styles.foodHeader, { backgroundColor: colors.primary }]}> 
                <Text style={styles.foodHeaderTitle}> 
                    รายการอาหาร 
                </Text> 
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="ค้นหาชื่อเมนู..." 
                    placeholderTextColor={colors.dim} 
                    value={searchText} 
                    onChangeText={setSearchText} 
                    keyboardType="default" 
                    autoCorrect={false} 
                    autoCapitalize="none" 
                /> 
                <View style={styles.headerRight}> 
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={handleBack}
                    > 
                        <Text style={styles.backButtonText}> 
                            กลับ 
                        </Text> 
                    </TouchableOpacity> 
                </View> 
            </View> 
 
            <View style={styles.foodContent}> 
                <View style={styles.categorySidebar}> 
                    <Text style={styles.categoryTitle}> 
                        หมวดอาหาร 
                    </Text> 
 
                    <TouchableOpacity 
                        style={[ 
                            styles.categoryButton, 
                            selectedCategoryId === null && styles.categoryButtonActive, 
                        ]} 
                        onPress={() => setSelectedCategoryId(null)} 
                    > 
                        <Text 
                            style={[ 
                                styles.categoryText, 
                                selectedCategoryId === null && styles.categoryTextActive, 
                            ]} 
                        > 
                            ทั้งหมด 
                        </Text> 
                    </TouchableOpacity> 
 
                    {categories.map(category => ( 
                        <TouchableOpacity 
                            key={category.category_id} 
                            style={[ 
                                styles.categoryButton, 
                                selectedCategoryId === category.category_id && 
                                styles.categoryButtonActive, 
                            ]} 
                            onPress={() => setSelectedCategoryId(category.category_id)} 
                        > 
                            <Text 
                                style={[ 
                                    styles.categoryText, 
                                    selectedCategoryId === category.category_id && 
                                    styles.categoryTextActive, 
                                ]} 
                            > 
                                {category.category_name} 
                            </Text> 
                        </TouchableOpacity> 
                    ))} 
                </View> 
 
                <View style={styles.foodListContainer}> 
                    <Text style={styles.foodListTitle}> 
                        {selectedCategoryId === null 
                            ? 'อาหารทั้งหมด' 
                            : categories.find( 
                                category => category.category_id === selectedCategoryId 
                            )?.category_name} 
                    </Text> 
 
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
 
            <TouchableOpacity 
                style={styles.floatingCart} 
                onPress={onGoCart} 
                activeOpacity={0.85} 
            > 
                <Text style={styles.cartButtonText}>ตะกร้า</Text> 
                {cart.length > 0 && ( 
                    <View style={styles.cartBadge}> 
                        <Text style={styles.cartBadgeText}>{cart.length}</Text> 
                    </View> 
                )} 
            </TouchableOpacity> 

            {/* เพิ่ม Modal สำหรับกรอกรหัสพนักงาน */}
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
                            ออกจากรายการอาหาร
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
        </View> 
    ); 
}