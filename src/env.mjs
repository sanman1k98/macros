import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    SUPABASE_TEST_EMAIL: z.string().email(),
    SUPABASE_TEST_PASSWORD: z.string(),
    OPENAI_API_KEY: z.string(),
    OPENAI_ORGANIZATION_ID: z.string(),
    NUTRITIONIX_APP_ID: z.string(),
    NUTRITIONIX_APP_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_ORIGIN: z.string().url(),
  },
  // `runtimeEnv` is strict by default, meaning we have to destructure all the
  // keys manually. This is due to how Next.js bundles environment variables
  // and only explicitly accessed variables are included in the bundle.
  // Missing keys will result in a type error.
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_ORIGIN: process.env.NEXT_PUBLIC_SITE_ORIGIN,
    SUPABASE_TEST_EMAIL: process.env.SUPABASE_TEST_EMAIL,
    SUPABASE_TEST_PASSWORD: process.env.SUPABASE_TEST_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ORGANIZATION_ID: process.env.OPENAI_ORGANIZATION_ID,
    NUTRITIONIX_APP_ID: process.env.NUTRITIONIX_APP_ID,
    NUTRITIONIX_APP_KEY: process.env.NUTRITIONIX_APP_KEY,
  },
});
