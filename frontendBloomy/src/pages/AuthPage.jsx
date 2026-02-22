import { useRef } from "react";
import { C, G, inp2 } from "../constants";
import { FLabel, BloomBtn, Divider } from "../components/Shared";

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

export default function AuthPage({ screen, setScreen, fireNotif, setParentProfile }) {
  const nameRef  = useRef(null);
  const emailRef = useRef(null);

  if (screen === "login") return (
    <AuthCard setScreen={setScreen}>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem", marginBottom:"1.9rem" }}>Welcome back 🌸</div>
      <FLabel>Email</FLabel>
      <input style={{ ...inp2, marginBottom:"0.95rem" }} type="email" defaultValue="sarah@example.com" />
      <FLabel>Password</FLabel>
      <input style={{ ...inp2, marginBottom:"1.35rem" }} type="password" defaultValue="password" />
      <BloomBtn onClick={() => {
        setScreen("dashboard");
        setTimeout(() => fireNotif("⌚ Watch Alert", "Emma's water reminder completed! 💧"), 2400);
      }}>Log In</BloomBtn>
      <Divider/>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem" }}>
        No account?{" "}
        <span onClick={() => setScreen("register")} style={{ color:C.mocha, fontWeight:800, cursor:"pointer", textDecoration:"underline" }}>Sign up</span>
      </div>
    </AuthCard>
  );

  // Register form
  return (
    <AuthCard setScreen={setScreen}>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem", marginBottom:"1.9rem" }}>Create your family's wellness hub 🌿</div>
      <FLabel>Parent Name</FLabel>
      <input ref={nameRef}  style={{ ...inp2, marginBottom:"0.95rem" }} type="text"     placeholder="Sarah Johnson" />
      <FLabel>Email</FLabel>
      <input ref={emailRef} style={{ ...inp2, marginBottom:"0.95rem" }} type="email"    placeholder="you@email.com" />
      <FLabel>Password</FLabel>
      <input                style={{ ...inp2, marginBottom:"1.35rem" }} type="password" placeholder="Create a strong password" />
      <BloomBtn onClick={() => {
        const name  = nameRef.current?.value.trim();
        const email = emailRef.current?.value.trim();
        if (setParentProfile && (name || email)) {
          setParentProfile(p => ({
            ...p,
            name:  name  || p.name,
            email: email || p.email,
          }));
        }
        setScreen("onboarding");
      }}>Create Account &amp; Set Up Child →</BloomBtn>
      <Divider/>
      <div style={{ textAlign:"center", color:C.muted, fontSize:"0.83rem" }}>
        Already have an account?{" "}
        <span onClick={() => setScreen("login")} style={{ color:C.mocha, fontWeight:800, cursor:"pointer", textDecoration:"underline" }}>Log in</span>
      </div>
    </AuthCard>
  );
}
