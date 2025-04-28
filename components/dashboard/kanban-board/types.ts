export type Priority = 'low' | 'medium' | 'high';

// Frontend-specific types
export interface Board {
  id: string;
  title: string;
  columnIds: string[];
}

export interface Column {
  id: string;
  title: string;
  order: number;
  color: string;
  taskIds: string[];
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string;
  order: number;
  columnId: string;
}

export interface KanbanState {
  board: Board;
  columns: { [columnId: string]: Column };
  tasks: { [taskId: string]: Task };
}

