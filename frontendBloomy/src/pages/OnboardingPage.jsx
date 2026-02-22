import { useEffect } from "react";
import { C, G, STEPS, ALLERGIES, fmt } from "../constants";

// ── Stable helper components (module-level = same reference every render) ──
const oInpStyle = {
  height:47, padding:"0 15px", border:`1.5px solid ${C.border}`,
  borderRadius:13, fontFamily:"'Nunito',sans-serif", fontSize:14.5,
  color:C.ink, background:C.card, outline:"none", width:"100%", appearance:"none",
};

function OInp(props) {
  return <input {...props} style={{ ...oInpStyle, ...props.style }}/>;
}

function OLab({ children }) {
  return <label style={{ fontSize:12.5, fontWeight:800, color:C.ink, display:"block", marginBottom:6 }}>{children}</label>;
}

function SidebarStep({ index, label, step, setStep }) {
  const st = index < step ? "done" : index === step ? "active" : "idle";
  return (
    <div onClick={() => setStep(index)} style={{ display:"flex", alignItems:"flex-start", gap:15, padding:"13px 0", cursor:"pointer", position:"relative" }}>
      {index < 3 && <div style={{ position:"absolute", left:16, top:48, width:2, height:"calc(100% - 16px)", background:st==="done"?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)" }}/>}
      <div style={{ width:34, height:34, minWidth:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12.5, fontWeight:800, zIndex:1,
        background:st==="active"?"rgba(255,255,255,0.88)":st==="done"?"rgba(255,255,255,0.22)":"transparent",
        border:st==="idle"?"2px solid rgba(255,255,255,0.22)":st==="done"?"2px solid rgba(255,255,255,0.4)":"2px solid rgba(255,255,255,0.88)",
        color:st==="active"?C.mocha:st==="done"?"#fff":"rgba(255,255,255,0.32)",
        boxShadow:st==="active"?"0 0 0 4px rgba(255,255,255,0.13)":"none" }}>
        {st==="done"?"✓":index}
      </div>
      <div style={{ paddingTop:6 }}>
        <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:"1.1px", textTransform:"uppercase", marginBottom:3, color:st==="active"?"rgba(255,255,255,0.88)":st==="done"?"rgba(255,255,255,0.52)":"rgba(255,255,255,0.26)" }}>
          {st==="active"?`Step ${index} — Current`:`Step ${index}`}
        </div>
        <div style={{ fontSize:13.5, fontWeight:700, color:st==="active"?"#fff":st==="done"?"rgba(255,255,255,0.58)":"rgba(255,255,255,0.24)" }}>{label}</div>
      </div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────

export default function OnboardingPage({
  setScreen, step, setStep, gender, setGender,
  allergies, toggleAllergy, bedMin, wakeMin,
  obForm, setObForm, adjustTime, finalizeOnboarding,
}) {
  useEffect(() => { setStep(1); }, []);

  const pct  = `${(step / 3) * 100}%`;
  const info = STEPS[step - 1];

  // Step panels — called as plain functions, not JSX components
  const renderStep1 = () => (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px 28px" }}>
      <div style={{ gridColumn:"span 2" }}>
        <OLab>Child's Full Name <span style={{ color:C.mocha }}>*</span></OLab>
        <OInp type="text" placeholder="e.g. Emma Johnson" value={obForm.name} onChange={e => setObForm(p => ({ ...p, name:e.target.value }))}/>
      </div>
      <div style={{ gridColumn:"span 2" }}>
        <OLab>Gender <span style={{ color:C.mocha }}>*</span></OLab>
        <div style={{ display:"flex", gap:13 }}>
          {[["girl","👧","Girl"],["boy","👦","Boy"]].map(([val,icon,lbl]) => (
            <div key={val} onClick={() => setGender(val)} style={{ flex:1, border:`1.5px solid ${gender===val?C.mocha:C.border}`, borderRadius:13, padding:"16px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, background:gender===val?"rgba(160,105,74,0.06)":C.card, boxShadow:gender===val?"0 0 0 3px rgba(160,105,74,0.1)":"none", transition:"all 0.18s" }}>
              <span style={{ fontSize:28 }}>{icon}</span>
              <span style={{ fontSize:14.5, fontWeight:800, color:C.ink }}>{lbl}</span>
              <div style={{ marginLeft:"auto", width:20, height:20, borderRadius:"50%", border:`2px solid ${gender===val?C.mocha:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", background:gender===val?C.mocha:"transparent" }}>{gender===val?"✓":""}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <OLab>Date of Birth <span style={{ color:C.mocha }}>*</span></OLab>
        <OInp type="date" value={obForm.dob} onChange={e => setObForm(p => ({ ...p, dob:e.target.value }))}/>
      </div>
      <div>
        <OLab>Region</OLab>
        <select style={{ ...oInpStyle }} value={obForm.region} onChange={e => setObForm(p => ({ ...p, region:e.target.value }))}>
          <option value="">Select region</option>
          <option>United States</option><option>United Kingdom</option><option>South Korea</option><option>Japan</option><option>Other</option>
        </select>
      </div>
      <div>
        <OLab>Height</OLab>
        <OInp type="text" placeholder="e.g. 115 cm" value={obForm.height} onChange={e => setObForm(p => ({ ...p, height:e.target.value }))}/>
      </div>
      <div>
        <OLab>Weight</OLab>
        <OInp type="text" placeholder="e.g. 22 kg" value={obForm.weight} onChange={e => setObForm(p => ({ ...p, weight:e.target.value }))}/>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <>
      <label style={{ fontSize:12.5, fontWeight:800, color:C.ink, marginBottom:13, display:"block" }}>Known Allergies <span style={{ color:C.mocha }}>*</span></label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
        {ALLERGIES.map(tag => (
          <button key={tag} onClick={() => toggleAllergy(tag)} style={{ padding:"8px 16px", border:`1.5px solid ${allergies.includes(tag)?C.mocha:C.border}`, borderRadius:99, background:allergies.includes(tag)?"rgba(160,105,74,0.08)":C.card, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:700, color:allergies.includes(tag)?C.mocha:C.mid, transition:"all 0.17s" }}>{tag}</button>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:13, margin:"28px 0 24px" }}>
        <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:10.5, fontWeight:800, letterSpacing:"1.1px", textTransform:"uppercase", color:C.muted, whiteSpace:"nowrap" }}>Medical Documents</span><div style={{ flex:1, height:1, background:C.border }}/>
      </div>
      <div style={{ border:`1.5px dashed ${C.ghost}`, borderRadius:13, padding:"26px 28px", background:C.card, display:"flex", alignItems:"center", gap:22, cursor:"pointer" }}>
        <div style={{ width:50, height:50, background:C.card2, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>📋</div>
        <div><div style={{ fontSize:14.5, fontWeight:800, color:C.ink, marginBottom:3 }}>Attach Medical History</div><div style={{ fontSize:12.5, color:C.muted }}>PDF, JPG, PNG — up to 10MB per file</div></div>
        <button style={{ marginLeft:"auto", padding:"9px 18px", border:`1.5px solid ${C.border}`, borderRadius:9, background:C.card, fontSize:12.5, fontWeight:700, color:C.mid }}>Browse Files</button>
      </div>
      <div style={{ display:"flex", gap:11, background:"rgba(160,105,74,0.07)", border:`1px solid rgba(160,105,74,0.18)`, borderRadius:13, padding:"13px 16px", marginTop:13 }}>
        <span>💡</span><p style={{ fontSize:12.5, color:C.mocha, fontWeight:600, lineHeight:1.55, margin:0 }}>You can skip this and upload medical records anytime from the dashboard.</p>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div style={{ border:`1.5px solid ${C.border}`, borderRadius:13, background:C.card, overflow:"hidden", marginBottom:18 }}>
        {[["bed","🌙","#1A1208","Bedtime",fmt(bedMin),false],["wake","☀️",C.card2,"Wake-up",fmt(wakeMin),true]].map(([type,icon,bg,label,time,last]) => (
          <div key={type} style={{ display:"flex", alignItems:"center", padding:"18px 22px", gap:17, borderBottom:last?"none":`1px solid ${C.border}` }}>
            <div style={{ width:42, height:42, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, background:bg }}>{icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:1, textTransform:"uppercase", color:C.muted, marginBottom:2 }}>{label}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:C.ink }}>{time}</div>
            </div>
            <div style={{ display:"flex", gap:9 }}>
              <button onClick={() => adjustTime(type, -30)} style={{ width:34, height:34, borderRadius:9, border:`1.5px solid ${C.border}`, background:C.card, fontSize:17, fontWeight:700, color:C.mid, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
              <button onClick={() => adjustTime(type,  30)} style={{ width:34, height:34, borderRadius:9, border:`1.5px solid ${C.border}`, background:C.card, fontSize:17, fontWeight:700, color:C.mid, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:11, background:"rgba(160,105,74,0.07)", border:`1px solid rgba(160,105,74,0.18)`, borderRadius:13, padding:"13px 16px" }}>
        <span>🌙</span><p style={{ fontSize:12.5, color:C.mocha, fontWeight:600, lineHeight:1.55, margin:0 }}>During bedtime hours the smartwatch activates quiet mode — dimming the display and suppressing all activity nudges until morning.</p>
      </div>
    </>
  );

  return (
    <>
      <style>{G}</style>
      <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Nunito',sans-serif", background:C.bg, color:C.ink }}>
        {/* Sidebar */}
        <aside style={{ width:292, minWidth:292, background:C.sidebar, minHeight:"100vh", display:"flex", flexDirection:"column", padding:"38px 30px", position:"sticky", top:0, height:"100vh" }}>
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:48 }}>
            <div style={{ width:40, height:40, background:"rgba(255,255,255,0.13)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19 }}>🌸</div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700, color:"#fff" }}>bloomy.</span>
          </div>
          <nav style={{ flex:1 }}>
            {STEPS.map((s,i) => (
              <SidebarStep key={i} index={i+1} label={s.label} step={step} setStep={setStep}/>
            ))}
          </nav>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.12)", paddingTop:22 }}>
            <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.48)", lineHeight:1.7, display:"flex", gap:8, margin:0 }}><span>🔒</span><span>Your child's data is encrypted and never shared.</span></p>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto" }}>
          {/* Header progress bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"19px 52px", background:C.card, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
            <span style={{ fontSize:12.5, fontWeight:700, color:C.muted }}>Step <strong style={{ color:C.mocha }}>{step}</strong> of 3</span>
            <div style={{ flex:1, maxWidth:300, height:5.5, background:C.cream, borderRadius:99, margin:"0 26px", overflow:"hidden" }}>
              <div style={{ height:"100%", background:`linear-gradient(to right,${C.mochaL},${C.mocha})`, borderRadius:99, transition:"width 0.5s cubic-bezier(.22,1,.36,1)", width:pct }}/>
            </div>
            <span style={{ fontSize:12.5, color:C.muted, cursor:"pointer", fontWeight:600 }}>Save &amp; continue later</span>
          </div>

          {/* Step content */}
          <div style={{ flex:1, padding:"48px 52px", maxWidth:880 }}>
            <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:"1.7px", textTransform:"uppercase", color:C.mocha, marginBottom:9 }}>{info.eyebrow}</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:27, fontWeight:700, color:C.ink, marginBottom:7, lineHeight:1.3 }}>{info.title}</h2>
            <p style={{ fontSize:13.5, color:C.mid, marginBottom:34, lineHeight:1.65, maxWidth:480 }}>{info.subtitle}</p>
            {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
          </div>

          {/* Footer nav */}
          <div style={{ borderTop:`1px solid ${C.border}`, padding:"20px 52px", background:C.card, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", bottom:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <button onClick={() => setStep(p => Math.max(1, p-1))} style={{ visibility:step===1?"hidden":"visible", padding:"11px 20px", border:`1.5px solid ${C.border}`, borderRadius:13, background:C.card, fontSize:13.5, fontWeight:700, color:C.mid }}>← Back</button>
            </div>
            <button onClick={() => step===3 ? finalizeOnboarding() : setStep(p => Math.min(3, p+1))} style={{ padding:"12px 30px", border:"none", borderRadius:13, background:`linear-gradient(135deg,${C.mochaL},${C.mocha})`, fontSize:14.5, fontWeight:800, color:"#fff", boxShadow:"0 4px 15px rgba(160,105,74,0.25)", letterSpacing:"0.1px" }}>
              {step===3?"🌸 Complete Setup":"Save & Continue →"}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
