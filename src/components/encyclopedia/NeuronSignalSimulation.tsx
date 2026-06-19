import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Activity, Zap, Info, ChevronRight } from "lucide-react";
import GlowCard from "@/components/shared/GlowCard";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface SignalStep {
  id: string;
  title: string;
  description: string;
  phase: "resting" | "depolarization" | "rising" | "falling" | "undershoot" | "recovery";
  startTime: number;
  position: number;
}

const signalSteps: SignalStep[] = [
  {
    id: "1",
    title: "静息状态",
    description: "神经元处于静息电位，膜内外电位差约为-70mV。钾离子通道关闭，钠离子通道关闭，钠钾泵维持离子浓度梯度。",
    phase: "resting",
    startTime: 0,
    position: 0,
  },
  {
    id: "2",
    title: "突触输入",
    description: "树突接收来自其他神经元的信号，神经递质与受体结合引起局部去极化。当去极化达到阈值电位（约-55mV）时，动作电位触发。",
    phase: "depolarization",
    startTime: 800,
    position: 10,
  },
  {
    id: "3",
    title: "去极化上升相",
    description: "电压门控钠离子通道大量开放，钠离子迅速内流，膜电位快速上升，从-55mV跃升至+40mV左右。这是动作电位的上升支。",
    phase: "rising",
    startTime: 1600,
    position: 30,
  },
  {
    id: "4",
    title: "复极化下降相",
    description: "钠离子通道失活关闭，钾离子通道开放，钾离子外流，膜电位迅速下降，从+40mV回落至静息电位水平以下。",
    phase: "falling",
    startTime: 2400,
    position: 55,
  },
  {
    id: "5",
    title: "超极化后电位",
    description: "钾离子通道延迟关闭，导致膜电位短暂低于静息电位（约-80mV），形成超极化后电位，确保动作电位单向传导。",
    phase: "undershoot",
    startTime: 3200,
    position: 75,
  },
  {
    id: "6",
    title: "信号传递完成",
    description: "钠钾泵恢复离子分布，膜电位恢复静息状态。动作电位以跳跃式传导沿轴突向下一个神经元传递。",
    phase: "recovery",
    startTime: 4000,
    position: 95,
  },
];

const generateActionPotentialData = (phase: string, progress: number) => {
  const data = [];
  const points = 100;
  
  for (let i = 0; i <= points; i++) {
    let potential = -70;
    
    if (i < 5) potential = -70;
    else if (i < 15) potential = -70 + (i - 5) * 1.5;
    else if (i < 25) potential = -55 + (i - 15) * 9.5;
    else if (i < 35) potential = 40 - (i - 25) * 11;
    else if (i < 45) potential = -70 - (i - 35) * 1;
    else if (i < 60) potential = -80 + (i - 45) * 0.67;
    else potential = -70;
    
    const visibility = Math.min(1, Math.max(0, (progress * 100 - i + 10) / 10));
    data.push({
      x: i,
      y: potential,
      visible: visibility,
    });
  }
  
  return data;
};

