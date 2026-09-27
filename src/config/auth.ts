export type SocialProvider = "google";

export const AUTH_ROUTES = {
  login: "/account/login",
  register: "/account/register",
  dashboard: "/account",
} as const;
