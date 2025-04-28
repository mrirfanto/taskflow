-- Seed data for TaskFlow application
-- This script populates the database with initial data for testing and development

-- First, let's create a default board for each user
-- Note: This assumes users already exist in auth.users table
-- You may need to adjust the user_id values based on your actual users

-- Insert a default board for the first user (replace with actual user ID)
INSERT INTO boards (id, title, user_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'My Task Board', 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f')
ON CONFLICT (id) DO NOTHING;

-- Insert columns for the default board
INSERT INTO columns (id, board_id, title, sort_order, color)
VALUES 
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Next Up', 0, 'bg-amber-500'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'In Progress', 1, 'bg-purple-500'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Review', 2, 'bg-cyan-500'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Completed', 3, 'bg-green-500')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks for each column
-- Next Up tasks
INSERT INTO tasks (id, column_id, title, description, priority, due_date, sort_order, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Create user profile page', 'Design and implement a user profile page with avatar upload', 'high', NOW() + INTERVAL '7 days', 0, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'Implement dark mode', 'Add dark mode support to the application', 'medium', NOW() + INTERVAL '14 days', 1, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f')
ON CONFLICT (id) DO NOTHING;

-- In Progress tasks
INSERT INTO tasks (id, column_id, title, description, priority, due_date, sort_order, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 'Fix login page bug', 'Users are unable to login with Google authentication', 'high', NOW() + INTERVAL '3 days', 0, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 'Optimize database queries', 'Improve performance of task loading', 'medium', NOW() + INTERVAL '10 days', 1, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000102', 'Add task filtering', 'Implement filtering by priority and due date', 'low', NOW() + INTERVAL '21 days', 2, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f')
ON CONFLICT (id) DO NOTHING;

-- Review tasks
INSERT INTO tasks (id, column_id, title, description, priority, due_date, sort_order, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000103', 'Code review: Task creation', 'Review the implementation of task creation functionality', 'medium', NOW() + INTERVAL '2 days', 0, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f')
ON CONFLICT (id) DO NOTHING;

-- Completed tasks
INSERT INTO tasks (id, column_id, title, description, priority, due_date, sort_order, created_by)
VALUES 
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000104', 'Project setup', 'Initialize project with Next.js and Supabase', 'high', NOW() - INTERVAL '7 days', 0, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f'),
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000104', 'Authentication implementation', 'Implement user authentication with Supabase', 'high', NOW() - INTERVAL '5 days', 1, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f'),
  ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000104', 'Kanban board UI', 'Create the UI for the Kanban board', 'medium', NOW() - INTERVAL '3 days', 2, 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f')
ON CONFLICT (id) DO NOTHING;

-- Note: The user ID 'b160dbd6-227f-4d0b-a1eb-dad5159e0c4f' has been used for all user references 