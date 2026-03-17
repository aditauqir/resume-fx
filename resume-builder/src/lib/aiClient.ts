import type { Provider } from "@/lib/validateKey";

type ClaudeMessageResponse = {
  content?: Array<{ text?: string }>;
  error?: { message?: string };
};

type OpenAIChatResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string };
};

type OllamaResponse = {
  response?: string;
  error?: string;
};

export async function callAI(
  provider: Provider,
  apiKey: string,
  prompt: string,
): Promise<string> {
  switch (provider) {
    case "claude":
      return callClaude(apiKey, prompt);
    case "openai":
      return callOpenAI(apiKey, prompt);
    case "gemini":
      return callGemini(apiKey, prompt);
    case "ollama":
      // For Ollama, apiKey is treated as the local model name.
      return callOllama(apiKey, prompt);
  }
}

async function callClaude(apiKey: string, prompt: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = (await res.json().catch(() => null)) as ClaudeMessageResponse | null;
  if (!res.ok) throw new Error(data?.error?.message ?? "Claude API error");
  return String(data?.content?.[0]?.text ?? "");
}

async function callOpenAI(apiKey: string, prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = (await res.json().catch(() => null)) as OpenAIChatResponse | null;
  if (!res.ok) throw new Error(data?.error?.message ?? "OpenAI API error");
  return String(data?.choices?.[0]?.message?.content ?? "");
}

async function callGemini(apiKey: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = (await res.json().catch(() => null)) as GeminiResponse | null;
  if (!res.ok) throw new Error(data?.error?.message ?? "Gemini API error");
  return String(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
}

async function callOllama(model: string, prompt: string) {
  const res = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false }),
  });
  const data = (await res.json().catch(() => null)) as OllamaResponse | null;
  if (!res.ok) throw new Error(data?.error ?? "Ollama API error");
  return String(data?.response ?? "");
}

