export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID!,
    authority: process.env.NEXT_PUBLIC_MSAL_AUTHORITY!,
    redirectUri: process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI!,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage",
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"]
};