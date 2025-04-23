import stripe from "stripe";

const controllerStripe = new stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const getCustomer = async (customerId: string) => {
  try {
    const customer = await controllerStripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error("Error retrieving customer:", error);
    throw error;
  }
};

const getCustomerByEmail = async (email: string) => {
  try {
    const customers = await controllerStripe.customers.list({
      email,
    });
    return customers.data[0];
  } catch (error) {
    console.error("Error retrieving customer by email:", error);
    throw error;
  }
};

export const createCustomer = async (email: string, name: string) => {
  try {
    const customer = await controllerStripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const customerAuth = async (user: {
  stripeCustomerId: string | null;
  email: string;
  name: string;
}) => {
  // Check if user exists in stripe
  const stripeCustomer = await getCustomerByEmail(user.email);
  if (stripeCustomer) {
    // If exists return customer
    return stripeCustomer;
  }

  if (user.stripeCustomerId) {
    // If exists return customer
    const customer = await getCustomer(user.stripeCustomerId);
    return customer;
  }

  // If not exists create customer
  const customer = await createCustomer(user.email, user.name);
  return customer;
};
