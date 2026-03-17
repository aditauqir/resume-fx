export function buildPrompt(resumeText: string, steps: string[], latexTemplate: string) {
  const chain = steps.map((s, i) => `Step ${i + 1}: ${s}`).join("\n");

  return `
You are a professional resume writer. Follow these steps in order:

${chain}

Use this exact LaTeX template structure for your output:
\`\`\`
${latexTemplate}
\`\`\`

Here is the original resume text:
---
${resumeText}
---

Return ONLY valid, compilable LaTeX code. No explanation, no markdown fences, no preamble.
`.trim();
}

