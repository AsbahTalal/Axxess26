import { C, cardS, WK } from "../../constants";
import { CT, BarChart } from "../../components/Shared";
import MoodRow from "../../components/MoodRow";

export default function PageWellness({ moodLog, setMoodLog, fireNotif }) {
  return (
    <>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:C.ink, marginBottom:"0.22rem" }}>📈 Wellness <span style={{ color:C.mocha }}>Trends</span></div>
      <div style={{ color:C.muted, fontSize:"0.83rem", marginBottom:"1.2rem" }}>Emma's health data this week</div>

      {/* Chart grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.82rem", marginBottom:"0.82rem" }}>
        {[
          { title:"❤️ Heart Rate (bpm)",   color:C.dustRose, note:"Avg 86 bpm · Range 75–98",  data:WK.map((d,i) => ({ ...d, p:[72,80,65,88,70,60,75][i] })) },
          { title:"💤 Sleep (hrs)",         color:C.lavBlush, note:"Avg 9.2 hrs · Target 9–11", data:WK.map((d,i) => ({ ...d, p:[90,85,75,95,80,70,95][i] })) },
          { title:"💧 Hydration (glasses)", color:C.mocha,    note:"Avg 5.1/6 · Today 3/6 ⚠️", data:WK.map((d,i) => ({ ...d, p:[100,83,67,100,83,100,50][i] })) },
          { title:"😊 Mood Score",          color:C.caramel,  note:"Mostly positive · Dip Wed",  data:WK.map((d,i) => ({ ...d, p:[100,80,60,90,100,75,80][i] })) },
        ].map(({ title, color, note, data }) => (
          <div key={title} style={cardS()}>
            <CT>{title}</CT>
            <BarChart data={data} color={color}/>
            <div style={{ fontSize:"0.68rem", color:C.muted, marginTop:"0.48rem", fontWeight:600 }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Mood history */}
      <div style={cardS({ marginBottom:"0.82rem" })}>
        <CT>😊 7-Day Mood History</CT>
        <div style={{ color:C.muted, fontSize:"0.78rem", marginBottom:"0.7rem" }}>Green = Happy · Red = Sad · Click today to log</div>
        <MoodRow moodLog={moodLog} setMoodLog={setMoodLog} fireNotif={fireNotif}/>
        <div style={{ display:"flex", gap:"0.85rem", marginTop:"0.9rem", flexWrap:"wrap" }}>
          <div style={{ background:"rgba(95,173,116,0.09)", border:`1px solid rgba(95,173,116,0.22)`, borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.76rem", fontWeight:700, color:C.sage }}>😊 Happy this week: <strong>5 days</strong></div>
          <div style={{ background:"rgba(192,96,96,0.09)", border:`1px solid rgba(192,96,96,0.22)`, borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.76rem", fontWeight:700, color:C.dustRose }}>😔 Sad: <strong>1 day</strong></div>
          <div style={{ background:"rgba(160,105,74,0.07)", border:`1px solid ${C.border}`, borderRadius:9, padding:"0.55rem 0.85rem", fontSize:"0.76rem", fontWeight:700, color:C.mocha }}>Overall: <strong>Mostly Positive 🌸</strong></div>
        </div>
      </div>

      {/* Weekly summary */}
      <div style={cardS()}>
        <CT>📊 Weekly Summary</CT>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.9rem", textAlign:"center" }}>
          {[["82","Avg Score",C.mocha],["6/7","Exercise Days",C.sage],["9.2h","Avg Sleep",C.lavBlush],["5/7 😊","Happy Days",C.caramel]].map(([val,sub,col]) => (
            <div key={sub}>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.45rem", color:col }}>{val}</div>
              <div style={{ fontSize:"0.71rem", color:C.muted, marginTop:"0.22rem" }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
