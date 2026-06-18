# AI Data Governance — Governance Studio

## Project Name

Governance Studio (AI Data Governance)

## What it does

Governance Studio is an interactive B2B web application that helps organisations understand, assess,
design, implement and operate integrated **Data Governance** and **AI Governance** frameworks. It is an
adaptive governance workspace rather than a static checklist: it educates users, works out which
requirements apply, assesses maturity and risk, generates a tailored operating model, and tracks
controls, evidence, decisions, incidents and a prioritised roadmap.

It ships fully working in **demo mode** with a realistic seeded organisation, **Northstar Group**, so
every dashboard and workflow is immediately meaningful — no backend or LLM required.

## Why it exists

Organisations often treat AI Governance as a replacement for Data Governance, or collapse maturity,
compliance, evidence and risk into a single misleading score. Governance Studio models the two
disciplines as connected layers (AI references existing data assets, vendors and controls rather than
duplicating them) and reports **five separate indicators**, each with a transparent definition.

This project is part of a small series of related apps — `ai-maturity`, `ai-orchestration` and
`ai-business-roadmap` — and shares their architecture, structure and `FloatingNav` cross-links.

## Features

- **Four modes**: Learn, Assess, Build and Operate, surfaced through a persistent left sidebar.
- **Adaptive onboarding** wizard (one question per screen) that tailors the framework to the org profile.
- **Executive dashboard** with five separate indicators (capability maturity, control implementation,
  evidence confidence, residual risk, assessment completeness) — never one merged score.
- **Governance Health Map**: a signature radar + matrix view across all 14 domains with a metric switch,
  domain drill-down drawer and a domain dependency view.
- **Adaptive assessment engine** with conditional questions driven by the organisation's data and AI profile.
- **Control library** of 100+ original controls mapped to public framework references, with editable status.
- **Data Inventory** and **AI Inventory** with classification, lifecycle gates, regulatory-classification
  assumptions, agent guardrails and operational-readiness checks for high-risk AI.
- **Risk register** with 13 impact dimensions, residual-risk scoring, treatments and risk acceptance.
- **Policy library**, **evidence register** (with evidence-confidence scoring), **roadmap** (Kanban + table,
  transparent prioritisation), **decisions & exceptions**, **incidents**, **vendors**, **metrics & reporting**,
  **audit & assurance** (with an immutable audit trail) and a **framework library**.
- **Framework versioning** — create a new version without overwriting previous ones.
- **Exports** to CSV, JSON and printable PDF, each with scope, framework version and a disclaimer.

## How it works

- `src/data/domains.ts` — the 14 governance domains, capabilities, maturity model and framework reference packs.
- `src/data/controls.ts` — 100+ original controls expanded from a compact, typed catalogue.
- `src/data/questions.ts` — the assessment question bank with applicability rules.
- `src/data/policies.ts` and `src/data/learn.ts` — seeded policies and educational content.
- `src/data/seed.ts` / `seed-records.ts` — the Northstar Group demo data (assets, AI systems, vendors,
  risks, roadmap actions, evidence, exceptions, incidents, decisions, findings, framework versions).
- `src/lib/scoring.ts` — maturity, control coverage, evidence confidence, residual risk and roadmap
  prioritisation, with human-readable explanations of every indicator.
- `src/lib/profile.ts` — derives boolean applicability flags from the organisation profile for conditional logic.
- `src/store/useGovernanceStore.ts` — a single Zustand store (persisted to local storage) that all screens read from.
- The app is entirely client-side. A Supabase/Postgres data model is described in the specification; this
  first version runs in demo mode so it works without any backend or LLM.

## Tech stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Radix UI / shadcn-style UI components
- React Router 7
- Zustand
- Recharts
- date-fns
- Lucide React

## Project structure

```text
src/
├── components/
│   ├── charts/       # radar, heatmaps, distribution bars
│   ├── common/       # PageHeader, StatCard, DataTable, FilterBar, Field, StatusBadge, Icon
│   ├── health/       # Health Map domain detail and dependency view
│   ├── layout/       # AppShell, Sidebar, TopBar, GlobalSearch, nav config
│   ├── ui/           # shared UI primitives (button, card, tabs, badge, drawer, select, …)
│   └── FloatingNav.tsx
├── data/             # domains, controls, questions, policies, learn, Northstar seed
├── lib/              # scoring, profile flags, labels, formatting, exports, heat colours
├── pages/            # one page per sidebar item (21 routes)
├── store/            # Zustand governance store
├── types/            # the shared domain model
└── main.tsx
```

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The Vite dev server is configured for port `5311`.

### Build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Configuration

- No project-specific environment variables are required for demo mode.
- The app uses Vite's `BASE_URL` for routing. In production the configured base path is `/demo/ai-data-governance/`.

## Usage

1. Start on the **Overview** dashboard to see the five governance indicators and attention items.
2. Open the **Governance Health Map** to inspect maturity, control coverage, evidence and risk by domain.
3. Use **Assessments** to record maturity (questions adapt to your profile; high ratings ask for evidence).
4. Explore the **Control Library**, **Data/AI Inventory**, **Risks**, **Policies**, **Evidence** and **Roadmap**.
5. Record **decisions**, **exceptions** and **incidents**; check **Audit** readiness and the immutable trail.
6. In **Settings**, create a new framework version without overwriting the previous one, or reset the demo.

## Important product notes

- Governance Studio does not guarantee legal or regulatory compliance.
- Maturity, control implementation, evidence confidence and residual risk are reported separately.
- Regulatory AI classifications are recorded with their assumptions and flagged for qualified legal review.
- Standards are referenced and mapped, never reproduced verbatim.

## Contributing

Contributions are welcome. Please review [CONTRIBUTING.md](./CONTRIBUTING.md) and [public.md](./public.md)
before opening a pull request.

## License

This project is available under the [MIT License](./LICENSE).
