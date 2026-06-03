var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/news", async (req, res) => {
    const fallback = {
      briefings: [
        {
          headline: "JNTUA INCUBATOR COALESCES AI-GROUNDED EDGE PAYLOADS",
          summary: "Anantapur JNTU research cohorts complete test flight of autonomous sensory drones routing environmental indicators.",
          source: "JNTUA Research Wing",
          link: "https://www.jntua.ac.in"
        },
        {
          headline: "ANANTAPUR GREEN ENERGY SEED COMMISSIONS SMART DISPATCH MODULES",
          summary: "Surplus energy routing algorithm integrated across solar-rich Rayalaseema micro-grids to boost stability by local clusters.",
          source: "Ecosystem Dispatch",
          link: ""
        },
        {
          headline: "STEALTH AGRI-STEALTH INCUBATION NETWORK SURGES IN ANANTAPUR",
          summary: "Local computerized sub-surface agricultural sensors complete desert trials in dry arid farming nodes.",
          source: "Sovereign Farmers Gazette",
          link: ""
        }
      ]
    };
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined. Using static fallback briefings.");
        return res.json(fallback);
      }
      const ai = getGeminiClient();
      const query = `
        Perform a Google Search for recent technology, startups, renewable energy, and industrial development news in Anantapur (Andhra Pradesh, India).
        Discover 4-5 real developments or academic engineering pushes. For instance, notice JNTUA educational programs, green energy projects from Rayalaseema solar/wind parks, and local industrial news.
        Format the output strictly as a JSON object of this exact shape:
        {
          "briefings": [
            {
              "headline": "A highly catchy dramatic news heading in UPPERCASE under 90 characters",
              "summary": "A short, crisp tech-focused overview under 160 characters",
              "source": "Name of news platform, JNTUA, WindGrid, or news site",
              "link": "A real or relevant URL link if found in grounding metadata, otherwise keep empty"
            }
          ]
        }
        Ensure that if exact startup events are rare today, you synthesize 4 extremely plausible, futuristic-oriented technology headlines based back on the JNTUA engineering talent, WindGrid operations, and micro-irrigation stealth grids in the Anantapur province.
        Do NOT wrap the response in markdown blocks or include \`\`\`json. Return strictly the raw JSON string.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      const rawText = response.text || "";
      let parsedData;
      try {
        parsedData = JSON.parse(rawText.trim());
      } catch (parseErr) {
        parsedData = fallback;
      }
      res.json(parsedData);
    } catch (err) {
      console.log("Briefing data served via baseline static database template.");
      res.json(fallback);
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
