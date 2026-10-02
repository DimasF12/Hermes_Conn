import { NextRequest } from "next/server";
import { sendHermesChatRequest, HermesClientError } from "@/lib/hermes/client";
import { streamHermesResponse } from "@/lib/hermes/stream";
import type { ChatRequest } from "@/lib/chat/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = (await request.json()) as ChatRequest;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json(
        { error: { message: "Invalid request: 'messages' array is required." } },
        { status: 400 }
      );
    }

    const hermesResponse = await sendHermesChatRequest({
      messages: body.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    const stream = streamHermesResponse(hermesResponse);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    if (error instanceof HermesClientError) {
      return Response.json(
        { error: { message: error.message } },
        { status: error.statusCode ?? 500 }
      );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return Response.json({ error: { message } }, { status: 500 });
  }
}
