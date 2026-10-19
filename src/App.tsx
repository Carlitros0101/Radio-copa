import { useEffect, useState } from 'react';
import { StudioHeader } from './components/StudioHeader';
import { ScriptTeleprompter } from './components/ScriptTeleprompter';
import { TournamentHub } from './components/TournamentHub';
import { TeamRadar } from './components/TeamRadar';
import { Soundboard } from './components/Soundboard';
import { DebateSimulator } from './components/DebateSimulator';
import { BROADCAST_BLOCKS, BroadcastBlock } from './data/scriptData';
import { audioEngine, AudioState } from './services/audioEngine';
import {
  Radio,
  Trophy,
  Users,
  MessageSquareQuote,
  Sparkles,
  Info,
} from 'lucide-react';

export default function App() {
  const [audioState, setAudioState] = useState<AudioState>(audioEngine.getState());
  const [activeBlock, setActiveBlock] = useState<BroadcastBlock>(BROADCAST_BLOCKS[0]);
  const [activeTab, setActiveTab] = useState<
    'programa' | 'torneo' | 'equipos' | 'soundboard' | 'simulador'
  >('programa');

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handlePlayBlockOne = () => {
    setActiveBlock(BROADCAST_BLOCKS[0]);
    audioEngine.playBlock(BROADCAST_BLOCKS[0]);
  };

  const handleSelectBlock = (block: BroadcastBlock) => {
    setActiveBlock(block);
    setActiveTab('programa');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter'] selection:bg-emerald-500 selection:text-black">
      {/* Studio Master Header */}
      <StudioHeader
        audioState={audioState}
        onPlayBlockOne={handlePlayBlockOne}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab('programa')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'programa'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Programa y Guion Completo</span>
            </button>

            <button
              onClick={() => setActiveTab('torneo')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'torneo'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Tablas Temporada 2 & Copa</span>
            </button>

            <button
              onClick={() => setActiveTab('equipos')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'equipos'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Radiografía de 6 Equipos</span>
            </button>

            <button
              onClick={() => setActiveTab('soundboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'soundboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Soundboard Frases</span>
            </button>

            <button
              onClick={() => setActiveTab('simulador')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'simulador'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulador con IA</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Voz: Gemini 3.8 Flash TTS</span>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'programa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ScriptTeleprompter
                audioState={audioState}
                activeBlock={activeBlock}
                onSelectBlock={handleSelectBlock}
              />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <TournamentHub onSelectBlock={handleSelectBlock} />
              <Soundboard />
            </div>
          </div>
        )}

        {activeTab === 'torneo' && (
          <TournamentHub onSelectBlock={handleSelectBlock} />
        )}

        {activeTab === 'equipos' && <TeamRadar />}

        {activeTab === 'soundboard' && <Soundboard />}

        {activeTab === 'simulador' && <DebateSimulator />}

        {/* Direction Note & Information Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                Instrucciones de Dirección de Voz — Especial Deportivo
              </p>
              <p className="text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
                Estilo panel deportivo televisivo chileno de alto nivel con{' '}
                <strong className="text-amber-400">Marcelo</strong> (voz enérgica, conductora) y{' '}
                <strong className="text-cyan-400">Patricio</strong> (comentarista analítico maduro).
                Los marcadores se locutan en estilo futbolístico natural con el modelo de voz{' '}
                <strong>gemini-3.8-flash-tts</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono text-[11px]">
              Liga Por Favor y Gracias
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 Especial Deportivo — Liga Por Favor y Gracias. ¡Aquí se juega con respeto y se gana con fútbol!
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>PSG de ABV • Chelsea de EHT • Inter de CPA</span>
            <span>Liverpool de FAM • Arsenal de MNV • Barcelona de MUF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
