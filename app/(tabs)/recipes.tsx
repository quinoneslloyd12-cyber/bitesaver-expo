import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Lightbulb, Sparkles, X } from 'lucide-react-native';
import { BiteSaverHeader } from '../../components/BiteSaverHeader';
import { useBiteSaver } from '../../store/BiteSaverContext';
import { Colors, Fonts, Radii, Spacing } from '../../constants/theme';

const RECIPES = [
  {
    id: 'r1',
    title: 'Crispy Garlic Tofu & Spinach Bowl',
    time: '15 mins',
    appliance: '1 pan',
    cost: 35,
    savings: 110,
    ingredients: ['Firm Tofu', 'Baby Spinach', 'Garlic', 'Soy Sauce', 'Jasmine Rice'],
    steps: ['Cube and pat dry firm tofu.', 'Pan-sear until golden.', 'Toss with garlic, soy sauce, and baby spinach over jasmine rice.'],
  },
  {
    id: 'r2',
    title: 'Dorm-Style Egg Fried Rice',
    time: '10 mins',
    appliance: '1 pan',
    cost: 28,
    savings: 95,
    ingredients: ['Day-old Rice', 'Eggs', 'Garlic', 'Spring Onion', 'Soy Sauce'],
    steps: ['Scramble beaten eggs softly.', 'Stir-fry cold day-old rice with garlic and soy sauce.', 'Top with chopped spring onions.'],
  },
  {
    id: 'r3',
    title: 'Soy-Calamansi Tofu Stir-fry',
    time: '12 mins',
    appliance: 'Induction burner',
    cost: 40,
    savings: 105,
    ingredients: ['Firm Tofu', 'Soy Sauce & Calamansi', 'Cooking Oil'],
    steps: ['Whisk soy sauce and calamansi.', 'Crisp cubed tofu on induction burner.', 'Simmer with glaze for 1 minute.'],
  },
];

export default function RecipesScreen() {
  const { pantryItems, completeRescueMeal } = useBiteSaver();
  const [filter, setFilter] = useState<'all' | 'ready'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof RECIPES)[0] | null>(null);

  const enriched = RECIPES.map((r) => {
    const matched = r.ingredients.filter((ing) =>
      pantryItems.some((p) => p.name.toLowerCase().includes(ing.split(' ')[0].toLowerCase()))
    );
    return { ...r, matchedCount: matched.length, isReady: matched.length === r.ingredients.length };
  });

  const visible = filter === 'ready' ? enriched.filter((r) => r.isReady) : enriched;
  const readyCount = enriched.filter((r) => r.isReady).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <BiteSaverHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>What Can I Make Now?</Text>
        <Text style={styles.sub}>Zero-waste meal ideas using ingredients already in your dorm pantry.</Text>

        <Pressable style={styles.readyBanner} onPress={() => setFilter(filter === 'ready' ? 'all' : 'ready')}>
          <View style={styles.readyLeft}>
            <Sparkles size={20} color={Colors.primaryFixed} />
            <View>
              <Text style={styles.readyTitle}>Ready to Cook Right Now</Text>
              <Text style={styles.readySub}>{readyCount} complete meals • 0 missing items</Text>
            </View>
          </View>
          <View style={styles.readyPill}>
            <Text style={styles.readyPillText}>{readyCount} Ready</Text>
          </View>
        </Pressable>

        {visible.map((recipe) => (
          <View key={recipe.id} style={styles.card}>
            <View style={styles.badgeRow}>
              <Text style={styles.matchText}>
                {recipe.matchedCount}/{recipe.ingredients.length} ingredients in pantry
              </Text>
              <Text style={styles.costText}>Est. ₱{recipe.cost}</Text>
            </View>
            <Text style={styles.cardTitle}>{recipe.title}</Text>
            <Text style={styles.cardMeta}>{recipe.time} • {recipe.appliance}</Text>
            <Pressable style={styles.cookBtn} onPress={() => setSelectedRecipe(recipe)}>
              <Text style={styles.cookBtnText}>Cook this recipe →</Text>
            </Pressable>
          </View>
        ))}

        <View style={styles.tipCard}>
          <Lightbulb size={20} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipKicker}>STUDENT PRO-TIP • SHELF LIFE HACK</Text>
            <Text style={styles.tipText}>
              Freezing firm tofu gives it a meatier texture and extends shelf life by 3 months!
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!selectedRecipe} transparent animationType="slide">
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalTop}>
              <Text style={styles.modalTitle}>{selectedRecipe?.title}</Text>
              <Pressable onPress={() => setSelectedRecipe(null)}>
                <X size={20} color={Colors.onSurfaceVariant} />
              </Pressable>
            </View>
            {selectedRecipe?.steps.map((step, i) => (
              <View key={step} style={styles.stepRow}>
                <Check size={16} color={Colors.surfaceTint} />
                <Text style={styles.stepText}>Step {i + 1}: {step}</Text>
              </View>
            ))}
            <Pressable
              style={styles.doneBtn}
              onPress={() => {
                completeRescueMeal();
                setSelectedRecipe(null);
              }}
            >
              <Text style={styles.doneBtnText}>Mark Cooked (Save ~₱{selectedRecipe?.savings})</Text>
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
  title: { fontFamily: Fonts.serifSemiBold, fontSize: 26, color: Colors.primary },
  sub: { fontFamily: Fonts.sansRegular, fontSize: 14, color: Colors.onSurfaceVariant },
  readyBanner: { backgroundColor: Colors.primary, borderRadius: Radii.lg, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readyLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  readyTitle: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.onPrimary },
  readySub: { fontFamily: Fonts.sansRegular, fontSize: 11, color: Colors.primaryFixed },
  readyPill: { backgroundColor: Colors.tertiaryFixed, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },
  readyPillText: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.primary },
  card: { backgroundColor: Colors.surfaceLowest, borderRadius: Radii.lg, padding: Spacing.md, gap: 6 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  matchText: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.surfaceTint },
  costText: { fontFamily: Fonts.sansBold, fontSize: 12, color: Colors.primary },
  cardTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 18, color: Colors.primary },
  cardMeta: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant },
  cookBtn: { alignSelf: 'flex-end', marginTop: 6, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radii.md },
  cookBtnText: { fontFamily: Fonts.sansBold, fontSize: 12, color: Colors.onPrimary },
  tipCard: { flexDirection: 'row', gap: 10, backgroundColor: Colors.surfaceContainer, borderRadius: Radii.lg, padding: Spacing.md },
  tipKicker: { fontFamily: Fonts.sansBold, fontSize: 10, color: Colors.surfaceTint },
  tipText: { fontFamily: Fonts.sansMedium, fontSize: 12, color: Colors.primary, marginTop: 2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(1,45,29,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.surfaceLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, gap: 12 },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 18, color: Colors.primary, flex: 1 },
  stepRow: { flexDirection: 'row', gap: 8, backgroundColor: Colors.surfaceLow, padding: 12, borderRadius: Radii.md },
  stepText: { fontFamily: Fonts.sansRegular, fontSize: 13, color: Colors.onSurface, flex: 1 },
  doneBtn: { height: 48, borderRadius: Radii.md, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.onSecondary },
});
