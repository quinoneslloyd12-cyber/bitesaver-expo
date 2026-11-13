import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, Flame, Plus, Refrigerator } from 'lucide-react-native';
import { BiteSaverHeader } from '../../components/BiteSaverHeader';
import { DailySpendingDial } from '../../components/DailySpendingDial';
import { useBiteSaver } from '../../store/BiteSaverContext';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';

export default function HomeScreen() {
  const { expenses, pantryItems, dailyLimit, monthlyAllowance, monthSpentBeforeToday } = useBiteSaver();
  const todayExpenses = expenses.filter((e) => e.dayGroup === 'today');
  const spentToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const urgentItems = pantryItems.filter((p) => p.daysLeft <= 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BiteSaverHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingTitle}>Good afternoon, Maya</Text>
            <Text style={styles.greetingSub}>Day 18 of semester budget pacing</Text>
          </View>
          <View style={styles.allowancePill}>
            <Text style={styles.allowancePillText}>Daily Allowance</Text>
          </View>
        </View>

        <DailySpendingDial
          spentToday={spentToday}
          dailyLimit={dailyLimit}
          monthlySpent={monthSpentBeforeToday + spentToday}
          monthlyAllowance={monthlyAllowance}
        />

        <View style={styles.miniGrid}>
          <Pressable style={styles.miniCard} onPress={() => router.push('/(tabs)/expenses')}>
            <Text style={styles.miniLabel}>Today's Spend</Text>
            <Text style={styles.miniValue}>₱{spentToday.toFixed(2)}</Text>
            <Text style={styles.miniSub} numberOfLines={1}>
              {todayExpenses.map((e) => `${e.category} ₱${e.amount}`).join(' • ') || 'No spend yet'}
            </Text>
          </Pressable>

          <Pressable style={styles.miniCard} onPress={() => router.push('/(tabs)/pantry')}>
            <Text style={styles.miniLabel}>Pantry Alert</Text>
            <Text style={[styles.miniValue, { color: Colors.secondary }]}>{urgentItems.length} items</Text>
            <Text style={[styles.miniSub, { color: Colors.secondary }]} numberOfLines={1}>
              {urgentItems.map((i) => i.name).join(', ') || 'All fresh!'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.rescueCard}>
          <View style={styles.rescueTagRow}>
            <Flame size={14} color={Colors.secondary} />
            <Text style={styles.rescueKicker}>ZERO-WASTE MEAL</Text>
          </View>
          <Text style={styles.rescueTitle}>Crispy Garlic Tofu & Spinach Bowl</Text>
          <Text style={styles.rescueMeta}>Uses your cook-soon tofu & spinach • 15 mins • Saves ~₱110</Text>
          <Pressable style={styles.rescueBtn} onPress={() => router.push('/(tabs)/recipes')}>
            <Text style={styles.rescueBtnText}>View Recipe</Text>
            <ArrowRight size={15} color={Colors.onSecondary} />
          </Pressable>
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.recentHeading}>Recent Expenses</Text>
          <Pressable onPress={() => router.push('/(tabs)/expenses')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.recentList}>
          {expenses.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.recentRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recentTitle}>{item.title}</Text>
                <Text style={styles.recentSub}>{item.category} • {item.timeLabel}</Text>
              </View>
              <Text style={styles.recentAmount}>-₱{item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: Colors.secondary }]}
            onPress={() => router.push('/(tabs)/expenses')}
          >
            <Plus size={18} color={Colors.onSecondary} />
            <Text style={styles.actionBtnText}>Log Expense</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
            onPress={() => router.push('/(tabs)/pantry')}
          >
            <Refrigerator size={18} color={Colors.onPrimary} />
            <Text style={styles.actionBtnText}>Add to Pantry</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scroll: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 32 },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 22, color: Colors.primary },
  greetingSub: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant },
  allowancePill: { backgroundColor: Colors.surfaceContainer, paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radii.full },
  allowancePillText: { fontFamily: Fonts.sansSemiBold, fontSize: 11, color: Colors.primary },
  miniGrid: { flexDirection: 'row', gap: Spacing.sm },
  miniCard: { flex: 1, backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: Spacing.md, gap: 6 },
  miniLabel: { fontFamily: Fonts.sansMedium, fontSize: 12, color: Colors.onSurfaceVariant },
  miniValue: { fontFamily: Fonts.serifSemiBold, fontSize: 20, color: Colors.primary },
  miniSub: { fontFamily: Fonts.sansRegular, fontSize: 11, color: Colors.onSurfaceVariant, backgroundColor: Colors.surfaceLow, padding: 6, borderRadius: 8 },
  rescueCard: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: Spacing.md, gap: 6 },
  rescueTagRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rescueKicker: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.secondary },
  rescueTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 17, color: Colors.primary },
  rescueMeta: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant },
  rescueBtn: { alignSelf: 'flex-end', marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.secondary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radii.md },
  rescueBtnText: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.onSecondary },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentHeading: { fontFamily: Fonts.serifSemiBold, fontSize: 18, color: Colors.primary },
  seeAll: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.surfaceTint },
  recentList: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: 8, gap: 4 },
  recentRow: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  recentTitle: { fontFamily: Fonts.sansSemiBold, fontSize: 14, color: Colors.onSurface },
  recentSub: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant },
  recentAmount: { fontFamily: Fonts.serifSemiBold, fontSize: 15, color: Colors.primary },
  quickActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { flex: 1, height: 48, borderRadius: Radii.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionBtnText: { fontFamily: Fonts.sansSemiBold, fontSize: 14, color: '#ffffff' },
});
