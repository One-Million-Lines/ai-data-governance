import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  OrganisationProfile,
  DataAsset,
  AiSystem,
  Vendor,
  Risk,
  Action,
  Evidence,
  Exception,
  Incident,
  Decision,
  AuditFinding,
  FrameworkVersion,
  AssessmentResponse,
  AssessmentAnswer,
  Control,
  Policy,
  AuditLogEntry,
  GovernanceScores,
  ID,
} from "@/types";
import {
  NORTHSTAR_PROFILE,
  DATA_ASSETS,
  AI_SYSTEMS,
  VENDORS,
  RISKS,
  ACTIONS,
  EVIDENCE,
  EXCEPTIONS,
  INCIDENTS,
  DECISIONS,
  AUDIT_FINDINGS,
  FRAMEWORK_VERSIONS,
  ASSESSMENT_RESPONSES,
  AUDIT_LOG,
} from "@/data/seed";
import { CONTROLS } from "@/data/controls";
import { POLICIES } from "@/data/policies";
import { computeScores } from "@/lib/scoring";

interface GovernanceState {
  onboarded: boolean;
  activeVersionId: ID;

  profile: OrganisationProfile;
  controls: Control[];
  policies: Policy[];
  dataAssets: DataAsset[];
  aiSystems: AiSystem[];
  vendors: Vendor[];
  risks: Risk[];
  actions: Action[];
  evidence: Evidence[];
  exceptions: Exception[];
  incidents: Incident[];
  decisions: Decision[];
  auditFindings: AuditFinding[];
  frameworkVersions: FrameworkVersion[];
  responses: Record<string, AssessmentResponse>;
  auditLog: AuditLogEntry[];

  // actions
  setOnboarded: (v: boolean) => void;
  setProfile: (p: Partial<OrganisationProfile>) => void;
  setResponse: (questionId: string, patch: Partial<AssessmentResponse>) => void;
  setAnswer: (questionId: string, answer: AssessmentAnswer, naReason?: string) => void;
  updateControl: (id: string, patch: Partial<Control>) => void;
  updateAiSystem: (id: string, patch: Partial<AiSystem>) => void;
  updateAction: (id: string, patch: Partial<Action>) => void;
  updatePolicy: (id: string, patch: Partial<Policy>) => void;
  addDataAsset: (asset: DataAsset) => void;
  addAiSystem: (system: AiSystem) => void;
  addRisk: (risk: Risk) => void;
  addEvidence: (e: Evidence) => void;
  addDecision: (d: Decision) => void;
  addException: (e: Exception) => void;
  addIncident: (i: Incident) => void;
  createFrameworkVersion: (label: string, note: string) => void;
  log: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
  resetDemo: () => void;

  // derived
  getScores: () => GovernanceScores;
}

const NOW = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

function initialState() {
  return {
    onboarded: true, // demo starts onboarded with seeded Northstar data
    activeVersionId: "FV-2",
    profile: NORTHSTAR_PROFILE,
    controls: CONTROLS,
    policies: POLICIES,
    dataAssets: DATA_ASSETS,
    aiSystems: AI_SYSTEMS,
    vendors: VENDORS,
    risks: RISKS,
    actions: ACTIONS,
    evidence: EVIDENCE,
    exceptions: EXCEPTIONS,
    incidents: INCIDENTS,
    decisions: DECISIONS,
    auditFindings: AUDIT_FINDINGS,
    frameworkVersions: FRAMEWORK_VERSIONS,
    responses: ASSESSMENT_RESPONSES,
    auditLog: AUDIT_LOG,
  };
}

export const useGovernanceStore = create<GovernanceState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      setOnboarded: (v) => set({ onboarded: v }),

      setProfile: (p) =>
        set((s) => ({ profile: { ...s.profile, ...p } })),

      setResponse: (questionId, patch) =>
        set((s) => {
          const prev = s.responses[questionId] ?? {
            questionId,
            evidenceIds: [],
            flaggedForReview: false,
            updatedAt: NOW(),
          };
          return {
            responses: {
              ...s.responses,
              [questionId]: { ...prev, ...patch, updatedAt: NOW() },
            },
          };
        }),

      setAnswer: (questionId, answer, naReason) =>
        set((s) => {
          const prev = s.responses[questionId] ?? {
            questionId,
            evidenceIds: [],
            flaggedForReview: false,
            updatedAt: NOW(),
          };
          return {
            responses: {
              ...s.responses,
              [questionId]: {
                ...prev,
                answer,
                notApplicableReason: answer === "not_applicable" ? naReason ?? prev.notApplicableReason : undefined,
                updatedAt: NOW(),
              },
            },
          };
        }),

      updateControl: (id, patch) =>
        set((s) => ({
          controls: s.controls.map((c) =>
            c.id === id ? { ...c, ...patch, version: patch.status ? c.version + 1 : c.version } : c,
          ),
        })),

      updateAiSystem: (id, patch) =>
        set((s) => ({
          aiSystems: s.aiSystems.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      updateAction: (id, patch) =>
        set((s) => ({
          actions: s.actions.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      updatePolicy: (id, patch) =>
        set((s) => ({
          policies: s.policies.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      addDataAsset: (asset) => set((s) => ({ dataAssets: [asset, ...s.dataAssets] })),
      addAiSystem: (system) => set((s) => ({ aiSystems: [system, ...s.aiSystems] })),
      addRisk: (risk) => set((s) => ({ risks: [risk, ...s.risks] })),
      addEvidence: (e) => set((s) => ({ evidence: [e, ...s.evidence] })),
      addDecision: (d) => set((s) => ({ decisions: [d, ...s.decisions] })),
      addException: (e) => set((s) => ({ exceptions: [e, ...s.exceptions] })),
      addIncident: (i) => set((s) => ({ incidents: [i, ...s.incidents] })),

      createFrameworkVersion: (label, note) =>
        set((s) => {
          const scores = computeScores({
            responses: s.responses,
            controls: s.controls,
            evidence: s.evidence,
            risks: s.risks,
          });
          const archived = s.frameworkVersions.map((v) =>
            v.status === "active" ? { ...v, status: "archived" as const } : v,
          );
          const newVersion: FrameworkVersion = {
            id: uid("FV"),
            label,
            createdAt: NOW(),
            status: "active",
            note,
            snapshot: {
              maturityIndex: scores.maturityIndex,
              controlCoverage: scores.controlImplementation,
              evidenceConfidence: scores.evidenceConfidence,
              openRisks: s.risks.length,
            },
          };
          return {
            frameworkVersions: [...archived, newVersion],
            activeVersionId: newVersion.id,
            auditLog: [
              { id: uid("L"), timestamp: NOW(), actor: "You", action: "framework.version.create", entity: "FrameworkVersion", entityId: newVersion.id, detail: label },
              ...s.auditLog,
            ],
          };
        }),

      log: (entry) =>
        set((s) => ({
          auditLog: [{ id: uid("L"), timestamp: NOW(), ...entry }, ...s.auditLog],
        })),

      resetDemo: () => set({ ...initialState() }),

      getScores: () => {
        const s = get();
        return computeScores({
          responses: s.responses,
          controls: s.controls,
          evidence: s.evidence,
          risks: s.risks,
        });
      },
    }),
    {
      name: "ai-data-governance-studio",
      version: 1,
    },
  ),
);
