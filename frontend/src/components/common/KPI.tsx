interface Props {
  title: string;
  value: string | number;
}

export default function KPI({ title, value }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 shadow rounded-xl p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}
