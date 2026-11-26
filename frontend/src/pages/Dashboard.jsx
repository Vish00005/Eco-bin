import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function Dashboard() {
  const { user } = useAuth();
  const items = user?.recycledItems || [];

  const totalPoints = useMemo(
    () => items.reduce((sum, item) => sum + (item.pointsEarned || 0), 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0),
    [items]
  );

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Items Recycled",
        data: [2, 4, 3, 6, 5, Math.max(items.length, 1)],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderWidth: 3,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#10b981",
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="container">
      <section className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Your Dashboard</h1>
          <p className="hero-subtitle">Track your recycling journey and environmental impact</p>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Recycled</span>
            <div className="stat-icon green">
              <i className="fas fa-recycle" />
            </div>
          </div>
          <div className="stat-value">{items.length}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up" /> +{items.length} this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Value</span>
            <div className="stat-icon blue">
              <i className="fas fa-wallet" />
            </div>
          </div>
          <div className="stat-value">₹{totalPrice}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up" /> ₹{totalPrice} this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Points Earned</span>
            <div className="stat-icon yellow">
              <i className="fas fa-star" />
            </div>
          </div>
          <div className="stat-value">{totalPoints}</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up" /> +{totalPoints} this month
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="left-column">
          <div className="card chart-card">
            <div className="card-header">
              <h2 className="card-title">Recycling Activity</h2>
              <div className="time-filter">
                <button type="button" className="filter-btn active">
                  <i className="fas fa-calendar" /> Last 6 months
                </button>
              </div>
            </div>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Activity</h2>
            </div>
            <div className="activity-list">
              {items.length === 0 ? (
                <p style={{ color: "#64748b", padding: "12px 0" }}>
                  No recycled items yet. Head to Recycle to log your first item!
                </p>
              ) : (
                items.map((item, idx) => (
                  <div className="activity-item" key={`${item.itemName}-${idx}`}>
                    <div className="activity-icon">
                      <i className="fas fa-mobile-alt" />
                    </div>
                    <div className="activity-details">
                      <div className="activity-name">{item.itemName}</div>
                      <div className="activity-meta">
                        <span className="activity-category">{item.category}</span>
                        <span className="activity-time">{item.condition}</span>
                      </div>
                    </div>
                    <div className="activity-reward">
                      <div className="reward-amount">₹ {item.estimatedPrice}</div>
                      <div className="reward-points">+{item.pointsEarned} pts</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="card impact-card">
            <h2 className="card-title">Your Impact</h2>
            <div className="impact-list">
              <div className="impact-item">
                <div className="impact-icon">
                  <i className="fas fa-leaf" />
                </div>
                <div className="impact-details">
                  <div className="impact-value">{(items.length * 2.5).toFixed(1)} kg</div>
                  <div className="impact-label">CO₂ Prevented</div>
                </div>
              </div>

              <div className="impact-item">
                <div className="impact-icon">
                  <i className="fas fa-tint" />
                </div>
                <div className="impact-details">
                  <div className="impact-value">{items.length * 45} L</div>
                  <div className="impact-label">Water Saved</div>
                </div>
              </div>

              <div className="impact-item">
                <div className="impact-icon">
                  <i className="fas fa-tree" />
                </div>
                <div className="impact-details">
                  <div className="impact-value">{(items.length * 0.4).toFixed(1)}</div>
                  <div className="impact-label">Trees Equivalent</div>
                </div>
              </div>
            </div>
            <div className="impact-message">
              <i className="fas fa-seedling" />
              <p>
                You&apos;ve made an impact equivalent to{" "}
                <strong>planting {Math.max(1, Math.round(items.length * 0.4))} trees</strong>
              </p>
            </div>
          </div>

          <div className="card quick-actions-card">
            <h2 className="card-title">Quick Actions</h2>
            <div className="actions-list">
              <button
                type="button"
                className="action-btn"
                onClick={() => window.print()}
              >
                <i className="fas fa-download" />
                <span>Download Receipt</span>
                <i className="fas fa-chevron-right" />
              </button>
              <button
                type="button"
                className="action-btn"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(items, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "ecobin-recycled-items.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <i className="fas fa-file-export" />
                <span>Export Data</span>
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
