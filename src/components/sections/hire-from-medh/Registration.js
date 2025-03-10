import { motion, AnimatePresence } from "framer-motion";

// Add loading animation
const loadingAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Add form animation
const formAnimation = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.2
    }
  }
};

// Update the form container with motion
<motion.div
  variants={formAnimation}
  initial="hidden"
  animate="visible"
  className="..."
>
  {/* Form content */}
</motion.div>

// Add loading state animation
{loading && (
  <motion.div
    variants={loadingAnimation}
    initial="hidden"
    animate="visible"
    className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="flex flex-col items-center">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="mt-4 text-gray-600 dark:text-gray-300">Processing your request...</p>
    </div>
  </motion.div>
)} 