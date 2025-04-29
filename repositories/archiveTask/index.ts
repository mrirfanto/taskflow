import { createClient } from '@/utils/supabase/client';

export const archiveTask = async (taskId: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from('tasks')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', taskId);
  if (error) throw error;
}; 