import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, form, selectedAreas, selectedCategories, tradeBodies, logoUrl } = body;

  const { error: updateError } = await supabaseAdmin.from("tradespeople").update({
    business_name: form.business_name,
    contact_name: form.contact_name,
    phone: form.phone,
    mobile: form.mobile,
    email: form.email,
    website: form.website,
    town: form.town,
    description: form.description,
    membership_tier: form.membership_tier,
    billing_cycle: form.billing_cycle,
    approved: form.approved,
    is_featured: form.is_featured,
    logo_url: logoUrl,
    whatsapp_url: form.whatsapp_url,
    instagram_url: form.instagram_url,
    facebook_url: form.facebook_url,
    twitter_url: form.twitter_url,
    linkedin_url: form.linkedin_url,
    tiktok_url: form.tiktok_url,
    trade_bodies: tradeBodies,
  }).eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  await supabaseAdmin.from("tradesperson_areas").delete().eq("tradesperson_id", id);
  if (selectedAreas.length > 0) {
    await supabaseAdmin.from("tradesperson_areas").insert(
      selectedAreas.map((area_id: number) => ({ tradesperson_id: id, area_id }))
    );
  }

  await supabaseAdmin.from("tradesperson_categories").delete().eq("tradesperson_id", id);
  if (selectedCategories.length > 0) {
    await supabaseAdmin.from("tradesperson_categories").insert(
      selectedCategories.map((category_id: number) => ({ tradesperson_id: id, category_id }))
    );
  }

  return NextResponse.json({ success: true });
}
