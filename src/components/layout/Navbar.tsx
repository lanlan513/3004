import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="glass-card border-b border-cyber-cyan/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Brain className="w-8 h-8 text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            </motion.div>
            <span className="font-display text-2xl font-bold text-cyber-cyan glow-text tracking-wider">
              NeuroMind
            </span>
          </NavLink>

          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "relative font-display text-sm tracking-wider uppercase transition-colors duration-300",
                  isActive
                    ? "text-cyber-cyan"
                    : "text-gray-400 hover:text-cyber-cyan"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span>首页</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-pink rounded-full"
                      style={{
                        boxShadow:
                          "0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.4)",
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/encyclopedia"
              className={({ isActive }) =>
                cn(
                  "relative font-display text-sm tracking-wider uppercase transition-colors duration-300",
                  isActive
                    ? "text-cyber-cyan"
                    : "text-gray-400 hover:text-cyber-cyan"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span>百科</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-pink rounded-full"
                      style={{
                        boxShadow:
                          "0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.4)",
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
