import { NextResponse } from "next/server";

// Do not cache this route.
export const revalidate = false;

export async function GET() {
  return NextResponse.json("hello", {
    status: 200,
  });
}
