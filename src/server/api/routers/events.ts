import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateQRCode } from "~/utils/qrCodeUtils";
import { Buffer } from "buffer";
import { useS3 } from "~/hooks/useS3";
import * as argon2 from "argon2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    const guestCheckinsWithHostInfo = guestCheckins
      .filter((guestCheckIn) => guestCheckIn.event.hostId !== userId)
      .map((guestCheckin) => {
        const host = users.find(
          (user) => user.id === guestCheckin.event.hostId
        );

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
      eventCount:
        hostEventsWithHostInfo.length + guestCheckinsWithHostInfo.length,
    };
  }),
  create: privateProcedure
    .input(
      z.object({
        title: z.string().min(1).max(60),
        password: z.string().min(14).max(60),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hostId = ctx.userId!;

      const hash = await argon2.hash(input.password);

      const event = await ctx.prisma.event.create({
        data: {
          hostId,
          title: input.title,
          password: hash,
        },
      });

      await ctx.prisma.eventGuestCheckin.create({
        data: {
          event: {
            connect: {
              id: event.id,
            },
          },
          guestId: hostId,
        },
      });

      const availableEventToken = await ctx.prisma.eventToken.findFirst({
        where: {
          eventId: null,
        },
      });

      await ctx.prisma.eventToken.update({
        where: {
          id: availableEventToken?.id,
        },
        data: {
          eventId: event.id,
        },
      });

      const qrCodeImageData: string = await generateQRCode(event.id);
      const binaryImageData: Buffer = Buffer.from(
        qrCodeImageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const bucketName = process.env.S3_BUCKET_NAME;

      const s3 = useS3();

      const qrImageKey = `qr_codes/event_${event.id}.png`;

      const params = {
        Bucket: bucketName,
        Key: qrImageKey,
        Body: binaryImageData,
        ContentType: "image/png",
      };

      try {
        const command = new PutObjectCommand(params);
        await s3.send(command);

        const updatedEvent = await ctx.prisma.event.update({
          where: { id: event.id },
          data: {
            qrCodeS3Key: qrImageKey,
          },
        });

        return updatedEvent;
      } catch (error) {
        console.error("Problem sending QR code to s3: ", error);
        throw error;
      }
    }),
  activate: privateProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const startDate = new Date();

      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30);

      try {
        const eventWithActiveDates = await ctx.prisma.event.update({
          where: {
            id: input.id,
          },
          data: {
            startDate: startDate,
            endDate: endDate,
          },
        });
        return eventWithActiveDates;
      } catch (error) {
        console.error(error);
      }
    }),
  getEventDetails: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const eventDetails = await ctx.prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      if (!eventDetails) {
        throw new TRPCError({
          message: "No event matching this id.",
          code: "NOT_FOUND",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hostId, password, ...cleanEventDetails } = eventDetails ?? {};

      const hostDetails = await clerkClient.users.getUser(hostId);
      const {
        firstName,
        lastName,
        profileImageUrl: avatar,
      } = hostDetails ?? {};

      return {
        ...cleanEventDetails,
        hostDetails: {
          firstName,
          lastName,
          avatar,
        },
      };
    }),
  getInviteAssets: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      const qrCodeKey = event?.qrCodeS3Key;

      const bucketName = process.env.S3_BUCKET_NAME;
      const s3 = useS3();

      const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: qrCodeKey!,
      });

      const qrCodeImageUrl = await getSignedUrl(s3, getObjectCommand, {
        expiresIn: 3600,
      });

      return { qrCodeImageUrl, joinEventUrl: `/event/join/${input.eventId}` };
    }),
  addNewGuest: privateProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      const eventPassword = event?.password;

      const passwordsMatch = await argon2.verify(
        eventPassword!,
        input.password
      );

      if (!passwordsMatch) {
        throw new TRPCError({
          message: "Trouble adding user to event",
          code: "FORBIDDEN",
        });
      }

      const eventGuestCheckin = await ctx.prisma.eventGuestCheckin.create({
        data: {
          guestId: userId!,
          eventId: input.eventId,
        },
      });
      return eventGuestCheckin;
    }),
});
