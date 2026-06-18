# Contributing

Thanks for your interest in improving Governance Studio (AI Data Governance).

## Before you start

- Read [public.md](./public.md).
- Keep documentation grounded in the actual data model, scoring logic and screens in this repository.
- Prefer small, reviewable pull requests.

## Local setup

```bash
npm install
npm run dev
```

The Vite dev server is configured for port `5311`.

## Project conventions

- React 19 + TypeScript + Vite 6 + Tailwind CSS 4, with shadcn-style UI primitives under `src/components/ui`.
- All domain data lives in `src/data` (domains, controls, questions, policies, frameworks and the Northstar seed).
- Computation (maturity, control coverage, evidence confidence, residual risk, prioritisation) lives in `src/lib/scoring.ts`.
- State is held in a single Zustand store at `src/store/useGovernanceStore.ts`; every screen reads from it.
- Keep the five governance indicators separate — never combine them into one merged "compliance score".
- Do not reproduce proprietary standards verbatim. Write original controls and map them to public references.

## Checks

```bash
npm run lint
npm run build
```

Please make sure both pass before opening a pull request.
