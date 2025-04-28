export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    priority: Priority;
    dueDate: string;
    order: number;
    columnId: string;
  }