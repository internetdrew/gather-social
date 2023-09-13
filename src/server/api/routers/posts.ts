import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";

export const postsRouter = createTRPCRouter({
  getAllForEvent: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        take: 100,
        where: {
          eventId: input.eventId,
        },
        include: {
          images: {
            select: {
              id: true,
              s3Key: true,
            },
          },
          comments: true,
          likes: true,
        },
        orderBy: [{ createdAt: "desc" }],
      });

      const users = await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      });

      const finalizedPostData = posts.map((post) => {
        const postAuthor = users.find((user) => user.id === post.authorId);
        if (postAuthor) {
          const { authorId, ...postDetails } = post;
          void authorId;
          return {
            ...postDetails,
            author: {
              avatar: postAuthor.profileImageUrl,
              firstName: postAuthor.firstName,
              lastName: postAuthor.lastName,
            },
            images: post.images.map((image) => {
              if (image) {
                const { s3Key, ...rest } = image;
                void s3Key;
                return {
                  ...rest,
                  url: process.env.CLOUDFRONT_DIST_DOMAIN + image.s3Key,
                };
              }
            }),
          };
        }
      });

      return finalizedPostData;
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
