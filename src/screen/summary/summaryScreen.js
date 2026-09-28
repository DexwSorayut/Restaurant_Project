import { useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { getSummary } from '../../db/database';
import BillScreen from './billScreen';

import { styles } from '../../styles/summaryScreenStyles';
import { colors } from '../../styles/theme';

export default function SummaryScreen({ db, onBack }) {

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedTab, setSelectedTab] =
        useState('summary');

    const now = new Date();

    const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
    );

    const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
    );

    const [startDate, setStartDate] =
        useState(startOfDay);

    const [startTime, setStartTime] =
        useState(startOfDay);

    const [endDate, setEndDate] =
        useState(endOfDay);

    const [endTime, setEndTime] =
        useState(endOfDay);

    const [pickerMode, setPickerMode] =
        useState(null);

    const [hasSearched, setHasSearched] =
        useState(false);


    // =========================
    // Format Date
    // =========================

    const formatDate = (date) => {
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };


    // =========================
    // Format Time
    // =========================

    const formatTime = (date) => {
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };


    // =========================
    // DateTimePicker
    // =========================

    const handlePickerChange = (
        event,
        selectedValue
    ) => {

        if (event.type === 'dismissed') {
            setPickerMode(null);
            return;
        }

        if (!selectedValue) {
            setPickerMode(null);
            return;
        }

        if (pickerMode === 'startDate') {
            setStartDate(selectedValue);
        }

        if (pickerMode === 'startTime') {
            setStartTime(selectedValue);
        }

        if (pickerMode === 'endDate') {
            setEndDate(selectedValue);
        }

        if (pickerMode === 'endTime') {
            setEndTime(selectedValue);
        }

        setPickerMode(null);
    };


    // =========================
    // Load Summary
    // =========================

    const loadSummary = async () => {

        try {

            setLoading(true);

            const startDateTime =
                new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate(),
                    startTime.getHours(),
                    startTime.getMinutes(),
                    0
                ).toISOString();

            const endDateTime =
                new Date(
                    endDate.getFullYear(),
                    endDate.getMonth(),
                    endDate.getDate(),
                    endTime.getHours(),
                    endTime.getMinutes(),
                    59
                ).toISOString();

            const data = await getSummary(
                db,
                startDateTime,
                endDateTime
            );

            setSummary(data);
            setHasSearched(true);

        } catch (error) {

            console.error(
                'Load summary error:',
                error
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <View style={styles.container}>

            {/* =========================
                Header
            ========================= */}

            <View
                style={[
                    styles.header,
                    {
                        backgroundColor:
                            colors.primary
                    }
                ]}
            >

                <Text style={styles.headertitle}>
                    รายงานและเอกสาร
                </Text>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                >

                    <Text style={styles.backButtonText}>
                        กลับ
                    </Text>

                </TouchableOpacity>

            </View>


            {/* =========================
                Body
            ========================= */}

            <View style={styles.Body}>

                {/* =========================
                    Sidebar
                ========================= */}

                <View style={styles.sidebar}>

                    <Text style={styles.sidebarTitle}>
                        รายการ
                    </Text>


                    {/* สรุปยอด */}

                    <TouchableOpacity
                        style={[
                            styles.sidebarButton,
                            selectedTab === 'summary' &&
                            styles.sidebarButtonActive
                        ]}
                        onPress={() =>
                            setSelectedTab('summary')
                        }
                    >

                        <Text
                            style={[
                                styles.sidebarButtonText,
                                selectedTab === 'summary' &&
                                styles.sidebarButtonTextActive
                            ]}
                        >
                            สรุปยอด
                        </Text>

                    </TouchableOpacity>


                    {/* ตรวจสอบบิล */}

                    <TouchableOpacity
                        style={[
                            styles.sidebarButton,
                            selectedTab === 'bills' &&
                            styles.sidebarButtonActive
                        ]}
                        onPress={() =>
                            setSelectedTab('bills')
                        }
                    >

                        <Text
                            style={[
                                styles.sidebarButtonText,
                                selectedTab === 'bills' &&
                                styles.sidebarButtonTextActive
                            ]}
                        >
                            ตรวจสอบบิล
                        </Text>

                    </TouchableOpacity>

                </View>


                {/* =========================
                    Content
                ========================= */}

                <View style={styles.content}>


                    {/* =========================
                        Summary
                    ========================= */}

                    {selectedTab === 'summary' && (

                        <View style={styles.summaryLayout}>

                            {/* =========================
                                Summary Result
                            ========================= */}

                            <View style={styles.summaryResult}>

                                <ScrollView
                                    style={
                                        styles.summaryResultScroll
                                    }
                                    contentContainerStyle={
                                        styles.summaryResultContent
                                    }
                                >

                                    {!hasSearched ? (

                                        <View style={styles.emptyState}>

                                            <Text
                                                style={
                                                    styles.emptyStateText
                                                }
                                            >
                                                กรุณาเลือกเวลา
                                            </Text>

                                        </View>

                                    ) : summary?.totalBills === 0 ? (

                                        <View style={styles.emptyState}>

                                            <Text
                                                style={
                                                    styles.emptyStateText
                                                }
                                            >
                                                ไม่พบข้อมูลในช่วงเวลา
                                            </Text>

                                        </View>

                                    ) : (

                                        <>

                                            <Text
                                                style={
                                                    styles.sectionTitle
                                                }
                                            >
                                                รายการอาหารที่ขาย
                                            </Text>


                                            {/* หัวตาราง */}

                                            <View
                                                style={
                                                    styles.foodSummaryHeader
                                                }
                                            >

                                                <Text
                                                    style={[
                                                        styles.foodSummaryText,
                                                        styles.foodNameColumn
                                                    ]}
                                                >
                                                    รายการอาหาร
                                                </Text>

                                                <Text
                                                    style={[
                                                        styles.foodSummaryText,
                                                        styles.foodQtyColumn
                                                    ]}
                                                >
                                                    จำนวน
                                                </Text>

                                                <Text
                                                    style={[
                                                        styles.foodSummaryText,
                                                        styles.foodAmountColumn
                                                    ]}
                                                >
                                                    เงิน
                                                </Text>

                                            </View>


                                            {/* รายการอาหาร */}

                                            {summary.foodSales.map(
                                                (item) => (

                                                    <View
                                                        key={
                                                            item.foodId
                                                        }
                                                        style={
                                                            styles.foodSummaryRow
                                                        }
                                                    >

                                                        <View
                                                            style={
                                                                styles.foodNameColumn
                                                            }
                                                        >

                                                            <Text
                                                                style={
                                                                    styles.foodSummaryText
                                                                }
                                                            >
                                                                {
                                                                    item.foodName
                                                                }
                                                            </Text>


                                                            {/* Addons */}

                                                            {item.addons?.map(
                                                                (addon) => (

                                                                    <Text
                                                                        key={
                                                                            addon.name
                                                                        }
                                                                        style={
                                                                            styles.addonSummaryText
                                                                        }
                                                                    >
                                                                        └{' '}
                                                                        {
                                                                            addon.name
                                                                        }
                                                                        {' ×'}
                                                                        {
                                                                            addon.quantity
                                                                        }
                                                                    </Text>

                                                                )
                                                            )}

                                                        </View>


                                                        {/* จำนวน */}

                                                        <Text
                                                            style={[
                                                                styles.foodSummaryText,
                                                                styles.foodQtyColumn
                                                            ]}
                                                        >
                                                            {
                                                                item.quantity
                                                            }
                                                        </Text>


                                                        {/* เงิน */}

                                                        <Text
                                                            style={[
                                                                styles.foodSummaryText,
                                                                styles.foodAmountColumn
                                                            ]}
                                                        >
                                                            {
                                                                (
                                                                    item.totalAmount /
                                                                    100
                                                                ).toLocaleString()
                                                            }{' '}
                                                            บาท
                                                        </Text>

                                                    </View>

                                                )
                                            )}

                                        </>

                                    )}

                                </ScrollView>


                                {/* =========================
                                    Summary Bottom
                                ========================= */}

                                {hasSearched &&
                                    summary?.totalBills > 0 && (

                                        <View
                                            style={
                                                styles.summaryBottomBar
                                            }
                                        >

                                            <View>

                                                <Text
                                                    style={
                                                        styles.summaryBottomLabel
                                                    }
                                                >
                                                    ยอดรวม
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.summaryBottomValue
                                                    }
                                                >
                                                    {
                                                        (
                                                            summary.totalSales /
                                                            100
                                                        ).toLocaleString()
                                                    }{' '}
                                                    บาท
                                                </Text>

                                            </View>


                                            <View>

                                                <Text
                                                    style={
                                                        styles.summaryBottomLabel
                                                    }
                                                >
                                                    จำนวนบิล
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.summaryBottomValue
                                                    }
                                                >
                                                    {
                                                        summary.totalBills.toLocaleString()
                                                    }{' '}
                                                    บิล
                                                </Text>

                                            </View>

                                        </View>

                                    )}

                            </View>


                            {/* =========================
                                Filter
                            ========================= */}

                            <View
                                style={
                                    styles.summaryFilter
                                }
                            >

                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    เลือกช่วงเวลา
                                </Text>


                                {/* ตั้งแต่ */}

                                <Text
                                    style={
                                        styles.filterLabel
                                    }
                                >
                                    ตั้งแต่
                                </Text>


                                {/* Start Date */}

                                <TouchableOpacity
                                    style={
                                        styles.dateInput
                                    }
                                    onPress={() =>
                                        setPickerMode(
                                            'startDate'
                                        )
                                    }
                                >

                                    <Text>
                                        📅{' '}
                                        {
                                            formatDate(
                                                startDate
                                            )
                                        }
                                    </Text>

                                </TouchableOpacity>


                                {/* Start Time */}

                                <TouchableOpacity
                                    style={
                                        styles.dateInput
                                    }
                                    onPress={() =>
                                        setPickerMode(
                                            'startTime'
                                        )
                                    }
                                >

                                    <Text>
                                        🕐{' '}
                                        {
                                            formatTime(
                                                startTime
                                            )
                                        }
                                    </Text>

                                </TouchableOpacity>


                                {/* ถึง */}

                                <Text
                                    style={
                                        styles.filterLabel
                                    }
                                >
                                    ถึง
                                </Text>


                                {/* End Date */}

                                <TouchableOpacity
                                    style={
                                        styles.dateInput
                                    }
                                    onPress={() =>
                                        setPickerMode(
                                            'endDate'
                                        )
                                    }
                                >

                                    <Text>
                                        📅{' '}
                                        {
                                            formatDate(
                                                endDate
                                            )
                                        }
                                    </Text>

                                </TouchableOpacity>


                                {/* End Time */}

                                <TouchableOpacity
                                    style={
                                        styles.dateInput
                                    }
                                    onPress={() =>
                                        setPickerMode(
                                            'endTime'
                                        )
                                    }
                                >

                                    <Text>
                                        🕐{' '}
                                        {
                                            formatTime(
                                                endTime
                                            )
                                        }
                                    </Text>

                                </TouchableOpacity>


                                {/* ดูสรุป */}

                                <TouchableOpacity
                                    style={
                                        styles.summaryButton
                                    }
                                    onPress={loadSummary}
                                >

                                    <Text
                                        style={
                                            styles.summaryButtonText
                                        }
                                    >
                                        ดูสรุป
                                    </Text>

                                </TouchableOpacity>

                            </View>

                        </View>

                    )}


                    {/* =========================
                        Bill Screen
                    ========================= */}

                    {selectedTab === 'bills' && (
                        <BillScreen db={db} />
                    )}

                </View>

            </View>


            {/* =========================
                Date / Time Picker
            ========================= */}

            {pickerMode && (

                <DateTimePicker
                    value={
                        pickerMode === 'startDate'
                            ? startDate
                            : pickerMode === 'startTime'
                                ? startTime
                                : pickerMode === 'endDate'
                                    ? endDate
                                    : endTime
                    }
                    mode={
                        pickerMode.includes('Date')
                            ? 'date'
                            : 'time'
                    }
                    onChange={
                        handlePickerChange
                    }
                />

            )}

        </View>
    );
}