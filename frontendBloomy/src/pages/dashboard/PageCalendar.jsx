import { useState } from "react";
import { C, cardS } from "../../constants";
import { AlertS } from "../../components/Shared";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Events keyed by "YYYY-M-D"
const EVENTS = {
  "2026-1-5":  [{ color:C.caramel,  title:"Allergy Medication",  sub:"Daily reminder",        time:"8:00 AM"  }],
  "2026-1-10": [{ color:C.lavBlush, title:"Therapy Session",     sub:"Dr. Patel",              time:"3:00 PM"  }],
  "2026-1-18": [{ color:C.sage,     title:"School Health Check", sub:"Annual vision test",     time:"9:30 AM"  }],
  "2026-1-22": [{ color:C.dustRose, title:"Dr. Smith Check-up",  sub:"Pediatrician",           time:"10:00 AM" }],
  "2026-1-27": [{ color:C.sage,     title:"Dental Cleaning",     sub:"Dr. Lee DDS",            time:"2:30 PM"  }],
  "2026-2-5":  [{ color:C.caramel,  title:"Allergy Medication",  sub:"Daily reminder",         time:"8:00 AM"  }],
  "2026-2-10": [{ color:C.lavBlush, title:"Therapy Session",     sub:"Dr. Patel",              time:"3:00 PM"  }],
  "2026-2-18": [{ color:C.sage,     title:"School Health Check", sub:"Annual vision test",     time:"9:30 AM"  }],
  "2026-2-22": [{ color:C.dustRose, title:"Dr. Smith Check-up",  sub:"Feb 22 · Pediatrician",  time:"10:00 AM" }],
  "2026-2-27": [{ color:C.sage,     title:"Dental Cleaning",     sub:"Feb 27 · Dr. Lee DDS",   time:"2:30 PM"  }],
  "2026-3-5":  [{ color:C.lavBlush, title:"Eye Exam",            sub:"Mar 5 · Vision Center",  time:"11:00 AM" }],
  "2026-3-15": [{ color:C.dustRose, title:"Follow-up Visit",     sub:"Dr. Smith",              time:"10:00 AM" }],
};

