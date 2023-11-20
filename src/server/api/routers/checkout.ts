import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key not available in this environment");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const checkoutRouter = createTRPCRouter({
  createSession: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId!;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1O7fBWKhtZ63tY5pBr6mMYGB",
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
          },
        },
      ],
      mode: "payment",
      success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/home?canceled=true`,
      metadata: {
        userId,
      },
      automatic_tax: { enabled: true },
    });

    if (session.url) {
      return { id: session.id, url: session.url };
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid session url",
      });
    }
  }),
  getTokenPurchaseQuantity: privateProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe secret key not available in this environment");
      }

      const sessionWithItems = await stripe.checkout.sessions.retrieve(
        input.sessionId,
        {
          expand: ["line_items"],
        }
      );

      const qty = sessionWithItems.line_items?.data[0]?.quantity;

      return {
        qty,
      };
    }),
});
