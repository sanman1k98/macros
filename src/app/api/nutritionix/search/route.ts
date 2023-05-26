import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { env } from "@/env.mjs";

// Do not cache this route.
export const revalidate = false;

// TODO: create test for this route
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient({
    headers,
    cookies,
  });

  // Gets session information from the "supabase-auth-token" cookie
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (!session || authError) return NextResponse.json(authError, {
    status: 500,
  });

  const url = new URL("/v2/search/instant", "https://trackapi.nutritionix.com");
  const search = req.nextUrl.search;
  return await fetch(url.toString().concat(search), {
    method: "GET",
    headers: {
      "x-app-id": `Bearer ${env}`,
      "x-app-key": `Bearer ${env}`
    },
  })
}
