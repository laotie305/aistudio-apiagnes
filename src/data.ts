import { 
  Eye, 
  FileText, 
  Search, 
  Palette, 
  Sparkles 
} from "lucide-react";
import { AnalyzedImage, AnalyzedWebpage, AnalyzedVideo } from "./types";

export const DEMO_IMAGES: AnalyzedImage[] = [
  {
    id: "demo-cafe",
    name: "温馨咖啡馆",
    dataUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    uploadedAt: "系统内置 (System Built-in)",
    size: "1.2 MB",
    description: "点击下方的“开始识别”按钮，让 Agnes-2.0-Flash 深度分析并描述此图片的内容！",
    history: []
  },
  {
    id: "demo-workspace",
    name: "极简工作台",
    dataUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    uploadedAt: "系统内置 (System Built-in)",
    size: "920 KB",
    description: "点击下方的“开始识别”按钮，让 Agnes-2.0-Flash 深度分析并描述此图片的内容！",
    history: []
  },
  {
    id: "demo-mountain",
    name: "雄伟雪山",
    dataUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    uploadedAt: "系统内置 (System Built-in)",
    size: "1.5 MB",
    description: "点击下方的“开始识别”按钮，让 Agnes-2.0-Flash 深度分析并描述此图片的内容！",
    history: []
  }
];

export const PREDEFINED_PROMPTS = [
  {
    id: "describe",
    label: "详细画面描述",
    icon: Eye,
    prompt: "请详细描述这张图片的内容，包括主体、场景细节、环境氛围以及任何引人注目的特征。用中文回答。"
  },
  {
    id: "ocr",
    label: "提取并翻译文字",
    icon: FileText,
    prompt: "请识别并提取出图片中的所有文字，保持其排版顺序，并对其中的英文或非中文内容进行优雅的中文翻译。"
  },
  {
    id: "objects",
    label: "物体识别与定位",
    icon: Search,
    prompt: "请识别图片中的所有主要物理对象，列出它们，并简要描述它们在画面中的空间位置 and 相互关系。"
  },
  {
    id: "art",
    label: "艺术风格与构图",
    icon: Palette,
    prompt: "请从艺术美学、色彩搭配（色调与冷暖）、构图方式（如三分法/对称等）以及视觉张力角度深度剖析这张图片。"
  },
  {
    id: "social",
    label: "社交媒体文案",
    icon: Sparkles,
    prompt: "请针对这张图片，生成3条不同风格的、适合发朋友圈或小红书的精美配文，并附带相关的热门搜索标签（Hashtags）。"
  }
];

export const DEMO_WEBPAGES: AnalyzedWebpage[] = [
  {
    id: "demo-ai",
    name: "维基百科: 人工智能",
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    uploadedAt: "系统内置 (System Built-in)",
    description: "点击下方的“开始网页分析”按钮，让 AI 深入读取并智能概括维基百科上关于人工智能的深度词条！",
    history: []
  },
  {
    id: "demo-github",
    name: "GitHub 官方博客",
    url: "https://github.blog/",
    uploadedAt: "系统内置 (System Built-in)",
    description: "点击下方的“开始网页分析”按钮，让 AI 深入读取并智能概括 GitHub 官方博客，提取技术新风向！",
    history: []
  }
];

export const PREDEFINED_WEBPAGE_PROMPTS = [
  {
    id: "summary",
    label: "核心摘要",
    icon: FileText,
    prompt: "请阅读该网页的内容，并提供一份精简、结构化的核心内容摘要，包括其主要观点、背景信息和关键结论。用中文回答。"
  },
  {
    id: "key-points",
    label: "提取要点与数据",
    icon: Search,
    prompt: "请从该网页中提取出所有重要数据、数字、专有名词、链接要点，并分门别类列出。用中文回答。"
  },
  {
    id: "structure",
    label: "文章结构与大纲",
    icon: Eye,
    prompt: "请分析该网页内容的逻辑架构，输出其章节大纲及每个部分的核心思想。用中文回答。"
  },
  {
    id: "tone",
    label: "写作风格与情感",
    icon: Palette,
    prompt: "请分析该网页内容的写作风格、目标受众、情感倾向（积极/中立/消极）以及传达的态度。"
  }
];

export const DEMO_VIDEOS: AnalyzedVideo[] = [
  {
    id: "demo-stream",
    name: "林间暖阳溪流",
    dataUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    uploadedAt: "系统内置 (System Built-in)",
    size: "2.4 MB",
    isVideoUrl: true,
    description: "点击下方的“开始视频分析”按钮，让 Agnes-2.0-Flash 深度识别并描述这段阳光森林溪流视频的动作与氛围！",
    history: []
  },
  {
    id: "demo-city",
    name: "未来科幻都市",
    dataUrl: "https://assets.mixkit.co/videos/preview/mixkit-animation-of-a-futuristic-city-43187-large.mp4",
    uploadedAt: "系统内置 (System Built-in)",
    size: "3.2 MB",
    isVideoUrl: true,
    description: "点击下方的“开始视频分析”按钮，让 Agnes-2.0-Flash 深度识别并描述这段科幻都市动画的视觉构图与场景特征！",
    history: []
  }
];

export const PREDEFINED_VIDEO_PROMPTS = [
  {
    id: "scene-summary",
    label: "画面内容摘要",
    icon: Eye,
    prompt: "请对这段视频的内容进行详细总结，描述视频中发生的主要事件、场景变换、出现的主体以及整体氛围。用中文回答。"
  },
  {
    id: "action-tracker",
    label: "动作与事件追踪",
    icon: Search,
    prompt: "请详细列出视频中发生的动作、物体的移动以及关键画面帧的演变和场景剪辑节奏。用中文回答。"
  },
  {
    id: "style-analysis",
    label: "艺术风格与色彩",
    icon: Palette,
    prompt: "请从视觉美学、剪辑镜头、色彩基调（暖/冷、饱和度）和画面构图角度，深度剖析这段视频的视觉特征。用中文回答。"
  },
  {
    id: "video-caption",
    label: "视频文案与标签",
    icon: Sparkles,
    prompt: "根据这段视频的内容与画面氛围，生成3组适合发布在抖音、B站、视频号或小红书的吸引人的精美视频文案，并附带相关热门标签（Hashtags）。"
  }
];

