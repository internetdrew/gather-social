import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

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
              id: postAuthor.id,
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
      const authorId = ctx.userId!;
      const { success: withinRateLimit } = await ratelimit.limit(authorId);
      if (!withinRateLimit) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      try {
        const post = await ctx.prisma.post.create({
          data: {
            caption: input.caption,
            authorId,
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
  delete: privateProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.userId!;
      const { postId } = input;
      const postData = await ctx.prisma.post.findFirst({
        where: {
          id: postId,
        },
      });

      if (currentUserId !== postData?.authorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User not authorized for this action.",
        });
      }

      console.log(postData);
    }),
  edit: privateProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.userId!;
      console.log(input.postId);
    }),
});
