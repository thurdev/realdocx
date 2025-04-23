import prisma from "~/lib/prisma";
import stripe from "stripe";

const controllerStripe = new stripe(process.env.STRIPE_SECRET_KEY ?? "");

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return Error("Unauthorized");
  }

  const { paymentMethodId } = await readBody(event);

  if (!paymentMethodId) {
    return Error("Unauthorized");
  }

  // Attach the payment method to the customer
  await controllerStripe.paymentMethods.attach(paymentMethodId, {
    customer: session.secure.stripeCustomerId,
  });

  return {
    success: true,
  };
});
