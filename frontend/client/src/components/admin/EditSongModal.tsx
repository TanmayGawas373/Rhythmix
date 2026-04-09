import { useState } from "react";
import { updateSong } from "../../api/adminApi";

export default function EditSongModal({ song, onClose, refresh }: any) {
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [genre, setGenre] = useState(song.genre);
  const [audio, setAudio] = useState<File | null>(null);
  const [poster, setPoster] = useState<File | null>(null);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("genre", genre);

    if (audio) formData.append("audio", audio);
    if (poster) formData.append("poster", poster);

    await updateSong(song._id, formData);
    refresh();
    onClose();
  };

  // Common styles to match Dashboard
  const cardStyle: React.CSSProperties = {
    background: "rgba(20, 20, 20, 0.95)", // Slightly darker for modal readability
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(0, 255, 209, 0.18)",
    borderRadius: 16,
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: "400px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 6,
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#fff",
    width: "100%",
    marginBottom: 16,
    outline: "none",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div style={cardStyle}>
        {/* Accent Top Bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, #FF6B6B, #00FFD1)",
            opacity: 0.8,
          }}
        />

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 22,
          color: "#fff",
          marginBottom: 20,
          letterSpacing: "-0.02em"
        }}>
          Edit Song
        </h2>

        <div>
          <label style={labelStyle}>Song Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="Title"
          />

          <label style={labelStyle}>Artist Name</label>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            style={inputStyle}
            placeholder="Artist"
          />

          <label style={labelStyle}>Genre</label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={inputStyle}
            placeholder="Artist"
          />

          <label style={labelStyle}>Audio File (Optional)</label>
          <input
            type="file"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            style={{ ...inputStyle, fontSize: 12 }}
          />

          <label style={labelStyle}>Cover Poster (Optional)</label>
          <input
            type="file"
            onChange={(e) => setPoster(e.target.files?.[0] || null)}
            style={{ ...inputStyle, fontSize: 12 }}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              color: "#ccc",
              padding: "12px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            style={{
              flex: 2,
              background: "#00FFD1",
              color: "#000",
              padding: "12px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              boxShadow: "0 0 20px rgba(0, 255, 209, 0.2)"
            }}
          >
            Update Song
          </button>
        </div>
      </div>
    </div>
  );
}