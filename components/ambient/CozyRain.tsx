import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';

const DROPS = Array.from({ length: 40 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  delay: i * 200,
}));

function RainDrop({ index }: { index: number }) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);
  const d = DROPS[index];

  useEffect(() => {
    translateY.value = withDelay(d.delay, withRepeat(withTiming(800, { duration: 1200, easing: Easing.linear }), -1));
    opacity.value = withDelay(d.delay, withTiming(0.4, { duration: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.drop,
        style,
        { left: d.left as any },
      ]}
    />
  );
}

export default function CozyRain() {
  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      {DROPS.map((_, i) => (
        <RainDrop key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: '#0A0A14' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(10,10,20,0.6)' },
  drop: { position: 'absolute', top: -20, width: 1, height: 16, backgroundColor: '#6688AA' },
});
