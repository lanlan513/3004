import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Map, GitBranch, Columns, ChevronRight, Zap } from "lucide-react";
import GlowCard from "@/components/shared/GlowCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { brainRegionPositions, behaviors } from "@/data/brainFunctionMap";
import type { BehaviorData, BrainRegionPosition, NeuralActivityStep } from "@/data/brainFunctionMap";

const BRAIN_SVG_W = 440;
const BRAIN_SVG_H = 380;

function getRegionById(id: string): BrainRegionPosition | undefined {
  return brainRegionPositions.find((r) => r.id === id);
}

function getStepRegionName(step: NeuralActivityStep): string {
  const region = getRegionById(step.regionId);
  return region ? region.name : step.regionId;
}

function getStepRegionColor(step: NeuralActivityStep): string {
  const region = getRegionById(step.regionId);
  return region ? region.color : "#888";
}

function getIntensityAtTime(step: NeuralActivityStep, elapsed: number): number {
  if (elapsed < step.time) return 0;
  if (elapsed > step.time + step.duration) return 0;
  const mid = step.time + step.duration / 2;
  const halfDur = step.duration / 2;
  const dist = Math.abs(elapsed - mid);
  const ratio = 1 - dist / halfDur;
  return ratio * step.intensity;
}

function BrainSVG({
  highlightedRegions,
  regionIntensities,
  activeStepRegion,
}: {
  highlightedRegions: Set<string>;
  regionIntensities: Record<string, number>;
  activeStepRegion: string | null;
}) {
  return (
    <svg viewBox={`0 0 ${BRAIN_SVG_W} ${BRAIN_SVG_H}`} className="w-full h-auto">
      <defs>
        <filter id="brainGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="brainBg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1a1a3e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0a0a1a" stopOpacity="0.9" />
        </radialGradient>
        {brainRegionPositions.map((r) => (
          <radialGradient key={r.id} id={`grad-${r.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={r.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={r.color} stopOpacity="0.3" />
          </radialGradient>
        ))}
      </defs>

      <ellipse cx={BRAIN_SVG_W / 2 - 10} cy={BRAIN_SVG_H / 2 - 10} rx={195} ry={165} fill="url(#brainBg)" stroke="#334155" strokeWidth="1.5" />
      <path d="M 90 170 Q 90 60 230 50 Q 370 40 380 170" stroke="#475569" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
      <path d="M 90 170 Q 90 290 230 300 Q 370 310 380 170" stroke="#475569" strokeWidth="0.8" fill="none" strokeDasharray="3 3" />
      <line x1={BRAIN_SVG_W / 2 - 10} y1="40" x2={BRAIN_SVG_W / 2 - 10} y2="310" stroke="#334155" strokeWidth="0.6" strokeDasharray="4 4" />

      {brainRegionPositions.map((region) => {
        const isHighlighted = highlightedRegions.has(region.id);
        const intensity = regionIntensities[region.id] || 0;
        const isActive = activeStepRegion === region.id;

        return (
          <g key={region.id}>
            <AnimatePresence>
              {isActive && (
                <motion.ellipse
                  cx={region.cx}
                  cy={region.cy}
                  rx={region.rx + 12}
                  ry={region.ry + 10}
                  fill="none"
                  stroke={region.color}
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </AnimatePresence>

            <motion.ellipse
              cx={region.cx}
              cy={region.cy}
              rx={region.rx}
              ry={region.ry}
              fill={`url(#grad-${region.id})`}
              stroke={region.color}
              strokeWidth={isActive ? 2.5 : 1}
              animate={{
                opacity: isHighlighted ? (0.5 + intensity * 0.5) : 0.12,
                filter: isActive ? `drop-shadow(0 0 12px ${region.color})` : isHighlighted ? `drop-shadow(0 0 6px ${region.color}80)` : "none",
              }}
              transition={{ duration: 0.4 }}
            />

            {(isHighlighted || intensity > 0.3) && (
              <motion.text
                x={region.cx}
                y={region.cy + 3}
                textAnchor="middle"
                fill={region.color}
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
                animate={{ opacity: Math.max(0.4, intensity) }}
                transition={{ duration: 0.3 }}
              >
                {region.name.length > 5 ? region.name.slice(0, 5) : region.name}
              </motion.text>
            )}

            {isActive && (
              <motion.circle
                cx={region.cx}
                cy={region.cy - region.ry - 6}
                r="3"
                fill={region.color}
                animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TimelineBar({
  behavior,
  currentTime,
  onStepClick,
  activeStepId,
}: {
  behavior: BehaviorData;
  currentTime: number;
  onStepClick: (step: NeuralActivityStep) => void;
  activeStepId: string | null;
}) {
  const maxTime = Math.max(...behavior.steps.map((s) => s.time + s.duration));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4" style={{ color: behavior.color }} />
        <span className="text-xs font-mono" style={{ color: behavior.color }}>
          神经活动时间轴
        </span>
        <span className="text-xs font-mono text-gray-600 ml-auto">{(currentTime / 1000).toFixed(1)}s</span>
      </div>

      <div className="relative h-8 bg-gray-900/60 rounded-lg overflow-hidden border border-gray-800">
        {behavior.steps.map((step) => {
          const left = (step.time / maxTime) * 100;
          const width = (step.duration / maxTime) * 100;
          const isActive = activeStepId === step.id;

          return (
            <motion.div
              key={step.id}
              className="absolute top-1 bottom-1 rounded cursor-pointer"
              style={{ left: `${left}%`, width: `${width}%` }}
              animate={{
                backgroundColor: isActive ? `${getStepRegionColor(step)}cc` : `${getStepRegionColor(step)}40`,
                boxShadow: isActive ? `0 0 10px ${getStepRegionColor(step)}80` : "none",
              }}
              onClick={() => onStepClick(step)}
              whileHover={{ opacity: 1, y: -1 }}
              transition={{ duration: 0.2 }}
            />
          );
        })}

        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
          style={{ left: `${(currentTime / maxTime) * 100}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      <div className="space-y-1.5 mt-3">
        {behavior.steps.map((step, index) => {
          const isActive = activeStepId === step.id;
          const isPast = currentTime >= step.time + step.duration;
          const regionColor = getStepRegionColor(step);

          return (
            <motion.div
              key={step.id}
              className="flex items-start gap-2 px-2 py-1.5 rounded-md cursor-pointer"
              animate={{
                backgroundColor: isActive ? `${regionColor}15` : "transparent",
              }}
              onClick={() => onStepClick(step)}
              whileHover={{ backgroundColor: `${regionColor}10` }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <motion.div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold border"
                  animate={{
                    backgroundColor: isPast ? regionColor : isActive ? `${regionColor}60` : "transparent",
                    borderColor: regionColor,
                    color: isPast ? "#000" : regionColor,
                    boxShadow: isActive ? `0 0 8px ${regionColor}80` : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {index + 1}
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${regionColor}20`, color: regionColor }}
                  >
                    {getStepRegionName(step)}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-0.5"
                    >
                      <ChevronRight className="w-2.5 h-2.5" style={{ color: regionColor }} />
                      <span className="text-[9px] font-mono" style={{ color: regionColor }}>
                        活跃
                      </span>
                    </motion.div>
                  )}
                </div>
                <p className={`text-[11px] leading-relaxed mt-0.5 ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ComparisonView({ selectedIds }: { selectedIds: string[] }) {
  const selectedBehaviors = behaviors.filter((b) => selectedIds.includes(b.id));

  const allRegionIds = new Set<string>();
  selectedBehaviors.forEach((b) => b.regions.forEach((r) => allRegionIds.add(r)));

  const regionInfo = Array.from(allRegionIds).map((id) => {
    const pos = getRegionById(id);
    return {
      id,
      name: pos?.name || id,
      color: pos?.color || "#888",
      behaviors: selectedBehaviors.map((b) => ({
        behaviorId: b.id,
        behaviorName: b.name,
        behaviorColor: b.color,
        involved: b.regions.includes(id),
        steps: b.steps.filter((s) => s.regionId === id),
      })),
    };
  });

  regionInfo.sort((a, b) => {
    const aCount = a.behaviors.filter((be) => be.involved).length;
    const bCount = b.behaviors.filter((be) => be.involved).length;
    return bCount - aCount;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Columns className="w-4 h-4 text-cyber-cyan" />
        <span className="text-sm font-mono text-gray-400">
          行为对比 · {selectedBehaviors.map((b) => b.name).join(" vs ")}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 px-3 text-gray-500">脑区</th>
              {selectedBehaviors.map((b) => (
                <th key={b.id} className="text-center py-2 px-3" style={{ color: b.color }}>
                  {b.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regionInfo.map((region) => (
              <tr key={region.id} className="border-b border-gray-800/50">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
                    <span style={{ color: region.color }}>{region.name}</span>
                  </div>
                </td>
                {region.behaviors.map((b) => (
                  <td key={b.behaviorId} className="text-center py-2 px-3">
                    {b.involved ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full"
                        style={{
                          backgroundColor: `${b.behaviorColor}20`,
                          border: `1.5px solid ${b.behaviorColor}`,
                          color: b.behaviorColor,
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </motion.div>
                    ) : (
                      <span className="text-gray-700">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {selectedBehaviors.map((b) => (
          <GlowCard key={b.id} color={b.color} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{b.icon}</span>
              <span className="font-display font-bold" style={{ color: b.color }}>
                {b.name}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{b.workflowDescription}</p>
            <div className="flex flex-wrap gap-1">
              {b.steps.map((step, i) => (
                <div
                  key={step.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                  style={{
                    backgroundColor: `${getStepRegionColor(step)}15`,
                    color: getStepRegionColor(step),
                    border: `1px solid ${getStepRegionColor(step)}30`,
                  }}
                >
                  <span className="font-bold">{i + 1}</span>
                  <span>{getStepRegionName(step)}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

export default function BrainFunctionMap() {
  const [selectedBehaviorId, setSelectedBehaviorId] = useState<string>("reading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const selectedBehavior = behaviors.find((b) => b.id === selectedBehaviorId) || behaviors[0];
  const maxTime = Math.max(...selectedBehavior.steps.map((s) => s.time + s.duration));

  const highlightedRegions = new Set(selectedBehavior.regions);

  const regionIntensities: Record<string, number> = {};
  if (isPlaying || currentTime > 0) {
    for (const step of selectedBehavior.steps) {
      const intensity = getIntensityAtTime(step, currentTime);
      if (intensity > 0) {
        regionIntensities[step.regionId] = Math.max(regionIntensities[step.regionId] || 0, intensity);
      }
    }
  }

  const activeStepRegion = activeStepId
    ? selectedBehavior.steps.find((s) => s.id === activeStepId)?.regionId || null
    : null;

  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveStepId(null);
    startTimeRef.current = 0;
  }, []);

  const startAnimation = useCallback(() => {
    resetAnimation();
    setIsPlaying(true);
    startTimeRef.current = performance.now();

    const totalDuration = maxTime + 500;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed, totalDuration);
      setCurrentTime(t);

      let currentActive: NeuralActivityStep | null = null;
      for (let i = selectedBehavior.steps.length - 1; i >= 0; i--) {
        const step = selectedBehavior.steps[i];
        if (t >= step.time && t <= step.time + step.duration) {
          currentActive = step;
          break;
        }
      }
      setActiveStepId(currentActive?.id || null);

      if (elapsed < totalDuration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setIsPlaying(false), 300);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [resetAnimation, maxTime, selectedBehavior]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    resetAnimation();
  }, [selectedBehaviorId, resetAnimation]);

  const handleStepClick = (step: NeuralActivityStep) => {
    if (isPlaying) return;
    setCurrentTime(step.time);
    setActiveStepId(step.id);
  };

  const toggleComparison = (id: string) => {
    setComparisonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Map className="w-10 h-10 text-purple-400" />
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold"
                style={{
                  color: "#a78bfa",
                  textShadow: "0 0 10px rgba(167, 139, 250, 0.8), 0 0 20px rgba(167, 139, 250, 0.6), 0 0 30px rgba(167, 139, 250, 0.4)",
                }}
              >
                大脑功能地图
              </h1>
              <Map className="w-10 h-10 text-purple-400" />
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              选择一个日常行为，观察参与脑区的协同工作流程与神经活动时序
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {behaviors.map((b) => (
              <motion.button
                key={b.id}
                onClick={() => {
                  if (!comparisonMode) {
                    setSelectedBehaviorId(b.id);
                  } else {
                    toggleComparison(b.id);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm transition-all duration-300"
                style={{
                  backgroundColor:
                    comparisonMode
                      ? comparisonIds.includes(b.id)
                        ? `${b.color}25`
                        : "rgba(30,30,50,0.6)"
                      : selectedBehaviorId === b.id
                        ? `${b.color}25`
                        : "rgba(30,30,50,0.6)",
                  border: `1.5px solid ${
                    comparisonMode
                      ? comparisonIds.includes(b.id)
                        ? b.color
                        : "#444"
                      : selectedBehaviorId === b.id
                        ? b.color
                        : "#444"
                  }`,
                  color:
                    comparisonMode
                      ? comparisonIds.includes(b.id)
                        ? b.color
                        : "#888"
                      : selectedBehaviorId === b.id
                        ? b.color
                        : "#888",
                  boxShadow:
                    comparisonMode
                      ? comparisonIds.includes(b.id)
                        ? `0 0 15px ${b.color}40`
                        : "none"
                      : selectedBehaviorId === b.id
                        ? `0 0 15px ${b.color}40`
                        : "none",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-base">{b.icon}</span>
                <span>{b.name}</span>
                {comparisonMode && comparisonIds.includes(b.id) && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: b.color }}
                  />
                )}
              </motion.button>
            ))}

            <div className="w-px h-8 bg-gray-700 mx-2" />

            <motion.button
              onClick={() => {
                setComparisonMode(!comparisonMode);
                if (comparisonMode) {
                  setComparisonIds([]);
                } else {
                  setComparisonIds([selectedBehaviorId]);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full font-mono text-xs transition-all"
              style={{
                backgroundColor: comparisonMode ? "rgba(0, 240, 255, 0.15)" : "rgba(30,30,50,0.6)",
                border: `1.5px solid ${comparisonMode ? "#00f0ff" : "#444"}`,
                color: comparisonMode ? "#00f0ff" : "#888",
                boxShadow: comparisonMode ? "0 0 12px rgba(0,240,255,0.3)" : "none",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Columns className="w-3.5 h-3.5" />
              {comparisonMode ? "退出对比" : "多行为对比"}
            </motion.button>
          </div>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          {comparisonMode && comparisonIds.length >= 2 ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <GlowCard color="#a78bfa" className="p-6">
                <ComparisonView selectedIds={comparisonIds} />
              </GlowCard>
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <GlowCard color={selectedBehavior.color} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{selectedBehavior.icon}</span>
                        <span className="font-display font-bold text-lg" style={{ color: selectedBehavior.color }}>
                          {selectedBehavior.name}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">— {selectedBehavior.description.slice(0, 30)}…</span>
                      </div>
                      <motion.div
                        className="px-3 py-1 rounded-full text-xs font-mono"
                        animate={{
                          backgroundColor: isPlaying ? `${selectedBehavior.color}20` : "rgba(100,100,100,0.2)",
                          borderColor: isPlaying ? selectedBehavior.color : "#666",
                        }}
                        style={{ border: "1px solid", color: isPlaying ? selectedBehavior.color : "#888" }}
                      >
                        {isPlaying ? "● 模拟中" : "○ 就绪"}
                      </motion.div>
                    </div>

                    <div className="flex justify-center">
                      <BrainSVG
                        highlightedRegions={highlightedRegions}
                        regionIntensities={regionIntensities}
                        activeStepRegion={activeStepRegion}
                      />
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-4">
                      <motion.button
                        onClick={isPlaying ? resetAnimation : startAnimation}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-sm transition-all duration-300"
                        style={{
                          backgroundColor: isPlaying ? "rgba(255,107,107,0.8)" : selectedBehavior.color,
                          color: isPlaying ? "#fff" : "#000",
                          boxShadow: isPlaying
                            ? "0 0 20px rgba(255,107,107,0.5)"
                            : `0 0 20px ${selectedBehavior.color}50`,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isPlaying ? (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            重置
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            播放动画
                          </>
                        )}
                      </motion.button>
                    </div>
                  </GlowCard>

                  <GlowCard color={selectedBehavior.color} className="p-6">
                    <TimelineBar
                      behavior={selectedBehavior}
                      currentTime={currentTime}
                      onStepClick={handleStepClick}
                      activeStepId={activeStepId}
                    />
                  </GlowCard>
                </div>

                <div className="space-y-4">
                  <GlowCard color={selectedBehavior.color} className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4" style={{ color: selectedBehavior.color }} />
                      <span className="text-xs font-mono" style={{ color: selectedBehavior.color }}>
                        协同工作流
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedBehavior.workflowDescription}
                    </p>
                  </GlowCard>

                  <GlowCard color={selectedBehavior.color} className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Map className="w-4 h-4" style={{ color: selectedBehavior.color }} />
                      <span className="text-xs font-mono" style={{ color: selectedBehavior.color }}>
                        参与脑区 ({selectedBehavior.regions.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {selectedBehavior.regions.map((regionId) => {
                        const region = getRegionById(regionId);
                        if (!region) return null;
                        const isCurrentlyActive = activeStepRegion === regionId;
                        return (
                          <motion.div
                            key={regionId}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg"
                            animate={{
                              backgroundColor: isCurrentlyActive ? `${region.color}15` : "transparent",
                              boxShadow: isCurrentlyActive ? `0 0 8px ${region.color}30` : "none",
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: region.color,
                                boxShadow: isCurrentlyActive ? `0 0 8px ${region.color}` : "none",
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="text-xs font-mono font-bold"
                                  style={{ color: isCurrentlyActive ? region.color : "#aaa" }}
                                >
                                  {region.name}
                                </span>
                                <span className="text-[10px] text-gray-600 font-mono">{region.nameEn}</span>
                              </div>
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded mt-0.5 inline-block"
                                style={{ backgroundColor: `${region.color}15`, color: `${region.color}aa` }}
                              >
                                {region.category}
                              </span>
                            </div>
                            {isCurrentlyActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: region.color, boxShadow: `0 0 6px ${region.color}` }}
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </GlowCard>

                  <GlowCard color="#ffd700" className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-cyber-yellow" />
                      <span className="text-xs font-mono text-cyber-yellow">行为概览</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      {selectedBehavior.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="text-center p-2 rounded-lg"
                        style={{
                          backgroundColor: `${selectedBehavior.color}08`,
                          border: `1px solid ${selectedBehavior.color}25`,
                        }}
                      >
                        <div className="text-lg font-display font-bold" style={{ color: selectedBehavior.color }}>
                          {selectedBehavior.regions.length}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">参与脑区</div>
                      </div>
                      <div
                        className="text-center p-2 rounded-lg"
                        style={{
                          backgroundColor: `${selectedBehavior.color}08`,
                          border: `1px solid ${selectedBehavior.color}25`,
                        }}
                      >
                        <div className="text-lg font-display font-bold" style={{ color: selectedBehavior.color }}>
                          {selectedBehavior.steps.length}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">活动阶段</div>
                      </div>
                    </div>
                  </GlowCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
