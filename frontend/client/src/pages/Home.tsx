import { useEffect, useState } from "react";
import type { Song } from "../types/Song";
import {
  getCurrent,
  nextSong,
  previousSong,
  getQueue,
  getPlaylist,
  enqueueSong,
  reorderQueue,
  removeFromQueue,
} from "../api/playlistApi";

import PlayerControls from "../components/PlayerControls";
import QueueList from "../components/QueueList";
import SongList from "../components/SongList";
import RecentlyPlayed from "../components/RecentlyPlayed";

export default function Home() {
  const [current, setCurrent] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"queue" | "songs" | "recent">("queue");
  const [playerCollapsed, setPlayerCollapsed] = useState<boolean>(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async (): Promise<void> => {
    setLoading(true);
    try {
      const [song, q, allSongs] = await Promise.all([
        getCurrent(),
        getQueue(),
        getPlaylist(),
      ]);
      setCurrent(song);
      setQueue(q);
      setSongs(allSongs);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (): Promise<void> => {
    const song = await nextSong();
    setCurrent(song);
    const q = await getQueue();
    setQueue(q);
  };

  const handlePrevious = async (): Promise<void> => {
    const song = await previousSong();
    setCurrent(song);
    const q = await getQueue();
    setQueue(q);
  };

  const handleEnqueue = async (id: string, playNext = false): Promise<void> => {
    await enqueueSong(id, playNext);
    const q = await getQueue();
    setQueue(q);
  };

  const handleRemove = async (index: number): Promise<void> => {
    await removeFromQueue(index);
    const q = await getQueue();
    setQueue(q);
  };

  const handleReorder = async (from: number, to: number): Promise<void> => {
    await reorderQueue(from, to);
    const q = await getQueue();
    setQueue(q);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href="/login";
  };

  const tabs: { key: "queue" | "songs" | "recent"; label: string; icon: string; color: string }[] = [
    { key: "queue",  label: "Queue",          icon: "🎶", color: "#A78BFA" },
    { key: "songs",  label: "All Songs",       icon: "🎵", color: "#00FFD1" },
    { key: "recent", label: "Recently Played", icon: "🕘", color: "#FF6B6B" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.6;  transform: scale(1.5); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 18px rgba(0,255,209,0.2); }
          50%       { box-shadow: 0 0 40px rgba(0,255,209,0.5); }
        }
        @keyframes equalizer {
          0%, 100% { height: 6px; }
          50%       { height: 18px; }
        }

        .home-root {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          position: relative;
          overflow-x: hidden;
        }
        .dot-pulse { animation: pulse-dot var(--dur) var(--delay) ease-in-out infinite; }
        .page-in   { animation: slide-up 0.6s ease both; }
        .spinner   { animation: spin 0.8s linear infinite; }
        .glow-btn  { animation: glow 3s ease-in-out infinite; }

        .eq-bar {
          width: 3px;
          border-radius: 99px;
          background: #00FFD1;
          animation: equalizer var(--speed) var(--delay) ease-in-out infinite alternate;
        }

        .tab-btn {
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .section-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Collapsible player ── */
        .player-body {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease;
        }
        .player-body.expanded {
          max-height: 400px;
          opacity: 1;
        }
        .player-body.collapsed {
          max-height: 0;
          opacity: 0;
        }

        .collapse-btn {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          background: rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.18);
        }
        .collapse-chevron {
          display: inline-block;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .collapse-chevron.up   { transform: rotate(0deg); }
        .collapse-chevron.down { transform: rotate(180deg); }

        /* ── Logout button ── */
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          background: rgba(255,107,107,0.07);
          border: 1px solid rgba(255,107,107,0.18);
          color: #FF6B6B;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
        }
        .logout-btn:hover {
          background: rgba(255,107,107,0.14);
          border-color: rgba(255,107,107,0.35);
          color: #ff8a8a;
        }
        .logout-btn:active { transform: scale(0.96); }
      `}</style>

      <div className="home-root">

        {/* ── Background dots ── */}
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={i}
            className="dot-pulse"
            style={{
              position: "fixed",
              borderRadius: "50%",
              left: `${(i * 43 + 7) % 100}%`,
              top: `${(i * 61 + 11) % 100}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: i % 3 === 0 ? "#00FFD1" : i % 3 === 1 ? "#A78BFA" : "#FF6B6B",
              ["--dur" as string]: `${3 + (i % 4)}s`,
              ["--delay" as string]: `${(i * 0.4) % 4}s`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Sticky navbar ── */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
            background: "rgba(8,8,8,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "#00FFD1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              ▶
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: "#fff",
              }}
            >
              Rhythmix
            </span>
          </div>

          {/* Logout placeholder */}
          <button className="logout-btn" onClick={handleLogout}>
            <span style={{ fontSize: 15 }}>⎋</span>
            Log out
          </button>
        </nav>

        {/* ── Main content ── */}
        <div
          className="page-in"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "32px 20px 60px",
          }}
        >
          {/* ── Loading ── */}
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                gap: 16,
              }}
            >
              <div
                className="spinner"
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid rgba(0,255,209,0.15)",
                  borderTop: "3px solid #00FFD1",
                  borderRadius: "50%",
                }}
              />
              <span style={{ color: "#555", fontSize: 14 }}>Loading your playlist…</span>
            </div>
          ) : !current ? (
            /* ── Empty ── */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                gap: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 56 }}>🎧</div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  margin: 0,
                }}
              >
                No song playing
              </h2>
              <p style={{ color: "#555", fontSize: 15, maxWidth: 300 }}>
                Add songs to your queue to get started.
              </p>
            </div>
          ) : (
            /* ── Player layout ── */
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>

              {/* ── NOW PLAYING HERO (collapsible) ── */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,255,209,0.06) 0%, rgba(167,139,250,0.06) 100%)",
                  border: "1px solid rgba(0,255,209,0.15)",
                  borderRadius: 24,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Glow blob */}
                <div
                  style={{
                    position: "absolute",
                    top: -60,
                    right: -60,
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(0,255,209,0.07) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                {/* ── Always-visible header row ── */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                    gap: 12,
                  }}
                >
                  {/* Left: badge + song info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexShrink: 0,
                      minWidth: 0,
                    }}
                  >
                    {/* Now Playing pill */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        borderRadius: 99,
                        background: "rgba(0,255,209,0.08)",
                        border: "1px solid rgba(0,255,209,0.2)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#00FFD1",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase" as const,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#00FFD1",
                          display: "inline-block",
                        }}
                      />
                      Now Playing
                    </div>

                    {/* Song name + artist — always visible */}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 180,
                        }}
                      >
                        {current.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                        {current.artist}
                      </div>
                    </div>
                  </div>

                  {/* Centre: compact controls — only when collapsed */}
                  {playerCollapsed && (
                    <div style={{ flex: 1, minWidth: 0, padding: "0 16px" }}>
                      <PlayerControls
                        song={current}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        compact
                      />
                    </div>
                  )}

                  {/* Right: equalizer (expanded only) + collapse toggle */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexShrink: 0,
                    }}
                  >
                    {!playerCollapsed && (
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20 }}>
                        {[
                          { speed: "0.6s", delay: "0s"    },
                          { speed: "0.4s", delay: "0.1s"  },
                          { speed: "0.7s", delay: "0.05s" },
                          { speed: "0.5s", delay: "0.15s" },
                        ].map((b, i) => (
                          <div
                            key={i}
                            className="eq-bar"
                            style={{
                              ["--speed" as string]: b.speed,
                              ["--delay" as string]: b.delay,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      className="collapse-btn"
                      onClick={() => setPlayerCollapsed((c) => !c)}
                      title={playerCollapsed ? "Expand player" : "Collapse player"}
                    >
                      <span className={`collapse-chevron ${playerCollapsed ? "down" : "up"}`}>
                        ▲
                      </span>
                    </button>
                  </div>
                </div>

                {/* ── Collapsible body ── */}
                <div
                  className={`player-body ${playerCollapsed ? "collapsed" : "expanded"}`}
                >
                  <div style={{ padding: "0 24px 28px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                      }}
                    >
                      {/* Album art */}
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 18 }}
                      >
                        <div
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: 16,
                            background:
                              "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          🎵
                        </div>
                        <div>
                          <h2
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              fontWeight: 800,
                              fontSize: 22,
                              margin: "0 0 4px 0",
                              color: "#fff",
                            }}
                          >
                            {current.title}
                          </h2>
                          <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
                            {current.artist}
                          </p>
                        </div>
                      </div>

                      {/* Player controls */}
                      <PlayerControls
                        song={current}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── TABS ── */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className="tab-btn"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      background:
                        activeTab === tab.key
                          ? `${tab.color}18`
                          : "rgba(255,255,255,0.03)",
                      color: activeTab === tab.key ? tab.color : "#555",
                      borderColor:
                        activeTab === tab.key
                          ? `${tab.color}40`
                          : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                    {tab.key === "queue" && queue.length > 0 && (
                      <span
                        style={{
                          marginLeft: 4,
                          padding: "1px 7px",
                          borderRadius: 99,
                          fontSize: 11,
                          background: "#A78BFA22",
                          color: "#A78BFA",
                          fontWeight: 700,
                        }}
                      >
                        {queue.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── TAB PANELS ── */}
              <div className="section-card">
                {activeTab === "queue" && (
                  <>
                    <div className="section-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🎶</span>
                        <span
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#A78BFA",
                          }}
                        >
                          Up Next
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 99,
                          background: "rgba(167,139,250,0.1)",
                          color: "#A78BFA",
                          fontFamily: "monospace",
                        }}
                      >
                        FIFO · Queue
                      </span>
                    </div>
                    <div style={{ padding: "4px 0" }}>
                      <QueueList
                        queue={queue}
                        onRemove={handleRemove}
                        onReorder={handleReorder}
                      />
                    </div>
                  </>
                )}

                {activeTab === "songs" && (
                  <>
                    <div className="section-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🎵</span>
                        <span
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#00FFD1",
                          }}
                        >
                          All Songs
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 99,
                          background: "rgba(0,255,209,0.1)",
                          color: "#00FFD1",
                          fontFamily: "monospace",
                        }}
                      >
                        Linked List
                      </span>
                    </div>
                    <div style={{ padding: "4px 0" }}>
                      <SongList songs={songs} onEnqueue={handleEnqueue} />
                    </div>
                  </>
                )}

                {activeTab === "recent" && (
                  <>
                    <div className="section-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🕘</span>
                        <span
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#FF6B6B",
                          }}
                        >
                          Recently Played
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 99,
                          background: "rgba(255,107,107,0.1)",
                          color: "#FF6B6B",
                          fontFamily: "monospace",
                        }}
                      >
                        LIFO · Stack
                      </span>
                    </div>
                    <div style={{ padding: "4px 0" }}>
                      <RecentlyPlayed
                        limit={5}
                        refreshTrigger={current?._id}
                        onEnqueue={handleEnqueue}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* ── DSA legend ── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 20,
                  paddingTop: 8,
                }}
              >
                {[
                  { label: "Linked List",  color: "#00FFD1" },
                  { label: "Stack (LIFO)", color: "#FF6B6B" },
                  { label: "Queue (FIFO)", color: "#A78BFA" },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    style={{ fontSize: 11, color, opacity: 0.5, fontFamily: "monospace" }}
                  >
                    {label}
                  </span>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}