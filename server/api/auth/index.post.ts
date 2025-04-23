import { AuthPostRequest } from "./auth";
import { checkPasswordHash } from "@/helpers/auth";
import prisma from "~/lib/prisma";
import { customerAuth } from "~/server/utils/stripe";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<AuthPostRequest>(event);

  // Validate email and password
  if (!email || !password) {
    return new Response("endpoints.errors.auth.missingFields", {
      status: 400,
    });
  }
  // Check if user exists
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  // If user exists, throw an error
  if (!user) {
    return new Response("endpoints.errors.auth.userNotFound", {
      status: 400,
    });
  }

  // Check if password is correct
  const passwordMatch = await checkPasswordHash(password, user.password);

  // If password is incorrect, throw an error
  if (!passwordMatch) {
    return new Response("endpoints.errors.auth.userNotFound", {
      status: 400,
    });
  }

  const customer = await customerAuth({
    email: user.email,
    name: user.name ?? user.email.split("@")[0],
    stripeCustomerId: user.stripeCustomerId,
  });

  if (customer.id) {
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  await setUserSession(event, {
    // User data
    user: {
      id: user.id,
      name: user.name ?? user.email.split("@")[0],
      email: user.email,
      picture:
        user.picture ??
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    // Private data accessible only on server/ routes
    secure: {
      userId: user.id,
      stripeCustomerId: user.stripeCustomerId as string,
    },
    // Any extra fields for the session data
    loggedInAt: new Date(),
  });

  // Return success
  return new Response("endpoints.success.userAuthenticated", {
    status: 201,
  });
});
