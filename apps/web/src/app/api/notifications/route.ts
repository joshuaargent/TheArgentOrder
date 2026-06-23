import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/notifications - Get user's notifications
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq("read", false);
  }

  const { data: notifications, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return NextResponse.json({
    notifications: notifications || [],
    unread_count: unreadCount,
  });
}

// POST /api/notifications - Mark notifications as read
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { notification_ids, mark_all_read } = body;

  if (mark_all_read) {
    // Mark all as read
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (notification_ids && notification_ids.length > 0) {
    // Mark specific notifications as read
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .in("id", notification_ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
