import React from "react";
import { 
  Eye, 
  HelpCircle, 
  Globe, 
  Video, 
  Image as ImageIcon, 
  Brain 
} from "lucide-react";

interface PreviewAreaProps {
  selectedResource: any;
  mode: "image" | "webpage" | "video";
  setActiveMobileTab: (tab: "library" | "preview" | "diagnosis") => void;
  theme?: "dark" | "light";
}

export default function PreviewArea({
  selectedResource,
  mode,
  setActiveMobileTab,
  theme = "dark"
}: PreviewAreaProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-display ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          资源大图与信息预览
        </h2>
      </div>

      {selectedResource ? (
        <div className="space-y-4 animate-fade-in">
          {/* Name and Type card */}
          <div className={`border rounded-xl p-3 flex items-center justify-between transition-colors ${
            theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              {mode === "image" ? (
                <ImageIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              ) : mode === "webpage" ? (
                <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Video className="w-4 h-4 text-blue-400 flex-shrink-0" />
              )}
              <span className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                {selectedResource.name}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500">
              {mode === "image" ? "图片资源" : mode === "webpage" ? "网页资源" : "视频资源"}
            </span>
          </div>

          {/* Preview media box */}
          {mode === "image" && (
            <div className={`relative rounded-2xl overflow-hidden border aspect-[16/10] flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'border-slate-800 bg-[#070b15]' : 'border-slate-200 bg-slate-100/40'
            }`}>
              <img
                src={selectedResource.dataUrl}
                alt={selectedResource.name}
                className="max-w-full max-h-full object-contain"
              />
              <div className={`absolute bottom-3 left-3 backdrop-blur-md border text-[10px] px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 transition-colors ${
                theme === 'dark'
                  ? 'bg-[#0f172a]/80 border-slate-800/60 text-slate-300'
                  : 'bg-white/90 border-slate-200/80 text-slate-600 shadow-sm'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                就绪 (Agnes-2.0-Flash)
              </div>
            </div>
          )}

          {mode === "webpage" && (
            <div className={`border rounded-2xl p-4 space-y-3.5 transition-colors ${
              theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 block">原始链接 URL:</span>
                <a
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline break-all text-xs font-mono block leading-relaxed"
                >
                  {selectedResource.url}
                </a>
              </div>

              {selectedResource.scrapedText && (
                <div className={`pt-3 border-t ${theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'}`}>
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1.5">网页正文摘要片段 (Snippet):</span>
                  <p className={`text-xs leading-relaxed p-3 rounded-xl italic line-clamp-[10] border transition-colors ${
                    theme === 'dark'
                      ? 'text-slate-300 bg-[#070b15]/50 border-slate-800/50'
                      : 'text-slate-600 bg-slate-50 border-slate-200/60'
                  }`}>
                    {selectedResource.scrapedText}
                  </p>
                </div>
              )}
            </div>
          )}

          {mode === "video" && (
            <div className="space-y-3">
              <div className={`relative rounded-2xl overflow-hidden border aspect-video flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'border-slate-800 bg-[#070b15]' : 'border-slate-200 bg-slate-100/40'
              }`}>
                <video
                  src={selectedResource.dataUrl}
                  controls
                  className="w-full h-full object-contain"
                />
                <div className={`absolute bottom-3 left-3 backdrop-blur-md border text-[10px] px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 pointer-events-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#0f172a]/80 border-slate-800/60 text-slate-300'
                    : 'bg-white/90 border-slate-200/80 text-slate-600 shadow-sm'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  就绪 (Agnes Multi-Modal)
                </div>
              </div>
            </div>
          )}

          {/* Diagnostics quick-link button */}
          <button
            type="button"
            id="diagnose-quick-link"
            onClick={() => setActiveMobileTab("diagnosis")}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Brain className="w-4 h-4" />
            <span>进入该资源的诊断分析</span>
          </button>
        </div>
      ) : (
        <div className={`border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] transition-colors ${
          theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <HelpCircle className="w-10 h-10 text-slate-400 mb-3 animate-pulse" />
          <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>尚未选择任何媒体资源</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            请前往“媒体库”页面，选择一个内置的示例资源，或上传您自己的图片、视频、网页链接。
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
