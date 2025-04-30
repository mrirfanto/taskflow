import { Button } from '@/components/ui/button';
import { PlusIcon, ClipboardListIcon } from 'lucide-react';
import { Task } from '@/types/task';
import TaskCard from './task-card';
import CreateTask from './create-task';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  tasks: { [key: string]: Task };
  creatingInColumn: string | null;
  isSubmitting: boolean;
  onCreateTask: (columnId: string) => void;
  onCancelCreateTask: () => void;
  onSaveTask: (
    taskData: Omit<Task, 'id' | 'columnId' | 'order' | 'archived_at'>
  ) => void;
  onArchiveTask: (taskId: string) => void;
}

export default function Column({
  id,
  title,
  color,
  taskIds,
  tasks,
  creatingInColumn,
  isSubmitting,
  onCreateTask,
  onCancelCreateTask,
  onSaveTask,
  onArchiveTask,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const columnTasks = taskIds.map((taskId) => tasks[taskId]);

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 flex-grow-1 bg-muted p-4 rounded-md w-[280px]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex items-center gap-3 ${color} px-4 py-2 rounded-sm w-full`}
        >
          <div className="flex items-center gap-2 flex-grow-1">
            <h3 className="font-semibold text-sm text-white">{title}</h3>
            <span className="text-xs text-white rounded-sm font-medium bg-muted-foreground/20 px-2">
              {taskIds.length}
            </span>
          </div>
          <Button
            title="Create task in header"
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20 hover:text-white hover:py-0 font-semibold text-lg rounded-md p-1 cursor-pointer"
            onClick={() => onCreateTask(id)}
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {creatingInColumn === id && (
          <CreateTask
            onCancel={onCancelCreateTask}
            onSave={onSaveTask}
            isSubmitting={isSubmitting}
          />
        )}
        {columnTasks.length > 0 ? (
          columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} onArchive={onArchiveTask} />
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
              Add a task to <span className="font-medium">{title}</span> and get
              started
            </p>
            <Button
              title="Create task inside column"
              variant="outline"
              size="sm"
              className="mt-3 text-xs px-2 py-0 h-7 bg-background border border-muted-foreground/30 hover:bg-muted/50"
              onClick={() => onCreateTask(id)}
            >
              <PlusIcon className="w-3 h-3 mr-1" /> Create task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
