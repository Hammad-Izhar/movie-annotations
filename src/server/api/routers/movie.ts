import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@movies/server/api/trpc";

export const movieRouter = createTRPCRouter({
  getAllMovies: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.movie.findMany();
  }),
});
