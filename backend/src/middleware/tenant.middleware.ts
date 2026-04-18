import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export interface TenantContext {
  id: string;
  name: string;
  plan: "enterprise" | "growth" | "starter";
  region: string;
}

export interface TenantRequest extends AuthRequest {
  tenant?: TenantContext;
}

const FALLBACK_TENANT: TenantContext = {
  id: "fortune-500-sandbox",
  name: "Fortune 500 Sandbox",
  plan: "enterprise",
  region: "ap-south-1",
};

function normalizeTenant(rawTenantId?: string): TenantContext {
  if (!rawTenantId) {
    return FALLBACK_TENANT;
  }

  const sanitized = rawTenantId
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  if (!sanitized) {
    return FALLBACK_TENANT;
  }

  return {
    id: sanitized,
    name: sanitized
      .split("-")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" "),
    plan: sanitized.includes("enterprise") || sanitized.includes("fortune") ? "enterprise" : "growth",
    region: "ap-south-1",
  };
}

export const tenantMiddleware = (req: TenantRequest, _res: Response, next: NextFunction) => {
  const headerTenant = req.header("x-tenant-id");
  const queryTenant =
    typeof req.query.tenantId === "string" ? req.query.tenantId : undefined;

  req.tenant = normalizeTenant(headerTenant || queryTenant);
  next();
};
