import { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Gauge,
  Trophy,
} from 'lucide-react';
import { AudioState, audioEngine } from '../services/audioEngine';
import { AudioVisualizer } from './AudioVisualizer';

interface StudioHeaderProps {
  audioState: AudioState;
  onPlayBlockOne: () => void;
}

export function StudioHeader({ audioState, onPlayBlockOne }: StudioHeaderProps) {
  const [ambientActive, setAmbientActive] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const speeds = [0.8, 1.0, 1.25, 1.5];

  const handleToggleAmbient = () => {
    const next = audioEngine.toggleAmbientSound();
    setAmbientActive(next);
  };

  const handleCycleSpeed = () => {
    const nextIdx = (speedIndex + 1) % speeds.length;
    setSpeedIndex(nextIdx);
    audioEngine.setPlaybackRate(speeds[nextIdx]);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isMarceloActive = audioState.isPlaying && audioState.currentSpeaker === 'Marcelo';
  const isPatricioActive = audioState.isPlaying && audioState.currentSpeaker === 'Patricio';

  return (
    <header className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 text-slate-100 shadow-2xl overflow-hidden">
      {/* Top TV On-Air Ticker */}
      <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] animate-pulse shadow-sm">
            <Radio className="w-3 h-3" />
            EN EL AIRE
          </div>
          <span className="text-emerald-400 font-semibold tracking-wide hidden sm:inline">
            ESPECIAL DEPORTIVO — LIGA POR FAVOR Y GRACIAS
          </span>
          <span className="text-slate-400 hidden md:inline">
            • Temporada 2 & Resumen Copa de Campeones
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Gemini 3.8 Flash TTS</span>
          </div>
          <span className="font-mono text-slate-400 text-[11px] hidden sm:inline">
            Santiago de Chile • Panel Oficial
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Main Title & Tagline */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                PRODUCCIÓN RADIAL & TV
              </span>
              <span className="text-xs text-slate-400 font-mono">Acento Chileno Natural</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-['Outfit']">
              Liga Por Favor y Gracias
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Debate estelar con <strong className="text-amber-400">Marcelo</strong> (conductor y relator) y{' '}
              <strong className="text-cyan-400">Patricio</strong> (analista crítico). Análisis de la corona de PSG, el
              subcampeonato de Chelsea, el renacer de Inter y el arranque de las Ligas Sura e Indisa.
            </p>
          </div>

          {/* Commentator Microphones Live Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Marcelo Card */}
            <div
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                isMarceloActive
                  ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50 scale-102'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-base ${
                    isMarceloActive ? 'bg-gradient-to-tr from-amber-600 to-red-500' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  M
                </div>
                {isMarceloActive && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-900 animate-ping" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">Marcelo</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isMarceloActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isMarceloActive ? 'EN VIVO' : 'MIC ACTIVO'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Relator • Enérgico</p>
              </div>
            </div>

            {/* Patricio Card */}
            <div
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                isPatricioActive
                  ? 'bg-cyan-500/15 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50 scale-102'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-base ${
                    isPatricioActive ? 'bg-gradient-to-tr from-cyan-600 to-blue-600' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  P
                </div>
                {isPatricioActive && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-slate-900 animate-ping" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">Patricio</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isPatricioActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPatricioActive ? 'EN VIVO' : 'MIC ACTIVO'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Analista • Crítico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Master Control Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!audioState.isPlaying ? (
              <button
                onClick={onPlayBlockOne}
                disabled={audioState.isLoading}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95 text-sm cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{audioState.isLoading ? 'Cargando...' : 'Iniciar Transmisión'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => audioEngine.pause()}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg transition-all text-sm cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausa</span>
                </button>
                <button
                  onClick={() => audioEngine.stop()}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg transition-all text-sm border border-slate-700 cursor-pointer"
                  title="Detener audio"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Detener</span>
                </button>
              </div>
            )}

            {/* Visualizer */}
            <AudioVisualizer audioState={audioState} speaker={audioState.currentSpeaker} />

            {/* Time code */}
            {audioState.duration > 0 && (
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {formatSeconds(audioState.currentTime)} / {formatSeconds(audioState.duration)}
              </span>
            )}
          </div>

          {/* Secondary Controls (Ambient sound & Speed) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleAmbient}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                ambientActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Activar ambiente sutil de graderías / estadio"
            >
              {ambientActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>Ambiente Estadio: {ambientActive ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={handleCycleSpeed}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-800 cursor-pointer"
              title="Velocidad de reproducción"
            >
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{speeds[speedIndex]}x</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 text-amber-400 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-amber-500/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>PSG Campeón de Copa</span>
            </div>
          </div>
        </div>

        {/* Playback progress bar */}
        {audioState.duration > 0 && audioState.isPlaying && (
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-200"
              style={{
                width: `${Math.min(100, (audioState.currentTime / audioState.duration) * 100)}%`,
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
