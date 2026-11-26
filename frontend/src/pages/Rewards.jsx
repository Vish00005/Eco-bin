import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/rewards.css";

const REWARDS_DATA = [
  { category: "Discount", title: "10% Off Electronics", points: 500, available: true },
  { category: "Product", title: "Eco-Friendly Water Bottle", points: 800, available: true },
  { category: "Impact", title: "Plant a Tree", points: 300, available: true },
  { category: "Voucher", title: "₹200 Shopping Voucher", points: 1500, available: false },
  { category: "Product", title: "Bamboo Phone Case", points: 1000, available: true },
  { category: "Special", title: "Premium Membership", points: 2000, available: false },
];

const ACHIEVEMENTS_DATA = [
  { icon: "🌱", title: "First Steps", description: "Recycle your first item", unlocked: true },
  { icon: "♻️", title: "Eco Warrior", description: "Recycle 25 items", unlocked: true },
  { icon: "🏆", title: "Century Club", description: "Recycle 100 items", progress: "47/100" },
  { icon: "🔥", title: "On Fire", description: "30-day streak", progress: "12/30" },
  { icon: "🌍", title: "Planet Saver", description: "Save 100kg CO2", progress: "23.5/100" },
  { icon: "⭐", title: "Top 100", description: "Reach top 100 on leaderboard", progress: "Locked" },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "Alex Smith", avatar: "AS", level: 15, points: 3450 },
  { rank: 2, name: "Maria Johnson", avatar: "MJ", level: 14, points: 3120 },
  { rank: 3, name: "David Wilson", avatar: "DW", level: 13, points: 2890 },
  { rank: 4, name: "Sarah Brown", avatar: "SB", level: 12, points: 2650 },
  { rank: 5, name: "John Davis", avatar: "JD", level: 11, points: 2430 },
];

export default function Rewards() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("rewards");
  const [redeemMsg, setRedeemMsg] = useState("");

  const items = user?.recycledItems || [];
  const totalPoints = useMemo(
    () => items.reduce((sum, item) => sum + (item.pointsEarned || 0), 0),
    [items]
  );

  const level = Math.floor(totalPoints / 100) + 1;
  const progressPercent = Math.min(100, totalPoints % 100);
  const pointsNeeded = 100 - (totalPoints % 100);

  const handleRedeem = (reward) => {
    if (!reward.available) return;
    if (totalPoints < reward.points) {
      setRedeemMsg(`You need ${reward.points - totalPoints} more points to redeem "${reward.title}".`);
      return;
    }
    setRedeemMsg(`Redeemed "${reward.title}"! Confirmation sent to ${user?.email}.`);
  };

  return (
    <div className="rewards-page">
      <main className="main-content" style={{ paddingTop: "95px" }}>
      <div className="rewards-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="header-title">Rewards Center</h1>
            <p className="header-subtitle">
              Earn points, unlock achievements, and redeem exciting rewards
            </p>
          </div>
          <div className="points-display">
            <div className="trophy-icon">🏆</div>
            <div className="points-info">
              <span className="points-label">Your Points</span>
              <span className="points-value">{totalPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {redeemMsg && <div className="alert alert-success">{redeemMsg}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div className="stat-info">
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">Items Recycled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">🌊</div>
          <div className="stat-info">
            <div className="stat-value">{(items.length * 2.5).toFixed(1)} kg</div>
            <div className="stat-label">CO2 Saved</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">⭐</div>
          <div className="stat-info">
            <div className="stat-value">#156</div>
            <div className="stat-label">Leaderboard</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">☀️</div>
          <div className="stat-info">
            <div className="stat-value">12 days</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <div className="level-badge">
            <span className="level-icon">⭐</span>
            <span>Level {level}</span>
          </div>
          <span className="level-subtitle">Eco Enthusiast</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-info">
            <span className="next-level">Next Level:</span>
            <span className="points-needed">{pointsNeeded} pts to go</span>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button
          type="button"
          className={`tab ${activeTab === "rewards" ? "active" : ""}`}
          onClick={() => setActiveTab("rewards")}
        >
          ⭐ Rewards
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          🏅 Achievements
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "leaderboard" ? "active" : ""}`}
          onClick={() => setActiveTab("leaderboard")}
        >
          📊 Leaderboard
        </button>
      </div>

      {activeTab === "rewards" && (
        <div className="tab-content active">
          <div className="rewards-grid">
            {REWARDS_DATA.map((reward) => (
              <div className="reward-card" key={reward.title}>
                <div className="reward-badge">
                  <span>⭐</span>
                  <span>{reward.points}</span>
                </div>
                <div className="reward-content">
                  <span className="reward-category">{reward.category}</span>
                  <h3 className="reward-title">{reward.title}</h3>
                  <button
                    type="button"
                    className={`reward-btn ${reward.available ? "" : "disabled"}`}
                    onClick={() => handleRedeem(reward)}
                  >
                    {reward.available ? "Redeem Now" : "Coming Soon"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="tab-content active">
          <div className="achievements-grid">
            {ACHIEVEMENTS_DATA.map((a) => (
              <div className={`achievement-card ${a.unlocked ? "unlocked" : ""}`} key={a.title}>
                <div className="achievement-icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                {a.unlocked ? (
                  <div className="achievement-status">Unlocked</div>
                ) : (
                  <div className="achievement-progress">{a.progress}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="tab-content active">
          <div className="leaderboard-container">
            {LEADERBOARD_DATA.map((u) => {
              const rankClass =
                u.rank === 1 ? "gold" : u.rank === 2 ? "silver" : u.rank === 3 ? "bronze" : "";
              return (
                <div className={`leaderboard-item rank-${u.rank}`} key={u.rank}>
                  <div className={`rank-badge ${rankClass}`}>{u.rank}</div>
                  <div className="user-info">
                    <div className="user-avatar">{u.avatar}</div>
                    <div className="user-details">
                      <span className="user-name">{u.name}</span>
                      <span className="user-stats">
                        Level {u.level} • {u.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                  <div className="user-score">{u.points.toLocaleString()}</div>
                </div>
              );
            })}
            <div className="leaderboard-divider">...</div>
            <div className="leaderboard-item current-user">
              <div className="rank-badge">156</div>
              <div className="user-info">
                <div className="user-avatar">
                  {(user?.firstname?.[0] || "Y") + (user?.lastname?.[0] || "O")}
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.firstname || "You"}</span>
                  <span className="user-stats">
                    Level {level} • {totalPoints.toLocaleString()} pts
                  </span>
                </div>
              </div>
              <div className="user-score">{totalPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </main>
    </div>
  );
}
