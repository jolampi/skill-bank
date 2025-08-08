import { CreateClientConfig } from "./generated/client/client.gen";

export const createClientConfig: CreateClientConfig = (config) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    return { ...config };
  }

  return {
    ...config,
    baseUrl,
  };
};
