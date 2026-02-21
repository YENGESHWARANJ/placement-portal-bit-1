import { useEffect, useState } from "react";
import api from "../../services/api";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    api.get("/recruiter/jobs").then((res: any) => setJobs(res.data));
    api.get("/recruiter/candidates").then((res: any) => setCandidates(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>

      <section className="mt-6">
        <h3 className="font-semibold">Active Jobs</h3>
        {jobs.map(j => (
          <div key={j._id} className="border p-3 mt-2">
            {j.title}
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h3 className="font-semibold">Top Candidates</h3>
        {candidates.map(c => (
          <div key={c._id} className="border p-3 mt-2">
            {c.name} — {c.score}%
          </div>
        ))}
      </section>
    </div>
  );
}
