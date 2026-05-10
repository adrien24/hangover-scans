import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth.types";

const url = import.meta.env.VITE_BACKEND_URL;

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(url + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Email ou mot de passe invalide");
  }

  return response.json();
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const response = await fetch(url + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Erreur lors de l'inscription");
  }

  return response.json();
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<{ message: string }> {
  const response = await fetch(url + "/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Erreur lors de l'envoi de l'email");
  }

  return response.json();
}

export async function getMe(token: string): Promise<User> {
  const response = await fetch(url + "/api/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Non authentifie");
  }

  return response.json();
}
