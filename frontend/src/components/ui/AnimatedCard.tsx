import { motion } from "framer-motion";

export default function AnimatedCard({ children }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card"
    >
      {children}
    </motion.div>
  );
}
