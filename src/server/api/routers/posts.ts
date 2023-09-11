import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { useS3 } from "~/hooks/useS3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const postsRouter = createTRPCRouter({
  getAllForEvent: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const s3 = useS3();

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

      const postsWithAuthors = posts.map((post) => {
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
          };
        }
      });
      const finalizedPostData = await Promise.all(
        postsWithAuthors.map(async (post) => {
          if (post) {
            const signedUrls = Promise.all(
              post.images.map(async (image) => {
                const command = new GetObjectCommand({
                  Bucket: process.env.S3_BUCKET_NAME,
                  Key: image.s3Key,
                });

                const signedUrl = await getSignedUrl(s3, command, {
                  expiresIn: 3600,
                });
                return { id: image.id, signedUrl };
              })
            );

            const freshImageData = await signedUrls;
            return {
              ...post,
              images: freshImageData,
            };
          }
        })
      );

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
