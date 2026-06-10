import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

function Glow() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 3000, easing: Easing.sin }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.glow, style]} />
  );
}

export default function WarmCafe() {
  return (
    <View style={styles.container}>
      <Glow />
      <Glow />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: '#0F0A08' },
  glow: {
    position: 'absolute',
    top: '30%' as any,
    left: '25%' as any,
    width: '50%' as any,
    height: '40%' as any,
    borderRadius: 200,
    backgroundColor: 'rgba(255,150,50,0.08)',
  },
});
