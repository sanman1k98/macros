import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("GET", async () => {

  test("get restaurants around Philly", async ({ request }) => {
    const url = new URL("/api/locations", env.NEXT_PUBLIC_SITE_ORIGIN);

    const params = new URLSearchParams([
      ["ll",       "39.9526,-75.1651"], // Philadelphia, PA
      ["distance", "30mi"],             // search radius of 30 miles
    ]);

    const endpoint = `${url.origin}${url.pathname}?${params.toString()}`;
    const res = await request.get(endpoint);
    expect.soft(res).toBeOK();

    const data = await res.json();
    expect(data).toHaveProperty("locations");

    const { locations } = data;
    console.log(`Returned ${locations.length} results`)

    locations.map((loc: any) => {
      console.log(loc);
      expect.soft(loc).toHaveProperty("name");
      expect.soft(loc).toHaveProperty("brand_id");
      expect.soft(loc).toHaveProperty("website");
      expect.soft(loc).toHaveProperty("distance_km");
    });
  });

  test("get restaurants in Mechanicsburg", async ({ request }) => {
    const url = new URL("/api/locations", env.NEXT_PUBLIC_SITE_ORIGIN);

    const params = new URLSearchParams([
      ["ll",       "40.21404,-77.01017"], // Mechanicsburg, PA
      ["distance", "10mi"],               // search radius of 10 miles
    ]);

    const endpoint = `${url.origin}${url.pathname}?${params.toString()}`;
    const res = await request.get(endpoint);
    expect.soft(res).toBeOK();

    const data = await res.json();
    expect(data).toHaveProperty("locations");

    const { locations } = data;
    console.log(`Returned ${locations.length} results`)

    locations.map((loc: any) => {
      console.log(loc);
      expect.soft(loc).toHaveProperty("name");
      expect.soft(loc).toHaveProperty("brand_id");
      expect.soft(loc).toHaveProperty("website");
      expect.soft(loc).toHaveProperty("distance_km");
    });
  });
});
