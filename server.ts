import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up large limits for base64 image & video payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy GoogleGenAI client initialization
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY 环境变量未配置。请在 Settings > Secrets 面板中添加此密钥。");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Scrape helper for Webpage analysis
async function fetchAndCleanWebpage(url: string): Promise<{ text: string; title: string }> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  if (!response.ok) {
    throw new Error(`无法获取网页内容: ${response.statusText}`);
  }
  const html = await response.text();

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "未命名网页";

  // Clean HTML
  let cleaned = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
    .replace(/<head[^>]*>([\s\S]*?)<\/head>/gi, "")
    .replace(/<nav[^>]*>([\s\S]*?)<\/nav>/gi, "")
    .replace(/<footer[^>]*>([\s\S]*?)<\/footer>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Strip tags
  cleaned = cleaned.replace(/<[^>]+>/g, " ");

  // Normalize spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Limit characters
  if (cleaned.length > 25000) {
    cleaned = cleaned.substring(0, 25000) + "... [内容因长度过长而被阶段截断]";
  }

  return { text: cleaned, title };
}

// Retrieve Agnes configuration (default to user-provided credentials if not set in environment)
const API_KEY = process.env.AGNES_API_KEY || "sk-ks4duOMwKB5dttQYf4bvT8bLXwAmtHeYmERoYkVBd9bwtZT3";
const BASE_URL = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const MODEL = process.env.AGNES_MODEL || "Agnes-2.0-Flash";


// Proxy endpoint for image analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { image, prompt } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image data" });
    }

    let finalImageUrl = image;

    // If the image is a remote URL, fetch and convert it server-side to avoid client-side CORS issues
    if (image.startsWith("http://") || image.startsWith("https://")) {
      try {
        console.log(`Fetching remote image URL: ${image}`);
        const imageResponse = await fetch(image);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        const arrayBuffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        finalImageUrl = `data:${contentType};base64,${base64Data}`;
        console.log("Successfully downloaded and converted remote image to base64");
      } catch (fetchErr: any) {
        console.error("Error fetching remote image:", fetchErr);
        return res.status(400).json({
          error: "Failed to download external image URL",
          details: fetchErr.message
        });
      }
    }

    const defaultPrompt = "Please analyze this image and describe what you see in detail. Use Markdown for layout if helpful.";
    const userPrompt = prompt || defaultPrompt;

    console.log(`Analyzing image using model: ${MODEL} on ${BASE_URL}`);

    // Call the OpenAI-compatible Agnes Vision completion API
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: finalImageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Agnes API error response (${response.status}):`, errorText);
      return res.status(response.status).json({
        error: `Agnes API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log("Agnes API call successful!");
    
    // Extract description from standard OpenAI completion structure
    const description = data?.choices?.[0]?.message?.content;
    
    if (!description) {
      return res.status(500).json({ 
        error: "Invalid response format from Agnes API",
        details: JSON.stringify(data)
      });
    }

    res.json({ description, result: description });

  } catch (error: any) {
    console.error("Internal Server Error in /api/analyze:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message || error 
    });
  }
});

// Proxy endpoint for webpage link analysis
app.post("/api/analyze-webpage", async (req, res) => {
  try {
    const { url, prompt } = req.body;

    if (!url) {
      return res.status(400).json({ error: "请输入需要识别的网页链接 URL" });
    }

    console.log(`Analyzing webpage URL using Agnes API: ${url}`);
    
    let content: { text: string; title: string };
    try {
      content = await fetchAndCleanWebpage(url);
    } catch (fetchErr: any) {
      console.error("Error fetching webpage:", fetchErr);
      return res.status(400).json({
        error: "无法获取该网页内容，请检查链接是否正确或该网站是否限制了服务器访问。",
        details: fetchErr.message
      });
    }

    const defaultPrompt = "请详细分析并总结该网页的内容。用中文回答。";
    const userPrompt = prompt || defaultPrompt;

    const fullPrompt = `【网页标题】: ${content.title}\n【网页链接】: ${url}\n\n【网页文本内容摘要】:\n${content.text}\n\n【分析任务要求】:\n${userPrompt}`;

    console.log(`Calling Agnes API for webpage analysis using model: ${MODEL}`);
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: fullPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Agnes API webpage error response (${response.status}):`, errorText);
      return res.status(response.status).json({
        error: `Agnes API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    const description = data?.choices?.[0]?.message?.content;
    if (!description) {
      return res.status(500).json({
        error: "Agnes API 返回空数据",
        details: JSON.stringify(data)
      });
    }

    res.json({ 
      description, 
      result: description,
      title: content.title, 
      scrapedText: content.text.substring(0, 1000)
    });

  } catch (error: any) {
    console.error("Internal Server Error in /api/analyze-webpage:", error);
    res.status(500).json({ 
      error: error.message || "服务器内部错误", 
      details: error.message || error 
    });
  }
});

// Proxy endpoint for video analysis
app.post("/api/analyze-video", async (req, res) => {
  try {
    const { video, isUrl, prompt } = req.body;

    if (!video) {
      return res.status(400).json({ error: "未接收到视频数据或链接" });
    }

    let finalVideoData = video;
    let mimeType = "video/mp4";

    if (isUrl || video.startsWith("http://") || video.startsWith("https://")) {
      try {
        console.log(`Downloading remote video URL: ${video}`);
        const videoResponse = await fetch(video);
        if (!videoResponse.ok) {
          throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
        }
        const arrayBuffer = await videoResponse.arrayBuffer();
        mimeType = videoResponse.headers.get("content-type") || "video/mp4";
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        finalVideoData = base64Data;
        console.log(`Successfully downloaded and converted remote video of type ${mimeType} to base64`);
      } catch (fetchErr: any) {
        console.error("Error fetching remote video:", fetchErr);
        return res.status(400).json({
          error: "无法下载外部视频 file，请确保该链接是直接指向视频文件（如以 .mp4 或 .webm 结尾的直接下载地址）。",
          details: fetchErr.message
        });
      }
    } else {
      // It's a base64 string
      const match = video.match(/^data:(video\/[a-zA-Z0-9.-]+);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        finalVideoData = match[2];
      }
    }

    const defaultPrompt = "请描述这段视频的内容，包括其主要场景和行为。用中文回答。";
    const userPrompt = prompt || defaultPrompt;

    console.log(`Calling Agnes API for video analysis using model: ${MODEL}...`);

    // Let's format the video analysis request using Agnes API's multimodal message structure
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${finalVideoData}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Agnes API video error response (${response.status}):`, errorText);
      return res.status(response.status).json({
        error: `Agnes API Error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    const description = data?.choices?.[0]?.message?.content;
    if (!description) {
      return res.status(500).json({
        error: "Agnes API 返回了空响应",
        details: JSON.stringify(data)
      });
    }

    res.json({ description, result: description });

  } catch (error: any) {
    console.error("Internal Server Error in /api/analyze-video:", error);
    res.status(500).json({ 
      error: error.message || "服务器内部错误", 
      details: error.message || error 
    });
  }
});

// Configure Vite middleware or production static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up static file serving in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start Vite middleware server:", err);
});
