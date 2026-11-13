import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, Lock, RefreshCw, ShieldCheck, Zap } from 'lucide-react-native';
import { Colors, Fonts, Radii, Spacing } from '../constants/theme';

export default function WelcomeScreen() {
  const [vaultModalOpen, setVaultModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>CAMPUS READY</Text>
        </View>
        <Text style={styles.versionText}>v1.4 Dorm edition</Text>
      </View>

      <View style={styles.heroCenter}>
        <View style={styles.logoFrame}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.brandWordmark}>
          BiteSaver <Text style={{ color: Colors.surfaceTint }}>.</Text>
        </Text>
        <Text style={styles.tagline}>
          Stop wasting food and money. Keep every peso counted.
        </Text>

        <View style={styles.featureStack}>
          <View style={styles.featureChip}>
            <Zap size={15} color={Colors.surfaceTint} />
            <Text style={styles.featureText}>100% Offline-First</Text>
          </View>
          <View style={styles.featureChip}>
            <ShieldCheck size={15} color={Colors.surfaceTint} />
            <Text style={styles.featureText}>Smart Dorm Pantry</Text>
          </View>
          <View style={styles.featureChip}>
            <Lock size={15} color={Colors.secondary} />
            <Text style={styles.featureText}>Daily Micro-Budget</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomActions}>
        <Pressable
          style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.9 }]}
          onPress={() => setVaultModalOpen(true)}
        >
          <Text style={styles.primaryCtaText}>Start Saving Today</Text>
          <ArrowRight size={20} color={Colors.onSecondary} />
        </Pressable>

        <Pressable style={styles.restoreBtn} onPress={() => router.replace('/(tabs)/home')}>
          <RefreshCw size={16} color={Colors.onSurfaceVariant} />
          <Text style={styles.restoreText}>Restore local dorm backup</Text>
        </Pressable>

        <Text style={styles.privacyFooter}>No bank link required. Zero cloud tracking.</Text>
      </View>

      <Modal visible={vaultModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Offline Vault Ready</Text>
            <Text style={styles.modalBody}>
              BiteSaver keeps pantry expirations, receipt math, and street-food micro budgets safe inside your device storage.
            </Text>
            <Pressable
              style={styles.modalBtn}
              onPress={() => {
                setVaultModalOpen(false);
                router.replace('/(tabs)/home');
              }}
            >
              <Text style={styles.modalBtnText}>Open My Kitchen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface, paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.sm },
  statusChip: { backgroundColor: Colors.surfaceHigh, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.full },
  statusChipText: { fontFamily: Fonts.sansBold, fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 0.8 },
  versionText: { fontFamily: Fonts.sansSemiBold, fontSize: 12, color: Colors.onSurfaceVariant },
  heroCenter: { alignItems: 'center', gap: Spacing.md },
  logoFrame: { width: 116, height: 116, borderRadius: 28, backgroundColor: Colors.primaryContainer, padding: 8 },
  logoImage: { width: '100%', height: '100%', borderRadius: 20 },
  brandWordmark: { fontFamily: Fonts.serifBold, fontSize: 34, color: Colors.primary },
  tagline: { fontFamily: Fonts.sansMedium, fontSize: 16, color: Colors.onSurfaceVariant, textAlign: 'center', maxWidth: 280, lineHeight: 24 },
  featureStack: { gap: 8, alignItems: 'center', marginTop: 8 },
  featureChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.surfaceLow, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radii.full },
  featureText: { fontFamily: Fonts.sansSemiBold, fontSize: 13, color: Colors.onSurface },
  bottomActions: { gap: 10 },
  primaryCta: { height: 56, borderRadius: Radii.lg, backgroundColor: Colors.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryCtaText: { fontFamily: Fonts.sansBold, fontSize: 15, color: Colors.onSecondary },
  restoreBtn: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  restoreText: { fontFamily: Fonts.sansSemiBold, fontSize: 13, color: Colors.onSurfaceVariant },
  privacyFooter: { fontFamily: Fonts.sansRegular, fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(16,30,24,0.45)', justifyContent: 'flex-end', padding: Spacing.md },
  modalCard: { backgroundColor: Colors.surfaceLowest, borderRadius: 24, padding: Spacing.lg, gap: 12 },
  modalTitle: { fontFamily: Fonts.serifSemiBold, fontSize: 20, color: Colors.primary },
  modalBody: { fontFamily: Fonts.sansRegular, fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },
  modalBtn: { height: 48, borderRadius: Radii.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  modalBtnText: { fontFamily: Fonts.sansBold, fontSize: 14, color: Colors.onPrimary },
});
