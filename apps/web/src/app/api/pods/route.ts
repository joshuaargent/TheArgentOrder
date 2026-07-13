import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/pods - Get user's pod
export async function GET(_request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's pod membership (only active)
  const { data: membership } = await supabase
    .from("pod_members")
    .select("id, pod_id, pod_role, joined_at, pods(*)")
    .eq("user_id", user.id)
    .is("left_at", null)
    .single();

  if (!membership) {
    return NextResponse.json({ pod: null, members: [], meetings: [] });
  }

  const podId = membership.pod_id;

  // Get active pod members with profiles
  const { data: members } = await supabase
    .from("pod_members")
    .select(`
      id,
      user_id,
      pod_role,
      joined_at,
      profiles(display_name, avatar_url)
    `)
    .eq("pod_id", podId)
    .is("left_at", null);

  // Get upcoming meetings
  const { data: meetings } = await supabase
    .from("pod_meetings")
    .select("*")
    .eq("pod_id", podId)
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(5);

  return NextResponse.json({
    pod: membership.pods,
    membership: { 
      id: membership.id,
      role: membership.pod_role,
      joined_at: membership.joined_at 
    },
    members: members || [],
    meetings: meetings || [],
  });
}

// POST /api/pods - Create pod, join, or leave
export async function POST(_request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await _request.json();
  const { action, pod_id, name, description, reason } = body;

  if (action === "create") {
    // Create new pod
    const { data: pod, error } = await supabase
      .from("pods")
      .insert({
        name,
        description,
        captain_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add creator as member and captain
    await supabase.from("pod_members").insert({
      pod_id: pod.id,
      user_id: user.id,
      pod_role: "captain",
    });

    return NextResponse.json(pod, { status: 201 });
  }

  if (action === "join") {
    // Join existing pod
    if (!pod_id) {
      return NextResponse.json({ error: "pod_id is required" }, { status: 400 });
    }

    // Check if already in a pod
    const { data: existing } = await supabase
      .from("pod_members")
      .select("id")
      .eq("user_id", user.id)
      .is("left_at", null)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already in a pod" }, { status: 400 });
    }

    // Check pod has capacity
    const { count: memberCount } = await supabase
      .from("pod_members")
      .select("*", { count: "exact", head: true })
      .eq("pod_id", pod_id)
      .is("left_at", null);

    if ((memberCount || 0) >= 10) {
      return NextResponse.json({ error: "Pod is full" }, { status: 400 });
    }

    const { error } = await supabase.from("pod_members").insert({
      pod_id,
      user_id: user.id,
      pod_role: "member",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  }

  if (action === "leave") {
    // Leave current pod
    if (!pod_id) {
      return NextResponse.json({ error: "pod_id is required" }, { status: 400 });
    }

    // Check if user is in this pod
    const { data: membership } = await supabase
      .from("pod_members")
      .select("id, pod_role")
      .eq("user_id", user.id)
      .eq("pod_id", pod_id)
      .is("left_at", null)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this pod" }, { status: 400 });
    }

    // Call the graceful departure function
    const { error } = await supabase.rpc("handle_member_graceful_departure", {
      p_user_id: user.id,
      p_pod_id: pod_id,
      p_departure_type: "voluntary",
      p_reason: reason || "User chose to leave",
    });

    if (error) {
      console.error("Failed to leave pod:", error);
      return NextResponse.json({ error: "Failed to leave pod" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Left pod successfully" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
