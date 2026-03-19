const TITLES = [
  { days: 0,   emoji: "💀", title: "Mortal",           color: "#777777", dark: "#333333", rank: "I"    },
  { days: 1,   emoji: "🌱", title: "Awakened",         color: "#6BCB77", dark: "#2d6b33", rank: "II"   },
  { days: 3,   emoji: "⚔️", title: "Warrior",          color: "#E07B39", dark: "#7a3d10", rank: "III"  },
  { days: 7,   emoji: "🛡️", title: "Champion",         color: "#4DA6FF", dark: "#1a4d80", rank: "IV"   },
  { days: 14,  emoji: "🔥", title: "Titan",            color: "#FF6B35", dark: "#8B2500", rank: "V"    },
  { days: 21,  emoji: "🌩️", title: "Colossus",         color: "#A78BFA", dark: "#4c3080", rank: "VI"   },
  { days: 30,  emoji: "👁️", title: "Warlord",          color: "#F59E0B", dark: "#7a4a00", rank: "VII"  },
  { days: 45,  emoji: "🐉", title: "Overlord",         color: "#EF4444", dark: "#7f1d1d", rank: "VIII" },
  { days: 60,  emoji: "⚡", title: "Demigod",          color: "#06B6D4", dark: "#0e4c5e", rank: "IX"   },
  { days: 90,  emoji: "👑", title: "God",              color: "#FFD700", dark: "#7a5f00", rank: "X"    },
  { days: 120, emoji: "🌌", title: "Cosmic Entity",    color: "#C084FC", dark: "#5b21b6", rank: "XI"   },
  { days: 180, emoji: "🔱", title: "Supreme Being",    color: "#F0ABFC", dark: "#86198f", rank: "XII"  },
  { days: 365, emoji: "✨", title: "Eternal",          color: "#FFFFFF", dark: "#888888", rank: "XIII" },
];

const STORAGE_KEY = "l0calgh0st_streak_epic";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { streak: 0, lastCheckin: null, bestStreak: 0 };
}

function saveData(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch(e) {}
}

function getTitle(streak) {
  let cur = TITLES[0];
  for (const t of TITLES) { if (streak >= t.days) cur = t; }
  return cur;
}

function getNextTitle(streak) {
  for (const t of TITLES) { if (t.days > streak) return t; }
  return null;
}

function render() {
  const d = loadData();
  const { streak, lastCheckin, bestStreak } = d;
  const t = getTitle(streak);
  const next = getNextTitle(streak);
  const alreadyDone = lastCheckin === todayStr();

  document.body.style.setProperty("--glow-color", t.color + "18");

  const bestBadge = document.getElementById("bestBadge");
  if (bestStreak > 0) {
    bestBadge.style.display = "block";
    document.getElementById("bestNum").textContent = bestStreak;
  } else {
    bestBadge.style.display = "none";
  }

  document.getElementById("mainCard").style.boxShadow = `0 0 80px ${t.color}15, 0 0 1px ${t.color}33`;
  document.getElementById("titleEmoji").textContent = t.emoji;
  document.getElementById("titleEmoji").style.setProperty("--title-color", t.color);

  const titleEl = document.getElementById("titleText");
  titleEl.textContent = t.title;
  titleEl.style.setProperty("--title-color", t.color);

  document.getElementById("titleRank").textContent = `RANK ${t.rank} · DAY ${streak}`;
  document.getElementById("divider").style.background = `linear-gradient(90deg, transparent, ${t.color}, transparent)`;

  const numEl = document.getElementById("streakNum");
  numEl.textContent = streak;
  numEl.style.setProperty("--title-color", t.color);
  numEl.style.setProperty("--title-glow", t.color + "66");

  const btn = document.getElementById("btnSuccess");
  btn.style.setProperty("--title-color", t.color);
  btn.style.setProperty("--title-color-dark", t.dark);
  btn.style.setProperty("--title-glow", t.color + "55");

  const progSection = document.getElementById("progressSection");
  if (next) {
    progSection.style.display = "block";
    document.getElementById("nextTitleLabel").textContent = `Next: ${next.emoji} ${next.title}`;
    const daysAway = next.days - streak;
    document.getElementById("nextTitleDays").textContent = `${daysAway} day${daysAway !== 1 ? "s" : ""} away`;
    const pct = Math.min(100, ((streak - t.days) / (next.days - t.days)) * 100);
    const fill = document.getElementById("progressFill");
    fill.style.width = pct + "%";
    fill.style.background = `linear-gradient(90deg, ${t.color}, ${next.color})`;
    fill.style.boxShadow = `0 0 8px ${t.color}88`;
  } else {
    progSection.style.display = "none";
  }

  document.getElementById("checkinDone").style.display = alreadyDone ? "block" : "none";
  btn.disabled = alreadyDone;

  document.getElementById("modalDesc").textContent =
    `Resetting means falling back to Mortal from ${t.title} (${streak} days). Rise again — every legend has fallen before.`;

  const grid = document.getElementById("titlesGrid");
  grid.innerHTML = "";
  for (const ti of TITLES) {
    const unlocked = streak >= ti.days;
    const badge = document.createElement("div");
    badge.className = "title-badge " + (unlocked ? "" : "locked");
    if (unlocked) {
      badge.style.background = ti.color + "18";
      badge.style.border = `1px solid ${ti.color}44`;
      badge.style.color = ti.color;
    }
    badge.innerHTML = `<span class="badge-emoji">${ti.emoji}</span><span>${ti.title}</span>` +
      (!unlocked ? `<span class="badge-days">(${ti.days}d)</span>` : ``);
    grid.appendChild(badge);
  }
}

