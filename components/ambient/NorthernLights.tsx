import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const BANDS = [0, 1, 2, 3, 4];
const COLORS = ['rgba(0,255,128,0.08)', 'rgba(0,200,255,0.06)', 'rgba(100,0,255,0.05)'];

function AuroraBand({ index }: { index: number }) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, { duration: 8000 + index * 2000, easing: Easing.sin }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.band,
        style,
        {
          backgroundColor: COLORS[index % COLORS.length],
          top: `${20 + index * 30}%` as any,
        },
      ]}
    />
  );
}

export default function NorthernLights() {
  return (
    <View style={styles.container}>
      {BANDS.map((i) => (
        <AuroraBand key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: '#050510' },
  band: { position: 'absolute', width: '200%', height: 80, borderRadius: 40 },
});
