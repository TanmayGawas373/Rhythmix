import { useEffect, useState } from "react";
import type { Song } from "../types/Song";
import { getHistory } from "../api/playlistApi";

interface Props {
  limit?: number;
  refreshTrigger: string | undefined;
  onEnqueue: (id: string, playNext?: boolean) => void;
}

export default function RecentlyPlayed({ limit = 5, refreshTrigger, onEnqueue }: Props) {
  const [history, setHistory] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [enqueueing, setEnqueueing] = useState<string | null>(null);

  const fetchHistory = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getHistory(limit);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleEnqueue = async (id: string, playNext: boolean): Promise<void> => {
    setEnqueueing(id + (playNext ? "-next" : "-queue"));
    await onEnqueue(id, playNext);
    setTimeout(() => setEnqueueing(null), 600);
  };

  return (
    <>
      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: slide-in-right 0.25s ease both;
        }
        .recent-item:last-child { border-bottom: none; }
        .recent-item:hover { background: rgba(255,255,255,0.02); }

        .enqueue-btn {
          padding: 5px 11px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .enqueue-btn:active { transform: scale(0.93); }
        .enqueue-btn.popped { animation: pop 0.3s ease; }

        .btn-queue {
          background: rgba(167,139,250,0.08);
          color: #A78BFA;
          border-color: rgba(167,139,250,0.2);
        }
        .btn-queue:hover {
          background: rgba(167,139,250,0.16);
          border-color: rgba(167,139,250,0.35);
        }

        .btn-next {
          background: rgba(0,255,209,0.07);
          color: #00FFD1;
          border-color: rgba(0,255,209,0.2);
        }
        .btn-next:hover {
          background: rgba(0,255,209,0.14);
          border-color: rgba(0,255,209,0.35);
        }
      `}</style>

      {loading ? (
        /* ── Loading skeleton ── */
        <div style={{ padding: "20px" }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                opacity: 1 - i * 0.25,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    height: 11,
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.05)",
                    width: `${55 + i * 10}%`,
                  }}
                />
                <div
                  style={{
                    height: 9,
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.03)",
                    width: `${35 + i * 8}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        /* ── Empty state ── */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 32, opacity: 0.3 }}>🕘</div>
          <p style={{ color: "#444", fontSize: 13, margin: 0, textAlign: "center" }}>
            No recent songs yet — start listening!
          </p>
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 99,
              background: "rgba(255,107,107,0.08)",
              color: "#FF6B6B",
              fontFamily: "monospace",
              opacity: 0.7,
            }}
          >
            LIFO · Stack
          </span>
        </div>
      ) : (
        /* ── History list ── */
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {history.map((song, index) => (
            <li
              key={song._id}
              className="recent-item"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {/* Stack position indicator */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: index === 0 ? 11 : 11,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  background:
                    index === 0
                      ? "rgba(255,107,107,0.12)"
                      : "rgba(255,255,255,0.03)",
                  color:
                    index === 0 ? "#FF6B6B" : "rgba(255,255,255,0.18)",
                  border:
                    index === 0
                      ? "1px solid rgba(255,107,107,0.25)"
                      : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {index === 0 ? "TOP" : index + 1}
              </div>

              {/* Art placeholder */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#1a1a2e,#16213e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                🎵
              </div>

              {/* Song info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: index === 0 ? "#fff" : "rgba(255,255,255,0.65)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {song.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#555",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {song.artist}
                </div>
              </div>

              {/* Action buttons — visible on hover via group */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <button
                  className={`enqueue-btn btn-next${
                    enqueueing === song._id + "-next" ? " popped" : ""
                  }`}
                  onClick={() => handleEnqueue(song._id, true)}
                  title="Play next"
                >
                  {enqueueing === song._id + "-next" ? "✓" : "▶ Next"}
                </button>

                <button
                  className={`enqueue-btn btn-queue${
                    enqueueing === song._id + "-queue" ? " popped" : ""
                  }`}
                  onClick={() => handleEnqueue(song._id, false)}
                  title="Add to end of queue"
                >
                  {enqueueing === song._id + "-queue" ? "✓" : "+ Queue"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}