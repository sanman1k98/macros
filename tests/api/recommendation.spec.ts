import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("GET", async () => {

  test("get a recommendation", async ({ request }) => {
    const url = new URL("/api/recommendation", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.toString());
    expect.soft(res).toBeOK();

    if (res.status() === 429) {
      console.log("Your token usage might be expired");
      return;
    }

    const data = await res.json();
    console.log(data);
  });
});
