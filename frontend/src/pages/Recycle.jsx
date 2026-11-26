import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/recycle.css";

const BASE_PRICES = {
  mobile: 500,
  laptop: 1200,
  tv: 1500,
  charger: 100,
  battery: 300,
  other: 200,
};

const CONDITION_MULTIPLIER = {
  working: 1,
  damaged: 0.6,
  dead: 0.3,
};

const USAGE_MULTIPLIER = {
  "1>": 1,
  "1-3": 0.8,
  ">3": 0.5,
};

export default function Recycle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(
    user ? `${user.firstname} ${user.lastname}`.trim() : ""
  );
  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("mobile");
  const [condition, setCondition] = useState("damaged");
  const [usage, setUsage] = useState("1-3");
  const [quantity, setQuantity] = useState(1);
  const [recycledAt, setRecycledAt] = useState(new Date().toISOString().slice(0, 10));
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { price, points } = useMemo(() => {
    const qty = Math.max(1, Number(quantity) || 1);
    const calcPrice =
      (BASE_PRICES[type] || 200) *
      (CONDITION_MULTIPLIER[condition] || 0.6) *
      (USAGE_MULTIPLIER[usage] || 0.8) *
      qty;
    return {
      price: Math.round(calcPrice),
      points: Math.round(calcPrice / 10),
    };
  }, [type, condition, usage, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("itemName", itemName);
      formData.append("type", type);
      formData.append("condition", condition);
      formData.append("usage", usage);
      formData.append("quantity", String(quantity));
      formData.append("price", String(price));
      formData.append("points", String(points));
      formData.append("recycledAt", recycledAt);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await api.post("/recycle", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/otp", { state: { devOtp: data.devOtp } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recycle-page">
      <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <div className="form-logo">♻️ EcoBin</div>
          <h2>Recycle New Item</h2>
          <p>Help us track your impact and calculate your rewards.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>
              <i className="fa-solid fa-user" /> Full Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-grid">
            <div className="input-container">
              <label>
                <i className="fa-solid fa-tag" /> Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. MacBook Pro"
                required
              />
            </div>
            <div className="input-container">
              <label>
                <i className="fa-solid fa-list" /> Item Type
              </label>
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="mobile">Mobile</option>
                <option value="laptop">Laptop</option>
                <option value="tv">TV</option>
                <option value="battery">Battery</option>
                <option value="charger">Charger</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="radio-section">
            <label className="section-label">Item Condition</label>
            <div className="radio-grid">
              {[
                { value: "working", label: "Working" },
                { value: "damaged", label: "Damaged" },
                { value: "dead", label: "Dead" },
              ].map((opt) => (
                <label className="radio-card" key={opt.value}>
                  <input
                    type="radio"
                    name="condition"
                    value={opt.value}
                    checked={condition === opt.value}
                    onChange={(e) => setCondition(e.target.value)}
                  />
                  <div className="radio-content">{opt.label}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="radio-section">
            <label className="section-label">Usage Period</label>
            <div className="radio-grid">
              {[
                { value: "1>", label: "< 1 Year" },
                { value: "1-3", label: "1-3 Years" },
                { value: ">3", label: "> 3 Years" },
              ].map((opt) => (
                <label className="radio-card" key={opt.value}>
                  <input
                    type="radio"
                    name="usage"
                    value={opt.value}
                    checked={usage === opt.value}
                    onChange={(e) => setUsage(e.target.value)}
                  />
                  <div className="radio-content">{opt.label}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-grid-3">
            <div className="input-container">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label>Price (₹)</label>
              <input type="text" value={price} readOnly />
            </div>
            <div className="input-container">
              <label>Points</label>
              <input type="text" value={points} readOnly />
            </div>
          </div>

          <div className="form-grid">
            <div className="input-container">
              <label>Recycled At</label>
              <input
                type="date"
                value={recycledAt}
                onChange={(e) => setRecycledAt(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>Upload Image</label>
              <div className="file-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <span>
                  <i className="fa-solid fa-image" /> {image ? image.name : "Choose File"}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Register Recycling Item"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
