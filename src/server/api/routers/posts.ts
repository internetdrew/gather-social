// import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAllForEvent: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  // create: privateProcedure.mutation(({ ctx }) => {}),
});
