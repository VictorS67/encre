import type { ApiHandlers } from "./api";
import type { ServerHandlers } from "./server";
import type { StudioHandlers } from "./studio";

export interface Handlers extends ServerHandlers, ApiHandlers, StudioHandlers {}

export type HandlerFunctions = Handlers[keyof Handlers];
