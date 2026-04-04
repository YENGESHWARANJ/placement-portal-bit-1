export interface GlobalJob {
    title: string;
    company: string;
    location: string;
    country: string;
    description: string;
    apply_url: string;
    salary?: string;
    posted_at?: Date;
    source: string;
}

export interface JobQuery {
    query?: string;
    country?: string;
    category?: string;
    company?: string;
    page?: number;
    limit?: number;
}
