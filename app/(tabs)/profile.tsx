import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BiteSaverHeader } from '../../components/BiteSaverHeader';
import { useBiteSaver } from '../../store/BiteSaverContext';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';

export default function ProfileScreen() {
  const {
    dailyLimit,
    monthlyAllowance,
    monthlyWasteSaved,
    rescueMealsEaten,
    cookSoonAlerts,
    dailyCheckIn,
    updateLimits,
    toggleSetting,
    resetAllData,
  } = useBiteSaver();

  const [editOpen, setEditOpen] = useState(false);
  const [dailyText, setDailyText] = useState(String(dailyLimit));
  const [monthlyText, setMonthlyText] = useState(String(monthlyAllowance));

  const handleSaveCaps = () => {
    updateLimits(parseInt(dailyText, 10) || dailyLimit, parseInt(monthlyText, 10) || monthlyAllowance);
    setEditOpen(false);
  };

  const handleReset = () => {
    Alert.alert('Reset Local Dorm Data', 'Clear all meal logs and restore starter pantry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetAllData() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BiteSaverHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <Text style={styles.name}>Maya Santos</Text>
          <Text style={styles.meta}>BS Biology • Year 2 • Dorm 4A</Text>
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineBadgeText}>Local Dorm Vault • 100% Offline</Text>
          </View>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>October Impact & Savings</Text>
          <View style={styles.impactGrid}>
            <View style={styles.impactStat}>
              <Text style={styles.impactKicker}>FOOD WASTE KEPT</Text>
              <Text style={styles.impactNum}>₱{monthlyWasteSaved}</Text>
              <Text style={styles.impactSub}>Saved this month</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactKicker}>RESCUE MODE</Text>
              <Text style={[styles.impactNum, { color: Colors.secondary }]}>{rescueMealsEaten}</Text>
              <Text style={styles.impactSub}>Cook-soon meals eaten</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Allowance & Limits (Tap to Edit)</Text>
          <Pressable style={styles.row} onPress={() => setEditOpen(true)}>
            <Text style={styles.rowLabel}>Daily Spending Limit</Text>
            <Text style={styles.rowValue}>₱{dailyLimit} / day</Text>
          </Pressable>
          <Pressable style={styles.row} onPress={() => setEditOpen(true)}>
            <Text style={styles.rowLabel}>Monthly Allowance</Text>
            <Text style={styles.rowValue}>₱{monthlyAllowance.toLocaleString()} / mo</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Dorm Alerts</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Cook-soon alerts (48h)</Text>
            <Switch value={cookSoonAlerts} onValueChange={() => toggleSetting('cookSoonAlerts')} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>8 PM Daily Check-in</Text>
            <Switch value={dailyCheckIn} onValueChange={() => toggleSetting('dailyCheckIn')} />
          </View>
        </View>

        <Pressable style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetText}>Reset Local Dorm Data</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={editOpen} transparent animationType="slide">
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Budget Caps</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={dailyText} onChangeText={setDailyText} placeholder="Daily limit" />
            <TextInput style={styles.input} keyboardType="numeric" value={monthlyText} onChangeText={setMonthlyText} placeholder="Monthly allowance" />
            <Pressable style={styles.saveBtn} onPress={handleSaveCaps}>
              <Text style={styles.saveBtnText}>Save Caps</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scroll: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 32 },
  profileCard: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: Spacing.lg, alignItems: 'center', gap: 6 },
  name: { fontFamily: Fonts.serifSemiBold, fontSize: 22, color: Colors.primary },
  meta: { fontFamily: Fonts.sansRegular, fontSize: 13, color: Colors.onSurfaceVariant },
  offlineBadge: { backgroundColor: Colors.surfaceContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.full, marginTop: 4 },
  offlineBadgeText: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.primary },
  impactCard: { backgroundColor: Colors.surfaceLow, borderRadius: Radii.lg, padding: Spacing.md, gap: 10 },
  impactTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 18, color: Colors.primary },
  impactGrid: { flexDirection: 'row', gap: 10 },
  impactStat: { flex: 1, backgroundColor: Colors.surfaceLowest, borderRadius: Radii.md, padding: 12 },
  impactKicker: { fontFamily: Fonts.sansBold, fontSize: 10, color: Colors.onSurfaceVariant },
  impactNum: { fontFamily: Fonts.serifBold, fontSize: 28, color: Colors.primary, marginTop: 4 },
  impactSub: { fontFamily: Fonts.sansRegular, fontSize: 11, color: Colors.surfaceTint },
  sectionCard: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: Spacing.md, gap: 12 },
  sectionTitle: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.onSurfaceVariant, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 14, color: Colors.primary },
  rowValue: { fontFamily: Fonts.serifSemiBold, fontSize: 16, color: Colors.primary },
  resetBtn: { backgroundColor: Colors.secondaryFixed, borderRadius: Radii.lg, padding: 16, alignItems: 'center' },
  resetText: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.secondary },
  backdrop: { flex: 1, backgroundColor: 'rgba(1,45,29,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.surfaceLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, gap: 12 },
  modalTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 18, color: Colors.primary },
  input: { height: 48, borderRadius: Radii.md, backgroundColor: Colors.surfaceLow, paddingHorizontal: 14, fontFamily: Fonts.serifBold, fontSize: 16 },
  saveBtn: { height: 48, borderRadius: Radii.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.onPrimary },
});
