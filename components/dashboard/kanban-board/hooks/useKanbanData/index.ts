import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import { KanbanState, Column, Task } from '../../types';
import { DatabaseColumn, DatabaseTask } from './types';

const supabase = createClient();

// Fetcher function for SWR
const fetcher = async () => {
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  if (!user) throw new Error('User not authenticated');

  // Fetch board data for the authenticated user
  const { data: boardData, error: boardError } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (boardError) throw boardError;

  // Fetch columns data
  const { data: columnsData, error: columnsError } = await supabase
    .from('columns')
    .select('*')
    .eq('board_id', boardData.id)
    .order('sort_order');

  if (columnsError) throw columnsError;

  // Fetch tasks data
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .in('column_id', columnsData.map((col: DatabaseColumn) => col.id))
    .order('sort_order');

  if (tasksError) throw tasksError;

  // Transform the data into the expected KanbanState format
  const kanbanState: KanbanState = {
    board: {
      id: boardData.id,
      title: boardData.title,
      columnIds: columnsData.map((col: DatabaseColumn) => col.id),
    },
    columns: columnsData.reduce<Record<string, Column>>((acc, col: DatabaseColumn) => ({
      ...acc,
      [col.id]: {
        id: col.id,
        title: col.title,
        order: col.order,
        color: col.color,
        taskIds: tasksData
          .filter((task: DatabaseTask) => task.column_id === col.id)
          .map((task: DatabaseTask) => task.id),
      },
    }), {}),
    tasks: tasksData.reduce<Record<string, Task>>((acc, task: DatabaseTask) => ({
      ...acc,
      [task.id]: {
        id: task.id,
        title: task.title,
        priority: task.priority,
        dueDate: task.due_date,
        order: task.order,
        columnId: task.column_id,
      },
    }), {}),
  };

  return kanbanState;
};

export function useKanbanData() {
  const { data, error, isLoading, mutate } = useSWR<KanbanState>(
    'kanban-data',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
} 