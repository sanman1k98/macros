import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("GET", async () => {

  test("get Chick-fil-A food items", async ({ request }) => {
    // Chick-Fil-A brand_id
    const id = "513fbc1283aa2dc80c000025"
    const url = new URL(`/api/restaurants/${id}/items`, env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.href);
    expect.soft(res).toBeOK();

    const data = await res.json();

    // Assert response returned an array
    expect(data).toHaveProperty("length");

    data.map((item: any) => {
      expect(item).toHaveProperty("nix_brand_id");
      expect.soft(item.nix_brand_id).toBe(id);
      expect(item).toHaveProperty("food_name");
      console.log(item.food_name);
    });
  });

  test("get Applebee's food items", async ({ request }) => {
    // Applebee's brand_id
    const id = "513fbc1283aa2dc80c000015"
    const url = new URL(`/api/restaurants/${id}/items`, env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.href);
    expect.soft(res).toBeOK();

    const data = await res.json();

    // Assert response returned an array
    expect(data).toHaveProperty("length");

    data.map((item: any) => {
      expect(item).toHaveProperty("nix_brand_id");
      expect.soft(item.nix_brand_id).toBe(id);
      expect(item).toHaveProperty("food_name");
      console.log(item.food_name);
    });
  });
});
