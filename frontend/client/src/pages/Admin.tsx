import { useState } from "react";
import DashboardStats from "../components/admin/DashboardStats";
import UsersTable from "../components/admin/UsersTable";
import SongUpload from "../components/admin/SongUpload";
import SongsTable from "../components/admin/SongsTable";

type AdminTab = "overview" | "songs" | "upload" | "users";

interface Tab {
  key: AdminTab;
  label: string;
  icon: string;
  color: string;
}

const TABS: Tab[] = [
  { key: "overview", label: "Overview",    icon: "📊", color: "#00FFD1" },
  { key: "songs",    label: "Songs",       icon: "🎵", color: "#A78BFA" },
  { key: "upload",   label: "Upload Song", icon: "⬆️", color: "#FBBF24" },
  { key: "users",    label: "Users",       icon: "👥", color: "#FF6B6B" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const handleLogout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href="/login";
  };

  // const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .admin-root {
          min-height: 100vh;
          background: #080808;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          position: relative;
          overflow-x: hidden;
        }

        .dot-pulse { animation: pulse-dot var(--dur) var(--delay) ease-in-out infinite; }
        .page-in   { animation: slide-up 0.5s ease both; }
        .tab-panel { animation: fade-in 0.3s ease both; }

        .admin-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }

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
          padding: 16px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="admin-root">

        {/* ── Background dots ── */}
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="dot-pulse"
            style={{
              position: "fixed",
              borderRadius: "50%",
              left: `${(i * 47 + 5) % 100}%`,
              top: `${(i * 59 + 9) % 100}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: i % 3 === 0 ? "#00FFD1" : i % 3 === 1 ? "#A78BFA" : "#FBBF24",
              ["--dur" as string]: `${3 + (i % 4)}s`,
              ["--delay" as string]: `${(i * 0.45) % 4}s`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* Grid */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)",
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
            padding: "12px 28px",
            background: "rgba(8,8,8,0.88)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo + admin badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 99,
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.25)",
                color: "#FBBF24",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              Admin
            </div>
          </div>

          {/* Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            <span style={{ fontSize: 15 }}>⎋</span>
            Log out
          </button>
        </nav>

        {/* ── Main ── */}
        <div
          className="page-in"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "32px 24px 72px",
          }}
        >
          {/* ── Page heading ── */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#FBBF24",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 6,
              }}
            >
              ⚡ Admin Panel
            </div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 32,
                margin: 0,
                color: "#fff",
              }}
            >
              Dashboard
            </h1>
            <p style={{ color: "#555", fontSize: 14, marginTop: 6, marginBottom: 0 }}>
              Manage songs, users, and platform data.
            </p>
          </div>

          {/* ── Tab bar ── */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  className="admin-tab"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    background: active ? `${tab.color}14` : "rgba(255,255,255,0.03)",
                    color: active ? tab.color : "#555",
                    borderColor: active ? `${tab.color}38` : "rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#555";
                    }
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab panels ── */}
          <div key={activeTab} className="tab-panel">

            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="section-card">
                  <div className="section-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>📊</span>
                      <span
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#00FFD1",
                        }}
                      >
                        Platform Stats
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 99,
                        background: "rgba(0,255,209,0.08)",
                        color: "#00FFD1",
                        fontFamily: "monospace",
                      }}
                    >
                      Live
                    </span>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <DashboardStats />
                  </div>
                </div>
              </div>
            )}

            {/* ── Songs ── */}
            {activeTab === "songs" && (
              <div className="section-card">
                <div className="section-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎵</span>
                    <span
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#A78BFA",
                      }}
                    >
                      Song Catalogue
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
                    CRUD
                  </span>
                </div>
                <div style={{ padding: "4px 0" }}>
                  <SongsTable />
                </div>
              </div>
            )}

            {/* ── Upload ── */}
            {activeTab === "upload" && (
              <div className="section-card">
                <div className="section-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>⬆️</span>
                    <span
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#FBBF24",
                      }}
                    >
                      Upload New Song
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 99,
                      background: "rgba(251,191,36,0.1)",
                      color: "#FBBF24",
                      fontFamily: "monospace",
                    }}
                  >
                    Create
                  </span>
                </div>
                <div style={{ padding: "24px" }}>
                  <SongUpload />
                </div>
              </div>
            )}

            {/* ── Users ── */}
            {activeTab === "users" && (
              <div className="section-card">
                <div className="section-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>👥</span>
                    <span
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#FF6B6B",
                      }}
                    >
                      User Management
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
                    CRUD
                  </span>
                </div>
                <div style={{ padding: "4px 0" }}>
                  <UsersTable />
                </div>
              </div>
            )}

          </div>

          {/* ── DSA legend ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              paddingTop: 40,
            }}
          >
            {[
              { label: "Linked List",  color: "#00FFD1" },
              { label: "Stack (LIFO)", color: "#FF6B6B" },
              { label: "Queue (FIFO)", color: "#A78BFA" },
            ].map(({ label, color }) => (
              <span
                key={label}
                style={{ fontSize: 11, color, opacity: 0.4, fontFamily: "monospace" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}