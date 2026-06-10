import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { StudySession } from '../../types';

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('study_sessions')
        .select('*')
        .order('completed_at', { ascending: false });
      return data as StudySession[];
    },
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (session: Pick<StudySession, 'duration_minutes' | 'mode'>) => {
      const { data } = await supabase.from('study_sessions').insert(session).select().single();
      return data as StudySession;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessions'] }),
  });
}
