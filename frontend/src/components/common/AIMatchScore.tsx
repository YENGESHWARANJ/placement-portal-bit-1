import { motion } from "framer-motion";

export default function AIMatchScore({ value }: { value: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-2xl text-center"
    >
      <p className="opacity-70">AI Match Score</p>
      <h1 className="text-4xl font-bold mt-2">{value}%</h1>
    </motion.div>
  );
}
