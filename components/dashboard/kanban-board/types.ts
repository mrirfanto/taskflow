export type Priority = 'low' | 'medium' | 'high';

// SUPABASE: This would map to a 'boards' table
// Consider adding timestamps and user ownership fields
export interface Board {
  id: string;
  title: string;
  columnIds: string[];
}

// SUPABASE: This would map to a 'columns' table with a foreign key to boards
// Consider adding timestamps and created_by fields
export interface Column {
  id: string;
  title: string;
  order: number;
  color: string;
  taskIds: string[];
}

// SUPABASE: This would map to a 'tasks' table with a foreign key to columns
// Consider adding additional fields like description, assignee, comments, etc.
export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string;
  order: number;
  columnId: string;
}

// SUPABASE: When integrating with Supabase, we would fetch data from
// individual tables and convert it to this structure in the frontend
export interface KanbanState {
  board: Board;
  columns: { [columnId: string]: Column };
  tasks: { [taskId: string]: Task };
}

// SUPABASE: Consider adding these database-specific types
// export interface DatabaseBoard extends Omit<Board, 'columnIds'> {
//   created_at: string;
//   updated_at: string;
//   user_id: string;
// }
//
// export interface DatabaseColumn extends Omit<Column, 'taskIds'> {
//   created_at: string;
//   updated_at: string;
//   board_id: string;
// }
//
// export interface DatabaseTask extends Task {
//   created_at: string;
//   updated_at: string;
//   description?: string;
//   assignee_id?: string;
// }
