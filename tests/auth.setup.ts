import { chromium, expect, FullConfig } from "@playwright/test";
import * as esbuild from "esbuild";
import * as fs from "fs/promises";
import { existsSync } from "fs";
import { env } from "@/env.mjs";

const CLIENT_SCRIPT = "./playwright/out/supabase-auth-helpers.js";

/**
 * Log info the the terminal
 */
const info = (str: string) => console.info(`=> ${str}...`);

export default async function authSetup(config: FullConfig) {
  // Destructure config
  const { storageState, baseURL } = config.projects[0].use;

  let supabaseCookie;

  info("Checking for a saved Supabase auth cookie");

  try {
    const contents = await fs.readFile(storageState as string, { encoding: "utf-8" });
    const store = JSON.parse(contents);
    supabaseCookie = store.cookies.some((cookie: any) => cookie.name.includes("supabase"));
  } catch (e) {
    console.log(e);
    info("Did not find saved Supabase cookie");
  }

  if (supabaseCookie) {
    return info("Using saved Supabase auth cookie");
  }

  info("Opening browser")
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the home page
  await page.goto(baseURL!);

  if (!existsSync(CLIENT_SCRIPT)) {
    info("Building Supabase Auth Helpers...")
    await esbuild.build({
      entryPoints: [
        "./node_modules/@supabase/auth-helpers-shared/dist/index.mjs",
      ],
      bundle: true,
      minify: true,
      outfile: CLIENT_SCRIPT,
      sourcemap: true,
      // When the script runs it creates a global variable
      globalName: "supabase_auth_helpers",
    });
  }

  // Start waiting for a response before we add our script
  const getSupabaseResponse = page.waitForResponse(res => res.url().startsWith(env.NEXT_PUBLIC_SUPABASE_URL));

  // Add script to page
  await page.addScriptTag({ path: CLIENT_SCRIPT });

  // Fail test if our script errors
  page.on('pageerror', e => {
    expect(() => { throw e }).not.toThrowError();
  });

  // TODO: try using page.evaluate() to create the browser client and signin
  await page.addScriptTag({ type: "module", content: `
    const client = supabase_auth_helpers.createBrowserSupabaseClient({
      supabaseUrl: "${env.NEXT_PUBLIC_SUPABASE_URL}",
      supabaseKey: "${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}",
    });

    // Sign in with password to get an access token
    const { data, error } = await client.auth.signInWithPassword({
      email: "${env.SUPABASE_TEST_EMAIL}",
      password: "${env.SUPABASE_TEST_PASSWORD}",
    });

    // Throw if we don't get session information back
    if (!data.session && error) throw error;
  `});

  // Resolve the promise
  await getSupabaseResponse;

  // Write the storage state to a file
  await page.context().storageState({ path: storageState as string });

  // Ensure context closes gracefully and any artifacts are fully flushed and saved
  await browser.close();

  // TEST: assert cookie and session is saved
}
