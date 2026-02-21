const columns = ["New", "Ranked", "Shortlisted"];

export default function KanbanBoard() {
  return (
    <div className="grid grid-cols-3 gap-6">

      {columns.map((c) => (
        <div
          key={c}
          className="bg-slate-200 dark:bg-slate-800 p-4 rounded-xl"
        >
          <h3 className="font-bold mb-3">
            {c}
          </h3>
        </div>
      ))}

    </div>
  );
}
