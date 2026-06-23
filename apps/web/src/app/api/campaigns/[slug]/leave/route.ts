import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/campaigns/[slug]/leave - Leave a campaign
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
    .select("id")
    .eq("slug", slug)
    .single();

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  // Update enrollment status
  const { error } = await supabase
    .from("campaign_enrollments")
    .update({ status: "abandoned" })
    .eq("user_id", user.id)
    .eq("campaign_id", campaign.id)
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
