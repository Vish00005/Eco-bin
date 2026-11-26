import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import api from "../api/axios";
import "../styles/find-bin.css";

const FILTERS = [
  { key: "phone", label: "Phone", icon: "fa-mobile-screen" },
  { key: "battery", label: "Battery", icon: "fa-battery-half" },
  { key: "laptop", label: "Laptop", icon: "fa-laptop" },
  { key: "cable", label: "Cable", icon: "fa-link" },
  { key: "charger", label: "Charger", icon: "fa-plug" },
];

const FALLBACK_BINS = [
  {
    id: 1,
    name: "DDIT Campus Hub",
    address: "College Road, Nadiad",
    lat: 22.6825,
    lng: 72.8805,
    distance: 0.4,
    time: "5 min walk",
    rating: 4.9,
    fill: 15,
    accepted: ["phone", "laptop", "cable", "charger"],
  },
  {
    id: 2,
    name: "Santram Mandir Collection Point",
    address: "Near Santram Temple Plaza",
    lat: 22.6915,
    lng: 72.859,
    distance: 1.2,
    time: "15 min walk",
    rating: 4.7,
    fill: 65,
    accepted: ["phone", "battery", "cable", "charger"],
  },
  {
    id: 3,
    name: "Nadiad Railway Station Bin",
    address: "Main Exit Gate, Station Road",
    lat: 22.6885,
    lng: 72.871,
    distance: 0.9,
    time: "12 min walk",
    rating: 4.4,
    fill: 88,
    accepted: ["phone", "battery", "charger"],
  },
  {
    id: 4,
    name: "Pij Road Smart Drop",
    address: "Near Vaniawad Circle",
    lat: 22.698,
    lng: 72.852,
    distance: 2.3,
    time: "30 min walk",
    rating: 4.2,
    fill: 30,
    accepted: ["battery", "cable", "laptop"],
  },
  {
    id: 5,
    name: "Mission Road Recycling",
    address: "Opposite Methodist Hospital",
    lat: 22.705,
    lng: 72.868,
    distance: 1.8,
    time: "22 min walk",
    rating: 4.5,
    fill: 52,
    accepted: ["phone", "battery", "laptop", "cable", "charger"],
  },
];

const ICON_MAP = {
  phone: "fa-mobile-screen",
  battery: "fa-battery-half",
  laptop: "fa-laptop",
  cable: "fa-link",
  charger: "fa-plug",
};

export default function FindBin() {
  const [bins, setBins] = useState(FALLBACK_BINS);
  const [selectedFilter, setSelectedFilter] = useState("charger");
  const [expandedId, setExpandedId] = useState(1);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    api
      .get("/bins")
      .then(({ data }) => {
        if (Array.isArray(data.bins) && data.bins.length > 0) {
          setBins(data.bins);
        }
      })
      .catch(() => {
        // Keep fallback bins if API unavailable
      });
  }, []);

  const filteredBins = useMemo(
    () => bins.filter((b) => (b.accepted || []).includes(selectedFilter)),
    [bins, selectedFilter]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([22.6948, 72.865], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    filteredBins.forEach((bin) => {
      const marker = L.marker([bin.lat, bin.lng])
        .addTo(map)
        .bindPopup(`<b>${bin.name}</b><br>Fill Level: ${bin.fill}%`);
      markersRef.current.push(marker);
    });
  }, [filteredBins]);

  const locateUser = () => {
    const map = mapRef.current;
    if (!map) return;

    map.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });
    map.once("locationfound", (e) => {
      if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = L.circleMarker(e.latlng, {
        radius: 8,
        fillColor: "#3498db",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();
    });
    map.once("locationerror", () => {
      alert("Could not find your location. Defaulting to Nadiad City Center.");
    });
  };

  const focusBin = (bin) => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([bin.lat, bin.lng], 16);
    markersRef.current.forEach((m) => {
      if (m.getLatLng().lat === bin.lat) m.openPopup();
    });
  };

  return (
    <div className="findbin-page">
      <header className="find-header">
        <div className="header-content">
          <h1>Find a Smart Bin</h1>
          <p>Select what you want to recycle and find the nearest compatible bin</p>
        </div>
      </header>

      <main className="find-container">
        <div className="filter-bar">
          <span className="filter-label">
            <i className="fa-solid fa-filter" /> Filter:
          </span>
          <div className="filter-options">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`filter-btn ${selectedFilter === f.key ? "active" : ""}`}
                onClick={() => setSelectedFilter(f.key)}
              >
                <i className={`fa-solid ${f.icon}`} /> {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="map-layout">
          <div className="map-wrapper">
            <div ref={mapContainerRef} id="map" style={{ height: "500px", width: "100%" }} />
            <button
              type="button"
              id="locate-btn"
              className="btn-directions"
              style={{
                position: "absolute",
                zIndex: 1000,
                bottom: "20px",
                left: "20px",
                width: "95%",
              }}
              onClick={locateUser}
            >
              <i className="fa-solid fa-location-crosshairs" /> My Location
            </button>
          </div>

          <div className="bin-list">
            <h3>Nearby Bins ({filteredBins.length} found)</h3>

            {filteredBins.map((bin) => {
              const isExpanded = expandedId === bin.id;
              const fillClass = bin.fill > 70 ? "orange" : "green";
              return (
                <div
                  key={bin.id}
                  className={`bin-card ${isExpanded ? "expanded" : ""}`}
                >
                  <div
                    className="bin-info-header"
                    onClick={() => setExpandedId(isExpanded ? null : bin.id)}
                  >
                    <div>
                      <h4>{bin.name}</h4>
                      <p className="address">{bin.address}</p>
                    </div>
                    <i
                      className={`fa-solid ${
                        isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                      } toggle-icon`}
                    />
                  </div>
                  <div className="bin-stats">
                    <span>
                      <i className="fa-solid fa-location-arrow" /> {bin.distance} km
                    </span>
                    <span>
                      <i className="fa-solid fa-person-walking" /> {bin.time}
                    </span>
                    <span>
                      <i className="fa-solid fa-star" /> {bin.rating}
                    </span>
                  </div>
                  <div className="bin-details-expand">
                    <div className="fill-meter-container">
                      <div className="meter-label">
                        <span>Fill Level</span>
                        <span>{bin.fill}%</span>
                      </div>
                      <div className="meter-bar">
                        <div className={`fill ${fillClass}`} style={{ width: `${bin.fill}%` }} />
                      </div>
                    </div>
                    <div className="accepted-icons">
                      {(bin.accepted || []).map((t) => (
                        <i key={t} className={`fa-solid ${ICON_MAP[t] || "fa-recycle"}`} title={t} />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn-directions"
                      onClick={() => focusBin(bin)}
                    >
                      <i className="fa-solid fa-paper-plane" /> View on Map
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
