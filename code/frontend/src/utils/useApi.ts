"use client";

import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "./msalConfig";
import { API_BASE_URL } from "./constants";

export function useApi() {
  const { instance } = useMsal();

  const getToken = async (): Promise<string> => {
    const account = instance.getActiveAccount();
    if (!account) {
      await instance.acquireTokenRedirect(loginRequest);
      throw new Error("Aucun utilisateur connecté, redirection...");
    }

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(loginRequest);
        throw new Error("Session expirée, redirection vers login...");
      }
      throw error;
    }
  };

  const callApi = async (url: string, options?: RequestInit) => {
    const token = await getToken();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const result = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options?.headers,
        },
      });

      if (result.status === 401) {
        await instance.acquireTokenRedirect(loginRequest);
        throw new Error("Token rejeté, redirection...");
      }

      if (!result.ok) {
        const errorBody = await result.text();
        throw new Error(`Erreur API ${result.status}: ${errorBody}`);
      }

      return result.json();
    } finally {
      clearTimeout(timeout);
    }
  };

  return { callApi };
}