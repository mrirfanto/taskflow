import { KanbanState } from "@/types/kanban-board";
import { Task } from "@/types/task";

// Helper types for optimistic updates
export type OptimisticUpdate<T> = (currentData: T | undefined) => T | undefined;
export type UpdateResult<T> = { success: true; data: T } | { success: false; error: Error };

// Helper functions for optimistic updates
export const createOptimisticUpdate = (
  taskId: string,
  taskData: Partial<Task>,
  columnId: string
): OptimisticUpdate<KanbanState> => {
  return (currentData) => {
    if (!currentData) return currentData;
    
    const updatedData = { ...currentData };
    const newTasks = { ...updatedData.tasks };
    
    // Update task data
    newTasks[taskId] = {
      ...newTasks[taskId],
      ...taskData,
    };
    
    // Update column if needed
    if (columnId && updatedData.columns[columnId]) {
      updatedData.columns[columnId] = {
        ...updatedData.columns[columnId],
        taskIds: [taskId, ...updatedData.columns[columnId].taskIds],
      };
    }
    
    return {
      ...updatedData,
      tasks: newTasks,
    };
  };
};

export const removeTaskFromColumn = (
  taskId: string,
  columnId: string
): OptimisticUpdate<KanbanState> => {
  return (currentData) => {
    if (!currentData) return currentData;
    
    const updatedData = { ...currentData };
    if (updatedData.columns[columnId]) {
      updatedData.columns[columnId] = {
        ...updatedData.columns[columnId],
        taskIds: updatedData.columns[columnId].taskIds.filter(id => id !== taskId),
      };
    }
    
    return updatedData;
  };
};

export const withOptimisticUpdate = async <T, R = T>(
  mutate: (update: OptimisticUpdate<T>, options?: { revalidate: boolean }) => Promise<T | undefined>,
  optimisticUpdate: OptimisticUpdate<T>,
  operation: () => Promise<UpdateResult<R>>,
  rollbackUpdate: OptimisticUpdate<T>
): Promise<R> => {
  // Apply optimistic update
  await mutate(optimisticUpdate, { revalidate: false });
  
  try {
    const result = await operation();
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  } catch (error) {
    // Rollback on error
    await mutate(rollbackUpdate, { revalidate: false });
    throw error;
  }
}; 