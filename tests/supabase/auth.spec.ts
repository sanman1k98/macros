import { expect, test } from '@playwright/test';
import { createClient } from "@supabase/supabase-js";
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
test("authenticate using GoTrue API directly", async ({ request }) => {
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
  expect(await res.json()).toHaveProperty("access_token");
})
