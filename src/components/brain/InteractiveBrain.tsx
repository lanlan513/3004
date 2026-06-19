import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrainStore } from "@/store/useBrainStore";
import { memory, language, motor, vision } from "@/data/brainRegions";
import type { BrainRegionData } from "@/types";

interface RegionConfig {
  id: string;
  name: string;
  color: string;
  data: BrainRegionData[];
  path: string;
  tooltipX: number;
  tooltipY: number;
}

const regionConfigs: RegionConfig[] = [
  {
    id: "memory",
    name: "记忆区",
    color: "#8b5cf6",
    data: memory,
    path: "M200 380 Q180 360 175 330 Q170 300 190 280 Q210 265 240 270 Q270 275 285 300 Q295 325 280 355 Q265 380 235 385 Q215 388 200 380 Z",
    tooltipX: 150,
    tooltipY: 330,
  },
  {
    id: "language",
    name: "语言区",
    color: "#00f0ff",
    data: language,
    path: "M130 250 Q110 220 120 180 Q135 150 165 145 Q195 140 210 165 Q220 190 205 220 Q190 250 160 258 Q145 260 130 250 Z M150 370 Q130 350 135 310 Q145 280 175 275 Q205 270 215 295 Q220 320 205 345 Q190 368 165 375 Q155 376 150 370 Z",
    tooltipX: 80,
    tooltipY: 210,
  },
  {
    id: "motor",
    name: "运动区",
    color: "#00ff88",
    data: motor,
    path: "M240 150 Q220 120 235 90 Q255 60 290 58 Q325 56 340 85 Q350 115 335 145 Q315 170 280 172 Q255 172 240 150 Z",
    tooltipX: 260,
    tooltipY: 60,
  },
  {
    id: "vision",
    name: "视觉区",
    color: "#ff00aa",
    data: vision,
    path: "M370 320 Q355 290 365 250 Q380 215 410 210 Q440 205 450 240 Q455 275 435 305 Q410 330 385 332 Q375 332 370 320 Z",
    tooltipX: 420,
    tooltipY: 270,
  },
];

const neuronLines = [
  { x1: 80, y1: 150, x2: 180, y2: 200 },
  { x1: 60, y1: 300, x2: 140, y2: 280 },
  { x1: 70, y1: 450, x2: 170, y2: 380 },
  { x1: 420, y1: 120, x2: 340, y2: 170 },
  { x1: 440, y1: 350, x2: 370, y2: 320 },
  { x1: 430, y1: 480, x2: 350, y2: 420 },
  { x1: 250, y1: 30, x2: 280, y2: 90 },
  { x1: 250, y1: 570, x2: 270, y2: 490 },
];

