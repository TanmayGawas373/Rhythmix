export default function CheckEmail() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.7;  transform: scale(1.6); }
        }
        @keyframes icon-pop {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }

        .check-email-card { animation: slide-up 0.7s ease both; }
        .dot-pulse        { animation: pulse-dot var(--dur) var(--delay) ease-in-out infinite; }
        .icon-pop         { animation: icon-pop 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#080808",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background dots ── */}
        {Array.from({ length: 22 }, (_, i) => (
          <div
            key={i}
            className="dot-pulse"
            style={{
              position: "absolute",
              borderRadius: "50%",
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background:
                i % 3 === 0 ? "#00FFD1" : i % 3 === 1 ? "#A78BFA" : "#FF6B6B",
              ["--dur" as string]: `${3 + (i % 4)}s`,
              ["--delay" as string]: `${(i * 0.4) % 4}s`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,209,0.045) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Card ── */}
        <div
          className="check-email-card"
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 420,
            margin: "0 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "40px 36px",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#00FFD1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              ▶
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#fff",
              }}
            >
              Rhythmix
            </span>
          </div>

          {/* Icon */}
          <div
            className="icon-pop"
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(0,255,209,0.07)",
              border: "1px solid rgba(0,255,209,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              margin: "0 auto 24px",
            }}
          >
            📩
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "#fff",
              margin: "0 0 10px 0",
              lineHeight: 1.2,
            }}
          >
            Check your email
          </h1>
          <p style={{ color: "#555", fontSize: 14, margin: "0 0 28px 0", lineHeight: 1.6 }}>
            We've sent a verification link to your email.
            <br />
            Click the link to activate your account.
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />

          {/* DSA badge */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {[
              { label: "Linked List", color: "#00FFD1" },
              { label: "Stack",       color: "#FF6B6B" },
              { label: "Queue",       color: "#A78BFA" },
            ].map(({ label, color }) => (
              <span key={label} style={{ fontSize: 11, color, opacity: 0.6 }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
