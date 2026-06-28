import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Play, 
  HelpCircle, 
  RefreshCw, 
  FileText, 
  Palette, 
  Eye, 
  History, 
  Search,
  ChevronRight,
  AlertCircle,
  Globe,
  Video,
  Link as LinkIcon,
  Plus,
  FileVideo,
  Folder,
  Brain,
  Settings,
  Mic,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalyzedImage, AnalysisHistoryItem, AnalyzedWebpage, AnalyzedVideo } from "./types";
import { 
  DEMO_IMAGES, 
  PREDEFINED_PROMPTS, 
  DEMO_WEBPAGES, 
  PREDEFINED_WEBPAGE_PROMPTS, 
  DEMO_VIDEOS, 
  PREDEFINED_VIDEO_PROMPTS 
} from "./data";
import MediaLibrary from "./components/MediaLibrary";
import PreviewArea from "./components/PreviewArea";
import DiagnosisCenter from "./components/DiagnosisCenter";
import BottomChatBar from "./components/BottomChatBar";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("agnes_theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("agnes_theme", theme);
  }, [theme]);

  // Workspace Mode: 'image' | 'webpage' | 'video'
  const [mode, setMode] = useState<"image" | "webpage" | "video">("image");
  const [activeTab, setActiveTab] = useState<"result" | "history">("result");

  // Mobile navigation tabs: 'library' | 'preview' | 'diagnosis'
  const [activeMobileTab, setActiveMobileTab] = useState<"library" | "preview" | "diagnosis">("library");
  const [chatInput, setChatInput] = useState<string>("");
  const [libraryAddTab, setLibraryAddTab] = useState<"upload" | "link">("upload");

  // --- IMAGE STATE ---
  const [images, setImages] = useState<AnalyzedImage[]>(() => {
    const cached = localStorage.getItem("agnes_images_v2");
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEMO_IMAGES; }
    }
    return DEMO_IMAGES;
  });
  const [selectedImageId, setSelectedImageId] = useState<string>(DEMO_IMAGES[0].id);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(PREDEFINED_PROMPTS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // --- WEBPAGE STATE ---
  const [webpages, setWebpages] = useState<AnalyzedWebpage[]>(() => {
    const cached = localStorage.getItem("agnes_webpages_v2");
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEMO_WEBPAGES; }
    }
    return DEMO_WEBPAGES;
  });
  const [selectedWebpageId, setSelectedWebpageId] = useState<string>(DEMO_WEBPAGES[0].id);
  const [selectedWebpagePromptId, setSelectedWebpagePromptId] = useState<string>(PREDEFINED_WEBPAGE_PROMPTS[0].id);
  const [customWebpagePrompt, setCustomWebpagePrompt] = useState<string>("");
  const [webpageUrlInput, setWebpageUrlInput] = useState<string>("");

  // --- VIDEO STATE ---
  const [videos, setVideos] = useState<AnalyzedVideo[]>(() => {
    const cached = localStorage.getItem("agnes_videos_v2");
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEMO_VIDEOS; }
    }
    return DEMO_VIDEOS;
  });
  const [selectedVideoId, setSelectedVideoId] = useState<string>(DEMO_VIDEOS[0].id);
  const [selectedVideoPromptId, setSelectedVideoPromptId] = useState<string>(PREDEFINED_VIDEO_PROMPTS[0].id);
  const [customVideoPrompt, setCustomVideoPrompt] = useState<string>("");

  // Loading Steps Indicators
  const [loadingStep, setLoadingStep] = useState<string>("初始化多模态模型芯片...");
  const [videoLoadingStep, setVideoLoadingStep] = useState<string>("初始化视频时序推理序列...");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cached lists persistent store
  useEffect(() => {
    localStorage.setItem("agnes_images_v2", JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem("agnes_webpages_v2", JSON.stringify(webpages));
  }, [webpages]);

  useEffect(() => {
    localStorage.setItem("agnes_videos_v2", JSON.stringify(videos));
  }, [videos]);

  const selectedImage = images.find((img) => img.id === selectedImageId);
  const selectedWebpage = webpages.find((wp) => wp.id === selectedWebpageId);
  const selectedVideo = videos.find((v) => v.id === selectedVideoId);

  // --- ANALYSIS HANDLERS ---

  // Image analysis runner
  const analyzeImage = async (overridePrompt?: string) => {
    if (!selectedImage) return;

    // Build the dynamic prompt request
    let promptText = "";
    if (overridePrompt) {
      promptText = overridePrompt;
    } else if (customPrompt.trim()) {
      promptText = customPrompt.trim();
    } else {
      const predefined = PREDEFINED_PROMPTS.find((p) => p.id === selectedPromptId);
      promptText = predefined ? predefined.prompt : "分析并诊断这张图像。";
    }

    setImages((prev) =>
      prev.map((img) =>
        img.id === selectedImageId ? { ...img, analyzing: true, error: undefined } : img
      )
    );
    setActiveTab("result");

    // Start loading steps ticker
    const steps = [
      "🔄 启动双模态视觉特征提取引擎...",
      "🔬 解码图像像素张量与色彩直方图...",
      "🧠 多尺度空间金字塔池化特征对齐中...",
      "⚡ 注入预设诊断模板注意力权重...",
      "📝 生成全息视觉识别诊断专家报告..."
    ];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const ticker = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
      }
    }, 1800);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage.dataUrl,
          prompt: promptText,
          imageName: selectedImage.name
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `服务器请求失败 (HTTP ${response.status})`);
      }

      const data = await response.json();
      const timestamp = new Date().toLocaleString("zh-CN", { hour12: false });
      const newHistoryItem: AnalysisHistoryItem = {
        prompt: promptText,
        result: data.result || data.description,
        timestamp
      };

      setImages((prev) =>
        prev.map((img) => {
          if (img.id === selectedImageId) {
            return {
              ...img,
              analyzing: false,
              description: data.result || data.description,
              history: [newHistoryItem, ...(img.history || [])]
            };
          }
          return img;
        })
      );
      setCustomPrompt("");
    } catch (err: any) {
      console.error(err);
      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedImageId ? { ...img, analyzing: false, error: err.message || "未知多模态诊断错误" } : img
        )
      );
    } finally {
      clearInterval(ticker);
    }
  };

  // Webpage analysis runner
  const analyzeWebpage = async (overridePrompt?: string) => {
    if (!selectedWebpage) return;

    let promptText = "";
    if (overridePrompt) {
      promptText = overridePrompt;
    } else if (customWebpagePrompt.trim()) {
      promptText = customWebpagePrompt.trim();
    } else {
      const predefined = PREDEFINED_WEBPAGE_PROMPTS.find((p) => p.id === selectedWebpagePromptId);
      promptText = predefined ? predefined.prompt : "提取并总结该网页的核心内容。";
    }

    setWebpages((prev) =>
      prev.map((wp) =>
        wp.id === selectedWebpageId ? { ...wp, analyzing: true, error: undefined } : wp
      )
    );
    setActiveTab("result");

    try {
      const response = await fetch("/api/analyze-webpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: selectedWebpage.url,
          prompt: promptText,
          scrapedText: selectedWebpage.scrapedText
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `网页爬取诊断服务异常 (HTTP ${response.status})`);
      }

      const data = await response.json();
      const timestamp = new Date().toLocaleString("zh-CN", { hour12: false });
      const newHistoryItem: AnalysisHistoryItem = {
        prompt: promptText,
        result: data.result || data.description,
        timestamp
      };

      setWebpages((prev) =>
        prev.map((wp) => {
          if (wp.id === selectedWebpageId) {
            return {
              ...wp,
              analyzing: false,
              scrapedText: data.scrapedText || wp.scrapedText,
              description: data.result || data.description,
              history: [newHistoryItem, ...(wp.history || [])]
            };
          }
          return wp;
        })
      );
      setCustomWebpagePrompt("");
    } catch (err: any) {
      console.error(err);
      setWebpages((prev) =>
        prev.map((wp) =>
          wp.id === selectedWebpageId ? { ...wp, analyzing: false, error: err.message || "网页抓取识别失败" } : wp
        )
      );
    }
  };

  // Video analysis runner
  const analyzeVideo = async (overridePrompt?: string) => {
    if (!selectedVideo) return;

    let promptText = "";
    if (overridePrompt) {
      promptText = overridePrompt;
    } else if (customVideoPrompt.trim()) {
      promptText = customVideoPrompt.trim();
    } else {
      const predefined = PREDEFINED_VIDEO_PROMPTS.find((p) => p.id === selectedVideoPromptId);
      promptText = predefined ? predefined.prompt : "对该视频片段进行多模态时序内容检索与深度分析诊断。";
    }

    setVideos((prev) =>
      prev.map((v) =>
        v.id === selectedVideoId ? { ...v, analyzing: true, error: undefined } : v
      )
    );
    setActiveTab("result");

    // Ticker progress steps
    const steps = [
      "🎞️ 正在抽取视频关键帧帧序列...",
      "🎵 提取音轨并进行时序多模态切片...",
      "🔬 解码空间三维密集光流场信息...",
      "🧠 时空跨膜注意力模型进行时序对齐...",
      "📝 整合专家级多维视频时序诊断大纲报告..."
    ];
    let stepIndex = 0;
    setVideoLoadingStep(steps[0]);
    const ticker = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setVideoLoadingStep(steps[stepIndex]);
      }
    }, 2000);

    try {
      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: selectedVideo.dataUrl,
          prompt: promptText,
          videoName: selectedVideo.name
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `视频提取诊断服务异常 (HTTP ${response.status})`);
      }

      const data = await response.json();
      const timestamp = new Date().toLocaleString("zh-CN", { hour12: false });
      const newHistoryItem: AnalysisHistoryItem = {
        prompt: promptText,
        result: data.result || data.description,
        timestamp
      };

      setVideos((prev) =>
        prev.map((v) => {
          if (v.id === selectedVideoId) {
            return {
              ...v,
              analyzing: false,
              description: data.result || data.description,
              history: [newHistoryItem, ...(v.history || [])]
            };
          }
          return v;
        })
      );
      setCustomVideoPrompt("");
    } catch (err: any) {
      console.error(err);
      setVideos((prev) =>
        prev.map((v) =>
          v.id === selectedVideoId ? { ...v, analyzing: false, error: err.message || "视频深度诊断异常" } : v
        )
      );
    } finally {
      clearInterval(ticker);
    }
  };

  // --- DATA CREATION & DELETION HANDLERS ---

  // Upload local image
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newImage: AnalyzedImage = {
        id: "user-img-" + Date.now(),
        name: file.name,
        dataUrl,
        uploadedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
        history: []
      };
      setImages((prev) => [newImage, ...prev]);
      setSelectedImageId(newImage.id);
      setActiveTab("result");
      setActiveMobileTab("preview");
    };
    reader.readAsDataURL(file);
  };

  // Upload local video
  const handleVideoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newVideo: AnalyzedVideo = {
        id: "user-vid-" + Date.now(),
        name: file.name,
        dataUrl,
        uploadedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
        history: []
      };
      setVideos((prev) => [newVideo, ...prev]);
      setSelectedVideoId(newVideo.id);
      setActiveTab("result");
      setActiveMobileTab("preview");
    };
    reader.readAsDataURL(file);
  };

  // Scrape & add webpage item
  const handleAddWebpage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webpageUrlInput.trim()) return;

    const url = webpageUrlInput.trim();
    setWebpageUrlInput("");

    const newId = "user-wp-" + Date.now();
    const newWebpage: AnalyzedWebpage = {
      id: newId,
      name: "抓取中: " + url.replace(/^https?:\/\/(www\.)?/, "").substring(0, 30) + "...",
      url,
      uploadedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      scrapedText: "",
      history: [],
      analyzing: true
    };

    setWebpages((prev) => [newWebpage, ...prev]);
    setSelectedWebpageId(newId);
    setActiveTab("result");
    setActiveMobileTab("preview");

    // Scraping content in background immediately
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error("爬虫清洗程序异常");
      const data = await response.json();

      setWebpages((prev) =>
        prev.map((wp) =>
          wp.id === newId
            ? {
                ...wp,
                name: data.title || wp.name,
                scrapedText: data.text,
                analyzing: false
              }
            : wp
        )
      );
    } catch (err: any) {
      console.error("爬取网页失败:", err);
      setWebpages((prev) =>
        prev.map((wp) =>
          wp.id === newId
            ? {
                ...wp,
                name: "爬取失败: " + url.substring(0, 25),
                analyzing: false,
                error: "网络错误或源站配置了反爬策略，无法直接拉取原始正文，但您可以继续输入自定义Prompt对该URL进行基于Agnes Search Grounding的研判分析。"
              }
            : wp
        )
      );
    }
  };

  // Delete image helper
  const deleteImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImageId === id) {
      const remaining = images.filter((img) => img.id !== id);
      if (remaining.length > 0) setSelectedImageId(remaining[0].id);
    }
  };

  // Delete webpage helper
  const deleteWebpage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWebpages((prev) => prev.filter((wp) => wp.id !== id));
    if (selectedWebpageId === id) {
      const remaining = webpages.filter((wp) => wp.id !== id);
      if (remaining.length > 0) setSelectedWebpageId(remaining[0].id);
    }
  };

  // Delete video helper
  const deleteVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (selectedVideoId === id) {
      const remaining = videos.filter((v) => v.id !== id);
      if (remaining.length > 0) setSelectedVideoId(remaining[0].id);
    }
  };

  // Clear all media resources completely
  const clearLibrary = () => {
    setImages([]);
    setWebpages([]);
    setVideos([]);
    setSelectedImageId("");
    setSelectedWebpageId("");
    setSelectedVideoId("");
  };

  // Reset/Restore default demo resources
  const resetLibrary = () => {
    setImages(DEMO_IMAGES);
    setWebpages(DEMO_WEBPAGES);
    setVideos(DEMO_VIDEOS);
    setSelectedImageId(DEMO_IMAGES[0].id);
    setSelectedWebpageId(DEMO_WEBPAGES[0].id);
    setSelectedVideoId(DEMO_VIDEOS[0].id);
  };

  // --- GENERAL UTILS ---
  const renderFormattedResult = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={index} className={`text-sm font-semibold mt-4 mb-2 flex items-center gap-1.5 font-display ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
            {trimmed.replace("### ", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={index} className={`text-base font-bold mt-5 mb-2.5 pb-1 border-b font-display ${theme === 'dark' ? 'text-slate-100 border-slate-800' : 'text-slate-900 border-slate-200'}`}>
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={index} className="text-lg font-bold text-indigo-400 mt-5 mb-3 font-display">
            {trimmed.replace("# ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemText = trimmed.substring(2);
        return (
          <li key={index} className={`ml-4 list-disc my-1 leading-relaxed text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            {renderBoldText(itemText)}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={index} className="h-2" />;
      }
      return (
        <p key={index} className={`my-1.5 leading-relaxed text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (str: string) => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return str;
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className={`font-semibold px-1 rounded ${theme === 'dark' ? 'text-indigo-300 bg-indigo-950/60' : 'text-indigo-700 bg-indigo-50'}`}>
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  // Select currently active resource
  const selectedResource = 
    mode === "image" ? selectedImage :
    mode === "webpage" ? selectedWebpage :
    mode === "video" ? selectedVideo : null;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start font-sans transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-[#0a0f1d] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200" 
        : "bg-slate-100 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900"
    }`}>
      
      {/* Mobile viewport simulator (visible on screens smaller than md) */}
      <div className={`w-full max-w-md min-h-screen border-x shadow-2xl flex flex-col relative pb-[130px] transition-colors duration-300 md:hidden ${
        theme === "dark"
          ? "bg-[#070b15] border-slate-800/80"
          : "bg-[#f8fafc] border-slate-200"
      }`}>
        
        {/* Sticky Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-md px-4 py-3 flex items-center justify-between transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#0d1527]/95 border-[#0d1527] border-b border-b-slate-800/80 text-slate-100"
            : "bg-white/95 border-white border-b border-b-slate-200 text-slate-800"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-slate-50' : 'text-slate-900'}`}>MediaInsight AI</h1>
              <p className={`text-[10px] font-medium font-sans ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>多媒体联合深度诊断</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                theme === "dark"
                  ? "text-yellow-400 hover:text-yellow-300 hover:bg-slate-800/50 border-slate-800/40"
                  : "text-indigo-600 hover:text-indigo-800 hover:bg-slate-100 border-slate-200"
              }`}
              title={theme === "dark" ? "切换至明亮模式" : "切换至暗黑模式"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button 
              type="button"
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/50 border-slate-800/40"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto">
          {activeMobileTab === "library" && (
            <MediaLibrary
              images={images}
              webpages={webpages}
              videos={videos}
              selectedResource={selectedResource}
              mode={mode}
              setMode={setMode}
              setSelectedImageId={setSelectedImageId}
              setSelectedWebpageId={setSelectedWebpageId}
              setSelectedVideoId={setSelectedVideoId}
              libraryAddTab={libraryAddTab}
              setLibraryAddTab={setLibraryAddTab}
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              webpageUrlInput={webpageUrlInput}
              setWebpageUrlInput={setWebpageUrlInput}
              handleAddWebpage={handleAddWebpage}
              deleteImage={deleteImage}
              deleteWebpage={deleteWebpage}
              deleteVideo={deleteVideo}
              clearLibrary={clearLibrary}
              resetLibrary={resetLibrary}
              setActiveMobileTab={setActiveMobileTab}
              theme={theme}
            />
          )}

          {activeMobileTab === "preview" && (
            <PreviewArea
              selectedResource={selectedResource}
              mode={mode}
              setActiveMobileTab={setActiveMobileTab}
              theme={theme}
            />
          )}

          {activeMobileTab === "diagnosis" && (
            <DiagnosisCenter
              selectedResource={selectedResource}
              mode={mode}
              selectedPromptId={selectedPromptId}
              setSelectedPromptId={setSelectedPromptId}
              selectedWebpagePromptId={selectedWebpagePromptId}
              setSelectedWebpagePromptId={setSelectedWebpagePromptId}
              selectedVideoPromptId={selectedVideoPromptId}
              setSelectedVideoPromptId={setSelectedVideoPromptId}
              analyzeImage={analyzeImage}
              analyzeWebpage={analyzeWebpage}
              analyzeVideo={analyzeVideo}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loadingStep={loadingStep}
              videoLoadingStep={videoLoadingStep}
              renderFormattedResult={renderFormattedResult}
              setActiveMobileTab={setActiveMobileTab}
              theme={theme}
            />
          )}
        </main>

        {/* Sticky bottom navigation & Chat Bar */}
        <BottomChatBar
          activeMobileTab={activeMobileTab}
          setActiveMobileTab={setActiveMobileTab}
          chatInput={chatInput}
          setChatInput={setChatInput}
          selectedResource={selectedResource}
          mode={mode}
          analyzeImage={analyzeImage}
          analyzeWebpage={analyzeWebpage}
          analyzeVideo={analyzeVideo}
          theme={theme}
        />
        
      </div>

      {/* Desktop View Dashboard (visible only on computer screens, size md and above) */}
      <div className={`hidden md:flex flex-col w-full max-w-7xl mx-auto min-h-screen px-6 py-5 gap-5 transition-colors duration-300 ${
        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
      }`}>
        {/* Desktop Header */}
        <header className={`flex items-center justify-between pb-4 border-b transition-colors ${
          theme === "dark" ? "border-slate-800" : "border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-slate-50' : 'text-slate-900'}`}>MediaInsight AI</h1>
              <p className={`text-xs font-sans ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>多媒体联合智能深度诊断中心</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick stats */}
            <div className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-colors ${
              theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              已载入资源: <span className="text-indigo-500 font-semibold">{images.length + webpages.length + videos.length}</span> 个
            </div>

            {/* Clear and Reset shortcut buttons */}
            <button
              type="button"
              id="desktop-reset-btn"
              onClick={() => {
                if (confirm("确定要重置并还原默认演示数据吗？")) {
                  resetLibrary();
                }
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'text-indigo-400 bg-[#0f172a] border-slate-800 hover:bg-slate-800/60'
                  : 'text-indigo-600 bg-white border-slate-200 hover:bg-slate-50'
              }`}
              title="重置为默认演示数据"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重置演示数据</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              id="desktop-theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                theme === "dark"
                  ? "text-yellow-400 hover:text-yellow-300 hover:bg-slate-800 border-slate-800/80"
                  : "text-indigo-600 hover:text-indigo-800 hover:bg-slate-100 border-slate-200"
              }`}
              title={theme === "dark" ? "切换至明亮模式" : "切换至暗黑模式"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Desktop Body columns */}
        <div className="grid grid-cols-12 gap-5 flex-1 items-start">
          {/* Column 1: Media Library (col-span-4) */}
          <div className={`col-span-4 border rounded-2xl h-[calc(100vh-130px)] overflow-y-auto transition-colors ${
            theme === 'dark' ? 'bg-[#070b15]/90 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-sm'
          }`}>
            <MediaLibrary
              images={images}
              webpages={webpages}
              videos={videos}
              selectedResource={selectedResource}
              mode={mode}
              setMode={setMode}
              setSelectedImageId={setSelectedImageId}
              setSelectedWebpageId={setSelectedWebpageId}
              setSelectedVideoId={setSelectedVideoId}
              libraryAddTab={libraryAddTab}
              setLibraryAddTab={setLibraryAddTab}
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              webpageUrlInput={webpageUrlInput}
              setWebpageUrlInput={setWebpageUrlInput}
              handleAddWebpage={handleAddWebpage}
              deleteImage={deleteImage}
              deleteWebpage={deleteWebpage}
              deleteVideo={deleteVideo}
              clearLibrary={clearLibrary}
              resetLibrary={resetLibrary}
              setActiveMobileTab={setActiveMobileTab}
              theme={theme}
            />
          </div>

          {/* Column 2: Preview Area (col-span-4) */}
          <div className={`col-span-4 border rounded-2xl h-[calc(100vh-130px)] overflow-y-auto transition-colors ${
            theme === 'dark' ? 'bg-[#070b15]/90 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-sm'
          }`}>
            <PreviewArea
              selectedResource={selectedResource}
              mode={mode}
              setActiveMobileTab={setActiveMobileTab}
              theme={theme}
            />
          </div>

          {/* Column 3: Diagnosis Center & Chat area (col-span-4) */}
          <div className="col-span-4 flex flex-col gap-4 h-[calc(100vh-130px)]">
            <div className={`border rounded-2xl flex-1 overflow-y-auto transition-colors ${
              theme === 'dark' ? 'bg-[#070b15]/90 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-sm'
            }`}>
              <DiagnosisCenter
                selectedResource={selectedResource}
                mode={mode}
                selectedPromptId={selectedPromptId}
                setSelectedPromptId={setSelectedPromptId}
                selectedWebpagePromptId={selectedWebpagePromptId}
                setSelectedWebpagePromptId={setSelectedWebpagePromptId}
                selectedVideoPromptId={selectedVideoPromptId}
                setSelectedVideoPromptId={setSelectedVideoPromptId}
                analyzeImage={analyzeImage}
                analyzeWebpage={analyzeWebpage}
                analyzeVideo={analyzeVideo}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                loadingStep={loadingStep}
                videoLoadingStep={videoLoadingStep}
                renderFormattedResult={renderFormattedResult}
                setActiveMobileTab={setActiveMobileTab}
                theme={theme}
              />
            </div>

            {/* Desktop Quick Chat Follow-up box */}
            <div className={`border rounded-2xl p-4 transition-colors ${
              theme === 'dark' ? 'bg-[#0d1527] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Brain className="w-3 h-3 text-indigo-400" />
                资源智能深度追问
              </span>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInput.trim() || !selectedResource) return;
                  const currentQuestion = chatInput.trim();
                  setChatInput("");
                  if (mode === "image") analyzeImage(currentQuestion);
                  else if (mode === "webpage") analyzeWebpage(currentQuestion);
                  else if (mode === "video") analyzeVideo(currentQuestion);
                }} 
                className="flex items-center gap-2"
              >
                <div className={`flex-1 flex items-center gap-2 border rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-all ${
                  theme === 'dark' ? 'border-slate-800 bg-[#070b15]' : 'border-slate-200 bg-slate-50'
                }`}>
                  <input
                    type="text"
                    value={chatInput}
                    disabled={!selectedResource}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={selectedResource ? `追问关于“${selectedResource.name}”的细节...` : "请在媒体库选择项目后提问..."}
                    className="w-full text-xs bg-transparent outline-none py-0.5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!chatInput.trim() || !selectedResource}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>提问</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
