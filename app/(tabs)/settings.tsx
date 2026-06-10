import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, useThemeStore } from '../../stores/themeStore';
import { themes, type ThemeName } from '../../themes';
import { useBackgroundStore, backgroundScenes, type BackgroundScene } from '../../stores/backgroundStore';
import ScreenTransition from '../../components/ScreenTransition';

export default function Settings() {
  const theme = useTheme();
  const setTheme = useThemeStore((s) => s.setTheme);
  const activeTheme = useThemeStore((s) => s.active);
  const activeBg = useBackgroundStore((s) => s.active);
  const setBgScene = useBackgroundStore((s) => s.setScene);

  return (
    <ScreenTransition>
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>SETTINGS</Text>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>THEME</Text>
          {(Object.keys(themes) as ThemeName[]).map((key) => {
            const t = themes[key];
            const isActive = key === activeTheme;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setTheme(key)}
                style={[styles.option, { borderColor: isActive ? theme.colors.accent : theme.colors.border }]}
              >
                <View style={[styles.colorDot, { backgroundColor: t.colors.primary }]} />
                <Text style={{ color: isActive ? theme.colors.accent : theme.colors.text, fontSize: 14 }}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.textMuted }]}>TIMER BACKGROUND</Text>
          {(Object.keys(backgroundScenes) as BackgroundScene[]).map((key) => {
            const scene = backgroundScenes[key];
            const isActive = key === activeBg;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setBgScene(key)}
                style={[styles.option, { borderColor: isActive ? theme.colors.accent : theme.colors.border }]}
              >
                <Text style={{ color: isActive ? theme.colors.accent : theme.colors.text, fontSize: 14 }}>
                  {scene.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 18, fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 32 },
  section: { gap: 8, marginBottom: 32 },
  label: { fontSize: 12, letterSpacing: 1, marginBottom: 8, fontFamily: 'monospace' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
  },
  colorDot: { width: 12, height: 12, borderRadius: 2 },
});
