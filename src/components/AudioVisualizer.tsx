import { useEffect, useRef } from 'react';
import { audioEngine, AudioState } from '../services/audioEngine';

interface AudioVisualizerProps {
  audioState: AudioState;
  speaker: 'Marcelo' | 'Patricio' | null;
}

export function AudioVisualizer({ audioState, speaker }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const analyser = audioEngine.getAnalyser();

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const isSpeaking = audioState.isPlaying && !audioState.isLoading;

      if (!isSpeaking) {
        // Subtle resting baseline
        ctx.fillStyle = 'rgba(71, 85, 105, 0.25)';
        const barsCount = 28;
        const barWidth = (width / barsCount) - 3;
        for (let i = 0; i < barsCount; i++) {
          const x = i * (barWidth + 3);
          const barH = 3 + Math.sin(Date.now() * 0.002 + i * 0.4) * 1.5;
          ctx.fillRect(x, (height - barH) / 2, barWidth, barH);
        }
        return;
      }

      let dataArray = new Uint8Array(32);
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Synthetic frequency wave if analyser not hooked to media element
        for (let i = 0; i < 32; i++) {
          dataArray[i] = Math.floor(
            60 + Math.sin(Date.now() * 0.01 + i * 0.5) * 80 + Math.random() * 40
          );
        }
      }

      const barsCount = 28;
      const barWidth = (width / barsCount) - 3;

      for (let i = 0; i < barsCount; i++) {
        const val = dataArray[i % dataArray.length] / 255;
        const barH = Math.max(4, val * (height - 6));
        const x = i * (barWidth + 3);
        const y = (height - barH) / 2;

        // Gradient based on current speaker
        const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
        if (speaker === 'Marcelo') {
          gradient.addColorStop(0, '#f59e0b'); // amber gold
          gradient.addColorStop(1, '#ef4444'); // energetic red
        } else if (speaker === 'Patricio') {
          gradient.addColorStop(0, '#06b6d4'); // analytical cyan
          gradient.addColorStop(1, '#3b82f6'); // blue
        } else {
          gradient.addColorStop(0, '#10b981'); // emerald
          gradient.addColorStop(1, '#059669');
        }

        ctx.fillStyle = gradient;
        // Rounded bar
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [audioState.isPlaying, audioState.isLoading, speaker]);

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            audioState.isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
          }`}
        />
        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
          {audioState.isLoading
            ? 'Sintetizando voz...'
            : audioState.isPlaying
            ? `Audio: ${speaker || 'Panel'}`
            : 'En espera'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={140}
        height={22}
        className="w-[140px] h-[22px] rounded"
      />
    </div>
  );
}
