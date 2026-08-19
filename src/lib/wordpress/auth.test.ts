import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// auth.ts imports "server-only" at module scope, whose default export
// (outside the "react-server" condition Vitest doesn't set) throws
// unconditionally — stub it so the module under test can load at all.
vi.mock("server-only", () => ({}));

const fetchMock = vi.fn();

function setEnv(vars: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) };
}

// auth.ts reads WOOCOMMERCE_URL / SIMPLE_JWT_LOGIN_AUTH_CODE into
// module-scope consts at import time, so each scenario needs a fresh
// module instance imported *after* the env vars for that scenario are set.
async function importAuth(env: {
  url?: string;
  authCode?: string;
} = {}) {
  vi.resetModules();
  setEnv({
    WOOCOMMERCE_URL: env.url,
    SIMPLE_JWT_LOGIN_AUTH_CODE: env.authCode,
  });
  return import("./auth");
}

const SITE_URL = "https://admin.jonahbruzzi.me";

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  setEnv({ WOOCOMMERCE_URL: undefined, SIMPLE_JWT_LOGIN_AUTH_CODE: undefined });
});

describe("login", () => {
  it("POSTs credentials to the simple-jwt-login /auth endpoint and returns the JWT", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: true, data: { jwt: "signed.jwt.token" } })
    );
    const { login } = await importAuth({ url: SITE_URL });

    const jwt = await login("cliente@example.com", "hunter2");

    expect(jwt).toBe("signed.jwt.token");
    expect(fetchMock).toHaveBeenCalledWith(
      `${SITE_URL}/wp-json/simple-jwt-login/v1/auth`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "cliente@example.com",
          password: "hunter2",
        }),
        cache: "no-store",
      }
    );
  });

  it("throws the WordPress error message when the response is not ok", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: { message: "Credenciales inválidas" } }, false)
    );
    const { login } = await importAuth({ url: SITE_URL });

    await expect(login("a@a.com", "wrong")).rejects.toThrow(
      "Credenciales inválidas"
    );
  });

  it("throws a generic message when the response has no error detail", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, false));
    const { login } = await importAuth({ url: SITE_URL });

    await expect(login("a@a.com", "wrong")).rejects.toThrow(
      "Authentication request failed"
    );
  });

  it("throws when the response is ok but success:false is embedded in the body", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: false, data: { message: "Cuenta bloqueada" } })
    );
    const { login } = await importAuth({ url: SITE_URL });

    await expect(login("a@a.com", "pw")).rejects.toThrow("Cuenta bloqueada");
  });

  it("rejects without hitting the network when WOOCOMMERCE_URL is not configured", async () => {
    const { login } = await importAuth({ url: undefined });

    await expect(login("a@a.com", "pw")).rejects.toThrow(
      "WOOCOMMERCE_URL is not configured"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("validateToken", () => {
  it("returns the mapped AuthUser for a valid token", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          user: {
            ID: "42",
            user_login: "cliente",
            user_email: "cliente@example.com",
            display_name: "Cliente Uno",
          },
          roles: ["customer"],
        },
      })
    );
    const { validateToken } = await importAuth({ url: SITE_URL });

    const user = await validateToken("some.jwt.token");

    expect(user).toEqual({
      id: 42,
      email: "cliente@example.com",
      name: "Cliente Uno",
      roles: ["customer"],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${SITE_URL}/wp-json/simple-jwt-login/v1/auth/validate`,
      expect.objectContaining({
        body: JSON.stringify({ JWT: "some.jwt.token" }),
      })
    );
  });

  it("falls back to the email as display name when display_name is empty", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          user: {
            ID: "7",
            user_login: "sin-nombre",
            user_email: "sin-nombre@example.com",
            display_name: "",
          },
          roles: [],
        },
      })
    );
    const { validateToken } = await importAuth({ url: SITE_URL });

    const user = await validateToken("token");

    expect(user?.name).toBe("sin-nombre@example.com");
    expect(user?.roles).toEqual([]);
  });

  it("returns null instead of throwing when the token is rejected by WordPress", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: { message: "Invalid JWT" } }, false)
    );
    const { validateToken } = await importAuth({ url: SITE_URL });

    await expect(validateToken("bad.token")).resolves.toBeNull();
  });

  it("returns null instead of throwing on a network failure", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const { validateToken } = await importAuth({ url: SITE_URL });

    await expect(validateToken("token")).resolves.toBeNull();
  });

  it("returns null (not a thrown config error) when WOOCOMMERCE_URL is missing — indistinguishable from a bad token", async () => {
    const { validateToken } = await importAuth({ url: undefined });

    await expect(validateToken("token")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("requestPasswordReset", () => {
  it("POSTs the email to /user/reset_password", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    const { requestPasswordReset } = await importAuth({ url: SITE_URL });

    await requestPasswordReset("cliente@example.com");

    expect(fetchMock).toHaveBeenCalledWith(
      `${SITE_URL}/wp-json/simple-jwt-login/v1/user/reset_password`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "cliente@example.com" }),
      })
    );
  });
});

describe("confirmPasswordReset", () => {
  it("PUTs email, code and new_password to /user/reset_password", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true }));
    const { confirmPasswordReset } = await importAuth({ url: SITE_URL });

    await confirmPasswordReset("cliente@example.com", "123456", "newPass1");

    expect(fetchMock).toHaveBeenCalledWith(
      `${SITE_URL}/wp-json/simple-jwt-login/v1/user/reset_password`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          email: "cliente@example.com",
          code: "123456",
          new_password: "newPass1",
        }),
      })
    );
  });
});

describe("register", () => {
  it("includes the server-side AUTH_KEY and returns the numeric id", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, id: "99" }));
    const { register } = await importAuth({
      url: SITE_URL,
      authCode: "secret-auth-code",
    });

    const result = await register("nuevo@example.com", "pw123456");

    expect(result).toEqual({ id: 99 });
    const [, requestInit] = fetchMock.mock.calls[0];
    expect(JSON.parse(requestInit.body)).toEqual({
      email: "nuevo@example.com",
      password: "pw123456",
      AUTH_KEY: "secret-auth-code",
    });
  });

  it("rejects without hitting the network when SIMPLE_JWT_LOGIN_AUTH_CODE is not configured", async () => {
    const { register } = await importAuth({
      url: SITE_URL,
      authCode: undefined,
    });

    await expect(register("a@a.com", "pw")).rejects.toThrow(
      "SIMPLE_JWT_LOGIN_AUTH_CODE is not configured"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
