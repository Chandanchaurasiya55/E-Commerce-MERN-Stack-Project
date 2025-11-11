import { useState } from "react";
import "../Style/UserAuthForm.css";
import avatar from "../assets/avtar.png";

const API = import.meta.env.VITE_API_URL;

export default function AuthCard() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);


  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "register") {
        // backend register expects: Fullname, Email, Password
        const res = await fetch(`${API}/api/auth/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ Fullname: fullName, Email: email, Password: password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");
        setMessage({ type: "success", text: data.message || "Registered" });
        // optionally switch to login
        setMode("login");
      } else {
        // login: backend expects Email and password (note lowercase password)
        const res = await fetch(`${API}/api/auth/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ Email: email, password: password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        setMessage({ type: "success", text: data.message || "Logged in" });
        // on success you may redirect or update app state
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-left">
        <div className="welcome">
          <h2>
            Welcome to the
            <br /> DEVDOSE Community!...
          </h2>
        </div>
      </div>

      {/* Right form area */}
      <div className="auth-right">
        <div className="lock-icon">
          <img src={avatar} alt="avatar" />
        </div>
        <p className="subtitle">
          {mode === "login" ? "WELCOME BACK!" : "Create your account to get started"}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="field">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <input
              type="password"
              placeholder="Your Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-grad" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        {message && (
          <div className={`auth-message ${message.type === "error" ? "error" : "success"}`}>
            {message.text}
          </div>
        )}

        <p className="switch">
          {mode === "login" ? (
            <>
              New User?{" "}
              <button type="button" className="link" onClick={() => setMode("register")}>
                Register here.
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link" onClick={() => setMode("login")}>
                Login.
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
