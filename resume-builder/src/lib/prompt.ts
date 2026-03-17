const FALLBACK_TEMPLATE = String.raw`
% Jake's Resume-style template with placeholders
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]} 
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

%----------HEADING----------
\begin{center}
    \textbf{\Huge \scshape <<NAME>>} \\ \vspace{1pt}
    \small <<PHONE>> $|$ \href{mailto:<<EMAIL>>}{\underline{<<EMAIL>>}} $|$ 
    \href{<<LINKEDIN_URL>>}{\underline{<<LINKEDIN_TEXT>>}} $|$
    \href{<<GITHUB_URL>>}{\underline{<<GITHUB_TEXT>>}}
\end{center}

%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
<<EDUCATION_BLOCKS>>
\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\section{Experience}
\resumeSubHeadingListStart
<<EXPERIENCE_BLOCKS>>
\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\section{Projects}
\resumeSubHeadingListStart
<<PROJECT_BLOCKS>>
\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\section{Technical Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
  \small{\item{
    <<SKILLS_BLOCK>>
  }}
\end{itemize}

\end{document}
`;

export function buildPrompt(
  resumeText: string,
  steps: string[],
  latexTemplate: string,
  keywords: string[] = [],
) {
  const chain = steps.map((s, i) => `Step ${i + 1}: ${s}`).join("\n");
  const keywordLine = keywords.length ? keywords.join(", ") : "";
  const safeTemplate = latexTemplate.trim() ? latexTemplate : FALLBACK_TEMPLATE;

  return `
You are a professional resume writer.

Use the extracted resume text as the only source of truth for candidate facts.
Use the admin prompt chain in order.
If keywords are provided, subtly reinforce them where they are truthful and relevant.
Use the provided LaTeX template as the exact output structure.
If a field or section is missing, leave it blank or use concise defaults.
Do not invent facts.
Return only valid LaTeX.

Admin prompt chain:

${chain}

Keyword focus:
${keywordLine || "None provided"}

LaTeX template to follow exactly:
\`\`\`
${safeTemplate}
\`\`\`

Extracted resume text:
---
${resumeText}
---

Return only valid, compilable LaTeX code. No explanation, no markdown fences, no preamble.
`.trim();
}

