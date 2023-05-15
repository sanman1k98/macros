import { writeFile, readFile } from 'fs/promises';
import type { AuthSession } from '@supabase/supabase-js';

export const sessionFile = "playwright/.auth/session.json";

export async function getSessionState() {
  try {
    const txt = await readFile(sessionFile, "utf8");
    const data = JSON.parse(txt) as AuthSession;
    return data;
  } catch {
    return undefined
  }
}

export async function updateSessionState(data: AuthSession) {
  await writeFile(sessionFile, JSON.stringify(data), "utf8")
}
