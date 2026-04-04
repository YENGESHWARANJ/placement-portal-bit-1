import axios from "axios";
import GlobalJob from "../jobs/global-job.model";

export class JobAggregatorService {
    private static readonly sources = {
        ADZUNA: "Adzuna",
        JSEARCH: "JSearch",
        ARBEITNOW: "Arbeitnow"
    };

    static async fetchAndSaveJobs() {
        console.log("[AGGREGATOR] Fetching global jobs...");
        const allJobs: any[] = [];

        // 1. Fetch from Arbeitnow (Global + India Focus)
        const arbeitQueries = ["", "?location=india", "?search=chennai"];
        for (const query of arbeitQueries) {
            try {
                const response = await axios.get(`https://www.arbeitnow.com/api/job-board-api${query}`);
                const jobs = (response.data as any).data.map((j: any) => ({
                    title: j.title,
                    company: j.company_name,
                    location: j.location,
                    country: j.location.toLowerCase().includes("india") || j.location.toLowerCase().includes("chennai") ? "IN" : "Global",
                    description: j.description,
                    apply_url: j.url,
                    source: this.sources.ARBEITNOW,
                    skills: this.extractSkills(j.description),
                }));
                allJobs.push(...jobs);
            } catch (e) { console.error("Arbeitnow Fail", e); }
        }

        // 2. Fetch from Adzuna (Heavy Prioritization on India, TN)
        const inQueries = [
            "&what=software%20engineer%20tamil%20nadu",
            "&what=developer%20chennai",
            "&what=fresher%20coimbatore",
            "&what=it%20jobs%20india"
        ];
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        if (appId && appKey) {
            // First run IN queries
            for (const q of inQueries) {
                try {
                    const response = await axios.get(
                        `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50${q}`
                    );
                    const jobs = (response.data as any).results.map((j: any) => ({
                        title: j.title,
                        company: j.company.display_name,
                        location: j.location.display_name,
                        country: "IN",
                        salary: j.salary_min ? `${j.salary_min} - ${j.salary_max}` : "Not Disclosed",
                        description: j.description,
                        apply_url: j.redirect_url,
                        source: this.sources.ADZUNA,
                        skills: this.extractSkills(j.description),
                    }));
                    allJobs.push(...jobs);
                } catch (e) { /* silent */ }
            }

            // Other global countries
            const globalCountries = ["us", "gb", "ca", "de"];
            await Promise.all(globalCountries.map(async (country) => {
                try {
                    const response = await axios.get(
                        `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=30`
                    );
                    const jobs = (response.data as any).results.map((j: any) => ({
                        title: j.title,
                        company: j.company.display_name,
                        location: j.location.display_name,
                        country: country.toUpperCase(),
                        salary: j.salary_min ? `${j.salary_min} - ${j.salary_max}` : "Not Disclosed",
                        description: j.description,
                        apply_url: j.redirect_url,
                        source: this.sources.ADZUNA,
                        skills: this.extractSkills(j.description),
                    }));
                    allJobs.push(...jobs);
                } catch (e) { /* silent skip */ }
            }));
        }

        // 3. Fetch from JSearch (Heavy India/TN Focus)
        const rapidKey = process.env.RAPIDAPI_KEY;
        if (rapidKey) {
            const queries = ["Software Engineer in Chennai, Tamil Nadu", "Developer in Coimbatore, Tamil Nadu", "Internship in India", "IT Jobs in Bangalore"];
            for (const q of queries) {
                try {
                    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
                        params: { query: q, page: "1", num_pages: "1" },
                        headers: { "X-RapidAPI-Key": rapidKey, "X-RapidAPI-Host": "jsearch.p.rapidapi.com" },
                    });
                    const jobs = (response.data as any).data.map((j: any) => ({
                        title: j.job_title,
                        company: j.employer_name,
                        location: `${j.job_city || ''} ${j.job_state || ''}, ${j.job_country}`,
                        country: "IN",
                        description: j.job_description,
                        apply_url: j.job_apply_link,
                        source: this.sources.JSEARCH,
                        skills: this.extractSkills(j.job_description),
                    }));
                    allJobs.push(...jobs);
                } catch (e) { /* silent skip */ }
            }
        }

        // 4. Save to MongoDB
        let savedCount = 0;
        console.log(`[AGGREGATOR] Processing ${allJobs.length} total jobs collected...`);
        for (const job of allJobs) {
            try {
                const existing = await GlobalJob.findOne({ apply_url: job.apply_url });
                if (!existing) {
                    await GlobalJob.create(job);
                    savedCount++;
                }
            } catch (e) {
                // console.error("Save Fail", e); 
            }
        }

        console.log(`[AGGREGATOR] SUCCESS: Saved ${savedCount} NEW unique jobs.`);
        return allJobs;
    }

    static async getTrendingSkills() {
        const jobs = await GlobalJob.find({}).select("skills").limit(1000);
        const skillCounts: Record<string, number> = {};

        jobs.forEach((job: any) => {
            (job.skills || []).forEach((skill: string) => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });

        return Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill]) => skill);
    }

    private static extractSkills(description: string): string[] {
        const commonSkills = ["react", "node", "mongodb", "python", "javascript", "typescript", "java", "aws", "docker", "graphql", "sql", "css", "html"];
        const desc = description.toLowerCase();
        return commonSkills.filter(skill => desc.includes(skill));
    }

    static async searchJobs(query: any) {
        const { q, country, company, remote, page = 1, limit = 100 } = query;
        const skip = (page - 1) * limit;

        const mongoQuery: any = {};
        if (q) mongoQuery.$or = [{ title: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
        if (country) mongoQuery.country = new RegExp(country, "i");
        if (company) mongoQuery.company = new RegExp(company, "i");
        if (remote) mongoQuery.location = new RegExp("remote", "i");

        const total = await GlobalJob.countDocuments(mongoQuery);
        const jobs = await GlobalJob.find(mongoQuery).sort({ createdAt: -1 }).skip(skip).limit(limit);

        return { total_jobs: total, page, jobs };
    }
}
