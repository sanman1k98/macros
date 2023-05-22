import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

// Do not cache this route.
export const revalidate = false;

export async function GET() {
  const supabase = createRouteHandlerSupabaseClient({
    headers,
    cookies,
  });

  // FIXME: AuthApiError; see supabase/supabase-js#641
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) return NextResponse.json(authError, {
    status: 500,
  });

  const {
    data: profiles,
    status,
    statusText,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id);

  return NextResponse.json(profiles, {
    status: status,
    statusText: statusText,
  });
}
