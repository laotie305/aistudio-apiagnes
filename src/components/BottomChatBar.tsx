import React from "react";
import { 
  Folder, 
  Eye, 
  Brain, 
  Mic, 
  Sparkles 
} from "lucide-react";

interface BottomChatBarProps {
  activeMobileTab: "library" | "preview" | "diagnosis";
  setActiveMobileTab: (tab: "library" | "preview" | "diagnosis") => void;
  chatInput: string;
  setChatInput: (s: string) => void;
  selectedResource: any;
  mode: "image" | "webpage" | "video";
  analyzeImage: (override?: string) => Promise<void>;
  analyzeWebpage: (override?: string) => Promise<void>;
  analyzeVideo: (override?: string) => Promise<void>;
  theme?: "dark" | "light";
}

export default function BottomChatBar({
  activeMobileTab,
  setActiveMobileTab,
  chatInput,
  setChatInput,
  selectedResource,
  mode,
  analyzeImage,
  analyzeWebpage,
  analyzeVideo,
  theme = "dark"
}: BottomChatBarProps) {
  
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    if (!selectedResource) {
      alert("请先在媒体库选择一个需要诊断的资源，再进行特定提问！");
      return;
    }

    const currentQuestion = chatInput.trim();
    setChatInput(""); // Clear
    setActiveMobileTab("diagnosis"); // Navigate to diagnosis

    // Trigger specific analysis
    if (mode === "image") {
      analyzeImage(currentQuestion);
    } else if (mode === "webpage") {
      analyzeWebpage(currentQuestion);
    } else if (mode === "video") {
      analyzeVideo(currentQuestion);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md pb-safe transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0d1527]/95 border-slate-800/80 text-slate-100' 
        : 'bg-white/95 border-slate-200 text-slate-800 shadow-lg'
    }`}>
      <div className="max-w-md mx-auto px-4 py-2.5 space-y-2.5">
        
        {/* Dynamic Chat Input Bar */}
        <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
          {/* Microphone helper */}
          <button
            type="button"
            onClick={() => {
              // Pre-fill a voice search placeholder
              setChatInput("分析此内容的艺术风格和核心主体");
            }}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200/80 text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
            }`}
            title="语音输入模拟"
          >
            <Mic className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Chat input field */}
          <div className={`flex-1 flex items-center gap-2 border rounded-xl px-3 py-1.5 focus-within:border-indigo-500/50 transition-all ${
            theme === 'dark'
              ? 'border-slate-800 bg-[#070b15]/90'
              : 'border-slate-200 bg-slate-50'
          }`}>
            <input
              type="text"
              value={chatInput}
              disabled={!selectedResource}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={selectedResource ? `向 AI 追问关于“${selectedResource.name}”的细节...` : "请先选择一个媒体资源进行对话..."}
              className={`w-full text-xs bg-transparent outline-none py-1 transition-colors ${
                theme === 'dark'
                  ? 'text-slate-100 placeholder-slate-600'
                  : 'text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Submit Sparkles button */}
          <button
            type="submit"
            disabled={!chatInput.trim() || !selectedResource}
            className={`w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 cursor-pointer transition-all ${
              theme === 'dark'
                ? 'disabled:bg-slate-800 disabled:text-slate-600'
                : 'disabled:bg-slate-100 disabled:text-slate-300'
            }`}
            title="发送提问"
          >
            <Sparkles className="w-4.5 h-4.5" />
          </button>
        </form>

        {/* The 3 Bottom Navigation Buttons */}
        <div className={`grid grid-cols-3 gap-2 pt-1 border-t transition-colors ${
          theme === 'dark' ? 'border-slate-800/40' : 'border-slate-100'
        }`}>
          <button
            type="button"
            id="tab-btn-library"
            onClick={() => setActiveMobileTab("library")}
            className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all cursor-pointer border ${
              activeMobileTab === "library"
                ? theme === 'dark'
                  ? "bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20"
                  : "bg-indigo-50 text-indigo-600 font-semibold border-indigo-100"
                : theme === 'dark'
                  ? "text-slate-500 hover:text-slate-300 border-transparent"
                  : "text-slate-500 hover:text-slate-850 border-transparent"
            }`}
          >
            <Folder className="w-4 h-4 mb-1" />
            <span className="text-[10px] tracking-tight">📁 媒体库</span>
          </button>

          <button
            type="button"
            id="tab-btn-preview"
            onClick={() => setActiveMobileTab("preview")}
            className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all cursor-pointer border ${
              activeMobileTab === "preview"
                ? theme === 'dark'
                  ? "bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20"
                  : "bg-indigo-50 text-indigo-600 font-semibold border-indigo-100"
                : theme === 'dark'
                  ? "text-slate-500 hover:text-slate-300 border-transparent"
                  : "text-slate-500 hover:text-slate-850 border-transparent"
            }`}
          >
            <Eye className="w-4 h-4 mb-1" />
            <span className="text-[10px] tracking-tight">👁️ 预览区</span>
          </button>

          <button
            type="button"
            id="tab-btn-diagnosis"
            onClick={() => setActiveMobileTab("diagnosis")}
            className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl transition-all cursor-pointer border ${
              activeMobileTab === "diagnosis"
                ? theme === 'dark'
                  ? "bg-indigo-600/10 text-indigo-400 font-semibold border-indigo-500/20"
                  : "bg-indigo-50 text-indigo-600 font-semibold border-indigo-100"
                : theme === 'dark'
                  ? "text-slate-500 hover:text-slate-300 border-transparent"
                  : "text-slate-500 hover:text-slate-850 border-transparent"
            }`}
          >
            <Brain className="w-4 h-4 mb-1" />
            <span className="text-[10px] tracking-tight">🧠 分析诊断</span>
          </button>
        </div>

      </div>
    </div>
  );
}
