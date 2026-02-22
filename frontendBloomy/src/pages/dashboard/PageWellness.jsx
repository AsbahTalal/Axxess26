import { useState } from "react";
import { C, cardS } from "../../constants";
import { BarChart } from "../../components/Shared";
import MoodRow from "../../components/MoodRow";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// 8 weeks of data (oldest → newest). Index 7 = current week (Feb 22–28).
const WEEK_DATA = [
  { label:"Jan 4 – Jan 10",   score:74, hr:[78,80,72,85,77,82,75],  sleep:[9.0,9.2,8.5,9.5,8.8,9.3,9.1],  hyd:[4,5,4,6,5,5,3], mood:[75,80,70,85,80,75,70] },
  { label:"Jan 11 – Jan 17",  score:77, hr:[75,83,80,77,88,74,81],  sleep:[9.3,8.8,9.6,9.0,8.7,9.4,9.2],  hyd:[5,4,6,5,4,6,5], mood:[80,75,85,90,70,85,80] },
  { label:"Jan 18 – Jan 24",  score:80, hr:[80,76,84,79,82,71,85],  sleep:[8.9,9.5,8.6,9.2,9.0,9.7,8.8],  hyd:[4,6,5,4,6,5,4], mood:[85,80,90,75,85,80,90] },
  { label:"Jan 25 – Jan 31",  score:82, hr:[77,82,75,88,80,73,86],  sleep:[9.1,9.0,9.4,8.7,9.3,9.8,9.0],  hyd:[5,5,4,6,5,4,6], mood:[80,85,75,90,85,80,85] },
  { label:"Feb 1 – Feb 7",    score:79, hr:[82,77,85,72,80,88,75],  sleep:[9.0,9.4,8.6,9.8,8.9,10.0,9.2], hyd:[4,5,6,3,5,6,4], mood:[75,80,90,65,85,90,80] },
  { label:"Feb 8 – Feb 14",   score:81, hr:[78,82,75,80,85,72,79],  sleep:[9.2,8.5,9.8,7.5,9.1,10.2,9.5], hyd:[5,6,4,6,5,4,6], mood:[85,75,65,90,95,80,85] },
  { label:"Feb 15 – Feb 21",  score:78, hr:[76,83,88,71,84,77,80],  sleep:[8.8,9.0,7.8,9.3,9.7,8.4,9.5],  hyd:[5,3,5,6,4,5,3], mood:[85,70,60,90,95,80,75] },
  { label:"Feb 22 – Feb 28",  score:85, hr:[80,78,82,75,84,79,83],  sleep:[9.5,9.2,8.8,9.0,9.4,10.1,9.7], hyd:[3,5,4,6,5,5,4], mood:[80,85,75,90,85,95,80] },
];

function mkData(vals) {
  return DAYS.map((l, i) => ({ l, v: vals[i] }));
}

const TREND_DATA = WEEK_DATA.map(w => ({
  l: w.label.split(" – ")[0].replace("January","Jan").replace("February","Feb"),
  v: w.score,
}));

