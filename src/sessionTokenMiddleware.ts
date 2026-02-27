import { getSessionToken } from "@mittwald/ext-bridge/browser";
import { Middleware } from "openapi-fetch";

export const sessionTokenMiddleware: Middleware = {
  async onRequest({ request }) {
    const sessionToken = await getSessionToken();
    request.headers.set("Session-Token", sessionToken);
    return request;
  },
};
