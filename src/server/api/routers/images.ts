import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { useS3 } from "~/hooks/useS3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const imagesRouter = createTRPCRouter({
  createPresignedUrl: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        fileNames: z.array(z.string()),
        postId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const s3 = useS3();

      const fileNames = input.fileNames;
      const signedUrls = Promise.all(
        fileNames.map((fileName) => {
          const ext = fileName.split(".")[1];
          const Key = `images/event-${input.eventId}/${ctx.userId}/post-${
            input.postId
          }/${randomUUID()}.${ext}`;

          const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key,
          });

          return getSignedUrl(s3, command, {
            expiresIn: 3600,
          });
        })
      );
      return signedUrls;
    }),
  addToDatabase: privateProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        postId: z.string(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const image = await ctx.prisma.image.create({
          data: {
            url: input.imageUrl,
            postId: input.postId,
            eventId: input.eventId,
          },
        });
        return image;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create new image in db.",
        });
      }
    }),
});
