import { expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

test.describe("POST", async () => {

  test("recommend from Chick-fil-A food items", async ({ request }) => {
    // Chick-Fil-A brand_id
    const id = "513fbc1283aa2dc80c000025"
    const url = new URL(`/api/restaurants/${id}/items/recommend`, env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.post(url.href);
    expect.soft(res).toBeOK();

    if (res.status() === 429) {
      console.log("Your token usage might be expired");
    }  

    const data = await res.json();

    expect(data).toHaveProperty("items");
    expect(data).toHaveProperty("completion");
    expect(data).toHaveProperty("prompt");

    expect(data.completion).toHaveProperty("choices");
    expect(data.completion.choices).toBeInstanceOf(Array);

    console.log(data.prompt);
    console.log(data.completion);
  });

});
