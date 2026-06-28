import React from "react";
import { 
  Brain, 
  Sparkles, 
  Play, 
  Loader2, 
  AlertCircle, 
  History,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PREDEFINED_PROMPTS, 
  PREDEFINED_WEBPAGE_PROMPTS, 
  PREDEFINED_VIDEO_PROMPTS 
} from "../data";

interface DiagnosisCenterProps {
  selectedResource: any;
  mode: "image" | "webpage" | "video";
  selectedPromptId: string;
  setSelectedPromptId: (id: string) => void;
  selectedWebpagePromptId: string;
  setSelectedWebpagePromptId: (id: string) => void;
  selectedVideoPromptId: string;
  setSelectedVideoPromptId: (id: string) => void;
  analyzeImage: () => Promise<void>;
  analyzeWebpage: () => Promise<void>;
  analyzeVideo: () => Promise<void>;
  activeTab: "result" | "history";
  setActiveTab: (t: "result" | "history") => void;
  loadingStep: string;
  videoLoadingStep: string;
  renderFormattedResult: (text: string) => React.ReactNode;
  setActiveMobileTab: (tab: "library" | "preview" | "diagnosis") => void;
  theme?: "dark" | "light";
}

export default function DiagnosisCenter({
  selectedResource,
  mode,
  selectedPromptId,
  setSelectedPromptId,
  selectedWebpagePromptId,
  setSelectedWebpagePromptId,
  selectedVideoPromptId,
  setSelectedVideoPromptId,
  analyzeImage,
  analyzeWebpage,
  analyzeVideo,
  activeTab,
  setActiveTab,
  loadingStep,
  videoLoadingStep,
  renderFormattedResult,
  setActiveMobileTab,
  theme = "dark"
}: DiagnosisCenterProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (selectedResource?.description) {
      navigator.clipboard.writeText(selectedResource.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-display ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          多模态智能诊断中心
        </h2>
      </div>

      {selectedResource ? (
        <div className="space-y-4 animate-fade-in">
          {/* Current Diagnostic target heading */}
          <div className={`border rounded-xl p-3 flex items-center justify-between transition-colors ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
              <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-300 truncate">
                正在诊断: {selectedResource.name}
              </span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
              theme === 'dark'
                ? 'bg-[#131d35] border-slate-800 text-slate-400'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              {mode === "image" ? "图片库" : mode === "webpage" ? "网页库" : "视频库"}
            </span>
          </div>

          {/* Step 1: Predefined Prompts */}
          <div className={`border rounded-2xl p-4 space-y-3 transition-colors ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              选择分析模式 (Task Prompt)
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {mode === "image" &&
                PREDEFINED_PROMPTS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = p.id === selectedPromptId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPromptId(p.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? theme === 'dark'
                            ? "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-medium"
                            : "border-indigo-500 bg-indigo-50/60 text-indigo-700 font-semibold"
                          : theme === 'dark'
                            ? "border-slate-800 bg-[#070b15]/50 hover:bg-[#131d35]/30 text-slate-400"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected 
                          ? "bg-indigo-600 text-white" 
                          : theme === 'dark'
                            ? "bg-[#0f172a] border border-slate-800 text-slate-500"
                            : "bg-slate-100 border border-slate-200 text-slate-500"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs">{p.label}</span>
                    </div>
                  );
                })}

              {mode === "webpage" &&
                PREDEFINED_WEBPAGE_PROMPTS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = p.id === selectedWebpagePromptId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedWebpagePromptId(p.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? theme === 'dark'
                            ? "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-medium"
                            : "border-indigo-500 bg-indigo-50/60 text-indigo-700 font-semibold"
                          : theme === 'dark'
                            ? "border-slate-800 bg-[#070b15]/50 hover:bg-[#131d35]/30 text-slate-400"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected 
                          ? "bg-indigo-600 text-white" 
                          : theme === 'dark'
                            ? "bg-[#0f172a] border border-slate-800 text-slate-500"
                            : "bg-slate-100 border border-slate-200 text-slate-500"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs">{p.label}</span>
                    </div>
                  );
                })}

              {mode === "video" &&
                PREDEFINED_VIDEO_PROMPTS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = p.id === selectedVideoPromptId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedVideoPromptId(p.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? theme === 'dark'
                            ? "border-indigo-500 bg-indigo-950/20 text-indigo-300 font-medium"
                            : "border-indigo-500 bg-indigo-50/60 text-indigo-700 font-semibold"
                          : theme === 'dark'
                            ? "border-slate-800 bg-[#070b15]/50 hover:bg-[#131d35]/30 text-slate-400"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected 
                          ? "bg-indigo-600 text-white" 
                          : theme === 'dark'
                            ? "bg-[#0f172a] border border-slate-800 text-slate-500"
                            : "bg-slate-100 border border-slate-200 text-slate-500"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs">{p.label}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Start analysis button (Full width) */}
          <div className="pt-1">
            <button
              type="button"
              id="start-diagnosis-btn"
              onClick={() => {
                if (mode === "image") analyzeImage();
                else if (mode === "webpage") analyzeWebpage();
                else if (mode === "video") analyzeVideo();
              }}
              disabled={selectedResource.analyzing}
              className={`w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'disabled:bg-slate-800 disabled:text-slate-500'
                  : 'disabled:bg-slate-200 disabled:text-slate-400'
              }`}
            >
              {selectedResource.analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>智能大模型诊断中...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>开始大模型多模态识别分析</span>
                </>
              )}
            </button>
          </div>

          {/* Results Container Card */}
          <div className={`border rounded-2xl overflow-hidden shadow-xl transition-colors ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800 shadow-black/20' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            {/* Results Header Tabs */}
            <div className={`border-b flex items-center justify-between px-3 transition-colors ${
              theme === 'dark' ? 'bg-[#131d35]/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setActiveTab("result")}
                  className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 cursor-pointer ${
                    activeTab === "result" 
                      ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold" 
                      : theme === 'dark'
                        ? "border-transparent text-slate-400 hover:text-slate-200"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  分析报告
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 cursor-pointer ${
                    activeTab === "history" 
                      ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold" 
                      : theme === 'dark'
                        ? "border-transparent text-slate-400 hover:text-slate-200"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  历史 ({selectedResource.history?.length || 0})
                </button>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                theme === 'dark'
                  ? 'text-indigo-400 bg-indigo-950/60 border-indigo-900/40'
                  : 'text-indigo-600 bg-indigo-50 border-indigo-100'
              }`}>
                Agnes-2.0-Flash
              </span>
            </div>

            {/* Content Area */}
            <div className="p-4 min-h-[180px]">
              <AnimatePresence mode="wait">
                {/* Analyzing Loading Spinner */}
                {selectedResource.analyzing && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="relative mb-3.5">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-950 border-t-indigo-500 animate-spin" />
                      <div className="absolute inset-1.5 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                      </div>
                    </div>
                    <p className={`text-xs font-semibold animate-pulse ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                      {mode === "image" ? loadingStep : mode === "video" ? videoLoadingStep : "🔄 正在抓取并清洗网页 HTML 数据..."}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">模型推理进行中，数秒内即刻完成</p>
                  </motion.div>
                )}

                {/* Error Message display */}
                {!selectedResource.analyzing && selectedResource.error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-3.5 rounded-xl border flex gap-2.5 ${
                      theme === 'dark'
                        ? 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <h3 className={`font-semibold text-xs ${theme === 'dark' ? 'text-rose-200' : 'text-rose-800'}`}>识别请求出错</h3>
                      <p className={`text-[10px] mt-1 whitespace-pre-wrap ${theme === 'dark' ? 'text-rose-400/90' : 'text-rose-600/90'}`}>{selectedResource.error}</p>
                      <button
                        type="button"
                        onClick={() => {
                          if (mode === "image") analyzeImage();
                          else if (mode === "webpage") analyzeWebpage();
                          else if (mode === "video") analyzeVideo();
                        }}
                        className={`mt-2.5 px-2.5 py-1 border text-[10px] rounded font-medium transition-all cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-rose-900/40 hover:bg-rose-900/60 border-rose-800/40 text-rose-200'
                            : 'bg-rose-100 hover:bg-rose-200 border-rose-200 text-rose-800'
                        }`}
                      >
                        重新尝试 (Retry)
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Main Result Display */}
                {!selectedResource.analyzing && !selectedResource.error && activeTab === "result" && (
                  <motion.div
                    key="result-content"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                  >
                    {selectedResource.description ? (
                      <div className="space-y-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer shadow-sm ${
                              copied
                                ? "text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40"
                                : theme === "dark"
                                  ? "text-slate-300 bg-slate-900 border-slate-800 hover:bg-slate-800"
                                  : "text-slate-600 bg-white border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>复制结果</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className={`space-y-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                          {renderFormattedResult(selectedResource.description)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 flex flex-col items-center justify-center">
                        <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
                        <p className="text-xs font-medium">尚未发起过诊断分析</p>
                        <p className="text-[10px] mt-1 text-slate-400 dark:text-slate-600">
                          请点击上方的“开始大模型识别分析”按钮，或者在下方对话框中输入指定提问。
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* History logs display */}
                {!selectedResource.analyzing && !selectedResource.error && activeTab === "history" && (
                  <motion.div
                    key="history-content"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3.5"
                  >
                    {selectedResource.history && selectedResource.history.length > 0 ? (
                      selectedResource.history.map((hist: any, idx: number) => (
                        <div key={idx} className={`p-3 rounded-xl border transition-all ${
                          theme === 'dark'
                            ? 'border-slate-800/80 bg-[#070b15]/50 hover:bg-[#131d35]/20'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/30'
                        }`}>
                          <div className={`flex items-center justify-between mb-2 pb-1 border-b ${
                            theme === 'dark' ? 'border-slate-800/40' : 'border-slate-200/60'
                          }`}>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-600/10 text-indigo-600 dark:text-indigo-300">
                              提问: {hist.prompt}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                              {hist.timestamp}
                            </span>
                          </div>
                          <div className={`text-xs leading-relaxed pl-2 border-l border-indigo-500/50 mt-1.5 whitespace-pre-wrap ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {renderFormattedResult(hist.result)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
                        <p className="text-xs">暂无历史分析记录</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <div className={`border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] transition-colors ${
          theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Brain className="w-10 h-10 text-slate-400 mb-3 animate-pulse" />
          <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>尚未选择诊断对象</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            请前往“媒体库”选择一个资源进行大模型深度多模态分析。
          </p>
          <button
            type="button"
            onClick={() => setActiveMobileTab("library")}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all cursor-pointer"
          >
            去媒体库选择
          </button>
        </div>
      )}
    </div>
  );
}
