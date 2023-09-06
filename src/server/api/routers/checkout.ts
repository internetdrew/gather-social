// import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import Stripe from "stripe";

export const checkoutRouter = createTRPCRouter({
  // createSession: publicProcedure.query(async ({ ctx }) => {
  //   try {
  //     if (!process.env.STRIPE_SECRET_KEY) {
  //       throw new Error("Stripe secret key not available in this environment");
  //     }
  //     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  //       apiVersion: "2022-11-15",
  //       typescript: true,
  //     });
  //     const session = await stripe.checkout.sessions.create({
  //       line_items: [
  //         {
  //           price: "price_1NfNQVKhtZ63tY5pi4H4YgfE",
  //           quantity: 1,
  //         },
  //       ],
  //       mode: "payment",
  //       success_url: `${process.env.SITE_URL}/home`,
  //       cancel_url: `${process.env.SITE_URL}/?canceled=true`,
  //     });
  //     if (session.url) {
  //       ctx.res.redirect(303, session.url);
  //     } else {
  //       throw new Error("Invalid session url");
  //     }
  //   } catch (err) {
  //     console.error("Error from Stripe payment intent: ", err);
  //   }
  // }),
});
