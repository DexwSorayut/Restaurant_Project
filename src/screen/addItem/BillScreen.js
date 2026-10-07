import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { listClosedBills, getClosedBillDetail } from '../../db/database';
import { styles } from '../../styles/billStyleScreenStyle';

export default function BillScreen({ db }) {

    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [billDetail, setBillDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadBills = async () => {
        try {
            setLoading(true);

            const data = await listClosedBills(db);

            setBills(data);

        } catch (error) {
            console.error('Load bills error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBills();
    }, []);

    const openBill = async (bill) => {

        try {

            setLoading(true);

            const detail = await getClosedBillDetail(
                db,
                bill.bill_id
            );

            setBillDetail(detail);
            setSelectedBill(bill);

        } catch (error) {

            console.error(
                'Load bill detail error:',
                error
            );

        } finally {

            setLoading(false);

        }
    };

    // รายละเอียดบิล
    if (selectedBill) {
        return (
            <View style={styles.billScreen}>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            setSelectedBill(null);
                            setBillDetail(null);
                        }}
                    >
                        <Text style={styles.backButtonText}>
                            กลับ
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>
                        รายละเอียดบิล
                    </Text>

                    <Text>
                        บิล #{billDetail?.bill?.bill_number}
                    </Text>

                    <Text>
                        โต๊ะ {billDetail?.bill?.table_number}
                    </Text>

                    <Text>
                        จำนวนลูกค้า {billDetail?.bill?.customer_count} คน
                    </Text>

                    <Text>
                        ยอดรวม{' '}
                        {(
                            (billDetail?.bill?.total_amount ?? 0) / 100
                        ).toLocaleString()}
                        {' '}บาท
                    </Text>

                    <Text style={styles.sectionTitle}>
                        ______________________________________________________________________________________________________
                    </Text>

                    {/* หัวตาราง */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 15,
                                fontWeight: '600',
                            }}
                        >
                            รายการอาหาร
                        </Text>

                        <Text
                            style={{
                                width: 100,
                                textAlign: 'center',
                                fontSize: 15,
                                fontWeight: '600',
                            }}
                        >
                            จำนวน
                        </Text>

                        <Text
                            style={{
                                width: 130,
                                textAlign: 'right',
                                fontSize: 15,
                                fontWeight: '600',
                            }}
                        >
                            ราคา
                        </Text>
                    </View>

                    {billDetail?.items?.map((item) => {

                        const noteParts =
                            item.note
                                ? item.note.split(' ')
                                : [];

                        const addons = noteParts.filter(
                            part => part.startsWith('+')
                        );

                        const note = noteParts
                            .filter(
                                part => !part.startsWith('+')
                            )
                            .join(' ');

                        return (
                            <View
                                key={item.item_id}
                                style={{
                                    flexDirection: 'row',
                                    marginBottom: 16,
                                }}
                            >

                                {/* รายการอาหาร */}
                                <View style={{ flex: 1 }}>

                                    <Text
                                        style={{
                                            fontSize: 17,
                                            fontWeight: '600',
                                        }}
                                    >
                                        {item.food_name}
                                    </Text>

                                    {addons.length > 0 && (
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginTop: 3,
                                                color: '#6B7280',
                                            }}
                                        >
                                            {addons.join('  ')}
                                        </Text>
                                    )}

                                    {note && (
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginTop: 3,
                                                color: '#6B7280',
                                            }}
                                        >
                                            หมายเหตุ: {note}
                                        </Text>
                                    )}

                                </View>

                                {/* จำนวน */}
                                <View
                                    style={{
                                        width: 100,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                        }}
                                    >
                                        {item.quantity}
                                    </Text>
                                </View>

                                {/* ราคา */}
                                <View
                                    style={{
                                        width: 130,
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 17,
                                            fontWeight: '600',
                                        }}
                                    >
                                        {(
                                            item.unit_price *
                                            item.quantity /
                                            100
                                        ).toLocaleString()}
                                        {' '}บาท
                                    </Text>
                                </View>

                            </View>
                        );
                    })}

                </ScrollView>

            </View>
        );
    }

    // =========================
    // รายการบิล
    // =========================

    return (
        <View style={styles.billScreen}>

            <Text style={styles.sectionTitle}>
                ตรวจสอบบิล
            </Text>

            {/* แถบค้นหา */}
            <View style={styles.billFilterRow}>

                <View style={styles.billSearchBox}>
                    <Text style={styles.billFilterLabel}>
                        ค้นหาด้วยรหัสบิล
                    </Text>

                    <View style={styles.billInput}>
                        <Text style={styles.billInputText}>
                            🔍  ค้นหารหัสบิล
                        </Text>
                    </View>
                </View>

                <View style={styles.billTableFilter}>
                    <Text style={styles.billFilterLabel}>
                        โต๊ะ
                    </Text>

                    <View style={styles.billInput}>
                        <Text style={styles.billInputText}>
                            โต๊ะทั้งหมด  ▼
                        </Text>
                    </View>
                </View>

            </View>

            {/* รายการบิล */}
            <ScrollView
                style={styles.billList}
                contentContainerStyle={styles.billListContent}
            >

                {bills.map((bill) => (

                    <TouchableOpacity
                        key={bill.bill_id}
                        style={styles.billRow}
                        onPress={() => openBill(bill)}
                    >

                        <View style={styles.billMainInfo}>

                            <Text style={styles.billNumber}>
                                บิล #{bill.bill_number}
                            </Text>

                            <Text style={styles.billTable}>
                                โต๊ะ {bill.table_number}
                            </Text>

                        </View>

                        <View style={styles.billTimeInfo}>

                            <Text style={styles.billDate}>
                                {new Date(
                                    bill.closed_at
                                ).toLocaleDateString(
                                    'th-TH',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    }
                                )}
                            </Text>

                            <Text style={styles.billTime}>
                                {new Date(
                                    bill.closed_at
                                ).toLocaleTimeString(
                                    'th-TH',
                                    {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    }
                                )}
                            </Text>

                        </View>

                        <Text style={styles.billAmount}>
                            {(bill.total_amount / 100).toLocaleString()} บาท
                        </Text>

                    </TouchableOpacity>

                ))}

            </ScrollView>

        </View>
    );
}