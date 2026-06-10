import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Task } from '../../types';

export function useTasks(date: string) {
  return useQuery({
    queryKey: ['tasks', date],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('scheduled_date', date)
        .order('created_at');
      return data as Task[];
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: Pick<Task, 'title' | 'scheduled_date'>) => {
      const { data } = await supabase.from('tasks').insert(task).select().single();
      return data as Task;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      await supabase.from('tasks').update({ is_completed }).eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
