import { useRef, useState, useEffect } from "react";
import type { Song } from "../types/Song";

interface Props {
  song: Song | null;
  onNext: () => void;
  onPrevious: () => void;
  compact?: boolean; // ← when true: renders inline seek+controls only (no poster, no volume)
}

function formatTime(sec: number): string {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerControls({ song, onNext, onPrevious, compact = false }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying]     = useState<boolean>(false);
  const [progress, setProgress]       = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration]       = useState<number>(0);
  const [volume, setVolume]           = useState<number>(1);
  const [muted, setMuted]             = useState<boolean>(false);
  const [dragging, setDragging]       = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current && song) {
      const audio = audioRef.current;
      audio.src = song.url;
      audio.load();
      audio.play().catch((err) => console.log("Playback prevented:", err));
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [song]);

  const togglePlay = (): void => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (): void => {
    if (!audioRef.current || dragging) return;
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!audioRef.current) return;
    const percent = Number(e.target.value);
    const newTime = (percent / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent);
    setCurrentTime(newTime);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = (): void => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.muted = next;
  };

  const volumeIcon = muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊";

  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 18px rgba(0,255,209,0.3); }
          50%       { box-shadow: 0 0 38px rgba(0,255,209,0.6); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .play-btn {
          border-radius: 50%;
          background: #00FFD1;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #000; font-weight: 700;
          transition: transform 0.15s;
          animation: glow 3s ease-in-out infinite;
          flex-shrink: 0;
        }
        .play-btn:hover  { transform: scale(1.08); }
        .play-btn:active { transform: scale(0.95); }

        .skip-btn {
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #aaa;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .skip-btn:hover  { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
        .skip-btn:active { transform: scale(0.93); }

        .vol-btn {
          background: none; border: none;
          cursor: pointer; padding: 4px; flex-shrink: 0;
          transition: transform 0.15s;
        }
        .vol-btn:hover { transform: scale(1.15); }

        .seek-slider {
          -webkit-appearance: none; appearance: none;
          height: 4px; border-radius: 99px;
          background: rgba(255,255,255,0.08);
          outline: none; cursor: pointer;
        }
        .seek-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px; border-radius: 50%;
          background: #00FFD1; cursor: pointer;
          box-shadow: 0 0 6px rgba(0,255,209,0.6);
          transition: transform 0.15s;
        }
        .seek-slider:hover::-webkit-slider-thumb { transform: scale(1.3); }

        /* compact seek: thinner thumb */
        .seek-slider.compact-seek::-webkit-slider-thumb {
          width: 11px; height: 11px;
        }

        .vol-slider {
          -webkit-appearance: none; appearance: none;
          width: 80px; height: 3px; border-radius: 99px;
          background: rgba(255,255,255,0.08);
          outline: none; cursor: pointer;
        }
        .vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 11px; height: 11px; border-radius: 50%;
          background: #fff; cursor: pointer;
        }

        .vinyl {
          border-radius: 50%;
          animation: spin-slow 4s linear infinite;
          animation-play-state: paused;
        }
        .vinyl.playing { animation-play-state: running; }
      `}</style>

      {/* Hidden audio — always rendered regardless of compact mode */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      {/* ── COMPACT MODE — inline seek bar + prev/play/next ── */}
      {compact ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Prev */}
          <button
            className="skip-btn"
            onClick={onPrevious}
            title="Previous"
            style={{ width: 30, height: 30, fontSize: 12 }}
          >
            ⏮
          </button>

          {/* Play / Pause */}
          <button
            className="play-btn"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            style={{ width: 34, height: 34, fontSize: 13 }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Next */}
          <button
            className="skip-btn"
            onClick={onNext}
            title="Next"
            style={{ width: 30, height: 30, fontSize: 12 }}
          >
            ⏭
          </button>

          {/* Seek bar + time */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              className="seek-slider compact-seek"
              style={{
                width: "100%",
                background: `linear-gradient(to right, #00FFD1 ${progress}%, rgba(255,255,255,0.08) ${progress}%)`,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "#444",
                fontFamily: "monospace",
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : (
        /* ── FULL MODE — poster + seek + controls + volume ── */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            minWidth: 280,
            maxWidth: 340,
          }}
        >
          {/* Poster / vinyl */}
          {song && (
            <div style={{ position: "relative" }}>
              {song.poster ? (
                <img
                  src={song.poster}
                  alt={song.title}
                  className={`vinyl ${isPlaying ? "playing" : ""}`}
                  style={{
                    width: 160,
                    height: 160,
                    objectFit: "cover",
                    border: "3px solid rgba(255,255,255,0.08)",
                    boxShadow: isPlaying
                      ? "0 0 40px rgba(0,255,209,0.25), 0 16px 40px rgba(0,0,0,0.5)"
                      : "0 16px 40px rgba(0,0,0,0.4)",
                    transition: "box-shadow 0.4s",
                  }}
                />
              ) : (
                <div
                  className={`vinyl ${isPlaying ? "playing" : ""}`}
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                    border: "3px solid rgba(255,255,255,0.08)",
                    boxShadow: isPlaying
                      ? "0 0 40px rgba(0,255,209,0.25), 0 16px 40px rgba(0,0,0,0.5)"
                      : "0 16px 40px rgba(0,0,0,0.4)",
                    transition: "box-shadow 0.4s",
                  }}
                >
                  🎵
                </div>
              )}
              {/* Center spindle */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#080808",
                  border: "2px solid rgba(0,255,209,0.4)",
                }}
              />
            </div>
          )}

          {/* Seek bar */}
          <div style={{ width: "100%" }}>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              className="seek-slider"
              style={{
                width: "100%",
                background: `linear-gradient(to right, #00FFD1 ${progress}%, rgba(255,255,255,0.08) ${progress}%)`,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#555",
                marginTop: 5,
                fontFamily: "monospace",
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button className="skip-btn" onClick={onPrevious} title="Previous"
              style={{ width: 36, height: 36, fontSize: 14 }}>⏮</button>
            <button className="play-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}
              style={{ width: 52, height: 52, fontSize: 18 }}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button className="skip-btn" onClick={onNext} title="Next"
              style={{ width: 36, height: 36, fontSize: 14 }}>⏭</button>
          </div>

          {/* Volume row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="vol-btn" onClick={toggleMute} title="Toggle mute"
              style={{ fontSize: 15 }}>
              {volumeIcon}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="vol-slider"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.5) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.08) ${(muted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}