import { useState } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ email, password });

      setUser(res.data.user);
      setAccessToken(res.data.accessToken);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("accessToken", res.data.accessToken);

      setAuthToken(res.data.accessToken, setAccessToken);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err: unknown) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") handleLogin();
  };

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
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,209,0.25); }
          50%       { box-shadow: 0 0 44px rgba(0,255,209,0.55); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-card  { animation: slide-up 0.7s ease both; }
        .glow-btn    { animation: glow 3s ease-in-out infinite; }
        .dot-pulse   { animation: pulse-dot var(--dur) var(--delay) ease-in-out infinite; }
        .spinner     { animation: spin 0.8s linear infinite; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 13px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: #444; }
        .input-field:focus {
          border-color: rgba(0,255,209,0.45);
          background: rgba(0,255,209,0.03);
        }
      `}</style>

      {/* Full-page container */}
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
          className="login-card"
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
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
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

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "#fff",
              margin: "0 0 6px 0",
              lineHeight: 1.2,
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "#555", fontSize: 14, margin: "0 0 28px 0" }}>
            Log in to your account to continue listening.
          </p>

          {/* Error banner */}
          {error && (
            <div
              style={{
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.25)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#FF6B6B",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#666",
                  marginBottom: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#666",
                  marginBottom: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={loading ? undefined : "glow-btn"}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 12,
              background: loading ? "rgba(0,255,209,0.4)" : "#00FFD1",
              color: "#000",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "'Syne', sans-serif",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <>
                <div
                  className="spinner"
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(0,0,0,0.2)",
                    borderTop: "2px solid #000",
                    borderRadius: "50%",
                  }}
                />
                Logging in…
              </>
            ) : (
              "Log in →"
            )}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "24px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ color: "#444", fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", color: "#555", fontSize: 14, margin: 0 }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#00FFD1",
                fontWeight: 600,
                textDecoration: "none",
              }}
              onMouseEnter={(e: { target: HTMLAnchorElement; }) =>
                ((e.target as HTMLAnchorElement).style.textDecoration = "underline")
              }
              onMouseLeave={(e: { target: HTMLAnchorElement; }) =>
                ((e.target as HTMLAnchorElement).style.textDecoration = "none")
              }
            >
              Register
            </Link>
          </p>

          {/* DSA badge */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "center",
              gap: 16,
            }}
          >
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