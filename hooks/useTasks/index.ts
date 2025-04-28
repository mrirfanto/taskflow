import { KanbanState } from "@/types/kanban-board";
import useSWR from "swr";
import { fetchTaskList } from "@/repositories/fetchTaskList";
import { createTask } from "@/repositories/createTask";
import { Task, Priority } from "@/types/task";
import { v4 as uuidv4 } from 'uuid';

export default function useTasks() {
    const { data, error, isLoading, mutate } = useSWR<KanbanState>(
        'kanban-data',
        fetchTaskList,
        {
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          refreshInterval: 30000, // Refresh every 30 seconds
        }
      );
    
    const handleCreateTask = async (
      title: string,
      priority: Priority,
      dueDate: string,
      columnId: string,
      order: number
    ): Promise<Task> => {
      // Generate a temporary ID for optimistic update
      const tempId = `temp-${uuidv4()}`;
      
      // Create a temporary task for optimistic update
      const tempTask: Task = {
        id: tempId,
        title,
        priority,
        dueDate,
        order,
        columnId,
      };
      
      // Optimistically update the UI
      await mutate(
        (currentData) => {
          if (!currentData) return currentData;
          
          // Create a copy of the current data
          const updatedData = { ...currentData };
          
          // Create a new tasks object without the temporary task
          const newTasks = { ...updatedData.tasks };
          delete newTasks[tempId];
          
          // Add the task to the tasks object
          updatedData.tasks = {
            ...newTasks,
            [tempId]: tempTask,
          };
          
          // Add the task ID to the column's taskIds array
          if (updatedData.columns[columnId]) {
            updatedData.columns[columnId] = {
              ...updatedData.columns[columnId],
              taskIds: [tempId, ...updatedData.columns[columnId].taskIds],
            };
          }
          
          return updatedData;
        },
        { revalidate: false } // Don't revalidate from the server yet
      );
      
      try {
        // Create the task on the server
        const newTask = await createTask({
          title,
          priority,
          dueDate,
          columnId,
          order,
        });
        
        // Update the UI with the real task data
        await mutate(
          (currentData) => {
            if (!currentData) return currentData;
            
            // Create a copy of the current data
            const updatedData = { ...currentData };
            
            // Create a new tasks object without the temporary task
            const newTasks = { ...updatedData.tasks };
            delete newTasks[tempId];
            
            // Add the real task
            updatedData.tasks = {
              [newTask.id]: newTask,
              ...newTasks,
            };
            
            // Update the column's taskIds array
            if (updatedData.columns[columnId]) {
              updatedData.columns[columnId] = {
                ...updatedData.columns[columnId],
                taskIds: [newTask.id, ...updatedData.columns[columnId].taskIds
                  .filter(id => id !== tempId)],
              };
            }
            
            return updatedData;
          },
          { revalidate: false } // Don't revalidate from the server yet
        );
        
        return newTask;
      } catch (error) {
        // If there's an error, revert the optimistic update
        await mutate(
          (currentData) => {
            if (!currentData) return currentData;
            
            // Create a copy of the current data
            const updatedData = { ...currentData };
            
            // Create a new tasks object without the temporary task
            const newTasks = { ...updatedData.tasks };
            delete newTasks[tempId];
            updatedData.tasks = newTasks;
            
            // Remove the task ID from the column's taskIds array
            if (updatedData.columns[columnId]) {
              updatedData.columns[columnId] = {
                ...updatedData.columns[columnId],
                taskIds: updatedData.columns[columnId].taskIds.filter(id => id !== tempId),
              };
            }
            
            return updatedData;
          },
          { revalidate: false } // Don't revalidate from the server yet
        );
        
        // Re-throw the error to be handled by the caller
        throw error;
      }
    };
    
    return {
      data,
      error,
      isLoading,
      mutate,
      createTask: handleCreateTask,
    };
}