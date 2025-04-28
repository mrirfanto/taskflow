'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save } from 'lucide-react';
import { Priority, Task } from '../types';

interface CreateTaskProps {
  onCancel: () => void;
  onSave: (task: Omit<Task, 'id' | 'columnId' | 'order'>) => void;
}

export default function CreateTask({ onCancel, onSave }: CreateTaskProps) {
  // SUPABASE: Form state will need validation before saving to database
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  // Use a simple date input for now
  // SUPABASE: Consider timezone handling for dates when storing in the database
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const handleSave = () => {
    if (!title.trim()) return;

    // SUPABASE: This would trigger a database insert or RPC call
    // Consider adding loading state while the database operation completes
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
          />

          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-1/2 px-3 py-1 rounded border border-input bg-background"
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
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!title.trim()}
              // SUPABASE: Consider adding a loading state to prevent multiple submissions
            >
              <Save className="mr-1 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
