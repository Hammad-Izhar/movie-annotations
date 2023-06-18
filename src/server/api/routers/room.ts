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

  checkIfRoomIsActive: publicProcedure
    .input(z.object({ roomCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findUnique({
        where: {
          roomCode: input.roomCode,
        },
      });

      return room !== null && room.isActive;
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
