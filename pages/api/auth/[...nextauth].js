import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
const bcrypt = require("bcryptjs");
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import userModel from "~/models/user";
import clientPromise from "~/utils/mongoDriver";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;
        const userData = await userModel.findOne({
          email: username,
        });
        if (userData) {
          const validPassword = await bcrypt.compare(password, userData.hash);
          if (validPassword) {
            return userData;
          }
          return null;
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60, // 3hr
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
    maxAge: 3 * 60 * 60, // 3hr
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user?.email) {
        const dbUser = await userModel.findOne({ email: user.email });
        if (dbUser && dbUser.isDeleted) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      const userData = user && {
        id: user.id,
        name: user.name,
        email: user.email,
        a: user.isAdmin ? user.isAdmin : false,
        s:
          user.isStaff && user.isStaff.status
            ? user.isStaff
            : { status: false },
      };
      user && (token.user = userData);
      return Promise.resolve(token);
    },
    async session({ session, token, user }) {
      session.user = token.user;
      return Promise.resolve(session);
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
  },
  theme: {
    colorScheme: "light",
  },
  events: {
    async createUser({ user }) {
      const db = (await clientPromise).db();
      await db.collection("users").updateOne(
        { email: user.email }, 
        {
          $set: {
            phone: "", // 기본값 설정
            house: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            refundRequest: [],
            level: 0,
            status: "active",
            isAdmin: false,
            isStaff: { status: false, surname: "", permissions: [] },
            withdrawablePoint: 0,
            shoppingPoint: 0,
            totalWithdrawablePoint: 0,
            totalShoppingPoint: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            level: 0,
            level_exp: 0,
            isDeleted: false,
          },
        }
      );
    },
  },
});
