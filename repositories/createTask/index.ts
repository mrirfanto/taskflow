import { createClient } from '@/utils/supabase/client';
import { Task, Priority } from '@/types/task';

interface CreateTaskParams {
  title: string;
  priority: Priority;
  dueDate: string;
  columnId: string;
  order: number;
}

export const createTask = async ({
  title,
  priority,
  dueDate,
  columnId,
  order,
}: CreateTaskParams): Promise<Task> => {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  if (!user) throw new Error('User not authenticated');

  // Insert the new task into the database
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      priority,
      due_date: dueDate,
      column_id: columnId,
      sort_order: order,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create task');

  // Transform the database response to match the Task interface
  const task: Task = {
    id: data.id,
    title: data.title,
    priority: data.priority,
    dueDate: data.due_date,
    order: data.sort_order,
    columnId: data.column_id,
    archived_at: data.archived_at,
  };

  return task;
};
