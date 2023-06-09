import { authOptions } from "@movies/server/auth";
import NextAuth from "next-auth";

export default NextAuth(authOptions);
