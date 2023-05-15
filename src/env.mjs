import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    SUPABASE_TEST_EMAIL: z.string().email(),
    SUPABASE_TEST_PASSWORD: z.string(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_TEST_EMAIL: process.env.SUPABASE_TEST_EMAIL,
    SUPABASE_TEST_PASSWORD: process.env.SUPABASE_TEST_PASSWORD,
  },
});
