import { env } from "@/config/env";
import type { HermesChatCompletionRequest } from "./types";

export class HermesClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly rawError?: unknown
  ) {
    super(message);
    this.name = "HermesClientError";
  }
}

/**
 * Creates and sends a chat completion request to the Hermes Agent backend.
 */
export async function sendHermesChatRequest(
  payload: HermesChatCompletionRequest,
  signal?: AbortSignal
): Promise<Response> {
  const targetUrl = `${env.HERMES_API_URL}/chat/completions`;

  console.log(`[Hermes] Request started: ${targetUrl}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream, application/json",
  };

  if (env.HERMES_API_KEY) {
    headers["Authorization"] = `Bearer ${env.HERMES_API_KEY}`;
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: payload.messages,
        stream: payload.stream ?? true,
        ...(payload.model ? { model: payload.model } : {}),
        ...(payload.temperature !== undefined ? { temperature: payload.temperature } : {}),
      }),
      signal,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[Hermes] Request failed: ${err.message}`);

    if (err.name === "AbortError") {
      throw err;
    }

    throw new HermesClientError(
      "Unable to connect to Hermes Agent. Please verify that the Hermes service is active.",
      503,
      err
    );
  }

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text().catch(() => "");
    }

    console.error(
      `[Hermes] Request failed with status ${response.status}: ${errorDetail}`
    );

    const userMessage =
      response.status >= 500
        ? "Hermes Agent encountered an internal error. Please try again later."
        : `Hermes Agent rejected the request (${response.status}): ${errorDetail || "Invalid request"}`;

    throw new HermesClientError(userMessage, response.status, errorDetail);
  }

  console.log("[Hermes] Stream connected");
  return response;
}
