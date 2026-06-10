import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/themeStore';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.icon, focused && { borderColor: theme.colors.accent }]}>
      <Text style={{ color: focused ? theme.colors.accent : theme.colors.textMuted, fontSize: 10 }}>
        {name}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <TabIcon name="📊" focused={focused} /> }}
      />
      <Tabs.Screen
        name="timer"
        options={{ title: 'Timer', tabBarIcon: ({ focused }) => <TabIcon name="⏱" focused={focused} /> }}
      />
      <Tabs.Screen
        name="planner"
        options={{ title: 'Planner', tabBarIcon: ({ focused }) => <TabIcon name="📅" focused={focused} /> }}
      />
      <Tabs.Screen
        name="habits"
        options={{ title: 'Habits', tabBarIcon: ({ focused }) => <TabIcon name="🔥" focused={focused} /> }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: 'Stats', tabBarIcon: ({ focused }) => <TabIcon name="📈" focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ focused }) => <TabIcon name="⚙" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
  },
});
