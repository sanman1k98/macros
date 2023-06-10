import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Configuration, OpenAIApi } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import createPrompt from "./prompt";
import { env } from "@/env.mjs";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
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
        status: completion.status,
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
