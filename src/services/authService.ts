import {
  login as wpLogin,
  register as wpRegister,
  validateToken,
  requestPasswordReset,
  confirmPasswordReset,
  type AuthUser,
} from "@lib/wordpress/auth";
import {
  getCustomer,
  updateCustomer,
  type CustomerUpdateInput,
} from "@lib/woocommerce/customers";

// WordPress's display_name doesn't update when WooCommerce sets
// first_name/last_name on the customer record — combine them here instead
// of trusting the JWT plugin's display_name, which defaults to the email.
async function withCustomerName(user: AuthUser): Promise<AuthUser> {
  const customer = await getCustomer(user.id);
  const fullName = [customer?.first_name, customer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName ? { ...user, name: fullName } : user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const token = await wpLogin(email, password);
  const user = await validateToken(token);
  if (!user) {
    throw new Error("Login succeeded but the token could not be verified");
  }
  return { token, user: await withCustomerName(user) };
}

export async function registerUser(
  email: string,
  password: string,
  profile: CustomerUpdateInput
): Promise<{ token: string; user: AuthUser }> {
  const { id } = await wpRegister(email, password);
  if (profile.firstName || profile.lastName || profile.phone || profile.address) {
    await updateCustomer(id, profile);
  }
  return loginUser(email, password);
}

export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  const user = await validateToken(token);
  return user ? withCustomerName(user) : null;
}

export async function updateProfile(
  token: string,
  input: CustomerUpdateInput
): Promise<AuthUser | null> {
  const user = await validateToken(token);
  if (!user) return null;
  await updateCustomer(user.id, input);
  const updated = await validateToken(token);
  return updated ? withCustomerName(updated) : null;
}

export async function forgotPassword(email: string): Promise<void> {
  await requestPasswordReset(email);
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  await confirmPasswordReset(email, code, newPassword);
}

export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // Re-authenticate with the current password as proof of ownership before
  // allowing the change — a valid JWT alone isn't sufficient here since the
  // whole point of this flow is confirming the user still knows their
  // current password.
  const { user } = await loginUser(email, currentPassword);
  await updateCustomer(user.id, { password: newPassword });
}
