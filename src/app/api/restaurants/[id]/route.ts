import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: extract this fetch call into its own function
  const res = await fetch("https://d1gvlspmcma3iu.cloudfront.net/restaurants-3d-party.json.gz");

  type Restaurant = { name: string, id: string };

  const data = await res.json() as Restaurant[];

  const restaurant = data.find(val => val.id === params.id);

  if (restaurant) return NextResponse.json(restaurant);

  const msg = { message: "Invalid restaurant id", status: 404 };
  return NextResponse.json(msg, { status: msg.status });
}
