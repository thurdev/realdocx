import prisma from "~/lib/prisma";
import stripe from "stripe";
import { sendEmail } from "~/server/utils/email";

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

  try {
    // Get user info for email
    const user = await prisma.users.findUnique({
      where: { id: session.secure.userId },
    });

    // Attach the payment method to the customer
    await controllerStripe.paymentMethods.attach(paymentMethodId, {
      customer: session.secure.stripeCustomerId,
    });

    // Send card added email
    if (user) {
      try {
        await sendEmail(
          "card",
          user.email,
          user.name || user.email.split("@")[0],
          {},
          "pt"
        );
      } catch (error) {
        console.error("Failed to send card added email:", error);
        // Don't fail card addition if email fails
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error adding payment method:", error);
    return Error("Failed to add payment method");
  }
});
