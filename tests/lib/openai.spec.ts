import { expect, test } from '@playwright/test';

import * as openai from '@/lib/openai';

test("recommend items for Chick-fil-A", async () => {
  test.slow();
  try {
    const res = await openai.runRestaurantRecommendation("513fbc1283aa2dc80c000025");
    console.log(res.data.choices[0]);
  } catch (e) {
    expect(e).not.toBeInstanceOf(Error);
  }
});
