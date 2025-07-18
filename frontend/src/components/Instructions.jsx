import { motion } from "framer-motion";

export default function EndSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md mt-10 max-w-3xl mx-auto"
      id="instructions"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">📌 Final Info Panel</h2>

      <ul className="space-y-4 text-base leading-relaxed">
        <li>
          🔍 To see Room Matrix:{" "}
          <a
            href="/room-matrix"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Click Here
          </a>
          <br />
          View where your branchmates are, find empty/partially empty rooms, and explore user-requested rooms.
        </li>

        <li>
          📊 For Graph Visualizations:{" "}
          <a
            href="/visualization"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Explore Charts
          </a>
        </li>

        <li>
          🤝 Want to send a request?
          <br />
          Just enter the desired room number — the person in that room will get your request, along with your contact number.
        </li>

        <li>
          📱 Haven't added your contact number yet?{" "}
          <span className="text-yellow-400 font-semibold">
            Please update it
          </span>{" "}
          so others can reach you directly for room exchanges.
        </li>

        <li>❌ You can delete any outgoing request anytime.</li>

        <li>📥 All incoming requests are visible in your dashboard.</li>
      </ul>
    </motion.div>
  );
}
