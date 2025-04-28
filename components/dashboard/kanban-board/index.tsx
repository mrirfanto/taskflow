'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KanbanState, Task } from './types';
import { getPriorityColor } from './utils';
import { initialKanbanState } from './config';
import { Button } from '@/components/ui/button';
import { PlusIcon, ClipboardListIcon } from 'lucide-react';
import CreateTask from './create-task';

export default function KanbanBoard() {
  // SUPABASE: Replace local state with data from Supabase
  // Consider using SWR or React Query for data fetching and caching
  const [kanbanState, setKanbanState] =
    useState<KanbanState>(initialKanbanState);
  const [creatingInColumn, setCreatingInColumn] = useState<string | null>(null);

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

  // SUPABASE: This function will need to insert data into Supabase and handle optimistic UI updates
  // Consider using upsert operations to handle both create and update scenarios
  const handleSaveTask = (
    columnId: string,
    taskData: Omit<Task, 'id' | 'columnId' | 'order'>
  ) => {
    const newTaskId = `task-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    // SUPABASE: Use UUID from Supabase instead of generating client-side IDs

    const column = kanbanState.columns[columnId];

    // Create new task with order -1 to ensure it appears at the top
    const newTask: Task = {
      id: newTaskId,
      columnId,
      order: -1,
      ...taskData,
    };

    // Get existing tasks in this column to adjust their order
    const existingColumnTasks = column.taskIds.map(
      (taskId) => kanbanState.tasks[taskId]
    );

    // Adjust order of existing tasks
    // SUPABASE: This will require a transaction or batch update to maintain consistency
    const updatedTasks = { ...kanbanState.tasks, [newTaskId]: newTask };
    existingColumnTasks.forEach((task) => {
      updatedTasks[task.id] = {
        ...task,
        order: task.order + 1,
      };
    });

    // Update state with normalization
    // SUPABASE: Local state update should happen after successful Supabase operation
    // Consider optimistic updates with error handling and rollback on failure
    setKanbanState({
      ...kanbanState,
      columns: {
        ...kanbanState.columns,
        [columnId]: {
          ...column,
          taskIds: [newTaskId, ...column.taskIds],
        },
      },
      tasks: updatedTasks,
    });

    setCreatingInColumn(null);
  };

  // SUPABASE: When fetching data, ensure columns are properly sorted
  // You may need to sort after querying if order isn't handled in the database query
  const orderedColumns = [...kanbanState.board.columnIds]
    .map((columnId) => kanbanState.columns[columnId])
    .sort((a, b) => a.order - b.order);

  // SUPABASE: Consider adding real-time subscription here for live updates
  // useEffect(() => {
  //   const subscription = supabase
  //     .channel('kanban-changes')
  //     .on('postgres_changes', { event: '*', schema: 'public' }, handleRealtimeUpdate)
  //     .subscribe();
  //
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);

  return (
    <div className="h-full flex-grow-1">
      <div className="flex h-full gap-8 overflow-x-auto pb-4">
        {orderedColumns.map((column) => {
          const columnTaskIds = column.taskIds;
          // SUPABASE: Task fetching and sorting might be done via query instead of client-side
          const columnTasks = columnTaskIds
            .map((taskId) => kanbanState.tasks[taskId])
            .sort((a, b) => a.order - b.order);

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
                    onSave={(taskData) => handleSaveTask(column.id, taskData)}
                  />
                )}
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    // SUPABASE: Add drag and drop functionality that updates positions in the database
                    <Card key={task.id} className="p-0 shadow-md">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-lg font-semibold">
                          {task.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex justify-between items-center">
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
      {/* SUPABASE: Consider adding error handling UI for database operations */}
    </div>
  );
}
