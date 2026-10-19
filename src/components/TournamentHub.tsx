import { useState } from 'react';
import {
  Trophy,
  Table as TableIcon,
  Calendar,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import {
  COPA_MATCHES,
  FIXTURES_T2,
  STANDINGS_INDISA,
  STANDINGS_SURA,
  Fixture,
} from '../data/leagueData';
import { BROADCAST_BLOCKS, BroadcastBlock } from '../data/scriptData';
import { audioEngine } from '../services/audioEngine';

interface TournamentHubProps {
  onSelectBlock: (block: BroadcastBlock) => void;
}

export function TournamentHub({ onSelectBlock }: TournamentHubProps) {
  const [activeTab, setActiveTab] = useState<'temporada2' | 'copa'>('temporada2');

  const handlePlayMatchCommentary = (keyBlockId?: string) => {
    if (!keyBlockId) return;
    const targetBlock = BROADCAST_BLOCKS.find((b) => b.id === keyBlockId);
    if (targetBlock) {
      onSelectBlock(targetBlock);
      audioEngine.playBlock(targetBlock);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Top Navigation Tabs */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('temporada2')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'temporada2'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Temporada 2 (Tablas y Fixture)</span>
          </button>
          <button
            onClick={() => setActiveTab('copa')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'copa'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Copa de Campeones (Monarca PSG)</span>
          </button>
        </div>
        <span className="text-xs font-mono text-slate-500 hidden sm:inline">
          Liga Por Favor y Gracias
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {activeTab === 'temporada2' ? (
          <>
            {/* Format Explainer Banner */}
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider">
                  SISTEMA DE COMPETICIÓN
                </span>
                <h3 className="text-base font-bold text-white">
                  Dos Ligas Paralelas: Sura e Indisa
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  3 equipos por grupo, ida y vuelta. 6 partidos por liga, 4 encuentros por club.
                  ¡Diferencia de goles clave!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800">
                  4 PJ por equipo
                </span>
              </div>
            </div>

            {/* Standings Grid: Liga Sura and Liga Indisa side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liga Sura */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <h4 className="font-bold text-sm text-white">LIGA SURA</h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    PSG • Chelsea • Barcelona
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2 px-1">#</th>
                        <th className="py-2 px-2">Club</th>
                        <th className="py-2 px-2">DT</th>
                        <th className="py-2 px-1 text-center">PJ</th>
                        <th className="py-2 px-1 text-center">GF</th>
                        <th className="py-2 px-1 text-center">GC</th>
                        <th className="py-2 px-1 text-center">DG</th>
                        <th className="py-2 px-2 text-center font-bold text-white">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {STANDINGS_SURA.map((row) => (
                        <tr
                          key={row.teamId}
                          className={`hover:bg-slate-900/50 ${
                            row.position === 1 ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <td className="py-2.5 px-1 font-mono font-bold text-slate-400">
                            {row.position}
                          </td>
                          <td className="py-2.5 px-2 font-bold text-white flex items-center gap-1.5">
                            {row.teamName}
                            {row.position === 1 && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono">
                                LÍDER
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-slate-300">{row.manager}</td>
                          <td className="py-2.5 px-1 text-center text-slate-400">{row.played}</td>
                          <td className="py-2.5 px-1 text-center text-emerald-400 font-semibold">
                            {row.gf}
                          </td>
                          <td className="py-2.5 px-1 text-center text-rose-400">{row.ga}</td>
                          <td
                            className={`py-2.5 px-1 text-center font-mono font-semibold ${
                              row.gd > 0
                                ? 'text-emerald-400'
                                : row.gd < 0
                                ? 'text-rose-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {row.gd > 0 ? `+${row.gd}` : row.gd}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-emerald-400 text-sm">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Debut: PSG 8 - 0 Barcelona</span>
                  <button
                    onClick={() => handlePlayMatchCommentary('bloque-4')}
                    className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Escuchar debate PSG 8-0</span>
                  </button>
                </div>
              </div>

              {/* Liga Indisa */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <h4 className="font-bold text-sm text-white">LIGA INDISA</h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Liverpool • Inter • Arsenal
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2 px-1">#</th>
                        <th className="py-2 px-2">Club</th>
                        <th className="py-2 px-2">DT</th>
                        <th className="py-2 px-1 text-center">PJ</th>
                        <th className="py-2 px-1 text-center">GF</th>
                        <th className="py-2 px-1 text-center">GC</th>
                        <th className="py-2 px-1 text-center">DG</th>
                        <th className="py-2 px-2 text-center font-bold text-white">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {STANDINGS_INDISA.map((row) => (
                        <tr
                          key={row.teamId}
                          className={`hover:bg-slate-900/50 ${
                            row.position === 1 ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <td className="py-2.5 px-1 font-mono font-bold text-slate-400">
                            {row.position}
                          </td>
                          <td className="py-2.5 px-2 font-bold text-white flex items-center gap-1.5">
                            {row.teamName}
                            {row.position === 1 && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono">
                                LÍDER
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-slate-300">{row.manager}</td>
                          <td className="py-2.5 px-1 text-center text-slate-400">{row.played}</td>
                          <td className="py-2.5 px-1 text-center text-emerald-400 font-semibold">
                            {row.gf}
                          </td>
                          <td className="py-2.5 px-1 text-center text-rose-400">{row.ga}</td>
                          <td
                            className={`py-2.5 px-1 text-center font-mono font-semibold ${
                              row.gd > 0
                                ? 'text-emerald-400'
                                : row.gd < 0
                                ? 'text-rose-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {row.gd > 0 ? `+${row.gd}` : row.gd}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-emerald-400 text-sm">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Debut: Liverpool 4 - 2 Arsenal</span>
                  <button
                    onClick={() => handlePlayMatchCommentary('bloque-5')}
                    className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Escuchar debate Liverpool 4-2</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Fixtures Radar */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm text-white font-['Outfit']">
                  CARTELERA FECHA 2 (PRÓXIMOS ENCUENTROS)
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FIXTURES_T2.filter((f) => f.status === 'upcoming').map((fix) => (
                  <div
                    key={fix.id}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono text-emerald-400 font-bold">
                        {fix.league.toUpperCase()} • {fix.round}
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        PROGRAMADO
                      </span>
                    </div>

                    <div className="flex items-center justify-between my-3 text-sm font-bold text-white">
                      <div className="flex-1 text-left">
                        <p className="text-base">{fix.homeTeam}</p>
                        <span className="text-[11px] font-mono text-slate-400">
                          DT: {fix.homeManager}
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                        VS
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-base">{fix.awayTeam}</p>
                        <span className="text-[11px] font-mono text-slate-400">
                          DT: {fix.awayManager}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 italic bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      "{fix.highlights}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Copa de Campeones Bracket & Matches */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-950/60 to-slate-950 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-xs font-mono font-bold uppercase">
                  CUADRO DE HONOR
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  PSG (ABV) — Campeón de la Copa
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Subcampeón: Chelsea (EHT) • Tercer Puesto: Inter (CPA) • Cuarto: Liverpool (FAM)
                </p>
              </div>
              <button
                onClick={() => handlePlayMatchCommentary('bloque-1')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio Final (4-3)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COPA_MATCHES.map((match) => (
                <div
                  key={match.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono text-amber-400 font-bold">{match.round}</span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 font-mono">
                        FINALIZADO
                      </span>
                    </div>

                    <div className="space-y-2 my-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          {match.homeTeam}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({match.homeManager})
                          </span>
                        </span>
                        <span className="text-base font-black font-mono text-emerald-400">
                          {match.homeScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">
                          {match.awayTeam}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({match.awayManager})
                          </span>
                        </span>
                        <span className="text-base font-black font-mono text-emerald-400">
                          {match.awayScore}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 italic">{match.highlights}</p>
                  </div>

                  {match.keyBlockId && (
                    <button
                      onClick={() => handlePlayMatchCommentary(match.keyBlockId)}
                      className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Escuchar análisis en el programa</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
