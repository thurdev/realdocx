import prisma from "~/lib/prisma";
import { TransactionType } from "@prisma/client";
import stripe from "stripe";

const controllerStripe = new stripe(process.env.STRIPE_SECRET_KEY ?? "");

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return Error("Unauthorized");
  }

  // Verificar se o cliente existe no Stripe
  if (!session.secure.stripeCustomerId) {
    return Error("Stripe customer not found");
  }

  const { amount, paymentMethodId } = await readBody(event);

  // Validar o valor
  if (!amount || amount <= 0) {
    return Error("Invalid amount");
  }

  // Validar o método de pagamento
  if (!paymentMethodId) {
    return Error("Invalid payment method");
  }

  // Criar o pagamento no Stripe
  try {
    const paymentIntent = await controllerStripe.paymentIntents.create({
      amount: amount * 100, // Valor em centavos
      currency: "eur",
      payment_method: paymentMethodId,
      customer: session.secure.stripeCustomerId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status !== "succeeded") {
      return Error("Payment failed");
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    return Error("Payment failed");
  }

  try {
    // Verificar se o usuário existe
    const user = await prisma.users.findUnique({
      where: {
        id: session.secure.userId,
      },
    });

    if (!user) {
      return {
        error: "User not found",
        status: 404,
      };
    }

    // Criar a transação de crédito
    const transaction = await prisma.transactions.create({
      data: {
        amount,
        type: TransactionType.credit,
        subType: "manualCredit",
        userId: session.secure.userId,
      },
    });

    return {
      success: true,
      transaction,
    };
  } catch (error) {
    console.error("Error adding credits:", error);
    return {
      error: "Failed to add credits",
      status: 500,
    };
  }
});
