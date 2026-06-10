import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/themeStore';
import { useTasks, useCreateTask, useToggleTask } from '../../lib/queries/tasks';
import ScreenTransition from '../../components/ScreenTransition';

const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function Planner() {
  const theme = useTheme();
  const today = new Date();
  const [selected, setSelected] = useState(today.toISOString().split('T')[0]);
  const [newTask, setNewTask] = useState('');

  const { data: tasks } = useTasks(selected);
  const createTask = useCreateTask();
  const toggleTask = useToggleTask();

  const monthLabel = `${MONTHS[today.getMonth()]} ${today.getFullYear()}`;

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await createTask.mutateAsync({ title: newTask.trim(), scheduled_date: selected });
    setNewTask('');
  };

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return (
    <ScreenTransition>
      <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>{monthLabel}</Text>

        <View style={styles.calendar}>
          {DAYS.map((day, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const ds = date.toISOString().split('T')[0];
            const isSelected = ds === selected;
            return (
              <TouchableOpacity key={day} onPress={() => setSelected(ds)} style={styles.dayCol}>
                <Text style={[styles.dayName, { color: theme.colors.textMuted }]}>{day}</Text>
                <View style={[styles.dateCircle, { borderColor: isSelected ? theme.colors.accent : 'transparent' }]}>
                  <Text style={[styles.dateNum, { color: isSelected ? theme.colors.accent : theme.colors.text }]}>
                    {date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.inputRow, { borderColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Add task..."
            placeholderTextColor={theme.colors.textMuted}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity onPress={handleAdd}>
            <Text style={[styles.addBtn, { color: theme.colors.accent }]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskList}>
          {tasks?.length ? tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => toggleTask.mutate({ id: task.id, is_completed: !task.is_completed })}
              style={[styles.taskRow, { borderColor: theme.colors.border }]}
            >
              <View style={[styles.checkbox, { borderColor: theme.colors.border, backgroundColor: task.is_completed ? theme.colors.accent : 'transparent' }]} />
              <Text style={[styles.taskTitle, { color: theme.colors.text, textDecorationLine: task.is_completed ? 'line-through' : 'none' }]}>
                {task.title}
              </Text>
            </TouchableOpacity>
          )) : (
            <Text style={[styles.empty, { color: theme.colors.textMuted }]}>No tasks for this date</Text>
          )}
        </View>
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { fontSize: 18, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 },
  calendar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  dayCol: { alignItems: 'center', gap: 8 },
  dayName: { fontSize: 9, fontFamily: 'monospace', letterSpacing: 1 },
  dateCircle: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderWidth: 1 },
  dateNum: { fontSize: 14, fontFamily: 'monospace' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 4, paddingHorizontal: 12, marginBottom: 16 },
  input: { flex: 1, fontFamily: 'monospace', fontSize: 14, paddingVertical: 12 },
  addBtn: { fontSize: 20, fontFamily: 'monospace', paddingLeft: 8 },
  taskList: { gap: 0 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  checkbox: { width: 14, height: 14, borderWidth: 1, borderRadius: 2 },
  taskTitle: { fontSize: 13, fontFamily: 'monospace' },
  empty: { fontSize: 12, fontFamily: 'monospace', paddingVertical: 12 },
});
