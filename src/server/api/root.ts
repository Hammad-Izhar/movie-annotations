import { createTRPCRouter } from "@movies/server/api/trpc";

import { annotationRouter } from "./routers/annotation";
import { movieRouter } from "./routers/movie";
import { roomRouter } from "./routers/room";
import { sessionAssignmentRouter } from "./routers/sessionAssignment";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  annotation: annotationRouter,
  movie: movieRouter,
  sessionAssignment: sessionAssignmentRouter,
  user: userRouter,
  room: roomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
