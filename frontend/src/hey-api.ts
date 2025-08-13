import { CreateClientConfig } from "./generated/client/client.gen";

export const createClientConfig: CreateClientConfig = (config) => {
  const baseUrl = process.env.BACKEND_URL;

  if (!baseUrl) {
    return { ...config };
  }

  return {
    ...config,
    baseUrl,
  };
};
