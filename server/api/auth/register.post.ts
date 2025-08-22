import { AuthPostRequest } from "./auth";
import { hashPassword } from "@/helpers/auth";
import prisma from "~/lib/prisma";
import { sendEmail } from "~/server/utils/email";
import { customerAuth } from "~/server/utils/stripe";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<AuthPostRequest>(event);

  // Validate email and password
  if (!email || !password) {
    return new Response("endpoints.errors.register.missingFields", {
      status: 400,
    });
  }

  // Check if user already exists
  const existingUser = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  // If user exists, throw an error
  if (existingUser) {
    return new Response("endpoints.errors.register.userExists", {
      status: 400,
    });
  }

  // Create user
  const newUser = await prisma.users.create({
    data: {
      email,
      // Hash the password before storing it
      password: await hashPassword(password),
      name: email.split("@")[0],
    },
  });

  // Create Stripe customer
  const customer = await customerAuth({
    email: newUser.email,
    name: newUser.name ?? newUser.email.split("@")[0],
    stripeCustomerId: newUser.stripeCustomerId,
  });

  if (customer.id) {
    await prisma.users.update({
      where: {
        id: newUser.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  // Set user session for automatic login
  await setUserSession(event, {
    // User data
    user: {
      id: newUser.id,
      name: newUser.name ?? newUser.email.split("@")[0],
      email: newUser.email,
      picture:
        newUser.picture ??
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    // Private data accessible only on server/ routes
    secure: {
      userId: newUser.id,
      stripeCustomerId: customer.id as string,
    },
    // Any extra fields for the session data
    loggedInAt: new Date(),
  });

  // Send welcome email
  try {
    await sendEmail(
      "welcome",
      newUser.email,
      newUser.name || newUser.email.split("@")[0],
      {},
      "pt"
    );
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't fail registration if email fails
  }

  // Return success
  return new Response("endpoints.success.userRegistered", {
    status: 201,
  });
});
