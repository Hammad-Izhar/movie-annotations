import { Emotion } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@movies/server/api/trpc";

export const sessionAssignmentRouter = createTRPCRouter({
  createSessionAssignment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        roomId: z.string(),
        character: z.string(),
        emotion: z.nativeEnum(Emotion),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sessionAssignment.create({ data: input });
    }),
});
