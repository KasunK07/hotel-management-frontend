import { apiRequest } from "../../shared/api/http";
import type { BusinessRegistrationValues } from "../schemas/auth-schemas";

export interface Session {
  token: string;
  business_id: string;
  owner_name: string;
}

export interface RegistrationResult {
  business_id: string;
  verification_email: string;
  verification_url?: string;
}

export async function registerBusiness(values: BusinessRegistrationValues) {
  return apiRequest<RegistrationResult>("/business/registration", {
    method: "POST",
    body: JSON.stringify({
      business: {
        registered_name: values.businessName,
        registration_number: values.registrationNumber,
        email: values.businessEmail,
        phone: values.businessPhone,
        registered_address: values.address,
        city: values.city,
        postal_code: values.postalCode,
      },
      owner: {
        full_name: values.ownerName,
        email: values.ownerEmail || values.businessEmail,
        phone: values.ownerPhone || values.businessEmail,
      },
      security: { temporary_password: values.password },
    }),
  });
}

export async function verifyEmail(token: string) {
  return apiRequest<undefined>("/business/verification/confirm", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function setPassword(token: string, password: string) {
  return apiRequest<Session>("/business/password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function login(email: string, password: string) {
  return apiRequest<Session>("/business/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  await apiRequest<void>("/business/logout", { method: "POST" });
}

const SESSION_KEY = "meridian-session";

export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? (JSON.parse(value) as Session) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
