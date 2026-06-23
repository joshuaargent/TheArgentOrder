import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/journal - List journal entries
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(entries || []);
}

// POST /api/journal - Create journal entry
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, visibility, tags } = body;

  if (!title && !content) {
    return NextResponse.json(
      { error: "Title or content is required" },
      { status: 400 }
    );
  }

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      title: title || "Untitled",
      content,
      visibility: visibility || "private",
      tags: tags || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(entry, { status: 201 });
}
