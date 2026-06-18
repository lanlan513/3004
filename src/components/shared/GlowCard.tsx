import { ReactNode, MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  color?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function GlowCard({
  children,
  className,
  color = "#00f0ff",
  onClick,
}: GlowCardProps) {
  return (
    <motion.div
      className={cn("glass-card cyber-border rounded-lg overflow-hidden", className)}
      onClick={onClick}
      whileHover={{
        y: -4,
        boxShadow: `0 0 30px ${color}50, 0 0 60px ${color}30`,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      style={{
        boxShadow: `0 0 15px ${color}20`,
      }}
    >
      {children}
    </motion.div>
  );
}
