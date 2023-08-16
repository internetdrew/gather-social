// import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";

export const eventsRouter = createTRPCRouter({
  getCurrentUserEvents: publicProcedure.query(async ({ ctx }) => {
    const { currentUser } = ctx;

    const users = await clerkClient.users.getUserList();

    const hostEvents = await ctx.prisma.event.findMany({
      take: 100,
      where: {
        hostId: currentUser.userId!,
      },
    });

    const guestCheckins = await ctx.prisma.eventGuestCheckin.findMany({
      take: 100,
      where: {
        guestId: currentUser.userId!,
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
});
