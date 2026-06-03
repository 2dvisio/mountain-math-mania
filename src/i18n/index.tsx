import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "it";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
];

type Dict = Record<string, string>;

const en: Dict = {
  title: "Mountain Search",
  tagline: "Mine the mountain block by block. Solve math and puzzles, grab diamonds, and beat monsters!",
  howToPlay: "How to play:",
  rule1: "Tap any block on the <b>edge</b> of the mountain.",
  rule2: "Solve a math problem or puzzle to mine it.",
  rule3: "Watch out for monsters — tap fast to defeat them!",
  rule4: "Every 500 points gives you an extra ❤️.",
  rule5: "Bigger mountains scroll — swipe or scroll to see them all.",
  bestScore: "Your best score:",
  startGame: "▶ Start Game",
  pickLanguage: "Choose your language",
  pickLangSub: "You can change this anytime.",
  pickAge: "How old are you?",
  pickAgeSub: "We pick math and puzzles that are just right for your age.",
  changeAnytime: "You can change this anytime.",
  age: "Age",
  language: "Language",
  goalLine: "Mine to the ⭐ <b>goal</b> to finish the level! Blocks left:",
  mathChallenge: "Math Challenge",
  puzzleChallenge: "Puzzle Challenge",
  pickDifferent: "Pick the one that's different",
  whatComesNext: "What comes next?",
  whatNumberNext: "What number comes next?",
  whatNextMul: "What comes next? (multiply pattern)",
  whichMatches: "Which one matches?",
  whichOdd: "Which one doesn't belong?",
  sameIdea: "Same idea — fill in the blank",
  monsterAppeared: "A {name} Appeared!",
  attackThe: "Attack the {name}",
  tapFast: "Tap the monster fast! HP:",
  attacksLeft: "Monster attacks left until you lose a life:",
  notQuite: "Not quite! Try a different block.",
  extraLife: "❤️ Extra life!",
  monsterDefeated: "Monster defeated! +{p}",
  ouch: "Ouch! You lost a life.",
  pointsPlus: "+{p} points!",
  mountainCleared: "🏆 Mountain Cleared!",
  finishedLevel: "You finished level {n}!",
  score: "Score",
  lives: "Lives",
  level: "Level",
  best: "Best",
  finalScore: "Final Score",
  gameOver: "💥 Game Over",
  ranOutLives: "You ran out of lives.",
  nextLevel: "Next Level →",
  playAgain: "Play Again",
  ofLives: "{n} of {m} lives",
  halfOf: "Half of {n} = ?",
  averageOf: "Average of {x}, {y}, {z} = ?",
  wholePart: "{a} ÷ {b} = ? (whole part)",
  bigger: "Which is bigger: {a} or {b}?",
  fractionOf: "1/{d} of {n} = ?",
  percentOf: "{p}% of {n} = ?",
  oreCoal: "Coal +10",
  oreIron: "Iron +25",
  oreGold: "Gold +50",
  oreDiamond: "Diamond +100",
  oreGoal: "🏁 Goal reached! +200",
  zombie: "Zombie",
  skeleton: "Skeleton",
  enderman: "Enderman",
};

const fr: Dict = {
  title: "Mountain Search",
  tagline: "Creuse la montagne bloc par bloc. Résous des maths et énigmes, ramasse des diamants et bats les monstres !",
  howToPlay: "Comment jouer :",
  rule1: "Touche un bloc au <b>bord</b> de la montagne.",
  rule2: "Résous un problème de maths ou une énigme pour le miner.",
  rule3: "Attention aux monstres — tape vite pour les vaincre !",
  rule4: "Tous les 500 points te donnent une ❤️ en plus.",
  rule5: "Les grandes montagnes défilent — glisse pour tout voir.",
  bestScore: "Ton meilleur score :",
  startGame: "▶ Commencer",
  pickLanguage: "Choisis ta langue",
  pickLangSub: "Tu peux changer à tout moment.",
  pickAge: "Quel âge as-tu ?",
  pickAgeSub: "On choisit des maths et énigmes adaptés à ton âge.",
  changeAnytime: "Tu peux changer à tout moment.",
  age: "Âge",
  language: "Langue",
  goalLine: "Mine jusqu'au ⭐ <b>but</b> pour finir le niveau ! Blocs restants :",
  mathChallenge: "Défi de Maths",
  puzzleChallenge: "Défi d'Énigme",
  pickDifferent: "Choisis celui qui est différent",
  whatComesNext: "Qu'est-ce qui vient après ?",
  whatNumberNext: "Quel nombre vient après ?",
  whatNextMul: "Quoi ensuite ? (motif de multiplication)",
  whichMatches: "Lequel correspond ?",
  whichOdd: "Lequel n'appartient pas ?",
  sameIdea: "Même idée — remplis le blanc",
  monsterAppeared: "Un {name} apparaît !",
  attackThe: "Attaquer le {name}",
  tapFast: "Tape vite sur le monstre ! PV :",
  attacksLeft: "Attaques avant de perdre une vie :",
  notQuite: "Pas tout à fait ! Essaie un autre bloc.",
  extraLife: "❤️ Vie en plus !",
  monsterDefeated: "Monstre vaincu ! +{p}",
  ouch: "Aïe ! Tu as perdu une vie.",
  pointsPlus: "+{p} points !",
  mountainCleared: "🏆 Montagne Conquise !",
  finishedLevel: "Tu as fini le niveau {n} !",
  score: "Score",
  lives: "Vies",
  level: "Niveau",
  best: "Meilleur",
  finalScore: "Score final",
  gameOver: "💥 Partie terminée",
  ranOutLives: "Tu n'as plus de vies.",
  nextLevel: "Niveau suivant →",
  playAgain: "Rejouer",
  ofLives: "{n} sur {m} vies",
  halfOf: "Moitié de {n} = ?",
  averageOf: "Moyenne de {x}, {y}, {z} = ?",
  wholePart: "{a} ÷ {b} = ? (partie entière)",
  bigger: "Lequel est le plus grand : {a} ou {b} ?",
  fractionOf: "1/{d} de {n} = ?",
  percentOf: "{p}% de {n} = ?",
  oreCoal: "Charbon +10",
  oreIron: "Fer +25",
  oreGold: "Or +50",
  oreDiamond: "Diamant +100",
  oreGoal: "🏁 But atteint ! +200",
  zombie: "Zombie",
  skeleton: "Squelette",
  enderman: "Enderman",
};

