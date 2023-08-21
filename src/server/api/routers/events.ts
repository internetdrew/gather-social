import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { spawn } from "child_process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_BUCKET_REGION;
const accessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey!,
    secretAccessKey: secretKey!,
  },
});

export const eventsRouter = createTRPCRouter({
  getCurrentUserEvents: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const users = await clerkClient.users.getUserList();

    const hostEvents = await ctx.prisma.event.findMany({
      take: 100,
      where: {
        hostId: userId!,
      },
    });

    const guestCheckins = await ctx.prisma.eventGuestCheckin.findMany({
      take: 100,
      where: {
        guestId: userId!,
      },
      include: {
        event: {
          select: {
            title: true,
            hostId: true,
          },
        },
      },
    });

    const hostEventsWithHostInfo = hostEvents.map((hostEvent) => {
      const host = users.find((user) => user.id === hostEvent.hostId);

      if (host && hostEvent)
        return {
          id: hostEvent.id,
          createdAt: hostEvent.createdAt,
          startDate: hostEvent.startDate,
          endDate: hostEvent.endDate,
          title: hostEvent.title,
          hostInfo: {
            firstName: host.firstName,
            lastName: host.lastName,
            avatar: host.profileImageUrl,
          },
        };
    });

    const guestCheckinsWithHostInfo = guestCheckins.map((guestCheckin) => {
      const host = users.find((user) => user.id === guestCheckin.event.hostId);

      if (!host)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No host found on guest checkin.",
        });

      if (host && guestCheckin)
        return {
          id: guestCheckin.id,
          title: guestCheckin.event.title,
          hostInfo: {
            firstName: host.firstName,
            lastName: host.lastName,
            avatar: host.profileImageUrl,
          },
        };
    });

    return {
      hostEvents: hostEventsWithHostInfo,
      guestCheckins: guestCheckinsWithHostInfo,
    };
  }),
  getCurrentUserEventCount: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const hostEvents = await ctx.prisma.event.findMany({
      take: 100,
      where: {
        hostId: userId!,
      },
    });

    const guestCheckins = await ctx.prisma.eventGuestCheckin.findMany({
      take: 100,
      where: {
        guestId: userId!,
      },
      include: {
        event: {
          select: {
            title: true,
            hostId: true,
          },
        },
      },
    });

    const count = hostEvents.length + guestCheckins.length;
    return { activeEvents: count };
  }),
  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hostId = ctx.userId!;

      const event = await ctx.prisma.event.create({
        data: {
          hostId,
          title: input.title,
        },
      });

      return event;
    }),
});
