export interface Task {
  id: string;
  user_id: string;
  title: string;
  scheduled_date: string;
  is_completed: boolean;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  streak_count: number;
  last_completed_at: string | null;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  duration_minutes: number;
  mode: 'pomodoro' | 'free';
  completed_at: string;
}

export type TimerMode = 'pomodoro' | 'free';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';
