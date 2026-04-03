import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// GET — public read (used by search, listings)
export async function GET() {
  const { data, error } = await supabase
    .from("tradespeople")
    .select(`
      *,
      tradesperson_areas(areas(name)),
      tradesperson_categories(categories(name)),
      reviews(rating)
    `)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST — new tradesperson signup (uses service role to bypass RLS)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const business_name = formData.get("business_name") as string;
    const email = formData.get("email") as string;
    const main_phone = formData.get("main_phone") as string;
    const mobile_phone = (formData.get("mobile_phone") as string) || null;
    const website = (formData.get("website") as string) || null;
    const description = (formData.get("description") as string) || null;
    const membership_tier = (formData.get("membership_tier") as string) || "free";
    const billing_cycle = (formData.get("billing_cycle") as string) || "monthly";
    const facebook_url = (formData.get("facebook_url") as string) || null;
    const instagram_url = (formData.get("instagram_url") as string) || null;
    const youtube_url = (formData.get("youtube_url") as string) || null;
    const linkedin_url = (formData.get("linkedin_url") as string) || null;
    const whatsapp_url = (formData.get("whatsapp_url") as string) || null;

    const areasRaw = formData.get("areas") as string;
    const categoriesRaw = formData.get("categories") as string;
    const tradeBodiesRaw = formData.get("trade_bodies") as string;
    const logoFile = formData.get("logo") as File | null;

    // Validate required fields
    if (!business_name || !email || !main_phone) {
      return NextResponse.json(
        { error: "Business name, email, and main phone are required." },
        { status: 400 }
      );
    }

    // Parse arrays
    let areaIds: number[] = [];
    let categoryIds: number[] = [];
    let tradeBodies: string[] = [];

    try {
      if (areasRaw) areaIds = JSON.parse(areasRaw);
      if (categoriesRaw) categoryIds = JSON.parse(categoriesRaw);
      if (tradeBodiesRaw) tradeBodies = JSON.parse(tradeBodiesRaw);
    } catch {
      return NextResponse.json(
        { error: "Invalid data format for areas, categories, or trade bodies." },
        { status: 400 }
      );
    }

    // Generate slug from business name
    const slug = business_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check slug uniqueness
    const { data: existingSlug } = await supabaseAdmin
      .from("tradespeople")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    const finalSlug = existingSlug
      ? `${slug}-${Date.now()}`
      : slug;

    // Upload logo if provided
    let logo_url: string | null = null;
    if (logoFile && logoFile.size > 0) {
      const fileExt = logoFile.name.split(".").pop() || "png";
      const fileName = `${finalSlug}-${Date.now()}.${fileExt}`;
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from("logos")
        .upload(fileName, buffer, {
          contentType: logoFile.type,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrl } = supabaseAdmin.storage
          .from("logos")
          .getPublicUrl(fileName);
        logo_url = publicUrl.publicUrl;
      } else {
        console.error("Logo upload error:", uploadError);
      }
    }

    // Insert tradesperson using admin client (bypasses RLS)
    const { data: tradesperson, error: insertError } = await supabaseAdmin
      .from("tradespeople")
      .insert({
        business_name,
        slug: finalSlug,
        email,
        phone: main_phone,
        mobile_phone,
        website,
        description,
        membership_tier,
        billing_cycle,
        logo_url,
        trade_bodies: tradeBodies.length > 0 ? tradeBodies : null,
        facebook_url,
        instagram_url,
        youtube_url,
        linkedin_url,
        whatsapp_url,
        approved: false,
        is_featured: membership_tier === "featured",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    const tradespersonId = tradesperson.id;

    // Link areas
    if (areaIds.length > 0) {
      const areaRows = areaIds.map((area_id) => ({
        tradesperson_id: tradespersonId,
        area_id,
      }));
      const { error: areasError } = await supabaseAdmin
        .from("tradesperson_areas")
        .insert(areaRows);
      if (areasError) console.error("Areas link error:", areasError);
    }

    // Link categories
    if (categoryIds.length > 0) {
      const catRows = categoryIds.map((category_id) => ({
        tradesperson_id: tradespersonId,
        category_id,
      }));
      const { error: catsError } = await supabaseAdmin
        .from("tradesperson_categories")
        .insert(catRows);
      if (catsError) console.error("Categories link error:", catsError);
    }

    return NextResponse.json(
      { success: true, id: tradespersonId, slug: finalSlug },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Signup API error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
