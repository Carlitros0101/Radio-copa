import { useState } from 'react';
import { Sparkles, Play, Send, RefreshCw, MessageSquare, Volume2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface GeneratedTurn {
  speaker: 'Marcelo' | 'Patricio';
  text: string;
}

export function DebateSimulator() {
  const [matchTopic, setMatchTopic] = useState('Previa Barcelona vs Chelsea: ¿Podrá el Barca resistir tras el 0-8?');
  const [customNotes, setCustomNotes] = useState('Chelsea viene de ser subcampeón y Barcelona tiene 15 goles recibidos');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<{
    title: string;
    turns: GeneratedTurn[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleTopics = [
    'Previa Barcelona vs Chelsea en Liga Sura',
    'Revancha caliente: Inter vs Liverpool en Liga Indisa',
    'Pronósticos para la final soñada: ¿PSG vs Liverpool?',
    '¿Debe Arsenal cambiar de esquema táctico tras recibir 8 goles?',
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchTopic, customNotes }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con Gemini para generar el guion');
      }

      const data = await response.json();
      if (!data.turns || !Array.isArray(data.turns)) {
        throw new Error('Formato de guion inesperado');
      }

      setGeneratedScript({
        title: data.title || 'Debate Deportivo Especial',
        turns: data.turns,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'No se pudo generar el debate');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayGeneratedAudio = () => {
    if (!generatedScript || generatedScript.turns.length === 0) return;
    audioEngine.playBlock({
      id: `custom-${Date.now()}`,
      turns: generatedScript.turns.map((t, idx) => ({
        id: `custom-turn-${idx}`,
        speaker: t.speaker,
        text: t.text,
      })),
    });
  };

  const handlePlayTurn = (turn: GeneratedTurn) => {
    audioEngine.playTurn(turn);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white font-['Outfit']">
            SIMULADOR DE DEBATE EN VIVO CON IA
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Gemini Flash + TTS
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        <p className="text-xs text-slate-300">
          Escribe un partido, resultado o polémica de la Liga Por Favor y Gracias. Marcelo y Patricio debatirán al instante con estilo deportivo chileno y podrás escucharlo con <strong>Gemini 3.8 Flash TTS</strong>.
        </p>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5">
          {sampleTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => setMatchTopic(topic)}
              className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white px-2.5 py-1 rounded-full border border-slate-800 transition-colors cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
              Tema o Partido a Debatir:
            </label>
            <input
              type="text"
              value={matchTopic}
              onChange={(e) => setMatchTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="Ej: Barcelona vs Chelsea Fecha 2..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
              Notas Tácticas o Contexto (opcional):
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="Ej: Pronóstico de Patricio y chiste de Marcelo sobre la defensa..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !matchTopic.trim()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Redactando Guion Chileno...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generar Debate Marcelo vs Patricio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Generated Result Container */}
        {generatedScript && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  DEBATE GENERADO
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  {generatedScript.title}
                </h4>
              </div>

              <button
                onClick={handlePlayGeneratedAudio}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Sintetizar y Escuchar con Gemini TTS</span>
              </button>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 max-h-[380px] overflow-y-auto">
              {generatedScript.turns.map((turn, i) => {
                const isMarcelo = turn.speaker === 'Marcelo';
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs ${
                      isMarcelo
                        ? 'bg-amber-500/5 border-amber-500/30'
                        : 'bg-cyan-500/5 border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`font-bold ${
                          isMarcelo ? 'text-amber-400' : 'text-cyan-400'
                        }`}
                      >
                        {turn.speaker}
                      </span>
                      <button
                        onClick={() => handlePlayTurn(turn)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Escuchar</span>
                      </button>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{turn.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
