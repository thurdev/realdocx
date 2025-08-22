export const login = async (
  email: string,
  password: string
): Promise<Response> => {
  return $fetch<Response>("/api/auth/", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
  });
};
