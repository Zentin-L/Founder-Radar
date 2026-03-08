# Agent Verification Workflow

After writing or updating code, follow this workflow:

1. **Build** — `npm run build` (ensures no compile/TypeScript errors)
2. **Verify** — `npm run verify` (screenshot + content checks; requires dev server on port 3000)

Ensure a dev server is running (`npm run dev`) before `npm run verify`.

If verification fails or the screenshot shows issues, fix them before proceeding to the next step.
