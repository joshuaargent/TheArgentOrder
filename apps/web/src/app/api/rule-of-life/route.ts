import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/rule-of-life - Get user's rule of life
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's rule of life
  const { data: rule } = await supabase
    .from("rules_of_life")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (!rule) {
    return NextResponse.json({ rule: null, categories: [], items: [] });
  }

  // Get categories with items
  const { data: categories } = await supabase
    .from("rule_categories")
    .select(`
      *,
      rule_items (*)
    `)
    .order("sort_order");

  // Get user's logs for today
  const today = new Date().toISOString().split("T")[0];
  const { data: todayLogs } = await supabase
    .from("rule_logs")
    .select("rule_item_id, completed")
    .eq("user_id", user.id)
    .gte("logged_at", today)
    .lt("logged_at", new Date(Date.now() + 86400000).toISOString().split("T")[0]);

  const completedItemIds = new Set(todayLogs?.map((l) => l.rule_item_id) || []);

  // Merge logs with items
  const categoriesWithStatus = categories?.map((cat) => ({
    ...cat,
    items: cat.rule_items?.map((item: any) => ({
      ...item,
      completed_today: completedItemIds.has(item.id),
    })),
  }));

  return NextResponse.json({
    rule,
    categories: categoriesWithStatus || [],
  });
}

// POST /api/rule-of-life - Create or update rule of life
export async function POST(_request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await _request.json();
  const { name, description } = body;

  // Check if user already has an active rule
  const { data: existingRule } = await supabase
    .from("rules_of_life")
    .select("id, version")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (existingRule) {
    // Deactivate old rule
    await supabase
      .from("rules_of_life")
      .update({ active: false })
      .eq("id", existingRule.id);
  }

  // Create new rule
  const { data: rule, error } = await supabase
    .from("rules_of_life")
    .insert({
      user_id: user.id,
      name: name || "My Rule of Life",
      description: description,
      version: ((existingRule as { id: string; version: number } | null)?.version || 0) + 1,
      active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(rule, { status: 201 });
}
