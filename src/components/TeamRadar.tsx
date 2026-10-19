import { useState } from 'react';
import { TEAMS, TeamProfile } from '../data/leagueData';
import { ShieldAlert, Zap, TrendingUp, Volume2, Award, Users } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export function TeamRadar() {
  const [selectedTeamKey, setSelectedTeamKey] = useState<string>('psg');
  const teamList = Object.values(TEAMS);
  const currentTeam = TEAMS[selectedTeamKey] || teamList[0];

  const handlePlayTeamVerdict = (team: TeamProfile) => {
    audioEngine.playTurn({
      speaker: 'Patricio',
      text: team.patricioVerdict,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white font-['Outfit']">
            RADIOGRAFÍA DE LOS 6 EQUIPOS (EL PANEL ANALIZA)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Diagnóstico Bloque 6</span>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Team Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {teamList.map((t) => {
            const isSelected = t.id === currentTeam.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTeamKey(t.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white truncate">{t.shortCode}</span>
                  <span className="text-[10px] font-mono text-slate-400">{t.manager}</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate mt-1">{t.name}</p>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono">
                  <span
                    className={
                      t.stats.difference > 0
                        ? 'text-emerald-400 font-bold'
                        : t.stats.difference < 0
                        ? 'text-rose-400 font-bold'
                        : 'text-slate-400'
                    }
                  >
                    DG {t.stats.difference > 0 ? `+${t.stats.difference}` : t.stats.difference}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Team Detailed Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                  LIGA {currentTeam.league.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Director Técnico: <strong className="text-white">{currentTeam.manager}</strong>
                </span>
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                {currentTeam.name}
              </h4>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                "{currentTeam.titleTag}"
              </p>
            </div>

            {/* Quick Play Verdict Button */}
            <button
              onClick={() => handlePlayTeamVerdict(currentTeam)}
              className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>Escuchar Diagnóstico de Patricio</span>
            </button>
          </div>

          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            {currentTeam.summary}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono">
                Goles a Favor
              </span>
              <p className="text-lg font-black text-emerald-400">
                {currentTeam.stats.goalsScoredTotal}
              </p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono">
                Goles en Contra
              </span>
              <p
                className={`text-lg font-black ${
                  currentTeam.stats.goalsConcededTotal >= 10
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {currentTeam.stats.goalsConcededTotal}
              </p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono">
                Diferencia Total
              </span>
              <p
                className={`text-lg font-black font-mono ${
                  currentTeam.stats.difference > 0
                    ? 'text-emerald-400'
                    : currentTeam.stats.difference < 0
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {currentTeam.stats.difference > 0
                  ? `+${currentTeam.stats.difference}`
                  : currentTeam.stats.difference}
              </p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono">
                Partidos Registrados
              </span>
              <p className="text-lg font-black text-white">
                {currentTeam.stats.matchesKnown}
              </p>
            </div>
          </div>

          {/* Patricio's Direct Quote Box */}
          <div className="mt-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 font-mono uppercase">
                Veredicto Táctico de Patricio:
              </span>
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "{currentTeam.patricioVerdict}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
