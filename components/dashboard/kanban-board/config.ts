import { KanbanState } from './types';

// SUPABASE: This initial data would be replaced by data fetched from Supabase
// Consider creating database tables for:
// 1. boards - to store board information
// 2. columns - to store column data with board_id foreign key
// 3. tasks - to store task data with column_id foreign key
export const initialKanbanState: KanbanState = {
  board: {
    id: 'main-board',
    title: 'Main Board',
    columnIds: ['next-up', 'in-progress', 'review', 'completed'],
  },
  columns: {
    'next-up': {
      id: 'next-up',
      title: 'Next Up',
      order: 0,
      color: 'bg-amber-500',
      taskIds: ['1', '2'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      order: 1,
      color: 'bg-purple-500',
      taskIds: ['3', '4', '5'],
    },
    review: {
      id: 'review',
      title: 'Review',
      order: 2,
      color: 'bg-cyan-500',
      taskIds: [],
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      order: 3,
      color: 'bg-green-500',
      taskIds: ['8', '9', '10'],
    },
  },
  tasks: {
    '1': {
      id: '1',
      title: 'Mockups',
      priority: 'medium',
      dueDate: '2023-12-10',
      order: 0,
      columnId: 'next-up',
    },
    '2': {
      id: '2',
      title: 'UI Animation',
      priority: 'high',
      dueDate: '2023-12-15',
      order: 1,
      columnId: 'next-up',
    },
    '3': {
      id: '3',
      title: 'Usability Testing',
      priority: 'low',
      dueDate: '2023-12-20',
      order: 0,
      columnId: 'in-progress',
    },
    '4': {
      id: '4',
      title: 'Front-end Development',
      priority: 'high',
      dueDate: '2023-12-25',
      order: 1,
      columnId: 'in-progress',
    },
    '5': {
      id: '5',
      title: 'Back-end Development',
      priority: 'medium',
      dueDate: '2023-12-30',
      order: 2,
      columnId: 'in-progress',
    },
    '8': {
      id: '8',
      title: 'Hi-Fi Design',
      priority: 'high',
      dueDate: '2024-01-15',
      order: 0,
      columnId: 'completed',
    },
    '9': {
      id: '9',
      title: 'Wireframe',
      priority: 'high',
      dueDate: '2024-01-20',
      order: 1,
      columnId: 'completed',
    },
    '10': {
      id: '10',
      title: 'User Flow',
      priority: 'medium',
      dueDate: '2024-01-25',
      order: 2,
      columnId: 'completed',
    },
  },
};

// SUPABASE: Consider creating helper functions to transform database data
// into the normalized state structure expected by the application
// Example:
// export const transformSupabaseData = (
//   board: SupabaseBoard,
//   columns: SupabaseColumn[],
//   tasks: SupabaseTask[]
// ): KanbanState => {
//   // Transform logic here
// };
