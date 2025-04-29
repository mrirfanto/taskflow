'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPriorityColor } from './utils';
import { Button } from '@/components/ui/button';
import { PlusIcon, ClipboardListIcon, Archive } from 'lucide-react';
import CreateTask from './create-task';
import { Skeleton } from '@/components/ui/skeleton';
import useTasks from '@/hooks/useTasks';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function KanbanBoard() {
  const { data: kanbanState, isLoading, createTask, archiveTask } = useTasks();
  const [creatingInColumn, setCreatingInColumn] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
      // Find the highest order value and add 1000 to ensure it's at the top
      // This leaves room for potential reordering in the future
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
        {orderedColumns.map((column) => {
          const columnTaskIds = column.taskIds;
          const columnTasks = columnTaskIds.map(
            (taskId: string) => kanbanState.tasks[taskId]
          );

          return (
            <div
              key={column.id}
              className="flex-shrink-0 flex-grow-1 bg-muted p-4 rounded-md w-[280px]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className={`flex items-center gap-3 ${column.color} px-4 py-2 rounded-sm w-full`}
                >
                  <div className="flex items-center gap-2 flex-grow-1">
                    <h3 className="font-semibold text-sm text-white">
                      {column.title}
                    </h3>
                    <span className="text-xs text-white rounded-sm font-medium bg-muted-foreground/20 px-2">
                      {columnTaskIds.length}
                    </span>
                  </div>
                  <Button
                    title="Create task in header"
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20 hover:text-white hover:py-0 font-semibold text-lg rounded-md p-1 cursor-pointer"
                    onClick={() => handleCreateTask(column.id)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {creatingInColumn === column.id && (
                  <CreateTask
                    onCancel={handleCancelCreateTask}
                    onSave={handleSaveTask}
                    isSubmitting={isSubmitting}
                  />
                )}
                {columnTasks.length > 0 ? (
                  columnTasks.map((task: Task) => (
                    <Card key={task.id} className="p-0 shadow-md group">
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">
                            {task.title}
                          </CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Archive task"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                  onClick={() => handleArchiveTask(task.id)}
                                >
                                  <Archive className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Archive task</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-muted-foreground/20 rounded-md bg-background/50 hover:border-muted-foreground/30 hover:bg-background transition-colors">
                    <ClipboardListIcon
                      size={48}
                      className="text-muted-foreground/50 mb-3"
                    />
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      Ready to make progress?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add a task to{' '}
                      <span className="font-medium">{column.title}</span> and
                      get started
                    </p>
                    <Button
                      title="Create task inside column"
                      variant="outline"
                      size="sm"
                      className="mt-3 text-xs px-2 py-0 h-7 bg-background border border-muted-foreground/30 hover:bg-muted/50"
                      onClick={() => handleCreateTask(column.id)}
                    >
                      <PlusIcon className="w-3 h-3 mr-1" /> Create task
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
