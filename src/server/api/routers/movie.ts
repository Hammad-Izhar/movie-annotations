import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@movies/server/api/trpc";
import { z } from "zod";

export const movieRouter = createTRPCRouter({
  getAllMovies: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany();
  }),
});
