import { createApp } from "../../server/app";
import { ApiHandlers } from ".";

export const app = createApp<ApiHandlers>();

app.method("api/test", async function () {
  return "api/test";
});
