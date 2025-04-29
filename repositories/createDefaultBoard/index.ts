import { createClient } from '@/utils/supabase/client';

export const createDefaultBoard = async () => {
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('User not authenticated');

  // Create the default board
  const { data: board, error: boardError } = await supabase
    .from('boards')
    .insert({
      title: 'My First Board',
      user_id: user.id,
    })
    .select()
    .single();

  if (boardError) throw boardError;

  // Create default columns
  const defaultColumns = [
    { title: 'To Do', color: 'bg-blue-500', sort_order: 0 },
    { title: 'In Progress', color: 'bg-amber-500', sort_order: 1 },
    { title: 'Done', color: 'bg-green-500', sort_order: 2 },
  ];

  const { error: columnsError } = await supabase.from('columns').insert(
    defaultColumns.map((col) => ({
      board_id: board.id,
      title: col.title,
      color: col.color,
      sort_order: col.sort_order,
    }))
  );

  if (columnsError) throw columnsError;

  return board;
};
