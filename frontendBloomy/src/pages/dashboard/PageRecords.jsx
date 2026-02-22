import { C, cardS } from "../../constants";
import { CT } from "../../components/Shared";

export default function PageRecords() {
  return (
    <>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:C.ink, marginBottom:"0.22rem" }}>📋 Medical <span style={{ color:C.mocha }}>Records</span></div>
      <div style={{ color:C.muted, fontSize:"0.83rem", marginBottom:"1.2rem" }}>Upload records for AI-powered health predictions</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.82rem" }}>
        {/* Upload + file list */}
        <div style={cardS()}>
          <CT>📤 Upload Records</CT>
          <div style={{ border:`2px dashed ${C.ghost}`, borderRadius:12, padding:"1.8rem", textAlign:"center", cursor:"pointer", marginBottom:"0.9rem", background:"rgba(160,105,74,0.03)" }}>
            <div style={{ fontSize:"1.9rem", marginBottom:"0.45rem" }}>📄</div>
            <div style={{ fontWeight:700, marginBottom:"0.28rem", color:C.ink }}>Drop files or click to upload</div>
            <div style={{ fontSize:"0.76rem", color:C.muted }}>PDF, JPEG, PNG · Max 20MB</div>
          </div>
          <CT>📁 Uploaded Records</CT>
          {[
            [C.mocha,    "Annual Physical 2025.pdf",  "Jan 15, 2025"],
            [C.sage,     "Allergy Test Results.pdf",  "Aug 3, 2024" ],
            [C.lavBlush, "Blood Panel Results.jpg",   "Nov 10, 2024"],
          ].map(([col, name, sub]) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:"0.62rem", padding:"0.58rem 0.78rem", borderRadius:10, background:C.card2, border:`1px solid ${C.border}`, marginBottom:"0.32rem" }}>
              <div style={{ width:7.5, height:7.5, borderRadius:"50%", background:col }}/>
              <div>
                <div style={{ fontSize:"0.79rem", fontWeight:700, color:C.ink }}>{name}</div>
                <div style={{ fontSize:"0.66rem", color:C.muted }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI predictions */}
        <div style={cardS()}>
          <CT>🔮 AI Health Predictions</CT>
          <div style={{ fontSize:"0.76rem", color:C.muted, marginBottom:"0.85rem" }}>Based on Emma's records, vitals &amp; wearable data</div>

          <div style={{ fontSize:"0.68rem", fontWeight:800, color:C.dustRose, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.5rem" }}>⚠️ Watch &amp; Monitor</div>
          {[
            [C.dustRose, "🤧", "Seasonal Allergy Flare-Up",    "Spring pollen approaching — 78% likelihood"           ],
            [C.caramel,  "😴", "Sleep Pattern Disruption",      "Wednesday dips correlate with school stress — 62%"   ],
          ].map(([bd, icon, title, desc]) => (
            <div key={title} style={{ display:"flex", gap:"0.62rem", padding:"0.68rem 0.82rem", borderRadius:10, marginBottom:"0.42rem", background:C.card2, borderLeft:`2.5px solid ${bd}` }}>
              <span style={{ fontSize:"0.95rem" }}>{icon}</span>
              <div>
                <div style={{ fontSize:"0.79rem", fontWeight:700, color:C.ink }}>{title}</div>
                <div style={{ fontSize:"0.68rem", color:C.muted, marginTop:2 }}>{desc}</div>
              </div>
            </div>
          ))}

          <div style={{ fontSize:"0.68rem", fontWeight:800, color:C.sage, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0.8rem 0 0.5rem" }}>✅ Looking Good</div>
          {[
            [C.sage, "❤️", "Cardiovascular Health", "Heart rate trends are excellent for Emma's age"     ],
            [C.sage, "🦴", "Growth & Development",   "On track with developmental milestones"            ],
          ].map(([bd, icon, title, desc]) => (
            <div key={title} style={{ display:"flex", gap:"0.62rem", padding:"0.68rem 0.82rem", borderRadius:10, marginBottom:"0.42rem", background:C.card2, borderLeft:`2.5px solid ${bd}` }}>
              <span style={{ fontSize:"0.95rem" }}>{icon}</span>
              <div>
                <div style={{ fontSize:"0.79rem", fontWeight:700, color:C.ink }}>{title}</div>
                <div style={{ fontSize:"0.68rem", color:C.muted, marginTop:2 }}>{desc}</div>
              </div>
            </div>
          ))}

          <div style={{ fontSize:"0.66rem", color:C.muted, marginTop:"0.8rem", padding:"0.62rem 0.78rem", background:C.card2, borderRadius:8, lineHeight:1.6 }}>
            ⚕️ AI predictions are informational only. Always consult Emma's doctor.
          </div>
        </div>
      </div>
    </>
  );
}
