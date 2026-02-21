export default function AIExplanationPanel({ data }: any) {
  return (
    <div className="bg-indigo-50 p-4 rounded-xl">

      <h3 className="font-semibold mb-2">
        AI Explanation
      </h3>

      <p>Score: {data.score}%</p>
      <p>Strengths: {data.strengths?.join(", ")}</p>
      <p>Gaps: {data.gaps?.join(", ")}</p>

    </div>
  );
}
