import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Configuration, OpenAIApi } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import createPrompt from "./prompt";
import { env } from "@/env.mjs";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerSupabaseClient({
    headers,
    cookies,
  });

  // TODO: extract this fetch call into its own function
  const res = await fetch(
    "https://d1gvlspmcma3iu.cloudfront.net/restaurants-3d-party.json.gz"
  );

  type Restaurant = { name: string; id: string };

  const data = (await res.json()) as Restaurant[];

  const restaurant = data.find((val) => val.id === params.id);

  if (!restaurant) return NextResponse.json({ message: "Restaurant not found" });

  // TODO: extract the OpenAI client into its own module
  const openai = new OpenAIApi(
    new Configuration({
      organization: env.OPENAI_ORGANIZATION_ID,
      apiKey: env.OPENAI_API_KEY,
    })
  );

  // Gets session information from the "supabase-auth-token" cookie
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError) {
    return NextResponse.json(authError.message, { status: authError.status });
  } else if (!session) {
    return NextResponse.json("User is not authenticated", { status: 401 });
  }

  const {
    data: profile,
    error: pgError,
    status,
    statusText,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (pgError) {
    return NextResponse.json(pgError, {
      status: status,
      statusText: statusText,
    });
  } else if (!profile) {
    return NextResponse.json(
      { message: "Profile for authenticated user not found" },
      {
        status: 400,
      }
    );
  }

  try {
    const menu = await fetch(
      `${env.NEXT_PUBLIC_SITE_ORIGIN}/api/restaurants/${params.id}/items`,
      {
        cache: "force-cache",
      }
    );

    const items = await menu.json();

    const prompt = createPrompt(restaurant.name, items);

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    return NextResponse.json(
      {
        prompt: prompt,
        completion: completion.data,
        items: items,
      },
      {
        status: status,
        statusText: completion.statusText,
      }
    );
  } catch (error: any) {
    return NextResponse.json(error, {
      status: (error.response as Response).status,
      statusText: "OpenAI responded with error",
    });
  }
}
