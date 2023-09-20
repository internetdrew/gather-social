import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";

export const checkoutRouter = createTRPCRouter({
  createSession: privateProcedure
    .input(
      z.object({
        tokens: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tokens } = input;
      const userId = ctx.userId!;

      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe secret key not available in this environment");
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2022-11-15",
        typescript: true,
      });
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: "price_1NsGgdKhtZ63tY5pEKuQwdTM",
            quantity: tokens,
          },
        ],
        mode: "payment",
        success_url: `${process.env.SITE_URL}/?success=true`,
        cancel_url: `${process.env.SITE_URL}/?canceled=true`,
        metadata: {
          userId,
        },
      });

      console.log(session);
      if (session.url) {
        return { id: session.id, url: session.url };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid session url",
        });
      }
    }),
});
