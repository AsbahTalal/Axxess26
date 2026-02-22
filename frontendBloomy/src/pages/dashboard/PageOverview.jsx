import { C, cardS } from "../../constants";
import { CT, AlertS, StatCard } from "../../components/Shared";
import ChildBanner from "../../components/ChildBanner";
import MoodRow from "../../components/MoodRow";

export default function PageOverview({ setDashPage, child, moodLog, setMoodLog, fireNotif }) {
  return (
    <>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.2rem" }}>
        <div>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:C.ink }}>Welcome, <span style={{ color:C.mocha }}>Sarah</span> 👋</div>
          <div style={{ color:C.muted, fontSize:"0.83rem", marginTop:"0.18rem" }}>Feb 21 · Emma's daily snapshot</div>
        </div>
        <button onClick={() => setDashPage("settings")} style={{ padding:"0.48rem 1rem", border:`1.5px solid ${C.border}`, borderRadius:99, background:C.card, fontSize:"0.78rem", fontWeight:700, color:C.mid }}>⚙️ Settings</button>
      </div>

      <ChildBanner child={child} setDashPage={setDashPage}/>

      <AlertS type="warn"    icon="⚠️">Emma's hydration is below target — only 3 of 6 reminders completed today.</AlertS>
      <AlertS type="success" icon="💤">Emma slept 9.5 hours last night — excellent sleep! 🌸</AlertS>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.82rem", margin:"0.9rem 0" }}>
        <StatCard icon="💧" label="Hydration"      value="3"     unit="/6"   trend="↓ Below target" ok={false} color={C.mocha}   />
        <StatCard icon="❤️" label="Heart Rate"     value="88"    unit="bpm"  trend="✓ Normal range"  ok={true}  color={C.dustRose} />
        <StatCard icon="🩺" label="Blood Pressure" value="95/62" unit=""     trend="✓ Healthy"        ok={true}  color={C.lavBlush} />
        <StatCard icon="💤" label="Sleep"           value="9.5"   unit="hrs"  trend="✓ Excellent"    ok={true}  color={C.sage}     />
      </div>

      {/* Wellness + check-in */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.82rem", marginBottom:"0.82rem" }}>
        <div style={cardS()}>
          <CT>🌸 Wellness Score</CT>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"0.35rem 0" }}>
            <svg width="126" height="126" viewBox="0 0 126 126">
              <circle cx="63" cy="63" r="50" fill="none" stroke={C.cream} strokeWidth="11.5"/>
              <circle cx="63" cy="63" r="50" fill="none" stroke="url(#rg)" strokeWidth="11.5"
                strokeDasharray="314" strokeDashoffset="63" strokeLinecap="round" transform="rotate(-90 63 63)"/>
              <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={C.mochaL}/><stop offset="100%" stopColor={C.mocha}/>
              </linearGradient></defs>
              <text x="63" y="58" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="25" fill={C.mocha}>80</text>
              <text x="63" y="75" textAnchor="middle" fontFamily="DM Sans" fontSize="10.5" fill={C.muted}>/100</text>
            </svg>
            <div style={{ fontWeight:700, fontSize:"0.86rem", color:C.ink, marginTop:"0.38rem" }}>Great Health! 🌸</div>
            <div style={{ fontSize:"0.74rem", color:C.muted, marginTop:"0.22rem", textAlign:"center" }}>Hydration is holding the score back today</div>
          </div>
        </div>

        <div style={cardS()}>
          <CT>😊 Day Check-In</CT>
          <div style={{ color:C.muted, fontSize:"0.78rem", marginBottom:"0.72rem" }}>From watch prompts today</div>
          {[
            { q:"How fun was your day?", icon:"😄", pct:80,  ans:"Yes! 😊",  col:C.caramel  },
            { q:"Did you exercise?",      icon:"🏃", pct:100, ans:"Yes! ✓",   col:C.sage     },
            { q:"Did you drink water?",   icon:"💧", pct:50,  ans:"Kinda 🤔", col:C.dustRose },
          ].map(({ q, icon, pct, ans, col }) => (
            <div key={q} style={{ marginBottom:"0.8rem" }}>
              <div style={{ fontSize:"0.79rem", marginBottom:"0.32rem", color:C.ink }}>{q}</div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.42rem" }}>
                <span style={{ fontSize:"1.15rem" }}>{icon}</span>
                <div style={{ flex:1, background:C.card2, borderRadius:999, height:5.5, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", borderRadius:999, background:`linear-gradient(90deg,${col}88,${col})` }}/>
                </div>
                <span style={{ fontSize:"0.7rem", fontWeight:800, color:col, minWidth:58, textAlign:"right" }}>{ans}</span>
              </div>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"0.7rem", marginTop:"0.1rem" }}>
            <div style={{ fontSize:"0.75rem", fontWeight:800, color:C.mid, marginBottom:"0.45rem" }}>📊 7-Day Mood History</div>
            <MoodRow moodLog={moodLog} setMoodLog={setMoodLog} fireNotif={fireNotif}/>
          </div>
        </div>
      </div>

      {/* Watch activity log */}
      <div style={cardS()}>
        <CT>⌚ Today's Watch Activity Log</CT>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.38rem" }}>
          <AlertS type="success" icon="⏰">8:00 AM — "Time to drink some water, Emma!" — ✅ Completed</AlertS>
          <AlertS type="success" icon="🏃">10:00 AM — "Let's do 5 jumping jacks!" — ✅ Completed</AlertS>
          <AlertS type="info"    icon="💧">12:00 PM — "Water time! Stay hydrated!" — ✅ Completed</AlertS>
          <AlertS type="warn"    icon="💧">2:00 PM — "Don't forget to drink water!" — ❌ Missed</AlertS>
          <AlertS type="warn"    icon="💧">4:00 PM — "Water reminder!" — ❌ Missed</AlertS>
          <AlertS type="info"    icon="😊">6:00 PM — "How was your day?" — ✅ Answered: Fun!</AlertS>
        </div>
      </div>
    </>
  );
}
