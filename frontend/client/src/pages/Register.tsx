import { useState } from "react";
import { registerUser } from "../api/authApi";
// import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState("");

  // const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
setSuccess("Check your email to verify your account");
      navigate("/check-email");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const fields: {
    key: keyof RegisterForm;
    label: string;
    type: string;
    placeholder: string;
  }[] = [
    { key: "name",     label: "Full Name", type: "text",     placeholder: "John Doe"          },
    { key: "email",    label: "Email",     type: "email",    placeholder: "you@example.com"   },
    { key: "password", label: "Password",  type: "password", placeholder: "••••••••"          },
  ];

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

        .register-card { animation: slide-up 0.7s ease both; }
        .glow-btn      { animation: glow 3s ease-in-out infinite; }
        .dot-pulse     { animation: pulse-dot var(--dur) var(--delay) ease-in-out infinite; }
        .spinner       { animation: spin 0.8s linear infinite; }

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

        .strength-bar {
          height: 3px;
          border-radius: 99px;
          transition: width 0.3s, background 0.3s;
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
              left: `${(i * 41 + 9) % 100}%`,
              top: `${(i * 57 + 13) % 100}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background:
                i % 3 === 0 ? "#00FFD1" : i % 3 === 1 ? "#A78BFA" : "#FF6B6B",
              ["--dur" as string]: `${3 + (i % 4)}s`,
              ["--delay" as string]: `${(i * 0.35) % 4}s`,
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
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Card ── */}
        <div
          className="register-card"
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 420,
            margin: "24px 16px",
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
            Create account
          </h1>
          <p style={{ color: "#555", fontSize: 14, margin: "0 0 28px 0" }}>
            Join Rhythmix and experience DSA through music.
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

          {success && (
  <div style={{
    background: "rgba(0,255,209,0.1)",
    border: "1px solid rgba(0,255,209,0.3)",
    color: "#00FFD1",
    padding: "10px 14px",
    borderRadius: 10,
    marginBottom: 20
  }}>
    {success}
  </div>
)}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              {fields.map(({ key, label, type, placeholder }) => (
                <div key={key}>
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
                    {label}
                  </label>
                  <input
                    className="input-field"
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={handleChange(key)}
                    required
                  />
                  {/* Password strength indicator */}
                  {key === "password" && form.password.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          marginBottom: 4,
                        }}
                      >
                        {[1, 2, 3, 4].map((level) => {
                          const strength =
                            form.password.length < 4
                              ? 1
                              : form.password.length < 7
                              ? 2
                              : form.password.length < 10
                              ? 3
                              : 4;
                          const colors = ["#FF6B6B", "#FBBF24", "#34D399", "#00FFD1"];
                          return (
                            <div
                              key={level}
                              style={{
                                flex: 1,
                                height: 3,
                                borderRadius: 99,
                                background:
                                  level <= strength
                                    ? colors[strength - 1]
                                    : "rgba(255,255,255,0.07)",
                                transition: "background 0.3s",
                              }}
                            />
                          );
                        })}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color:
                            form.password.length < 4
                              ? "#FF6B6B"
                              : form.password.length < 7
                              ? "#FBBF24"
                              : form.password.length < 10
                              ? "#34D399"
                              : "#00FFD1",
                        }}
                      >
                        {form.password.length < 4
                          ? "Weak"
                          : form.password.length < 7
                          ? "Fair"
                          : form.password.length < 10
                          ? "Good"
                          : "Strong"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
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
                  Creating account…
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

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

          {/* Login link */}
          <p style={{ textAlign: "center", color: "#555", fontSize: 14, margin: 0 }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#00FFD1", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e: { target: HTMLAnchorElement; }) =>
                ((e.target as HTMLAnchorElement).style.textDecoration = "underline")
              }
              onMouseLeave={(e: { target: HTMLAnchorElement; }) =>
                ((e.target as HTMLAnchorElement).style.textDecoration = "none")
              }
            >
              Log in
            </Link>
          </p>

          {/* DSA badges */}
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