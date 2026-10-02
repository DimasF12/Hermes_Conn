import type { HermesStreamChunk } from "./types";

/**
 * Parses a single SSE line or chunk from the Hermes API stream.
 * Returns the extracted content text, or null if the event is a delimiter / empty / [DONE].
 */
export function parseHermesEvent(line: string): string | null {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith(":")) {
    return null;
  }

  let dataPayload = trimmed;
  if (trimmed.startsWith("data:")) {
    dataPayload = trimmed.slice(5).trim();
  }

  if (dataPayload === "[DONE]") {
    return null;
  }

  try {
    const parsed = JSON.parse(dataPayload) as HermesStreamChunk & {
      content?: string;
      text?: string;
    };

    if (parsed.choices && parsed.choices.length > 0) {
      const deltaContent = parsed.choices[0]?.delta?.content;
      if (typeof deltaContent === "string") {
        return deltaContent;
      }
    }

    if (typeof parsed.content === "string") {
      return parsed.content;
    }

    if (typeof parsed.text === "string") {
      return parsed.text;
    }

    return null;
  } catch {
    // If not JSON, but has text content (fallback for plain text SSE)
    return dataPayload.length > 0 ? dataPayload : null;
  }
}

/**
 * Transforms a Hermes fetch Response stream into a ReadableStream of decoded text delta strings.
 */
export function streamHermesResponse(
  response: Response,
  onComplete?: () => void
): ReadableStream<Uint8Array> {
  const body = response.body;
  if (!body) {
    throw new Error("Hermes response body is empty or unreadable.");
  }

  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            const remainingLines = buffer.split("\n");
            for (const line of remainingLines) {
              const text = parseHermesEvent(line);
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
          }
          console.log("[Hermes] Stream completed");
          if (onComplete) onComplete();
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in buffer
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const text = parseHermesEvent(line);
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        console.error("[Hermes] Stream read error:", err);
        controller.error(err);
      }
    },
    cancel() {
      console.log("[Hermes] Stream cancelled by client");
      reader.cancel();
    },
  });
}
