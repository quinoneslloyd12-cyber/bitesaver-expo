import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AlertTriangle, Check, PlusCircle } from 'lucide-react-native';
import { BiteSaverHeader } from '../../components/BiteSaverHeader';
import { useBiteSaver } from '../../store/BiteSaverContext';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';

export default function PantryScreen() {
  const { pantryItems, addPantryItem, consumePantryItem } = useBiteSaver();
  const [filter, setFilter] = useState<'all' | 'urgent' | 'produce' | 'proteins' | 'staples'>('all');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [shelf, setShelf] = useState('Fridge Shelf 1');
  const [daysLeft, setDaysLeft] = useState(7);

  const urgentItems = pantryItems.filter((i) => i.daysLeft <= 3);
  const urgentValue = urgentItems.reduce((sum, i) => sum + i.estimatedValue, 0);

  const visibleItems = pantryItems.filter((item) => {
    const matchesCat =
      filter === 'all' ? true : filter === 'urgent' ? item.daysLeft <= 3 : item.category === filter;
    const matchesQuery =
      query.trim() === '' || item.name.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSave = () => {
    if (!name.trim()) return;
    addPantryItem({
      name: name.trim(),
      quantity: qty.trim() || '1 item',
      shelf,
      category: 'staples',
      daysLeft,
      estimatedValue: 65,
    });
    setName('');
    setQty('');
    setModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BiteSaverHeader />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dorm Pantry & Fridge</Text>
          <Text style={styles.subtitle}>
            {pantryItems.length} items logged • {urgentItems.length} urgent
          </Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search dorm inventory..."
          value={query}
          onChangeText={setQuery}
        />

        <View style={styles.filters}>
          {(['all', 'urgent', 'produce', 'proteins', 'staples'] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.filterPill, filter === tab && styles.filterPillActive]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
                {tab === 'urgent' ? `Cook soon (${urgentItems.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {urgentItems.length > 0 && (
          <View style={styles.alertBanner}>
            <AlertTriangle size={20} color={Colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{urgentItems.length} items need cooking soon (48h limit)</Text>
              <Text style={styles.alertBody}>
                Cook or freeze within 48 hours to save approx. ₱{urgentValue}.
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/recipes')}>
                <Text style={styles.alertLink}>Find rescue recipe →</Text>
              </Pressable>
            </View>
          </View>
        )}

        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={{ flex: 1 }}>
                <View style={styles.itemTopRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={[styles.badge, item.daysLeft <= 3 ? styles.badgeUrgent : styles.badgeFresh]}>
                    <Text style={[styles.badgeText, item.daysLeft <= 3 && { color: Colors.secondary }]}>
                      {item.daysLeft >= 60 ? '60+ days' : `${item.daysLeft}d left`}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemMeta}>
                  {item.quantity} • {item.shelf}
                </Text>
              </View>
              <Pressable style={styles.doneBtn} onPress={() => consumePantryItem(item.id)}>
                <Check size={18} color={Colors.primary} />
              </Pressable>
            </View>
          )}
        />

        <Pressable style={styles.quickAddBtn} onPress={() => setModalOpen(true)}>
          <PlusCircle size={20} color={Colors.onPrimary} />
          <Text style={styles.quickAddText}>+ Quick-add ingredient</Text>
        </Pressable>
      </View>

      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log New Dorm Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item name (e.g. Canned Tuna)"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity (e.g. 2 cans)"
              value={qty}
              onChangeText={setQty}
            />
            <TextInput
              style={styles.input}
              placeholder="Shelf (e.g. Dry cabinet)"
              value={shelf}
              onChangeText={setShelf}
            />
            <View style={styles.expiryRow}>
              {[2, 7, 30].map((d) => (
                <Pressable
                  key={d}
                  style={[styles.expiryBtn, daysLeft === d && { backgroundColor: Colors.primary }]}
                  onPress={() => setDaysLeft(d)}
                >
                  <Text style={[styles.expiryText, daysLeft === d && { color: Colors.onPrimary }]}>
                    {d} days
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Add to Pantry</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, paddingHorizontal: Spacing.md },
  header: { paddingVertical: Spacing.sm },
  title: { fontFamily: Fonts.serifSemiBold, fontSize: 26, color: Colors.primary },
  subtitle: { fontFamily: Fonts.sansMedium, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  searchInput: { height: 42, borderRadius: Radii.md, backgroundColor: Colors.surfaceLowest, paddingHorizontal: 12, marginBottom: 10, fontFamily: Fonts.sansRegular, fontSize: 13 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  filterPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.full, backgroundColor: Colors.surfaceContainer },
  filterPillActive: { backgroundColor: Colors.primary },
  filterText: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.onSurfaceVariant },
  filterTextActive: { color: Colors.onPrimary },
  alertBanner: { flexDirection: 'row', gap: 10, backgroundColor: Colors.secondaryFixed, padding: 14, borderRadius: Radii.lg, marginBottom: 12 },
  alertTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 14, color: Colors.secondary },
  alertBody: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  alertLink: { fontFamily: Fonts.sansBold, fontSize: 12, color: Colors.secondary, marginTop: 6 },
  list: { gap: 10, paddingBottom: 90 },
  itemCard: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  itemName: { fontFamily: Fonts.sansBold, fontSize: 15, color: Colors.primary },
  itemMeta: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.full },
  badgeUrgent: { backgroundColor: Colors.secondaryFixed },
  badgeFresh: { backgroundColor: Colors.primaryFixed },
  badgeText: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.primary },
  doneBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceLow, alignItems: 'center', justifyContent: 'center' },
  quickAddBtn: { position: 'absolute', bottom: 16, left: Spacing.md, right: Spacing.md, height: 50, borderRadius: Radii.md, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  quickAddText: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.onPrimary },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(16,30,24,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.surfaceLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, gap: 12 },
  modalTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 18, color: Colors.primary },
  input: { height: 48, borderRadius: Radii.md, backgroundColor: Colors.surfaceLow, paddingHorizontal: 14, fontFamily: Fonts.sansRegular, fontSize: 14 },
  expiryRow: { flexDirection: 'row', gap: 8 },
  expiryBtn: { flex: 1, paddingVertical: 10, borderRadius: Radii.md, backgroundColor: Colors.surfaceContainer, alignItems: 'center' },
  expiryText: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.primary },
  saveBtn: { height: 48, borderRadius: Radii.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.onPrimary },
});
