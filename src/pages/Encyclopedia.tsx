import { motion } from "framer-motion";
import { Brain, ArrowUp } from "lucide-react";
import ParticleBackground from "@/components/shared/ParticleBackground";
import Navbar from "@/components/layout/Navbar";
import AnimatedSection from "@/components/shared/AnimatedSection";
import BrainRegions from "@/components/encyclopedia/BrainRegions";
import NeuronStructure from "@/components/encyclopedia/NeuronStructure";
import NeuronSignalSimulation from "@/components/encyclopedia/NeuronSignalSimulation";
import BrainFunctionMap from "@/components/encyclopedia/BrainFunctionMap";
import Neurotransmitters from "@/components/encyclopedia/Neurotransmitters";
import NeurotransmitterLab from "@/components/encyclopedia/NeurotransmitterLab";
import MemoryFormationSimulator from "@/components/encyclopedia/MemoryFormationSimulator";

export default function Encyclopedia() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-cyber-bg text-white overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <section className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-cyber-pink/30 bg-cyber-pink/5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Brain className="w-4 h-4 text-cyber-pink" />
              <span className="text-xs text-cyber-pink font-mono tracking-widest uppercase">
                Knowledge Database
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="glow-text-pink text-cyber-pink">神经科学</span>
              <span className="text-white"> 百科全书</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-mono leading-relaxed">
              从宏观脑区到微观分子，系统探索人类认知的生物学基础。
              <br className="hidden md:block" />
              每一个结构都承载着亿万年进化的智慧结晶。
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {[
                { label: "脑区解剖", color: "#00f0ff" },
                { label: "功能地图", color: "#a78bfa" },
                { label: "神经元结构", color: "#ffd700" },
                { label: "信号传导", color: "#00ff88" },
                { label: "神经递质", color: "#ff00aa" },
                { label: "递质实验室", color: "#8b5cf6" },
                { label: "记忆形成", color: "#00f0ff" },
              ].map((tag, i) => (
                <motion.div
                  key={tag.label}
                  className="px-5 py-2 rounded-full border font-mono text-sm"
                  style={{
                    borderColor: `${tag.color}40`,
                    color: tag.color,
                    background: `${tag.color}08`,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {String(i + 1).padStart(2, "0")} · {tag.label}
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="relative z-10">
        <BrainRegions />
        <BrainFunctionMap />
        <NeuronStructure />
        <NeuronSignalSimulation />
        <Neurotransmitters />
        <NeurotransmitterLab />
        <MemoryFormationSimulator />
      </div>

      <section className="relative z-10 py-20 px-6 border-t border-cyber-cyan/10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl font-bold mb-4">
              <span className="glow-text text-cyber-cyan">探索永无止境</span>
            </h2>
            <p className="text-gray-400 font-mono mb-8 max-w-xl mx-auto">
              神经科学是21世纪最前沿的研究领域，每天都有新的发现拓展我们对意识的认知边界。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { v: "100K+", l: "已发表论文" },
                { v: "500+", l: "活跃研究实验室" },
                { v: "21st", l: "世纪科学前沿" },
                { v: "∞", l: "未知领域" },
              ].map((item) => (
                <div key={item.l} className="p-4">
                  <div className="font-display text-2xl md:text-3xl text-cyber-cyan glow-text">
                    {item.v}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-mono tracking-wider">
                    {item.l}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <footer className="relative z-10 py-8 px-6 border-t border-cyber-cyan/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyber-cyan" />
            <span className="font-display text-cyber-cyan glow-text tracking-wider">
              NeuroMind
            </span>
          </div>
          <p className="text-xs text-gray-600 font-mono tracking-wider">
            NEURAL EXPLORATION SYSTEM © 2026
          </p>
        </div>
      </footer>

      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full glass-card border border-cyber-cyan/40 flex items-center justify-center cursor-pointer hover:shadow-glow transition-all"
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ArrowUp className="w-5 h-5 text-cyber-cyan" />
      </motion.button>
    </div>
  );
}
