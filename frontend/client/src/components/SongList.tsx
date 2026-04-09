import { useMemo, useState } from "react";
import type { Song } from "../types/Song";

interface Props {
  songs: Song[];
  onEnqueue: (id: string, playNext?: boolean) => void;
}

export default function SongList({ songs, onEnqueue }: Props) {
  const [query, setQuery] = useState<string>("");
  const [enqueueing, setEnqueueing] = useState<string | null>(null);

  const filteredSongs = useMemo<Song[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return songs;
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) || 
        song.genre.toLowerCase().includes(q)
    );
  }, [songs, query]);

  const handleEnqueue = async (id: string, playNext: boolean): Promise<void> => {
    setEnqueueing(id + (playNext ? "-next" : "-queue"));
    await onEnqueue(id, playNext);
    setTimeout(() => setEnqueueing(null), 600);
  };

  return (
    <>
      <style>{`
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        .song-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: slide-in-left 0.22s ease both;
        }
        .song-item:last-child { border-bottom: none; }
        .song-item:hover { background: rgba(255,255,255,0.025); }

        .song-search {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 16px 10px 38px;
          color: #fff;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .song-search::placeholder { color: #444; }
        .song-search:focus {
          border-color: rgba(0,255,209,0.35);
          background: rgba(0,255,209,0.02);
        }

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
          opacity: 0;
          transition: opacity 0.15s, background 0.15s, border-color 0.15s;
        }
        .song-item:hover .btn-queue { opacity: 1; }
        .btn-queue:hover {
          background: rgba(167,139,250,0.16) !important;
          border-color: rgba(167,139,250,0.35) !important;
        }

        .btn-next {
          background: rgba(0,255,209,0.07);
          color: #00FFD1;
          border-color: rgba(0,255,209,0.2);
          opacity: 0;
          transition: opacity 0.15s, background 0.15s, border-color 0.15s;
        }
        .song-item:hover .btn-next { opacity: 1; }
        .btn-next:hover {
          background: rgba(0,255,209,0.14) !important;
          border-color: rgba(0,255,209,0.35) !important;
        }

        /* Always show buttons that are in active enqueue state */
        .btn-queue.popped,
        .btn-next.popped { opacity: 1 !important; }

        .highlight {
          background: rgba(0,255,209,0.2);
          color: #00FFD1;
          border-radius: 2px;
          padding: 0 1px;
        }
      `}</style>

      {/* ── Search bar ── */}
      <div style={{ padding: "14px 20px 10px", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 34,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            color: "#444",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          className="song-search"
          placeholder="Search by title or artist…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              position: "absolute",
              right: 30,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer",
              fontSize: 14,
              padding: 4,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = "#555")}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Results count ── */}
      {query && (
        <div
          style={{
            padding: "0 20px 10px",
            fontSize: 11,
            color: "#555",
            fontFamily: "monospace",
          }}
        >
          {filteredSongs.length === 0
            ? "No results"
            : `${filteredSongs.length} of ${songs.length} songs`}
        </div>
      )}

      {/* ── Empty states ── */}
      {filteredSongs.length === 0 ? (
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
          <div style={{ fontSize: 32, opacity: 0.3 }}>{query ? "🔍" : "🎵"}</div>
          <p style={{ color: "#444", fontSize: 13, margin: 0, textAlign: "center" }}>
            {query ? `No songs matching "${query}"` : "No songs available"}
          </p>
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                marginTop: 4,
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#aaa",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        /* ── Song rows ── */
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {filteredSongs.map((song, index) => (
            <li
              key={song._id}
              className="song-item"
              style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
            >
              {/* Row number */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {index + 1}
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

              {/* Song info with highlighted search match */}
              {/* Song info with highlighted search match */}
<div style={{ flex: 1, minWidth: 0 }}>
  {/* Title */}
  <div
    style={{
      fontSize: 14,
      fontWeight: 600,
      color: "rgba(255,255,255,0.8)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontFamily: "'DM Sans', sans-serif",
    }}
    dangerouslySetInnerHTML={{
      __html: query
        ? song.title.replace(
            new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
            '<span class="highlight">$1</span>'
          )
        : song.title,
    }}
  />

  {/* Artist */}
  <div
    style={{
      fontSize: 12,
      color: "#555",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
    dangerouslySetInnerHTML={{
      __html: query
        ? song.artist.replace(
            new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
            '<span class="highlight">$1</span>'
          )
        : song.artist,
    }}
  />

  {/* ✅ Genre (FIXED) */}
  <div
    style={{
      fontSize: 11,
      color: "#777",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
    dangerouslySetInnerHTML={{
      __html: query
        ? song.genre.replace(
            new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
            '<span class="highlight">$1</span>'
          )
        : song.genre,
    }}
  />
</div>

              

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
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