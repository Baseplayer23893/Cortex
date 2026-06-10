import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Habit } from '../../types';

export function useHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data } = await supabase.from('habits').select('*').order('created_at');
      return data as Habit[];
    },
  });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await supabase.from('habits').insert({ name }).select().single();
      return data as Habit;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useCompleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('habits')
        .update({ last_completed_at: today, streak_count: supabase.rpc('increment_streak', { habit_id: id }) })
        .eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}
