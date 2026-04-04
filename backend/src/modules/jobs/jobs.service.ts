import axios from "axios";
import { GlobalJob, JobQuery } from "./jobs.types";
import GlobalJobModel from "./global-job.model";

// Simple in-memory cache
const cache = new Map<string, { data: GlobalJob[], timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

export class JobsService {
    private static async fetchArbeitnow(): Promise<GlobalJob[]> {
        try {
            const response = await axios.get("https://www.arbeitnow.com/api/job-board-api");
            return (response.data as any).data.map((job: any) => ({
                title: job.title,
                company: job.company_name,
                location: job.location,
                country: "Global",
                description: job.description,
                apply_url: job.url,
                posted_at: new Date(job.created_at * 1000),
                source: "Arbeitnow",
            }));
        } catch (error) {
            console.error("Arbeitnow API failed:", error);
            return [];
        }
    }

    private static async fetchAdzuna(country: string = "in"): Promise<GlobalJob[]> {
        try {
            const appId = process.env.ADZUNA_APP_ID;
            const appKey = process.env.ADZUNA_APP_KEY;

            if (!appId || !appKey) {
                console.warn("Adzuna credentials missing");
                return [];
            }

            const response = await axios.get(
                `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}`
            );

            return (response.data as any).results.map((job: any) => ({
                title: job.title,
                company: job.company.display_name,
                location: job.location.display_name,
                country,
                description: job.description,
                apply_url: job.redirect_url,
                salary: job.salary_min ? `${job.salary_min} - ${job.salary_max}` : undefined,
                posted_at: new Date(job.created),
                source: "Adzuna",
            }));
        } catch (error) {
            console.error("Adzuna API failed:", error);
            return [];
        }
    }

    private static async fetchJSearch(query: string = "Software Engineer"): Promise<GlobalJob[]> {
        try {
            const apiKey = process.env.RAPIDAPI_KEY;

            if (!apiKey) {
                console.warn("JSearch RapidAPI key missing");
                return [];
            }

            const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
                params: { query, page: "1", num_pages: "1" },
                headers: {
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
                },
            });

            return (response.data as any).data.map((job: any) => ({
                title: job.job_title,
                company: job.employer_name,
                location: `${job.job_city || ""}, ${job.job_country || ""}`,
                country: job.job_country,
                description: job.job_description,
                apply_url: job.job_apply_link,
                salary: job.job_salary_range || undefined,
                posted_at: new Date(job.job_posted_at_datetime_utc),
                source: "JSearch",
            }));
        } catch (error) {
            console.error("JSearch API failed:", error);
            return [];
        }
    }

    static async getGlobalJobs(options: JobQuery): Promise<GlobalJob[]> {
        const cacheKey = JSON.stringify(options);
        const cached = cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }

        // Fetch from all APIs concurrently
        const [arbeitnow, adzuna, jsearch] = await Promise.all([
            this.fetchArbeitnow(),
            this.fetchAdzuna(options.country || "in"),
            this.fetchJSearch(options.query),
        ]);

        // Merge results
        let allJobs = [...arbeitnow, ...adzuna, ...jsearch];

        // Remove duplicates (by URL)
        const uniqueJobsMap = new Map();
        allJobs.forEach(job => uniqueJobsMap.set(job.apply_url, job));
        allJobs = Array.from(uniqueJobsMap.values());

        // Filter by query if provided manually (in case API search isn't enough)
        if (options.query) {
            const q = options.query.toLowerCase();
            allJobs = allJobs.filter(job =>
                job.title.toLowerCase().includes(q) ||
                job.company.toLowerCase().includes(q)
            );
        }

        // Filter by company
        if (options.company) {
            const c = options.company.toLowerCase();
            allJobs = allJobs.filter(job => job.company.toLowerCase().includes(c));
        }

        // Sort by date
        allJobs.sort((a, b) => (b.posted_at?.getTime() || 0) - (a.posted_at?.getTime() || 0));

        // Store in MongoDB for analytics (background)
        this.storeJobsForAnalytics(allJobs).catch(err => console.error("Failed to store jobs:", err));

        // Update cache
        cache.set(cacheKey, { data: allJobs, timestamp: Date.now() });

        return allJobs;
    }

    private static async storeJobsForAnalytics(jobs: GlobalJob[]) {
        // Only store unique ones that don't exist in our DB already
        for (const job of jobs.slice(0, 10)) { // Limit to 10 per request to save space/time
            await GlobalJobModel.findOneAndUpdate(
                { apply_url: job.apply_url },
                {
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    description: job.description.substring(0, 1000), // Limit description size
                    apply_url: job.apply_url,
                    source: job.source,
                },
                { upsert: true }
            );
        }
    }
}
