import { updateUsers } from '../../api/adminApi';
import { useState } from 'react';
import type { User } from '../../types/User';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  refresh: () => void;
}

export default function EditUserModal({ user, onClose, refresh }: EditUserModalProps) {
  const [role, setRole] = useState(user.role);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const updateUser = async () => {
    const data = { name, role, email };
    await updateUsers(user._id, data);
    refresh();
    onClose();
  };

  // Styles consistent with the Cyber-Glass Admin UI
  const modalContainer: React.CSSProperties = {
    background: "rgba(20, 20, 20, 0.95)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(0, 255, 209, 0.18)",
    borderRadius: 16,
    padding: "28px",
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
    letterSpacing: "0.12em",
    marginBottom: 6,
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#fff",
    width: "100%",
    marginBottom: 20,
    outline: "none",
    fontSize: 14,
    transition: "border-color 0.2s",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div style={modalContainer}>
        {/* Signature Top Accent Gradient */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, #00FFD1, #FF6B6B)",
            opacity: 0.8,
          }}
        />

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 22,
          color: "#fff",
          marginBottom: 24,
          letterSpacing: "-0.02em"
        }}>
          Edit User Profile
        </h2>

        <div>
          <label style={labelStyle}>Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            className="focus:border-[#00FFD1]/40"
          />

          <label style={labelStyle}>Email Address</label>
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            className="focus:border-[#00FFD1]/40"
          />

          <label style={labelStyle}>Access Level</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
            className="focus:border-[#00FFD1]/40 cursor-pointer"
          >
            <option value="user" style={{ background: '#1a1a1a' }}>Standard User</option>
            <option value="admin" style={{ background: '#1a1a1a' }}>Administrator</option>
          </select>
        </div>

        <div className="flex gap-3 mt-4">
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              color: "#aaa",
              padding: "12px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={updateUser}
            style={{
              flex: 2,
              background: "#00FFD1",
              color: "#000",
              padding: "12px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              boxShadow: "0 0 20px rgba(0, 255, 209, 0.15)",
              transition: "transform 0.1s active"
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}