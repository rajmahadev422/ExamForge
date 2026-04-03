import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: 'Hello from the App 12 Router!' });
}