import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import { getPriorityColor } from './utils';
import { Task } from '@/types/task';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-0 shadow-md group"
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Archive task"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  onClick={() => onArchive(task.id)}
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
  );
}
