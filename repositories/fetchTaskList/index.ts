import { createClient } from '@/utils/supabase/client';
import {
  DatabaseBoard,
  DatabaseColumn,
  DatabaseTask,
} from '@/repositories/types';
import { KanbanState } from '@/types/kanban-board';
import { Column } from '@/types/column';
import { Task } from '@/types/task';
import { createDefaultBoard } from '@/repositories/createDefaultBoard';

const supabase = createClient();

export const fetchTaskList = async () => {
  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('User not authenticated');

  let boardData: DatabaseBoard;

  // Fetch board data for the authenticated user
  const { data: boardDataFromDatabase, error: boardError } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // If no board exists, create a default one
  if (boardError?.code === 'PGRST116') {
    // No results found error
    try {
      boardData = await createDefaultBoard();
    } catch (error) {
      throw new Error(`Failed to create default board, ${error}`);
    }
  } else if (boardError) {
    throw boardError;
  } else {
    boardData = boardDataFromDatabase;
  }

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
    .is('archived_at', null)
    .in(
      'column_id',
      columnsData.map((col: DatabaseColumn) => col.id)
    )
    .order('sort_order', { ascending: false });

  if (tasksError) throw tasksError;

  // Transform the data into the expected KanbanState format
  const kanbanState: KanbanState = {
    board: {
      id: boardData.id,
      title: boardData.title,
      columnIds: columnsData.map((col: DatabaseColumn) => col.id),
    },
    columns: columnsData.reduce<Record<string, Column>>(
      (acc, col: DatabaseColumn) => ({
        ...acc,
        [col.id]: {
          id: col.id,
          title: col.title,
          order: col.sort_order,
          color: col.color,
          taskIds: tasksData
            .filter((task: DatabaseTask) => task.column_id === col.id)
            .map((task: DatabaseTask) => task.id),
        },
      }),
      {}
    ),
    tasks: tasksData.reduce<Record<string, Task>>(
      (acc, task: DatabaseTask) => ({
        ...acc,
        [task.id]: {
          id: task.id,
          title: task.title,
          priority: task.priority,
          dueDate: task.due_date,
          order: task.sort_order,
          columnId: task.column_id,
          archived_at: task.archived_at,
        },
      }),
      {}
    ),
  };

  return kanbanState;
};
