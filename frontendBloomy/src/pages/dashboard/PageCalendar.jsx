import { C, cardS } from "../../constants";
import { CT, AlertS } from "../../components/Shared";

export default function PageCalendar({ fireNotif }) {
  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.2rem" }}>
        <div>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:C.ink }}>📅 <span style={{ color:C.mocha }}>Calendar</span></div>
          <div style={{ color:C.muted, fontSize:"0.83rem", marginTop:"0.18rem" }}>Emma's appointments and reminders</div>
        </div>
        <button onClick={() => fireNotif("📅 Event Added","New appointment saved!")} style={{ padding:"0.52rem 1.05rem", border:"none", borderRadius:10, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.81rem", boxShadow:"0 3px 11px rgba(160,105,74,0.22)" }}>+ Add Event</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.82rem" }}>
        {/* Mini calendar */}
        <div style={cardS()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.9rem" }}>
            <CT>February 2026</CT>
            <span style={{ color:C.muted, fontSize:"0.8rem", cursor:"pointer" }}>◀ ▶</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ textAlign:"center", fontSize:"0.6rem", color:C.muted, textTransform:"uppercase", padding:"3px 0", fontWeight:700 }}>{d}</div>)}
            {Array.from({ length:28 }, (_,i) => i+1).map(d => (
              <div key={d} style={{ textAlign:"center", padding:"5px 2px", borderRadius:7, fontSize:"0.74rem", cursor:"pointer", background:d===21?"rgba(160,105,74,0.1)":"transparent", color:d===21?C.mocha:C.ink, fontWeight:d===21?800:400 }}>
                {d}{[5,10,18,22,27].includes(d) && <div style={{ width:3.5, height:3.5, borderRadius:"50%", background:C.dustRose, margin:"2px auto 0" }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div style={cardS()}>
          <CT>📍 Upcoming Events</CT>
          {[
            [C.dustRose, "Dr. Smith Check-up",   "Feb 22 · Pediatrician", "10:00 AM"],
            [C.caramel,  "Allergy Medication",    "Daily reminder",        "8:00 AM" ],
            [C.sage,     "Dental Cleaning",       "Feb 27 · Dr. Lee DDS",  "2:30 PM" ],
            [C.lavBlush, "Eye Exam",              "Mar 5 · Vision Center", "11:00 AM"],
          ].map(([color, title, sub, time]) => (
            <div key={title} style={{ display:"flex", alignItems:"center", gap:"0.62rem", padding:"0.62rem 0.78rem", borderRadius:10, marginBottom:"0.43rem", background:C.card2, border:`1px solid ${C.border}` }}>
              <div style={{ width:7.5, height:7.5, borderRadius:"50%", background:color, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.81rem", fontWeight:700, color:C.ink }}>{title}</div>
                <div style={{ fontSize:"0.68rem", color:C.muted }}>{sub}</div>
              </div>
              <div style={{ fontSize:"0.68rem", color:C.muted }}>{time}</div>
            </div>
          ))}
          <AlertS type="info" icon="🤖">AI: Emma's annual physical is due in 3 weeks. Book with Dr. Smith?</AlertS>
        </div>
      </div>
    </>
  );
}
