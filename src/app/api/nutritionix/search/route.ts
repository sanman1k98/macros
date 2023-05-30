import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";

// Do not cache this route.
export const revalidate = false;

export async function GET(req: NextRequest) {
  const url = new URL("/v2/search/instant", "https://trackapi.nutritionix.com");

  // includes "?" followed by params
  const search = req.nextUrl.search;

  const res = await fetch(`${url.href}${search}`, {
    method: "GET",
    headers: {
      "x-app-id": env.NUTRITIONIX_APP_ID,
      "x-app-key": env.NUTRITIONIX_APP_KEY,
    },
  });

  const data = await res.json();

  return NextResponse.json(data);
}
