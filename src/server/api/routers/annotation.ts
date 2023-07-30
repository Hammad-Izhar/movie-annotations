import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@movies/server/api/trpc";

export const annotationRouter = createTRPCRouter({
  createManyAnnotations: protectedProcedure
    .input(
      z.array(
        z.object({
          frameNumber: z.number(),
          sessionAssignmentId: z.string(),
          valence: z.number().nullable(),
          createdAt: z.date().optional(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.annotation.createMany({ data: input });
    }),
});
