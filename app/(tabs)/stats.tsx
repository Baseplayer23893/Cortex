import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/themeStore';
import { useSessions } from '../../lib/queries/sessions';
import ScreenTransition from '../../components/ScreenTransition';

export default function Stats() {
  const theme = useTheme();
  const { data: sessions } = useSessions();

  const totalMinutes = sessions?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const sessionCount = sessions?.length || 0;
  const avg = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;

  const heatmapData: Record<string, number> = {};
  sessions?.forEach((s) => {
    const day = s.completed_at.split('T')[0];
    heatmapData[day] = (heatmapData[day] || 0) + s.duration_minutes;
  });

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / 86400000);
  const weeks = Math.ceil((dayOfYear + 1) / 7);

  const intensityColor = (val: number) => {
    if (!val) return '#121212';
    if (val < 30) return '#1A1A1A';
    if (val < 60) return '#333333';
    return '#555555';
  };

  return (
    <ScreenTransition>
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>STATS</Text>

        <View style={styles.hero}>
          <Text style={[styles.heroLabel, { color: theme.colors.textMuted }]}>TOTAL FOCUS HOURS</Text>
          <Text style={[styles.heroValue, { color: theme.colors.text }]}>{hours}h {mins}m</Text>
        </View>

        <View style={styles.heatmap}>
          {Array.from({ length: 7 }, (_, row) => (
            <View key={row} style={styles.heatmapRow}>
              {Array.from({ length: Math.min(weeks, 12) }, (_, col) => {
                const d = new Date(today);
                d.setDate(today.getDate() - (col * 7) - (6 - row));
                const ds = d.toISOString().split('T')[0];
                const val = heatmapData[ds] || 0;
                return (
                  <View key={col} style={[styles.heatmapCell, { backgroundColor: intensityColor(val), borderColor: theme.colors.border }]} />
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>SESSIONS</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{sessionCount}</Text>
          </View>
          <View style={[styles.statCard, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>AVERAGE</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{avg}m</Text>
          </View>
        </View>
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { fontSize: 18, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 },
  hero: { alignItems: 'center', marginBottom: 32 },
  heroLabel: { fontSize: 11, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 8 },
  heroValue: { fontSize: 36, fontFamily: 'monospace' },
  heatmap: { gap: 3, marginBottom: 32 },
  heatmapRow: { flexDirection: 'row', gap: 3 },
  heatmapCell: { width: 12, height: 12, borderRadius: 2, borderWidth: 0.5 },
  statsGrid: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 4, padding: 16, alignItems: 'center' },
  statLabel: { fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 24, fontFamily: 'monospace' },
});
