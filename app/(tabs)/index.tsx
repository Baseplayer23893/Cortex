import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/themeStore';
import { useTasks } from '../../lib/queries/tasks';
import { useHabits } from '../../lib/queries/habits';
import { useSessions } from '../../lib/queries/sessions';
import ScreenTransition from '../../components/ScreenTransition';

export default function Dashboard() {
  const theme = useTheme();
  const today = new Date().toISOString().split('T')[0];
  const { data: tasks } = useTasks(today);
  const { data: habits } = useHabits();
  const { data: sessions } = useSessions();

  const totalToday = sessions
    ?.filter((s) => s.completed_at.startsWith(today))
    .reduce((sum, s) => sum + s.duration_minutes, 0) || 0;

  const topHabit = habits?.sort((a, b) => b.streak_count - a.streak_count)?.[0];
  const completedTasks = tasks?.filter((t) => t.is_completed).length || 0;
  const totalTasks = tasks?.length || 0;

  return (
    <ScreenTransition>
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>CORTEX</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>TODAY</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{totalToday}m</Text>
          </View>
          <View style={[styles.statCard, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>STREAK</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{topHabit?.streak_count || 0}d</Text>
          </View>
          <View style={[styles.statCard, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>TASKS</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{completedTasks}/{totalTasks}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>CURRENT HABIT</Text>
          <View style={[styles.habitRow, { borderColor: theme.colors.border }]}>
            <Text style={[styles.habitName, { color: theme.colors.text }]}>
              {topHabit?.name || 'NO HABITS'}
            </Text>
            <Text style={[styles.streak, { color: theme.colors.textMuted }]}>
              {topHabit ? `${topHabit.streak_count} DAY STREAK` : 'ADD ONE'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>TODAY&apos;S TASKS</Text>
          {tasks?.length ? tasks.map((task) => (
            <View key={task.id} style={[styles.taskRow, { borderColor: theme.colors.border }]}>
              <View style={[styles.checkbox, { borderColor: theme.colors.border, backgroundColor: task.is_completed ? theme.colors.accent : 'transparent' }]} />
              <Text style={[styles.taskText, { color: theme.colors.text, textDecorationLine: task.is_completed ? 'line-through' : 'none' }]}>
                {task.title}
              </Text>
            </View>
          )) : (
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No tasks for today</Text>
          )}
        </View>
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { fontSize: 18, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 4, padding: 12, alignItems: 'center' },
  statLabel: { fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 20, fontFamily: 'monospace' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 8 },
  habitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 4, padding: 12 },
  habitName: { fontSize: 14, fontFamily: 'monospace' },
  streak: { fontSize: 11, fontFamily: 'monospace' },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  checkbox: { width: 14, height: 14, borderWidth: 1, borderRadius: 2 },
  taskText: { fontSize: 13, fontFamily: 'monospace' },
  emptyText: { fontSize: 12, fontFamily: 'monospace', paddingVertical: 10 },
});
