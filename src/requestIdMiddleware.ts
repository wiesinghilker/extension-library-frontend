import { Middleware } from "openapi-fetch";

export const requestIdMiddleware: Middleware = {
  onRequest({ request }) {
    const requestId: string = crypto.randomUUID();
    request.headers.set("x-request-id", requestId);
    return request;
  },
};
