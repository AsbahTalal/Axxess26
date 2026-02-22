import { useState } from "react";
import { C, cardS, DIET_ADVICE } from "../../constants";
import { CT } from "../../components/Shared";

export default function PageDiet({ child, scanResult, setScanResult, scanning, setScanning, fileRef, handleScan }) {
  const [dietTab, setDietTab] = useState("advice");

  return (
    <>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:C.ink, marginBottom:"0.22rem" }}>🥑 Diet &amp; <span style={{ color:C.mocha }}>Lifestyle</span></div>
      <div style={{ color:C.muted, fontSize:"0.83rem", marginBottom:"1.1rem" }}>Personalized nutrition, wellness advice &amp; label scanning</div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:"0.4rem", marginBottom:"1.2rem", background:C.card2, borderRadius:12, padding:"4px", width:"fit-content", border:`1px solid ${C.border}` }}>
        {[["advice","🥑 Advice & Meal Plan"],["scanner","📸 Nutrition Scanner"]].map(([id,label]) => (
          <button key={id} onClick={() => setDietTab(id)} style={{ padding:"0.48rem 1.1rem", borderRadius:9, border:"none", fontFamily:"'Nunito',sans-serif", fontSize:"0.83rem", fontWeight:700, background:dietTab===id?C.card:"transparent", color:dietTab===id?C.mocha:C.muted, boxShadow:dietTab===id?"0 1px 6px rgba(160,105,74,0.1)":"none", transition:"all 0.18s" }}>{label}</button>
        ))}
      </div>

      {/* ── Advice tab ── */}
      {dietTab === "advice" && (
        <>
          <div style={{ background:`linear-gradient(135deg,${C.mocha},${C.mochaL})`, borderRadius:17, padding:"1.3rem 1.7rem", marginBottom:"1.1rem", display:"flex", alignItems:"center", gap:"1.1rem" }}>
            <div style={{ fontSize:"2.2rem" }}>🌿</div>
            <div>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.97rem", color:"#fff", marginBottom:"0.28rem" }}>This week's focus for Emma</div>
              <div style={{ fontSize:"0.83rem", color:"rgba(255,255,255,0.82)", lineHeight:1.55 }}>Hydration is Emma's biggest gap. Prioritize fun, creative ways to get her drinking more water throughout the day!</div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.82rem", marginBottom:"1.1rem" }}>
            {DIET_ADVICE.map(({ icon, title, tip, tag }) => (
              <div key={title} style={cardS()}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(160,105,74,0.09)", border:`1px solid rgba(160,105,74,0.18)`, borderRadius:99, padding:"3px 9px", fontSize:"0.66rem", fontWeight:800, color:C.mocha, marginBottom:"0.68rem", textTransform:"uppercase", letterSpacing:"0.04em" }}>{tag}</div>
                <div style={{ fontSize:"1.65rem", marginBottom:"0.52rem" }}>{icon}</div>
                <div style={{ fontWeight:800, fontSize:"0.87rem", color:C.ink, marginBottom:"0.38rem" }}>{title}</div>
                <div style={{ fontSize:"0.78rem", color:C.mid, lineHeight:1.62 }}>{tip}</div>
              </div>
            ))}
          </div>

          <div style={cardS()}>
            <CT>🍽️ Sample Healthy Day Plan for Emma</CT>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.82rem" }}>
              {[
                { time:"Breakfast", icon:"🥣", items:["Oat porridge + berries","Oat milk","Half a banana"] },
                { time:"Lunch",     icon:"🥗", items:["Whole wheat wrap + turkey","Rainbow salad","Lemon water"] },
                { time:"Snack",     icon:"🍎", items:["Apple + almond butter","Blueberries","Water refill"] },
                { time:"Dinner",    icon:"🍗", items:["Grilled chicken / tofu","Brown rice + broccoli","Small glass of milk"] },
              ].map(({ time, icon, items }) => (
                <div key={time} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:13, padding:"0.95rem" }}>
                  <div style={{ fontSize:"1.3rem", marginBottom:"0.38rem" }}>{icon}</div>
                  <div style={{ fontWeight:800, fontSize:"0.82rem", color:C.mocha, marginBottom:"0.45rem" }}>{time}</div>
                  <ul style={{ paddingLeft:"1rem", margin:0 }}>{items.map(i => <li key={i} style={{ fontSize:"0.73rem", color:C.mid, lineHeight:1.7 }}>{i}</li>)}</ul>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"0.9rem", padding:"0.7rem 0.95rem", background:"rgba(160,105,74,0.06)", borderRadius:9, fontSize:"0.73rem", color:C.muted, lineHeight:1.6 }}>
              🌸 <strong>Note:</strong> This plan avoids Dairy (Emma's allergy). Adjust based on taste preferences and your doctor's guidance.
            </div>
          </div>
        </>
      )}

      {/* ── Scanner tab ── */}
      {dietTab === "scanner" && (
        <>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleScan}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.82rem" }}>
            {/* Upload panel */}
            <div style={cardS()}>
              <CT>📷 Scan a Nutrition Label</CT>
              <div onClick={() => fileRef.current?.click()}
                style={{ border:`2px dashed ${C.ghost}`, borderRadius:15, padding:"2.8rem 1.8rem", textAlign:"center", cursor:"pointer", background:"rgba(160,105,74,0.03)", transition:"all 0.18s", marginBottom:"0.95rem" }}
                onMouseOver={e => { e.currentTarget.style.borderColor=C.mocha; e.currentTarget.style.background="rgba(160,105,74,0.06)"; }}
                onMouseOut={e  => { e.currentTarget.style.borderColor=C.ghost; e.currentTarget.style.background="rgba(160,105,74,0.03)"; }}>
                <div style={{ fontSize:"2.8rem", marginBottom:"0.68rem" }}>📸</div>
                <div style={{ fontWeight:800, fontSize:"0.95rem", color:C.ink, marginBottom:"0.35rem" }}>Upload Nutrition Label Photo</div>
                <div style={{ fontSize:"0.8rem", color:C.muted, marginBottom:"1.1rem" }}>JPEG, PNG, HEIC · Max 10MB</div>
                <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} style={{ padding:"0.6rem 1.4rem", border:"none", borderRadius:99, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.85rem", boxShadow:"0 3px 11px rgba(160,105,74,0.22)" }}>📷 Choose Photo</button>
              </div>

              {scanning && (
                <div style={{ textAlign:"center", padding:"1.4rem", background:C.card2, borderRadius:11, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:"1.9rem", marginBottom:"0.45rem", animation:"pulse 1s infinite" }}>🔍</div>
                  <div style={{ fontWeight:700, color:C.ink, marginBottom:"0.25rem" }}>Analyzing label…</div>
                  <div style={{ fontSize:"0.78rem", color:C.muted }}>Checking against Emma's allergy profile</div>
                </div>
              )}

              {!scanning && !scanResult && (
                <div style={{ padding:"0.95rem", background:C.card2, borderRadius:11, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:"0.75rem", fontWeight:800, color:C.mocha, marginBottom:"0.45rem", textTransform:"uppercase", letterSpacing:"0.06em" }}>Emma's Known Allergies</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {child.allergies.map(a => <span key={a} style={{ padding:"4px 10px", background:"rgba(192,96,96,0.09)", border:"1px solid rgba(192,96,96,0.22)", borderRadius:99, fontSize:"0.73rem", fontWeight:700, color:C.dustRose }}>{a}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Results panel */}
            <div style={cardS()}>
              <CT>🔍 Scan Results</CT>
              {!scanResult && !scanning && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2.8rem 1rem", color:C.muted, textAlign:"center" }}>
                  <div style={{ fontSize:"2.3rem", marginBottom:"0.65rem", opacity:0.35 }}>📋</div>
                  <div style={{ fontWeight:700, fontSize:"0.87rem", color:C.mid, marginBottom:"0.28rem" }}>No scan yet</div>
                  <div style={{ fontSize:"0.78rem" }}>Upload a nutrition label to see allergen analysis</div>
                </div>
              )}
              {scanning && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2.8rem 1rem" }}>
                  <div style={{ fontSize:"1.9rem", animation:"pulse 1s infinite", marginBottom:"0.45rem" }}>🌸</div>
                  <div style={{ fontWeight:700, color:C.ink }}>Scanning…</div>
                </div>
              )}
              {scanResult && !scanning && (
                <div style={{ animation:"fadeUp 0.4s ease" }}>
                  <div style={{ borderRadius:11, padding:"0.95rem 1.1rem", marginBottom:"0.9rem", display:"flex", alignItems:"center", gap:"0.68rem", background:scanResult.safe?"rgba(95,173,116,0.09)":"rgba(192,96,96,0.09)", border:`1.5px solid ${scanResult.safe?C.sage:C.dustRose}` }}>
                    <span style={{ fontSize:"1.4rem" }}>{scanResult.safe?"✅":"🚨"}</span>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"0.87rem", color:scanResult.safe?C.sage:C.dustRose }}>{scanResult.safe?"Safe for Emma":"Allergen Alert!"}</div>
                      <div style={{ fontSize:"0.76rem", color:C.mid, marginTop:2 }}>{scanResult.warning}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom:"0.8rem" }}>
                    <div style={{ fontSize:"0.69rem", fontWeight:800, color:C.dustRose, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.45rem" }}>🚨 Contains</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {scanResult.allergens.map(a => <span key={a} style={{ padding:"4px 10px", background:"rgba(192,96,96,0.1)", border:"1px solid rgba(192,96,96,0.24)", borderRadius:99, fontSize:"0.73rem", fontWeight:700, color:C.dustRose }}>{a}</span>)}
                    </div>
                  </div>
                  <div style={{ marginBottom:"0.8rem" }}>
                    <div style={{ fontSize:"0.69rem", fontWeight:800, color:C.caramel, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.45rem" }}>⚠️ May Contain</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {scanResult.mayContain.map(a => <span key={a} style={{ padding:"4px 10px", background:"rgba(201,168,108,0.1)", border:"1px solid rgba(201,168,108,0.24)", borderRadius:99, fontSize:"0.73rem", fontWeight:700, color:C.caramel }}>{a}</span>)}
                    </div>
                  </div>
                  <div style={{ fontSize:"0.69rem", fontWeight:800, color:C.mid, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.45rem" }}>📊 Nutritional Snapshot</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                    {scanResult.nutrients.map(({ label, val }) => (
                      <div key={label} style={{ padding:"0.5rem 0.75rem", background:C.card2, borderRadius:8, border:`1px solid ${C.border}` }}>
                        <div style={{ fontSize:"0.65rem", color:C.muted }}>{label}</div>
                        <div style={{ fontSize:"0.85rem", fontWeight:800, color:C.ink }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setScanResult(null)} style={{ width:"100%", marginTop:"0.9rem", padding:"0.6rem", border:`1.5px solid ${C.border}`, borderRadius:10, background:"transparent", color:C.mid, fontWeight:700, fontSize:"0.82rem" }}>🔄 Scan Another</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
