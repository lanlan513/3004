import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Activity, Brain, Heart, Zap, AlertTriangle, RefreshCw, TrendingUp, Moon, Users, Target } from "lucide-react";
import GlowCard from "@/components/shared/GlowCard";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface NeurotransmitterLevel {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  level: number;
  min: number;
  max: number;
  baseline: number;
  description: string;
}

interface PhysiologicalMetric {
  id: string;
  name: string;
  icon: string;
  value: number;
  color: string;
  description: string;
}

interface HistoryPoint {
  time: number;
  metrics: Record<string, number>;
}

interface TransmitterEffect {
  [key: string]: {
    attention: number;
    mood: number;
    motivation: number;
    anxiety: number;
    cognitiveFlexibility: number;
    sleepiness: number;
    socialBehavior: number;
    impulseControl: number;
  };
}

const initialTransmitters: NeurotransmitterLevel[] = [
  {
    id: "dopamine",
    name: "多巴胺",
    nameEn: "Dopamine",
    color: "#ffd700",
    level: 50,
    min: 0,
    max: 100,
    baseline: 50,
    description: "奖赏系统、动机、运动控制",
  },
  {
    id: "serotonin",
    name: "血清素",
    nameEn: "Serotonin",
    color: "#00ff88",
    level: 50,
    min: 0,
    max: 100,
    baseline: 50,
    description: "情绪稳定、睡眠调节、食欲控制",
  },
  {
    id: "norepinephrine",
    name: "去甲肾上腺素",
    nameEn: "Norepinephrine",
    color: "#0066ff",
    level: 50,
    min: 0,
    max: 100,
    baseline: 50,
    description: "警觉性、注意力、应激反应",
  },
  {
    id: "gaba",
    name: "GABA",
    nameEn: "γ-Aminobutyric Acid",
    color: "#8b5cf6",
    level: 50,
    min: 0,
    max: 100,
    baseline: 50,
    description: "抑制性调节、焦虑缓解、镇静",
  },
  {
    id: "glutamate",
    name: "谷氨酸",
    nameEn: "Glutamate",
    color: "#ff00aa",
    level: 50,
    min: 0,
    max: 100,
    baseline: 50,
    description: "兴奋性传递、学习记忆、可塑性",
  },
  {
    id: "acetylcholine",
    name: "乙酰胆碱",
    nameEn: "Acetylcholine",
    color: "#00f0ff",
    level: 50,
    min: 0,
    max: 100,
    baseline: 50,
    description: "注意力、学习记忆、肌肉控制",
  },
];

const transmitterEffects: TransmitterEffect = {
  dopamine: {
    attention: 0.3,
    mood: 0.25,
    motivation: 0.5,
    anxiety: -0.1,
    cognitiveFlexibility: 0.2,
    sleepiness: -0.3,
    socialBehavior: 0.15,
    impulseControl: -0.3,
  },
  serotonin: {
    attention: 0.1,
    mood: 0.5,
    motivation: 0.15,
    anxiety: -0.4,
    cognitiveFlexibility: 0.15,
    sleepiness: 0.3,
    socialBehavior: 0.4,
    impulseControl: 0.4,
  },
  norepinephrine: {
    attention: 0.5,
    mood: 0.1,
    motivation: 0.3,
    anxiety: 0.4,
    cognitiveFlexibility: 0.25,
    sleepiness: -0.5,
    socialBehavior: -0.1,
    impulseControl: -0.1,
  },
  gaba: {
    attention: -0.2,
    mood: 0.3,
    motivation: -0.2,
    anxiety: -0.6,
    cognitiveFlexibility: -0.1,
    sleepiness: 0.5,
    socialBehavior: 0.2,
    impulseControl: 0.3,
  },
  glutamate: {
    attention: 0.4,
    mood: 0.05,
    motivation: 0.2,
    anxiety: 0.3,
    cognitiveFlexibility: 0.5,
    sleepiness: -0.2,
    socialBehavior: 0.1,
    impulseControl: -0.2,
  },
  acetylcholine: {
    attention: 0.5,
    mood: 0.1,
    motivation: 0.2,
    anxiety: 0.1,
    cognitiveFlexibility: 0.4,
    sleepiness: -0.3,
    socialBehavior: 0.05,
    impulseControl: 0.2,
  },
};

