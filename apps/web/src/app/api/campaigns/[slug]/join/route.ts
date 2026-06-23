import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/campaigns/[slug]/join - Join a campaign
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  // Find campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("campaign_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("campaign_id", campaign.id)
    .eq("status", "active")
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Already enrolled in this campaign" },
      { status: 400 }
    );
  }

  // Create enrollment
  const { data: enrollment, error } = await supabase
    .from("campaign_enrollments")
    .insert({
      user_id: user.id,
      campaign_id: campaign.id,
      status: "active",
      started_at: new Date().toISOString(),
      completion_percent: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award formation points for joining
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "discipline",
    points: 25,
    reason: `Joined campaign: ${campaign.title}`,
    metadata: { campaign_id: campaign.id, action: "join" },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
