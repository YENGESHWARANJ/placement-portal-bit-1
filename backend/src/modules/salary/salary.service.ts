import axios from "axios";
import GlobalJob from "../jobs/global-job.model";

export class SalaryService {
    static async getSalaryByRole(role: string) {
        try {
            const appId = process.env.ADZUNA_APP_ID;
            const appKey = process.env.ADZUNA_APP_KEY;
            let externalData = null;

            if (appId && appKey) {
                const response = await axios.get(
                    `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what=${role}`
                );
                const results = (response.data as any).results;
                if (results && results.length > 0) {
                    const salaries = results
                        .map((j: any) => j.salary_min)
                        .filter((s: any) => s != null);
                    if (salaries.length > 0) {
                        externalData = {
                            min: Math.min(...salaries),
                            max: Math.max(...salaries),
                            avg: salaries.reduce((a: number, b: number) => a + b, 0) / salaries.length,
                        };
                    }
                }
            }

            const dbData = await GlobalJob.aggregate([
                { $match: { title: new RegExp(role, "i") } },
                {
                    $group: {
                        _id: null,
                        avg_salary: { $avg: "$salary" },
                        min_salary: { $min: "$salary" },
                        max_salary: { $max: "$salary" },
                        count: { $sum: 1 },
                    },
                },
            ]);

            if (externalData) {
                return {
                    role,
                    avg_salary: externalData.avg,
                    min_salary: externalData.min,
                    max_salary: externalData.max,
                    source: "Adzuna",
                };
            }

            if (dbData.length > 0) {
                return {
                    role,
                    avg_salary: dbData[0].avg_salary || 0,
                    min_salary: dbData[0].min_salary || 0,
                    max_salary: dbData[0].max_salary || 0,
                    source: "Internal",
                };
            }

            return {
                role,
                avg_salary: 600000,
                min_salary: 400000,
                max_salary: 1200000,
                source: "Estimate",
            };
        } catch (error) {
            console.error("SALARY SERVICE ERROR:", error);
            throw error;
        }
    }

    static async getSalaryByCountry(country: string) {
        return {
            country,
            avg_salary: 800000,
            currency: "INR",
            market_demand: "High",
        };
    }

    static async getSalaryTrends() {
        return [
            { month: "Jan", avg: 50000 },
            { month: "Feb", avg: 52000 },
            { month: "Mar", avg: 55000 },
            { month: "Apr", avg: 54000 },
            { month: "May", avg: 58000 },
        ];
    }
}
