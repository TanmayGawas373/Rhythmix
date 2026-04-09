import { useEffect, useState } from "react";
import { getSongs, deleteSong } from "../../api/adminApi";
import EditSongModal from "./EditSongModal";

export default function SongsTable() {
  const [songs, setSongs] = useState<any[]>([]);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search State

  const fetchSongs = async () => {
    const res = await getSongs();
    setSongs(res);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this track?")) {
      await deleteSong(id);
      fetchSongs();
    }
  };

  // 🧪 Logic: Filter songs based on Title or Artist
  const filteredSongs = songs.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Shared Styles
  const containerStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: "24px",
    backdropFilter: "blur(10px)",
  };

  const searchInputStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(0, 255, 209, 0.15)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#fff",
    width: "100%",
    maxWidth: "400px",
    outline: "none",
    fontSize: 14,
    marginBottom: "24px",
    fontFamily: "'Syne', sans-serif",
    transition: "all 0.3s ease",
  };

  const thStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    padding: "16px 12px",
    textAlign: "left",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  };

  const tdStyle: React.CSSProperties = {
    padding: "16px 12px",
    fontSize: 14,
    color: "#eee",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: "#fff",
          letterSpacing: "-0.02em"
        }}>
          Song Management
        </h1>

        {/* 🔎 Functional Search Bar */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
            className="focus:border-[#00FFD1] focus:bg-white/0.06"
          />
          <span className="absolute right-4 top-3 text-[#00FFD1] opacity-50">
            {searchQuery ? "⚡" : "🔍"}
          </span>
        </div>
      </div>

      <div style={containerStyle}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th style={thStyle}>Track Details</th>
              <th style={thStyle}>Artist</th>
              <th style={thStyle}>Genre</th>
              <th style={thStyle}>Preview</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSongs.length > 0 ? (
              filteredSongs.map((s) => (
                <tr key={s._id} className="hover:bg-white/0.02 transition-colors">
                  <td style={tdStyle}>
                    <div className="font-bold text-white">{s.title}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">ID: {s._id.slice(-6)}</div>
                  </td>
                  
                  <td style={{ ...tdStyle, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                    {s.artist}
                  </td>

                  <td style={{ ...tdStyle, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                    {s.genre}
                  </td>

                  <td style={tdStyle}>
                    <audio 
                      controls 
                      src={s.url} 
                      className="h-8 opacity-70 hover:opacity-100 transition-opacity"
                      style={{ filter: "invert(100%) hue-rotate(180deg) brightness(1.5)" }} 
                    />
                  </td>

                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedSong(s)}
                        style={{
                          background: "rgba(0, 255, 209, 0.1)",
                          border: "1px solid rgba(0, 255, 209, 0.2)",
                          color: "#00FFD1",
                          padding: "6px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        style={{
                          background: "rgba(255, 107, 107, 0.1)",
                          border: "1px solid rgba(255, 107, 107, 0.2)",
                          color: "#FF6B6B",
                          padding: "6px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "#555", padding: "40px" }}>
                  No songs matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedSong && (
        <EditSongModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
          refresh={fetchSongs}
        />
      )}
    </div>
  );
}