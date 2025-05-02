import { KanbanState } from "@/types/kanban-board";
import useSWR from "swr";
import { Task, Priority } from "@/types/task";
import { v4 as uuidv4 } from 'uuid';
import { fetcher } from '@/utils/fetcher';
import { createOptimisticUpdate, removeTaskFromColumn, withOptimisticUpdate } from './utils/optimisticUpdates';

export default function useTasks() {
  const { data: kanbanState, error, isLoading, mutate } = useSWR<KanbanState>(
    '/api/board',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
    }
  );

  const createTask = async (
    title: string,
    priority: Priority,
    dueDate: string,
    columnId: string,
    order: number
  ): Promise<Task> => {
    const tempId = `temp-${uuidv4()}`;
    const newTask = {
      id: tempId,
      title,
      priority,
      dueDate,
      order,
      columnId,
      archived_at: null,
    };

    return withOptimisticUpdate<KanbanState, Task>(
      mutate,
      createOptimisticUpdate(tempId, newTask, columnId),
      async () => {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title, priority, dueDate, columnId, order }),
        });

        if (!response.ok) {
          return { success: false, error: new Error('Failed to create task') };
        }

        const createdTask = await response.json();
        return { success: true, data: createdTask };
      },
      (currentData) => {
        if (!currentData) return currentData;
        const updatedData = { ...currentData };
        const newTasks = { ...updatedData.tasks };
        delete newTasks[tempId];
        return {
          ...updatedData,
          tasks: newTasks,
        };
      }
    );
  };

  const archiveTask = async (taskId: string): Promise<void> => {
    if (!kanbanState) return;
    const task = kanbanState.tasks[taskId];
    if (!task) return;

    // Compose both updates: set archived_at and remove from column
    const optimisticUpdate = (currentData: KanbanState | undefined) => {
      let updated = createOptimisticUpdate(taskId, { archived_at: new Date().toISOString() }, task.columnId)(currentData);
      updated = removeTaskFromColumn(taskId, task.columnId)(updated);
      return updated;
    };

    // Rollback: set archived_at to null and re-add to column
    const rollbackUpdate = (currentData: KanbanState | undefined) => {
      const updated = createOptimisticUpdate(taskId, { archived_at: null }, task.columnId)(currentData);
      // Optionally, re-add to column if you want to fully rollback
      if (updated && updated.columns[task.columnId]) {
        updated.columns[task.columnId].taskIds = [taskId, ...updated.columns[task.columnId].taskIds];
      }
      return updated;
    };

    await withOptimisticUpdate<KanbanState, void>(
      mutate,
      optimisticUpdate,
      async () => {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) {
          return { success: false, error: new Error('Failed to archive task') };
        }
        return { success: true, data: undefined };
      },
      rollbackUpdate
    );
  };

  return {
    data: kanbanState,
    error,
    isLoading,
    createTask,
    archiveTask,
  };
}