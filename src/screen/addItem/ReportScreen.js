import { useState } from 'react';
import {View, Text, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getSummary } from '../../db/database';
import BillScreen from './BillScreen';
import { s } from '../../styles/reportScreenStyle';
import { colors } from '../../styles/theme';

export default function ReportScreen({ db, onBack }) {

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
        <View style={s.container}>

            {/* =========================
                Header
            ========================= */}

            <View
                style={[
                    s.header,
                    {
                        backgroundColor:
                            colors.primary
                    }
                ]}
            >

                <Text style={s.headertitle}>
                    รายงานและเอกสาร
                </Text>

                <TouchableOpacity
                    style={s.backButton}
                    onPress={onBack}
                >

                    <Text style={s.backButtonText}>
                        กลับ
                    </Text>

                </TouchableOpacity>

            </View>


            {/* =========================
                Body
            ========================= */}

            <View style={s.Body}>

                {/* =========================
                    Sidebar
                ========================= */}

                <View style={s.sidebar}>

                    <Text style={s.sidebarTitle}>
                        รายการ
                    </Text>


                    {/* สรุปยอด */}

                    <TouchableOpacity
                        style={[
                            s.sidebarButton,
                            selectedTab === 'summary' &&
                            s.sidebarButtonActive
                        ]}
                        onPress={() =>
                            setSelectedTab('summary')
                        }
                    >

                        <Text
                            style={[
                                s.sidebarButtonText,
                                selectedTab === 'summary' &&
                                s.sidebarButtonTextActive
                            ]}
                        >
                            สรุปยอด
                        </Text>

                    </TouchableOpacity>


                    {/* ตรวจสอบบิล */}

                    <TouchableOpacity
                        style={[
                            s.sidebarButton,
                            selectedTab === 'bills' &&
                            s.sidebarButtonActive
                        ]}
                        onPress={() =>
                            setSelectedTab('bills')
                        }
                    >

                        <Text
                            style={[
                                s.sidebarButtonText,
                                selectedTab === 'bills' &&
                                s.sidebarButtonTextActive
                            ]}
                        >
                            ตรวจสอบบิล
                        </Text>

                    </TouchableOpacity>

                </View>


                {/* =========================
                    Content
                ========================= */}

                <View style={s.content}>


                    {/* =========================
                        Summary
                    ========================= */}

                    {selectedTab === 'summary' && (

                        <View style={s.summaryLayout}>

                            {/* =========================
                                Summary Result
                            ========================= */}

                            <View style={s.summaryResult}>

                                <ScrollView
                                    style={
                                        s.summaryResultScroll
                                    }
                                    contentContainerStyle={
                                        s.summaryResultContent
                                    }
                                >

                                    {loading ? (

                                        <View style={s.emptyState}>

                                            <ActivityIndicator
                                                size="large"
                                                color={colors.primary}
                                            />

                                        </View>

                                    ) : !hasSearched ? (

                                        <View style={s.emptyState}>

                                            <Text
                                                style={
                                                    s.emptyStateText
                                                }
                                            >
                                                กรุณาเลือกเวลา
                                            </Text>

                                        </View>

                                    ) : summary?.totalBills === 0 ? (

                                        <View style={s.emptyState}>

                                            <Text
                                                style={
                                                    s.emptyStateText
                                                }
                                            >
                                                ไม่พบข้อมูลในช่วงเวลา
                                            </Text>

                                        </View>

                                    ) : (

                                        <>

                                            <Text
                                                style={
                                                    s.sectionTitle
                                                }
                                            >
                                                รายการอาหารที่ขาย
                                            </Text>


                                            {/* หัวตาราง */}

                                            <View
                                                style={
                                                    s.foodSummaryHeader
                                                }
                                            >

                                                <Text
                                                    style={[
                                                        s.foodSummaryText,
                                                        s.foodNameColumn
                                                    ]}
                                                >
                                                    รายการอาหาร
                                                </Text>

                                                <Text
                                                    style={[
                                                        s.foodSummaryText,
                                                        s.foodQtyColumn
                                                    ]}
                                                >
                                                    จำนวน
                                                </Text>

                                                <Text
                                                    style={[
                                                        s.foodSummaryText,
                                                        s.foodAmountColumn
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
                                                            s.foodSummaryRow
                                                        }
                                                    >

                                                        <View
                                                            style={
                                                                s.foodNameColumn
                                                            }
                                                        >

                                                            <Text
                                                                style={
                                                                    s.foodSummaryText
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
                                                                            s.addonSummaryText
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
                                                                s.foodSummaryText,
                                                                s.foodQtyColumn
                                                            ]}
                                                        >
                                                            {
                                                                item.quantity
                                                            }
                                                        </Text>


                                                        {/* เงิน */}

                                                        <Text
                                                            style={[
                                                                s.foodSummaryText,
                                                                s.foodAmountColumn
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
                                                s.summaryBottomBar
                                            }
                                        >

                                            <View>

                                                <Text
                                                    style={
                                                        s.summaryBottomLabel
                                                    }
                                                >
                                                    ยอดรวม
                                                </Text>

                                                <Text
                                                    style={
                                                        s.summaryBottomValue
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
                                                        s.summaryBottomLabel
                                                    }
                                                >
                                                    จำนวนบิล
                                                </Text>

                                                <Text
                                                    style={
                                                        s.summaryBottomValue
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
                                    s.summaryFilter
                                }
                            >

                                <Text
                                    style={
                                        s.sectionTitle
                                    }
                                >
                                    เลือกช่วงเวลา
                                </Text>


                                {/* ตั้งแต่ */}

                                <Text
                                    style={
                                        s.filterLabel
                                    }
                                >
                                    ตั้งแต่
                                </Text>


                                {/* Start Date */}

                                <TouchableOpacity
                                    style={
                                        s.dateInput
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
                                        s.dateInput
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
                                        s.filterLabel
                                    }
                                >
                                    ถึง
                                </Text>


                                {/* End Date */}

                                <TouchableOpacity
                                    style={
                                        s.dateInput
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
                                        s.dateInput
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
                                        s.summaryButton
                                    }
                                    onPress={loadSummary}
                                    disabled={loading}
                                >

                                    <Text
                                        style={
                                            s.summaryButtonText
                                        }
                                    >
                                        {loading ? 'กำลังโหลด...' : 'ดูสรุป'}
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