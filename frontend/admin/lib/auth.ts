import Cookies from "js-cookie";

const TOKEN_KEY = "admin_token";

// Cookie (not localStorage) so Next.js middleware can gate routes server-side.
// expires: 1/48 of a day = 30 min — matches backend ACCESS_TOKEN_EXPIRE_MINUTES.
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_KEY) ?? null;
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    sameSite: "strict",
    expires: 1 / 48,
    path: "/",
    // fixed at build time — production always requires HTTPS, so the token
    // can never be sent over plaintext behind a misconfigured proxy
    secure: process.env.NODE_ENV === "production",
  });
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
}