function spawnParticles(color) {
  const colors = [color, "#FFD700", "#fff", color, "#FFA500", "#fff"];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = (20 + Math.random() * 60) + "%";
    p.style.top = "55%";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.5) + "s";
    p.style.boxShadow = `0 0 6px ${colors[i % colors.length]}`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1900);
  }
}

function handleSuccess() {
  const d = loadData();
  if (d.lastCheckin === todayStr()) return;
  const newStreak = d.streak + 1;
  const newBest = Math.max(d.bestStreak, newStreak);
  saveData({ streak: newStreak, lastCheckin: todayStr(), bestStreak: newBest });
  const t = getTitle(newStreak);
  spawnParticles(t.color);
  const card = document.getElementById("mainCard");
  card.classList.remove("anim-pulse");
  void card.offsetWidth;
  card.classList.add("anim-pulse");
  setTimeout(() => card.classList.remove("anim-pulse"), 700);
  render();
}

function handleFail() { document.getElementById("modal").classList.add("active"); }
function closeModal() { document.getElementById("modal").classList.remove("active"); }

function confirmFail() {
  const d = loadData();
  saveData({ streak: 0, lastCheckin: null, bestStreak: d.bestStreak });
  closeModal();
  const card = document.getElementById("mainCard");
  card.classList.remove("anim-shake");
  void card.offsetWidth;
  card.classList.add("anim-shake");
  setTimeout(() => card.classList.remove("anim-shake"), 600);
  render();
}

function openSetStreak() {
  document.getElementById("streakInput").value = "";
  document.getElementById("setModal").classList.add("active");
  setTimeout(() => document.getElementById("streakInput").focus(), 100);
}

function closeSetModal() {
  document.getElementById("setModal").classList.remove("active");
}

function confirmSetStreak() {
  const val = parseInt(document.getElementById("streakInput").value);
  if (isNaN(val) || val < 0) {
    document.getElementById("streakInput").style.borderColor = "rgba(255,60,60,0.5)";
    setTimeout(() => document.getElementById("streakInput").style.borderColor = "rgba(255,255,255,0.12)", 1000);
    return;
  }
  const d = loadData();
  const newBest = Math.max(d.bestStreak, val);
  saveData({ streak: val, lastCheckin: null, bestStreak: newBest });
  closeSetModal();
  const t = getTitle(val);
  spawnParticles(t.color);
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("streakInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmSetStreak();
    if (e.key === "Escape") closeSetModal();
  });

  document.getElementById("modal").addEventListener("click", function(e) { if (e.target === this) closeModal(); });
  document.getElementById("setModal").addEventListener("click", function(e) { if (e.target === this) closeSetModal(); });

  render();
  loadQuote();
});

// Quotes

