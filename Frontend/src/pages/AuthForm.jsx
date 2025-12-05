import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Style/UserAuthForm.css";
import avatar from "../assets/avtar.png";

const API = import.meta.env.VITE_API_URL;

export default function AuthForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [authType, setAuthType] = useState("user"); // "user" or "admin"
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    // If coming from protected admin route, auto-select admin
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin') {
      setAuthType('admin');
    }
  }, [searchParams]);

  // Check if admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API}/api/auth/admin/check`);
        const data = await res.json();
        setAdminExists(data.exists);
      } catch (err) {
        console.error('Error checking admin:', err);
      }
    };
    checkAdmin();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const endpoint =
        authType === "user"
          ? `${API}/api/auth/user/${mode}`
          : `${API}/api/auth/admin/${mode}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          Fullname: fullName,
          Email: email,
          Password: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      // Save auth info
      if (authType === "user") {
        localStorage.setItem("userToken", data.token || data.message);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", fullName || data.user?.Fullname || "User");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminName");
        window.dispatchEvent(new Event("userLoggedIn"));
      } else {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminName", fullName || data.admin?.Fullname || "Admin");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        window.dispatchEvent(new Event("adminLoggedIn"));
      }

      setMessage({ type: "success", text: data.message || "Success!" });
      setTimeout(() => {
        if (authType === "user") {
          navigate("/");
        } else {
          navigate("/admin-dashboard");
        }
      }, 1000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="welcome">
            <h2>
              {authType === "user"
                ? "Welcome to the\nDEVDOSE Community!..."
                : "Welcome to\nAdmin Panel"}
            </h2>
          </div>
        </div>

        <div className="auth-right">
          {/* Toggle Button */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => {
                setAuthType("user");
                setMode("login");
                setFullName("");
                setEmail("");
                setPassword("");
                setMessage(null);
              }}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: authType === "user" ? "#ff7a00" : "#ddd",
                color: authType === "user" ? "white" : "#333",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              👤 User
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthType("admin");
                setMode("login");
                setFullName("");
                setEmail("");
                setPassword("");
                setMessage(null);
              }}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: authType === "admin" ? "#ff7a00" : "#ddd",
                color: authType === "admin" ? "white" : "#333",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🔐 Admin
            </button>
          </div>

          <div className="lock-icon">
            <img src={avatar} alt="avatar" />
          </div>

          <p className="subtitle">
            {mode === "login"
              ? authType === "user"
                ? "WELCOME BACK!"
                : "ADMIN LOGIN"
              : authType === "user"
              ? "Create your account"
              : "Create admin account"}
          </p>

          <form className="form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="field">
                <input
                  type="text"
                  placeholder={authType === "user" ? "Full Name" : "Admin Name"}
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="field">
              <input
                type="email"
                placeholder={authType === "user" ? "Email Address" : "Admin Email"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              className="btn-grad" 
              type="submit" 
              disabled={loading || (authType === "admin" && mode === "register" && adminExists)}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Register"}
            </button>

            {authType === "admin" && mode === "register" && adminExists && (
              <p style={{ color: "red", fontSize: "14px", marginTop: "10px", textAlign: "center" }}>
                ⚠️ Admin already exists. Only one admin is allowed.
              </p>
            )}
          </form>

          {message && (
            <div
              className={`auth-message ${
                message.type === "error" ? "error" : "success"
              }`}
            >
              {message.text}
            </div>
          )}

          <p className="switch">
            {mode === "login" ? (
              <>
                {authType === "user" ? "New User?" : "New Admin?"}{" "}
                <button
                  type="button"
                  className="link"
                  onClick={() => setMode("register")}
                >
                  Register here.
                </button>
              </>
            ) : (
              <>
                {authType === "user" ? "Already have account?" : "Already registered?"}{" "}
                <button
                  type="button"
                  className="link"
                  onClick={() => setMode("login")}
                >
                  Login.
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
