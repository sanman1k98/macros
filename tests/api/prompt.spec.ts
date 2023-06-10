import { expect, test } from '@playwright/test';
import createPrompt from '@/app/api/restaurants/[id]/items/recommend/prompt';
import { env } from "@/env.mjs";

test("create prompt for Chick-fil-A", async ({ request }) => {
  // Chick-fil-A brand_id
  const id = "513fbc1283aa2dc80c000025"
  const url = new URL(`/api/restaurants/${id}/items`, env.NEXT_PUBLIC_SITE_ORIGIN);

  const res = await request.get(url.href);
  expect.soft(res).toBeOK();

  const data = await res.json();

  expect(data).toBeInstanceOf(Array);

  const prompt = createPrompt("Chick-fil-A", data)
  console.log(prompt)
});