const metricConfig: Record<string, { name: string; color: string; icon: string; description: string }> = {
  attention: { name: "注意力", color: "#0066ff", icon: "Target", description: "集中注意力的能力" },
  mood: { name: "情绪", color: "#00ff88", icon: "Heart", description: "整体情绪状态" },
  motivation: { name: "动机", color: "#ffd700", icon: "Zap", description: "追求目标的驱动力" },
  anxiety: { name: "焦虑", color: "#ff6b6b", icon: "AlertTriangle", description: "紧张和担忧程度" },
  cognitiveFlexibility: { name: "认知灵活性", color: "#ff00aa", icon: "Brain", description: "切换思维模式的能力" },
  sleepiness: { name: "睡眠倾向", color: "#8b5cf6", icon: "Moon", description: "入睡和睡眠维持倾向" },
  socialBehavior: { name: "社交行为", color: "#00f0ff", icon: "Users", description: "社交互动和共情能力" },
  impulseControl: { name: "冲动控制", color: "#45b7d1", icon: "Activity", description: "抑制冲动行为的能力" },
};

const calculateMetrics = (transmitters: NeurotransmitterLevel[]): PhysiologicalMetric[] => {
  const baseline = 50;
  const metricScores: Record<string, number> = {
    attention: baseline,
    mood: baseline,
    motivation: baseline,
    anxiety: baseline,
    cognitiveFlexibility: baseline,
    sleepiness: baseline,
    socialBehavior: baseline,
    impulseControl: baseline,
  };

  for (const transmitter of transmitters) {
    const deviation = (transmitter.level - transmitter.baseline) / transmitter.baseline;
    const effects = transmitterEffects[transmitter.id];
    
    if (effects) {
      for (const [metric, weight] of Object.entries(effects)) {
        const impact = deviation * weight * 40;
        metricScores[metric] = Math.max(0, Math.min(100, metricScores[metric] + impact));
      }
    }
  }

  return Object.entries(metricScores).map(([id, value]) => ({
    id,
    name: metricConfig[id].name,
    icon: metricConfig[id].icon,
    value: Math.round(value),
    color: metricConfig[id].color,
    description: metricConfig[id].description,
  }));
};

const getStatusDescription = (value: number): { level: string; color: string } => {
  if (value < 25) return { level: "极低", color: "#ff3333" };
  if (value < 40) return { level: "偏低", color: "#ff9933" };
  if (value < 60) return { level: "正常", color: "#00ff88" };
  if (value < 75) return { level: "偏高", color: "#ffd700" };
  return { level: "极高", color: "#ff0066" };
};

const getMoodState = (metrics: PhysiologicalMetric[]): { state: string; color: string; description: string } => {
  const mood = metrics.find(m => m.id === "mood")?.value || 50;
  const anxiety = metrics.find(m => m.id === "anxiety")?.value || 50;
  const motivation = metrics.find(m => m.id === "motivation")?.value || 50;

  if (mood > 70 && anxiety < 30 && motivation > 60) {
    return { state: "愉悦兴奋", color: "#ffd700", description: "多巴胺与血清素协同作用，奖赏系统活跃，情绪高涨" };
  }
  if (mood < 30 && anxiety > 70) {
    return { state: "焦虑抑郁", color: "#ff3333", description: "血清素不足，去甲肾上腺素过度激活，情绪调节失衡" };
  }
  if (anxiety > 75) {
    return { state: "高度焦虑", color: "#ff6600", description: "GABA抑制不足，去甲肾上腺素过度释放，交感神经兴奋" };
  }
  if (motivation < 30 && mood < 40) {
    return { state: "倦怠无力", color: "#666666", description: "多巴胺奖赏通路功能低下，动机系统抑制" };
  }
  if (mood > 80 && anxiety > 60) {
    return { state: "烦躁不安", color: "#ff0066", description: "多系统失衡，兴奋与焦虑共存" };
  }
  if (motivation > 80) {
    return { state: "充满动力", color: "#00ff88", description: "多巴胺系统高度激活，目标导向行为增强" };
  }
  return { state: "平静稳定", color: "#00f0ff", description: "各神经递质系统处于平衡状态，神经活动协调" };
};

