export type MessageRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id?: string;
  role: MessageRole;
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  stream?: boolean;
};

export type ChatErrorResponse = {
  error: {
    message: string;
    code?: string;
  };
};
