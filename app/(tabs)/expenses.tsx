import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X } from 'lucide-react-native';
import { BiteSaverHeader } from '../../components/BiteSaverHeader';
import { useBiteSaver } from '../../store/BiteSaverContext';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';

const CATEGORIES = [
  { id: 'food' as const, label: '🍴 Food' },
  { id: 'coffee' as const, label: '☕ Coffee' },
  { id: 'transport' as const, label: '🚌 Commute' },
  { id: 'pantry' as const, label: '🥬 Groceries' },
  { id: 'school' as const, label: '📚 School' },
];

export default function ExpensesScreen() {
  const { expenses, dailyLimit, addExpense } = useBiteSaver();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [amount, setAmount] = useState('45');
  const [category, setCategory] = useState<'food' | 'coffee' | 'transport' | 'pantry' | 'school'>('food');
  const [note, setNote] = useState('');

  const todayExpenses = expenses.filter((e) => e.dayGroup === 'today');
  const yesterdayExpenses = expenses.filter((e) => e.dayGroup === 'yesterday');
  const spentToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSave = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    addExpense({
      title: note.trim() || `${category.charAt(0).toUpperCase() + category.slice(1)} Expense`,
      category,
      amount: val,
      note: note.trim() || 'Quick dorm log',
      paymentMethod: 'Cash',
    });
    setNote('');
    setSheetOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BiteSaverHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.kicker}>DAILY SPENDING</Text>
            <Text style={styles.title}>Today, Oct 18</Text>
          </View>
          <Text style={styles.totalSpent}>-₱{spentToday.toFixed(2)}</Text>
        </View>

        <View style={styles.capCard}>
          <Text style={styles.capLabel}>Remaining Daily Allowance (₱{dailyLimit} cap)</Text>
          <Text style={styles.capAmount}>₱{Math.max(0, dailyLimit - spentToday).toFixed(2)}</Text>
        </View>

        <Text style={styles.groupHeader}>TODAY</Text>
        {todayExpenses.map((item) => (
          <View key={item.id} style={styles.txRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txSub}>{item.timeLabel} • {item.note}</Text>
            </View>
            <Text style={styles.txAmount}>-₱{item.amount.toFixed(2)}</Text>
          </View>
        ))}

        <Text style={styles.groupHeader}>YESTERDAY</Text>
        {yesterdayExpenses.map((item) => (
          <View key={item.id} style={styles.txRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txSub}>{item.timeLabel} • {item.note}</Text>
            </View>
            <Text style={[styles.txAmount, { color: Colors.onSurface }]}>-₱{item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setSheetOpen(true)}>
        <Plus size={26} color={Colors.onSecondary} />
      </Pressable>

      <Modal visible={sheetOpen} transparent animationType="slide">
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetTop}>
              <Text style={styles.sheetTitle}>Quick Log Expense</Text>
              <Pressable onPress={() => setSheetOpen(false)}>
                <X size={20} color={Colors.onSurfaceVariant} />
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[styles.catChip, category === cat.id && styles.catChipActive]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={[styles.catText, category === cat.id && { color: Colors.onPrimary }]}>
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>EXPENSE TOTAL (₱)</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.bumpRow}>
              {[10, 20, 50, 100].map((inc) => (
                <Pressable
                  key={inc}
                  style={styles.bumpBtn}
                  onPress={() => setAmount(String((parseFloat(amount) || 0) + inc))}
                >
                  <Text style={styles.bumpText}>+₱{inc}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="Quick note: e.g. Merienda pancit canton..."
              value={note}
              onChangeText={setNote}
            />

            <Pressable style={styles.logBtn} onPress={handleSave}>
              <Text style={styles.logBtnText}>Log ₱{(parseFloat(amount) || 0).toFixed(2)}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scroll: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 96 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  kicker: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.surfaceTint },
  title: { fontFamily: Fonts.serifSemiBold, fontSize: 26, color: Colors.primary },
  totalSpent: { fontFamily: Fonts.serifBold, fontSize: 18, color: Colors.secondary },
  capCard: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: Spacing.md, gap: 4 },
  capLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.onSurfaceVariant },
  capAmount: { fontFamily: Fonts.serifBold, fontSize: 24, color: Colors.primary },
  groupHeader: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.surfaceTint, marginTop: 8 },
  txRow: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.md, padding: 14, flexDirection: 'row', alignItems: 'center' },
  txTitle: { fontFamily: Fonts.sansSemiBold, fontSize: 14, color: Colors.onSurface },
  txSub: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant },
  txAmount: { fontFamily: Fonts.serifBold, fontSize: 16, color: Colors.secondary },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(1,45,29,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surfaceLowest, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.lg, gap: 14 },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 20, color: Colors.primary },
  catRow: { gap: 8 },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radii.full, backgroundColor: Colors.surfaceContainer },
  catChipActive: { backgroundColor: Colors.primary },
  catText: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.onSurfaceVariant },
  amountBox: { backgroundColor: Colors.surfaceLow, borderRadius: Radii.lg, padding: Spacing.md, alignItems: 'center' },
  amountLabel: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.surfaceTint },
  amountInput: { fontFamily: Fonts.serifBold, fontSize: 34, color: Colors.primary, textAlign: 'center', minWidth: 120 },
  bumpRow: { flexDirection: 'row', gap: 8 },
  bumpBtn: { flex: 1, backgroundColor: Colors.surfaceContainer, paddingVertical: 10, borderRadius: Radii.md, alignItems: 'center' },
  bumpText: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.primary },
  noteInput: { height: 48, borderRadius: Radii.md, backgroundColor: Colors.surfaceLow, paddingHorizontal: 14, fontFamily: Fonts.sansRegular, fontSize: 14 },
  logBtn: { height: 52, borderRadius: Radii.lg, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  logBtnText: { fontFamily: Fonts.sansBold, fontSize: 15, color: Colors.onSecondary },
});
