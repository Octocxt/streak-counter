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
});
