export interface BrainRegionPosition {
  id: string
  name: string
  nameEn: string
  cx: number
  cy: number
  rx: number
  ry: number
  color: string
  category: string
}

export interface NeuralActivityStep {
  id: string
  regionId: string
  time: number
  duration: number
  intensity: number
  description: string
}

export interface BehaviorData {
  id: string
  name: string
  icon: string
  description: string
  color: string
  regions: string[]
  steps: NeuralActivityStep[]
  workflowDescription: string
}

export const brainRegionPositions: BrainRegionPosition[] = [
  { id: 'prefrontal', name: '前额叶皮层', nameEn: 'Prefrontal Cortex', cx: 310, cy: 160, rx: 55, ry: 40, color: '#8b5cf6', category: '执行' },
  { id: 'broca', name: '布洛卡区', nameEn: "Broca's Area", cx: 340, cy: 220, rx: 30, ry: 22, color: '#00f0ff', category: '语言' },
  { id: 'wernicke', name: '韦尼克区', nameEn: "Wernicke's Area", cx: 220, cy: 240, rx: 30, ry: 22, color: '#06b6d4', category: '语言' },
  { id: 'angular-gyrus', name: '角回', nameEn: 'Angular Gyrus', cx: 200, cy: 210, rx: 25, ry: 20, color: '#22d3ee', category: '语言' },
  { id: 'primary-motor', name: '初级运动皮层', nameEn: 'Primary Motor Cortex', cx: 280, cy: 130, rx: 40, ry: 18, color: '#00ff88', category: '运动' },
  { id: 'premotor', name: '前运动皮层', nameEn: 'Premotor Cortex', cx: 330, cy: 120, rx: 30, ry: 16, color: '#10b981', category: '运动' },
  { id: 'somatosensory', name: '初级躯体感觉皮层', nameEn: 'Somatosensory Cortex', cx: 250, cy: 130, rx: 35, ry: 18, color: '#f59e0b', category: '感觉' },
  { id: 'primary-visual', name: '初级视觉皮层', nameEn: 'Primary Visual Cortex', cx: 110, cy: 210, rx: 35, ry: 28, color: '#ff00aa', category: '视觉' },
  { id: 'v4', name: '视觉V4区', nameEn: 'Visual Cortex V4', cx: 140, cy: 180, rx: 25, ry: 18, color: '#ec4899', category: '视觉' },
  { id: 'ffa', name: '梭状回面孔区', nameEn: 'FFA', cx: 165, cy: 250, rx: 25, ry: 18, color: '#f472b6', category: '视觉' },
  { id: 'mt-v5', name: 'MT/V5区', nameEn: 'MT/V5', cx: 135, cy: 240, rx: 22, ry: 16, color: '#f9a8d4', category: '视觉' },
  { id: 'hippocampus', name: '海马体', nameEn: 'Hippocampus', cx: 210, cy: 280, rx: 28, ry: 18, color: '#a855f7', category: '记忆' },
  { id: 'amygdala', name: '杏仁核', nameEn: 'Amygdala', cx: 235, cy: 265, rx: 22, ry: 16, color: '#c084fc', category: '情绪' },
  { id: 'cerebellum', name: '小脑', nameEn: 'Cerebellum', cx: 100, cy: 280, rx: 45, ry: 30, color: '#34d399', category: '运动' },
  { id: 'thalamus', name: '丘脑', nameEn: 'Thalamus', cx: 240, cy: 240, rx: 22, ry: 18, color: '#fb923c', category: '中继' },
  { id: 'brainstem', name: '脑干', nameEn: 'Brainstem', cx: 195, cy: 310, rx: 25, ry: 30, color: '#94a3b8', category: '基础' },
  { id: 'auditory', name: '听觉皮层', nameEn: 'Auditory Cortex', cx: 195, cy: 225, rx: 25, ry: 18, color: '#fbbf24', category: '感觉' },
  { id: 'basal-ganglia', name: '基底神经节', nameEn: 'Basal Ganglia', cx: 255, cy: 230, rx: 22, ry: 16, color: '#a3e635', category: '运动' },
]

