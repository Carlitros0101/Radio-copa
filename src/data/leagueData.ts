export interface TeamProfile {
  id: string;
  name: string;
  shortCode: string;
  manager: string;
  league: 'Sura' | 'Indisa';
  primaryColor: string;
  secondaryColor: string;
  accentBadge: string;
  titleTag: string;
  summary: string;
  patricioVerdict: string;
  copaRecord: string;
  ligaRecord: string;
  stats: {
    goalsScoredTotal: number;
    goalsConcededTotal: number;
    difference: number;
    matchesKnown: number;
  };
}

export interface StandingRow {
  position: number;
  teamId: string;
  teamName: string;
  manager: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: ('W' | 'D' | 'L' | 'PENDING')[];
}

export interface Fixture {
  id: string;
  league: 'Sura' | 'Indisa';
  round: string;
  homeTeam: string;
  homeManager: string;
  awayTeam: string;
  awayManager: string;
  homeScore?: number;
  awayScore?: number;
  status: 'completed' | 'upcoming';
  highlights?: string;
  keyBlockId?: string;
}

export const TEAMS: Record<string, TeamProfile> = {
  psg: {
    id: 'psg',
    name: 'París Saint-Germain',
    shortCode: 'PSG',
    manager: 'ABV',
    league: 'Sura',
    primaryColor: '#004170',
    secondaryColor: '#DA291C',
    accentBadge: 'bg-blue-600/20 text-blue-400 border-blue-500/40',
    titleTag: 'Flamante Campeón y Máquina Ofensiva',
    summary: 'Imparable pegada: 17 goles en sus últimos 3 partidos oficiales (5 a Inter, 4 a Chelsea, 8 a Barcelona). Es la gran referencia.',
    patricioVerdict: 'Claramente el equipo con más poder de fuego, pero concedió 3 goles en la final. En una liga de 4 partidos, un descuido cuesta caro.',
    copaRecord: 'Campeón (5-0 en semi, 4-3 en final)',
    ligaRecord: '1º Lugar (8-0 en debut)',
    stats: {
      goalsScoredTotal: 17,
      goalsConcededTotal: 3,
      difference: +14,
      matchesKnown: 3,
    },
  },
  chelsea: {
    id: 'chelsea',
    name: 'Chelsea FC',
    shortCode: 'CHE',
    manager: 'EHT',
    league: 'Sura',
    primaryColor: '#034694',
    secondaryColor: '#001489',
    accentBadge: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40',
    titleTag: 'Subcampeón de Fierro',
    summary: 'Dejó la piel en la Copa de Campeones. Venció 4-3 al Liverpool en semis y estuvo a solo un gol de empatar la final con PSG.',
    patricioVerdict: 'Competidor nato en llaves de eliminación directa. Su desafío será encontrar regularidad en la fase regular de liga.',
    copaRecord: 'Subcampeón (4-3 en semi, 3-4 en final)',
    ligaRecord: 'Pendiente de debut (próximo vs Barcelona)',
    stats: {
      goalsScoredTotal: 7,
      goalsConcededTotal: 7,
      difference: 0,
      matchesKnown: 2,
    },
  },
  inter: {
    id: 'inter',
    name: 'Inter de Milán',
    shortCode: 'INT',
    manager: 'CPA',
    league: 'Indisa',
    primaryColor: '#001C84',
    secondaryColor: '#009FE3',
    accentBadge: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/40',
    titleTag: 'El Ave Fénix del Torneo',
    summary: 'Pasó del doloroso 0-5 ante PSG a golear 5-2 al temible Liverpool por el tercer puesto. Carácter y capacidad de resurgir.',
    patricioVerdict: 'Su mayor virtud es el orgullo y capacidad de reacción. Debe demostrar si su versión real es la que cayó 0-5 o la que arrasó 5-2.',
    copaRecord: 'Tercer Lugar (4-1 clasificación, 0-5 semi, 5-2 tercer puesto)',
    ligaRecord: 'Pendiente de debut (próximo vs Liverpool)',
    stats: {
      goalsScoredTotal: 9,
      goalsConcededTotal: 8,
      difference: +1,
      matchesKnown: 3,
    },
  },
  liverpool: {
    id: 'liverpool',
    name: 'Liverpool FC',
    shortCode: 'LIV',
    manager: 'FAM',
    league: 'Indisa',
    primaryColor: '#C8102E',
    secondaryColor: '#F6EB61',
    accentBadge: 'bg-red-600/20 text-red-400 border-red-500/40',
    titleTag: 'El Torbellino Sin Frenos',
    summary: 'Potencia ofensiva incalculable (metió 7 a Barca, 3 a Chelsea, 4 a Arsenal), pero defensivamente vulnerable en cada jornada.',
    patricioVerdict: 'El equipo te mete cuatro, pero te deja con la calculadora en la mano. Necesita urgentemente balance defensivo.',
    copaRecord: 'Cuarto Lugar (7-2 clasif, 3-4 semi, 2-5 3er puesto)',
    ligaRecord: '1º Lugar Indisa (4-2 en debut)',
    stats: {
      goalsScoredTotal: 16,
      goalsConcededTotal: 13,
      difference: +3,
      matchesKnown: 4,
    },
  },
  arsenal: {
    id: 'arsenal',
    name: 'Arsenal FC',
    shortCode: 'ARS',
    manager: 'MNV',
    league: 'Indisa',
    primaryColor: '#EF0107',
    secondaryColor: '#9C824A',
    accentBadge: 'bg-amber-600/20 text-amber-400 border-amber-500/40',
    titleTag: 'Urgencia en el Cerrojo',
    summary: 'Recibió 8 goles en sus dos partidos (4 ante Inter en copa y 4 ante Liverpool en liga). Con esa sangría defensiva es imposible sumar.',
    patricioVerdict: 'Tendencia marcadamente negativa. En un torneo de solo cuatro fechas no hay margen para seguir concediendo 4 goles por fecha.',
    copaRecord: 'Eliminado en Clasificación (1-4 vs Inter)',
    ligaRecord: '3º Lugar Indisa (2-4 vs Liverpool)',
    stats: {
      goalsScoredTotal: 3,
      goalsConcededTotal: 8,
      difference: -5,
      matchesKnown: 2,
    },
  },
  barcelona: {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortCode: 'BAR',
    manager: 'MUF',
    league: 'Sura',
    primaryColor: '#A50044',
    secondaryColor: '#004D98',
    accentBadge: 'bg-rose-600/20 text-rose-400 border-rose-500/40',
    titleTag: 'Alarma Crítica en Cataluña',
    summary: 'Recibió 15 goles en sus 2 partidos conocidos (7-2 con Liverpool y 8-0 con PSG). Urge cerrojo inmediato antes de enfrentar al Chelsea.',
    patricioVerdict: 'Diagnóstico sumamente preocupante: 15 goles recibidos y apenas 2 a favor (-13 de gol diferencia). Requiere un giro de 180 grados.',
    copaRecord: 'Eliminado en Clasificación (2-7 vs Liverpool)',
    ligaRecord: '3º Lugar Sura (0-8 vs PSG)',
    stats: {
      goalsScoredTotal: 2,
      goalsConcededTotal: 15,
      difference: -13,
      matchesKnown: 2,
    },
  },
};

