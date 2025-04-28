import { Priority } from '@/components/dashboard/kanban-board/types';

export interface DatabaseBoard {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseColumn {
  id: string;
  title: string;
  order: number;
  color: string;
  board_id: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTask {
  id: string;
  title: string;
  priority: Priority;
  due_date: string;
  order: number;
  column_id: string;
  created_at: string;
  updated_at: string;
  description?: string;
  assignee_id?: string;
} 