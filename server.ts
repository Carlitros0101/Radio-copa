import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory audio cache for faster repeat playback
const ttsCache = new Map<string, string>();

// Healthcheck & config status
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash-tts',
  });
});

// Text-to-Speech Endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY not configured on server',
        fallbackAvailable: true,
      });
    }

    const { turns, text, speaker = 'Marcelo' } = req.body;

    // Build cache key
    const cacheKey = JSON.stringify({ turns, text, speaker });
    if (ttsCache.has(cacheKey)) {
      return res.json({
        audioBase64: ttsCache.get(cacheKey),
        mimeType: 'audio/wav',
        cached: true,
      });
    }

    let audioBase64: string | undefined;

    // Multi-speaker scenario (Marcelo and Patricio dialogue)
    if (Array.isArray(turns) && turns.length > 0) {
      // Check if both speakers are present or only one
      const uniqueSpeakers = Array.from(new Set(turns.map((t: any) => t.speaker || 'Marcelo')));

      if (uniqueSpeakers.length >= 2) {
        // Multi-speaker config must have exactly 2 speaker configs in gemini-3.8-flash-tts
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: turns.map((t: any) => ({
                text: `${t.speaker}: ${t.text}`,
                speechMetadata: {
                  speaker: t.speaker,
                  style:
                    t.speaker === 'Marcelo'
                      ? 'Relator de fútbol chileno, enérgico, entusiasta y carismático'
                      : 'Comentarista deportivo chileno, voz madura, pausada, analítica y crítica',
                },
              })),
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Marcelo',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                  },
                  {
                    speaker: 'Patricio',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Fenrir' },
                    },
                  },
                ],
              },
            },
          },
        });

        audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } else {
        // Single speaker from turns
        const currentSpeaker = uniqueSpeakers[0] || speaker;
        const combinedText = turns.map((t: any) => t.text).join(' ');
        const voice = currentSpeaker === 'Marcelo' ? 'Puck' : 'Fenrir';

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: combinedText,
                  speechMetadata: {
                    speaker: currentSpeaker,
                    style:
                      currentSpeaker === 'Marcelo'
                        ? 'Relator deportivo chileno enérgico y carismático'
                        : 'Analista deportivo chileno maduro y analítico',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
            },
          },
        });

        audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      }
    } else if (text) {
      // Single speaker direct text
      const voice = speaker === 'Marcelo' ? 'Puck' : 'Fenrir';
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: String(text),
                speechMetadata: {
                  speaker: speaker,
                  style:
                    speaker === 'Marcelo'
                      ? 'Relator chileno de fútbol, entusiasta y enérgico'
                      : 'Comentarista deportivo chileno maduro y pausado',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } else {
      return res.status(400).json({ error: 'Missing text or turns in request body' });
    }

    if (!audioBase64) {
      throw new Error('No audio returned by Gemini TTS model');
    }

    // Cache result
    ttsCache.set(cacheKey, audioBase64);

    return res.json({
      audioBase64,
      mimeType: 'audio/wav',
      cached: false,
    });
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    return res.status(500).json({
      error: err?.message || 'Error generating speech with Gemini TTS',
    });
  }
});

// Endpoint to generate new conversational commentary for upcoming or custom matches
app.post('/api/generate-commentary', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const { matchTopic, customNotes } = req.body;

    const prompt = `Actúa como guionista del programa deportivo chileno "Liga Por Favor y Gracias".
Crea una conversación corta y de alto ritmo (entre 6 y 10 intervenciones alternadas en total) entre:
- Marcelo: Conductor y relator. Enérgico, carismático, chileno futbolero con dichos naturales ("¡papá!", "¡dejando la escoba!").
- Patricio: Comentarista y analista. Voz madura, algo crítico, centrado en las estadísticas y táctica, aterriza los excesos de Marcelo.

Tema o partido a debatir: ${matchTopic || 'Previa del clásico Barcelona vs Chelsea o Inter vs Liverpool'}.
Notas adicionales: ${customNotes || 'Respetar los resultados previos de la Copa de Campeones y la Temporada 2'}.

Reglas:
1. No inventes jugadores individuales reales ausentes, enfócate en los equipos (PSG de ABV, Chelsea de EHT, Inter de CPA, Liverpool de FAM, Arsenal de MNV, Barcelona de MUF).
2. Los marcadores numéricos se leen como resultados futbolísticos naturales (ej: 4-3 "cuatro a tres").
3. Devuelve ÚNICAMENTE un JSON válido con la siguiente estructura:
{
  "title": "Título corto y llamativo",
  "turns": [
    { "speaker": "Marcelo", "text": "..." },
    { "speaker": "Patricio", "text": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);

    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/generate-commentary:', err);
    return res.status(500).json({
      error: err?.message || 'Error generating script with Gemini',
    });
  }
});

// Vite middleware in dev or static files in production
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎙️ Especial Deportivo Server listening on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
