import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/themeStore';
import { useHabits, useCreateHabit, useCompleteHabit } from '../../lib/queries/habits';
import { useCelebrationStore } from '../../stores/celebrationStore';
import ScreenTransition from '../../components/ScreenTransition';

export default function Habits() {
  const theme = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const { data: habits } = useHabits();
  const createHabit = useCreateHabit();
  const completeHabit = useCompleteHabit();

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await createHabit.mutateAsync(newName.trim());
    setNewName('');
    setShowAdd(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <ScreenTransition>
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>HABITS</Text>

        <View style={styles.list}>
          {habits?.length ? habits.map((habit) => {
            const completedToday = habit.last_completed_at === today;
            return (
              <TouchableOpacity
                key={habit.id}
                onPress={() => {
                  const nextStreak = (habit.streak_count || 0) + 1;
                  completeHabit.mutate(habit.id, {
                    onSuccess: () => {
                      if (useCelebrationStore.getState().isMilestone(nextStreak)) {
                        useCelebrationStore.getState().show(nextStreak, habit.name);
                      }
                    },
                  });
                }}
                style={[styles.habitRow, { borderColor: theme.colors.border }]}
              >
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitName, { color: theme.colors.text }]}>{habit.name}</Text>
                  <View style={styles.streakRow}>
                    <View style={[styles.dot, { backgroundColor: completedToday ? theme.colors.accent : 'transparent', borderColor: theme.colors.border }]} />
                    <Text style={[styles.streakText, { color: theme.colors.textMuted }]}>
                      {habit.streak_count} DAY STREAK
                    </Text>
                  </View>
                </View>
                {completedToday && <Text style={[styles.check, { color: theme.colors.accent }]}>✓</Text>}
              </TouchableOpacity>
            );
          }) : (
            <Text style={[styles.empty, { color: theme.colors.textMuted }]}>No habits yet</Text>
          )}
        </View>

        {showAdd ? (
          <View style={[styles.addRow, { borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.addInput, { color: theme.colors.text }]}
              placeholder="Habit name"
              placeholderTextColor={theme.colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAdd}
              autoFocus
            />
            <TouchableOpacity onPress={handleAdd}>
              <Text style={[styles.addBtn, { color: theme.colors.accent }]}>ADD</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setShowAdd(true)} style={[styles.addButton, { borderColor: theme.colors.border }]}>
            <Text style={[styles.addButtonText, { color: theme.colors.text }]}>+ NEW HABIT</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { fontSize: 18, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 },
  list: { gap: 0, flex: 1 },
  habitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  habitInfo: { gap: 8 },
  habitName: { fontSize: 14, fontFamily: 'monospace' },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 2, borderWidth: 1 },
  streakText: { fontSize: 10, fontFamily: 'monospace' },
  check: { fontSize: 16, fontFamily: 'monospace' },
  empty: { fontSize: 12, fontFamily: 'monospace', paddingVertical: 16 },
  addRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 4, paddingHorizontal: 12 },
  addInput: { flex: 1, fontFamily: 'monospace', fontSize: 14, paddingVertical: 12 },
  addBtn: { fontSize: 12, fontFamily: 'monospace', letterSpacing: 1, paddingLeft: 8 },
  addButton: { borderWidth: 1, borderRadius: 4, padding: 12, alignItems: 'center' },
  addButtonText: { fontSize: 12, fontFamily: 'monospace', letterSpacing: 1 },
});
