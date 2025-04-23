import prisma from "~/lib/prisma";
import stripe from "stripe";

const controllerStripe = new stripe(process.env.STRIPE_SECRET_KEY ?? "");

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return Error("Unauthorized");
  }

  if (!session.secure.stripeCustomerId) {
    return Error("Unauthorized");
  }

  // Retrieve the payment methods for the customer
  const { data } = await controllerStripe.customers.listPaymentMethods(
    session.secure.stripeCustomerId,
    {
      type: "card",
    }
  );
  return data;
});
