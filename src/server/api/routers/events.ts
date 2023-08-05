import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { currentUser } = ctx;

    const hostEvents = await ctx.prisma.event.findMany({
      take: 10,
      where: {
        hostId: currentUser.userId!,
      },
    });

    const guestEvents = await ctx.prisma.guestEvent.findMany({
      take: 10,
      where: {
        guestIdentifier: currentUser.userId!,
      },
      include: {
        event: {
          select: {
            title: true,
          },
        },
      },
    });

    return {
      hostEvents,
      guestEvents,
    };
  }),
});
