import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { createDefaultBoard } from '@/repositories/createDefaultBoard';
import { KanbanState } from '@/types/kanban-board';
import { Column } from '@/types/column';
import { Task } from '@/types/task';

export async function GET() {
  try {
    const supabase = await createClient();
    
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

    let board;
    // If no board exists, create a default one
    if (boardError?.code === 'PGRST116') {
      board = await createDefaultBoard();
    } else if (boardError) {
      throw boardError;
    } else {
      board = boardData;
    }

    // Fetch columns data
    const { data: columnsData, error: columnsError } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', board.id)
      .order('sort_order');

    if (columnsError) throw columnsError;

    // Fetch tasks data
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .is('archived_at', null)
      .in(
        'column_id',
        columnsData.map((col) => col.id)
      )
      .order('sort_order', { ascending: false });

    if (tasksError) throw tasksError;

    // Transform the data into the expected KanbanState format
    const kanbanState: KanbanState = {
      board: {
        id: board.id,
        title: board.title,
        columnIds: columnsData.map((col) => col.id),
      },
      columns: columnsData.reduce<Record<string, Column>>(
        (acc, col) => ({
          ...acc,
          [col.id]: {
            id: col.id,
            title: col.title,
            order: col.sort_order,
            color: col.color,
            taskIds: tasksData
              .filter((task) => task.column_id === col.id)
              .map((task) => task.id),
          },
        }),
        {}
      ),
      tasks: tasksData.reduce<Record<string, Task>>(
        (acc, task) => ({
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

    return NextResponse.json(kanbanState);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch board data: ${error}` },
      { status: 500 }
    );
  }
} 