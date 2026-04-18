import { Response } from "express";
import { tenantMiddleware, TenantRequest } from "../../middleware/tenant.middleware";
import { buildTalentCommandCenterSnapshot } from "./talent-intelligence.service";
import { talentCommandCenterQuerySchema } from "./talent-intelligence.types";

export const getTalentCommandCenter = (req: TenantRequest, res: Response) => {
  const parsed = talentCommandCenterQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid talent intelligence query",
      errors: parsed.error.flatten(),
    });
  }

  const tenant = req.tenant || {
    id: "fortune-500-sandbox",
    name: "Fortune 500 Sandbox",
    plan: "enterprise" as const,
    region: "ap-south-1",
  };

  return res.json(buildTalentCommandCenterSnapshot(tenant, parsed.data));
};
