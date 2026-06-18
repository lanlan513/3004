import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Info } from "lucide-react";
import GlowCard from "@/components/shared/GlowCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { soma, dendrite, axon, myelin, synapse } from "@/data/neurons";
import type { NeuronPart } from "@/types";

const neuronParts: NeuronPart[] = [dendrite, soma, axon, myelin, synapse];

export default function NeuronStructure() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handlePartClick = (id: string) => {
    setSelectedPart(selectedPart === id ? null : id);
  };

  const isHighlighted = (id: string) =>
    selectedPart === null || selectedPart === id;

  const getPartOpacity = (id: string) => (isHighlighted(id) ? 1 : 0.25);

  const getPartFilter = (id: string) =>
    selectedPart === id ? `drop-shadow(0 0 12px ${neuronParts.find(p => p.id === id)?.color})` : "none";

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-10 h-10 text-cyber-yellow" />
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold"
                style={{
                  color: "#ffd700",
                  textShadow:
                    "0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)",
                }}
              >
                神经元解剖学
              </h1>
              <Zap className="w-10 h-10 text-cyber-yellow" />
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              神经元是神经系统的基本功能单位，通过复杂的电化学信号传递实现信息处理与传递
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatedSection>
            <GlowCard color="#ffd700" className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-cyber-yellow" />
                <span className="text-sm text-gray-400">
                  点击各结构查看详细说明
                </span>
              </div>
              <div className="relative w-full overflow-x-auto">
                <svg
                  viewBox="0 0 900 350"
                  className="w-full min-w-[700px] h-auto"
                  style={{ maxHeight: "400px" }}
                >
                  <defs>
                    <linearGradient id="dendriteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ecdc4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4ecdc4" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="axonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#45b7d1" stopOpacity="1" />
                      <stop offset="100%" stopColor="#45b7d1" stopOpacity="0.6" />
                    </linearGradient>
                    <radialGradient id="somaGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff8a8a" />
                      <stop offset="70%" stopColor="#ff6b6b" />
                      <stop offset="100%" stopColor="#cc5555" />
                    </radialGradient>
                    <radialGradient id="nucleusGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffaaaa" />
                      <stop offset="100%" stopColor="#cc3333" />
                    </radialGradient>
                    <radialGradient id="signalGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <motion.g
                    onClick={() => handlePartClick("dendrite")}
                    style={{
                      cursor: "pointer",
                      opacity: getPartOpacity("dendrite"),
                      filter: getPartFilter("dendrite"),
                    }}
                    animate={{
                      opacity: getPartOpacity("dendrite"),
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      d="M 140 175 Q 100 130 60 120 Q 30 115 10 100"
                      stroke="url(#dendriteGrad)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 140 175 Q 95 175 40 180 Q 15 182 5 195"
                      stroke="url(#dendriteGrad)"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 140 175 Q 100 220 60 230 Q 30 235 10 250"
                      stroke="url(#dendriteGrad)"
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
                    <path
                      d="M 110 150 Q 90 140 75 145"
                      stroke="#4ecdc4"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                    <path
                      d="M 110 200 Q 90 210 75 205"
                      stroke="#4ecdc4"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.6"
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
                    <AnimatePresence>
                      {selectedPart === "dendrite" && (
                        <motion.g
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <rect
                            x="20"
                            y="55"
                            width="140"
                            height="30"
                            rx="6"
                            fill="rgba(78, 205, 196, 0.15)"
                            stroke="#4ecdc4"
                            strokeWidth="1"
                          />
                          <text
                            x="90"
                            y="75"
                            textAnchor="middle"
                            fill="#4ecdc4"
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            树突 Dendrite
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </motion.g>

                  <motion.g
                    onClick={() => handlePartClick("soma")}
                    style={{
                      cursor: "pointer",
                      opacity: getPartOpacity("soma"),
                      filter: getPartFilter("soma"),
                    }}
                    animate={{ opacity: getPartOpacity("soma") }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle
                      cx="185"
                      cy="175"
                      r="45"
                      fill="url(#somaGrad)"
                      stroke="#ff6b6b"
                      strokeWidth="2"
                    />
                    <circle
                      cx="185"
                      cy="175"
                      r="20"
                      fill="url(#nucleusGrad)"
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
                    <AnimatePresence>
                      {selectedPart === "soma" && (
                        <motion.g
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <rect
                            x="150"
                            y="100"
                            width="130"
                            height="30"
                            rx="6"
                            fill="rgba(255, 107, 107, 0.15)"
                            stroke="#ff6b6b"
                            strokeWidth="1"
                          />
                          <text
                            x="215"
                            y="120"
                            textAnchor="middle"
                            fill="#ff6b6b"
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            胞体 Soma
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </motion.g>

                  <motion.g
                    onClick={() => handlePartClick("axon")}
                    style={{
                      cursor: "pointer",
                      opacity: getPartOpacity("axon"),
                      filter: getPartFilter("axon"),
                    }}
                    animate={{ opacity: getPartOpacity("axon") }}
                    transition={{ duration: 0.3 }}
                  >
                    <line
                      x1="230"
                      y1="175"
                      x2="700"
                      y2="175"
                      stroke="url(#axonGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <AnimatePresence>
                      {selectedPart === "axon" && (
                        <motion.g
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <rect
                            x="420"
                            y="110"
                            width="120"
                            height="30"
                            rx="6"
                            fill="rgba(69, 183, 209, 0.15)"
                            stroke="#45b7d1"
                            strokeWidth="1"
                          />
                          <text
                            x="480"
                            y="130"
                            textAnchor="middle"
                            fill="#45b7d1"
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            轴突 Axon
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </motion.g>

                  <motion.g
                    onClick={() => handlePartClick("myelin")}
                    style={{
                      cursor: "pointer",
                      opacity: getPartOpacity("myelin"),
                      filter: getPartFilter("myelin"),
                    }}
                    animate={{ opacity: getPartOpacity("myelin") }}
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
                        <line
                          x1={x + 10}
                          y1="162"
                          x2={x + 10}
                          y2="188"
                          stroke="#d4a017"
                          strokeWidth="1"
                          opacity="0.5"
                        />
                        <line
                          x1={x + 25}
                          y1="162"
                          x2={x + 25}
                          y2="188"
                          stroke="#d4a017"
                          strokeWidth="1"
                          opacity="0.5"
                        />
                        <line
                          x1={x + 40}
                          y1="162"
                          x2={x + 40}
                          y2="188"
                          stroke="#d4a017"
                          strokeWidth="1"
                          opacity="0.5"
                        />
                      </g>
                    ))}
                    <AnimatePresence>
                      {selectedPart === "myelin" && (
                        <motion.g
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <rect
                            x="400"
                            y="215"
                            width="160"
                            height="30"
                            rx="6"
                            fill="rgba(249, 202, 36, 0.15)"
                            stroke="#f9ca24"
                            strokeWidth="1"
                          />
                          <text
                            x="480"
                            y="235"
                            textAnchor="middle"
                            fill="#f9ca24"
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            髓鞘 Myelin Sheath
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </motion.g>

                  <motion.g
                    onClick={() => handlePartClick("synapse")}
                    style={{
                      cursor: "pointer",
                      opacity: getPartOpacity("synapse"),
                      filter: getPartFilter("synapse"),
                    }}
                    animate={{ opacity: getPartOpacity("synapse") }}
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
                    {[0, 1, 2, 3].map((i) => (
                      <circle
                        key={i}
                        cx={820 + i * 8}
                        cy={155 + i * 12}
                        r="4"
                        fill="#a29bfe"
                        opacity="0.6"
                      />
                    ))}
                    {[0, 1, 2].map((i) => (
                      <circle
                        key={`b-${i}`}
                        cx={850 + i * 6}
                        cy={170 - i * 8}
                        r="3"
                        fill="#a29bfe"
                        opacity="0.4"
                      />
                    ))}
                    <AnimatePresence>
                      {selectedPart === "synapse" && (
                        <motion.g
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <rect
                            x="780"
                            y="75"
                            width="110"
                            height="30"
                            rx="6"
                            fill="rgba(162, 155, 254, 0.15)"
                            stroke="#a29bfe"
                            strokeWidth="1"
                          />
                          <text
                            x="835"
                            y="95"
                            textAnchor="middle"
                            fill="#a29bfe"
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            突触 Synapse
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </motion.g>

                  <motion.circle
                    cx="240"
                    cy="175"
                    r="10"
                    fill="url(#signalGlow)"
                    animate={{
                      x: [0, 460, 460, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.7, 0.85, 1],
                    }}
                  />
                  <motion.circle
                    cx="240"
                    cy="175"
                    r="5"
                    fill="#00f0ff"
                    animate={{
                      x: [0, 460, 460, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.7, 0.85, 1],
                    }}
                    style={{
                      filter: "drop-shadow(0 0 8px #00f0ff)",
                    }}
                  />

                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.circle
                      key={`p-${i}`}
                      cx={760 + (i % 3) * 12}
                      cy={170 + Math.floor(i / 3) * 10}
                      r="3"
                      fill="#a29bfe"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                        x: [0, 20 + i * 5, 35 + i * 8],
                        y: [0, -10 + i * 3, -15 + i * 5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3 + 2.1,
                      }}
                    />
                  ))}
                </svg>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                {neuronParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => handlePartClick(part.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                      selectedPart === part.id
                        ? "bg-opacity-30 scale-105"
                        : "bg-opacity-10 hover:bg-opacity-20"
                    }`}
                    style={{
                      backgroundColor: `${part.color}20`,
                      border: `1px solid ${selectedPart === part.id ? part.color : `${part.color}40`}`,
                      color: part.color,
                      boxShadow:
                        selectedPart === part.id
                          ? `0 0 15px ${part.color}60`
                          : "none",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: part.color }}
                    />
                    {part.name}
                  </button>
                ))}
              </div>
            </GlowCard>
          </AnimatedSection>

          <div className="space-y-4">
            {neuronParts.map((part, index) => (
              <AnimatedSection key={part.id} delay={index * 0.1}>
                <motion.div
                  animate={{
                    scale: selectedPart === part.id ? 1.02 : 1,
                    boxShadow:
                      selectedPart === part.id
                        ? `0 0 30px ${part.color}50`
                        : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <GlowCard
                    color={part.color}
                    onClick={() => handlePartClick(part.id)}
                    className="cursor-pointer"
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: part.color,
                            boxShadow: `0 0 10px ${part.color}`,
                          }}
                        />
                        <h3
                          className="text-lg font-display font-bold"
                          style={{ color: part.color }}
                        >
                          {part.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {part.description}
                      </p>
                    </div>
                  </GlowCard>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
