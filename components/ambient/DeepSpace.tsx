import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay } from 'react-native-reanimated';

const STARS = Array.from({ length: 60 }, (_, i) => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: 1 + Math.random() * 2,
}));

function Star({ index, delay }: { index: number; delay: number }) {
  const opacity = useSharedValue(0.2);
  const s = STARS[index];

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(withTiming(1, { duration: 2000 }), -1, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          top: s.top as any,
          left: s.left as any,
          width: s.size,
          height: s.size,
        },
      ]}
    />
  );
}

export default function DeepSpace() {
  return (
    <View style={styles.container}>
      {STARS.map((_, i) => (
        <Star key={i} index={i} delay={i * 300} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: '#050510' },
  star: { position: 'absolute', borderRadius: 1, backgroundColor: '#fff' },
});
