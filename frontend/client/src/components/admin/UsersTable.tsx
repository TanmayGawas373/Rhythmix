import { useEffect, useState } from "react";
import { deleteUsers, getUsers } from "../../api/adminApi";
import EditUserModal from "./EditUserModal";

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search State

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUsers(id);
      fetchUsers();
    }
  };

  // 🧪 Logic: Filter users based on Name or Email
  const filteredUsers = users?.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Shared Styles from SongsTable
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
          User Management
        </h1>

        {/* 🔎 Functional Search Bar */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by name or email..."
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
              <th style={thStyle}>User Details</th>
              <th style={thStyle}>Email Address</th>
              <th style={thStyle}>Role</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-white/0.02 transition-colors">
                  <td style={tdStyle}>
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">ID: {u._id.slice(-6)}</div>
                  </td>

                  <td style={tdStyle}>
                    {u.email}
                  </td>

                  <td style={{ ...tdStyle, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                    <span className={`px-2 py-1 rounded text-[10px] uppercase ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                      {u.role}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedUser(u)}
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
                        onClick={() => handleDelete(u._id)}
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
                  No users matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={fetchUsers}
        />
      )}
    </div>
  );
}