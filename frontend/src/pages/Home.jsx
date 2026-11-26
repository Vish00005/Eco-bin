import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";
import "../styles/sections.css";

const ITEM_DATA = {
  smartphones: {
    label: "Smartphones",
    title: "Smartphones",
    desc: "Old phones, feature phones, and mobile devices",
    value: "₹50 - ₹500",
    impact: "Recovers rare earth metals and reduces toxic waste",
    icon: "fa-mobile-screen",
    cardIconClass: "icon-green",
    grad: "grad-blue",
  },
  batteries: {
    label: "Batteries",
    title: "Batteries",
    desc: "Lithium-ion, alkaline, and rechargeable batteries",
    value: "₹10 - ₹100",
    impact: "Prevents soil and water contamination",
    icon: "fa-battery-half",
    cardIconClass: "icon-orange",
    grad: "grad-orange",
  },
  laptops: {
    label: "Laptops",
    title: "Laptops",
    desc: "Notebooks, tablets, and portable computers",
    value: "₹200 - ₹2000",
    impact: "Recovers precious metals like gold and silver",
    icon: "fa-laptop",
    cardIconClass: "icon-purple",
    grad: "grad-purple",
  },
  cables: {
    label: "Cables",
    title: "Cables",
    desc: "USB cables, charger cables, and wiring",
    value: "₹5 - ₹50",
    impact: "Copper and plastic recovery",
    icon: "fa-link",
    cardIconClass: "icon-teal",
    grad: "grad-teal",
  },
  chargers: {
    label: "Chargers",
    title: "Chargers",
    desc: "Phone chargers, laptop adapters, and power banks",
    value: "₹20 - ₹150",
    impact: "Reduces electronic component waste",
    icon: "fa-plug",
    cardIconClass: "icon-red",
    grad: "grad-red",
  },
  audio: {
    label: "Audio Devices",
    title: "Audio Devices",
    desc: "Headphones, earbuds, and speakers",
    value: "₹30 - ₹300",
    impact: "Specialized component recovery",
    icon: "fa-headphones",
    cardIconClass: "icon-indigo",
    grad: "grad-indigo",
  },
  wearables: {
    label: "Wearables",
    title: "Wearables",
    desc: "Smartwatches, fitness trackers, and health bands",
    value: "₹50 - ₹300",
    impact: "Recovers specialized sensors and micro-batteries",
    icon: "fa-clock",
    cardIconClass: "icon-pink",
    grad: "grad-pink",
  },
  gaming: {
    label: "Gaming Devices",
    title: "Gaming Devices",
    desc: "Controllers, consoles, and handheld gaming units",
    value: "₹100 - ₹1000",
    impact: "Complex circuit board and plastic housing recovery",
    icon: "fa-gamepad",
    cardIconClass: "icon-bright-green",
    grad: "grad-green",
  },
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("smartphones");
  const activeItem = ITEM_DATA[selectedCategory];

  return (
    <div className="home-page">
      <header id="home" className="hero">
        <div className="hero-content">
          <div className="badge">
            <i className="fa-solid fa-wand-magic-sparkles" /> AI-Powered Smart Recycling
          </div>
          <h1>
            Recycle E-Waste.
            <br />
            <span className="green-text">Earn Rewards.</span>
            <br />
            Save the Planet.
          </h1>
          <p>
            Find smart bins near you, let AI detect your e-waste, and get rewarded for every
            item you recycle. Making sustainability simple and rewarding.
          </p>
          <div className="hero-btns">
            <Link className="btn-green" to="/find-bin">
              <i className="fa-solid fa-location-crosshairs" /> Find Nearest Bin{" "}
              <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link className="btn-glass" to="/recycle">
              <i className="fa-solid fa-expand" /> Recycle E-Waste
            </Link>
          </div>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat">
          <h3>50K+</h3>
          <p>Items Recycled</p>
        </div>
        <div className="stat">
          <h3>200+</h3>
          <p>Smart Bins</p>
        </div>
        <div className="stat">
          <h3>10K+</h3>
          <p>Happy Users</p>
        </div>
      </div>

      <section id="features" className="section">
        <div className="section-header">
          <span className="tag">Features</span>
          <h2>Everything You Need for Smart Recycling</h2>
          <p>
            A complete ecosystem designed to make e-waste recycling effortless, transparent, and
            rewarding.
          </p>
        </div>
        <div className="grid-3">
          <div className="card">
            <div className="icon-circle green">
              <i className="fa-solid fa-location-dot" />
            </div>
            <h3>Smart Bin Locator</h3>
            <p>
              Find the nearest e-waste bin based on what you want to recycle. Real-time availability
              and directions.
            </p>
          </div>
          <div className="card">
            <div className="icon-circle blue">
              <i className="fa-solid fa-microchip" />
            </div>
            <h3>AI Detection</h3>
            <p>
              Drop your e-waste and watch our AI instantly identify the item and calculate its
              recycling value.
            </p>
          </div>
          <div className="card">
            <div className="icon-circle orange">
              <i className="fa-solid fa-gift" />
            </div>
            <h3>Earn Rewards</h3>
            <p>
              Get points for every item you recycle. Redeem for discounts, vouchers, or
              eco-friendly products.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section light-gray">
        <div className="section-header">
          <span className="tag-pill">How It Works</span>
          <h2 className="title-main">
            Simple as <span className="green-text">1-2-3</span>
          </h2>
          <p className="subtitle">
            From finding a bin to earning rewards - the entire process takes less than 3 minutes.
          </p>
        </div>

        <div className="timeline-container">
          <div className="central-line" />

          <div className="timeline-item left">
            <div className="timeline-content card-3d">
              <span className="step-number">01</span>
              <h3>Select E-Waste Type</h3>
              <p>
                Choose what you want to recycle - phones, batteries, laptops, chargers, or cables.
              </p>
            </div>
            <div className="timeline-dot">
              <i className="fa-solid fa-mobile-screen" />
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content card-3d">
              <span className="step-number">02</span>
              <h3>Find Nearest Bin</h3>
              <p>
                Instantly see compatible bins near you with real-time availability and directions.
              </p>
            </div>
            <div className="timeline-dot">
              <i className="fa-solid fa-location-dot" />
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content card-3d">
              <span className="step-number">03</span>
              <h3>Upload Image And Details</h3>
              <p>Identify yourself at the bin by scanning your unique QR code on the screen.</p>
            </div>
            <div className="timeline-dot">
              <i className="fa-solid fa-qrcode" />
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content card-3d">
              <span className="step-number">04</span>
              <h3>Drop Your Item and Verify</h3>
              <p>Place your e-waste in the bin and watch AI detect and evaluate your item.</p>
            </div>
            <div className="timeline-dot">
              <i className="fa-solid fa-expand" />
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content card-3d">
              <span className="step-number">05</span>
              <h3>Collect Rewards</h3>
              <p>
                Earn points based on item value. Redeem for discounts and eco-friendly products.
              </p>
            </div>
            <div className="timeline-dot">
              <i className="fa-solid fa-gift" />
            </div>
          </div>
        </div>

        <div className="done-badge">
          <i className="fa-solid fa-check" /> Done! You&apos;ve made a difference.
        </div>
      </section>

      <section id="items" className="section">
        <div className="section-header">
          <span className="tag-pill">Accepted Items</span>
          <h2 className="title-main">
            What Can You <span className="green-text">Recycle?</span>
          </h2>
          <p className="subtitle">
            We accept all types of electronic waste. Click on any category to learn more.
          </p>
        </div>

        <div className="category-scroll-wrapper">
          <div className="category-grid">
            {Object.entries(ITEM_DATA).map(([key, item]) => (
              <div
                key={key}
                className={`cat-card ${selectedCategory === key ? "active" : ""}`}
                onClick={() => setSelectedCategory(key)}
              >
                <div className={`cat-icon ${item.cardIconClass}`}>
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`detail-display-box ${activeItem.grad}`}>
          <div className="detail-header">
            <div className="detail-icon-large">
              <i className={`fa-solid ${activeItem.icon}`} />
            </div>
            <div>
              <h3>{activeItem.title}</h3>
              <p>{activeItem.desc}</p>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>Estimated Value</label>
              <p>{activeItem.value}</p>
            </div>
            <div className="info-item">
              <label>Environmental Impact</label>
              <p>{activeItem.impact}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="impact" className="section dark-impact">
        <div className="section-header">
          <span className="tag-outline">Our Collective Impact</span>
          <h2 className="white-text">
            Together, We&apos;re Making a <span className="green-text">Difference</span>
          </h2>
          <p className="white-text opacity-8">
            Every item you recycle contributes to a cleaner planet. See the impact our community
            has made together.
          </p>
        </div>

        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">
              <i className="fa-solid fa-trash-can" />
            </div>
            <div className="impact-data">
              <h3>25,000 kg</h3>
              <p>E-Waste Recycled</p>
              <span>Electronics safely processed</span>
            </div>
          </div>
          <div className="impact-card">
            <div className="impact-icon">
              <i className="fa-solid fa-cloud" />
            </div>
            <div className="impact-data">
              <h3>15,000 kg CO₂</h3>
              <p>Emissions Prevented</p>
              <span>Carbon footprint reduced</span>
            </div>
          </div>
          <div className="impact-card">
            <div className="impact-icon">
              <i className="fa-solid fa-droplet" />
            </div>
            <div className="impact-data">
              <h3>500,000 L</h3>
              <p>Water Saved</p>
              <span>From reduced mining</span>
            </div>
          </div>
          <div className="impact-card">
            <div className="impact-icon">
              <i className="fa-solid fa-tree" />
            </div>
            <div className="impact-data">
              <h3>2,500 trees</h3>
              <p>Equivalent Impact</p>
              <span>In carbon absorption</span>
            </div>
          </div>
        </div>

        <div className="join-banner">
          <p>
            Join <strong>10,000+</strong> eco-warriors
          </p>
          <span>Be part of the movement towards a sustainable future</span>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box">
          <span className="cta-tag">🌱 Start Your Recycling Journey</span>
          <h2>Ready to Make a Difference?</h2>
          <p>
            Find your nearest smart bin, recycle your e-waste, and start earning rewards today.
            Every item counts towards a cleaner, greener planet.
          </p>
          <Link className="btn-green-large" to="/find-bin">
            <i className="fa-solid fa-location-dot" /> Find Nearest Bin Now
          </Link>
          <div className="cta-features">
            <span>
              <i className="fa-solid fa-circle-check" /> 200+ Active Bins
            </span>
            <span>
              <i className="fa-solid fa-circle-check" /> AI-Powered Detection
            </span>
            <span>
              <i className="fa-solid fa-circle-check" /> Instant Rewards
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
