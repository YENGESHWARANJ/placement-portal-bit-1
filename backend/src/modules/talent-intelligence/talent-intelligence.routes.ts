import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { tenantMiddleware } from "../../middleware/tenant.middleware";
import { getTalentCommandCenter } from "./talent-intelligence.controller";

const router = Router();

router.get(
  "/command-center",
  authMiddleware,
  tenantMiddleware,
  rbacMiddleware(["recruiter", "mentor", "admin", "officer"]),
  getTalentCommandCenter,
);

export default router;