export default function PageCalendar({ fireNotif }) {
  const [viewMonth, setViewMonth] = useState(1); // 0-indexed (1 = Feb)
  const [viewYear,  setViewYear]  = useState(2026);
  const [selectedDay, setSelectedDay] = useState(22);

  const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWk  = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const today         = { d:22, m:1, y:2026 }; // Feb 22 2026

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const isToday = (d) => d === today.d && viewMonth === today.m && viewYear === today.y;
  const eventKey = (d) => `${viewYear}-${viewMonth}-${d}`;
  const hasEvent = (d) => !!EVENTS[eventKey(d)];

  // Upcoming events for this month and next
  const upcomingKeys = Object.keys(EVENTS)
    .filter(k => {
      const [y, m] = k.split("-").map(Number);
      return (y === viewYear && m === viewMonth) || (y === viewYear && m === viewMonth + 1) || (y === viewYear + 1 && viewMonth === 11 && m === 0);
    })
    .sort();

  const selectedEvents = selectedDay ? (EVENTS[eventKey(selectedDay)] || []) : [];

  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.3rem" }}>
        <div>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2rem", color:C.ink }}>📅 <span style={{ color:C.mocha }}>Calendar</span></div>
          <div style={{ color:C.muted, fontSize:"1rem", marginTop:"0.2rem", fontWeight:600 }}>Emma's appointments and reminders</div>
        </div>
        <button onClick={() => fireNotif("📅 Event Added","New appointment saved!")} style={{ padding:"0.6rem 1.2rem", border:"none", borderRadius:10, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.95rem", boxShadow:"0 3px 11px rgba(160,105,74,0.22)" }}>+ Add Event</button>
      </div>

      {/* Full-width calendar card */}
      <div style={cardS({ marginBottom:"1rem" })}>
        {/* Month navigation header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
          <button onClick={prevMonth} style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"transparent", fontSize:"1rem", color:C.mocha, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>◀</button>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.35rem", color:C.ink }}>
            {MONTH_NAMES[viewMonth]} <span style={{ color:C.mocha }}>{viewYear}</span>
          </div>
          <button onClick={nextMonth} style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"transparent", fontSize:"1rem", color:C.mocha, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>▶</button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginBottom:6 }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} style={{ textAlign:"center", fontSize:"0.82rem", color:C.muted, textTransform:"uppercase", padding:"6px 0", fontWeight:700 }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
          {/* Empty leading cells */}
          {Array.from({ length:firstDayOfWk }, (_, i) => (
            <div key={`e${i}`}/>
          ))}
          {/* Day cells */}
          {Array.from({ length:daysInMonth }, (_, i) => {
            const d = i + 1;
            const today_ = isToday(d);
            const selected = selectedDay === d;
            const event = hasEvent(d);
            return (
              <div key={d} onClick={() => setSelectedDay(d === selectedDay ? null : d)}
                style={{ textAlign:"center", padding:"10px 4px", borderRadius:10, fontSize:"0.95rem", cursor:"pointer", background: selected ? C.mocha : today_ ? "rgba(160,105,74,0.12)" : "transparent", color: selected ? "#fff" : today_ ? C.mocha : C.ink, fontWeight: today_ || selected ? 800 : 400, border: today_ && !selected ? `1.5px solid ${C.mocha}` : "1.5px solid transparent", transition:"all 0.15s", position:"relative" }}>
                {d}
                {event && <div style={{ width:5, height:5, borderRadius:"50%", background:selected?"#fff":C.dustRose, margin:"3px auto 0" }}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day events OR upcoming events */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        {/* Selected / upcoming events */}
        <div style={cardS()}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.85rem" }}>
            {selectedDay
              ? `📍 ${MONTH_NAMES[viewMonth]} ${selectedDay}`
              : "📍 Upcoming Events"}
          </div>
          {selectedDay && selectedEvents.length === 0 && (
            <div style={{ color:C.muted, fontSize:"0.92rem", padding:"1rem 0", textAlign:"center" }}>No events on this day</div>
          )}
          {(selectedDay ? selectedEvents : upcomingKeys.flatMap(k => (EVENTS[k] || []).map(e => ({ ...e, _key:k })))).map((ev, idx) => (
            <div key={idx} style={{ display:"flex", alignItems:"center", gap:"0.72rem", padding:"0.75rem 0.9rem", borderRadius:10, marginBottom:"0.5rem", background:C.card2, border:`1px solid ${C.border}` }}>
              <div style={{ width:9, height:9, borderRadius:"50%", background:ev.color, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.95rem", fontWeight:700, color:C.ink }}>{ev.title}</div>
                <div style={{ fontSize:"0.8rem", color:C.muted, marginTop:2 }}>{ev._key ? ev._key.split("-").slice(1).map((v,i)=>i===0?MONTH_NAMES[Number(v)-1]:v).join(" ") + " · " : ""}{ev.sub}</div>
              </div>
              <div style={{ fontSize:"0.82rem", color:C.muted, fontWeight:600 }}>{ev.time}</div>
            </div>
          ))}
          {!selectedDay && upcomingKeys.length === 0 && (
            <div style={{ color:C.muted, fontSize:"0.92rem", padding:"1rem 0", textAlign:"center" }}>No upcoming events</div>
          )}
        </div>

        {/* AI reminder */}
        <div style={cardS()}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.85rem" }}>🤖 AI Reminders</div>
          <AlertS type="info" icon="🤖">Emma's annual physical is due in 3 weeks. Book with Dr. Smith?</AlertS>
          <AlertS type="warn" icon="💊">Daily allergy medication reminder — 8:00 AM every morning.</AlertS>
          <AlertS type="success" icon="🦷">Dental cleaning coming up Feb 27 with Dr. Lee DDS.</AlertS>
          <div style={{ marginTop:"0.9rem", padding:"0.75rem 0.95rem", background:C.card2, borderRadius:10, border:`1px solid ${C.border}`, fontSize:"0.88rem", color:C.muted, lineHeight:1.65 }}>
            💡 Tip: Click any day on the calendar to see events for that date.
          </div>
        </div>
      </div>
    </>
  );
}
