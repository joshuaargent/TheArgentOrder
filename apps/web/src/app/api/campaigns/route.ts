import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // Get all active campaigns
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("active", true)
    .order("start_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { campaignId } = body;

  if (!campaignId) {
    return NextResponse.json(
      { error: "campaignId is required" },
      { status: 400 }
    );
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("campaign_enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("campaign_id", campaignId)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Already enrolled in this campaign" },
      { status: 400 }
    );
  }

  // Create enrollment
  const { data, error } = await supabase
    .from("campaign_enrollments")
    .insert({
      user_id: user.id,
      campaign_id: campaignId,
      status: "active",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
