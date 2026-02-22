import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../lib/supabase/server';

// GET /api/projects — list all projects for the current user
export async function GET() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data });
}

// POST /api/projects — create a new project
export async function POST(req: Request) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const { data, error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            title: body.title || 'Untitled Project',
            script: body.script || '',
            slides: body.slides || [],
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project: data });
}

// PATCH /api/projects — update an existing project
export async function PATCH(req: Request) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.id) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('projects')
        .update({
            ...(body.title !== undefined && { title: body.title }),
            ...(body.script !== undefined && { script: body.script }),
            ...(body.slides !== undefined && { slides: body.slides }),
        })
        .eq('id', body.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project: data });
}
