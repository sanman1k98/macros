import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { env } from "@/env.mjs";

// Do not cache this route.
export const revalidate = false;

export async function GET() {
  const supabase = createRouteHandlerSupabaseClient({
    headers,
    cookies,
  });

  const openai = new OpenAIApi(
    new Configuration({
      organization: env.OPENAI_ORGANIZATION_ID,
      apiKey: env.OPENAI_API_KEY,
    })
  );

  // Gets session information from the "supabase-auth-token" cookie
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (!session || authError) return NextResponse.json(authError, {
    status: 500,
  });

  const { data: profile, error: pgError, status, statusText } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (!profile) return NextResponse.json(pgError, {
    status: status,
    statusText: statusText,
  });

  try {
    // FIXME: HTTP status code 429; see openai/openai-node#168
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Hey! My name is ${profile.full_name}, can you recommend me some healthy food?`,
    });

    return NextResponse.json(completion, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: error.response.status || 500,
    });
  }
}
