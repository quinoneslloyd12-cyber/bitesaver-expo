import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Fonts, Radii, Spacing } from '../constants/theme';

interface DailySpendingDialProps {
  spentToday: number;
  dailyLimit: number;
  monthlySpent: number;
  monthlyAllowance: number;
}

export function DailySpendingDial({
  spentToday,
  dailyLimit,
  monthlySpent,
  monthlyAllowance,
}: DailySpendingDialProps) {
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const remaining = dailyLimit - spentToday;
  const spentRatio = Math.min(1, Math.max(0, spentToday / Math.max(1, dailyLimit)));
  const savedPct = Math.max(0, Math.round(((dailyLimit - spentToday) / Math.max(1, dailyLimit)) * 100));
  const strokeDashoffset = circumference * (1 - spentRatio);

  const monthPct = Math.min(100, Math.round((monthlySpent / Math.max(1, monthlyAllowance)) * 100));
  const expectedTarget = Math.round((monthlyAllowance / 31) * 18);
  const aheadBy = expectedTarget - monthlySpent;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.kicker}>DAILY SPENDING DIAL</Text>
        <View style={[styles.paceBadge, remaining < 0 && { backgroundColor: Colors.secondaryFixed }]}>
          <Text style={[styles.paceText, remaining < 0 && { color: Colors.secondary }]}>
            {remaining >= 0 ? 'Safe Pace' : 'Over Cap'}
          </Text>
        </View>
      </View>

      <View style={styles.dialWrapper}>
        <Svg width={176} height={176} viewBox="0 0 160 160">
          <Circle
            cx={80}
            cy={80}
            r={radius}
            stroke={Colors.surfaceContainer}
            strokeWidth={13}
            fill="transparent"
          />
          <Circle
            cx={80}
            cy={80}
            r={radius}
            stroke={remaining >= 0 ? Colors.primaryContainer : Colors.secondary}
            strokeWidth={13}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            rotation={-90}
            origin="80, 80"
          />
          <Circle cx={80} cy={14} r={4} fill={Colors.secondaryContainer} />
        </Svg>

        <View style={styles.centerOverlay}>
          <Text style={[styles.currencyDisplay, remaining < 0 && { color: Colors.secondary }]}>
            {remaining < 0 ? `-₱${Math.abs(remaining)}` : `₱${remaining}`}
          </Text>
          <Text style={styles.subLabel}>left today</Text>
          <View style={styles.savedChip}>
            <Text style={styles.savedChipText}>{savedPct}% saved</Text>
          </View>
        </View>
      </View>

      <Text style={styles.caption}>
        of ₱{dailyLimit} daily budget • <Text style={{ color: Colors.secondary }}>₱{spentToday}</Text> spent so far
      </Text>

      <View style={styles.monthlyStrip}>
        <View style={styles.headerRow}>
          <Text style={styles.monthlyTitle}>October Allowance (Day 18/31)</Text>
          <Text style={styles.monthlyNums}>
            ₱{monthlySpent.toLocaleString()} / ₱{monthlyAllowance.toLocaleString()}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${monthPct}%` }]} />
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.paceDetail}>
            {aheadBy >= 0 ? `Ahead by ₱${aheadBy.toLocaleString()}` : `Behind by ₱${Math.abs(aheadBy).toLocaleString()}`}
          </Text>
          <Text style={styles.paceDetail}>Target: ₱{expectedTarget.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceLowest,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: Colors.surfaceTint,
  },
  paceBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  paceText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 11,
    color: Colors.primary,
  },
  dialWrapper: {
    width: 176,
    height: 176,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  currencyDisplay: {
    fontFamily: Fonts.serifBold,
    fontSize: 34,
    color: Colors.primary,
  },
  subLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  savedChip: {
    marginTop: 4,
    backgroundColor: Colors.surfaceLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  savedChipText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 11,
    color: Colors.surfaceTint,
  },
  caption: {
    fontFamily: Fonts.sansRegular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  monthlyStrip: {
    width: '100%',
    marginTop: 14,
    backgroundColor: Colors.surfaceLow,
    borderRadius: Radii.md,
    padding: 12,
    gap: 8,
  },
  monthlyTitle: {
    fontFamily: Fonts.sansMedium,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  monthlyNums: {
    fontFamily: Fonts.sansBold,
    fontSize: 11,
    color: Colors.primary,
  },
  track: {
    height: 8,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radii.full,
  },
  paceDetail: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 10,
    color: Colors.surfaceTint,
  },
});
