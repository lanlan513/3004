import { motion } from "framer-motion";
import { Brain, Activity, Sparkles } from "lucide-react";
import GlowCard from "@/components/shared/GlowCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { memory, language, motor, vision } from "@/data/brainRegions";
import type { BrainRegionData } from "@/types";

const allRegions: BrainRegionData[] = [...memory, ...language, ...motor, ...vision];

export default function BrainRegions() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-cyber-cyan" />
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold glow-text"
                style={{ color: "#00f0ff" }}
              >
                大脑核心区域
              </h1>
              <Brain className="w-10 h-10 text-cyber-cyan" />
            </div>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              探索人类大脑的奥秘 — 每个区域都承载着独特的功能，
              共同构成了意识、思维、记忆与情感的神经基础
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRegions.map((region, index) => (
            <AnimatedSection key={region.id} delay={index * 0.1}>
              <motion.div
                style={{ perspective: 1000 }}
                whileHover={{
                  rotateY: 5,
                  rotateX: -5,
                  transition: { duration: 0.3 },
                }}
              >
                <GlowCard color={region.color} className="h-full">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3
                          className="text-2xl font-display font-bold mb-1"
                          style={{
                            color: region.color,
                            textShadow: `0 0 10px ${region.color}aa, 0 0 20px ${region.color}66`,
                          }}
                        >
                          {region.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {region.nameEn}
                        </p>
                      </div>
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      >
                        <Activity
                          className="w-8 h-8"
                          style={{ color: region.color }}
                        />
                      </motion.div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      {region.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: region.color }}
                        />
                        <span
                          className="text-xs font-semibold tracking-wider uppercase"
                          style={{ color: region.color }}
                        >
                          核心功能
                        </span>
                      </div>
                      {region.functions.slice(0, 3).map((func, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: region.color }}
                          />
                          <span className="text-sm text-gray-400">{func}</span>
                        </motion.div>
                      ))}
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
