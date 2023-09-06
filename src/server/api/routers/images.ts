import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { useS3 } from "~/hooks/useS3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { api } from "~/utils/api";

export const imagesRouter = createTRPCRouter({
  createPresignedUrl: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const s3 = useS3();
      const ext = input.fileName.split(".")[1];

      const Key = `images/event-${input.eventId}/${
        ctx.userId
      }/${randomUUID()}.${ext}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key,
      });
      return getSignedUrl(s3, command, {
        expiresIn: 3600,
      });
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
      console.log(input);
      try {
        const image = await ctx.prisma.image.create({
          data: {
            url: input.imageUrl,
            postId: input.postId,
            eventId: input.eventId,
          },
        });
        console.log(image);
        return image;
      } catch (error) {
        console.error(error);
      }
    }),
});
