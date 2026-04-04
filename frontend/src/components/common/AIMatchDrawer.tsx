import Button from "../ui/Button";

export default function AIMatchDrawer({ candidate, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">

      <div className="w-full sm:w-[420px] bg-white p-6 shadow-xl h-full overflow-y-auto">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            AI Match Explanation
          </h2>

          <button onClick={onClose}>✖</button>
        </div>

        <div className="mt-6 space-y-4">

          <div>
            <p className="font-semibold">Score</p>
            <p className="text-indigo-600 text-lg">
              {candidate.score}%
            </p>
          </div>

          <div>
            <p className="font-semibold">Strong Skills</p>
            <ul className="list-disc ml-6">
              {candidate.strengths.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Missing Skills</p>
            <ul className="list-disc ml-6 text-red-500">
              {candidate.gaps.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-6 flex gap-3">
          <Button>Shortlist</Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
