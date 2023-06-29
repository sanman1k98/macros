import { env } from "@/env.mjs";

type Restaurant = { name: string, id: string };

export const NUTRITIONIX_URL = "https://trackapi.nutritionix.com";

export const NUTRITIONIX_HEADERS = {
  "x-app-id": env.NUTRITIONIX_APP_ID,
  "x-app-key": env.NUTRITIONIX_APP_KEY,
};

export const restaurants = new Map<string, string>();

export async function init() {
  const res = await fetch(
    "https://d1gvlspmcma3iu.cloudfront.net/restaurants-3d-party.json.gz"
  );

  const data = await res.json() as Restaurant[];

  for (const restaurant of data) restaurants.set(restaurant.id, restaurant.name);

  return restaurants
}

export function getRestaurantName(id: string) {
  return restaurants.get(id);
} 

/**
 * Gets the food menu items for a restaurant given its ID
 */
export async function getRestaurantItems(id: string) {
  const name = restaurants.get(id);

  if (!name) throw new Error("Invalid restaurant ID");

  const url = new URL("/v2/search/instant", "https://trackapi.nutritionix.com");
  const searchParams = new URLSearchParams();

  searchParams.set("query", name);
  searchParams.set("self", String(false));       // don't include user's food log
  searchParams.set("common", String(false));     // don't include common food items
  searchParams.set("branded", String(true));     // included branded food items
  searchParams.set("branded_type", String(1));   // 1 = restaurant
  searchParams.set("branded_region", String(1)); // 1 = US

  const res = await fetch(`${url.href}?${searchParams.toString()}`, {
    headers: NUTRITIONIX_HEADERS,
  });

  return await res.json();
}
