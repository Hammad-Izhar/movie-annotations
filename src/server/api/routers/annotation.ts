import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@movies/server/api/trpc";

export const annotationRouter = createTRPCRouter({});
