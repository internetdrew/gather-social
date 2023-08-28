// import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAllForEvent: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
});
