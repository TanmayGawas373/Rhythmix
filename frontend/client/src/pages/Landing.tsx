// PlaylistApp Landing Page — React + Tailwind CSS + TypeScript
// DSA Project: Linked Lists (playlist nav), Stacks (recently played), Queues (playlist queue)

import { useState, useRef} from "react";
import type { MouseEvent, FC } from "react";
// ─── Types ────────────────────────────────────────────────────────────────────

interface Song {
  title: string;
  artist: string;
  dur: string;
}

interface SongWithId extends Song {
  id: number;
}

interface Feature {
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  tag: string;
}

interface DsaBlock {
  label: string;
  code: string;
  color: string;
}

interface AdminOp {
  op: string;
  icon: string;
  color: string;
}

interface TechItem {
  name: string;
  color: string;
  icon: string;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  dur: number;
}

interface FlowItem {
  title: string;
  color: string;
  flow: string[];
  icon: string;
}

interface CodeBlockProps {
  code: string;
  color: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS: string[] = ["Features", "DSA Concepts", "Tech Stack", "Admin Panel"];

const FEATURES: Feature[] = [
  {
    icon: "⛓️",
    title: "Linked List Navigation",
    subtitle: "DSA: Doubly Linked List",
    desc: "Every song is a node. Traverse your playlist forward and backward seamlessly — prev/next pointers keep your listening fluid and stateful.",
    color: "#00FFD1",
    tag: "O(1) prev/next",
  },
  {
    icon: "🥞",
    title: "Recently Played Stack",
    subtitle: "DSA: Stack (LIFO)",
    desc: "Your history lives in a stack. The last track you played is always on top — push on play, pop to revisit. Pure LIFO in action.",
    color: "#FF6B6B",
    tag: "LIFO · Push/Pop",
  },
  {
    icon: "🎶",
    title: "Playlist Queue",
    subtitle: "DSA: Queue (FIFO)",
    desc: "Add songs to your queue and they play in order — first in, first out. Enqueue your next vibe, dequeue when it plays.",
    color: "#A78BFA",
    tag: "FIFO · Enqueue/Dequeue",
  },
  {
    icon: "🔐",
    title: "Admin Panel",
    subtitle: "Full CRUD Control",
    desc: "Superuser dashboard to manage songs, users, and playlists. Add, edit, delete, and search across the entire catalogue.",
    color: "#FBBF24",
    tag: "Songs · Users · Playlists",
  },
];

const DSA_BLOCKS: DsaBlock[] = [
  {
    label: "Linked List",
    code: `class Node {\n  song: Song;\n  prev: Node | null;\n  next: Node | null;\n}\n\nclass DoublyLinkedList {\n  head: Node;\n  tail: Node;\n  current: Node;\n\n  playNext() { this.current = this.current.next!; }\n  playPrev() { this.current = this.current.prev!; }\n}`,
    color: "#00FFD1",
  },
  {
    label: "Stack",
    code: `class RecentStack {\n  private stack: Song[] = [];\n\n  push(song: Song): void {\n    this.stack.push(song);\n  }\n\n  pop(): Song | undefined {\n    return this.stack.pop();\n  }\n\n  peek(): Song {\n    return this.stack[this.stack.length - 1];\n  }\n}`,
    color: "#FF6B6B",
  },
  {
    label: "Queue",
    code: `class PlaylistQueue {\n  private queue: Song[] = [];\n\n  enqueue(song: Song): void {\n    this.queue.push(song);\n  }\n\n  dequeue(): Song | undefined {\n    return this.queue.shift();\n  }\n\n  peek(): Song {\n    return this.queue[0];\n  }\n}`,
    color: "#A78BFA",
  },
];

const ADMIN_OPS: AdminOp[] = [
  { op: "Add Song",       icon: "➕", color: "#00FFD1" },
  { op: "Edit Song",      icon: "✏️", color: "#FBBF24" },
  { op: "Delete Song",    icon: "🗑️", color: "#FF6B6B" },
  { op: "Manage Users",   icon: "👥", color: "#A78BFA" },
  { op: "View Playlists", icon: "📋", color: "#34D399" },
  { op: "Analytics",      icon: "📊", color: "#60A5FA" },
];

const TECH: TechItem[] = [
  { name: "React",        color: "#61DAFB", icon: "⚛️" },
  { name: "TypeScript",   color: "#3178C6", icon: "🟦" },
  { name: "Tailwind CSS", color: "#38BDF8", icon: "🌊" },
  { name: "Node.js",      color: "#68A063", icon: "🟢" },
  { name: "Express",      color: "#FFFFFF", icon: "🚂" },
  { name: "MongoDB",      color: "#47A248", icon: "🍃" },
];

const MOCK_SONGS: Song[] = [
  { title: "Blinding Lights", artist: "The Weeknd",    dur: "3:20" },
  { title: "As It Was",       artist: "Harry Styles",  dur: "2:47" },
  { title: "Anti-Hero",       artist: "Taylor Swift",  dur: "3:20" },
  { title: "Flowers",         artist: "Miley Cyrus",   dur: "3:21" },
];

const FLOW_ITEMS: FlowItem[] = [
  {
    title: "Linked List",
    color: "#00FFD1",
    flow: ["HEAD → Node A", "← prev | next →", "Node B", "← prev | next →", "Node C ← TAIL"],
    icon: "⛓️",
  },
  {
    title: "Stack (LIFO)",
    color: "#FF6B6B",
    flow: ["TOP → Anti-Hero", "As It Was", "Blinding Lights", "↑ push / pop ↑"],
    icon: "🥞",
  },
  {
    title: "Queue (FIFO)",
    color: "#A78BFA",
    flow: ["FRONT → Flowers", "Anti-Hero", "As It Was", "← enqueue | dequeue →"],
    icon: "🎶",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const NowPlayingWidget: FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [progress] = useState<number>(32);

  const prev = (): void => setCurrent((c) => (c - 1 + MOCK_SONGS.length) % MOCK_SONGS.length);
  const next = (): void => setCurrent((c) => (c + 1) % MOCK_SONGS.length);

  return (
    <div
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
      className="rounded-2xl p-5 w-full max-w-xs mx-auto backdrop-blur-sm"
    >
      <div
        className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-5xl"
        style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" }}
      >
        🎵
      </div>

      <div className="mb-3">
        <div className="text-white font-bold text-base truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
          {MOCK_SONGS[current].title}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "#888" }}>
          {MOCK_SONGS[current].artist}
        </div>
      </div>

      <div className="w-full h-1 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-1 rounded-full transition-all"
          style={{ width: `${progress}%`, background: "#00FFD1" }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prev} className="text-white/60 hover:text-white transition text-lg">⏮</button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-base transition-transform hover:scale-110"
          style={{ background: "#00FFD1" }}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={next} className="text-white/60 hover:text-white transition text-lg">⏭</button>
      </div>

      <div className="mt-3 text-xs text-center" style={{ color: "#555" }}>
        ← Doubly Linked List Navigation →
      </div>
    </div>
  );
};

