import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useTheme } from '../../stores/themeStore';
import { useTimerStore } from '../../stores/timerStore';
import { useCreateSession } from '../../lib/queries/sessions';
import AmbientBackground from '../../components/AmbientBackground';
import { useBackgroundStore } from '../../stores/backgroundStore';
import ScreenTransition from '../../components/ScreenTransition';

export default function Timer() {
  const theme = useTheme();
  const { mode, status, remaining, elapsed, setMode, setStatus, tick, reset } = useTimerStore();
  const createSession = useCreateSession();
  const activeBg = useBackgroundStore((s) => s.active);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (status === 'running') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(1, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const timerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const displayValue = mode === 'pomodoro' ? remaining : elapsed;
  const minutes = Math.floor(displayValue / 60);
  const seconds = displayValue % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, tick]);

  const completionRef = useRef({ mode, remaining, elapsed });
  useEffect(() => {
    completionRef.current = { mode, remaining, elapsed };
  });

  useEffect(() => {
    if (status === 'completed') {
      const { mode: m, remaining: r, elapsed: e } = completionRef.current;
      const duration = m === 'pomodoro'
        ? Math.floor((1500 - r) / 60)
        : Math.floor(e / 60);
      if (duration > 0) {
        createSession.mutate({ duration_minutes: duration, mode: m });
      }
    }
  }, [status, createSession]);

  const handleToggle = () => {
    if (status === 'idle' || status === 'completed') {
      setStatus('running');
    } else if (status === 'running') {
      setStatus('paused');
    } else {
      setStatus('running');
    }
  };

  const label = status === 'running' ? 'STOP' : status === 'paused' ? 'RESUME' : 'START';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      {activeBg !== 'default' && <AmbientBackground />}
      <ScreenTransition>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.modeRow}>
            <TouchableOpacity
              onPress={() => setMode('pomodoro')}
              style={[styles.modeBtn, { borderColor: mode === 'pomodoro' ? theme.colors.accent : theme.colors.surface }]}
            >
              <Text style={{ color: mode === 'pomodoro' ? theme.colors.accent : theme.colors.textMuted, fontSize: 11, letterSpacing: 2 }}>
                POMODORO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('free')}
              style={[styles.modeBtn, { borderColor: mode === 'free' ? theme.colors.accent : theme.colors.surface }]}
            >
              <Text style={{ color: mode === 'free' ? theme.colors.accent : theme.colors.textMuted, fontSize: 11, letterSpacing: 2 }}>
                FREE
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.Text
            style={[
              styles.timer,
              { color: theme.colors.text, textShadowColor: status === 'running' ? theme.colors.accent : 'transparent' },
              timerStyle,
            ]}
          >
            {display}
          </Animated.Text>

          <TouchableOpacity
            onPress={handleToggle}
            style={[styles.control, { borderColor: theme.colors.accent }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.controlText, { color: theme.colors.text }]}>{label}</Text>
          </TouchableOpacity>

          {status !== 'idle' && (
            <TouchableOpacity onPress={reset} style={styles.resetBtn}>
              <Text style={{ color: theme.colors.textMuted, fontSize: 11, letterSpacing: 1 }}>RESET</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScreenTransition>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 64, zIndex: 1 },
  modeBtn: { paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderRadius: 4 },
  timer: { fontSize: 72, fontFamily: 'monospace', letterSpacing: -2, marginBottom: 64, zIndex: 1, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  control: { paddingHorizontal: 56, paddingVertical: 16, borderWidth: 1, borderRadius: 4, zIndex: 1 },
  controlText: { fontSize: 14, letterSpacing: 3, fontFamily: 'monospace' },
  resetBtn: { marginTop: 24, padding: 8, zIndex: 1 },
});
