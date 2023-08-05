// import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { currentUser } = ctx;

    async function getHostInfoFromClerk(hostId: string) {
      return await clerkClient.users.getUser(hostId);
    }

    const hostEvents = await ctx.prisma.event.findMany({
      take: 10,
      where: {
        hostId: currentUser.userId!,
      },
    });

    const guestEvents = await ctx.prisma.eventGuestRelation.findMany({
      take: 10,
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

    const hostEventsWithHostInfo = await Promise.all(
      hostEvents.map(async (hostEvent) => {
        const hostInfo = await getHostInfoFromClerk(hostEvent.hostId);

        return {
          ...hostEvent,
          hostInfo: {
            firstName: hostInfo.firstName,
            lastName: hostInfo.lastName,
            avatar: hostInfo.profileImageUrl,
          },
        };
      })
    );

    const guestEventsWithHostInfo = await Promise.all(
      guestEvents.map(async (guestEvent) => {
        const hostInfo = await getHostInfoFromClerk(guestEvent.event.hostId);

        return {
          ...guestEvent,
          hostInfo: {
            firstName: hostInfo.firstName,
            lastName: hostInfo.lastName,
            avatar: hostInfo.profileImageUrl,
          },
        };
      })
    );

    const hostEventsWithoutHostIds = hostEventsWithHostInfo.map(
      ({ hostId: _hostId, ...rest }) => rest
    );

    const guestEventsWithoutHostIds = guestEventsWithHostInfo.map(
      ({ event: { hostId: _hostId, ...everythingElse }, ...rest }) => ({
        ...rest,
        title: everythingElse.title,
      })
    );

    return {
      hostEvents: hostEventsWithoutHostIds,
      guestEvents: guestEventsWithoutHostIds,
    };
  }),
});
