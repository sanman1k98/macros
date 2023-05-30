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

  if (authError) {
    return NextResponse.json(authError.message, { status: authError.status });
  } else if (!session) {
    return NextResponse.json("User is not authenticated", { status: 401, });
  }

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
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Hey! My name is ${profile.full_name}, can you recommend me some healthy food?`,
      max_tokens: 100,
      temperature: 0.7,
    });

    return NextResponse.json(completion.data, {
      status: status,
      statusText: completion.statusText,
    });
  } catch (error: any) {
    return NextResponse.json(error, {
      status: (error.response as Response).status,
      statusText: "OpenAI responded with error",
    });
  }
}
