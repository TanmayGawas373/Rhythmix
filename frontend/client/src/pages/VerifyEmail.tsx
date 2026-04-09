import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/authApi";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmail(token);

        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");

        // redirect after 2 sec
        setTimeout(() => navigate("/login"), 2000);
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed or expired."
        );
      }
    };

    if (token) verify();
  }, [token, navigate]);

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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes icon-pop {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }

        .ve-card     { animation: slide-up 0.7s ease both; }
        .dot-pulse   { animation: pulse-dot var(--dur) var(--delay) ease-in-out infinite; }
        .spinner     { animation: spin 0.8s linear infinite; }
        .icon-pop    { animation: icon-pop 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
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

        {/* Radial glow — color shifts by status */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              status === "error"
                ? "radial-gradient(circle, rgba(255,107,107,0.045) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(0,255,209,0.045) 0%, transparent 70%)",
            pointerEvents: "none",
            transition: "background 0.6s ease",
          }}
        />

        {/* ── Card ── */}
        <div
          className="ve-card"
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
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

          {/* ── Loading state ── */}
          {status === "loading" && (
            <>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "rgba(0,255,209,0.07)",
                  border: "1px solid rgba(0,255,209,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <div
                  className="spinner"
                  style={{
                    width: 24,
                    height: 24,
                    border: "2px solid rgba(0,255,209,0.15)",
                    borderTop: "2px solid #00FFD1",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 26,
                  color: "#fff",
                  margin: "0 0 10px",
                }}
              >
                Verifying…
              </h2>
              <p style={{ color: "#555", fontSize: 14, margin: 0 }}>
                Hang tight while we confirm your email.
              </p>
            </>
          )}

          {/* ── Success state ── */}
          {status === "success" && (
            <>
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
                ✅
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 26,
                  color: "#00FFD1",
                  margin: "0 0 10px",
                }}
              >
                Verified!
              </h2>
              <p style={{ color: "#888", fontSize: 14, margin: "0 0 6px" }}>
                {message}
              </p>
              <p style={{ color: "#444", fontSize: 13, margin: 0 }}>
                Redirecting you to login…
              </p>
            </>
          )}

          {/* ── Error state ── */}
          {status === "error" && (
            <>
              <div
                className="icon-pop"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "rgba(255,107,107,0.07)",
                  border: "1px solid rgba(255,107,107,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  margin: "0 auto 24px",
                }}
              >
                ❌
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 26,
                  color: "#FF6B6B",
                  margin: "0 0 10px",
                }}
              >
                Failed
              </h2>
              <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
                {message}
              </p>
            </>
          )}

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              margin: "28px 0 20px",
            }}
          />

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