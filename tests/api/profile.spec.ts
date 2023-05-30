import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("/api/profile/", async () => {
  test("GET", async ({ request }) => {
    const url = new URL("/api/profile", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.toString());
    expect.soft(res).toBeOK();

    const data = await res.json();
    expect(data).toHaveProperty("username");
    expect(data).toHaveProperty("full_name");
  });
});
