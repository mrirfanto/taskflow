import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Get column_ids from query params
    const { searchParams } = new URL(request.url);
    const columnIds = searchParams.get('columnIds');
    
    if (!columnIds) {
      return NextResponse.json(
        { error: 'Column IDs are required' },
        { status: 400 }
      );
    }

    const columnIdsArray = columnIds.split(',');

    // Fetch tasks data
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .is('archived_at', null)
      .in('column_id', columnIdsArray)
      .order('sort_order', { ascending: false });

    if (tasksError) throw tasksError;

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tasks: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Parse request body
    const body = await request.json();
    const { title, priority, dueDate, columnId, order } = body;

    // Validate required fields
    if (!title || !priority || !columnId || order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the task
    const { data: task, error: createError } = await supabase
      .from('tasks')
      .insert({
        title,
        priority,
        due_date: dueDate,
        column_id: columnId,
        sort_order: order,
        created_by: user.id,
      })
      .select()
      .single();

    if (createError) throw createError;

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create task: ${JSON.stringify(error)}` },
      { status: 500 }
    );
  }
}