import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/admin/pods - Get all pods with admin details
export async function GET() {
  const supabase = await createClient();

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

  // Get all pods
  const { data: pods, error } = await supabase.rpc("get_all_pods");

  if (error) {
    console.error("Failed to get pods:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get unassigned members
  const { data: unassigned } = await supabase.rpc("get_unassigned_members");

  // Get pod balance
  const { data: balance } = await supabase.rpc("get_pod_balance");

  return NextResponse.json({
    pods: pods || [],
    unassignedMembers: unassigned || [],
    podBalance: balance || [],
  });
}

// POST /api/admin/pods - Pod management actions
export async function POST(request: Request) {
  const supabase = await createClient();

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

  const body = await request.json();
  const { action, pod_id, target_user_id, source_pod_id, reason } = body;

  if (action === "dissolve") {
    const { error } = await supabase.rpc("admin_dissolve_pod", {
      p_pod_id: pod_id,
      p_admin_id: user.id,
      p_reason: reason || "Admin dissolved pod",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Pod dissolved" });
  }

  if (action === "merge") {
    const { error } = await supabase.rpc("admin_merge_pods", {
      p_source_pod_id: source_pod_id,
      p_target_pod_id: pod_id,
      p_admin_id: user.id,
      p_reason: reason || "Pods merged by admin",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Pods merged" });
  }

  if (action === "reassign") {
    const { error } = await supabase.rpc("admin_reassign_member", {
      p_user_id: target_user_id,
      p_from_pod_id: source_pod_id,
      p_to_pod_id: pod_id,
      p_admin_id: user.id,
      p_reason: reason || "Reassigned by admin",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Member reassigned" });
  }

  if (action === "auto_assign") {
    const { error } = await supabase.rpc("auto_assign_user_to_pod", {
      p_user_id: target_user_id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User auto-assigned to pod" });
  }

  if (action === "assign") {
    const { error } = await supabase.rpc("admin_assign_to_pod", {
      p_user_id: target_user_id,
      p_pod_id: pod_id,
      p_admin_id: user.id,
      p_role: "member",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User assigned to pod" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
