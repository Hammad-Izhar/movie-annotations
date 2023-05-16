import NextAuth from "next-auth";
import { authOptions } from "@movies/server/auth";

export default NextAuth(authOptions);
