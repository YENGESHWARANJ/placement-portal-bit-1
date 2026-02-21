import { motion } from "framer-motion";

export default function AIInsights() {
  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      className="bg-gradient-to-b from-purple-800 to-pink-700 p-6 rounded-2xl"
    >
      <h3 className="font-bold mb-3">AI Insights</h3>

      <ul className="space-y-2 text-sm opacity-90">
        <li>📈 Placement rate rising in CSE</li>
        <li>⚠ Low hiring in Mechanical</li>
        <li>🔥 Amazon drive trending</li>
      </ul>
    </motion.div>
  );
}