export const STANDINGS_SURA: StandingRow[] = [
  {
    position: 1,
    teamId: 'psg',
    teamName: 'París Saint-Germain',
    manager: 'ABV',
    played: 1,
    won: 1,
    drawn: 0,
    lost: 0,
    gf: 8,
    ga: 0,
    gd: 8,
    points: 3,
    form: ['W'],
  },
  {
    position: 2,
    teamId: 'chelsea',
    teamName: 'Chelsea FC',
    manager: 'EHT',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    form: ['PENDING'],
  },
  {
    position: 3,
    teamId: 'barcelona',
    teamName: 'FC Barcelona',
    manager: 'MUF',
    played: 1,
    won: 0,
    drawn: 0,
    lost: 1,
    gf: 0,
    ga: 8,
    gd: -8,
    points: 0,
    form: ['L'],
  },
];

export const STANDINGS_INDISA: StandingRow[] = [
  {
    position: 1,
    teamId: 'liverpool',
    teamName: 'Liverpool FC',
    manager: 'FAM',
    played: 1,
    won: 1,
    drawn: 0,
    lost: 0,
    gf: 4,
    ga: 2,
    gd: 2,
    points: 3,
    form: ['W'],
  },
  {
    position: 2,
    teamId: 'inter',
    teamName: 'Inter de Milán',
    manager: 'CPA',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    form: ['PENDING'],
  },
  {
    position: 3,
    teamId: 'arsenal',
    teamName: 'Arsenal FC',
    manager: 'MNV',
    played: 1,
    won: 0,
    drawn: 0,
    lost: 1,
    gf: 2,
    ga: 4,
    gd: -2,
    points: 0,
    form: ['L'],
  },
];

