import { BrowserContext, expect, test } from '@playwright/test';
import { env } from "@/env.mjs";

const STORAGE_STATE = "./playwright/.auth/storageState.json";
let ACCESS_TOKEN: string;

test.beforeAll(async ({ browser }) => {
  let ctx: BrowserContext;
  try {
    ctx = await browser.newContext({ storageState: STORAGE_STATE });
  } catch (e) {
    console.log(`Exception: ${e}`);
    ctx = await browser.newContext();
  }

  // Navigate to the home page
  const page = await ctx.newPage();
  await page.goto("/");

  // Add the Supabase library to the page
  await page.addScriptTag({ path: "./node_modules/@supabase/supabase-js/dist/umd/supabase.js" });

  // Start waiting for a response before we add our script
  const getTokenResponse = page.waitForResponse(res => res.url().startsWith(env.NEXT_PUBLIC_SUPABASE_URL));

  // Fail test if our script errors
  page.on('pageerror', e => {
    expect(() => { throw e }).not.toThrowError();
  });

  await page.addScriptTag({ type: "module", content: `
    // The supabase global is added from the previous script tag
    const client = supabase.createClient(
      "${env.NEXT_PUBLIC_SUPABASE_URL}",
      "${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}", {
        auth: {
          persistsession: true,
          autoRefreshToken: true,
        },
      },
    );

    // Sign in with password to get an access token
    const { data, error } = await client.auth.signInWithPassword({
      email: "${env.SUPABASE_TEST_EMAIL}",
      password: "${env.SUPABASE_TEST_PASSWORD}",
    });

    // Throw if we don't get session information back
    if (!data.session && error) throw error;
  `});

  // Get the access token from the response
  const res = await getTokenResponse;
  ACCESS_TOKEN = (await res.json()).access_token;

  // Write the storage state to a file
  await ctx.storageState({ path: STORAGE_STATE });

  // Ensure context closes gracefully and any artifacts are fully flushed and saved
  await ctx.close();
});

test.describe("/api/profile/", async () => {
  // Specify the storage state that has the session stored
  test.use({ storageState: STORAGE_STATE });

  test("get the user with specified browser context", async ({ request }) => {
    const url = new URL("/auth/v1/user", env.NEXT_PUBLIC_SUPABASE_URL);

    const res = await request.get(url.toString(), {
      headers: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
    });

    expect(res).toBeOK();
    const data = await res.json();

    expect(data).toHaveProperty("email");
    expect(data.email).toEqual(env.SUPABASE_TEST_EMAIL);
  });

  test("GET", async ({ request }) => {
    const url = new URL("/api/profile", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.toString(), {
      headers: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
    });

    const data = await res.json();
    expect(data).toBeDefined();
    expect(res).toBeOK();
  });
});
