import { expect, test } from '@playwright/test';

import * as openai from '@/lib/openai';

test("recommend items for Chick-fil-A", async () => {
  try {
    const res = await openai.runRestaurantRecommendation("513fbc1283aa2dc80c000025");
    console.log(res);
  } catch (e) {
    console.log(e);
  }
});