const CodeBlock: FC<CodeBlockProps> = ({ code, color }) => (
  <pre
    className="text-xs leading-relaxed overflow-x-auto p-4 rounded-xl"
    style={{
      background: "rgba(0,0,0,0.5)",
      border: `1px solid ${color}33`,
      color: "#ccc",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      maxHeight: 220,
    }}
  >
    {code}
  </pre>
);

const AdminMock: FC = () => {
  const [songs, setSongs] = useState<SongWithId[]>(
    MOCK_SONGS.map((s, i) => ({ ...s, id: i }))
  );
  const [adding, setAdding] = useState<boolean>(false);
  const [newSong, setNewSong] = useState<Pick<Song, "title" | "artist">>({ title: "", artist: "" });

  const deleteSong = (id: number): void =>
    setSongs((s) => s.filter((x) => x.id !== id));

  const addSong = (): void => {
    if (!newSong.title) return;
    setSongs((s) => [...s, { ...newSong, dur: "3:00", id: Date.now() }]);
    setNewSong({ title: "", artist: "" });
    setAdding(false);
  };

  return (
    <div
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      className="rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(251,191,36,0.07)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "#FBBF24", fontFamily: "'Syne',sans-serif" }}
        >
          ⚡ Admin · Song Manager
        </span>
        <button
          onClick={() => setAdding((a) => !a)}
          className="text-xs px-3 py-1 rounded-lg font-semibold transition"
          style={{ background: "#FBBF24", color: "#000" }}
        >
          + Add
        </button>
      </div>

      {adding && (
        <div
          className="flex gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <input
            value={newSong.title}
            onChange={(e) => setNewSong((n) => ({ ...n, title: e.target.value }))}
            placeholder="Song title"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
          />
          <input
            value={newSong.artist}
            onChange={(e) => setNewSong((n) => ({ ...n, artist: e.target.value }))}
            placeholder="Artist"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
          />
          <button
            onClick={addSong}
            className="text-xs px-3 py-1.5 rounded-lg font-bold"
            style={{ background: "#00FFD1", color: "#000" }}
          >
            ✓
          </button>
        </div>
      )}

      <div>
        {songs.map((song, i) => (
          <div
            key={song.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-white/0.02 transition group"
            style={{ borderBottom: i < songs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1" }}
              >
                ♪
              </div>
              <div>
                <div className="text-white text-sm font-medium">{song.title}</div>
                <div className="text-xs" style={{ color: "#666" }}>
                  {song.artist} · {song.dur}
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                className="text-xs px-2 py-1 rounded"
                style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteSong(song.id)}
                className="text-xs px-2 py-1 rounded"
                style={{ background: "rgba(255,107,107,0.15)", color: "#FF6B6B" }}
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Landing: FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeCode, setActiveCode] = useState<number>(0);
  const heroRef = useRef<HTMLElement>(null);

  const dots: Dot[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    dur: 3 + Math.random() * 4,
  }));

  const handleNavHover = (e: MouseEvent<HTMLAnchorElement>, enter: boolean): void => {
    (e.target as HTMLAnchorElement).style.color = enter ? "#fff" : "#888";
  };

  const handleBorderHover = (
    e: MouseEvent<HTMLAnchorElement>,
    enter: boolean,
    enterColor: string,
    leaveColor: string
  ): void => {
    (e.target as HTMLAnchorElement).style.borderColor = enter ? enterColor : leaveColor;
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "#080808", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Google Fonts + Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.5); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,209,0.2); }
          50%       { box-shadow: 0 0 50px rgba(0,255,209,0.5); }
        }

        .hero-title   { animation: slide-up 0.9s ease both; }
        .hero-sub     { animation: slide-up 0.9s 0.15s ease both; }
        .hero-cta     { animation: slide-up 0.9s 0.3s  ease both; }
        .hero-widget  { animation: slide-up 0.9s 0.45s ease both; }
        .float-widget { animation: float 5s ease-in-out infinite; }
        .glow-btn     { animation: glow  3s ease-in-out infinite; }
        .dot-pulse    { animation: pulse-dot var(--dur) var(--delay) ease-in-out infinite; }

        ::-webkit-scrollbar       { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: "rgba(8,8,8,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-sm"
            style={{ background: "#00FFD1" }}
          >
            ▶
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Rhythmix
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm transition"
              style={{ color: "#888" }}
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:block text-sm px-4 py-2 rounded-lg transition"
            style={{ color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) => {
              const el = e.target as HTMLAnchorElement;
              el.style.color = "#fff";
              el.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.target as HTMLAnchorElement;
              el.style.color = "#aaa";
              el.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            Log in
          </a>
          <a
            href="/register"
            className="text-sm px-4 py-2 rounded-lg font-semibold text-black transition hover:opacity-90"
            style={{ background: "#00FFD1" }}
          >
            Register
          </a>
          <button
            onClick={() => setMenuOpen((m) => !m)}
            className="md:hidden text-white/60 text-xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 text-2xl"
          style={{ background: "rgba(8,8,8,0.97)" }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-6 text-white/40 text-3xl"
          >
            ✕
          </button>
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className="font-bold"
              style={{ fontFamily: "'Syne',sans-serif", color: "#fff" }}
            >
              {link}
            </a>
          ))}
          <a href="/login" className="text-lg" style={{ color: "#888" }}>Log in</a>
          <a
            href="/register"
            className="text-lg px-6 py-3 rounded-xl font-bold text-black"
            style={{ background: "#00FFD1" }}
          >
            Register
          </a>
        </div>
      )}

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {dots.map((d) => (
            <div
              key={d.id}
              className="absolute rounded-full dot-pulse"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.size,
                height: d.size,
                background:
                  d.id % 3 === 0 ? "#00FFD1" : d.id % 3 === 1 ? "#A78BFA" : "#FF6B6B",
                ["--dur" as string]: `${d.dur}s`,
                ["--delay" as string]: `${d.delay}s`,
              }}
            />
          ))}
          {/* Grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,255,209,0.05) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-2 gap-12 items-center py-20">
          {/* Left copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6 hero-title"
              style={{
                background: "rgba(0,255,209,0.08)",
                border: "1px solid rgba(0,255,209,0.2)",
                color: "#00FFD1",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              DSA Project
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 hero-title"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Music that
              <br />
              <span style={{ color: "#00FFD1" }}>thinks</span> in
              <br />
              data structures.
            </h1>

            <p className="text-base md:text-lg mb-8 leading-relaxed hero-sub" style={{ color: "#888", maxWidth: 460 }}>
              Rhythmix is a full-stack music app powered by{" "}
              <span style={{ color: "#00FFD1" }}>Doubly Linked Lists</span>,{" "}
              <span style={{ color: "#FF6B6B" }}>Stacks</span>, and{" "}
              <span style={{ color: "#A78BFA" }}>Queues</span> — bringing computer science to
              life through music.
            </p>

            <div className="flex flex-wrap gap-3 hero-cta">
              <a
                href="/register"
                className="px-6 py-3 rounded-xl font-semibold text-black text-sm transition hover:opacity-90 glow-btn"
                style={{ background: "#00FFD1" }}
              >
                Get Started →
              </a>
              <a
                href="#dsa-concepts"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition"
                style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
                onMouseEnter={(e) =>
                  handleBorderHover(e, true, "rgba(255,255,255,0.3)", "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  handleBorderHover(e, false, "rgba(255,255,255,0.3)", "rgba(255,255,255,0.12)")
                }
              >
                Explore DSA
              </a>
            </div>

            {/* Stats */}
            <div
              className="flex gap-8 mt-10 pt-8 hero-cta"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {(
                [
                  ["3",    "DSA Structures"],
                  ["CRUD", "Admin Panel"],
                  ["Full", "Stack App"],
                ] as [string, string][]
              ).map(([val, label]) => (
                <div key={label}>
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: "'Syne',sans-serif", color: "#fff" }}
                  >
                    {val}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#555" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Now Playing */}
          <div className="flex justify-center hero-widget float-widget">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,255,209,0.08) 0%, transparent 70%)" }}
              />
              <NowPlayingWidget />
              <div
                className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "#FF6B6B", color: "#fff" }}
              >
                Stack ↑
              </div>
              <div
                className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "#A78BFA", color: "#fff" }}
              >
                Queue →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#555" }}>
            Core Features
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "'Syne',sans-serif" }}>
            Built on real algorithms
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl group transition-transform hover:-translate-y-1 cursor-default"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.border = `1px solid ${f.color}33`)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.06)")
              }
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `${f.color}11` }}
              >
                {f.icon}
              </div>
              <div className="text-xs font-semibold mb-1" style={{ color: f.color }}>
                {f.subtitle}
              </div>
              <h3 className="text-lg font-bold mb-2 text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#666" }}>
                {f.desc}
              </p>
              <span
                className="text-xs px-2 py-1 rounded-md font-mono"
                style={{ background: `${f.color}11`, color: f.color }}
              >
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DSA CONCEPTS ── */}
      <section id="dsa-concepts" className="py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#555" }}>
              Under the Hood
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "'Syne',sans-serif" }}>
              The DSA powering it all
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {DSA_BLOCKS.map((b, i) => (
              <button
                key={b.label}
                onClick={() => setActiveCode(i)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition"
                style={{
                  background: activeCode === i ? b.color : "rgba(255,255,255,0.05)",
                  color: activeCode === i ? "#000" : "#888",
                  border: activeCode === i ? "none" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <CodeBlock code={DSA_BLOCKS[activeCode].code} color={DSA_BLOCKS[activeCode].color} />
          </div>

          {/* Visual flow diagrams */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {FLOW_ITEMS.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${item.color}22` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span>{item.icon}</span>
                  <span
                    className="font-bold text-sm"
                    style={{ color: item.color, fontFamily: "'Syne',sans-serif" }}
                  >
                    {item.title}
                  </span>
                </div>
                <div className="space-y-2">
                  {item.flow.map((line, i) => (
                    <div
                      key={i}
                      className="text-xs px-3 py-2 rounded-lg font-mono text-center"
                      style={{
                        background: `${item.color}08`,
                        color: "#aaa",
                        border: `1px solid ${item.color}15`,
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADMIN PANEL ── */}
      <section id="admin-panel" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "#FBBF24" }}
            >
              Admin Panel
            </div>
            <h2
              className="text-4xl md:text-5xl font-extrabold mb-5"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              Full CRUD control
              <br />
              at your fingertips
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#666" }}>
              Superusers get access to a full admin dashboard — manage songs, users, and playlists
              with real-time operations backed by robust data structures.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ADMIN_OPS.map((op) => (
                <div
                  key={op.op}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{ background: `${op.color}11` }}
                  >
                    {op.icon}
                  </div>
                  <span className="text-sm font-medium text-white/80">{op.op}</span>
                </div>
              ))}
            </div>
          </div>
          <AdminMock />
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section id="tech-stack" className="py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#555" }}>
              Tech Stack
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "'Syne',sans-serif" }}>
              Modern. Fast. Typed.
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {TECH.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl transition hover:scale-105"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-xl">{t.icon}</span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: t.color, fontFamily: "'Syne',sans-serif" }}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div
          className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,209,0.07) 0%, rgba(167,139,250,0.07) 100%)",
            border: "1px solid rgba(0,255,209,0.15)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,255,209,0.05) 0%, transparent 60%)" }}
          />
          <h2
            className="relative text-4xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: "'Syne',sans-serif" }}
          >
            Ready to play?
          </h2>
          <p className="relative text-base mb-8 max-w-md mx-auto" style={{ color: "#777" }}>
            Create your account and experience data structures through music.
          </p>
          <div className="relative flex flex-wrap gap-3 justify-center">
            <a
              href="/register"
              className="px-8 py-3 rounded-xl font-bold text-black transition hover:opacity-90 glow-btn"
              style={{ background: "#00FFD1" }}
            >
              Create Free Account
            </a>
            <a
              href="/login"
              className="px-8 py-3 rounded-xl font-semibold transition"
              style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.3)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)")
              }
            >
              Log in
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER / CREATOR PROFILE ── */}
      <footer className="py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-bold text-xs"
                  style={{ background: "#00FFD1" }}
                >
                  ▶
                </div>
                <span className="font-bold" style={{ fontFamily: "'Syne',sans-serif" }}>Rhythmix</span>
              </div>
              <p className="text-sm" style={{ color: "#555" }}>
                A DSA-powered music app built with linked lists, stacks, and queues.
              </p>
            </div>

            <div>
              <div
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#555" }}
              >
                Quick Links
              </div>
              <div className="space-y-2">
                {(
                  [
                    ["Login",       "/login"],
                    ["Register",    "/register"],
                    ["Admin Panel", "/admin"],
                  ] as [string, string][]
                ).map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="block text-sm transition"
                    style={{ color: "#666" }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#fff")}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#666")}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#555" }}
              >
                DSA Structures
              </div>
              <div className="space-y-2">
                {["Doubly Linked List", "Stack (LIFO)", "Queue (FIFO)", "CRUD Operations"].map(
                  (item) => (
                    <div key={item} className="text-sm" style={{ color: "#666" }}>
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ── CREATOR CARD — fill in your details below ── */}
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* ← Replace this div with:
                <img src="/your-photo.jpg" alt="Your Name"
                     className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                     style={{ border: "2px solid rgba(0,255,209,0.3)" }} />
            */}
            <div
              className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl font-bold overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
                border: "2px dashed rgba(0,255,209,0.3)",
                color: "#00FFD1",
              }}
            >
              📷
            </div>

            <div className="text-center sm:text-left">
              {/* ← Replace with your name */}
              <div
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "'Syne',sans-serif", color: "#fff" }}
              >
                Your Name Here
              </div>
              {/* ← Replace with your role/course */}
              <div className="text-sm mb-2" style={{ color: "#00FFD1" }}>
                CS Student · 3rd Semester · DSA Project
              </div>
              {/* ← Replace with your bio */}
              <p className="text-sm max-w-md" style={{ color: "#666" }}>
                Built Rhythmix as part of the Data Structures &amp; Algorithms course —
                implementing doubly linked lists, stacks, and queues in a real-world full-stack app.
              </p>
              <div className="flex gap-3 mt-3 justify-center sm:justify-start">
                <a
                  href="#"
                  className="text-xs px-3 py-1.5 rounded-lg transition"
                  style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", border: "1px solid rgba(0,255,209,0.2)" }}
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="text-xs px-3 py-1.5 rounded-lg transition"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  LinkedIn
                </a>
                <a
                  href="#"
                  className="text-xs px-3 py-1.5 rounded-lg transition"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Portfolio
                </a>
              </div>
            </div>
          </div>

          <div
            className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="text-xs" style={{ color: "#444" }}>
              © 2024 Rhythmix · DSA Semester Project
            </div>
            <div className="text-xs flex gap-2" style={{ color: "#444" }}>
              <span style={{ color: "#00FFD1" }}>Linked List</span> ·
              <span style={{ color: "#FF6B6B" }}>Stack</span> ·
              <span style={{ color: "#A78BFA" }}>Queue</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
