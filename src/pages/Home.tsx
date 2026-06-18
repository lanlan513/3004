import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Zap, BookOpen, ChevronRight } from "lucide-react";
import ParticleBackground from "@/components/shared/ParticleBackground";
import InteractiveBrain from "@/components/brain/InteractiveBrain";
import InfoPanel from "@/components/brain/InfoPanel";
import Navbar from "@/components/layout/Navbar";
import GlowCard from "@/components/shared/GlowCard";

const features = [
  {
    icon: Brain,
    title: "交互式大脑",
    desc: "点击不同脑区探索记忆、语言、运动、视觉的奥秘",
    color: "#00f0ff",
  },
  {
    icon: Zap,
    title: "神经元动力学",
    desc: "可视化神经信号传递与化学信使的工作原理",
    color: "#ff00aa",
  },
  {
    icon: BookOpen,
    title: "系统百科",
    desc: "从脑区解剖到分子层面的结构化知识体系",
    color: "#8b5cf6",
  },
];

const stats = [
  { value: "860亿", label: "神经元数量" },
  { value: "100万亿", label: "突触连接" },
  { value: "<1ms", label: "信号传递" },
  { value: "20W", label: "大脑功耗" },
];

export default function Home() {
  const brainRef = useRef<HTMLDivElement>(null);

  const handleStartInteraction = () => {
    brainRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="relative min-h-screen bg-cyber-bg text-white overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <section ref={brainRef} className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 pt-24 pb-16 gap-12">
        <motion.div
          className="flex-1 max-w-xl text-center lg:text-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Zap className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs text-cyber-cyan font-mono tracking-widest uppercase">
              Neuro Science Interface v2.0
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="text-white">探索你的</span>
            <br />
            <span className="glow-text text-cyber-cyan">意识宇宙</span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-400 mb-8 leading-relaxed font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            以前沿科技美学呈现神经科学的无限奥秘。
            <br className="hidden md:block" />
            点击大脑模型，开启一场穿越860亿神经元的认知之旅。
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Link to="/encyclopedia" className="neon-btn inline-flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              进入百科
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button onClick={handleStartInteraction} className="neon-btn inline-flex items-center justify-center gap-2" style={{ borderColor: "#ff00aa", color: "#ff00aa" }}>
              <Brain className="w-4 h-4" />
              开始交互
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {stats.map((s, i) => (
              <div key={s.label} className="text-center lg:text-left">
                <div className="font-display text-2xl text-cyber-cyan glow-text">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-mono tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1 relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        >
          <div className="absolute w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute w-[400px] h-[400px] bg-cyber-pink/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
          <InteractiveBrain />
        </motion.div>
      </section>

      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="glow-text text-cyber-cyan">核心功能</span>
            </h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto">
              融合沉浸式交互与结构化知识体系，重新定义神经科学学习体验
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <GlowCard color={f.color} className="p-8 h-full">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-6"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}40` }}
                  >
                    <f.icon className="w-7 h-7" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: f.color }}>
                    {f.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm leading-relaxed">{f.desc}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 border-t border-cyber-cyan/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">准备好深入</span>{" "}
              <span className="glow-text-pink text-cyber-pink">认知迷宫</span>{" "}
              <span className="text-white">了吗？</span>
            </h2>
            <p className="text-gray-400 font-mono mb-8 max-w-xl mx-auto">
              从大脑皮层到突触间隙，每一个结构都承载着意识的密码。
            </p>
            <Link to="/encyclopedia" className="neon-btn inline-flex items-center gap-2 text-lg px-8 py-3">
              <BookOpen className="w-5 h-5" />
              探索完整知识库
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 py-8 px-6 border-t border-cyber-cyan/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyber-cyan" />
            <span className="font-display text-cyber-cyan glow-text tracking-wider">NeuroMind</span>
          </div>
          <p className="text-xs text-gray-600 font-mono tracking-wider">
            NEURAL EXPLORATION SYSTEM © 2026
          </p>
        </div>
      </footer>

      <InfoPanel />
    </div>
  );
}
