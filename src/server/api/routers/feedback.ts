import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const feedbackRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        feedback: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;
      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authorized for this action.",
        });

      const { success: withinRateLimit } = await ratelimit.limit(userId);
      if (!withinRateLimit) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const user = await clerkClient.users.getUser(userId);
      const primaryEmailId = user.primaryEmailAddressId;
      const userEmailData = user.emailAddresses.find(
        (email) => email.id === primaryEmailId
      );
      const userEmail = userEmailData?.emailAddress;

      await ctx.prisma.feedback.create({
        data: {
          userId,
          userEmail: userEmail!,
          message: input.feedback,
        },
      });
    }),
});
