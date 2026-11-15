window.PORTFOLIO_PROJECTS = [
  {
    id: "3dshoot",
    featured: true,
    category: "unity",
    year: "2026",
    title: { zh: "第三人称射击游戏", en: "Third-Person Zombie Shooter" },
    summary: { zh: "用 Unity 搭建可玩的第三人称战斗循环：移动、瞄准、射击和敌人追击。", en: "A playable third-person combat loop built in Unity: movement, aiming, shooting, and enemy pursuit." },
    role: { zh: "个人开发：玩法脚本、敌人逻辑、武器和运行调试。", en: "Personal work: gameplay scripts, enemy logic, weapons, and runtime debugging." },
    tech: ["Unity", "C#", "NavMesh", "Raycast"],
    media: { status: "author-demo", poster: "assets/posters/3dshoot.jpg", previews: [{ path: "assets/videos/3dshoot-full.mp4", hdPath: "assets/videos-hd/3dshoot-hd.mp4", label: { zh: "完整射击循环演示", en: "Full combat loop demo" }, duration: "01:12" }], note: { zh: "完整操作演示：移动、瞄准、射击与敌人追击。原始录制没有有效音轨，因此此视频无声音。", en: "Full operation demo: movement, aiming, shooting, and enemy pursuit. The original recording contains no usable audio track, so this video is silent." } },
    links: []
  },
  {
    id: "disaster-education",
    featured: true,
    category: "unity",
    year: "2026",
    title: { zh: "向生而行 · 灾害教育体验", en: "Live Onward · Disaster Education" },
    summary: { zh: "把校园地震应急流程转化为可探索、可验证的 Unity 交互场景。", en: "A Unity interactive scenario that turns campus earthquake-safety procedures into an explorable, testable experience." },
    role: { zh: "个人工作：场景交互、第三人称控制、剧情流程、HUD、灯光与验证工具。", en: "Personal work: scene interactions, third-person control, narrative flow, HUD, lighting, and validation tools." },
    tech: ["Unity 6", "C#", "Cinemachine", "Input System", "Shader"],
    media: { status: "author-demo", poster: "assets/posters/disaster.jpg", previews: [{ path: "assets/videos/live-onward-full.mp4", hdPath: "assets/videos-hd/live-onward-hd.mp4", label: { zh: "向生而行完整演示", en: "Full Live Onward demo" }, duration: "16:37" }, { path: "assets/videos/science-museum-full.mp4", hdPath: "assets/videos-hd/science-museum-hd.mp4", label: { zh: "科技馆展览完整演示", en: "Full science museum demo" }, duration: "03:11" }], note: { zh: "两段完整操作演示：灾害教育体验与科技馆展览版本。", en: "Two full operation demos: the disaster-education experience and the science-museum exhibition version." } },
    links: []
  },
  {
    id: "ar-unity-model",
    featured: true,
    category: "unity",
    year: "2026",
    title: { zh: "AR 立体书交互体验", en: "AR Pop-up Book Experience" },
    summary: { zh: "基于图像识别的 AR 叙事体验，支持模型交互、缩放、旋转和场景切换。", en: "An image-tracked AR narrative experience with model interaction, scaling, rotation, and scene switching." },
    role: { zh: "个人贡献和团队边界按项目记录说明；Vuforia、模型和视频素材单独标注。", en: "Personal contribution and team boundaries are documented separately; Vuforia, models, and video assets are disclosed." },
    tech: ["Unity", "Vuforia", "AR", "Android"],
    media: { status: "author-demo", poster: "assets/posters/ar.jpg", previews: [{ path: "assets/videos/ar-full.mp4", hdPath: "assets/videos-hd/ar-hd.mp4", label: { zh: "AR 实体交互完整演示", en: "Full AR interaction demo" }, duration: "02:44" }], note: { zh: "完整实体交互演示：图像识别、内容切换和移动端体验。", en: "Full physical interaction demo: image recognition, content switching, and the mobile experience." } },
    links: [{ label: { zh: "项目说明", en: "Project notes" }, href: "#contact" }]
  },
  {
    id: "robot",
    featured: false,
    category: "systems",
    year: "2026",
    title: { zh: "小智桌面陪伴机器人", en: "Xiaozhi Desktop Companion Robot" },
    summary: { zh: "Arduino/ESP32 软硬件集成案例，包含人脸跟踪、舵机控制、触摸屏和语音模块。", en: "A systems-integration case combining Arduino/ESP32, face tracking, servo control, touch display, and voice modules." },
    role: { zh: "个人工作：固件整合、交互逻辑、系统调试和工程文档。", en: "Personal work: firmware integration, interaction logic, system debugging, and engineering documentation." },
    tech: ["Arduino", "ESP32", "I²C", "Servo", "Embedded"],
    media: { status: "author-demo", poster: "assets/posters/robot.jpg", previews: [{ path: "assets/videos/robot-full.mp4", hdPath: "assets/videos-hd/robot-hd.mp4", label: { zh: "机器人完整演示", en: "Full robot demo" }, duration: "01:02" }], note: { zh: "完整交互装置演示：语音、屏幕表情、遥控和人脸跟踪流程。项目于 2026 年夏季参加校内数字艺术展览。", en: "Full interactive-device demo: voice, screen expressions, remote control, and face tracking. The project was exhibited at a campus digital-art exhibition in summer 2026." } },
    exhibitions: [{ year: "2026", title: { zh: "数字艺术周作品展 · PRE RENDERING", en: "Digital Art Week Exhibition · PRE RENDERING" }, note: { zh: "小智桌面陪伴机器人作为交互装置完成现场部署与展示。", en: "The Xiaozhi desktop companion robot was deployed and exhibited as an interactive installation." }, images: ["assets/exhibitions/robot-2026-installation.jpg", "assets/exhibitions/robot-2026-poster.jpg"] }],
    links: [{ label: { zh: "GitHub（私有）", en: "GitHub (private)" }, href: "https://github.com/wang-qingfeng-dev/xiaozhi-desktop-robot" }]
  },
  {
    id: "touchdesigner-installation",
    featured: false,
    category: "systems",
    year: "2025",
    title: { zh: "TouchDesigner 交互装置", en: "TouchDesigner Interactive Installation" },
    summary: { zh: "用 TouchDesigner 和实时追踪组件构建可在展览现场运行的交互视觉装置。", en: "An interactive visual installation built with TouchDesigner and real-time tracking components for exhibition use." },
    role: { zh: "个人工作：TouchDesigner 工程搭建、实时交互逻辑、MediaPipe 组件整合和现场调试。", en: "Personal work: TouchDesigner project setup, real-time interaction logic, MediaPipe integration, and exhibition debugging." },
    tech: ["TouchDesigner", "MediaPipe", "Real-time", "Interactive Installation"],
    media: { status: "author-demo", poster: "assets/posters/touchdesigner.jpg", previews: [{ path: "assets/videos/touchdesigner-2025-full.mp4", label: { zh: "期末交互装置演示", en: "Final interactive-installation demo" }, duration: "" }], note: { zh: "完整演示视频与现场照片展示了可运行的 TouchDesigner 交互装置。项目于 2025 年夏季参加校内数字艺术展览。", en: "The full demo and exhibition photos document a runnable TouchDesigner interactive installation. The project was exhibited at a campus digital-art exhibition in summer 2025." } },
    exhibitions: [{ year: "2025", title: { zh: "数字艺术周作品展 · PRE RENDERING", en: "Digital Art Week Exhibition · PRE RENDERING" }, note: { zh: "交互装置在校内展览现场完成部署，并通过现场屏幕展示实时视觉反馈。", en: "The interactive installation was deployed at the campus exhibition and presented real-time visual feedback on site." }, images: ["assets/exhibitions/td-2025-installation.jpg", "assets/exhibitions/td-2025-work.jpg", "assets/exhibitions/td-2025-poster.jpg"] }],
    links: []
  },
  {
    id: "ielts-writing-studio",
    featured: false,
    category: "systems",
    year: "2026",
    title: { zh: "雅思写作工作台", en: "IELTS Writing Studio" },
    summary: { zh: "面向 Task 1/Task 2 训练的桌面工具，支持可切换的 AI 提供商和结构化复习。", en: "A desktop tool for IELTS Task 1/Task 2 practice with switchable AI providers and structured review." },
    role: { zh: "个人开发：桌面界面、分析流程、Provider 抽象、测试和发布。", en: "Personal work: desktop UI, analysis flow, provider abstraction, testing, and release packaging." },
    tech: ["JavaScript", "Node.js", "Ollama", "Desktop"],
    media: { status: "approved-public", poster: "assets/posters/ielts.jpg", note: { zh: "使用实际工作台界面截图作为封面；公开版本和发布包已整理。", en: "The real writing-studio interface is used as the cover; the public repository and release package are available." } },
    links: [
      { label: { zh: "GitHub", en: "GitHub" }, href: "https://github.com/wang-qingfeng-dev/ielts-writing-studio" },
      { label: { zh: "Release", en: "Release" }, href: "https://github.com/wang-qingfeng-dev/ielts-writing-studio/releases" }
    ]
  },
  {
    id: "filter-study",
    featured: false,
    category: "systems",
    year: "2026",
    title: { zh: "二维目标跟踪滤波研究", en: "Robust 2D Target Smoothing Study" },
    summary: { zh: "用 EMA 和 One Euro 滤波研究二维目标跟踪的平滑、延迟和失败恢复。", en: "A study of smoothing, latency, and recovery in 2D target tracking using EMA and One Euro filters." },
    role: { zh: "个人工作：研究协议、指标、消融实验和可复现实验脚本。", en: "Personal work: protocol, metrics, ablation experiments, and reproducible scripts." },
    tech: ["Python", "Computer Vision", "Metrics", "Ablation"],
    media: { status: "approved-public", poster: "assets/posters/research.jpg", note: { zh: "使用实际实验结果图作为封面；数据集条款仍需随项目说明保留。", en: "An actual experiment result figure is used as the cover; dataset terms remain part of the project notes." } },
    links: [{ label: { zh: "GitHub", en: "GitHub" }, href: "https://github.com/wang-qingfeng-dev/face-tracking-filter-study" }]
  }
];
