import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const SALT_ROUNDS = 10; // You can adjust the number of rounds as needed
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const checkPasswordHash = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
