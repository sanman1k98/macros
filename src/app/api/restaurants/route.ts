import { NextResponse } from "next/server";

/**
 * Gets a list of available restaurants
 * @see {@link https://docs.google.com/document/d/1_q-K-ObMTZvO0qUEAxROrN3bwMujwAN25sLHwJzliK0/edit#heading=h.e8kuc2hv63xe}
 */
export async function GET() {
  const res = await fetch("https://d1gvlspmcma3iu.cloudfront.net/restaurants-3d-party.json.gz", {
    // Revalidate everyday
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
