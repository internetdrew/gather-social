import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not available in this environment");
    }
    const sig = req.headers["stripe-signature"] as string;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    });

    const payload = await getRawBody(req);

    if (req.method === "POST") {
      try {
        stripe.webhooks.constructEvent(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          payload,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err: unknown) {
        if (err instanceof Error) {
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
      }

      res.json({ received: true });
    }
  } catch (error) {
    console.error(error);
  }
}