export const behaviors: BehaviorData[] = [
  {
    id: 'reading',
    name: '阅读',
    icon: '📖',
    description: '阅读是一个复杂的认知过程，需要多个脑区协同工作，将视觉符号转化为语义理解',
    color: '#00f0ff',
    regions: ['primary-visual', 'v4', 'angular-gyrus', 'wernicke', 'broca', 'prefrontal', 'hippocampus'],
    steps: [
      { id: 'r1', regionId: 'primary-visual', time: 0, duration: 200, intensity: 0.9, description: '视觉皮层接收文字的光学信号，提取线条和边缘等基础视觉特征' },
      { id: 'r2', regionId: 'v4', time: 100, duration: 200, intensity: 0.8, description: 'V4区处理文字的颜色和形状信息，进行中级视觉特征整合' },
      { id: 'r3', regionId: 'angular-gyrus', time: 250, duration: 300, intensity: 0.95, description: '角回将视觉文字符号转换为语音编码，实现"形-音"转换' },
      { id: 'r4', regionId: 'wernicke', time: 400, duration: 400, intensity: 1.0, description: '韦尼克区对语音编码进行语义理解，提取文字的含义' },
      { id: 'r5', regionId: 'broca', time: 600, duration: 300, intensity: 0.7, description: '布洛卡区参与内部语音生成，辅助语义加工和句法分析' },
      { id: 'r6', regionId: 'prefrontal', time: 700, duration: 500, intensity: 0.85, description: '前额叶整合语义信息，进行推理、判断和上下文关联' },
      { id: 'r7', regionId: 'hippocampus', time: 900, duration: 400, intensity: 0.6, description: '海马体将阅读内容与已有记忆关联，编码新的记忆痕迹' },
    ],
    workflowDescription: '视觉信号 → 文字识别 → 语音转换 → 语义理解 → 认知整合 → 记忆编码',
  },
  {
    id: 'speaking',
    name: '说话',
    icon: '🗣️',
    description: '说话涉及从意念形成到语音产出的完整语言生成链路，是最高级的认知运动协调之一',
    color: '#ffd700',
    regions: ['prefrontal', 'wernicke', 'broca', 'premotor', 'primary-motor', 'auditory', 'cerebellum'],
    steps: [
      { id: 's1', regionId: 'prefrontal', time: 0, duration: 300, intensity: 0.95, description: '前额叶形成表达意图，选择要传达的信息和说话策略' },
      { id: 's2', regionId: 'wernicke', time: 200, duration: 300, intensity: 0.9, description: '韦尼克区组织语言语义内容，选择合适的词汇和句法结构' },
      { id: 's3', regionId: 'broca', time: 450, duration: 350, intensity: 1.0, description: '布洛卡区将语义表征转换为语法结构和音韵编码，规划语音序列' },
      { id: 's4', regionId: 'premotor', time: 650, duration: 200, intensity: 0.8, description: '前运动皮层制定发声器官的运动计划，安排肌肉激活序列' },
      { id: 's5', regionId: 'primary-motor', time: 800, duration: 300, intensity: 0.95, description: '初级运动皮层精确控制唇、舌、喉等发声肌肉执行运动指令' },
      { id: 's6', regionId: 'auditory', time: 900, duration: 400, intensity: 0.7, description: '听觉皮层实时监控自己的语音输出，进行反馈调节' },
      { id: 's7', regionId: 'cerebellum', time: 850, duration: 350, intensity: 0.75, description: '小脑协调发声的时序和节奏，确保语音流畅准确' },
    ],
    workflowDescription: '意图形成 → 语义组织 → 语法编码 → 运动规划 → 肌肉执行 → 反馈调节',
  },
  {
    id: 'running',
    name: '跑步',
    icon: '🏃',
    description: '跑步是复杂的全身协调运动，需要运动规划、执行、平衡和自主神经系统的精密配合',
    color: '#00ff88',
    regions: ['prefrontal', 'premotor', 'primary-motor', 'cerebellum', 'basal-ganglia', 'somatosensory', 'brainstem', 'thalamus'],
    steps: [
      { id: 'ru1', regionId: 'prefrontal', time: 0, duration: 200, intensity: 0.7, description: '前额叶做出跑步决策，设定运动目标和速度预期' },
      { id: 'ru2', regionId: 'basal-ganglia', time: 150, duration: 300, intensity: 0.85, description: '基底神经节启动运动程序，选择并激活适当的运动模式' },
      { id: 'ru3', regionId: 'premotor', time: 250, duration: 250, intensity: 0.9, description: '前运动皮层规划肢体运动序列，协调左右肢体的交替运动' },
      { id: 'ru4', regionId: 'primary-motor', time: 400, duration: 600, intensity: 1.0, description: '初级运动皮层发出精确的运动指令，控制全身肌肉收缩' },
      { id: 'ru5', regionId: 'cerebellum', time: 350, duration: 700, intensity: 0.95, description: '小脑实时协调运动节奏和平衡，修正运动误差' },
      { id: 'ru6', regionId: 'somatosensory', time: 450, duration: 500, intensity: 0.8, description: '躯体感觉皮层接收本体感觉和触觉反馈，感知肢体位置' },
      { id: 'ru7', regionId: 'thalamus', time: 300, duration: 600, intensity: 0.7, description: '丘脑作为感觉信息中继站，将运动反馈信号传递至皮层' },
      { id: 'ru8', regionId: 'brainstem', time: 500, duration: 500, intensity: 0.85, description: '脑干调节呼吸频率和心率，维持跑步时的自主神经平衡' },
    ],
    workflowDescription: '运动决策 → 程序启动 → 运动规划 → 指令执行 → 协调平衡 → 反馈调整 → 自主调节',
  },
  {
    id: 'sleeping',
    name: '睡觉',
    icon: '😴',
    description: '睡眠是大脑主动调节的意识状态，涉及多个脑区的协同抑制与激活，对记忆巩固和脑功能恢复至关重要',
    color: '#a78bfa',
    regions: ['prefrontal', 'thalamus', 'hippocampus', 'amygdala', 'brainstem', 'cerebellum'],
    steps: [
      { id: 'sl1', regionId: 'brainstem', time: 0, duration: 400, intensity: 0.6, description: '脑干睡眠中枢释放抑制性信号，启动从觉醒到睡眠的转换' },
      { id: 'sl2', regionId: 'thalamus', time: 200, duration: 500, intensity: 0.7, description: '丘脑关闭感觉信息传递门控，阻断外界刺激进入大脑皮层' },
      { id: 'sl3', regionId: 'prefrontal', time: 400, duration: 600, intensity: 0.5, description: '前额叶活动逐渐降低，意识思维和逻辑推理功能减弱' },
      { id: 'sl4', regionId: 'hippocampus', time: 600, duration: 800, intensity: 0.9, description: '海马体在慢波睡眠中回放白天记忆，将短期记忆巩固为长期记忆' },
      { id: 'sl5', regionId: 'amygdala', time: 800, duration: 500, intensity: 0.75, description: '杏仁核在REM睡眠中参与情绪记忆处理和梦境的情绪色彩生成' },
      { id: 'sl6', regionId: 'cerebellum', time: 700, duration: 400, intensity: 0.4, description: '小脑在睡眠中维持基础肌张力调节和身体姿势的自动控制' },
    ],
    workflowDescription: '睡眠启动 → 感觉门控 → 皮层抑制 → 记忆巩固 → 情绪处理 → 基础维持',
  },
]
