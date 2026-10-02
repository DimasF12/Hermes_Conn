export type HermesRole = "user" | "assistant" | "system";

export type HermesMessage = {
  role: HermesRole;
  content: string;
};

export type HermesChatCompletionRequest = {
  messages: HermesMessage[];
  stream?: boolean;
  model?: string;
  temperature?: number;
};

export type HermesStreamDelta = {
  content?: string;
  role?: string;
};

export type HermesStreamChoice = {
  index?: number;
  delta?: HermesStreamDelta;
  finish_reason?: string | null;
};

export type HermesStreamChunk = {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: HermesStreamChoice[];
};

export type HermesApiError = {
  message: string;
  status?: number;
  code?: string;
};
