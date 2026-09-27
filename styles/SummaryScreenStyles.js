import { StyleSheet } from 'react-native';
import { colors, topInset } from './theme'

export const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.primary },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
    backBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    backText: { fontWeight: '600', color: colors.primary },
    content: { padding: 16, gap: 12 },
    empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 16 },
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, gap: 4 },
    roundTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
    itemName: { fontSize: 15, fontWeight: '600' },
    itemText: { fontSize: 14 },
    note: { color: '#6B7280', fontSize: 13 },
    subtotal: { fontWeight: '700', marginTop: 4 },
    footer: { padding: 16, backgroundColor: '#fff', gap: 10 },
    total: { fontSize: 20, fontWeight: '700' },
    footerRow: { flexDirection: 'row', gap: 12 },
    btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
    btnMore: { backgroundColor: colors.primary },
    btnPay: { backgroundColor: '#10B981' },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});