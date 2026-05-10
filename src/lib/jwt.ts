import type { User } from "@/types/auth.types";

interface JwtPayload {
  userId: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  iat: number;
  exp: number;
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return atob(padded + padding);
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

export function isJwtExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function userFromJwt(token: string): User | null {
  const payload = decodeJwt(token);
  if (!payload || isJwtExpired(payload)) return null;
  return {
    id: payload.userId,
    username: payload.username,
    email: payload.email,
    avatarUrl: payload.avatarUrl ?? undefined,
    createdAt: "",
  };
}
