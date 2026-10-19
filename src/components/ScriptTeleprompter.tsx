import { useState } from 'react';
import {
  Play,
  Volume2,
  Sparkles,
  Search,
  CheckCircle2,
  ListFilter,
  FileText,
  Clock,
  Mic,
} from 'lucide-react';
import { BROADCAST_BLOCKS, BroadcastBlock, DialogueTurn } from '../data/scriptData';
import { AudioState, audioEngine } from '../services/audioEngine';

interface ScriptTeleprompterProps {
  audioState: AudioState;
  activeBlock: BroadcastBlock;
  onSelectBlock: (block: BroadcastBlock) => void;
}

export function ScriptTeleprompter({
  audioState,
  activeBlock,
  onSelectBlock,
}: ScriptTeleprompterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpeaker, setFilterSpeaker] = useState<'ALL' | 'Marcelo' | 'Patricio'>('ALL');

  const filteredTurns = activeBlock.turns.filter((turn) => {
    const matchesSpeaker = filterSpeaker === 'ALL' || turn.speaker === filterSpeaker;
    const matchesSearch =
      turn.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      turn.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpeaker && matchesSearch;
  });

  const handlePlayBlock = () => {
    audioEngine.playBlock(activeBlock);
  };

  const handlePlayTurn = (turn: DialogueTurn) => {
    audioEngine.playTurn(turn, activeBlock.id);
  };

  const isCurrentBlockPlaying =
    audioState.isPlaying && audioState.activeBlockId === activeBlock.id;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
      {/* Block Selector Tabs */}
      <div className="bg-slate-950/90 border-b border-slate-800 p-3 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mr-2 px-2 py-1">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>BLOQUES:</span>
          </div>
          {BROADCAST_BLOCKS.map((block) => {
            const isSelected = activeBlock.id === block.id;
            const isPlayingThis =
              audioState.isPlaying && audioState.activeBlockId === block.id;
            return (
              <button
                key={block.id}
                onClick={() => onSelectBlock(block)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>B{block.number}</span>
                <span className="hidden sm:inline truncate max-w-[150px]">
                  {block.title}
                </span>
                {isPlayingThis && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Block Header Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                BLOQUE {activeBlock.number}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                {activeBlock.durationEstimate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit']">
              {activeBlock.title}
            </h2>
            <p className="text-sm text-slate-300">{activeBlock.tagline}</p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayBlock}
              disabled={audioState.isLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer ${
                isCurrentBlockPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/10'
              }`}
            >
              {audioState.isLoading && audioState.activeBlockId === activeBlock.id ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Sintetizando Bloque...</span>
                </>
              ) : isCurrentBlockPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 fill-current animate-bounce" />
                  <span>Bloque En Reproducción</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reproducir Bloque Completo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid for the block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          {activeBlock.keyStats.map((st, i) => (
            <div
              key={i}
              className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs"
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                {st.label}
              </span>
              <p className="text-sm font-bold text-white mt-0.5">{st.value}</p>
              <p className="text-[11px] text-slate-400 truncate">{st.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Speaker Filter toolbar */}
      <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar frase, gol, equipo o remate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <ListFilter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-mono text-[11px]">Voz:</span>
          <button
            onClick={() => setFilterSpeaker('ALL')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              filterSpeaker === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ambos
          </button>
          <button
            onClick={() => setFilterSpeaker('Marcelo')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              filterSpeaker === 'Marcelo'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            Marcelo
          </button>
          <button
            onClick={() => setFilterSpeaker('Patricio')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              filterSpeaker === 'Patricio'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Patricio
          </button>
        </div>
      </div>

      {/* Script Turns List (Teleprompter Feed) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[640px]">
        {filteredTurns.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>No se encontraron intervenciones con el filtro aplicado.</p>
          </div>
        ) : (
          filteredTurns.map((turn) => {
            const isTurnActive =
              audioState.isPlaying && audioState.activeTurnId === turn.id;
            const isMarcelo = turn.speaker === 'Marcelo';

            return (
              <div
                key={turn.id}
                className={`relative rounded-xl p-4 transition-all duration-300 border ${
                  isTurnActive
                    ? isMarcelo
                      ? 'bg-amber-500/10 border-amber-500/70 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                      : 'bg-cyan-500/10 border-cyan-500/70 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/40'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {/* Speaker Header */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isMarcelo
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-cyan-500 text-slate-950'
                      }`}
                    >
                      {turn.speaker[0]}
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        isMarcelo ? 'text-amber-400' : 'text-cyan-400'
                      }`}
                    >
                      {turn.speaker}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {isMarcelo ? '• Relator Conductor' : '• Comentarista y Analista'}
                    </span>
                    {turn.tone && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider hidden md:inline">
                        {turn.tone}
                      </span>
                    )}
                  </div>

                  {/* Play Single Turn Button */}
                  <div className="flex items-center gap-2">
                    {isTurnActive && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                        <Mic className="w-3 h-3" />
                        EN VIVO
                      </span>
                    )}
                    <button
                      onClick={() => handlePlayTurn(turn)}
                      disabled={audioState.isLoading}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isTurnActive
                          ? 'bg-slate-800 text-white'
                          : isMarcelo
                          ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/20'
                      }`}
                      title="Reproducir esta intervención con Gemini TTS"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isTurnActive ? 'Repetir' : 'Escuchar'}</span>
                    </button>
                  </div>
                </div>

                {/* Turn Text */}
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed tracking-wide font-normal">
                  {turn.text}
                </p>

                {/* Highlight Quote Tag */}
                {turn.highlight && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-slate-400 italic">
                      "{turn.highlight}"
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
