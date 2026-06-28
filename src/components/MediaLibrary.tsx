import React from "react";
import { 
  Upload, 
  Trash2, 
  Plus, 
  Globe, 
  Video, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  Folder
} from "lucide-react";
import { AnalyzedImage, AnalyzedWebpage, AnalyzedVideo } from "../types";

interface MediaLibraryProps {
  images: AnalyzedImage[];
  webpages: AnalyzedWebpage[];
  videos: AnalyzedVideo[];
  selectedResource: any;
  mode: "image" | "webpage" | "video";
  setMode: (m: "image" | "webpage" | "video") => void;
  setSelectedImageId: (id: string) => void;
  setSelectedWebpageId: (id: string) => void;
  setSelectedVideoId: (id: string) => void;
  libraryAddTab: "file" | "link";
  setLibraryAddTab: (t: "file" | "link") => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (file: File) => void;
  handleVideoUpload: (file: File) => void;
  webpageUrlInput: string;
  setWebpageUrlInput: (url: string) => void;
  handleAddWebpage: (e: React.FormEvent) => void;
  deleteImage: (id: string, e: React.MouseEvent) => void;
  deleteWebpage: (id: string, e: React.MouseEvent) => void;
  deleteVideo: (id: string, e: React.MouseEvent) => void;
  clearLibrary?: () => void;
  resetLibrary?: () => void;
  setActiveMobileTab: (tab: "library" | "preview" | "diagnosis") => void;
  theme?: "dark" | "light";
}

