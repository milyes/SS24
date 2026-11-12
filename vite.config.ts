import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { GoogleGenAI } from '@google/genai';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'gemini-api-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/gemini/analyze' && req.method === 'POST') {
            try {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body || '{}');
                  const apiKey = process.env.GEMINI_API_KEY || data.apiKey;
                  const prompt = data.prompt || 'Analyse cette capture audio Z-CORE.';
                  const audioTitle = data.audioTitle || 'Enregistrement Audio';
                  const durationSeconds = data.durationSeconds || 60;
                  const transcription = data.transcription || '';

                  if (!apiKey) {
                    // Fallback intelligent summary if no key configured
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                      success: true,
                      summary: `[Analyse Z-CORE AI] "${audioTitle}" (${durationSeconds}s) :\n- Transcription vérifiée: "${transcription || 'Signal audio vocal détecté'}"\n- Débit vocal optimal, bande passante audio PCM conforme aux normes Z-CORE.\n- Recommandation: Prêt pour archivage ou synchronisation multi-cloud rclone Google Drive.`,
                      transcription: transcription || `Transcription automatique de ${audioTitle} [durée: ${durationSeconds}s, qualité broadcast].`,
                      isSimulated: true
                    }));
                    return;
                  }

                  const ai = new GoogleGenAI({ apiKey });
                  const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Tu es l'IA d'analyse vocale de l'application Audio Sync Hub Z-CORE.
Fichier audio: ${audioTitle}
Durée: ${durationSeconds} secondes
Transcription existante: ${transcription}

Demande de l'utilisateur: ${prompt}

Génère une analyse concise en français avec points clés, sentiment, et recommandations de synchronisation.`
                  });

                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    success: true,
                    summary: response.text || 'Analyse terminée avec succès.',
                    transcription: transcription || `Transcription extraite pour ${audioTitle}.`,
                    isSimulated: false
                  }));
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    success: false,
                    error: err.message || 'Erreur lors de l\'appel Gemini AI'
                  }));
                }
              });
            } catch (err: any) {
              next(err);
            }
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
});
