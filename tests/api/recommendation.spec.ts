import { BrowserContext, expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("/api/recommendation", async () => {

  test("GET", async ({ request }) => {
    const url = new URL("/api/recommendation", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.toString());

    const status = res.status()
    const data = await res.json();

    if (status === 429) {
      console.log("Your token usage might be expired");
      return;
    }

    console.log(JSON.stringify(data, null, 2));
    expect(res).toBeOK();
  });
});
