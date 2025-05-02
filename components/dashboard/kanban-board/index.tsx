'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import useTasks from '@/hooks/useTasks';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import Column from './column';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

export default function KanbanBoard() {
  const { data: kanbanState, isLoading, createTask, archiveTask } = useTasks();
  const [creatingInColumn, setCreatingInColumn] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = (columnId: string) => {
    setCreatingInColumn(columnId);
  };

  const handleCancelCreateTask = () => {
    setCreatingInColumn(null);
  };

  const handleArchiveTask = async (taskId: string) => {
    try {
      await archiveTask(taskId);
      toast.success('Task archived successfully');
    } catch {
      toast.error('Failed to archive task');
    }
  };

  const handleSaveTask = async (
    taskData: Omit<Task, 'id' | 'columnId' | 'order' | 'archived_at'>
  ) => {
    if (!creatingInColumn || !kanbanState) return;

    setIsSubmitting(true);

    try {
      // Get the current column to determine the order for the new task
      const column = kanbanState.columns[creatingInColumn];
      const currentTasks =
        column?.taskIds
          .map((id: string) => kanbanState.tasks[id])
          .filter(
            (task: Task | undefined): task is Task => task !== undefined
          ) || [];

      // Calculate the new order (add to the top of the list)
      const newOrder =
        currentTasks.length > 0
          ? Math.max(...currentTasks.map((task: Task) => task.order)) + 1000
          : 1000;

      // Create the task using the useTasks hook
      await createTask(
        taskData.title,
        taskData.priority,
        taskData.dueDate,
        creatingInColumn,
        newOrder
      );

      // Close the create task form
      setCreatingInColumn(null);

      // Show success toast
      toast.success('Task created successfully', {
        richColors: true,
      });
    } catch (error) {
      // Show error toast
      toast.error('Failed to create task. Please try again.', {
        richColors: true,
      });
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const newColumnId = event.over?.id.toString();
    const oldColumnId = event.active.data?.current?.columnId;

    if (!newColumnId || !oldColumnId || !kanbanState) return;

    // Don't do anything if the task is dropped in the same column
    if (newColumnId === oldColumnId) return;
  };

  if (isLoading || !kanbanState) {
    return (
      <div className="h-full flex-grow-1">
        <div className="flex h-full gap-8 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 flex-grow-1 bg-muted p-4 rounded-md w-[280px]"
            >
              <Skeleton className="h-10 w-full mb-3" />
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-24 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const orderedColumns = [...kanbanState.board.columnIds]
    .map((columnId) => kanbanState.columns[columnId])
    .sort((a, b) => a.order - b.order);

  return (
    <div className="h-full flex-grow-1">
      <div className="flex h-full gap-8 overflow-x-auto pb-4">
        <DndContext onDragEnd={handleDragEnd}>
          {orderedColumns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              taskIds={column.taskIds}
              tasks={kanbanState.tasks}
              creatingInColumn={creatingInColumn}
              isSubmitting={isSubmitting}
              onCreateTask={handleCreateTask}
              onCancelCreateTask={handleCancelCreateTask}
              onSaveTask={handleSaveTask}
              onArchiveTask={handleArchiveTask}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
