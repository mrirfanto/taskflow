-- Create enum for task priority
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Add any additional board settings here
    settings JSONB DEFAULT '{}'::jsonb
);

-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Add any additional column settings here
    settings JSONB DEFAULT '{}'::jsonb
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority task_priority NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    -- Add any additional task metadata here
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON columns(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_boards_updated_at
    BEFORE UPDATE ON boards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_columns_updated_at
    BEFORE UPDATE ON columns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own boards"
    ON boards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own boards"
    ON boards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards"
    ON boards FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards"
    ON boards FOR DELETE
    USING (auth.uid() = user_id);

-- Similar policies for columns and tasks
CREATE POLICY "Users can view columns of their boards"
    ON columns FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM boards
        WHERE boards.id = columns.board_id
        AND boards.user_id = auth.uid()
    ));

CREATE POLICY "Users can manage columns of their boards"
    ON columns FOR ALL
    USING (EXISTS (
        SELECT 1 FROM boards
        WHERE boards.id = columns.board_id
        AND boards.user_id = auth.uid()
    ));

CREATE POLICY "Users can view tasks in their boards"
    ON tasks FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM columns
        JOIN boards ON boards.id = columns.board_id
        WHERE columns.id = tasks.column_id
        AND boards.user_id = auth.uid()
    ));

CREATE POLICY "Users can manage tasks in their boards"
    ON tasks FOR ALL
    USING (EXISTS (
        SELECT 1 FROM columns
        JOIN boards ON boards.id = columns.board_id
        WHERE columns.id = tasks.column_id
        AND boards.user_id = auth.uid()
    ));

-- Comments for future consideration:
-- 1. Consider adding a tasks_history table for audit trails
-- 2. Consider adding a comments table for tasks
-- 3. Consider adding a tags/labels system for tasks
-- 4. Consider adding a notifications system for task assignments and due dates
-- 5. Consider adding a task dependencies system
-- 6. Consider adding a task templates system
-- 7. Consider adding a task attachments system
-- 8. Consider adding a task checklist system
-- 9. Consider adding a task time tracking system
-- 10. Consider adding a task recurring schedule system 