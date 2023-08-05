import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    console.log(ctx);
    // const users = await clerkClient;

    const hostEvents = await ctx.prisma.event.findMany({
      take: 10,
      where: {
        hostId: "",
      },
    });

    const guestEvents = await ctx.prisma.guestEvent.findMany({
      take: 10,
      where: {
        guestIdentifier: "",
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
