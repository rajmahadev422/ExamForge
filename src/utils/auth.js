import { getServerSession } from "next-auth";
import { connectToDB } from "./connectToDb";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    await connectToDB();

    const user = await User.findById(session.user.id);
    return user;
  } catch (error) {
    return null;
  }
}