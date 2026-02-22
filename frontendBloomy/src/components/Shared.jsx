import { C } from "../constants";

export function FLabel({ children }) {
  return <div style={{ fontSize:"0.73rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"0.38rem", fontWeight:700 }}>{children}</div>;
}

export function BloomBtn({ children, onClick }) {
  return (
    <button onClick={onClick}
      style={{ width:"100%", padding:"0.82rem 1.5rem", border:"none", borderRadius:13, background:`linear-gradient(135deg,${C.mochaL},${C.mocha})`, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.97rem", color:"#fff", boxShadow:"0 4px 15px rgba(160,105,74,0.24)", letterSpacing:"0.08px" }}
      onMouseOver={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 7px 22px rgba(160,105,74,0.3)"; }}
      onMouseOut={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 15px rgba(160,105,74,0.24)"; }}>
      {children}
    </button>
  );
}

export function Divider() {
  return <hr style={{ border:"none", borderTop:`1px solid ${C.border}`, margin:"1.1rem 0" }}/>;
}

export function CT({ children }) {
  return <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.91rem", marginBottom:"0.85rem", color:C.ink, display:"flex", alignItems:"center", gap:"0.42rem" }}>{children}</div>;
}

export function AlertS({ type, icon, children }) {
  const t = {
    warn:    { bg:"rgba(192,96,96,0.07)",    bd:"rgba(192,96,96,0.18)"    },
    success: { bg:"rgba(95,173,116,0.07)",   bd:"rgba(95,173,116,0.18)"   },
    info:    { bg:"rgba(160,105,74,0.06)",   bd:"rgba(160,105,74,0.16)"   },
  }[type];
  return (
    <div style={{ borderRadius:10, padding:"0.78rem 0.95rem", display:"flex", alignItems:"center", gap:"0.62rem", marginBottom:"0.48rem", fontSize:"0.81rem", fontWeight:500, color:C.ink, background:t.bg, border:`1px solid ${t.bd}` }}>
      <span>{icon}</span><span>{children}</span>
    </div>
  );
}

export function StatCard({ icon, label, value, unit, trend, ok, color }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"1.4rem", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:"0.85rem", top:"0.85rem", fontSize:"1.7rem", opacity:0.11 }}>{icon}</div>
      <div style={{ fontSize:"0.68rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.33rem" }}>{label}</div>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.65rem", color }}>
        {value}<span style={{ fontSize:"0.8rem", fontWeight:400, color:C.muted, marginLeft:2 }}>{unit}</span>
      </div>
      <div style={{ fontSize:"0.68rem", marginTop:"0.22rem", color:ok?C.sage:C.dustRose, fontWeight:700 }}>{trend}</div>
    </div>
  );
}

export function BarChart({ data, color, max = 100, ySteps = 4, barW = 32, barH = 120 }) {
  const yTicks = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round(max * (ySteps - i) / ySteps)
  );

  return (
    <div style={{ display:"flex", gap:4 }}>
      {/* Y-axis */}
      <div style={{ width:34, flexShrink:0 }}>
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", height:barH }}>
          {yTicks.map(v => (
            <div key={v} style={{ fontSize:"0.62rem", color:C.muted, textAlign:"right", lineHeight:1, fontWeight:600 }}>{v}</div>
          ))}
        </div>
        <div style={{ height:22 }}/>
      </div>

      {/* Scrollable chart area */}
      <div style={{ flex:1, overflowX:"auto", minWidth:0 }}>
        {/* Bars — flex:1 so they fill the width; minWidth prevents them from getting too narrow */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:barH }}>
          {data.map((d,i) => (
            <div key={i} style={{ flex:1, minWidth:barW, height:"100%", display:"flex", alignItems:"flex-end" }}>
              <div title={String(d.v)} style={{ width:"100%", height:`${Math.max((d.v/max)*100,2)}%`, borderRadius:"5px 5px 0 0", background:`linear-gradient(180deg,${color},${color}3A)`, border:i===data.length-1?`1.5px solid ${color}`:"none" }}/>
            </div>
          ))}
        </div>
        {/* Labels */}
        <div style={{ display:"flex", gap:5, borderTop:`1px solid ${C.border}`, paddingTop:4 }}>
          {data.map((d,i) => (
            <div key={i} style={{ flex:1, minWidth:barW, textAlign:"center", fontSize:"0.6rem", color:i===data.length-1?C.mocha:C.muted, fontWeight:i===data.length-1?800:500 }}>{d.l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
