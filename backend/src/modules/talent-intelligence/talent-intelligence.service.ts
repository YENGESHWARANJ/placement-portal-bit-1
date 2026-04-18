import {
  TalentCommandCenterSnapshot,
  TalentCommandCenterQuery,
} from "./talent-intelligence.types";
import { TenantContext } from "../../middleware/tenant.middleware";

const RANGE_MULTIPLIER: Record<TalentCommandCenterQuery["range"], number> = {
  "7d": 0.45,
  "30d": 1,
  "90d": 1.85,
};

function round(value: number): number {
  return Math.round(value);
}

function withTenantOffset(base: number, tenant: TenantContext, range: TalentCommandCenterQuery["range"]): number {
  const tenantOffset = tenant.id.length * 7;
  return round((base + tenantOffset) * RANGE_MULTIPLIER[range]);
}

export function buildTalentCommandCenterSnapshot(
  tenant: TenantContext,
  query: TalentCommandCenterQuery,
): TalentCommandCenterSnapshot {
  const now = new Date();
  const range = query.range;

  return {
    tenant: {
      id: tenant.id,
      name: tenant.name,
      plan: tenant.plan,
      region: tenant.region,
    },
    generatedAt: now.toISOString(),
    range,
    headline: {
      activeRequisitions: withTenantOffset(42, tenant, range),
      shortlistedCandidates: withTenantOffset(316, tenant, range),
      placementForecast: Math.min(97, withTenantOffset(71, tenant, range) / 3),
      biasAlerts: Math.max(1, round(withTenantOffset(6, tenant, range) / 20)),
    },
    resumePipeline: [
      { stage: "Uploaded", count: withTenantOffset(840, tenant, range), slaMinutes: 4, trend: "+14%" },
      { stage: "OCR Extracted", count: withTenantOffset(812, tenant, range), slaMinutes: 7, trend: "+10%" },
      { stage: "AI Ranked", count: withTenantOffset(644, tenant, range), slaMinutes: 9, trend: "+18%" },
      { stage: "Human Reviewed", count: withTenantOffset(221, tenant, range), slaMinutes: 24, trend: "+8%" },
    ],
    rankingLeaders: [
      {
        id: "cand-001",
        name: "Aarav Menon",
        role: "Senior Data Platform Engineer",
        score: 96,
        confidence: 92,
        biasRisk: "low",
        skills: ["Python", "Kafka", "Spark", "AWS"],
        explanation: "Strong match on platform depth, production scale, and cloud-native delivery.",
        location: "Bengaluru",
      },
      {
        id: "cand-002",
        name: "Maya Srinivasan",
        role: "AI Product Analyst",
        score: 93,
        confidence: 88,
        biasRisk: "low",
        skills: ["NLP", "SQL", "Experimentation", "SHAP"],
        explanation: "Excellent business-to-model translation and explainability workflow coverage.",
        location: "Chennai",
      },
      {
        id: "cand-003",
        name: "Rohan Kapoor",
        role: "Cloud Security Architect",
        score: 91,
        confidence: 86,
        biasRisk: "medium",
        skills: ["IAM", "Terraform", "Kubernetes", "SOC 2"],
        explanation: "High compliance alignment with a small skill recency gap on policy-as-code tooling.",
        location: "Mumbai",
      },
      {
        id: "cand-004",
        name: "Ishita Rao",
        role: "Recruitment Operations Lead",
        score: 89,
        confidence: 84,
        biasRisk: "low",
        skills: ["ATS", "Forecasting", "Stakeholder Mgmt", "BI"],
        explanation: "Balanced operations profile with strong hiring analytics ownership.",
        location: "Hyderabad",
      },
    ],
    kanban: [
      {
        stage: "OCR Review",
        cards: [
          { id: "ocr-1", candidate: "Nikhil Das", role: "Backend Engineer", score: 88, eta: "12m", owner: "Asha" },
          { id: "ocr-2", candidate: "Tara Joseph", role: "ML Engineer", score: 90, eta: "18m", owner: "Neeraj" },
        ],
      },
      {
        stage: "AI Shortlist",
        cards: [
          { id: "short-1", candidate: "Riya Khanna", role: "Data Scientist", score: 95, eta: "Ready", owner: "Model" },
          { id: "short-2", candidate: "Dev Patel", role: "DevOps Lead", score: 92, eta: "Ready", owner: "Model" },
        ],
      },
      {
        stage: "Recruiter Review",
        cards: [
          { id: "review-1", candidate: "Ananya Iyer", role: "Product Manager", score: 87, eta: "1h", owner: "Aarushi" },
          { id: "review-2", candidate: "Karan Bedi", role: "SRE", score: 90, eta: "42m", owner: "Harsh" },
        ],
      },
      {
        stage: "Interview Loop",
        cards: [
          { id: "loop-1", candidate: "Sara Philip", role: "Solutions Architect", score: 94, eta: "Tomorrow", owner: "Panel A" },
        ],
      },
    ],
    skillHeatmap: [
      { skill: "GenAI", demand: 94, supply: 61, gap: 33 },
      { skill: "Kubernetes", demand: 87, supply: 74, gap: 13 },
      { skill: "Data Engineering", demand: 91, supply: 69, gap: 22 },
      { skill: "Prompt Evaluation", demand: 78, supply: 46, gap: 32 },
      { skill: "SOC 2", demand: 72, supply: 58, gap: 14 },
      { skill: "MLOps", demand: 84, supply: 55, gap: 29 },
    ],
    auditTimeline: [
      {
        id: "audit-1",
        actor: "Bias Sentinel",
        action: "Flagged gender-coded phrasing in JD-4321",
        timestamp: new Date(now.getTime() - 1000 * 60 * 19).toISOString(),
        severity: "warning",
      },
      {
        id: "audit-2",
        actor: "Recruiter Ops",
        action: "Bulk-shortlisted 18 candidates for Data Platform hiring pod",
        timestamp: new Date(now.getTime() - 1000 * 60 * 58).toISOString(),
        severity: "info",
      },
      {
        id: "audit-3",
        actor: "Compliance Exporter",
        action: "Generated GDPR deletion packet for tenant legal review",
        timestamp: new Date(now.getTime() - 1000 * 60 * 96).toISOString(),
        severity: "critical",
      },
    ],
    billing: {
      mrr: withTenantOffset(148000, tenant, range),
      projectedRenewal: withTenantOffset(182000, tenant, range),
      seatsUsed: withTenantOffset(218, tenant, "7d"),
      seatsContracted: 300,
    },
    sla: [
      { service: "Resume OCR", uptime: 99.97, latencyMs: 480, status: "healthy" },
      { service: "Ranking Engine", uptime: 99.92, latencyMs: 620, status: "healthy" },
      { service: "Explainability API", uptime: 99.81, latencyMs: 910, status: "watch" },
      { service: "Compliance Exports", uptime: 99.99, latencyMs: 340, status: "healthy" },
    ],
    forecast: [
      { month: "May", hires: 28, tenantUsage: 72, revenue: 148 },
      { month: "Jun", hires: 33, tenantUsage: 78, revenue: 156 },
      { month: "Jul", hires: 39, tenantUsage: 81, revenue: 161 },
      { month: "Aug", hires: 42, tenantUsage: 88, revenue: 168 },
      { month: "Sep", hires: 46, tenantUsage: 93, revenue: 176 },
      { month: "Oct", hires: 49, tenantUsage: 96, revenue: 184 },
    ],
    notifications: [
      {
        id: "notif-1",
        title: "SLA watch on explainability latency",
        detail: "P95 rose above 900ms during the last ranking batch.",
        priority: "medium",
      },
      {
        id: "notif-2",
        title: "Renewal forecast trending up",
        detail: "Usage predicts a 19% expansion at next enterprise renewal.",
        priority: "low",
      },
      {
        id: "notif-3",
        title: "Bias check required",
        detail: "Two shortlisted profiles need human review before export.",
        priority: "high",
      },
    ],
  };
}
