import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Moon, RefreshCw, Play, Pause, Clock, Sparkles, Target, Bookmark, Lightbulb } from "lucide-react";
import GlowCard from "@/components/shared/GlowCard";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface MemoryStage {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  color: string;
  retention: number;
  duration: string;
  capacity: string;
  icon: string;
}

interface MemoryParams {
  hippocampus: number;
  repetition: number;
  sleepQuality: number;
}

interface HistoryPoint {
  time: number;
  sensory: number;
  shortTerm: number;
  longTerm: number;
}

const initialStages: MemoryStage[] = [
  {
    id: "sensory",
    name: "感觉记忆",
    nameEn: "Sensory Memory",
    description: "信息通过感官进入大脑，保持极短时间",
    color: "#00f0ff",
    retention: 100,
    duration: "0.25-2秒",
    capacity: "所有感官输入",
    icon: "Zap",
  },
  {
    id: "shortTerm",
    name: "短期记忆",
    nameEn: "Short-Term Memory",
    description: "经过注意筛选的信息进入短期存储",
    color: "#ffd700",
    retention: 0,
    duration: "15-30秒",
    capacity: "7±2个组块",
    icon: "Bookmark",
  },
  {
    id: "longTerm",
    name: "长期记忆",
    nameEn: "Long-Term Memory",
    description: "通过复述和巩固，信息永久存储",
    color: "#00ff88",
    retention: 0,
    duration: "数分钟至一生",
    capacity: "理论上无限",
    icon: "Brain",
  },
];

const calculateRetention = (params: MemoryParams): { sensory: number; shortTerm: number; longTerm: number } => {
  const { hippocampus, repetition, sleepQuality } = params;

  const sensoryBase = 100;
  const sensoryDecay = 0;

  const shortTermBase = 30;
  const attentionBoost = hippocampus * 0.3;
  const repetitionBoost = repetition * 0.25;
  const shortTermRetention = Math.min(100, shortTermBase + attentionBoost + repetitionBoost);

  const longTermBase = 5;
  const consolidationBoost = hippocampus * 0.45;
  const repetitionConsolidation = repetition * 0.35;
  const sleepBoost = sleepQuality * 0.35;
  const longTermRetention = Math.min(
    100,
    longTermBase + consolidationBoost + repetitionConsolidation + sleepBoost
  );

  return {
    sensory: sensoryBase - sensoryDecay,
    shortTerm: Math.round(shortTermRetention),
    longTerm: Math.round(longTermRetention),
  };
};

const getRetentionLevel = (value: number): { level: string; color: string } => {
  if (value < 20) return { level: "微弱", color: "#ff3333" };
  if (value < 40) return { level: "较弱", color: "#ff9933" };
  if (value < 60) return { level: "中等", color: "#ffd700" };
  if (value < 80) return { level: "较强", color: "#00ff88" };
  return { level: "极强", color: "#00f0ff" };
};

