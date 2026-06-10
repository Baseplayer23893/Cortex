import { View, StyleSheet } from 'react-native';
import { useBackgroundStore, type BackgroundScene } from '../stores/backgroundStore';
import { useTheme } from '../stores/themeStore';
import DeepSpace from './ambient/DeepSpace';
import CozyRain from './ambient/CozyRain';
import NorthernLights from './ambient/NorthernLights';
import MidnightOcean from './ambient/MidnightOcean';
import WarmCafe from './ambient/WarmCafe';

const sceneComponents: Record<BackgroundScene, React.ComponentType> = {
  'default': () => null,
  'deep-space': DeepSpace,
  'cozy-rain': CozyRain,
  'northern-lights': NorthernLights,
  'midnight-ocean': MidnightOcean,
  'warm-cafe': WarmCafe,
};

export default function AmbientBackground() {
  const active = useBackgroundStore((s) => s.active);
  const theme = useTheme();
  const Scene = sceneComponents[active];

  if (active === 'default') return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <Scene />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill },
});
