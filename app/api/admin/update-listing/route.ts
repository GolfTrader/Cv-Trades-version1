import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (action === "delete") {
      await sb.from("tradesperson_categories").delete().eq("tradesperson_id", id);
      await sb.from("tradesperson_areas").delete().eq("tradesperson_id", id);
      await sb.from("reviews").delete().eq("tradesperson_id", id);
      const { error } = await sb.from("tradespeople").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (body.form && typeof body.form === "object") {
      const { form, selectedAreas, selectedCategories, tradeBodies, logoUrl } = body;
      const allow = ["business_name","description","main_phone","mobile_phone","email","website","logo_url","facebook_url","instagram_url","youtube_url","linkedin_url","whatsapp_url","is_featured","slug","approved","membership_tier","billing_cycle","twitter_url","tiktok_url","contact_name","town"];
      const u: Record<string, any> = {};
      for (const k of allow) { if (k in form) u[k] = form[k]; }
      if ("phone" in form && !("main_phone" in form)) u.main_phone = form.phone;
      if ("mobile" in form && !("mobile_phone" in form)) u.mobile_phone = form.mobile;
      if (tradeBodies !== undefined) u.trade_bodies = tradeBodies;
      if (logoUrl) u.logo_url = logoUrl;
      const { error } = await sb.from("tradespeople").update(u).eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (selectedCategories !== undefined) {
        await sb.from("tradesperson_categories").delete().eq("tradesperson_id", id);
        if (selectedCategories.length > 0) await sb.from("tradesperson_categories").insert(selectedCategories.map((c: number) => ({ tradesperson_id: id, category_id: c })));
      }
      if (selectedAreas !== undefined) {
        await sb.from("tradesperson_areas").delete().eq("tradesperson_id", id);
        if (selectedAreas.length > 0) await sb.from("tradesperson_areas").insert(selectedAreas.map((a: number) => ({ tradesperson_id: id, area_id: a })));
      }
      return NextResponse.json({ success: true });
    }

    if (body.updates && typeof body.updates === "object") {
      const { error } = await sb.from("tradespeople").update(body.updates).eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No data" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
