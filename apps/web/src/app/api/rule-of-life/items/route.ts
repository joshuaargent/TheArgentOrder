import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/rule-of-life/items - Add rule item
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { rule_id, category_id, title, description, frequency, target } = body;

  if (!title || !category_id) {
    return NextResponse.json(
      { error: "title and category_id are required" },
      { status: 400 }
    );
  }

  // Get user's active rule
  const { data: rule } = await supabase
    .from("rules_of_life")
    .select("id")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  const ruleId = rule?.id || rule_id;

  const { data: item, error } = await supabase
    .from("rule_items")
    .insert({
      rule_id: ruleId,
      category_id,
      title,
      description,
      frequency,
      target,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(item, { status: 201 });
}
