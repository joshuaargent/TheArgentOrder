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

  // Get user's pod membership
  const { data: membership } = await supabase
    .from("pod_members")
    .select("pod_id, joined_at, pods(*)")
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ pod: null, members: [], meetings: [] });
  }

  const podId = membership.pod_id;

  // Get pod members
  const { data: members } = await supabase
    .from("pod_members")
    .select(`
      user_id,
      joined_at,
      profiles(display_name, avatar_url, email)
    `)
    .eq("pod_id", podId);

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
    membership: { joined_at: membership.joined_at },
    members: members || [],
    meetings: meetings || [],
  });
}

// POST /api/pods - Create pod (captains only) or request to join
export async function POST(_request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await _request.json();
  const { action, pod_id, name, description } = body;

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
    });

    return NextResponse.json(pod, { status: 201 });
  }

  if (action === "join") {
    // Join existing pod
    if (!pod_id) {
      return NextResponse.json({ error: "pod_id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("pod_members").insert({
      pod_id,
      user_id: user.id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
