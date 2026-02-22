import { useState } from "react";
import { C, cardS, DIET_ADVICE } from "../../constants";
import { CT } from "../../components/Shared";

export default function PageDiet({ child, scanResult, setScanResult, scanning, setScanning, fileRef, handleScan }) {
  const [dietTab, setDietTab] = useState("advice");

  return (
    <>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2rem", color:C.ink, marginBottom:"0.28rem" }}>🥑 Diet &amp; <span style={{ color:C.mocha }}>Lifestyle</span></div>
      <div style={{ color:C.muted, fontSize:"1rem", marginBottom:"1.2rem", fontWeight:600 }}>Personalized nutrition, wellness advice &amp; label scanning</div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:"0.4rem", marginBottom:"1.3rem", background:C.card2, borderRadius:12, padding:"4px", width:"fit-content", border:`1px solid ${C.border}` }}>
        {[["advice","🥑 Advice & Meal Plan"],["scanner","📸 Nutrition Scanner"]].map(([id,label]) => (
          <button key={id} onClick={() => setDietTab(id)} style={{ padding:"0.55rem 1.3rem", borderRadius:9, border:"none", fontFamily:"'Nunito',sans-serif", fontSize:"0.95rem", fontWeight:700, background:dietTab===id?C.card:"transparent", color:dietTab===id?C.mocha:C.muted, boxShadow:dietTab===id?"0 1px 6px rgba(160,105,74,0.1)":"none", transition:"all 0.18s" }}>{label}</button>
        ))}
      </div>

      {/* ── Advice tab ── */}
      {dietTab === "advice" && (
        <>
          <div style={{ background:`linear-gradient(135deg,${C.mocha},${C.mochaL})`, borderRadius:17, padding:"1.4rem 1.8rem", marginBottom:"1.2rem", display:"flex", alignItems:"center", gap:"1.2rem" }}>
            <div style={{ fontSize:"2.4rem" }}>🌿</div>
            <div>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.1rem", color:"#fff", marginBottom:"0.32rem" }}>This week's focus for {child.name}</div>
              <div style={{ fontSize:"0.95rem", color:"rgba(255,255,255,0.87)", lineHeight:1.6 }}>Hydration is {child.name}'s biggest gap. Prioritize fun, creative ways to get {child.gender === "boy" ? "him" : "her"} drinking more water throughout the day!</div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.9rem", marginBottom:"1.2rem" }}>
            {DIET_ADVICE.map(({ icon, title, tip, tag }) => (
              <div key={title} style={cardS()}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(160,105,74,0.09)", border:`1px solid rgba(160,105,74,0.18)`, borderRadius:99, padding:"4px 11px", fontSize:"0.75rem", fontWeight:800, color:C.mocha, marginBottom:"0.72rem", textTransform:"uppercase", letterSpacing:"0.04em" }}>{tag}</div>
                <div style={{ fontSize:"1.9rem", marginBottom:"0.55rem" }}>{icon}</div>
                <div style={{ fontWeight:800, fontSize:"1rem", color:C.ink, marginBottom:"0.42rem" }}>{title}</div>
                <div style={{ fontSize:"0.9rem", color:C.mid, lineHeight:1.65 }}>{tip}</div>
              </div>
            ))}
          </div>

          <div style={cardS()}>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"1rem" }}>🍽️ Sample Healthy Day Plan for {child.name}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.9rem" }}>
              {[
                { time:"Breakfast", icon:"🥣", items:["Oat porridge + berries","Oat milk","Half a banana"] },
                { time:"Lunch",     icon:"🥗", items:["Whole wheat wrap + turkey","Rainbow salad","Lemon water"] },
                { time:"Snack",     icon:"🍎", items:["Apple + almond butter","Blueberries","Water refill"] },
                { time:"Dinner",    icon:"🍗", items:["Grilled chicken / tofu","Brown rice + broccoli","Small glass of milk"] },
              ].map(({ time, icon, items }) => (
                <div key={time} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:13, padding:"1rem" }}>
                  <div style={{ fontSize:"1.5rem", marginBottom:"0.42rem" }}>{icon}</div>
                  <div style={{ fontWeight:800, fontSize:"0.95rem", color:C.mocha, marginBottom:"0.5rem" }}>{time}</div>
                  <ul style={{ paddingLeft:"1.1rem", margin:0 }}>{items.map(i => <li key={i} style={{ fontSize:"0.85rem", color:C.mid, lineHeight:1.75 }}>{i}</li>)}</ul>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"1rem", padding:"0.78rem 1rem", background:"rgba(160,105,74,0.06)", borderRadius:9, fontSize:"0.87rem", color:C.muted, lineHeight:1.65 }}>
              🌸 <strong>Note:</strong> This plan is tailored for {child.name}{child.allergies?.length ? ` (avoids ${child.allergies.slice(0,2).join(", ")})` : ""}. Adjust based on taste preferences and your doctor's guidance.
            </div>
          </div>
        </>
      )}

      {/* ── Scanner tab ── */}
      {dietTab === "scanner" && (
        <>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleScan}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.9rem" }}>
            {/* Upload panel */}
            <div style={cardS()}>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.9rem" }}>📷 Scan a Nutrition Label</div>
              <div onClick={() => fileRef.current?.click()}
                style={{ border:`2px dashed ${C.ghost}`, borderRadius:15, padding:"2.8rem 1.8rem", textAlign:"center", cursor:"pointer", background:"rgba(160,105,74,0.03)", transition:"all 0.18s", marginBottom:"1rem" }}
                onMouseOver={e => { e.currentTarget.style.borderColor=C.mocha; e.currentTarget.style.background="rgba(160,105,74,0.06)"; }}
                onMouseOut={e  => { e.currentTarget.style.borderColor=C.ghost; e.currentTarget.style.background="rgba(160,105,74,0.03)"; }}>
                <div style={{ fontSize:"2.8rem", marginBottom:"0.72rem" }}>📸</div>
                <div style={{ fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.42rem" }}>Upload Nutrition Label Photo</div>
                <div style={{ fontSize:"0.9rem", color:C.muted, marginBottom:"1.1rem" }}>JPEG, PNG, HEIC · Max 10MB</div>
                <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} style={{ padding:"0.65rem 1.5rem", border:"none", borderRadius:99, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.95rem", boxShadow:"0 3px 11px rgba(160,105,74,0.22)" }}>📷 Choose Photo</button>
              </div>

              {scanning && (
                <div style={{ textAlign:"center", padding:"1.4rem", background:C.card2, borderRadius:11, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:"1.9rem", marginBottom:"0.45rem", animation:"pulse 1s infinite" }}>🔍</div>
                  <div style={{ fontWeight:700, fontSize:"1rem", color:C.ink, marginBottom:"0.28rem" }}>Analyzing label…</div>
                  <div style={{ fontSize:"0.88rem", color:C.muted }}>Checking against {child.name}'s allergy profile</div>
                </div>
              )}

              {!scanning && !scanResult && (
                <div style={{ padding:"1rem", background:C.card2, borderRadius:11, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:"0.85rem", fontWeight:800, color:C.mocha, marginBottom:"0.5rem", textTransform:"uppercase", letterSpacing:"0.06em" }}>{child.name}'s Known Allergies</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {child.allergies.map(a => <span key={a} style={{ padding:"5px 12px", background:"rgba(192,96,96,0.09)", border:"1px solid rgba(192,96,96,0.22)", borderRadius:99, fontSize:"0.85rem", fontWeight:700, color:C.dustRose }}>{a}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Results panel */}
            <div style={cardS()}>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"1.05rem", color:C.ink, marginBottom:"0.9rem" }}>🔍 Scan Results</div>
              {!scanResult && !scanning && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2.8rem 1rem", color:C.muted, textAlign:"center" }}>
                  <div style={{ fontSize:"2.3rem", marginBottom:"0.65rem", opacity:0.35 }}>📋</div>
                  <div style={{ fontWeight:700, fontSize:"1rem", color:C.mid, marginBottom:"0.32rem" }}>No scan yet</div>
                  <div style={{ fontSize:"0.9rem" }}>Upload a nutrition label to see allergen analysis</div>
                </div>
              )}
              {scanning && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2.8rem 1rem" }}>
                  <div style={{ fontSize:"1.9rem", animation:"pulse 1s infinite", marginBottom:"0.45rem" }}>🌸</div>
                  <div style={{ fontWeight:700, fontSize:"1rem", color:C.ink }}>Scanning…</div>
                </div>
              )}
              {scanResult && !scanning && (
                <div style={{ animation:"fadeUp 0.4s ease" }}>
                  <div style={{ borderRadius:11, padding:"1rem 1.2rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"0.72rem", background:scanResult.safe?"rgba(95,173,116,0.09)":"rgba(192,96,96,0.09)", border:`1.5px solid ${scanResult.safe?C.sage:C.dustRose}` }}>
                    <span style={{ fontSize:"1.5rem" }}>{scanResult.safe?"✅":"🚨"}</span>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"1rem", color:scanResult.safe?C.sage:C.dustRose }}>{scanResult.safe?`Safe for ${child.name}`:"Allergen Alert!"}</div>
                      <div style={{ fontSize:"0.88rem", color:C.mid, marginTop:3 }}>{scanResult.warning}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom:"0.9rem" }}>
                    <div style={{ fontSize:"0.8rem", fontWeight:800, color:C.dustRose, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.5rem" }}>🚨 Contains</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {scanResult.allergens.map(a => <span key={a} style={{ padding:"5px 12px", background:"rgba(192,96,96,0.1)", border:"1px solid rgba(192,96,96,0.24)", borderRadius:99, fontSize:"0.85rem", fontWeight:700, color:C.dustRose }}>{a}</span>)}
                    </div>
                  </div>
                  <div style={{ marginBottom:"0.9rem" }}>
                    <div style={{ fontSize:"0.8rem", fontWeight:800, color:C.caramel, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.5rem" }}>⚠️ May Contain</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {scanResult.mayContain.map(a => <span key={a} style={{ padding:"5px 12px", background:"rgba(201,168,108,0.1)", border:"1px solid rgba(201,168,108,0.24)", borderRadius:99, fontSize:"0.85rem", fontWeight:700, color:C.caramel }}>{a}</span>)}
                    </div>
                  </div>
                  <div style={{ fontSize:"0.8rem", fontWeight:800, color:C.mid, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.5rem" }}>📊 Nutritional Snapshot</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    {scanResult.nutrients.map(({ label, val }) => (
                      <div key={label} style={{ padding:"0.55rem 0.8rem", background:C.card2, borderRadius:8, border:`1px solid ${C.border}` }}>
                        <div style={{ fontSize:"0.75rem", color:C.muted }}>{label}</div>
                        <div style={{ fontSize:"0.95rem", fontWeight:800, color:C.ink }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setScanResult(null)} style={{ width:"100%", marginTop:"1rem", padding:"0.65rem", border:`1.5px solid ${C.border}`, borderRadius:10, background:"transparent", color:C.mid, fontWeight:700, fontSize:"0.92rem" }}>🔄 Scan Another</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
