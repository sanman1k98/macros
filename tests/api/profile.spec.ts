import { BrowserContext, expect, test } from '@playwright/test';
import * as esbuild from "esbuild";
import { env } from "@/env.mjs";

const STORAGE_STATE = "./playwright/.auth/storageState.json";
const SUPABASE_SCRIPT = "./playwright/out/supabase-auth-helpers.js";
let ACCESS_TOKEN: string;

// test.beforeAll(async ({ browser }) => {
//   let ctx: BrowserContext;
//   try {
//     ctx = await browser.newContext({ storageState: STORAGE_STATE });
//   } catch (e) {
//     console.log(`Exception: ${e}`);
//     ctx = await browser.newContext();
//   }
//
//   // Navigate to the home page
//   const page = await ctx.newPage();
//   await page.goto("/");
//
//   // Add the Supabase library to the page
//   await esbuild.build({
//     entryPoints: [
//       "./node_modules/@supabase/auth-helpers-shared/dist/index.mjs",
//     ],
//     bundle: true,
//     minify: true,
//     globalName: "supabase_auth_helpers",
//     sourcemap: true,
//     outfile: SUPABASE_SCRIPT,
//   });
//
//   await page.addScriptTag({ path: SUPABASE_SCRIPT });
//
//   // Start waiting for a response before we add our script
//   const getTokenResponse = page.waitForResponse(res => res.url().startsWith(env.NEXT_PUBLIC_SUPABASE_URL));
//
//   // Fail test if our script errors
//   page.on('pageerror', e => {
//     expect(() => { throw e }).not.toThrowError();
//   });
//
//   // TODO: try using page.evaluate() to create the browser client and signin
//   await page.addScriptTag({ type: "module", content: `
//     const client = supabase_auth_helpers.createBrowserSupabaseClient({
//       supabaseUrl: "${env.NEXT_PUBLIC_SUPABASE_URL}",
//       supabaseKey: "${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}",
//     });
//
//     // Sign in with password to get an access token
//     const { data, error } = await client.auth.signInWithPassword({
//       email: "${env.SUPABASE_TEST_EMAIL}",
//       password: "${env.SUPABASE_TEST_PASSWORD}",
//     });
//
//     // Throw if we don't get session information back
//     if (!data.session && error) throw error;
//   `});
//
//   // Get the access token from the response
//   const res = await getTokenResponse;
//   ACCESS_TOKEN = (await res.json()).access_token;
//
//   // Write the storage state to a file
//   await ctx.storageState({ path: STORAGE_STATE });
//
//   // Ensure context closes gracefully and any artifacts are fully flushed and saved
//   await ctx.close();
// });

test.describe("/api/profile/", async () => {
  // Specify the storage state that has the session stored
  test.use({ storageState: STORAGE_STATE });

//   test("get the user with specified browser context", async ({ request }) => {
//     const url = new URL("/auth/v1/user", env.NEXT_PUBLIC_SUPABASE_URL);
//
//     const res = await request.get(url.toString(), {
//       headers: {
//         apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         Authorization: `Bearer ${ACCESS_TOKEN}`
//       },
//     });
//
//     expect(res).toBeOK();
//     const data = await res.json();
//
//     expect(data).toHaveProperty("email");
//     expect(data.email).toEqual(env.SUPABASE_TEST_EMAIL);
//   });

  test("GET", async ({ request }) => {
    const url = new URL("/api/profile", env.NEXT_PUBLIC_SITE_ORIGIN);

    const res = await request.get(url.toString());

    const data = await res.json();
    expect(res).toBeOK();
    expect(data).toHaveProperty("username");
  });
});