const fallbackQuotes = [
  "You showed up today.",
  "Consistency beats intensity.",
  "Don't break the chain.",
  "One day at a time.",
  "Discipline creates freedom.",
  "Your future self is watching.",
  "Every urge you resist makes you stronger.",
  "Pain now, power later.",
  "You are not your impulses.",
  "Control your mind or it controls you.",
  "Real strength is saying no.",
  "The struggle is the training.",
  "You've come too far to quit now.",
  "Hard days build strong men.",
  "Choose discomfort over regret.",
  "Your willpower is a muscle — train it.",
  "Silence the urge, amplify the man.",
  "Reclaim your energy.",
  "You don't need it. You never did.",
  "Progress over perfection.",
  "Today's resistance is tomorrow's reward.",
  "Stay the course.",
  "The streak is proof of your power.",
  "Weak moments pass. Regret lingers.",
  "Be the man you were meant to be.",
  "Your mind is the battlefield.",
  "Win the morning, win the day.",
  "You are stronger than the urge.",
  "Every day clean is a victory.",
  "Don't let one bad moment erase good days.",
  "Breathe through it.",
  "Urges are temporary. Character is permanent.",
  "You chose growth today. Own it.",
  "The dopamine lies. Real life doesn't.",
  "Build the life, not the habit.",
  "Stay hard.",
  "No shortcuts to real confidence.",
  "Your energy is your superpower.",
  "Feed your ambition, not your addiction.",
  "This too shall pass.",
  "The reset button doesn't exist.",
  "Protect your streak like it's sacred.",
  "Clarity comes with clean living.",
  "You are rewriting your story.",
  "Small wins stack into big changes.",
  "The man in the mirror is improving.",
  "Don't trade long-term power for short-term relief.",
  "Keep going. You're closer than you think.",
  "Discipline is self-respect in action.",
  "Your potential is locked behind the urge.",
  "Break the loop.",
  "You earned this day.",
  "Silence the noise. Find yourself.",
  "Momentum is everything — keep it.",
  "One decision changes everything.",
  "You are not weak. You were just unaware.",
  "Awareness is the first act of strength.",
  "Rise above the reflex.",
  "Difficult roads lead to powerful destinations.",
  "Your brain is healing. Let it.",
  "Starve the addiction, feed the vision.",
  "What would the best version of you do?",
  "Prove yourself right, not the urge.",
  "You control the inputs. You control the outputs.",
  "Be relentless in your pursuit of self.",
  "Today's 'no' is tomorrow's confidence.",
  "You are building something real.",
  "Honor the commitment you made to yourself.",
  "The urge will pass. Your goals won't.",
  "Show up for yourself the way no one else will.",
  "Choose the life you actually want.",
  "Real pleasure comes from mastery.",
  "Reclaim your focus. Reclaim your life.",
  "Your mind deserves respect. Give it.",
  "Every clean day rewires the brain.",
  "You are not missing out. You are leveling up.",
  "Strength is built in moments of temptation.",
  "Make the streak mean something.",
  "The hardest part is the next five minutes. Get through them.",
  "You've done it before. Do it again.",
  "Stay loyal to your goals.",
  "Discipline today. Freedom tomorrow.",
  "You are the architect of your own mind.",
  "Don't let a bad night ruin a good streak.",
  "Your story isn't over.",
  "Hold the line.",
  "Be somebody your past self would admire.",
  "The body follows the mind. Train both.",
  "Today is day one of the rest of your life.",
  "Reset is not an option. Rise is.",
  "Your best days are ahead.",
  "Keep the promise.",
  "It gets easier. Keep going.",
  "Every master was once a beginner who refused to quit.",
  "You are recharging your power.",
  "Choose yourself.",
  "The grind is silent. So is growth.",
  "Stay disciplined even when no one is watching."
];

function setQuote(text, author = "") {
  const box = document.getElementById("quoteBox");
  const quoteEl = document.getElementById("quoteText");
  const authorEl = document.getElementById("quoteAuthor");

  box.classList.add("fade");

  setTimeout(() => {
    quoteEl.textContent = text;
    authorEl.textContent = author ? "— " + author : "";
    box.classList.remove("fade");
  }, 300);
}

function loadQuote() {
  fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => {
      setQuote(data[0].q, data[0].a);
    })
    .catch(() => {
      const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(random);
    });
}
