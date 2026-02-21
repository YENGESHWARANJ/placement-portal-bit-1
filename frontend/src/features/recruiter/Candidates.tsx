import KanbanBoard from "./KanbanBoard.tsx";

export default function Candidates() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Recruiter Pipeline
      </h1>

      <KanbanBoard />
    </div>
  );
}
