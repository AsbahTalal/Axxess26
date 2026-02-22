import { C } from "../constants";

export default function MoodRow({ moodLog, setMoodLog, fireNotif }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:"0.45rem" }}>
      {moodLog.map((m, i) => {
        const isToday = i === moodLog.length - 1;
        return (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div
              onClick={isToday ? () => {
                const h = !moodLog[i].happy;
                setMoodLog(p => p.map((x, j) => j === i ? { ...x, happy: h } : x));
                fireNotif("😊 Mood Logged", h ? "Emma said she's having fun! 🌸" : "Emma said today wasn't great. 💛");
              } : undefined}
              style={{
                width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem",
                background: m.happy === null ? C.card2 : m.happy ? "rgba(95,173,116,0.15)" : "rgba(192,96,96,0.13)",
                border: m.happy === null ? `1.5px solid ${C.border}` : m.happy ? `1.5px solid ${C.sage}` : `1.5px solid ${C.dustRose}`,
                cursor: isToday ? "pointer" : "default",
              }}>
              {m.happy === null ? (isToday ? "?" : "·") : m.happy ? "😊" : "😔"}
            </div>
            <span style={{ fontSize:"0.56rem", color:C.muted }}>{m.date}</span>
          </div>
        );
      })}
    </div>
  );
}
