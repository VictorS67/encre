import { createApp } from "../../server/app";
import { StudioHandlers } from ".";

export const app = createApp<StudioHandlers>();

app.method("test", async function () {
  return "test";
});

app.method("test2", async function ({ msg }) {
  return msg;
});
