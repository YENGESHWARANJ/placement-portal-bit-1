import { motion } from "framer-motion";

const events = [
  "Rahul shortlisted for Google",
  "New drive scheduled: Infosys",
  "Resume parsed for Priya",
  "Admin updated tenant plan",
];

export default function ActivityFeed() {
  return (
    <div className="bg-slate-50 rounded-xl p-6">
      <h3 className="mb-4 font-semibold">Live Activity</h3>

      {events.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="py-2 border-b border-slate-200"
        >
          {e}
        </motion.div>
      ))}
    </div>
  );
}