const getStageIcon = (iconName: string, color: string, size: string = "w-5 h-5") => {
  const iconProps = { className: size, style: { color } };
  switch (iconName) {
    case "Zap":
      return <Zap {...iconProps} />;
    case "Bookmark":
      return <Bookmark {...iconProps} />;
    case "Brain":
      return <Brain {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export default function MemoryFormationSimulator() {
  const [knowledge, setKnowledge] = useState<string>("");
  const [params, setParams] = useState<MemoryParams>({
    hippocampus: 50,
    repetition: 50,
    sleepQuality: 50,
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [currentStage, setCurrentStage] = useState<string>("sensory");
  const [simulationTime, setSimulationTime] = useState(0);
  const historyRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const retention = useMemo(() => calculateRetention(params), [params]);
  const stages = useMemo(
    () =>
      initialStages.map((stage) => ({
        ...stage,
        retention:
          stage.id === "sensory"
            ? retention.sensory
            : stage.id === "shortTerm"
              ? retention.shortTerm
              : retention.longTerm,
      })),
    [retention]
  );

  const handleParamChange = useCallback((param: keyof MemoryParams, value: number) => {
    setParams((prev) => ({ ...prev, [param]: value }));
  }, []);

  const resetSimulation = useCallback(() => {
    setParams({ hippocampus: 50, repetition: 50, sleepQuality: 50 });
    setHistory([]);
    setIsSimulating(false);
    setCurrentStage("sensory");
    setSimulationTime(0);
    timeRef.current = 0;
    if (historyRef.current) {
      clearInterval(historyRef.current);
      historyRef.current = null;
    }
  }, []);

  const startSimulation = useCallback(() => {
    if (!knowledge.trim()) return;
    setIsSimulating(true);
    setHistory([]);
    timeRef.current = 0;
    setSimulationTime(0);
    setCurrentStage("sensory");
  }, [knowledge]);

  const toggleSimulation = useCallback(() => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      if (!knowledge.trim()) return;
      setIsSimulating(true);
    }
  }, [isSimulating, knowledge]);

  useEffect(() => {
    if (!isSimulating) {
      if (historyRef.current) {
        clearInterval(historyRef.current);
        historyRef.current = null;
      }
      return;
    }

    historyRef.current = window.setInterval(() => {
      timeRef.current += 1;
      const t = timeRef.current;
      setSimulationTime(t);

      if (t < 5) {
        setCurrentStage("sensory");
      } else if (t < 20) {
        setCurrentStage("shortTerm");
      } else {
        setCurrentStage("longTerm");
      }

      const sensory = Math.max(0, retention.sensory - t * 8);
      const shortTermBase = retention.shortTerm;
      const shortTerm =
        t < 5
          ? shortTermBase * 0.2
          : t < 20
            ? shortTermBase * (0.3 + (t - 5) * 0.05)
            : shortTermBase * 0.8;
      const longTermBase = retention.longTerm;
      const longTerm =
        t < 10
          ? longTermBase * 0.1
          : t < 30
            ? longTermBase * (0.1 + (t - 10) * 0.04)
            : longTermBase;

      setHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: t,
            sensory: Math.max(0, Math.min(100, sensory)),
            shortTerm: Math.max(0, Math.min(100, shortTerm)),
            longTerm: Math.max(0, Math.min(100, longTerm)),
          },
        ];
        return newHistory.slice(-60);
      });
    }, 500);

    return () => {
      if (historyRef.current) {
        clearInterval(historyRef.current);
      }
    };
  }, [isSimulating, retention]);

  const generateChartPath = (
    dataKey: "sensory" | "shortTerm" | "longTerm",
    width: number,
    height: number
  ) => {
    if (history.length < 2) return "";

    const values = history.map((h) => h[dataKey] || 0);
    const minVal = 0;
    const maxVal = 100;
    const range = maxVal - minVal;

    const points = values.map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((val - minVal) / range) * height;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (2 * (curr.x - prev.x)) / 3;
      const cpy2 = curr.y;
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  const chartWidth = 600;
  const chartHeight = 200;

  const paramConfig = [
    {
      id: "hippocampus" as const,
      name: "海马体参与度",
      nameEn: "Hippocampus Activity",
      color: "#00f0ff",
      description: "海马体在记忆巩固中的活跃程度",
      icon: "Brain",
    },
    {
      id: "repetition" as const,
      name: "重复次数",
      nameEn: "Repetition",
      color: "#ffd700",
      description: "对信息进行复述和复习的频率",
      icon: "RefreshCw",
    },
    {
      id: "sleepQuality" as const,
      name: "睡眠质量",
      nameEn: "Sleep Quality",
      color: "#8b5cf6",
      description: "深度睡眠对记忆巩固的促进作用",
      icon: "Moon",
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-cyber-cyan" />
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold"
                style={{
                  color: "#00f0ff",
                  textShadow:
                    "0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4)",
                }}
              >
                记忆形成模拟器
              </h1>
              <Brain className="w-10 h-10 text-cyber-cyan" />
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              输入一个新知识，观察它如何从感觉记忆转化为短期记忆，最终巩固为长期记忆。
              调整参数探索海马体、重复和睡眠如何影响记忆保留率。
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-6">
            <AnimatedSection delay={0.1}>
              <GlowCard color="#00f0ff" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-cyber-cyan" />
                  <span className="text-sm font-mono text-cyber-cyan">输入知识点</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={knowledge}
                    onChange={(e) => setKnowledge(e.target.value)}
                    placeholder="例如：海马体负责记忆巩固..."
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/30 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyan-400/60 transition-colors"
                    style={{ color: "#00f0ff" }}
                  />
                  {knowledge && (
                    <motion.div
                      className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ boxShadow: "0 0 10px #00ff88" }}
                    />
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <motion.button
                    onClick={startSimulation}
                    disabled={!knowledge.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "rgba(0, 240, 255, 0.15)",
                      border: "1px solid rgba(0, 240, 255, 0.4)",
                      color: "#00f0ff",
                    }}
                    whileHover={knowledge.trim() ? { scale: 1.02 } : {}}
                    whileTap={knowledge.trim() ? { scale: 0.98 } : {}}
                  >
                    <Play className="w-4 h-4" />
                    开始模拟
                  </motion.button>

                  <motion.button
                    onClick={toggleSimulation}
                    disabled={!knowledge.trim() || !isSimulating}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      color: "#ffd700",
                    }}
                    whileHover={knowledge.trim() && isSimulating ? { scale: 1.05 } : {}}
                    whileTap={knowledge.trim() && isSimulating ? { scale: 0.95 } : {}}
                  >
                    {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </motion.button>

                  <motion.button
                    onClick={resetSimulation}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-sm transition-all"
                    style={{
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                      border: "1px solid rgba(255, 107, 107, 0.3)",
                      color: "#ff6b6b",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                </div>

                {isSimulating && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-800">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono text-cyan-400">
                      模拟时间: {(simulationTime * 0.5).toFixed(1)}s
                    </span>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                )}
              </GlowCard>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <GlowCard color="#ffd700" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyber-yellow" />
                    <span className="text-sm font-mono text-cyber-yellow">参数调节</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {paramConfig.map((param, index) => (
                    <div key={param.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {param.id === "hippocampus" && (
                            <Brain className="w-4 h-4" style={{ color: param.color }} />
                          )}
                          {param.id === "repetition" && (
                            <RefreshCw className="w-4 h-4" style={{ color: param.color }} />
                          )}
                          {param.id === "sleepQuality" && (
                            <Moon className="w-4 h-4" style={{ color: param.color }} />
                          )}
                          <div>
                            <span className="text-sm font-display font-semibold" style={{ color: param.color }}>
                              {param.name}
                            </span>
                            <span className="text-[10px] text-gray-500 ml-2 font-mono">
                              {param.nameEn}
                            </span>
                          </div>
                        </div>
                        <motion.span
                          className="text-sm font-mono font-bold"
                          style={{ color: param.color }}
                          key={params[param.id]}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {params[param.id]}%
                        </motion.span>
                      </div>

                      <p className="text-[11px] text-gray-500 ml-6 font-mono">
                        {param.description}
                      </p>

                      <div className="relative ml-6">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={params[param.id]}
                          onChange={(e) => handleParamChange(param.id, Number(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            color: param.color,
                            background: `linear-gradient(to right, ${param.color} 0%, ${param.color} ${params[param.id]}%, rgba(255,255,255,0.1) ${params[param.id]}%, rgba(255,255,255,0.1) 100%)`,
                          }}
                        />
                        <div className="flex justify-between mt-1 text-[10px] text-gray-600 font-mono">
                          <span>低</span>
                          <span style={{ color: param.color }}>中</span>
                          <span>高</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </AnimatedSection>
          </div>

          <div className="xl:col-span-7 space-y-6">
            <AnimatedSection delay={0.2}>
              <GlowCard color="#00ff88" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-mono text-green-400">记忆三阶段转化</span>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-3 gap-4">
                    {stages.map((stage, index) => {
                      const status = getRetentionLevel(stage.retention);
                      const isActive = currentStage === stage.id && isSimulating;
                      return (
                        <AnimatedSection key={stage.id} delay={0.25 + index * 0.1}>
                          <motion.div
                            className="relative p-4 rounded-lg"
                            style={{
                              backgroundColor: `${stage.color}08`,
                              border: `1px solid ${isActive ? stage.color : stage.color}30`,
                              boxShadow: isActive ? `0 0 20px ${stage.color}40` : "none",
                            }}
                            animate={
                              isActive
                                ? {
                                    boxShadow: [
                                      `0 0 10px ${stage.color}40`,
                                      `0 0 25px ${stage.color}60`,
                                      `0 0 10px ${stage.color}40`,
                                    ],
                                  }
                                : {}
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {isActive && (
                              <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                style={{ boxShadow: "0 0 8px #00ff88" }}
                              />
                            )}

                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${stage.color}20` }}
                              >
                                {getStageIcon(stage.icon, stage.color)}
                              </div>
                              <div>
                                <div className="text-sm font-display font-semibold" style={{ color: stage.color }}>
                                  {stage.name}
                                </div>
                                <div className="text-[9px] text-gray-500 font-mono">
                                  {stage.nameEn}
                                </div>
                              </div>
                            </div>

                            <motion.div
                              className="text-3xl font-display font-bold mb-2"
                              style={{ color: stage.color }}
                              key={stage.retention}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                            >
                              {stage.retention}%
                            </motion.div>

                            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden mb-3">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: stage.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${stage.retention}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-500 font-mono">保留强度</span>
                                <span style={{ color: status.color }} className="font-mono">
                                  {status.level}
                                </span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-500 font-mono">持续时间</span>
                                <span className="text-gray-400 font-mono">{stage.duration}</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-500 font-mono">容量</span>
                                <span className="text-gray-400 font-mono">{stage.capacity}</span>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatedSection>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-6">
                    {stages.map((stage, index) => (
                      <div key={stage.id} className="flex items-center">
                        <motion.div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: currentStage === stage.id ? stage.color : `${stage.color}40`,
                            boxShadow:
                              currentStage === stage.id ? `0 0 8px ${stage.color}` : "none",
                          }}
                        />
                        {index < stages.length - 1 && (
                          <motion.div
                            className="w-16 h-0.5 mx-2"
                            style={{
                              background: `linear-gradient(to right, ${stages[index].color}60, ${stages[index + 1].color}60)`,
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </AnimatedSection>

            <AnimatedSection delay={0.35}>
              <GlowCard color="#00f0ff" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyber-cyan" />
                    <span className="text-sm font-mono text-cyber-cyan">记忆转化过程</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isSimulating ? "#00ff88" : "#666",
                        boxShadow: isSimulating ? "0 0 8px #00ff88" : "none",
                      }}
                      animate={isSimulating ? { opacity: [1, 0.4, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-[10px] text-gray-500 font-mono">
                      {isSimulating ? "模拟中" : "未开始"}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 mb-4 font-mono">
                  实时追踪记忆在三个阶段中的保留率变化
                </p>

                <div className="relative w-full overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full min-w-[500px] h-auto"
                    style={{ maxHeight: `${chartHeight}px` }}
                  >
                    <defs>
                      <linearGradient id="sensoryAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="shortTermAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="longTermAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {[0, 25, 50, 75, 100].map((val) => {
                      const y = chartHeight - (val / 100) * chartHeight;
                      return (
                        <g key={val}>
                          <line
                            x1="40"
                            y1={y}
                            x2={chartWidth - 10}
                            y2={y}
                            stroke={val === 50 ? "#444" : "#222"}
                            strokeWidth="1"
                            strokeDasharray={val === 50 ? "4 2" : "2 2"}
                          />
                          <text
                            x="35"
                            y={y + 3}
                            fill="#666"
                            fontSize="9"
                            fontFamily="JetBrains Mono"
                            textAnchor="end"
                          >
                            {val}%
                          </text>
                        </g>
                      );
                    })}

                    {history.length > 1 && (
                      <>
                        <path
                          d={generateChartPath("sensory", chartWidth - 50, chartHeight - 20)}
                          transform="translate(40, 10)"
                          stroke="#00f0ff"
                          strokeWidth="2"
                          fill="none"
                          style={{ filter: "drop-shadow(0 0 3px #00f0ff80)" }}
                          opacity={0.8}
                        />
                        <path
                          d={generateChartPath("shortTerm", chartWidth - 50, chartHeight - 20)}
                          transform="translate(40, 10)"
                          stroke="#ffd700"
                          strokeWidth="2"
                          fill="none"
                          style={{ filter: "drop-shadow(0 0 3px #ffd70080)" }}
                          opacity={0.8}
                        />
                        <path
                          d={generateChartPath("longTerm", chartWidth - 50, chartHeight - 20)}
                          transform="translate(40, 10)"
                          stroke="#00ff88"
                          strokeWidth="2.5"
                          fill="none"
                          style={{ filter: "drop-shadow(0 0 4px #00ff8880)" }}
                        />
                      </>
                    )}

                    <text
                      x={chartWidth / 2}
                      y={chartHeight - 5}
                      fill="#555"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      时间 (30s)
                    </text>
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-800">
                  {stages.map((stage) => (
                    <div key={stage.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: stage.color,
                          boxShadow: `0 0 6px ${stage.color}`,
                        }}
                      />
                      <span className="text-[11px] font-mono" style={{ color: stage.color }}>
                        {stage.name}
                      </span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </AnimatedSection>

            <AnimatedSection delay={0.45}>
              <GlowCard color="#8b5cf6" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-mono text-purple-400">记忆巩固原理</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono text-cyan-400">海马体作用</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      海马体是记忆巩固的关键结构，负责将短期记忆转化为长期记忆。活跃的海马体能显著提升记忆保留效果。
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-mono text-yellow-400">重复效应</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      根据间隔重复效应，定期复习能加强神经连接，将信息从短期记忆转移到长期记忆存储中。
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-mono text-purple-400">睡眠巩固</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      深度睡眠期间，海马体与新皮层进行对话，将记忆从临时存储转移到长期存储，是记忆巩固的重要环节。
                    </p>
                  </div>
                </div>
              </GlowCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
