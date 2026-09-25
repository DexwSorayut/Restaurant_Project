import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { listOrders, updateOrderItemStatus } from '../../db/database';
import { styles } from '../../styles/kitchenScreenStyles';
import { colors } from '../../styles/theme';

// ตารางสถานะ: ค่าใน DB -> ชื่อที่แสดง, สี, สถานะถัดไป, ข้อความปุ่ม
// next = null แปลว่าจบแล้ว ไม่มีปุ่มให้กดต่อ
const STATUS_INFO = {
  WAITING:   { label: 'กำลังทำ',   color: '#f59e0b',            next: 'COOKING', actionLabel: 'ทำเสร็จ' },
  COOKING:   { label: 'รอเสิร์ฟ',   color: '#8b5cf6',            next: 'SERVED',  actionLabel: 'เสิร์ฟแล้ว' },
  SERVED:    { label: 'เสิร์ฟแล้ว', color: colors.green ?? '#22c55e', next: null },
  CANCELLED: { label: 'ยกเลิก',    color: '#9ca3af',            next: null },
};

// ลำดับแท็บทางซ้าย (null = ทั้งหมด)
const STATUS_TABS = [null, 'WAITING', 'COOKING', 'SERVED', 'CANCELLED'];

// โหลดข้อมูลใหม่อัตโนมัติทุก 10 วินาที
const AUTO_REFRESH_MS = 10000;

