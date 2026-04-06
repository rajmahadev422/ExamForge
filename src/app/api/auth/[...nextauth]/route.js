import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/utils/connectToDb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectToDB();

        const existingUser = await User.findOne({ email: user.email });

        // 🔥 If user exists → skip
        if (existingUser) {
          return true;
        }

        // ✅ Create new user
        await User.create({
          name: user.name,
          email: user.email,
          userName: user.email.split("@")[0],
          image: user.image,
        });

        return true;
      } catch (error) {
        console.error("Error in signIn:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
