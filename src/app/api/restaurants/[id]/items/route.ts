import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";

// Do not cache this route.
export const revalidate = false;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: extract this fetch call into its own function
  const list = await fetch("https://d1gvlspmcma3iu.cloudfront.net/restaurants-3d-party.json.gz");

  type Restaurant = { name: string, id: string };

  const restaurants = await list.json() as Restaurant[];

  const restaurant = restaurants.find(val => val.id === params.id);

  if (!restaurant) {
    const msg = { message: "Invalid restaurant id", status: 404 };
    return NextResponse.json(msg, { status: msg.status });
  }

  const url = new URL("/v2/search/instant", "https://trackapi.nutritionix.com");

  const searchParams = req.nextUrl.searchParams;
  searchParams.set("query", restaurant.name);
  searchParams.set("self", String(false));      // don't include user's food log
  searchParams.set("common", String(false));    // don't include common food items
  searchParams.set("branded", String(true));    // included branded food items
  searchParams.set("branded_type", String(1));  // 1 = restaurant
  searchParams.set("branded_region", String(1)) // 1 = US

  const res = await fetch(`${url.href}?${searchParams.toString()}`, {
    headers: {
      "x-app-id": env.NUTRITIONIX_APP_ID,
      "x-app-key": env.NUTRITIONIX_APP_KEY,
    },
  });

  const data = await res.json() as { branded: any[] };

  // Only return the list of branded food items
  return NextResponse.json(data.branded, {
    status: res.status,
  });
}

