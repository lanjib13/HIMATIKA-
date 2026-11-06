import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: "/api/v1",
});

export function createAuthenticatedApiClient(accessToken: string) {
  return createClient<paths>({
    baseUrl: "/api/v1",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
