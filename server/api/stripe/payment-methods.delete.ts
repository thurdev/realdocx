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

  // Remove the payment method from the customer
  await controllerStripe.paymentMethods.detach(paymentMethodId);

  return {
    success: true,
  };
});
