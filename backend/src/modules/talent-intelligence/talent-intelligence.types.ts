import { z } from "zod";

export const talentCommandCenterQuerySchema = z.object({
  range: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
});

export type TalentCommandCenterQuery = z.infer<typeof talentCommandCenterQuerySchema>;

export interface TalentCommandCenterSnapshot {
  tenant: {
    id: string;
    name: string;
    plan: string;
    region: string;
  };
  generatedAt: string;
  range: "7d" | "30d" | "90d";
  headline: {
    activeRequisitions: number;
    shortlistedCandidates: number;
    placementForecast: number;
    biasAlerts: number;
  };
  resumePipeline: Array<{
    stage: string;
    count: number;
    slaMinutes: number;
    trend: string;
  }>;
  rankingLeaders: Array<{
    id: string;
    name: string;
    role: string;
    score: number;
    confidence: number;
    biasRisk: "low" | "medium" | "high";
    skills: string[];
    explanation: string;
    location: string;
  }>;
  kanban: Array<{
    stage: string;
    cards: Array<{
      id: string;
      candidate: string;
      role: string;
      score: number;
      eta: string;
      owner: string;
    }>;
  }>;
  skillHeatmap: Array<{
    skill: string;
    demand: number;
    supply: number;
    gap: number;
  }>;
  auditTimeline: Array<{
    id: string;
    actor: string;
    action: string;
    timestamp: string;
    severity: "info" | "warning" | "critical";
  }>;
  billing: {
    mrr: number;
    projectedRenewal: number;
    seatsUsed: number;
    seatsContracted: number;
  };
  sla: Array<{
    service: string;
    uptime: number;
    latencyMs: number;
    status: "healthy" | "watch" | "incident";
  }>;
  forecast: Array<{
    month: string;
    hires: number;
    tenantUsage: number;
    revenue: number;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    detail: string;
    priority: "low" | "medium" | "high";
  }>;
}
