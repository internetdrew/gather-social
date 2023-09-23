import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const tokenRouter = createTRPCRouter({
  getUserAvailableTokens: privateProcedure.query(async ({ ctx }) => {
    const tokens = await ctx.prisma.eventToken.count({
      take: 100,
      where: {
        userId: ctx.userId!,
        eventId: null,
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
      return tokens;
    }),
});
