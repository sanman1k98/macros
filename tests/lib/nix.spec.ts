import { expect, test } from '@playwright/test';

import * as nix from '@/lib/nutritionix';

test.beforeAll(async () => {
  await nix.init();
})

test("has an exported 'restaurants' Map", async () => {
  expect(nix.restaurants).toBeInstanceOf(Map);
});

test("get Chick-fil-A food items", async () => {
  const id = "513fbc1283aa2dc80c000025";
  const items = await nix.getRestaurantItems(id);
  console.log(items);
});
