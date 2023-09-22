import { z } from "zod";
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
  addToDatabase: privateProcedure
    .input(
      z.object({
        qty: z.number(),
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;
      console.log(input.qty);
      console.log(input.sessionId);

      const tokenCreationPromises = Array(input.qty)
        .fill(null)
        .map(
          async () =>
            await ctx.prisma.eventToken.create({
              data: {
                userId,
                sessionId: input.sessionId,
              },
            })
        );
      const tokens = await Promise.all(tokenCreationPromises);
      console.log(tokens);
      return tokens;
    }),
});
