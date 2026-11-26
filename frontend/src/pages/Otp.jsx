import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/otp.css";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(59);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || "");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await api.post("/recycle/verify-otp", { otp });
      await refreshUser();
      navigate("/rewards");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/recycle/resend-otp");
      setTimeLeft(59);
      if (data.devOtp) setDevOtp(data.devOtp);
      setMessage("A new OTP has been sent.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not resend OTP");
    }
  };

  return (
    <div className="otp-page" style={{ minHeight: "85vh", paddingTop: "90px" }}>
      <div className="otp-container">
        <div className="otp-logo">♻️ EcoBin</div>

        <div className="otp-header">
          <h2>Verification Code</h2>
          <p>
            We&apos;ve sent a 6-digit code to your registered email. Enter it below to verify your
            recycling submission.
          </p>
          <p>
            <b>Please Check Your Spam</b>
          </p>
          {devOtp && (
            <p style={{ marginTop: "8px", color: "#059669", fontWeight: 600 }}>
              Dev Mode OTP: {devOtp}
            </p>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form id="otpForm" onSubmit={handleVerify}>
          <div className="otp-input-group">
            <input
              type="text"
              maxLength={8}
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
            />
          </div>

          <button type="submit" className="verify-btn" disabled={submitting}>
            {submitting ? "Verifying..." : "Verify & Proceed"}
          </button>
        </form>

        <div className="otp-footer">
          <p>
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              id="resendBtn"
              disabled={timeLeft > 0}
              onClick={handleResend}
              style={{
                opacity: timeLeft > 0 ? 0.5 : 1,
                pointerEvents: timeLeft > 0 ? "none" : "auto",
                background: "none",
                border: "none",
                color: "#10b981",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Resend Code
            </button>
          </p>
          <span id="timer">{`00:${timeLeft < 10 ? "0" : ""}${timeLeft}`}</span>
        </div>

        <Link className="back-link" to="/recycle">
          <i className="fa-solid fa-arrow-left" /> Back to Recycle
        </Link>
      </div>
    </div>
  );
}
