import { BrowserContext, expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("/api/recommendation", async () => {

  test("GET", async ({ request }) => {
    const url = new URL("/api/recommendation", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.toString());

    const data = await res.json();
    expect(res).toBeOK();
    console.log(data);
  });
});
