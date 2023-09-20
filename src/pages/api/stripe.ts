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
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not available in this environment");
  }

  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"] as string;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
      typescript: true,
    });

    const payload = await getRawBody(req);
    console.log(payload);

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log("Webhook verified.");
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
    }

    if (event?.type === "checkout.session.completed") {
      console.log(event);
    }
    // Return a 200 response to acknowledge receipt of the event

    res.status(200).json({ message: "Hello from Next.js!" });
  }
}
