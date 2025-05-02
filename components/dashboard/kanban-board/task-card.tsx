import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, GripVertical } from 'lucide-react';
import { getPriorityColor } from './utils';
import { Task } from '@/types/task';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useCallback } from 'react';

interface TaskCardProps {
  task: Task;
  onArchive: (taskId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function TaskCard({ task, onArchive }: TaskCardProps) {
  const { setNodeRef, attributes, listeners, transform } = useDraggable({
    id: task.id,
    data: {
      columnId: task.columnId,
    },
  });

  const style = transform
    ? {
        transform: CSS.Transform.toString({
          ...transform,
          scaleY: 1,
          scaleX: 1,
        }),
        zIndex: 100,
      }
    : undefined;

  const handleArchive = useCallback(() => {
    onArchive(task.id);
  }, [onArchive, task.id]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-0 shadow-md group relative"
    >
      <div className="flex items-start">
        <div {...attributes} {...listeners} className="p-3 cursor-move">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {task.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Archive task"
                className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                onClick={handleArchive}
              >
                <Archive className="h-4 w-4" />
              </Button>
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
        </div>
      </div>
    </Card>
  );
}
