import { restApiFetch } from "./client";

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
}

interface WCCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  billing: { phone: string; address_1: string };
}

function toWCPayload(input: CustomerUpdateInput) {
  const payload: Record<string, unknown> = {};
  if (input.firstName !== undefined) payload.first_name = input.firstName;
  if (input.lastName !== undefined) payload.last_name = input.lastName;
  if (input.email !== undefined) payload.email = input.email;
  if (input.password !== undefined) payload.password = input.password;
  if (input.phone !== undefined || input.address !== undefined) {
    payload.billing = {
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.address !== undefined ? { address_1: input.address } : {}),
    };
  }
  return payload;
}

export async function getCustomer(id: number): Promise<WCCustomer | null> {
  try {
    return await restApiFetch<WCCustomer>(`/customers/${id}`);
  } catch {
    return null;
  }
}

export async function updateCustomer(
  id: number,
  input: CustomerUpdateInput
): Promise<WCCustomer> {
  return restApiFetch<WCCustomer>(`/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toWCPayload(input)),
  });
}
