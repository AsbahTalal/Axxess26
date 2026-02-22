import { useRef, useState } from "react";
import { C, G, inp2 } from "../constants";
import { FLabel, BloomBtn, Divider } from "../components/Shared";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

function AuthCard({ children, setScreen }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", fontFamily:"'Nunito',sans-serif" }}>
      <style>{G}</style>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:"2.4rem", width:"100%", maxWidth:416, boxShadow:"0 10px 44px rgba(160,105,74,0.1)", animation:"fadeUp 0.38s ease" }}>
        <div onClick={() => setScreen("landing")} style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.65rem", fontWeight:700, color:C.mocha, textAlign:"center", marginBottom:"0.18rem", cursor:"pointer" }}>
          bloomy.
        </div>
        {children}
      </div>
    </div>
  );
}

const friendlyError = (code) => {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled. Enable it in your Firebase console under Authentication → Sign-in method.";
    case "auth/network-request-failed":
      return "Network error — check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return `Sign-in failed (${code || "unknown"}). Check your Firebase console.`;
  }
};

export default function AuthPage({ screen, setScreen, fireNotif, setParentProfile }) {
  const nameRef    = useRef(null);
  const emailRef   = useRef(null);
  const pwRef      = useRef(null);
  const confirmRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // ── Login ──────────────────────────────────────────────────────
  if (screen === "login") return (
    <AuthCard setScreen={setScreen}>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem", marginBottom:"1.9rem" }}>Welcome back 🌸</div>
      <FLabel>Email</FLabel>
      <input ref={emailRef} style={{ ...inp2, marginBottom:"0.95rem" }} type="email" placeholder="you@email.com" />
      <FLabel>Password</FLabel>
      <input ref={pwRef} style={{ ...inp2, marginBottom: error ? "0.5rem" : "1.35rem" }} type="password" placeholder="Your password" />
      {error && (
        <div style={{ background:"rgba(192,96,96,0.08)", border:"1px solid rgba(192,96,96,0.22)", borderRadius:9, padding:"0.6rem 0.8rem", color:"#c06060", fontSize:"0.82rem", marginBottom:"0.85rem", fontWeight:600, lineHeight:1.5 }}>
          {error}
        </div>
      )}
      <BloomBtn onClick={async () => {
        setError("");
        const email = emailRef.current?.value.trim();
        const pw    = pwRef.current?.value;
        if (!email || !pw) { setError("Please fill in all fields."); return; }
        setLoading(true);
        try {
          await signInWithEmailAndPassword(auth, email, pw);
          // onAuthStateChanged in Bloomy.jsx switches the screen
        } catch (e) {
          setError(friendlyError(e.code));
          setLoading(false);
        }
      }} disabled={loading}>{loading ? "Signing in…" : "Log In"}</BloomBtn>
      <Divider/>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem" }}>
        No account?{" "}
        <span onClick={() => { setError(""); setScreen("register"); }} style={{ color:C.mocha, fontWeight:800, cursor:"pointer", textDecoration:"underline" }}>Sign up</span>
      </div>
    </AuthCard>
  );

  // ── Register ───────────────────────────────────────────────────
  return (
    <AuthCard setScreen={setScreen}>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem", marginBottom:"1.9rem" }}>Create your family's wellness hub 🌿</div>

      <FLabel>Parent Name</FLabel>
      <input ref={nameRef} style={{ ...inp2, marginBottom:"0.95rem" }} type="text" placeholder="Sarah Johnson" />

      <FLabel>Email</FLabel>
      <input ref={emailRef} style={{ ...inp2, marginBottom:"0.95rem" }} type="email" placeholder="you@email.com" />

      <FLabel>Password</FLabel>
      <input ref={pwRef} style={{ ...inp2, marginBottom:"0.95rem" }} type="password" placeholder="Create a password (min 6 chars)" />

      <FLabel>Confirm Password</FLabel>
      <input ref={confirmRef} style={{ ...inp2, marginBottom: error ? "0.5rem" : "1.35rem" }} type="password" placeholder="Re-enter your password" />

      {error && (
        <div style={{ background:"rgba(192,96,96,0.08)", border:"1px solid rgba(192,96,96,0.22)", borderRadius:9, padding:"0.6rem 0.8rem", color:"#c06060", fontSize:"0.82rem", marginBottom:"0.85rem", fontWeight:600, lineHeight:1.5 }}>
          {error}
        </div>
      )}

      <BloomBtn onClick={async () => {
        setError("");
        const name    = nameRef.current?.value.trim();
        const email   = emailRef.current?.value.trim();
        const pw      = pwRef.current?.value;
        const confirm = confirmRef.current?.value;

        if (!email || !pw || !confirm) { setError("Please fill in all fields."); return; }
        if (pw !== confirm)            { setError("Passwords don't match."); return; }
        if (pw.length < 6)             { setError("Password must be at least 6 characters."); return; }

        setLoading(true);
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, pw);
          // Store name in Firebase Auth so it's always available on user.displayName
          if (name) await updateProfile(cred.user, { displayName: name });
          if (setParentProfile && (name || email)) {
            setParentProfile(p => ({ ...p, name: name || p.name, email: email || p.email }));
          }
          // onAuthStateChanged in Bloomy.jsx routes to onboarding
        } catch (e) {
          setError(friendlyError(e.code));
          setLoading(false);
        }
      }} disabled={loading}>{loading ? "Creating account…" : "Create Account & Set Up Child →"}</BloomBtn>

      <Divider/>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem" }}>
        Already have an account?{" "}
        <span onClick={() => { setError(""); setScreen("login"); }} style={{ color:C.mocha, fontWeight:800, cursor:"pointer", textDecoration:"underline" }}>Log in</span>
      </div>
    </AuthCard>
  );
}
