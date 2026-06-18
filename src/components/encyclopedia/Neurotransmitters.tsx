import { motion } from "framer-motion";
import { FlaskConical, AlertTriangle, Sparkles } from "lucide-react";
import GlowCard from "@/components/shared/GlowCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import {
  dopamine,
  serotonin,
  acetylcholine,
  gaba,
  glutamate,
  norepinephrine,
} from "@/data/neurotransmitters";
import type { Neurotransmitter } from "@/types";

const allTransmitters: Neurotransmitter[] = [
  dopamine,
  serotonin,
  acetylcholine,
  gaba,
  glutamate,
  norepinephrine,
];

function MoleculeSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-24" style={{ maxWidth: "220px" }}>
      <defs>
        <linearGradient id={`molGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <motion.g
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        <polygon
          points="40,60 60,25 95,25 115,60 95,95 60,95"
          fill={`${color}15`}
          stroke={color}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
        <polygon
          points="115,60 135,25 170,25 170,60 170,95 135,95"
          fill={`${color}10`}
          stroke={color}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />

        <line x1="115" y1="60" x2="135" y2="60" stroke={color} strokeWidth="2" />
        <line x1="40" y1="60" x2="20" y2="60" stroke={color} strokeWidth="2" />
        <line x1="170" y1="60" x2="190" y2="60" stroke={color} strokeWidth="2" />

        <circle
          cx="77.5"
          cy="60"
          r="5"
          fill={`url(#molGrad-${color})`}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <circle
          cx="152.5"
          cy="60"
          r="5"
          fill={`url(#molGrad-${color})`}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <circle cx="20" cy="60" r="4" fill={color} opacity="0.8" />
        <circle cx="190" cy="60" r="4" fill={color} opacity="0.8" />

        <circle
          cx="60"
          cy="25"
          r="3"
          fill={color}
          opacity="0.7"
        />
        <circle
          cx="95"
          cy="25"
          r="3"
          fill={color}
          opacity="0.7"
        />
        <circle
          cx="60"
          cy="95"
          r="3"
          fill={color}
          opacity="0.7"
        />
        <circle
          cx="95"
          cy="95"
          r="3"
          fill={color}
          opacity="0.7"
        />
      </motion.g>

      <motion.circle
        cx="77.5"
        cy="60"
        r="12"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.4"
        animate={{ r: [10, 18, 10], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </svg>
  );
}

export default function Neurotransmitters() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FlaskConical className="w-10 h-10 text-cyber-pink" />
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold"
                style={{
                  color: "#ff00aa",
                  textShadow:
                    "0 0 10px rgba(255, 0, 170, 0.8), 0 0 20px rgba(255, 0, 170, 0.6), 0 0 30px rgba(255, 0, 170, 0.4)",
                }}
              >
                化学信使系统
              </h1>
              <FlaskConical className="w-10 h-10 text-cyber-pink" />
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              神经递质是大脑神经元间信息传递的化学信使，
              调控着情绪、认知、运动、睡眠等几乎所有生理与心理功能
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allTransmitters.map((transmitter, index) => (
            <AnimatedSection
              key={transmitter.id}
              delay={index * 0.1}
            >
              <motion.div
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <GlowCard color={transmitter.color} className="h-full">
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3
                        className="text-2xl font-display font-bold mb-1"
                        style={{
                          color: transmitter.color,
                          textShadow: `0 0 10px ${transmitter.color}aa, 0 0 20px ${transmitter.color}66`,
                        }}
                      >
                        {transmitter.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {transmitter.nameEn}
                      </p>
                    </div>

                    <div className="flex justify-center mb-5">
                      <MoleculeSVG color={transmitter.color} />
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      {transmitter.function}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: transmitter.color }}
                        />
                        <span
                          className="text-xs font-semibold tracking-wider uppercase"
                          style={{ color: transmitter.color }}
                        >
                          主要作用
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {transmitter.effects.map((effect, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-2"
                          >
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: transmitter.color }}
                            />
                            <span className="text-sm text-gray-400">
                              {effect}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle
                          className="w-4 h-4"
                          style={{ color: transmitter.color }}
                        />
                        <span
                          className="text-xs font-semibold tracking-wider uppercase"
                          style={{ color: transmitter.color }}
                        >
                          相关疾病
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {transmitter.disorders.map((disorder, i) => {
                          const parts = disorder.split("：");
                          const label = parts[0];
                          return (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="inline-block px-2.5 py-1 rounded-full text-xs font-mono"
                              style={{
                                backgroundColor: `${transmitter.color}15`,
                                border: `1px solid ${transmitter.color}40`,
                                color: transmitter.color,
                              }}
                              title={disorder}
                            >
                              {label}
                            </motion.span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
