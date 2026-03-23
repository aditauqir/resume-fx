AI Resume Fixer (ResumeFX)

This project is a Next.js app that turns an uploaded PDF/DOCX resume into a polished, template-driven one-page resume.

Core flow:
1. User uploads a resume (PDF or DOCX)
2. User selects an AI provider (Claude/OpenAI/Gemini/Ollama) and verifies their key/model name
3. The server extracts text from the upload
4. The server builds a prompt using an admin-configured prompt chain + LaTeX template + keyword list
5. The server calls the selected LLM to produce LaTeX
6. The server optionally compiles LaTeX to a downloadable PDF

## Repo structure

- `resume-builder/` : Next.js application (UI + server routes + resume generation)
- `resume-builder/src/app/api/resume/route.ts` : Main resume generation endpoint
- `resume-builder/src/lib/prompt.ts` : Prompt builder + fallback LaTeX template
- `resume-builder/src/lib/aiClient.ts` : Provider routing (Claude/OpenAI/Gemini/Ollama)
- `resume-builder/src/lib/parseFile.ts` : Extract text from PDF/DOCX

## Local development

1. Install dependencies:
   - `cd resume-builder`
   - `npm install`

2. Create environment file(s):
   - Copy `.env.example` from repo root into `resume-builder/.env.local` (or create your own `resume-builder/.env.local`)

3. Start dev server:
   - `npm run dev`

The app expects these environment variables (names are used by server code):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_LOGIN_EMAIL`
- `ADMIN_LOGIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_TTL_SECONDS` (optional; default is set in code)

Important security note:
- Never commit real API keys/secrets to git. Use `.env.local` locally and keep only `.env.example` in the repo.

## AI providers

The UI sends:
- `provider`: `claude | openai | gemini | ollama`
- `apiKey`:
  - For Claude/OpenAI/Gemini: your real API key
  - For Ollama: the local model name (for example `qwen2.5:7b` or `llama3.1:8b`)

## Output

The “Generate” endpoint can return:
- LaTeX only (`outputFormat=latex`)
- Compiled PDF, and for “PDF” the UI uses a hybrid response that includes both LaTeX and a base64-encoded PDF (`outputFormat=hybrid`)

## Contributing / Admin configuration

Admin-only endpoints allow updating:
- the LaTeX template (`admin_template`)
- the prompt chain steps (`admin_prompts`)
- the keyword list (`admin_keywords`)

This admin config drives the actual structure and wording constraints applied to the LLM when generating your resume.

