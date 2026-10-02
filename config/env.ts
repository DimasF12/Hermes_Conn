export const env = {
  HERMES_API_URL: (process.env.HERMES_API_URL || "http://127.0.0.1:8000/v1").replace(/\/+$/, ""),
  HERMES_API_KEY: process.env.HERMES_API_KEY || "",
} as const;
