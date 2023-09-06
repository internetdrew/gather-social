import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { api } from "~/utils/api";

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
      console.log(posts);
    }),
  create: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
        caption: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.create({
          data: {
            caption: input.caption,
            authorId: ctx.userId!,
            eventId: input.eventId,
          },
        });
        return post;
      } catch (err) {
        console.log(err);
      }
    }),
});
