import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@movies/server/api/trpc";
import { z } from "zod";

export const annotationRouter = createTRPCRouter({});
