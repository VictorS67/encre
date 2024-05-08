import { SecretFields } from "../../../../../load/keymap.js";
import {
  AsyncCaller,
  AsyncCallerParams,
} from "../../../../../utils/asyncCaller.js";
import { Context } from "../../../../input/load/docs/context.js";
import { BaseTextRetriever, BaseTextRetrieverParams } from "../../base.js";
import { RemoteRetrieverAuth, RemoteRetrieverValues } from "./index.js";

export interface RemoteRetrieverParams
  extends AsyncCallerParams,
    BaseTextRetrieverParams {
  url: string;

  auth: RemoteRetrieverAuth;
}

export abstract class RemoteRetriever
  extends BaseTextRetriever
  implements RemoteRetrieverParams
{
  get _secrets(): SecretFields | undefined {
    return {
      "auth.bearer": "REMOTE_RETRIEVER_AUTH_BEARER",
    };
  }

  url: string;

  auth: RemoteRetrieverAuth;

  headers: Record<string, string>;

  /**
   * The async caller should be used by subclasses to make any async calls,
   * which will thus benefit from the concurrency and retry logic.
   */
  caller: AsyncCaller;

  constructor(fields: RemoteRetrieverParams) {
    super(fields);

    const { url, auth, ...asyncCallerParams } = fields;

    this.url = url;
    this.auth = auth;
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(this.auth && this.auth.bearer
        ? { Authorization: `Bearer ${this.auth.bearer}` }
        : {}),
    };

    this.caller = new AsyncCaller(asyncCallerParams);
  }

  abstract createJSONBody(query: string): RemoteRetrieverValues;

  abstract processJSONResponse(json: RemoteRetrieverValues): Context[];

  async _retrieve(
    query: string,
    options: this["SerializedCallOptions"]
  ): Promise<Context[]> {
    const body = this.createJSONBody(query);

    const response = await this.caller.call(() =>
      fetch(this.url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      })
    );

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve remotely from ${this.url}: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();

    return this.processJSONResponse(json as RemoteRetrieverValues);
  }
}