const floatingNodes = [
  { cx: 80, cy: 150, r: 4, color: "#00f0ff" },
  { cx: 60, cy: 300, r: 3, color: "#8b5cf6" },
  { cx: 70, cy: 450, r: 5, color: "#00ff88" },
  { cx: 420, cy: 120, r: 4, color: "#ff00aa" },
  { cx: 440, cy: 350, r: 3, color: "#00f0ff" },
  { cx: 430, cy: 480, r: 4, color: "#8b5cf6" },
  { cx: 250, cy: 30, r: 5, color: "#00ff88" },
  { cx: 250, cy: 570, r: 4, color: "#ff00aa" },
  { cx: 150, cy: 80, r: 3, color: "#00f0ff" },
  { cx: 350, cy: 60, r: 3, color: "#ff00aa" },
];

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function InteractiveBrain() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const { selectedRegion, setSelectedRegion, setPanelOpen } = useBrainStore();

  const handleRegionClick = (regionId: string, color: string, e: React.MouseEvent<SVGGElement>) => {
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    const scaleX = 500 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      color,
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);

    setSelectedRegion(regionId);
    setPanelOpen(true);
  };

  const brainOutlinePath = useMemo(
    () =>
      "M120 200 Q90 170 95 130 Q105 85 150 65 Q200 45 260 50 Q320 55 360 80 Q400 105 410 155 Q418 205 395 250 Q420 270 425 315 Q430 365 395 400 Q405 425 380 455 Q355 485 310 495 Q275 503 250 480 Q225 503 190 495 Q145 485 120 455 Q95 425 105 400 Q70 365 75 315 Q80 270 105 250 Q82 205 120 200 Z",
    []
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 500 600"
          className="w-full h-full max-w-[600px] max-h-[700px]"
          style={{ filter: "drop-shadow(0 0 30px rgba(0, 240, 255, 0.2))" }}
        >
          <defs>
            <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#16213e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f0f23" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="scan-ring-gradient">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="70%" stopColor="transparent" />
              <stop offset="80%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="90%" stopColor="#00f0ff" stopOpacity="0.6" />
              <stop offset="95%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            style={{ transformOrigin: "250px 300px" }}
          >
            <circle
              cx="250"
              cy="300"
              r="270"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1"
              strokeOpacity="0.15"
              strokeDasharray="5 15"
            />
            <circle
              cx="250"
              cy="300"
              r="270"
              fill="url(#scan-ring-gradient)"
              opacity="0.5"
            />
          </motion.g>

          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
            style={{ transformOrigin: "250px 300px" }}
          >
            <circle
              cx="250"
              cy="300"
              r="250"
              fill="none"
              stroke="#ff00aa"
              strokeWidth="1"
              strokeOpacity="0.1"
              strokeDasharray="10 20"
            />
          </motion.g>

          {neuronLines.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#00f0ff"
              strokeWidth="1"
              strokeOpacity="0.4"
              strokeDasharray="4 8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-12"
                dur={`${2 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            </motion.line>
          ))}

          {floatingNodes.map((node, i) => (
            <motion.circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={node.color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                filter: `drop-shadow(0 0 ${node.r * 2}px ${node.color})`,
              }}
            />
          ))}

          <motion.path
            d={brainOutlinePath}
            fill="url(#brain-gradient)"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeOpacity="0.6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))",
            }}
          />

          <path
            d={brainOutlinePath}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            strokeDasharray="2 6"
          />

          {regionConfigs.map((region) => {
            const isHovered = hoveredRegion === region.id;
            const isSelected = selectedRegion === region.id;

            return (
              <motion.g
                key={region.id}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={(e) => handleRegionClick(region.id, region.color, e)}
                style={{ cursor: "pointer", transformOrigin: "center center" }}
                animate={{
                  scale: isHovered ? 1.02 : isSelected ? 1.01 : 1,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <motion.path
                  d={region.path}
                  fill={region.color}
                  fillOpacity={isHovered ? 0.45 : isSelected ? 0.35 : 0.2}
                  stroke={region.color}
                  strokeWidth={isHovered ? 3 : isSelected ? 2.5 : 2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                  }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 0 15px ${region.color}) drop-shadow(0 0 30px ${region.color}80)`
                      : isSelected
                      ? `drop-shadow(0 0 10px ${region.color}) drop-shadow(0 0 20px ${region.color}60)`
                      : `drop-shadow(0 0 6px ${region.color}80)`,
                  }}
                />

                <motion.path
                  d={region.path}
                  fill="none"
                  stroke={region.color}
                  strokeWidth="0.5"
                  strokeOpacity={isHovered ? 0.8 : 0.4}
                  strokeDasharray="3 6"
                >
                  {isHovered && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-18"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </motion.path>
              </motion.g>
            );
          })}

          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.circle
                key={ripple.id}
                cx={ripple.x}
                cy={ripple.y}
                r="0"
                fill="none"
                stroke={ripple.color}
                strokeWidth="3"
                initial={{ r: 0, opacity: 1 }}
                animate={{ r: 80, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 10px ${ripple.color})`,
                }}
              />
            ))}
          </AnimatePresence>
        </svg>

        <AnimatePresence>
          {hoveredRegion &&
            regionConfigs
              .filter((r) => r.id === hoveredRegion)
              .map((region) => (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute pointer-events-none z-20 px-4 py-2 rounded-md glass-card cyber-border"
                  style={{
                    left: `${(region.tooltipX / 500) * 100}%`,
                    top: `${(region.tooltipY / 600) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    borderColor: `${region.color}60`,
                  }}
                >
                  <span
                    className="font-display font-bold text-sm tracking-wider"
                    style={{
                      color: region.color,
                      textShadow: `0 0 10px ${region.color}80`,
                    }}
                  >
                    {region.name}
                  </span>
                </motion.div>
              ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
