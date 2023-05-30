import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("/api/nutritionix/search", async () => {

  test.skip("GET", async ({ request }) => {
    const url = new URL("/api/nutritionix/search", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.toString());
    expect.soft(res).toBeOK();

    const data = await res.json();
    console.log(data);
  });
});
