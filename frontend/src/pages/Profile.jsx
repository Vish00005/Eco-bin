import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
  });
  const [statusMsg, setStatusMsg] = useState("");

  const items = user?.recycledItems || [];
  const totalPoints = useMemo(
    () => items.reduce((sum, item) => sum + (item.pointsEarned || 0), 0),
    [items]
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    try {
      const { data } = await api.put("/profile", form);
      setUser(data.user);
      setEditing(false);
      setStatusMsg("Profile updated!");
    } catch {
      setStatusMsg("Could not update profile.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="container">
      <section className="profile-hero">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <i className="fas fa-leaf avatar-icon" />
              </div>
              <div className="level-badge">{Math.floor(totalPoints / 100) + 1}</div>
            </div>
            <div className="profile-details">
              <h1 className="profile-name">
                {user?.firstname} {user?.lastname}
              </h1>
              <p className="profile-title">Eco Enthusiast</p>
              <div className="profile-meta">
                <div className="meta-item">
                  <i className="fas fa-map-marker-alt" />
                  <span>Gujarat, India</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-calendar-alt" />
                  <span>
                    Joined{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "2026"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-edit"
            onClick={() => setEditing((v) => !v)}
          >
            <i className="fas fa-edit" /> {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </section>

      {statusMsg && <div className="alert alert-success">{statusMsg}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-recycle" />
          </div>
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">Items Recycled</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-trophy" />
          </div>
          <div className="stat-value">{totalPoints}</div>
          <div className="stat-label">Points Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-fire" />
          </div>
          <div className="stat-value">12 days</div>
          <div className="stat-label">Current Streak</div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Personal Information</h2>
            <button
              type="button"
              className="btn-edit-small"
              onClick={() => setEditing((v) => !v)}
            >
              <i className="fas fa-edit" /> {editing ? "Close" : "Edit"}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: "grid", gap: "12px", paddingTop: "10px" }}>
              <input
                type="text"
                placeholder="First Name"
                value={form.firstname}
                onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastname}
                onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                required
              />
              <button type="submit" className="btn-edit" style={{ justifySelf: "start" }}>
                Save Changes
              </button>
            </form>
          ) : (
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-user" />
                </div>
                <div className="info-content">
                  <div className="info-label">Full Name</div>
                  <div className="info-value">
                    {user?.firstname} {user?.lastname}
                  </div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-envelope" />
                </div>
                <div className="info-content">
                  <div className="info-label">Email</div>
                  <div className="info-value">{user?.email}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-phone" />
                </div>
                <div className="info-content">
                  <div className="info-label">Phone</div>
                  <div className="info-value">{user?.phone}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <div className="info-content">
                  <div className="info-label">Location</div>
                  <div className="info-value">Gujarat, India</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="achievement-card">
            <div className="achievement-header">
              <div className="achievement-badge">{Math.floor(totalPoints / 100) + 1}</div>
              <div className="achievement-info">
                <h3>Eco Enthusiast</h3>
                <p>Level {Math.floor(totalPoints / 100) + 1}</p>
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Progress to Next Level</span>
                <span className="progress-percent">{totalPoints % 100}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${totalPoints % 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="signout-section">
        <button
          type="button"
          className="btn-signout"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-sign-out-alt" /> Log Out
        </button>
      </div>
      </div>
    </div>
  );
}
