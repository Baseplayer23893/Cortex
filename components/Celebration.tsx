import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useTheme } from '../stores/themeStore';
import { useCelebrationStore } from '../stores/celebrationStore';

const { width } = Dimensions.get('window');
const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98'];
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  color: COLORS[i % COLORS.length],
  size: 4 + Math.random() * 6,
  startX: Math.random() * width,
  delay: Math.random() * 300,
}));
const DURATIONS = PARTICLES.map(() => 2000 + Math.random() * 1000);

function Particle({ index }: { index: number }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const p = PARTICLES[index];

  useEffect(() => {
    translateY.value = withDelay(p.delay, withTiming(-400 - Math.random() * 200, { duration: DURATIONS[index], easing: Easing.out(Easing.cubic) }));
    translateX.value = withDelay(p.delay, withTiming((Math.random() - 0.5) * 200, { duration: DURATIONS[index] }));
    scale.value = withDelay(p.delay, withTiming(0.1, { duration: DURATIONS[index] }));
    rotation.value = withDelay(p.delay, withRepeat(withTiming(360, { duration: 1000 }), 2));
    opacity.value = withDelay(p.delay + DURATIONS[index] * 0.75, withTiming(0, { duration: 500 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: p.startX,
          width: p.size,
          height: p.size * 1.5,
          borderRadius: 2,
          backgroundColor: p.color,
        },
        style,
      ]}
    />
  );
}

export default function Celebration() {
  const theme = useTheme();
  const { visible, streakCount, habitName, hide } = useCelebrationStore();
  const fade = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      fade.value = withTiming(1, { duration: 200 });
      timerRef.current = setTimeout(() => hide(), 3000);
    } else {
      fade.value = withTiming(0, { duration: 200 });
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      {PARTICLES.map((_, i) => (
        <Particle key={i} index={i} />
      ))}
      <View style={styles.textBox}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={[styles.count, { color: theme.colors.text }]}>{streakCount} DAY STREAK</Text>
        <Text style={[styles.name, { color: theme.colors.textMuted }]}>{habitName}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, alignItems: 'center', justifyContent: 'center' },
  particle: { position: 'absolute', bottom: -20 },
  textBox: { alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 32, paddingVertical: 24, borderRadius: 8 },
  emoji: { fontSize: 48 },
  count: { fontSize: 20, fontFamily: 'monospace', letterSpacing: 1 },
  name: { fontSize: 14, fontFamily: 'monospace' },
});
