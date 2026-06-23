import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/certifications - Get all certifications and user's progress
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all active certifications
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  let userCertifications: { certification_id: string; earned_at: string }[] = [];

  if (user) {
    // Get user's earned certifications
    const { data: earned } = await supabase
      .from("user_certifications")
      .select("certification_id, earned_at")
      .eq("user_id", user.id);

    userCertifications = earned || [];
  }

  // Organize by category with progress info
  const categories = ["builder", "discipline", "brotherhood", "faith", "leadership"];
  
  const organized = categories.map((cat) => {
    const catCerts = certifications?.filter((c) => c.category === cat) || [];
    
    return {
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      slug: cat,
      icon: catCerts[0]?.icon || "📜",
      color: catCerts[0]?.color || "#666666",
      certifications: catCerts.map((cert) => {
        const earned = userCertifications.find((e) => e.certification_id === cert.id);
        return {
          id: cert.id,
          slug: cert.slug,
          name: cert.name,
          description: cert.description,
          icon: cert.icon,
          color: cert.color,
          points_required: cert.points_required,
          earned: !!earned,
          earned_at: earned?.earned_at || null,
          requirements: cert.requirements,
        };
      }),
    };
  }).filter((cat) => cat.certifications.length > 0);

  const earnedCount = userCertifications.length;
  const totalCount = certifications?.length || 0;

  return NextResponse.json({
    categories: organized,
    totalEarned: earnedCount,
    totalAvailable: totalCount,
  });
}
