export interface AnalysisHistoryItem {
  prompt: string;
  result: string;
  timestamp: string;
}

export interface AnalyzedImage {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: string;
  size?: string;
  description?: string;
  analyzing?: boolean;
  error?: string;
  history?: AnalysisHistoryItem[];
}

export interface AnalyzedWebpage {
  id: string;
  name: string;
  url: string;
  scrapedText?: string;
  uploadedAt: string;
  description?: string;
  analyzing?: boolean;
  error?: string;
  history?: AnalysisHistoryItem[];
}

export interface AnalyzedVideo {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: string;
  size?: string;
  description?: string;
  analyzing?: boolean;
  error?: string;
  history?: AnalysisHistoryItem[];
  isVideoUrl?: boolean;
}
