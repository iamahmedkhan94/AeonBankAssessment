import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

function SkeletonBlock({ width, height, style }: { width: number | string; height: number; style?: object }) {
  return <View style={[styles.block, { width: width as number, height }, style]} />;
}

export function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.left}>
        <SkeletonBlock width="70%" height={16} />
        <SkeletonBlock width="45%" height={12} style={styles.gap} />
        <SkeletonBlock width="55%" height={10} style={styles.gap} />
      </View>
      <SkeletonBlock width={80} height={28} style={styles.badge} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
  },
  block: {
    backgroundColor: colors.border,
    borderRadius: 6,
  },
  gap: {
    marginTop: spacing.xs,
  },
  badge: {
    borderRadius: 8,
  },
});
