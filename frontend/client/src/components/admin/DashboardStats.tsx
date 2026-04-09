import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, songs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getDashboardStats();
      setStats(res);
    };
    fetchStats();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
      }}
    >
      {/* Total Users */}
      <div
        style={{
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,107,107,0.18)",
          borderRadius: 16,
          padding: "18px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "#FF6B6B",
            opacity: 0.6,
            borderRadius: "16px 16px 0 0",
          }}
        />
        <div
          style={{
            width: 32, height: 32,
            borderRadius: 9,
            background: "rgba(255,107,107,0.07)",
            border: "1px solid rgba(255,107,107,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
            marginBottom: 14,
          }}
        >
          👥
        </div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 26,
            lineHeight: 1,
            color: "#fff",
            marginBottom: 4,
          }}
        >
          {stats.users}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Total Users
        </div>
      </div>

      {/* Total Songs */}
      <div
        style={{
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(0,255,209,0.18)",
          borderRadius: 16,
          padding: "18px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "#00FFD1",
            opacity: 0.6,
            borderRadius: "16px 16px 0 0",
          }}
        />
        <div
          style={{
            width: 32, height: 32,
            borderRadius: 9,
            background: "rgba(0,255,209,0.07)",
            border: "1px solid rgba(0,255,209,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
            marginBottom: 14,
          }}
        >
          🎵
        </div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 26,
            lineHeight: 1,
            color: "#fff",
            marginBottom: 4,
          }}
        >
          {stats.songs}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Total Songs
        </div>
      </div>
    </div>
  );
}