import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@movies/server/api/trpc";
import { z } from "zod";

export const roomRouter = createTRPCRouter({
  getRoomByCode: publicProcedure
    .input(z.object({ roomCode: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.room.findUnique({
        where: {
          roomCode: input.roomCode,
        },
      });
    }),

  createRoom: protectedProcedure
    .input(z.object({ roomCode: z.string(), movieId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.room.create({
        data: {
          movieId: input.movieId,
          roomCode: input.roomCode,
        },
      });
    }),
});
