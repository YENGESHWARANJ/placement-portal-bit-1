import { Router } from "express";
import { getSalaryByRole, getSalaryByCountry, getSalaryTrends } from "./salary.controller";

const router = Router();

router.get("/role", getSalaryByRole);
router.get("/country", getSalaryByCountry);
router.get("/trends", getSalaryTrends);

export default router;
