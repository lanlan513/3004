import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Lightbulb, ArrowRight } from "lucide-react";
import { useBrainStore } from "@/store/useBrainStore";
import { memory, language, motor, vision } from "@/data/brainRegions";
import type { BrainRegionData } from "@/types";

interface RegionInfo {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  description: string;
  functions: string[];
  facts: string[];
  subRegions: BrainRegionData[];
}

const regionMap: Record<string, RegionInfo> = {
  memory: {
    id: "memory",
    name: "记忆区",
    nameEn: "Memory System",
    color: "#8b5cf6",
    description:
      "记忆系统是大脑中负责编码、存储和提取信息的复杂神经网络，主要分布在内侧颞叶区域，包括海马体、杏仁核等关键结构，是我们身份认知和学习能力的核心基础。",
    functions: [
      "短期记忆的暂时存储与处理",
      "长期记忆的形成与巩固",
      "情景记忆与陈述性记忆编码",
      "空间导航与认知地图构建",
      "情绪记忆的整合与调节",
    ],
    facts: [
      "海马体是大脑中少数能在成年后持续产生新神经元的区域之一",
      "睡眠期间，海马体会与大脑皮层进行信息回放，帮助记忆巩固",
      "伦敦出租车司机的海马体后部比普通人更大，与复杂空间知识掌握有关",
    ],
    subRegions: memory,
  },
  language: {
    id: "language",
    name: "语言区",
    nameEn: "Language Network",
    color: "#00f0ff",
    description:
      "语言网络是人类大脑独有的高级认知系统，主要分布在左侧大脑半球，包括布洛卡区、韦尼克区和角回等关键区域，负责语言的理解、产生和加工。",
    functions: [
      "口语语言的产生与表达",
      "语言语义的理解与处理",
      "书面语言的阅读与写作",
      "语法结构的应用与组织",
      "多语言信息的整合与切换",
    ],
    facts: [
      "1861年法国外科医生布洛卡通过失语症患者Tan的研究发现了语言产生中枢",
      "韦尼克区损伤会导致感觉性失语症，患者说话流利但内容空洞",
      "双语者的两种语言在布洛卡区和韦尼克区中有部分重叠但不完全相同的表征",
    ],
    subRegions: language,
  },
  motor: {
    id: "motor",
    name: "运动区",
    nameEn: "Motor System",
    color: "#00ff88",
    description:
      "运动系统位于大脑顶部中央区域，包括初级运动皮层、前运动皮层和小脑等结构，负责随意运动的发起、计划、协调和精确控制，是我们与物理世界交互的核心。",
    functions: [
      "随意运动的发起与执行",
      "运动的计划与准备",
      "肢体协调与平衡维持",
      "运动技能的学习与程序化",
      "精细动作的精确控制",
    ],
    facts: [
      "运动皮层存在'小人图'映射：身体各部位代表区大小与运动精细程度成正比",
      "手和嘴唇在运动皮层上占据的区域最大，需要最精细的运动控制",
      "小脑虽只占脑体积10%，但包含全脑约50%的神经元",
    ],
    subRegions: motor,
  },
  vision: {
    id: "vision",
    name: "视觉区",
    nameEn: "Visual Cortex",
    color: "#ff00aa",
    description:
      "视觉皮层位于大脑后部枕叶，是处理视觉信息的主要脑区，从初级视觉皮层（V1）到高级视觉区域，负责从基础特征检测到复杂物体、面孔和运动感知的多层次加工。",
    functions: [
      "基础视觉特征加工（线条、朝向、颜色）",
      "物体形状与面孔识别",
      "视觉运动方向与速度检测",
      "空间视觉与深度感知",
      "视觉注意与眼动调控",
    ],
    facts: [
      "中央凹在V1中占据的皮层区域远大于周边视觉，因此中央视觉分辨率更高",
      "FFA（梭状回面孔区）是专门处理面孔感知的脑区，由Nancy Kanwisher于1997年发现",
      "约2%的人群天生患有发展性面孔失认症，一生都存在'脸盲'现象",
    ],
    subRegions: vision,
  },
};

