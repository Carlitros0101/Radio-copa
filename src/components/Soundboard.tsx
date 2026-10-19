import { Volume2, Sparkles, MessageSquareQuote } from 'lucide-react';
import { FAMOUS_QUOTES } from '../data/scriptData';
import { audioEngine } from '../services/audioEngine';

export function Soundboard() {
  const handlePlayQuote = (quote: { speaker: string; text: string }) => {
    audioEngine.playTurn({
      speaker: quote.speaker as 'Marcelo' | 'Patricio',
      text: quote.text,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-white font-['Outfit']">
            SOUNDBOARD CHILENO — FRASES MEMORABLES
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Click para escuchar</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {FAMOUS_QUOTES.map((q, idx) => {
          const isMarcelo = q.speaker === 'Marcelo';
          return (
            <button
              key={idx}
              onClick={() => handlePlayQuote(q)}
              className={`p-3 rounded-xl border text-left transition-all duration-250 cursor-pointer group hover:scale-[1.02] flex flex-col justify-between ${
                isMarcelo
                  ? 'bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/15 hover:border-amber-400'
                  : 'bg-cyan-500/5 border-cyan-500/30 hover:bg-cyan-500/15 hover:border-cyan-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                      isMarcelo
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {q.speaker}
                  </span>
                  <Volume2
                    className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-transform ${
                      isMarcelo ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  />
                </div>
                <p className="text-xs font-semibold text-slate-100 leading-snug">
                  "{q.text}"
                </p>
              </div>

              <span className="text-[10px] text-slate-400 mt-2 block font-mono italic">
                {q.context}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
