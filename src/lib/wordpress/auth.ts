import "server-only";

// Simple JWT Login plugin (installed on admin.jonahbruzzi.me) issues Bearer
// tokens for headless auth — WordPress core has no built-in way to log in
// from an external app, only browser-cookie sessions on its own domain.
const WORDPRESS_URL = process.env.WOOCOMMERCE_URL;
const SIMPLE_JWT_LOGIN_AUTH_CODE = process.env.SIMPLE_JWT_LOGIN_AUTH_CODE;

function requireSiteUrl(): string {
  if (!WORDPRESS_URL) {
    throw new Error("WOOCOMMERCE_URL is not configured");
  }
  return WORDPRESS_URL;
}

async function jwtLoginFetch<T>(
  path: string,
  body: Record<string, unknown>,
  method: "POST" | "PUT" = "POST"
): Promise<T> {
  const res = await fetch(`${requireSiteUrl()}/wp-json/simple-jwt-login/v1${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json?.data?.message || "Authentication request failed");
  }
  return json;
}

export interface WPUser {
  ID: string;
  user_login: string;
  user_email: string;
  display_name: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

function toAuthUser(user: WPUser, roles: string[] = []): AuthUser {
  return {
    id: Number(user.ID),
    email: user.user_email,
    name: user.display_name || user.user_email,
    roles,
  };
}

export async function login(email: string, password: string): Promise<string> {
  const result = await jwtLoginFetch<{ data: { jwt: string } }>("/auth", {
    email,
    password,
  });
  return result.data.jwt;
}

/**
 * Verifies a JWT's signature server-side and returns the WordPress user it
 * belongs to — never trust a client-supplied JWT's payload without this,
 * since anyone can craft a JWT-shaped string with an arbitrary user id.
 */
export async function validateToken(token: string): Promise<AuthUser | null> {
  try {
    const result = await jwtLoginFetch<{
      data: { user: WPUser; roles: string[] };
    }>("/auth/validate", { JWT: token });
    return toAuthUser(result.data.user, result.data.roles);
  } catch {
    return null;
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  await jwtLoginFetch("/user/reset_password", { email });
}

export async function confirmPasswordReset(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  await jwtLoginFetch(
    "/user/reset_password",
    { email, code, new_password: newPassword },
    "PUT"
  );
}

export async function register(
  email: string,
  password: string
): Promise<{ id: number }> {
  if (!SIMPLE_JWT_LOGIN_AUTH_CODE) {
    throw new Error("SIMPLE_JWT_LOGIN_AUTH_CODE is not configured");
  }
  const result = await jwtLoginFetch<{ id: string }>("/register", {
    email,
    password,
    AUTH_KEY: SIMPLE_JWT_LOGIN_AUTH_CODE,
  });
  return { id: Number(result.id) };
}
