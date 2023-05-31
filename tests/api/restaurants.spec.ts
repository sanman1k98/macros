import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("GET", async () => {

  test("get list of restaurants", async ({ request }) => {
    const url = new URL("/api/restaurants", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.href);
    expect.soft(res).toBeOK();

    const data = await res.json();
    data.map((item: any) => {
      expect.soft(item).toHaveProperty("name");
      expect.soft(item).toHaveProperty("id");
      // brand ids are always a string of 24 alpha-numeric characters
      expect.soft(item.id).toHaveLength(24);
    });
  });
});