export const COPA_MATCHES: Fixture[] = [
  {
    id: 'copa-q1',
    league: 'Indisa',
    round: 'Clasificación',
    homeTeam: 'Arsenal FC',
    homeManager: 'MNV',
    awayTeam: 'Inter de Milán',
    awayManager: 'CPA',
    homeScore: 1,
    awayScore: 4,
    status: 'completed',
    highlights: 'Inter impone jerarquía con un contundente 4 a 1 sobre los Gunners.',
  },
  {
    id: 'copa-q2',
    league: 'Sura',
    round: 'Clasificación',
    homeTeam: 'Liverpool FC',
    homeManager: 'FAM',
    awayTeam: 'FC Barcelona',
    awayManager: 'MUF',
    homeScore: 7,
    awayScore: 2,
    status: 'completed',
    highlights: 'Torbellino de los Reds: festival de goles ante un Barcelona desbordado.',
  },
  {
    id: 'copa-s1',
    league: 'Sura',
    round: 'Semifinal 1',
    homeTeam: 'París Saint-Germain',
    homeManager: 'ABV',
    awayTeam: 'Inter de Milán',
    awayManager: 'CPA',
    homeScore: 5,
    awayScore: 0,
    status: 'completed',
    highlights: 'Demolición parisina sin contemplaciones para sacar boleto a la gran final.',
    keyBlockId: 'bloque-1',
  },
  {
    id: 'copa-s2',
    league: 'Indisa',
    round: 'Semifinal 2',
    homeTeam: 'Chelsea FC',
    homeManager: 'EHT',
    awayTeam: 'Liverpool FC',
    awayManager: 'FAM',
    homeScore: 4,
    awayScore: 3,
    status: 'completed',
    highlights: 'Partidazo electrizante de ida y vuelta resuelto en los instantes finales.',
    keyBlockId: 'bloque-2',
  },
  {
    id: 'copa-bronze',
    league: 'Indisa',
    round: 'Tercer Lugar',
    homeTeam: 'Inter de Milán',
    homeManager: 'CPA',
    awayTeam: 'Liverpool FC',
    awayManager: 'FAM',
    homeScore: 5,
    awayScore: 2,
    status: 'completed',
    highlights: 'Inter se sacude de las semis y se cuelga la medalla de bronce con autoridad.',
    keyBlockId: 'bloque-2',
  },
  {
    id: 'copa-final',
    league: 'Sura',
    round: 'Gran Final',
    homeTeam: 'París Saint-Germain',
    homeManager: 'ABV',
    awayTeam: 'Chelsea FC',
    awayManager: 'EHT',
    homeScore: 4,
    awayScore: 3,
    status: 'completed',
    highlights: '¡7 goles en la final! ABV alza la Copa de Campeones en un duelo memorable.',
    keyBlockId: 'bloque-1',
  },
];

export const FIXTURES_T2: Fixture[] = [
  {
    id: 't2-m1',
    league: 'Sura',
    round: 'Fecha 1',
    homeTeam: 'París Saint-Germain',
    homeManager: 'ABV',
    awayTeam: 'FC Barcelona',
    awayManager: 'MUF',
    homeScore: 8,
    awayScore: 0,
    status: 'completed',
    highlights: 'Histórica goleada del campeón. PSG líder absoluto con +8 de diferencia.',
    keyBlockId: 'bloque-4',
  },
  {
    id: 't2-m2',
    league: 'Indisa',
    round: 'Fecha 1',
    homeTeam: 'Liverpool FC',
    homeManager: 'FAM',
    awayTeam: 'Arsenal FC',
    awayManager: 'MNV',
    homeScore: 4,
    awayScore: 2,
    status: 'completed',
    highlights: 'FAM se recupera del traspié copero sumando 3 puntos de oro.',
    keyBlockId: 'bloque-5',
  },
  {
    id: 't2-m3',
    league: 'Sura',
    round: 'Fecha 2 (Próximo)',
    homeTeam: 'FC Barcelona',
    homeManager: 'MUF',
    awayTeam: 'Chelsea FC',
    awayManager: 'EHT',
    status: 'upcoming',
    highlights: 'Duelo crucial: Barcelona obligado a levantar cabeza ante el subcampeón Chelsea.',
    keyBlockId: 'bloque-4',
  },
  {
    id: 't2-m4',
    league: 'Indisa',
    round: 'Fecha 2 (Próximo)',
    homeTeam: 'Inter de Milán',
    homeManager: 'CPA',
    awayTeam: 'Liverpool FC',
    awayManager: 'FAM',
    status: 'upcoming',
    highlights: 'Revancha caliente: Inter debuta contra el Liverpool al que venció 5-2 hace días.',
    keyBlockId: 'bloque-5',
  },
];
