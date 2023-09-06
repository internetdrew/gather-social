import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { eventsRouter } from "./routers/events";
import { checkoutRouter } from "./routers/checkout";
import { imagesRouter } from "./routers/images";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  events: eventsRouter,
  checkout: checkoutRouter,
  images: imagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
