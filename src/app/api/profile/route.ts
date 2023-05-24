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

  // Gets session information from the "supabase-auth-token" cookie
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (!session || authError) return NextResponse.json(authError, {
    status: 500,
  });

  const { data: profiles, status, statusText } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return NextResponse.json(profiles, {
    status: status,
    statusText: statusText,
  });
}
