import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/connectToDb";

export async function GET() {
  const status = await connectToDB();
  if(status) console.log("DB connection status");
  return NextResponse.json({ message: 'Hello from the App Router!' });
}