export default function PageWellness({ child, moodLog, setMoodLog, fireNotif }) {
  const [weekIdx, setWeekIdx] = useState(WEEK_DATA.length - 1); // start at current week
  const week = WEEK_DATA[weekIdx];
  const isCurrentWeek = weekIdx === WEEK_DATA.length - 1;

  return (
    <>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2rem", color:C.ink, marginBottom:"0.28rem" }}>📈 Wellness <span style={{ color:C.mocha }}>Trends</span></div>
      <div style={{ color:C.muted, fontSize:"1rem", marginBottom:"1.2rem", fontWeight:600 }}>{child.name}'s health data by week · use arrows to browse</div>

      {/* Week navigation */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"0.75rem 1.2rem", marginBottom:"1rem" }}>
        <button onClick={() => setWeekIdx(i => Math.max(0, i - 1))} disabled={weekIdx === 0}
          style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${weekIdx===0?C.border:C.mocha}`, background:"transparent", color:weekIdx===0?C.ghost:C.mocha, fontWeight:800, fontSize:"1.1rem", cursor:weekIdx===0?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>◀</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1rem", color:C.ink }}>{week.label}</div>
          {isCurrentWeek && <div style={{ fontSize:"0.75rem", color:C.mocha, fontWeight:700, marginTop:2 }}>Current Week</div>}
        </div>
        <button onClick={() => setWeekIdx(i => Math.min(WEEK_DATA.length - 1, i + 1))} disabled={isCurrentWeek}
          style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${isCurrentWeek?C.border:C.mocha}`, background:"transparent", color:isCurrentWeek?C.ghost:C.mocha, fontWeight:800, fontSize:"1.1rem", cursor:isCurrentWeek?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>▶</button>
      </div>

      {/* Chart grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        {[
          { title:"❤️ Heart Rate",   sub:"(bpm)",     color:C.dustRose, note:`Avg ${Math.round(week.hr.reduce((a,b)=>a+b,0)/7)} bpm · Range ${Math.min(...week.hr)}–${Math.max(...week.hr)}`,   data:mkData(week.hr),   max:120, ySteps:4 },
          { title:"💤 Sleep",         sub:"(hrs)",     color:C.lavBlush, note:`Avg ${(week.sleep.reduce((a,b)=>a+b,0)/7).toFixed(1)} hrs · Target 9–11 hrs`,  data:mkData(week.sleep), max:12,  ySteps:4 },
          { title:"💧 Hydration",     sub:"(glasses)", color:C.mocha,    note:`Avg ${(week.hyd.reduce((a,b)=>a+b,0)/7).toFixed(1)} / 6 glasses`,               data:mkData(week.hyd),   max:6,   ySteps:3 },
          { title:"😊 Mood Score",    sub:"(/100)",    color:C.caramel,  note:`Avg ${Math.round(week.mood.reduce((a,b)=>a+b,0)/7)} · Weekly health score ${week.score}`, data:mkData(week.mood),  max:100, ySteps:4 },
        ].map(({ title, sub, color, note, data, max, ySteps }) => (
          <div key={title} style={cardS()}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.22rem", display:"flex", alignItems:"baseline", gap:"0.38rem" }}>
              {title} <span style={{ fontSize:"0.8rem", color:C.muted, fontWeight:600 }}>{sub}</span>
            </div>
            <BarChart data={data} color={color} max={max} ySteps={ySteps} barW={22}/>
            <div style={{ fontSize:"0.82rem", color:C.muted, marginTop:"0.55rem", fontWeight:700 }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Mood history */}
      <div style={cardS({ marginBottom:"1rem" })}>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.6rem" }}>😊 7-Day Mood History</div>
        <div style={{ color:C.muted, fontSize:"0.88rem", marginBottom:"0.8rem" }}>Green = Happy · Red = Upset · Click today to log</div>
        <MoodRow moodLog={moodLog} setMoodLog={setMoodLog} fireNotif={fireNotif}/>
        <div style={{ display:"flex", gap:"0.85rem", marginTop:"0.9rem", flexWrap:"wrap" }}>
          <div style={{ background:"rgba(95,173,116,0.09)", border:`1px solid rgba(95,173,116,0.22)`, borderRadius:9, padding:"0.55rem 0.9rem", fontSize:"0.85rem", fontWeight:700, color:C.sage }}>😊 Happy this week: <strong>5 days</strong></div>
          <div style={{ background:"rgba(192,96,96,0.09)", border:`1px solid rgba(192,96,96,0.22)`, borderRadius:9, padding:"0.55rem 0.9rem", fontSize:"0.85rem", fontWeight:700, color:C.dustRose }}>😔 Upset: <strong>1 day</strong></div>
          <div style={{ background:"rgba(160,105,74,0.07)", border:`1px solid ${C.border}`, borderRadius:9, padding:"0.55rem 0.9rem", fontSize:"0.85rem", fontWeight:700, color:C.mocha }}>Overall: <strong>Mostly Positive 🌸</strong></div>
        </div>
      </div>

      {/* Total health trend */}
      <div style={cardS({ marginBottom:"1rem" })}>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.3rem" }}>📊 Total Health Trend</div>
        <div style={{ fontSize:"0.88rem", color:C.muted, marginBottom:"1rem", fontWeight:600 }}>Emma's overall wellness score across the last 8 weeks · higher is better</div>
        <BarChart data={TREND_DATA} color={C.mocha} max={100} ySteps={4} barW={48} barH={140}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.9rem", padding:"0.75rem 1rem", background:C.card2, borderRadius:10, border:`1px solid ${C.border}` }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", color:C.sage }}>{Math.max(...WEEK_DATA.map(w=>w.score))}</div>
            <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:2 }}>Peak Score</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", color:C.mocha }}>{Math.round(WEEK_DATA.reduce((a,w)=>a+w.score,0)/WEEK_DATA.length)}</div>
            <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:2 }}>8-Week Avg</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", color:week.score >= WEEK_DATA[weekIdx-1]?.score ? C.sage : C.dustRose }}>
              {week.score >= (WEEK_DATA[weekIdx-1]?.score ?? week.score) ? "▲" : "▼"} {Math.abs(week.score - (WEEK_DATA[weekIdx-1]?.score ?? week.score))} pts
            </div>
            <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:2 }}>vs Last Week</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", color:C.lavBlush }}>{week.score}</div>
            <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:2 }}>This Week</div>
          </div>
        </div>
      </div>

      {/* Weekly summary */}
      <div style={cardS()}>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"1rem" }}>📋 Week at a Glance</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.9rem", textAlign:"center" }}>
          {[
            [week.score, "Wellness Score", C.mocha],
            [`${Math.round(week.hr.reduce((a,b)=>a+b,0)/7)} bpm`, "Avg Heart Rate", C.dustRose],
            [`${(week.sleep.reduce((a,b)=>a+b,0)/7).toFixed(1)} hrs`, "Avg Sleep", C.lavBlush],
            [`${(week.hyd.reduce((a,b)=>a+b,0)/7).toFixed(1)}/6 💧`, "Avg Hydration", C.caramel],
          ].map(([val,sub,col]) => (
            <div key={sub} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:12, padding:"0.9rem 0.5rem" }}>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:col }}>{val}</div>
              <div style={{ fontSize:"0.82rem", color:C.muted, marginTop:"0.28rem", fontWeight:600 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
