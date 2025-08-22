import { describe, it, expect, vi, beforeEach } from "vitest";
import { login } from "../../pages/login/login.functions";

// Mock do $fetch global do Nuxt
global.$fetch = vi.fn() as any;

describe("login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be able to login", async () => {
    // Given
    const email = "test@test.com";
    const password = "test";
    const mockResponse = new Response("success", { status: 200 });

    vi.mocked($fetch).mockResolvedValue(mockResponse);

    // When
    const response = await login(email, password);

    // Then
    expect($fetch).toHaveBeenCalledWith("/api/auth/", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("success");
  });

  it("should return error if fetch fails", async () => {
    // Given
    const email = "test@test.com";
    const password = "wrong-password";
    const mockErrorResponse = new Response("error", { status: 400 });

    vi.mocked($fetch).mockResolvedValue(mockErrorResponse);

    // When
    const response = await login(email, password);

    // Then
    expect($fetch).toHaveBeenCalledWith("/api/auth/", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("error");
  });
});