const getMetricIcon = (iconName: string, color: string) => {
  const iconProps = { className: "w-4 h-4", style: { color } };
  switch (iconName) {
    case "Target": return <Target {...iconProps} />;
    case "Heart": return <Heart {...iconProps} />;
    case "Zap": return <Zap {...iconProps} />;
    case "AlertTriangle": return <AlertTriangle {...iconProps} />;
    case "Brain": return <Brain {...iconProps} />;
    case "Moon": return <Moon {...iconProps} />;
    case "Users": return <Users {...iconProps} />;
    case "Activity": return <Activity {...iconProps} />;
    default: return <Activity {...iconProps} />;
  }
};

export default function NeurotransmitterLab() {
  const [transmitters, setTransmitters] = useState<NeurotransmitterLevel[]>(initialTransmitters);
  const [isSimulating, setIsSimulating] = useState(true);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>("mood");
  const historyRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const metrics = useMemo(() => calculateMetrics(transmitters), [transmitters]);
  const moodState = useMemo(() => getMoodState(metrics), [metrics]);

  const handleTransmitterChange = useCallback((id: string, value: number) => {
    setTransmitters(prev =>
      prev.map(t => (t.id === id ? { ...t, level: value } : t))
    );
  }, []);

  const resetTransmitters = useCallback(() => {
    setTransmitters(initialTransmitters.map(t => ({ ...t })));
    setHistory([]);
    timeRef.current = 0;
  }, []);

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
      
      const metricValues: Record<string, number> = {};
      metrics.forEach(m => {
        const noise = (Math.random() - 0.5) * 4;
        metricValues[m.id] = Math.max(0, Math.min(100, m.value + noise));
      });

      setHistory(prev => {
        const newHistory = [...prev, { time: timeRef.current, metrics: metricValues }];
        return newHistory.slice(-60);
      });
    }, 500);

    return () => {
      if (historyRef.current) {
        clearInterval(historyRef.current);
      }
    };
  }, [isSimulating, metrics]);

  const generateChartPath = (metricId: string, width: number, height: number) => {
    if (history.length < 2) return "";

    const values = history.map(h => h.metrics[metricId] || 50);
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

  const generateAreaPath = (metricId: string, width: number, height: number) => {
    const linePath = generateChartPath(metricId, width, height);
    if (!linePath) return "";
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
  };

  const chartWidth = 600;
  const chartHeight = 200;
  const selectedMetricColor = metricConfig[selectedMetric]?.color || "#00f0ff";

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FlaskConical className="w-10 h-10 text-cyber-purple" />
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold"
                style={{
                  color: "#8b5cf6",
                  textShadow:
                    "0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)",
                }}
              >
                神经递质实验室
              </h1>
              <FlaskConical className="w-10 h-10 text-cyber-purple" />
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              调节多巴胺、血清素、去甲肾上腺素等神经递质的浓度，实时观察它们如何影响注意力、情绪、动机等生理指标
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-6">
            <AnimatedSection delay={0.1}>
              <GlowCard color="#8b5cf6" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" style={{ color: "#8b5cf6" }} />
                    <span className="text-sm font-mono" style={{ color: "#8b5cf6" }}>递质浓度调节</span>
                  </div>
                  <motion.button
                    onClick={resetTransmitters}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      color: "#8b5cf6",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    重置
                  </motion.button>
                </div>

                <div className="space-y-5">
                  {transmitters.map((transmitter, index) => (
                    <AnimatedSection key={transmitter.id} delay={0.15 + index * 0.05}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: transmitter.color,
                                boxShadow: `0 0 8px ${transmitter.color}`,
                              }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.3,
                              }}
                            />
                            <div>
                              <span className="text-sm font-display font-semibold" style={{ color: transmitter.color }}>
                                {transmitter.name}
                              </span>
                              <span className="text-[10px] text-gray-500 ml-2 font-mono">
                                {transmitter.nameEn}
                              </span>
                            </div>
                          </div>
                          <motion.span
                            className="text-sm font-mono font-bold"
                            style={{ color: transmitter.color }}
                            key={transmitter.level}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {transmitter.level}%
                          </motion.span>
                        </div>

                        <p className="text-[11px] text-gray-500 ml-5 font-mono">
                          {transmitter.description}
                        </p>

                        <div className="relative ml-5">
                          <input
                            type="range"
                            min={transmitter.min}
                            max={transmitter.max}
                            value={transmitter.level}
                            onChange={(e) => handleTransmitterChange(transmitter.id, Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            aria-label={`${transmitter.name}浓度调节`}
                            aria-valuemin={transmitter.min}
                            aria-valuemax={transmitter.max}
                            aria-valuenow={transmitter.level}
                            style={{
                              color: transmitter.color,
                              background: `linear-gradient(to right, ${transmitter.color} 0%, ${transmitter.color} ${transmitter.level}%, rgba(255,255,255,0.1) ${transmitter.level}%, rgba(255,255,255,0.1) 100%)`,
                            }}
                          />
                          <div className="flex justify-between mt-1 text-[10px] text-gray-600 font-mono">
                            <span>偏低</span>
                            <span style={{ color: transmitter.color }}>正常</span>
                            <span>偏高</span>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </GlowCard>
            </AnimatedSection>
          </div>

          <div className="xl:col-span-7 space-y-6">
            <AnimatedSection delay={0.2}>
              <GlowCard color={moodState.color} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" style={{ color: moodState.color }} />
                    <span className="text-sm font-mono" style={{ color: moodState.color }}>当前脑状态</span>
                  </div>
                  <motion.div
                    className="px-3 py-1 rounded-full text-xs font-mono"
                    style={{
                      backgroundColor: `${moodState.color}20`,
                      border: `1px solid ${moodState.color}60`,
                      color: moodState.color,
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 5px ${moodState.color}40`,
                        `0 0 20px ${moodState.color}60`,
                        `0 0 5px ${moodState.color}40`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {moodState.state}
                  </motion.div>
                </div>

                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {moodState.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {metrics.map((metric) => {
                    const status = getStatusDescription(metric.value);
                    const isSelected = selectedMetric === metric.id;
                    return (
                      <motion.div
                        key={metric.id}
                        onClick={() => setSelectedMetric(metric.id)}
                        className="p-3 rounded-lg cursor-pointer transition-all"
                        style={{
                          backgroundColor: isSelected ? `${metric.color}15` : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isSelected ? metric.color : "rgba(255,255,255,0.1)"}`,
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getMetricIcon(metric.icon, metric.color)}
                          <span className="text-[11px] font-mono" style={{ color: metric.color }}>
                            {metric.name}
                          </span>
                        </div>
                        
                        <motion.div
                          className="text-2xl font-display font-bold mb-2"
                          style={{ color: metric.color }}
                          key={metric.value}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                        >
                          {metric.value}
                        </motion.div>

                        <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: metric.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>

                        <div className="mt-1.5 flex justify-between items-center">
                          <span
                            className="text-[9px] font-mono"
                            style={{ color: status.color }}
                          >
                            {status.level}
                          </span>
                          <span className="text-[9px] text-gray-600">
                            {metric.value < 40 ? "↓" : metric.value > 60 ? "↑" : "→"}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlowCard>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <GlowCard color={selectedMetricColor} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: selectedMetricColor }} />
                    <span className="text-sm font-mono" style={{ color: selectedMetricColor }}>
                      {metricConfig[selectedMetric]?.name || "指标"} 实时变化
                    </span>
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
                      {isSimulating ? "记录中" : "已暂停"}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 mb-4 font-mono">
                  {metricConfig[selectedMetric]?.description}
                </p>

                <div className="relative w-full overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full min-w-[500px] h-auto"
                    style={{ maxHeight: `${chartHeight}px` }}
                  >
                    <defs>
                      <linearGradient id="labAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={selectedMetricColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={selectedMetricColor} stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="labLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={selectedMetricColor} />
                        <stop offset="100%" stopColor={selectedMetricColor} stopOpacity="0.6" />
                      </linearGradient>
                    </defs>

                    {[0, 25, 50, 75, 100].map((val, i) => {
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
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {history.length > 1 && (
                      <>
                        <path
                          d={generateAreaPath(selectedMetric, chartWidth - 50, chartHeight - 20)}
                          transform="translate(40, 10)"
                          fill="url(#labAreaGrad)"
                        />
                        <path
                          d={generateChartPath(selectedMetric, chartWidth - 50, chartHeight - 20)}
                          transform="translate(40, 10)"
                          stroke="url(#labLineGrad)"
                          strokeWidth="2.5"
                          fill="none"
                          style={{ filter: `drop-shadow(0 0 4px ${selectedMetricColor}80)` }}
                        />
                      </>
                    )}

                    {history.length > 0 && (
                      <AnimatePresence>
                        <motion.g
                          transform={`translate(${40 + chartWidth - 50}, 10)`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.circle
                            cx={0}
                            cy={chartHeight - 20 - ((history[history.length - 1]?.metrics[selectedMetric] || 50) / 100) * (chartHeight - 20)}
                            r="6"
                            fill={selectedMetricColor}
                            style={{ filter: `drop-shadow(0 0 10px ${selectedMetricColor})` }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </motion.g>
                      </AnimatePresence>
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

                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-800">
                  {Object.entries(metricConfig).map(([id, config]) => (
                    <motion.button
                      key={id}
                      onClick={() => setSelectedMetric(id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all"
                      style={{
                        backgroundColor: selectedMetric === id ? `${config.color}15` : "transparent",
                        border: `1px solid ${selectedMetric === id ? config.color : "transparent"}`,
                        color: config.color,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getMetricIcon(config.icon, config.color)}
                      {config.name}
                    </motion.button>
                  ))}
                </div>
              </GlowCard>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <GlowCard color="#ffd700" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-cyber-yellow" />
                  <span className="text-sm font-mono text-cyber-yellow">神经递质失衡风险提示</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {metrics.filter(m => m.value < 25 || m.value > 75).length > 0 ? (
                    metrics
                      .filter(m => m.value < 25 || m.value > 75)
                      .map(metric => {
                        const isLow = metric.value < 25;
                        return (
                          <motion.div
                            key={metric.id}
                            className="p-3 rounded-lg"
                            style={{
                              backgroundColor: `${metric.color}08`,
                              border: `1px solid ${metric.color}30`,
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {getMetricIcon(metric.icon, metric.color)}
                              <span className="text-xs font-mono font-semibold" style={{ color: metric.color }}>
                                {metric.name} {isLow ? "过低" : "过高"}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                              {isLow
                                ? `可能导致${metric.description.split("的")[0]}能力下降`
                                : `可能导致${metric.description.split("的")[0]}过度激活`}
                            </p>
                          </motion.div>
                        );
                      })
                  ) : (
                    <div className="col-span-2 text-center py-6">
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{
                          backgroundColor: "rgba(0, 255, 136, 0.1)",
                          border: "1px solid rgba(0, 255, 136, 0.3)",
                        }}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-green-400 text-sm font-mono">
                          ✓ 所有指标处于健康平衡状态
                        </span>
                      </motion.div>
                      <p className="text-xs text-gray-500 mt-3 font-mono">
                        神经递质系统协调工作，大脑功能运行良好
                      </p>
                    </div>
                  )}
                </div>
              </GlowCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
