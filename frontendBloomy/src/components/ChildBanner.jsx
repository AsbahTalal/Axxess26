import { C } from "../constants";

export default function ChildBanner({ child, setDashPage }) {
  return (
    <div style={{ background:`linear-gradient(135deg, ${C.mocha}22 0%, ${C.caramel}18 50%, ${C.lavBlush}14 100%)`, border:`1px solid ${C.border}`, borderRadius:20, padding:"1.4rem 1.8rem", marginBottom:"1.2rem", display:"flex", alignItems:"center", gap:"1.5rem", position:"relative", overflow:"hidden" }}>
      {/* Decorative blob */}
      <div style={{ position:"absolute", right:-30, top:-30, width:140, height:140, borderRadius:"50%", background:`${C.mocha}10` }}/>

      {/* Avatar */}
      <div style={{ width:76, height:76, borderRadius:"50%", background:`linear-gradient(135deg,${C.mochaL},${C.caramel})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.4rem", border:`3px solid ${C.card}`, boxShadow:"0 4px 18px rgba(160,105,74,0.2)", flexShrink:0 }}>
        {child.avatar}
      </div>

      {/* Name + watch status */}
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.3rem" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.5rem", color:C.ink }}>{child.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", fontSize:"0.72rem", color:C.sage, fontWeight:700, background:"rgba(127,174,132,0.1)", border:"1px solid rgba(127,174,132,0.22)", borderRadius:99, padding:"2px 8px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.sage, animation:"pulse 2s infinite" }}/>Watch Connected
          </div>
        </div>
        <div style={{ display:"flex", gap:"1.4rem", flexWrap:"wrap" }}>
          {[
            { label:"Age",        value:`${child.age} yrs`                   },
            { label:"Height",     value:child.height                          },
            { label:"Weight",     value:child.weight                          },
            { label:"Gender",     value:child.gender === "girl" ? "Girl" : "Boy" },
            { label:"Blood Type", value:child.bloodType                       },
            { label:"Doctor",     value:child.doctor                          },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize:"0.64rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:700 }}>{label}</div>
              <div style={{ fontSize:"0.88rem", fontWeight:700, color:C.ink, marginTop:1 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness score mini ring */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.2rem" }}>
        <svg width="62" height="62" viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="24" fill="none" stroke={C.cream} strokeWidth="5.5"/>
          <circle cx="31" cy="31" r="24" fill="none" stroke={C.mocha} strokeWidth="5.5"
            strokeDasharray="150" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90 31 31)" opacity="0.7"/>
          <text x="31" y="35" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="12" fill={C.mocha}>80</text>
        </svg>
        <div style={{ fontSize:"0.65rem", color:C.muted, fontWeight:700 }}>Wellness</div>
      </div>

      {/* Edit button */}
      <button onClick={() => setDashPage("settings")} style={{ position:"absolute", top:"1rem", right:"1rem", padding:"5px 12px", border:`1px solid ${C.border}`, borderRadius:8, background:C.card, fontSize:"0.72rem", fontWeight:700, color:C.muted }}>✏️ Edit</button>
    </div>
  );
}
