'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save, Loader2 } from 'lucide-react';
import { Priority, Task } from '@/types/task';

interface CreateTaskProps {
  onCancel: () => void;
  onSave: (
    task: Omit<Task, 'id' | 'columnId' | 'order' | 'archived_at'>
  ) => void;
  isSubmitting?: boolean;
}

export default function CreateTask({
  onCancel,
  onSave,
  isSubmitting = false,
}: CreateTaskProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const handleSave = () => {
    if (!title.trim() || isSubmitting) return;

    onSave({
      title: title.trim(),
      priority,
      dueDate: new Date(dueDate).toISOString(),
    });
  };

  return (
    <Card className="mb-3 shadow-md">
      <CardContent className="p-3">
        <div className="space-y-2">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            autoFocus
            disabled={isSubmitting}
          />

          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-1/2 px-3 py-1 rounded border border-input bg-background"
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-1/2"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-1 h-4 w-4" /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
