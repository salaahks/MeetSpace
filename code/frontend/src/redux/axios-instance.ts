import axios from "axios";
import { msalInstance } from "@/providers/auth-provider";
import { loginRequest } from "@/utils/msalConfig";
import { ROOT_URL } from "./endpoints";

const axiosInstance = axios.create({
  baseURL: ROOT_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const account =
        msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];

      if (account) {
        const response = await msalInstance.acquireTokenSilent({
          scopes: loginRequest.scopes,
          account,
        });
        config.headers.Authorization = `Bearer ${response.idToken}`;
      }
    } catch (error) {
      console.error("Erreur token MSAL:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