export default function MediaLibrary({
  images,
  webpages,
  videos,
  selectedResource,
  mode,
  setMode,
  setSelectedImageId,
  setSelectedWebpageId,
  setSelectedVideoId,
  libraryAddTab,
  setLibraryAddTab,
  fileInputRef,
  handleImageUpload,
  handleVideoUpload,
  webpageUrlInput,
  setWebpageUrlInput,
  handleAddWebpage,
  deleteImage,
  deleteWebpage,
  deleteVideo,
  clearLibrary,
  resetLibrary,
  setActiveMobileTab,
  theme = "dark"
}: MediaLibraryProps) {
  const [showConfirmClear, setShowConfirmClear] = React.useState(false);

  const allResources = [
    ...images.map(img => ({ ...img, type: "image" as const })),
    ...webpages.map(wp => ({ ...wp, type: "webpage" as const })),
    ...videos.map(vid => ({ ...vid, type: "video" as const }))
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-display ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          添加多媒体资源
        </h2>
      </div>

      {/* Library Add Tab Switcher */}
      <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl border transition-colors ${
        theme === "dark"
          ? "bg-[#0f172a] border-slate-800/60"
          : "bg-slate-200/50 border-slate-300/60"
      }`}>
        <button
          type="button"
          onClick={() => setLibraryAddTab("file")}
          className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            libraryAddTab === "file"
              ? "bg-indigo-600 text-white font-semibold"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-950"
          }`}
        >
          文件上传
        </button>
        <button
          type="button"
          onClick={() => setLibraryAddTab("link")}
          className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            libraryAddTab === "link"
              ? "bg-indigo-600 text-white font-semibold"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-950"
          }`}
        >
          网页链接
        </button>
      </div>

      {/* Library Add Content */}
      {libraryAddTab === "file" ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group ${
            theme === "dark"
              ? "border-slate-700 hover:border-indigo-500/80 bg-[#0f172a]/60 hover:bg-[#131d35]/40"
              : "border-slate-300 hover:border-indigo-500/80 bg-white hover:bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.type.startsWith("image/")) {
                  handleImageUpload(file);
                } else if (file.type.startsWith("video/")) {
                  handleVideoUpload(file);
                } else {
                  alert("不支持的文件格式！请上传图片或视频。");
                }
              }
            }}
            className="hidden"
            accept="image/*,video/*"
          />
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center mb-3 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-all duration-200 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-800 text-slate-400"
              : "bg-slate-100 border-slate-200 text-slate-500"
          }`}>
            <Upload className="w-5 h-5" />
          </div>
          <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
            点击此处选择手机图片或视频
          </p>
          <p className="text-[10px] text-slate-500 mt-1">支持图片格式及常见的 .mp4 视频</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddWebpage(e);
          }}
          className={`space-y-2.5 rounded-2xl p-4 border transition-colors ${
            theme === "dark"
              ? "bg-[#0f172a]/40 border-slate-800/80"
              : "bg-white border-slate-200/80 shadow-sm"
          }`}
        >
          <div className={`flex items-center gap-2 border rounded-xl px-3 focus-within:border-indigo-500/50 transition-all ${
            theme === "dark"
              ? "border-slate-800 bg-[#070b15]/80"
              : "border-slate-200 bg-slate-50/80"
          }`}>
            <LinkIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="url"
              value={webpageUrlInput}
              onChange={(e) => setWebpageUrlInput(e.target.value)}
              placeholder="https://example.com/article"
              className={`w-full text-xs py-3 bg-transparent outline-none transition-colors ${
                theme === "dark"
                  ? "text-slate-100 placeholder-slate-600"
                  : "text-slate-800 placeholder-slate-400"
              }`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>添加网页识别项目</span>
          </button>
        </form>
      )}

      {/* Media Resource Database */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-display ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            媒体资源库 ({allResources.length})
          </h2>
          <div className="flex items-center gap-1.5">
            {showConfirmClear ? (
              <div className="flex items-center gap-1.5 animate-fade-in bg-rose-500/10 dark:bg-rose-950/20 px-2 py-1 rounded-lg border border-rose-500/20">
                <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>
                  确认清空?
                </span>
                <button
                  type="button"
                  id="confirm-clear-yes"
                  onClick={() => {
                    if (clearLibrary) clearLibrary();
                    setShowConfirmClear(false);
                  }}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  确定
                </button>
                <button
                  type="button"
                  id="confirm-clear-no"
                  onClick={() => setShowConfirmClear(false)}
                  className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'text-slate-400 bg-slate-800 border-slate-700 hover:bg-slate-700'
                      : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                {allResources.length > 0 && clearLibrary && (
                  <button
                    type="button"
                    id="clear-library-btn"
                    onClick={() => {
                      setShowConfirmClear(true);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'text-rose-400 bg-rose-950/20 border-rose-900/30 hover:bg-rose-900/30'
                        : 'text-rose-600 bg-rose-50 border-rose-200/50 hover:bg-rose-100/50'
                    }`}
                    title="清空库中所有数据"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>清空</span>
                  </button>
                )}
                {resetLibrary && (
                  <button
                    type="button"
                    id="reset-library-btn"
                    onClick={() => {
                      resetLibrary();
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'text-indigo-400 bg-[#0f172a] border-slate-800/80 hover:bg-slate-800/60'
                        : 'text-indigo-600 bg-slate-100 border-slate-200 hover:bg-slate-200/50'
                    }`}
                    title="重置为默认演示数据"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>重置</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {allResources.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border flex flex-col items-center justify-center min-h-[180px] transition-colors ${
            theme === "dark" 
              ? "border-slate-800 bg-[#0f172a]/30 text-slate-400" 
              : "border-slate-200 bg-white text-slate-500 shadow-sm"
          }`}>
            <Folder className="w-8 h-8 text-slate-400/80 mb-2 animate-pulse" />
            <p className="text-xs font-semibold">媒体资源库已清空</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              您可以通过上方的“文件上传”或“网页链接”添加新项目，或者点击右上角“重置”按钮还原默认演示数据。
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {allResources.map((item) => {
            const isSelected = selectedResource?.id === item.id && mode === item.type;
            const isDemo = item.id.startsWith("demo-");
            const isDiagnosed = !!item.description || (item.history && item.history.length > 0);
            
            return (
              <div
                key={item.id}
                id={`media-item-${item.id}`}
                onClick={() => {
                  if (item.type === "image") {
                    setMode("image");
                    setSelectedImageId(item.id);
                  } else if (item.type === "webpage") {
                    setMode("webpage");
                    setSelectedWebpageId(item.id);
                  } else if (item.type === "video") {
                    setMode("video");
                    setSelectedVideoId(item.id);
                  }
                  setActiveMobileTab("preview");
                }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-200 group relative ${
                  theme === 'dark'
                    ? isSelected
                      ? "border-indigo-500 bg-indigo-950/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
                      : "border-slate-800 bg-[#0f172a] hover:bg-[#131d35]/60 hover:border-slate-700"
                    : isSelected
                      ? "border-indigo-500 bg-indigo-50/50 shadow-[0_0_12px_rgba(99,102,241,0.08)]"
                      : "border-slate-200 bg-white hover:bg-slate-100/30 hover:border-slate-300"
                }`}
              >
                {/* Thumbnail or Icon */}
                {item.type === "image" ? (
                  <div className={`w-12 h-12 rounded-lg overflow-hidden border flex-shrink-0 relative ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'
                  }`}>
                    <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                    {item.analyzing && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : item.type === "webpage" ? (
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                    theme === 'dark' ? 'border-slate-800 bg-[#16a34a]/10 text-[#22c55e]' : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                  }`}>
                    <Globe className="w-5 h-5" />
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                    theme === 'dark' ? 'border-slate-800 bg-[#2563eb]/10 text-[#3b82f6]' : 'border-blue-100 bg-blue-50 text-blue-600'
                  }`}>
                    <Video className="w-5 h-5" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{item.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                    {item.type === "image" ? (
                      <span className="text-slate-500">图片</span>
                    ) : item.type === "webpage" ? (
                      <span className="text-slate-500">网页</span>
                    ) : (
                      <span className="text-slate-500">视频</span>
                    )}
                    <span className="text-slate-700">•</span>
                    
                    {/* Diagnosed Status Badge */}
                    {isDiagnosed ? (
                      <span className="text-emerald-500 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        已诊断
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        未诊断
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                {!isDemo && (
                  <button
                    id={`delete-btn-${item.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === "image") {
                        deleteImage(item.id, e);
                      } else if (item.type === "webpage") {
                        deleteWebpage(item.id, e);
                      } else if (item.type === "video") {
                        deleteVideo(item.id, e);
                      }
                    }}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all opacity-80 hover:opacity-100 cursor-pointer ${
                      theme === 'dark'
                        ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-950/20'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
