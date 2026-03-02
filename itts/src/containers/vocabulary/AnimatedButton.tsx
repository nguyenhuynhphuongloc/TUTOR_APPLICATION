"use client";
import { motion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react"; // Added Minus icon

interface Props {
  isChecked: boolean | "indeterminate";
  onChange: (nextState: boolean | "indeterminate") => void;
}

const AnimatedButton = ({ isChecked, onChange, ...props }: Props) => {
  const toggleButton = () => {
    // Cycle through: false → indeterminate → true → false ...
    const nextState =
      isChecked === false
        ? "indeterminate"
        : isChecked === "indeterminate"
          ? true
          : false;
    onChange(nextState);
  };

  const getBackgroundColor = () => {
    if (isChecked === true) return "#22C55E"; // green
    if (isChecked === "indeterminate") return "#FACC15"; // yellow
    return "#ffffff"; // white
  };

  const renderIcon = () => {
    if (isChecked === true) return <Check className="h-6 w-6 text-white" />;
    if (isChecked === "indeterminate")
      return <Minus className="h-6 w-6 text-white" />;
    return <Plus className="h-6 w-6 text-gray-400" />;
  };

  return (
    <motion.button
      onClick={toggleButton}
      className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border"
      animate={{ backgroundColor: getBackgroundColor() }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      {...props}
    >
      <motion.div
        key={String(isChecked)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {renderIcon()}
      </motion.div>
    </motion.button>
  );
};

export default AnimatedButton;
