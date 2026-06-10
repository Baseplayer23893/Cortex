import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const WAVES = [0, 1, 2, 3, 4, 5];

function Wave({ index }: { index: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(20 + index * 5, { duration: 3000 + index * 500, easing: Easing.sin }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const opacity = Math.max(0.06 - index * 0.01, 0.02);

  return (
    <Animated.View
      style={[
        styles.wave,
        style,
        {
          backgroundColor: `rgba(0,100,180,${opacity})`,
          top: `${40 + index * 15}%` as any,
        },
      ]}
    />
  );
}

export default function MidnightOcean() {
  return (
    <View style={styles.container}>
      {WAVES.map((i) => (
        <Wave key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: '#050810' },
  wave: { position: 'absolute', width: '120%', height: 40, borderRadius: 20, left: -20 },
});
