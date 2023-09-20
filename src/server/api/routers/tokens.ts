// import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const tokenRouter = createTRPCRouter({
  getUserTokenCount: privateProcedure.query(async ({ ctx }) => {
    const tokens = await ctx.prisma.eventToken.count({
      take: 100,
      where: {
        userId: ctx.userId!,
      },
    });
    return tokens;
  }),
});
