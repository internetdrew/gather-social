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

    const guestEvents = await ctx.prisma.eventGuestRelation.findMany({
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

    const guestEventsWithHostInfo = guestEvents.map((guestEvent) => {
      const host = users.find((user) => user.id === guestEvent.event.hostId);

      if (host && guestEvent)
        return {
          id: guestEvent.id,
          title: guestEvent.event.title,
          hostInfo: {
            firstName: host.firstName,
            lastName: host.lastName,
            avatar: host.profileImageUrl,
          },
        };
    });

    return {
      hostEvents: hostEventsWithHostInfo,
      guestEvents: guestEventsWithHostInfo,
    };
  }),
});
