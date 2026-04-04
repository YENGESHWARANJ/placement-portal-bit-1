import cron from "node-cron";
import axios from "axios";
import GlobalJob from "../jobs/global-job.model";

export class ScraperService {
    static async scrapeJobs() {
        console.log("[SCRAPER] Starting background job fetch...");
        try {
            const sources = [
                { name: "Arbeitnow", url: "https://www.arbeitnow.com/api/job-board-api" }
            ];

            for (const source of sources) {
                const response = await axios.get(source.url);
                const jobs = (response.data as any).data;

                for (const jobData of jobs) {
                    await GlobalJob.findOneAndUpdate(
                        { apply_url: jobData.url },
                        {
                            title: jobData.title,
                            company: jobData.company_name,
                            location: jobData.location,
                            description: jobData.description,
                            apply_url: jobData.url,
                            source: source.name,
                        },
                        { upsert: true }
                    );
                }
            }
            console.log("[SCRAPER] Successfully updated global job database.");
        } catch (error) {
            console.error("[SCRAPER] Error during scraping:", error);
        }
    }

    static init() {
        cron.schedule("*/30 * * * *", () => {
            this.scrapeJobs();
        });
        this.scrapeJobs();
    }
}
