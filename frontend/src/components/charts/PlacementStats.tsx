import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Placed", value: 70 },
  { name: "Unplaced", value: 30 },
];

export default function PlacementStats() {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" outerRadius={100}>
        <Cell fill="#22c55e" />
        <Cell fill="#ef4444" />
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
