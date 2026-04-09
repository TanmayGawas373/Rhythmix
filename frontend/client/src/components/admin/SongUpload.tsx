import { useState } from "react";
import { uploadSong } from "../../api/adminApi";

export default function SongUpload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [poster, setPoster] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!audio || !poster) {
      alert("Please upload both audio and poster");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);
    formData.append("poster", poster);

    try {
      await uploadSong(formData);
      alert("Track successfully deployed to database!");
      setTitle("");
      setArtist("");
      setAudio(null);
      setPoster(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Styles to match Admin Dashboard
  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: "32px",
    position: "relative",
    overflow: "hidden",
    maxWidth: "600px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 8,
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#fff",
    width: "100%",
    marginBottom: 20,
    outline: "none",
    fontSize: 15,
    transition: "all 0.2s ease",
  };

  const fileInputBox: React.CSSProperties = {
    background: "rgba(0, 255, 209, 0.03)",
    border: "1px dashed rgba(0, 255, 209, 0.2)",
    borderRadius: 12,
    padding: "16px",
    marginBottom: 20,
  };

  return (
    <div className="p-6">
      <div style={cardStyle}>
        {/* Neon Accent Bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, #00FFD1, #FF6B6B)",
            opacity: 0.6,
          }}
        />

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 26,
          color: "#fff",
          marginBottom: 28,
          letterSpacing: "-0.02em"
        }}>
          Upload New Track
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Song Title</label>
            <input
              type="text"
              placeholder="e.g. Neon Nights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              className="focus:border-[#00FFD1]/50 focus:bg-white/0.06"
            />
          </div>

          <div>
            <label style={labelStyle}>Artist Name</label>
            <input
              type="text"
              placeholder="e.g. CyberWave"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              style={inputStyle}
              className="focus:border-[#00FFD1]/50 focus:bg-white/0.06"
            />
          </div>
        </div>

        <div>
            <label style={labelStyle}>Genre</label>
            <input
              type="text"
              placeholder="e.g. CyberWave"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={inputStyle}
              className="focus:border-[#00FFD1]/50 focus:bg-white/0.06"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={fileInputBox}>
            <label style={labelStyle}>Audio File</label>
            <input
              type="file"
              onChange={(e) => setAudio(e.target.files?.[0] || null)}
              className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#00FFD1]/10 file:text-[#00FFD1] hover:file:bg-[#00FFD1]/20 cursor-pointer"
            />
          </div>

          <div style={fileInputBox}>
            <label style={labelStyle}>Cover Poster</label>
            <input
              type="file"
              onChange={(e) => setPoster(e.target.files?.[0] || null)}
              className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FF6B6B]/10 file:text-[#FF6B6B] hover:file:bg-[#FF6B6B]/20 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#333" : "#00FFD1",
            color: loading ? "#666" : "#000",
            padding: "14px",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginTop: 10,
            boxShadow: loading ? "none" : "0 8px 24px rgba(0, 255, 209, 0.15)",
            transition: "all 0.3s ease",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Syncing with Server..." : "Deploy Track"}
        </button>
      </div>
  );
}