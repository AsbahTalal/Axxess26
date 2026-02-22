import { C, G } from "../constants";

export default function LandingPage({ setScreen }) {
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(155deg,#FAF5EE 0%,#F0E8DB 60%,#E8DDD0 100%)`, fontFamily:"'Nunito',sans-serif", color:C.ink }}>
      <style>{G}</style>

      {/* Nav */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.4rem 3rem", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:700, color:C.mocha }}>bloomy<span style={{ color:C.caramel }}>.</span></div>
        <div style={{ display:"flex", gap:"0.65rem" }}>
          <button onClick={() => setScreen("login")} style={{ padding:"0.55rem 1.3rem", border:`1.5px solid ${C.border}`, borderRadius:99, background:"transparent", color:C.mid, fontWeight:700, fontSize:"0.86rem" }}>Log In</button>
          <button onClick={() => setScreen("register")} style={{ padding:"0.55rem 1.3rem", border:"none", borderRadius:99, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.86rem", boxShadow:"0 3px 14px rgba(160,105,74,0.28)" }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"5.5rem 2rem 3.5rem", animation:"bloom 0.65s ease" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.45rem", background:C.cream, border:`1px solid ${C.border}`, borderRadius:999, padding:"0.38rem 1rem", fontSize:"0.76rem", fontWeight:800, color:C.mocha, marginBottom:"1.8rem", letterSpacing:"0.05em", textTransform:"uppercase" }}>
          🌸 Pediatric Health &amp; Wellness
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"3.6rem", fontWeight:700, color:C.ink, lineHeight:1.2, maxWidth:660, marginBottom:"1.3rem" }}>
          Nurture your child's<br/><em style={{ color:C.mocha }}>health beautifully</em>
        </h1>
        <p style={{ fontSize:"1.05rem", color:C.mid, maxWidth:500, lineHeight:1.75, marginBottom:"2.4rem" }}>
          Bloomy connects to your child's smartwatch to track hydration, sleep, mood, heart rate and nutrition — all in one warm, simple dashboard.
        </p>
        <div style={{ display:"flex", gap:"0.9rem", flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={() => setScreen("register")}
            style={{ padding:"0.88rem 2.1rem", border:"none", borderRadius:99, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.97rem", boxShadow:"0 5px 22px rgba(160,105,74,0.32)" }}
            onMouseOver={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform="none"}>
            🌱 Get Started — It's Free
          </button>
          <button onClick={() => setScreen("login")} style={{ padding:"0.88rem 2.1rem", border:`1.5px solid ${C.border}`, borderRadius:99, background:"transparent", color:C.mid, fontWeight:700, fontSize:"0.97rem" }}>
            Log In
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.1rem", padding:"0 3rem 5rem", maxWidth:1080, margin:"0 auto" }}>
        {[
          { icon:"⌚", title:"Smartwatch Connected",    desc:"Real-time hydration, heart rate, BP, and sleep tracking straight from the wrist." },
          { icon:"🌸", title:"Mood & Mental State",     desc:"Daily yes/no check-ins reveal your child's emotional wellbeing trend over time." },
          { icon:"📸", title:"Nutrition Label Scanner", desc:"Snap a photo of any food label and instantly see allergen risks matched to your child's profile." },
          { icon:"🥑", title:"Diet & Lifestyle Advice", desc:"Personalized weekly nutrition tips and lifestyle recommendations based on your child's data." },
          { icon:"🤖", title:"AI Health Assistant",     desc:"Ask anything about your child's health. Get instant, caring, data-backed answers." },
          { icon:"📅", title:"Appointment Calendar",    desc:"Never miss a check-up. Manage all pediatric appointments and medication reminders." },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:"1.7rem", boxShadow:"0 2px 10px rgba(160,105,74,0.05)" }}>
            <div style={{ fontSize:"1.75rem", marginBottom:"0.7rem" }}>{icon}</div>
            <div style={{ fontWeight:800, fontSize:"0.97rem", color:C.ink, marginBottom:"0.45rem" }}>{title}</div>
            <div style={{ fontSize:"0.83rem", color:C.muted, lineHeight:1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"1.4rem 3rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", fontWeight:700, color:C.mocha }}>bloomy.</div>
        <div style={{ fontSize:"0.76rem", color:C.ghost }}>© 2025 Bloomy Health · Made with 🌸 for families</div>
      </div>
    </div>
  );
}