export default function NeuronSignalSimulation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [signalPosition, setSignalPosition] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<SignalStep["phase"]>("resting");
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const totalDuration = 5000;

  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setSignalPosition(0);
    setCurrentPhase("resting");
    startTimeRef.current = 0;
  }, []);

  const startAnimation = useCallback(() => {
    resetAnimation();
    setIsPlaying(true);
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const newProgress = Math.min(elapsed / totalDuration, 1);
      
      setProgress(newProgress);
      setSignalPosition(newProgress * 100);

      let step: SignalStep | undefined;
      for (let i = signalSteps.length - 1; i >= 0; i--) {
        const s = signalSteps[i];
        if (elapsed >= s.startTime && elapsed < s.startTime + 800) {
          step = s;
          break;
        }
      }
      if (step) {
        setCurrentStep(signalSteps.indexOf(step));
        setCurrentPhase(step.phase);
      }

      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setIsPlaying(false);
        }, 500);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [resetAnimation]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const actionPotentialData = generateActionPotentialData(currentPhase, progress);

  const getPathD = () => {
    return actionPotentialData
      .map((point, i) => {
        const x = (point.x / 100) * 600 + 50;
        const y = 150 - ((point.y + 90) * 1.2);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const getSignalX = () => {
    const currentPoint = actionPotentialData[Math.min(Math.floor(progress * 100), 99)] || actionPotentialData[0];
    return (currentPoint.x / 100) * 600 + 50;
  };

  const getSignalY = () => {
    const currentPoint = actionPotentialData[Math.min(Math.floor(progress * 100), 99)] || actionPotentialData[0];
    return 150 - ((currentPoint.y + 90) * 1.2);
  };

  const getCurrentPotential = () => {
    const idx = Math.min(Math.floor(progress * 100), 99);
    return actionPotentialData[idx]?.y || -70;
  };

  const getNeuronSignalPosition = () => {
    const startX = 140;
    const endX = 780;
    return startX + (endX - startX) * (progress / 1);
  };

  const getHighlightedParts = () => {
    if (progress < 0.15) return ["dendrite"];
    if (progress < 0.35) return ["dendrite", "soma"];
    if (progress < 0.7) return ["dendrite", "soma", "axon"];
    return ["dendrite", "soma", "axon", "synapse"];
  };

  const isPartHighlighted = (part: string) => getHighlightedParts().includes(part);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Activity className="w-10 h-10 text-cyber-cyan" />
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold"
                style={{
                  color: "#00f0ff",
                  textShadow:
                    "0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4)",
                }}
              >
                动作电位传导
              </h1>
              <Activity className="w-10 h-10 text-cyber-cyan" />
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              点击开始模拟神经元信号传递过程，观察动作电位如何从树突经过胞体传递到轴突的完整电化学过程
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <AnimatedSection delay={0.1}>
              <GlowCard color="#00f0ff" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-cyber-cyan" />
                    <span className="text-sm text-gray-400">神经元信号传递路径</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="px-3 py-1 rounded-full text-xs font-mono"
                      animate={{
                        backgroundColor: isPlaying ? "rgba(0, 240, 255, 0.2)" : "rgba(100, 100, 100, 0.2)",
                        borderColor: isPlaying ? "#00f0ff" : "#666",
                      }}
                      style={{
                        border: "1px solid",
                        color: isPlaying ? "#00f0ff" : "#888",
                      }}
                    >
                      {isPlaying ? "● 传导中" : "○ 就绪"}
                    </motion.div>
                  </div>
                </div>

                <div className="relative w-full overflow-x-auto">
                  <svg
                    viewBox="0 0 900 350"
                    className="w-full min-w-[700px] h-auto"
                    style={{ maxHeight: "350px" }}
                  >
                    <defs>
                      <linearGradient id="simDendriteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4ecdc4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4ecdc4" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="simAxonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#45b7d1" stopOpacity="1" />
                        <stop offset="100%" stopColor="#45b7d1" stopOpacity="0.6" />
                      </linearGradient>
                      <radialGradient id="simSomaGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ff8a8a" />
                        <stop offset="70%" stopColor="#ff6b6b" />
                        <stop offset="100%" stopColor="#cc5555" />
                      </radialGradient>
                      <radialGradient id="simSignalGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                      </radialGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <motion.g
                      animate={{
                        opacity: isPartHighlighted("dendrite") ? 1 : 0.3,
                        filter: isPartHighlighted("dendrite") ? "drop-shadow(0 0 8px #4ecdc4)" : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <path
                        d="M 140 175 Q 100 130 60 120 Q 30 115 10 100"
                        stroke="url(#simDendriteGrad)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 140 175 Q 95 175 40 180 Q 15 182 5 195"
                        stroke="url(#simDendriteGrad)"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 140 175 Q 100 220 60 230 Q 30 235 10 250"
                        stroke="url(#simDendriteGrad)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 80 130 Q 60 110 40 105"
                        stroke="#4ecdc4"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                      <path
                        d="M 70 225 Q 50 240 30 245"
                        stroke="#4ecdc4"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.7"
                      />
                      {[0, 1, 2, 3, 4].map((i) => (
                        <circle
                          key={i}
                          cx={[120, 80, 50, 30, 15][i]}
                          cy={[160, 125, 180, 225, 100][i]}
                          r="3"
                          fill="#4ecdc4"
                          opacity="0.8"
                        />
                      ))}
                    </motion.g>

                    <motion.g
                      animate={{
                      opacity: isPartHighlighted("soma") ? 1 : 0.3,
                      filter: isPartHighlighted("soma") ? "drop-shadow(0 0 12px #ff6b6b)" : "none",
                    }}
                      transition={{ duration: 0.3 }}
                    >
                      <circle
                        cx="185"
                        cy="175"
                        r="45"
                        fill="url(#simSomaGrad)"
                        stroke="#ff6b6b"
                        strokeWidth="2"
                      />
                      <circle
                        cx="185"
                        cy="175"
                        r="20"
                        fill="#cc3333"
                        stroke="#ff3333"
                        strokeWidth="1"
                      />
                      <circle
                        cx="178"
                        cy="168"
                        r="6"
                        fill="#ffcccc"
                        opacity="0.5"
                      />
                    </motion.g>

                    <motion.g
                      animate={{
                      opacity: isPartHighlighted("axon") ? 1 : 0.3,
                      filter: isPartHighlighted("axon") ? "drop-shadow(0 0 8px #45b7d1)" : "none",
                    }}
                      transition={{ duration: 0.3 }}
                    >
                      <line
                        x1="230"
                        y1="175"
                        x2="700"
                        y2="175"
                        stroke="url(#simAxonGrad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    <motion.g
                      animate={{
                      opacity: isPartHighlighted("axon") ? 1 : 0.3,
                      filter: isPartHighlighted("axon") ? "drop-shadow(0 0 6px #f9ca24)" : "none",
                    }}
                      transition={{ duration: 0.3 }}
                    >
                      {[280, 360, 440, 520, 600].map((x, i) => (
                      <g key={i}>
                        <rect
                          x={x}
                          y="162"
                          width="50"
                          height="26"
                          rx="4"
                          fill="#f9ca24"
                          opacity="0.85"
                          stroke="#f0b400"
                          strokeWidth="1"
                        />
                      </g>
                    ))}
                    </motion.g>

                    <motion.g
                      animate={{
                      opacity: isPartHighlighted("synapse") ? 1 : 0.3,
                      filter: isPartHighlighted("synapse") ? "drop-shadow(0 0 10px #a29bfe)" : "none",
                    }}
                      transition={{ duration: 0.3 }}
                    >
                      <line
                        x1="700"
                        y1="175"
                        x2="750"
                        y2="175"
                        stroke="#a29bfe"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="750"
                        y1="175"
                        x2="780"
                        y2="140"
                        stroke="#a29bfe"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line
                        x1="750"
                        y1="175"
                        x2="790"
                        y2="175"
                        stroke="#a29bfe"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line
                        x1="750"
                        y1="175"
                        x2="780"
                        y2="210"
                        stroke="#a29bfe"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="780" cy="140" r="7" fill="#a29bfe" />
                      <circle cx="790" cy="175" r="7" fill="#a29bfe" />
                      <circle cx="780" cy="210" r="7" fill="#a29bfe" />
                    </motion.g>

                    <AnimatePresence>
                      {isPlaying && (
                        <>
                          <motion.circle
                            cx={getNeuronSignalPosition()}
                            cy="175"
                            r="15"
                            fill="url(#simSignalGlow)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.circle
                            cx={getNeuronSignalPosition()}
                            cy="175"
                            r="7"
                            fill="#00f0ff"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: 1,
                              scale: [1, 1.2, 1],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 0.3,
                              scale: {
                                duration: 0.5,
                                repeat: Infinity,
                              }
                            }}
                            style={{
                              filter: "drop-shadow(0 0 10px #00f0ff)",
                            }}
                          />
                          {progress > 0.85 && [...Array(8)].map((_, i) => (
                            <motion.circle
                              key={i}
                              cx={780 + (i % 3) * 12}
                              cy={170 + Math.floor(i / 3) * 10}
                              r="4"
                              fill="#a29bfe"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                x: [0, 20 + i * 5, 35 + i * 8],
                                y: [0, -10 + i * 3, -15 + i * 5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    <text x="50" y="300" fill="#4ecdc4" fontSize="11" fontFamily="JetBrains Mono">树突</text>
                    <text x="160" y="300" fill="#ff6b6b" fontSize="11" fontFamily="JetBrains Mono">胞体</text>
                    <text x="450" y="300" fill="#45b7d1" fontSize="11" fontFamily="JetBrains Mono">轴突</text>
                    <text x="750" y="300" fill="#a29bfe" fontSize="11" fontFamily="JetBrains Mono">突触</text>
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <motion.button
                    onClick={isPlaying ? resetAnimation : startAnimation}
                    disabled={isPlaying}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all duration-300"
                    style={{
                      backgroundColor: isPlaying ? "rgba(255, 107, 107)" : "rgba(0, 240, 255)",
                      color: isPlaying ? "#fff" : "#000",
                      boxShadow: isPlaying 
                        ? "0 0 20px rgba(255, 107, 107, 0.5)" 
                        : "0 0 20px rgba(0, 240, 255, 0.5)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPlaying ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        重置
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        开始模拟
                      </>
                    )}
                  </motion.button>
                </div>
              </GlowCard>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <GlowCard color="#00f0ff" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-cyber-cyan" />
                  <span className="text-sm text-gray-400">膜电位变化曲线</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">当前电位:</span>
                    <motion.span 
                      className="text-sm font-mono font-bold"
                      style={{ color: getCurrentPotential() > 0 ? "#00ff88" : "#00f0ff" }}
                    >
                      {getCurrentPotential().toFixed(0)} mV
                    </motion.span>
                  </div>
                </div>

                <div className="relative w-full overflow-x-auto">
                  <svg
                    viewBox="0 0 700 280"
                    className="w-full min-w-[600px] h-auto"
                    style={{ maxHeight: "280px" }}
                  >
                    <defs>
                      <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <line x1="50" y1="134" x2="650" y2="134" stroke="#333" strokeWidth="1" strokeDasharray="4 2" />
                    <line x1="50" y1="74" x2="650" y2="74" stroke="#333" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="50" y1="194" x2="650" y2="194" stroke="#333" strokeWidth="1" strokeDasharray="2 2" />

                    <text x="35" y="138" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">-70</text>
                    <text x="35" y="78" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">0</text>
                    <text x="35" y="38" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">+40</text>
                    <text x="35" y="198" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">-80</text>

                    <text x="125" y="240" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">去极化</text>
                    <text x="280" y="240" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">上升相</text>
                    <text x="400" y="240" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">下降相</text>
                    <text x="520" y="240" fill="#888" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">后电位</text>

                    <path
                      d={getPathD()}
                      stroke="none"
                      fill="url(#areaGrad)"
                    />
                    <path
                      d={getPathD()}
                      stroke="#00f0ff"
                      strokeWidth="2.5"
                      fill="none"
                      style={{ filter: "drop-shadow(0 0 4px rgba(0, 240, 255, 0.8)" }}
                    />

                    <AnimatePresence>
                      {isPlaying && (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.circle
                            cx={getSignalX()}
                            cy={getSignalY()}
                            r="8"
                            fill="#00f0ff"
                            style={{ filter: "drop-shadow(0 0 10px #00f0ff)" }}
                          />
                          <motion.circle
                            cx={getSignalX()}
                            cy={getSignalY()}
                            r="15"
                            fill="#00f0ff"
                            opacity="0.3"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </motion.g>
                      )}
                    </AnimatePresence>

                    <text x="350" y="265" fill="#666" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">时间 (ms)</text>
                    <text x="15" y="150" fill="#666" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" transform="rotate(-90, 15, 150)">膜电位 (mV)</text>
                  </svg>
                </div>

                <div className="flex items-center justify-between mt-4 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyber-cyan" style={{ boxShadow: "0 0 8px #00f0ff" }} />
                    <span className="text-xs text-gray-400">动作电位</span>
                  </div>
                  <div className="flex-1 mx-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #4ecdc4, #00f0ff, #ff6b6b, #a29bfe)"
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    {(progress * 100).toFixed(0)}%
                  </span>
                </div>
              </GlowCard>
            </AnimatedSection>
          </div>

          <div className="space-y-4">
            <AnimatedSection delay={0.3}>
              <div className="space-y-3">
                {signalSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  animate={{
                    scale: currentStep === index ? 1.02 : 1,
                    opacity: currentStep === index ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <GlowCard
                    color={
                      currentStep === index ? "#00f0ff" : "#333"
                    }
                    className="transition-all duration-300"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <motion.div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                            animate={{
                              backgroundColor: currentStep === index ? "#00f0ff" : "rgba(0, 240, 255, 0.2)",
                              color: currentStep === index ? "#000" : "#00f0ff",
                              boxShadow: currentStep === index ? "0 0 15px rgba(0, 240, 255, 0.6)" : "none",
                            }}
                          >
                            {step.id}
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="text-sm font-display font-bold"
                              style={{ color: currentStep === index ? "#00f0ff" : "#888" }}
                            >
                              {step.title}
                            </h3>
                            {currentStep === index && (
                              <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-1"
                              >
                                  <ChevronRight className="w-3 h-3 text-cyber-yellow" />
                                  <span className="text-[10px] font-mono text-cyber-yellow">进行中</span>
                                </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <GlowCard color="#ffd700" className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-cyber-yellow" />
                  <span className="text-xs font-mono text-cyber-yellow">关键数值</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(0, 240, 255, 0.05)", border: "1px solid rgba(0, 240, 255, 0.2)" }}>
                    <div className="text-xl font-display font-bold text-cyber-cyan">-70mV</div>
                    <div className="text-[10px] font-mono text-gray-500">静息电位</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 107, 107, 0.05)", border: "1px solid rgba(255, 107, 107, 0.2)" }}>
                    <div className="text-xl font-display font-bold" style={{ color: "#ff6b6b" }}>-55mV</div>
                    <div className="text-[10px] font-mono text-gray-500">阈值电位</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(0, 255, 136, 0.05)", border: "1px solid rgba(0, 255, 136, 0.2)" }}>
                    <div className="text-xl font-display font-bold" style={{ color: "#00ff88" }}>+40mV</div>
                    <div className="text-[10px] font-mono text-gray-500">峰电位</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(162, 155, 254, 0.05)", border: "1px solid rgba(162, 155, 254, 0.2)" }}>
                    <div className="text-xl font-display font-bold" style={{ color: "#a29bfe" }}>120m/s</div>
                    <div className="text-[10px] font-mono text-gray-500">传导速度</div>
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
