import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("GET", async () => {

  test("get info about Chick-Fil-A", async ({ request }) => {
    // Chick-Fil-A brand_id
    const id = "513fbc1283aa2dc80c000025"
    const url = new URL(`/api/restaurants/${id}`, env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.href);
    expect.soft(res).toBeOK();

    const data = await res.json();
    console.log(data);
    expect(data).toHaveProperty("name");
  });
});
