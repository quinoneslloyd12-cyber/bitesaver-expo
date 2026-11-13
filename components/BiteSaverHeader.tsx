import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Colors, Fonts, Spacing } from '../constants/theme';

export function BiteSaverHeader() {
  return (
    <View style={styles.header}>
      <Pressable style={styles.brandRow} onPress={() => router.replace('/')}>
        <Image source={require('../assets/images/icon.png')} style={styles.icon} />
        <View>
          <Text style={styles.title}>BiteSaver</Text>
          <Text style={styles.subtitle}>Offline Ready</Text>
        </View>
      </Pressable>

      <Pressable style={styles.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
        <Text style={styles.avatarInitials}>MS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainer,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 32, height: 32, borderRadius: 8 },
  title: { fontFamily: Fonts.serifSemiBold, fontSize: 16, color: Colors.primary, lineHeight: 19 },
  subtitle: { fontFamily: Fonts.sansBold, fontSize: 10, color: Colors.surfaceTint },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontFamily: Fonts.sansBold, fontSize: 12, color: Colors.onPrimary },
});