const it: Dict = {
  title: "Mountain Search",
  tagline: "Scava la montagna blocco per blocco. Risolvi matematica ed enigmi, prendi i diamanti e sconfiggi i mostri!",
  howToPlay: "Come si gioca:",
  rule1: "Tocca un blocco sul <b>bordo</b> della montagna.",
  rule2: "Risolvi un problema di matematica o un enigma per scavarlo.",
  rule3: "Attento ai mostri — tocca veloce per sconfiggerli!",
  rule4: "Ogni 500 punti ti dà una ❤️ in più.",
  rule5: "Le montagne grandi scorrono — scorri per vederle tutte.",
  bestScore: "Il tuo miglior punteggio:",
  startGame: "▶ Inizia",
  pickLanguage: "Scegli la lingua",
  pickLangSub: "Puoi cambiare in qualsiasi momento.",
  pickAge: "Quanti anni hai?",
  pickAgeSub: "Scegliamo matematica ed enigmi adatti alla tua età.",
  changeAnytime: "Puoi cambiare in qualsiasi momento.",
  age: "Età",
  language: "Lingua",
  goalLine: "Scava fino al ⭐ <b>traguardo</b> per finire il livello! Blocchi rimasti:",
  mathChallenge: "Sfida di Matematica",
  puzzleChallenge: "Sfida di Enigma",
  pickDifferent: "Scegli quello diverso",
  whatComesNext: "Cosa viene dopo?",
  whatNumberNext: "Quale numero viene dopo?",
  whatNextMul: "Cosa viene dopo? (schema di moltiplicazione)",
  whichMatches: "Quale corrisponde?",
  whichOdd: "Quale non appartiene?",
  sameIdea: "Stessa idea — riempi lo spazio",
  monsterAppeared: "Appare un {name}!",
  attackThe: "Attacca il {name}",
  tapFast: "Tocca veloce il mostro! PV:",
  attacksLeft: "Attacchi prima di perdere una vita:",
  notQuite: "Non proprio! Prova un altro blocco.",
  extraLife: "❤️ Vita extra!",
  monsterDefeated: "Mostro sconfitto! +{p}",
  ouch: "Ahi! Hai perso una vita.",
  pointsPlus: "+{p} punti!",
  mountainCleared: "🏆 Montagna Conquistata!",
  finishedLevel: "Hai finito il livello {n}!",
  score: "Punti",
  lives: "Vite",
  level: "Livello",
  best: "Migliore",
  finalScore: "Punteggio finale",
  gameOver: "💥 Game Over",
  ranOutLives: "Hai finito le vite.",
  nextLevel: "Livello successivo →",
  playAgain: "Rigioca",
  ofLives: "{n} su {m} vite",
  halfOf: "Metà di {n} = ?",
  averageOf: "Media di {x}, {y}, {z} = ?",
  wholePart: "{a} ÷ {b} = ? (parte intera)",
  bigger: "Quale è più grande: {a} o {b}?",
  fractionOf: "1/{d} di {n} = ?",
  percentOf: "{p}% di {n} = ?",
  oreCoal: "Carbone +10",
  oreIron: "Ferro +25",
  oreGold: "Oro +50",
  oreDiamond: "Diamante +100",
  oreGoal: "🏁 Traguardo raggiunto! +200",
  zombie: "Zombie",
  skeleton: "Scheletro",
  enderman: "Enderman",
};

const DICTS: Record<Lang, Dict> = { en, fr, it };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const d = DICTS[lang] ?? en;
  let s = d[key] ?? en[key] ?? key;
  if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, String(vars[k]));
  return s;
}

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<Ctx | null>(null);

const STORAGE = "mountain-search-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE) as Lang | null;
      if (saved && DICTS[saved]) setLangState(saved);
    } catch { /* ignore */ }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem(STORAGE, l); } catch { /* ignore */ }
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: (k, v) => translate(lang, k, v) }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): Ctx {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}