// แปลงเวลาเป็นรูปแบบ "14:05 น."
function formatTime(text) {
  const d = new Date(text);
  if (isNaN(d.getTime())) return text ?? ''; // แปลงไม่ได้ก็แสดงค่าเดิม
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} น.`;
}

// จัดกลุ่มรายการอาหารตามรอบสั่ง: 1 รอบ = 1 ใบออเดอร์
function groupByRound(items) {
  const map = new Map(); // Map จำลำดับที่ใส่ ใบที่สั่งก่อนจึงอยู่ก่อน

  for (const item of items) {
    if (!map.has(item.round_id)) {
      map.set(item.round_id, {
        round_id: item.round_id,
        round_number: item.round_number,
        bill_id: item.bill_id,
        table_number: item.table_number,
        ordered_at: item.ordered_at,
        items: [],
      });
    }
    map.get(item.round_id).items.push(item);
  }

  return Array.from(map.values());
}

export default function KitchenScreen({ db, onBack }) {
  const [orders, setOrders] = useState([]);                       // รายการอาหารทั้งหมดของบิลที่เปิดอยู่
  const [selectedStatus, setSelectedStatus] = useState(null);     // null = ทั้งหมด
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);             // รายการที่กำลังบันทึก

  // โหลดรายการจากฐานข้อมูล
  const loadData = useCallback(async () => {
    try {
      const rows = await listOrders(db);
      setOrders(rows);
    } catch (error) {
      console.error('Load kitchen data error:', error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  // ปุ่มสรุปยอดขาย (ตอนนี้ยังแค่โหลดข้อมูลใหม่)
  const yodkhai = () => {
    loadData();
  };

  // โหลดตอนเปิดหน้า + โหลดซ้ำอัตโนมัติ
  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, AUTO_REFRESH_MS);
    return () => clearInterval(timer); // ออกจากหน้าแล้วหยุดตัวจับเวลา
  }, [loadData]);

  // ดึงหน้าจอลงเพื่อรีเฟรช
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // บันทึกสถานะใหม่ลงฐานข้อมูล แล้วโหลดใหม่
  const saveStatus = async (item, newStatus) => {
    try {
      setUpdatingId(item.item_id);
      await updateOrderItemStatus(db, item.item_id, newStatus);
      await loadData();
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'เปลี่ยนสถานะไม่สำเร็จ ลองใหม่อีกครั้ง');
    } finally {
      setUpdatingId(null);
    }
  };

  // ปุ่มไปสถานะถัดไป: กำลังทำ -> รอเสิร์ฟ -> เสิร์ฟแล้ว
  const handleNext = (item) => {
    const info = STATUS_INFO[item.status];
    if (info?.next) saveStatus(item, info.next);
  };

  // ปุ่มยกเลิก: ถามยืนยันก่อน กันกดพลาด
  const handleCancel = (item) => {
    Alert.alert(
      'ยกเลิกรายการ',
      `ยกเลิก "${item.food_name} x${item.quantity}" ของโต๊ะ ${item.table_number} ใช่ไหม?`,
      [
        { text: 'ไม่', style: 'cancel' },
        { text: 'ยกเลิกรายการ', style: 'destructive', onPress: () => saveStatus(item, 'CANCELLED') },
      ]
    );
  };

  // นับจำนวนรายการในแต่ละสถานะ ไว้แสดงตัวเลขที่แถบซ้าย
  const countByStatus = useMemo(() => {
    const counts = {};
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  // กรองตามแท็บที่เลือก แล้วจัดเป็นใบตามรอบ
  const tickets = useMemo(() => {
    const filtered =
      selectedStatus === null
        ? orders
        : orders.filter(o => o.status === selectedStatus);
    return groupByRound(filtered);
  }, [orders, selectedStatus]);

  // ชื่อหัวข้อฝั่งขวา
  const selectedName =
    selectedStatus === null ? 'ออเดอร์ทั้งหมด' : STATUS_INFO[selectedStatus].label;

  // วาดปุ่มแท็บสถานะ 1 ปุ่ม
  const renderTab = (status) => {
    const active = selectedStatus === status;
    const name = status === null ? 'ทั้งหมด' : STATUS_INFO[status].label;
    const count = status === null ? orders.length : countByStatus[status] || 0;
    const badgeColor = status === null ? colors.primary : STATUS_INFO[status].color;

    return (
      <TouchableOpacity
        key={status ?? 'all'}
        onPress={() => setSelectedStatus(status)}
        style={[styles.categoryItem, active && styles.categoryItemActive]}
      >
        <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
          {name}
        </Text>
        {count > 0 && (
          <View style={[styles.categoryCount, { backgroundColor: badgeColor }]}>
            <Text style={styles.categoryCountText}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // วาดรายการอาหาร 1 รายการในใบ
  const renderItem = (item) => {
    const info = STATUS_INFO[item.status];
    const isUpdating = updatingId === item.item_id;
    const isCancelled = item.status === 'CANCELLED';

    return (
      <View key={item.item_id} style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemFoodName, isCancelled && styles.itemFoodNameCancelled]}>
            {item.food_name} x{item.quantity}
          </Text>

          {/* หมายเหตุ เช่น ไม่เผ็ด */}
          {!!item.note && <Text style={styles.itemNote}>* {item.note}</Text>}

          {/* ป้ายสถานะ */}
          <View style={[styles.statusBadge, { backgroundColor: info?.color ?? '#999' }]}>
            <Text style={styles.statusBadgeText}>{info?.label ?? item.status}</Text>
          </View>
        </View>

        {/* ปุ่มแสดงเฉพาะรายการที่ยังไม่จบ (กำลังทำ / รอเสิร์ฟ) */}
        {info?.next && (
          <View style={styles.itemActions}>
            <TouchableOpacity
              onPress={() => handleNext(item)}
              disabled={isUpdating}
              style={[styles.actionButton, isUpdating && styles.actionButtonDisabled]}
            >
              <Text style={styles.actionButtonText}>
                {isUpdating ? 'กำลังบันทึก...' : info.actionLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCancel(item)}
              disabled={isUpdating}
              style={[styles.cancelButton, isUpdating && styles.actionButtonDisabled]}
            >
              <Text style={styles.cancelButtonText}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // วาดใบออเดอร์ 1 ใบ (1 รอบ)
  const renderTicket = (ticket) => (
    <View key={ticket.round_id} style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View>
          <Text style={styles.ticketTableText}>โต๊ะ {ticket.table_number}</Text>
          <Text style={styles.ticketSubText}>
            บิล #{ticket.bill_id} · รอบที่ {ticket.round_number}
          </Text>
        </View>
        <Text style={styles.ticketTimeText}>{formatTime(ticket.ordered_at)}</Text>
      </View>

      {ticket.items.map(renderItem)}
    </View>
  );

  return (
    <View style={styles.kitchenRoot}>
      {/* ===== แถบฟ้าด้านบน ===== */}
      <View style={styles.kitchenHeader}>
        <Text style={styles.kitchenHeaderTitle}>
          ครัว · กำลังทำ {countByStatus.WAITING || 0} จาน
        </Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={yodkhai} style={styles.backButton}>
            <Text style={styles.backButtonText}>สรุปยอดขาย</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBack}
            style={[styles.backButton, styles.headerButtonGap]}
          >
            <Text style={styles.backButtonText}>กลับ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== ส่วนล่าง: ซ้าย = แท็บสถานะ, ขวา = ออเดอร์ ===== */}
      <View style={styles.kitchenBody}>
        <ScrollView style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>สถานะ</Text>
          {STATUS_TABS.map(renderTab)}
        </ScrollView>

        <View style={styles.mainArea}>
          <Text style={styles.mainTitle}>{selectedName}</Text>

          {loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>กำลังโหลด...</Text>
            </View>
          ) : tickets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>ไม่มีรายการในสถานะนี้</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.kitchenList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
            >
              <View style={styles.ticketGrid}>
                {tickets.map(renderTicket)}
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      <StatusBar style="light" />
    </View>
  );
}