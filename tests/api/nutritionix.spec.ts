import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";
import { URLSearchParams } from 'url';

test.describe("GET", async () => {

  test("get a list of foods from Chick-Fil-A", async ({ request }) => {
    const url = new URL("/api/nutritionix/search", env.NEXT_PUBLIC_SITE_ORIGIN);

    const params = new URLSearchParams([
      ["query",        "chick fil a"],  // search for Chick-fil-a
      ["branded",      "true"],         // include branded foods
      ["branded_type", "1"],            // 1 = restuarant
      ["common",       "false"],        // don't include common foods
    ]);

    const endpoint = `${url.origin}${url.pathname}?${params.toString()}`;
    const res = await request.get(endpoint);
    expect.soft(res).toBeOK();

    const data = await res.json();
    expect(data).toHaveProperty("branded");

    const { branded } = data;
    expect.soft(branded.length).toBeGreaterThan(1);

    branded.map((item: any) => {
      console.log(item);
      expect.soft(item).toHaveProperty("food_name");
      expect.soft(item).toHaveProperty("brand_name");
      expect.soft(item).toHaveProperty("nix_brand_id");
      expect.soft(item).toHaveProperty("nix_item_id");
    });
  });

  test("get Chick-Fil-A food items below 300 calories", async ({ request }) => {
    test.fixme(true, "child query fails");
    const url = new URL("/api/nutritionix/search", env.NEXT_PUBLIC_SITE_ORIGIN);

    const body = {
      query: "chick fil a",
      branded: true,
      branded_type: 1,
      common: false,
      full_nutrients: {
        "208": { lte: 300 }
      },
    }

    const res = await request.post(url.href, { data: body });
    expect.soft(res).toBeOK();

    const data = await res.json();
    expect(data).toHaveProperty("branded");

    const { branded } = data;
    expect.soft(branded.length).toBeGreaterThan(1);

    branded.map((item: any) => {
      console.log(item);
      expect.soft(item).toHaveProperty("food_name");
      expect.soft(item).toHaveProperty("brand_name");
      expect.soft(item).toHaveProperty("nix_brand_id");
      expect.soft(item).toHaveProperty("nix_item_id");
    });
  });
});
