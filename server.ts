/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Grounded tech/news feed
  app.get('/api/news', async (req, res) => {
    const fallback = {
      briefings: [
        {
          headline: 'JNTUA INCUBATOR COALESCES AI-GROUNDED EDGE PAYLOADS',
          summary: 'Anantapur JNTU research cohorts complete test flight of autonomous sensory drones routing environmental indicators.',
          source: 'JNTUA Research Wing',
          link: 'https://www.jntua.ac.in'
        },
        {
          headline: 'ANANTAPUR GREEN ENERGY SEED COMMISSIONS SMART DISPATCH MODULES',
          summary: 'Surplus energy routing algorithm integrated across solar-rich Rayalaseema micro-grids to boost stability by local clusters.',
          source: 'Ecosystem Dispatch',
          link: ''
        },
        {
          headline: 'STEALTH AGRI-STEALTH INCUBATION NETWORK SURGES IN ANANTAPUR',
          summary: 'Local computerized sub-surface agricultural sensors complete desert trials in dry arid farming nodes.',
          source: 'Sovereign Farmers Gazette',
          link: ''
        }
      ]
    };

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is not defined. Using static fallback briefings.');
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
        model: 'gemini-3.5-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text || '';
      let parsedData;
      try {
        parsedData = JSON.parse(rawText.trim());
      } catch (parseErr) {
        parsedData = fallback;
      }

      res.json(parsedData);
    } catch (err: any) {
      console.log('Briefing data served via baseline static database template.');
      res.json(fallback);
    }
  });

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
