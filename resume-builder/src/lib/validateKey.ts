export type Provider = "claude" | "openai" | "gemini";

export function validateKeyFormat(
  provider: Provider,
  key: string,
): string | null {
  const trimmed = key.trim();
  if (!trimmed) return "API key is required";

  const patterns: Record<Provider, RegExp> = {
    claude: /^sk-ant-[a-zA-Z0-9\-_]{20,}$/,
    openai: /^sk-[a-zA-Z0-9]{20,}$/,
    gemini: /^AIza[a-zA-Z0-9\-_]{35,}$/,
  };

  if (!patterns[provider].test(trimmed)) {
    return `That doesn't look like a valid ${provider} API key`;
  }
  return null;
}

export async function liveValidateKey(
  provider: Provider,
  apiKey: string,
): Promise<{ valid: boolean; error?: string }> {
  try {
    switch (provider) {
      case "claude": {
        const res = await fetch("https://api.anthropic.com/v1/models", {
          headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        });
        if (res.status === 401) return { valid: false, error: "Invalid Claude API key" };
        return { valid: res.ok };
      }
      case "openai": {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (res.status === 401) return { valid: false, error: "Invalid OpenAI API key" };
        return { valid: res.ok };
      }
      case "gemini": {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        );
        if (res.status === 400 || res.status === 403)
          return { valid: false, error: "Invalid Gemini API key" };
        return { valid: res.ok };
      }
    }
  } catch {
    return { valid: false, error: "Could not reach provider to validate key" };
  }
}

