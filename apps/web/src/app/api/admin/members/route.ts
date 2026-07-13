import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/admin/members - Get all members with admin details
export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const search = searchParams.get("search");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin status
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use RPC function
  const { data: members, error } = await supabase.rpc("get_all_members", {
    p_limit: limit,
    p_offset: offset,
    p_search: search,
  });

  if (error) {
    console.error("Failed to get members:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members: members || [] });
}

// GET /api/admin/members/[id] - Get member details
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, user_id, rank_id } = body;

  // Check admin status
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (action === "update_rank") {
    const { error } = await supabase.rpc("admin_update_member_rank", {
      p_user_id: user_id,
      p_rank_id: rank_id,
      p_admin_id: user.id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === "get_details") {
    const { data: details, error } = await supabase.rpc("get_member_details", {
      p_user_id: user_id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ details });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
