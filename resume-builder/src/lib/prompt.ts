const FALLBACK_TEMPLATE = String.raw`\documentclass[11pt]{article}
\usepackage[margin=1in]{geometry}
\usepackage{enumitem}
\begin{document}

\section*{Name}
<<NAME>>

\section*{Summary}
<<SUMMARY>>

\section*{Experience}
\begin{itemize}[leftmargin=*]
<<EXPERIENCE>>
\end{itemize}

\section*{Education}
<<EDUCATION>>

\section*{Skills}
<<SKILLS>>

\end{document}`;

export function buildPrompt(resumeText: string, steps: string[], latexTemplate: string) {
  const chain = steps.map((s, i) => `Step ${i + 1}: ${s}`).join("\n");
  const safeTemplate = latexTemplate.trim() ? latexTemplate : FALLBACK_TEMPLATE;

  return `
You are a professional resume writer. Follow these steps in order:

${chain}

Use this exact LaTeX template structure for your output:
\`\`\`
${safeTemplate}
\`\`\`

Here is the original resume text:
---
${resumeText}
---

Return ONLY valid, compilable LaTeX code. No explanation, no markdown fences, no preamble.
`.trim();
}