export default function InfoPanel() {
  const { selectedRegion, isPanelOpen, setPanelOpen, setSelectedRegion } = useBrainStore();

  const handleClose = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedRegion(null), 300);
  };

  const regionInfo = selectedRegion ? regionMap[selectedRegion] : null;

  return (
    <AnimatePresence>
      {isPanelOpen && regionInfo && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={handleClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[420px] z-40 overflow-hidden"
          >
            <div className="h-full glass-card cyber-border overflow-hidden relative" style={{ borderColor: `${regionInfo.color}40` }}>
              <motion.div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: regionInfo.color }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.25, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute top-1/3 -left-10 w-40 h-40 rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: regionInfo.color }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute bottom-10 right-10 w-32 h-32 opacity-15"
                style={{
                  background: `linear-gradient(135deg, ${regionInfo.color}, transparent)`,
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute top-20 left-8 w-20 h-20 opacity-10"
                style={{
                  border: `2px solid ${regionInfo.color}`,
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative h-full overflow-y-auto custom-scrollbar p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="font-display font-black text-3xl tracking-wider mb-1"
                      style={{
                        color: regionInfo.color,
                        textShadow: `0 0 20px ${regionInfo.color}80, 0 0 40px ${regionInfo.color}40`,
                      }}
                    >
                      {regionInfo.name}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="font-mono text-sm text-white/50 tracking-widest uppercase"
                    >
                      {regionInfo.nameEn}
                    </motion.p>
                  </div>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleClose}
                    className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X
                      className="w-5 h-5 transition-colors duration-300 text-white/60 group-hover:text-white"
                      style={{
                        filter: `drop-shadow(0 0 5px ${regionInfo.color}60)`,
                      }}
                    />
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-px mb-6"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${regionInfo.color}60, transparent)`,
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-6"
                >
                  <p className="font-mono text-sm leading-relaxed text-white/75">
                    {regionInfo.description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2" style={{ color: regionInfo.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: regionInfo.color, boxShadow: `0 0 10px ${regionInfo.color}` }} />
                    核心功能
                  </h2>
                  <ul className="space-y-3">
                    {regionInfo.functions.map((func, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{
                            color: regionInfo.color,
                            filter: `drop-shadow(0 0 4px ${regionInfo.color}80)`,
                          }}
                        />
                        <span className="font-mono text-sm text-white/70 leading-relaxed">
                          {func}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2" style={{ color: regionInfo.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: regionInfo.color, boxShadow: `0 0 10px ${regionInfo.color}` }} />
                    科学事实
                  </h2>
                  <div className="space-y-3">
                    {regionInfo.facts.map((fact, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55 + i * 0.1 }}
                        className="glass-card p-4 rounded-lg relative overflow-hidden group"
                        style={{
                          borderColor: `${regionInfo.color}30`,
                          border: `1px solid ${regionInfo.color}20`,
                        }}
                        whileHover={{
                          backgroundColor: `${regionInfo.color}08`,
                          borderColor: `${regionInfo.color}40`,
                        }}
                      >
                        <div
                          className="absolute top-0 left-0 w-1 h-full"
                          style={{
                            backgroundColor: regionInfo.color,
                            opacity: 0.6,
                          }}
                        />
                        <div className="flex gap-3">
                          <Lightbulb
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{
                              color: regionInfo.color,
                              filter: `drop-shadow(0 0 6px ${regionInfo.color}80)`,
                            }}
                          />
                          <p className="font-mono text-xs leading-relaxed text-white/65">
                            {fact}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  className="mb-6"
                >
                  <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2" style={{ color: regionInfo.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: regionInfo.color, boxShadow: `0 0 10px ${regionInfo.color}` }} />
                    包含子区域
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {regionInfo.subRegions.map((sub, i) => (
                      <motion.span
                        key={sub.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.08 }}
                        className="px-3 py-1.5 rounded-full font-mono text-xs cursor-pointer transition-all duration-300"
                        style={{
                          backgroundColor: `${sub.color}15`,
                          border: `1px solid ${sub.color}40`,
                          color: sub.color,
                        }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: `${sub.color}25`,
                          boxShadow: `0 0 15px ${sub.color}40`,
                        }}
                      >
                        {sub.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="pb-4"
                >
                  <motion.button
                    className="w-full neon-btn flex items-center justify-center gap-2 rounded-md py-3"
                    style={{
                      borderColor: regionInfo.color,
                      color: regionInfo.color,
                    }}
                    whileHover={{
                      backgroundColor: `${regionInfo.color}15`,
                      boxShadow: `0 0 25px ${regionInfo.color}40, inset 0 0 25px ${regionInfo.color}10`,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-display tracking-wider text-sm">探索更多</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
