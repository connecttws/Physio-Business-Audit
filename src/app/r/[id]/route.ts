import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(`/report?id=${id}`, request.url);
  return NextResponse.redirect(url, 307);
}
