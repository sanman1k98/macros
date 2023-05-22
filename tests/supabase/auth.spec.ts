import { expect, test } from '@playwright/test';
import { AuthSession, createClient } from "@supabase/supabase-js";
import { getSessionState, updateSessionState } from "./session";
import { env } from "@/env.mjs";

let supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

test("save session state", async () => {
  let session = await getSessionState();

  if (!session || !session.access_token || !session.refresh_token) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: env.SUPABASE_TEST_EMAIL,
      password: env.SUPABASE_TEST_PASSWORD,
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();

    session = data.session!;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  expect(error).toBeNull();
  expect(data).toBeDefined();

  await updateSessionState(data.session!);
});

test("get user from saved session", async () => {
  const { data, error } = await supabase.auth.getUser();

  expect(error).toBeNull();
  expect(data).toBeDefined();
  expect(data.user).toBeDefined();

  expect(data.user?.email).toEqual(env.SUPABASE_TEST_EMAIL);
});

/**
  * Copied from `https://app.supabase.com/project/fbzquxjugehuhoonbgwc/api?page=users`
  *
  * ```sh
  * curl -X POST 'https://fbzquxjugehuhoonbgwc.supabase.co/auth/v1/token?grant_type=password' \
  * -H "apikey: SUPABASE_KEY" \
  * -H "Content-Type: application/json" \
  * -d '{
  *   "email": "someone@email.com",
  *   "password": "rlmHmDVPsUKdXqGrAynB"
  * }'
  * ```
  */
test.describe("GoTrue API", async () => {
  let token: string;

  test("get an access token", async ({ request }) => {
    const url = new URL("/auth/v1/token?grant_type=password", env.NEXT_PUBLIC_SUPABASE_URL);
    const res = await request.post(url.toString(), {
      headers: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      data: {
        email: env.SUPABASE_TEST_EMAIL,
        password: env.SUPABASE_TEST_PASSWORD,
      },
    });

    expect(res).toBeOK();
    const data = await res.json() as AuthSession;

    expect(data).toHaveProperty("access_token");
    token = data.access_token;
  });

  test("use an access token", async ({ request }) => {
    const url = new URL("/auth/v1/user", env.NEXT_PUBLIC_SUPABASE_URL);
    const res = await request.get(url.toString(), {
      headers: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res).toBeOK();
  });
});

test("supabase-js persists session in localStorage", async ({ page }) => {
  // Navigate to the home page
  await page.goto("/");

  // Log all uncaught errors to the terminal
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${exception}"`);
  });

  // Log all console.logs to the terminal
  page.on("console", async msg => {
    const values = [];
    for (const arg of msg.args())
      values.push(await arg.jsonValue());
    console.log(...values);
  });

  // Add the Supabase library to the page
  await page.addScriptTag({ path: "./node_modules/@supabase/supabase-js/dist/umd/supabase.js" });

  // Start waiting for the response before we add our script
  const supabaseResponse = page.waitForResponse(req => req.url().startsWith(env.NEXT_PUBLIC_SUPABASE_URL));

  await page.addScriptTag({ content: `
    (async () => {
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

      // Save session to localStorage
      await client.auth.signInWithPassword({
        email: "${env.SUPABASE_TEST_EMAIL}",
        password: "${env.SUPABASE_TEST_PASSWORD}",
      });
    })();
  `});

  // Resolve the response for our script before continuing
  await supabaseResponse;

  // Get the browser context this page belongs to
  const ctx = page.context();

  // Write the storage state to a file
  const storageState = await ctx.storageState({ path: "./playwright/.auth/storageState.json" });
  expect(storageState.origins).toHaveLength(1);
})

test.describe("saved storageState", () => {
  test.use({ storageState: "./playwright/.auth/storageState.json" });

  test("can get user from persisted session", async ({ request }) => {
    const url = new URL("/auth/v1/user", env.NEXT_PUBLIC_SUPABASE_URL);

    const storageState = await request.storageState();
    expect(storageState.origins).toHaveLength(1);

    const item = storageState.origins.pop();
    expect(item?.origin).toEqual(env.NEXT_PUBLIC_SITE_ORIGIN);

    expect(item?.localStorage).toHaveLength(1);
    /**
      * {
      *   "name": "sb-fbzquxjugehuhoonbgwc-auth-token",
      *   "value": "...",
      * }
      */
    const session = item?.localStorage.pop();

    /** Breakdown of this regular expression pattern:
      * `/^sb-(\w+)-auth-token$/`
      *
      * > "^sb-"
      * Matches a string that begins with "sb-".
      *
      * > "(\w*)"
      * The string "\w+" matches or more alphabet characters, and the parenthesis make it a "capture group".
      *
      * > "-auth-token$"
      * Matches a string that ends with "-auth-token".
      *
      */
    const matcher = /^sb-(\w+)-auth-token$/;
    expect(session?.name).toMatch(matcher);

    expect(session?.value).toBeDefined();
    const parsedSession = JSON.parse(session!.value) as AuthSession;
    const access_token = parsedSession.access_token;

    const res = await request.get(url.toString(), {
      headers: {
        apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${access_token}`
      },
    });
    expect(res).toBeOK();
    const data = await res.json();

    expect(data).toHaveProperty("email");
    expect(data.email).toEqual(env.SUPABASE_TEST_EMAIL);
  })
})
