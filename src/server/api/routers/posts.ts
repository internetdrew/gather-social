import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAllForEvent: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
      })
    )
    .query(({ ctx, input }) => {
      const posts = ctx.prisma.post.findMany({
        take: 100,
        where: {
          eventId: input.eventId,
        },
        orderBy: [{ createdAt: "desc" }],
      });
      return posts;
    }),
  create: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
        caption: z.string().nullable(),
        userId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.create({
          data: {
            caption: input.caption,
            authorId: input.userId,
            eventId: input.eventId,
          },
        });
        return post;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Problem when trying to create new post.",
        });
      }
    }),
});
