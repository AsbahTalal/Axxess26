import { useState } from "react";
import { C, cardS } from "../../constants";
import { CT } from "../../components/Shared";

const MOCK_SUMMARIES = {
  "Annual Physical 2025.pdf": {
    vitals: [
      { label:"Height",         value:"4'2\" (127 cm)"    },
      { label:"Weight",         value:"58 lbs (26.3 kg)"  },
      { label:"Blood Pressure", value:"95/62 mmHg"        },
      { label:"Heart Rate",     value:"84 bpm"             },
      { label:"BMI",            value:"17.8 — Normal"     },
    ],
    symptoms:  ["Mild seasonal nasal congestion", "Occasional fatigue after school"],
    diagnoses: ["Healthy overall development", "Allergic rhinitis — managed", "No acute concerns noted"],
  },
  "Allergy Test Results.pdf": {
    vitals: [
      { label:"Total IgE",    value:"142 IU/mL (Elevated)"  },
      { label:"Peanut IgE",   value:"Class 3 — High"        },
      { label:"Dairy IgE",    value:"Class 2 — Moderate"    },
      { label:"Tree Nut IgE", value:"Class 1 — Low"         },
      { label:"Egg IgE",      value:"Class 0 — Negative"    },
    ],
    symptoms:  ["Hives on allergen contact", "Runny nose", "Eye itching in spring"],
    diagnoses: ["Peanut allergy confirmed (Class 3)", "Dairy sensitivity confirmed (Class 2)", "Seasonal allergic rhinitis"],
  },
  "Blood Panel Results.jpg": {
    vitals: [
      { label:"Hemoglobin",   value:"12.1 g/dL (Low-normal)" },
      { label:"WBC Count",    value:"7,200 /µL — Normal"      },
      { label:"Iron (Serum)", value:"82 µg/dL (Low-normal)"   },
      { label:"Ferritin",     value:"18 ng/mL"                },
      { label:"Vitamin D",    value:"28 ng/mL (Borderline)"   },
    ],
    symptoms:  ["Mild fatigue", "Occasional pallor"],
    diagnoses: ["Mild iron deficiency", "Borderline Vitamin D insufficiency", "WBC within normal range — no infection signs"],
  },
};

export default function PageRecords() {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);
  const [summary, setSummary] = useState(null);

  const handleAnalyze = (name) => {
    setActiveRecord(name);
    setAnalyzing(true);
    setSummary(null);
    setTimeout(() => {
      setAnalyzing(false);
      setSummary(MOCK_SUMMARIES[name]);
    }, 1800);
  };

  const records = [
    [C.mocha,    "Annual Physical 2025.pdf",  "Jan 15, 2025"],
    [C.sage,     "Allergy Test Results.pdf",  "Aug 3, 2024" ],
    [C.lavBlush, "Blood Panel Results.jpg",   "Nov 10, 2024"],
  ];

  return (
    <>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2rem", color:C.ink, marginBottom:"0.28rem" }}>📋 Medical <span style={{ color:C.mocha }}>Records</span></div>
      <div style={{ color:C.muted, fontSize:"1rem", marginBottom:"1.3rem", fontWeight:600 }}>Upload records for AI-powered health predictions &amp; summarization</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        {/* Upload + file list */}
        <div style={cardS()}>
          <CT>📤 Upload Records</CT>
          <div style={{ border:`2px dashed ${C.ghost}`, borderRadius:12, padding:"1.8rem", textAlign:"center", cursor:"pointer", marginBottom:"1rem", background:"rgba(160,105,74,0.03)" }}>
            <div style={{ fontSize:"1.9rem", marginBottom:"0.45rem" }}>📄</div>
            <div style={{ fontWeight:700, fontSize:"1rem", marginBottom:"0.3rem", color:C.ink }}>Drop files or click to upload</div>
            <div style={{ fontSize:"0.88rem", color:C.muted }}>PDF, JPEG, PNG · Max 20MB</div>
          </div>
          <CT>📁 Uploaded Records</CT>
          {records.map(([col, name, sub]) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:"0.65rem", padding:"0.65rem 0.85rem", borderRadius:10, background:C.card2, border:`1px solid ${C.border}`, marginBottom:"0.38rem" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:col, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.9rem", fontWeight:700, color:C.ink }}>{name}</div>
                <div style={{ fontSize:"0.78rem", color:C.muted }}>{sub}</div>
              </div>
              <button onClick={() => handleAnalyze(name)}
                style={{ padding:"4px 12px", border:`1.5px solid ${C.mocha}`, borderRadius:99, background:"transparent", color:C.mocha, fontWeight:700, fontSize:"0.78rem", cursor:"pointer", whiteSpace:"nowrap" }}>
                🧠 Analyze
              </button>
            </div>
          ))}
        </div>

        {/* AI predictions */}
        <div style={cardS()}>
          <CT>🔮 AI Health Predictions</CT>
          <div style={{ fontSize:"0.88rem", color:C.muted, marginBottom:"0.95rem" }}>Based on Emma's records, vitals &amp; wearable data</div>

          <div style={{ fontSize:"0.78rem", fontWeight:800, color:C.dustRose, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.55rem" }}>⚠️ Watch &amp; Monitor</div>
          {[
            [C.dustRose, "🤧", "Seasonal Allergy Flare-Up",    "Spring pollen approaching — 78% likelihood"           ],
            [C.caramel,  "😴", "Sleep Pattern Disruption",      "Wednesday dips correlate with school stress — 62%"   ],
          ].map(([bd, icon, title, desc]) => (
            <div key={title} style={{ display:"flex", gap:"0.65rem", padding:"0.75rem 0.88rem", borderRadius:10, marginBottom:"0.45rem", background:C.card2, borderLeft:`2.5px solid ${bd}` }}>
              <span style={{ fontSize:"1.05rem" }}>{icon}</span>
              <div>
                <div style={{ fontSize:"0.9rem", fontWeight:700, color:C.ink }}>{title}</div>
                <div style={{ fontSize:"0.8rem", color:C.muted, marginTop:2 }}>{desc}</div>
              </div>
            </div>
          ))}

          <div style={{ fontSize:"0.78rem", fontWeight:800, color:C.sage, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0.9rem 0 0.55rem" }}>✅ Looking Good</div>
          {[
            [C.sage, "❤️", "Cardiovascular Health", "Heart rate trends are excellent for Emma's age"  ],
            [C.sage, "🦴", "Growth & Development",   "On track with developmental milestones"          ],
          ].map(([bd, icon, title, desc]) => (
            <div key={title} style={{ display:"flex", gap:"0.65rem", padding:"0.75rem 0.88rem", borderRadius:10, marginBottom:"0.45rem", background:C.card2, borderLeft:`2.5px solid ${bd}` }}>
              <span style={{ fontSize:"1.05rem" }}>{icon}</span>
              <div>
                <div style={{ fontSize:"0.9rem", fontWeight:700, color:C.ink }}>{title}</div>
                <div style={{ fontSize:"0.8rem", color:C.muted, marginTop:2 }}>{desc}</div>
              </div>
            </div>
          ))}

          <div style={{ fontSize:"0.78rem", color:C.muted, marginTop:"0.9rem", padding:"0.7rem 0.85rem", background:C.card2, borderRadius:8, lineHeight:1.65 }}>
            ⚕️ AI predictions are informational only. Always consult Emma's doctor.
          </div>
        </div>
      </div>

      {/* ── AI Summarization Section ── */}
      <div style={cardS()}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.5rem" }}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.2rem", color:C.ink }}>🧠 AI-Powered Document Summarization</div>
          <div style={{ background:`linear-gradient(135deg,${C.mocha},${C.mochaL})`, color:"#fff", fontSize:"0.72rem", fontWeight:800, padding:"3px 10px", borderRadius:99, letterSpacing:"0.05em", textTransform:"uppercase" }}>Powered by AI</div>
        </div>
        <div style={{ color:C.muted, fontSize:"0.92rem", marginBottom:"1.2rem", lineHeight:1.6 }}>
          Select a document above and click <strong style={{ color:C.mocha }}>🧠 Analyze</strong> to automatically extract key vitals, symptoms, and diagnoses.
        </div>

        {/* Idle state */}
        {!analyzing && !summary && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"2.5rem 1rem", background:C.card2, borderRadius:14, border:`1.5px dashed ${C.ghost}` }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"0.65rem", opacity:0.4 }}>🧠</div>
            <div style={{ fontWeight:700, fontSize:"1rem", color:C.mid, marginBottom:"0.3rem" }}>No document analyzed yet</div>
            <div style={{ fontSize:"0.88rem", color:C.muted }}>Click "🧠 Analyze" next to any uploaded record to begin</div>
          </div>
        )}

        {/* Loading state */}
        {analyzing && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"2.5rem 1rem", background:C.card2, borderRadius:14, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:"2rem", marginBottom:"0.65rem", animation:"pulse 1s infinite" }}>🔍</div>
            <div style={{ fontWeight:800, fontSize:"1rem", color:C.ink, marginBottom:"0.3rem" }}>Analyzing {activeRecord}…</div>
            <div style={{ fontSize:"0.88rem", color:C.muted }}>Extracting vitals, symptoms &amp; diagnoses</div>
          </div>
        )}

        {/* Summary results */}
        {!analyzing && summary && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", padding:"0.75rem 1rem", background:"rgba(160,105,74,0.07)", border:`1px solid rgba(160,105,74,0.2)`, borderRadius:10, marginBottom:"1.2rem" }}>
              <span style={{ fontSize:"1.1rem" }}>📄</span>
              <div style={{ fontSize:"0.92rem", fontWeight:700, color:C.mocha }}>{activeRecord}</div>
              <button onClick={() => { setSummary(null); setActiveRecord(null); }} style={{ marginLeft:"auto", padding:"3px 10px", border:`1px solid ${C.border}`, borderRadius:99, background:"transparent", fontSize:"0.78rem", color:C.muted, cursor:"pointer" }}>✕ Clear</button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>
              {/* Key Vitals */}
              <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:13, padding:"1rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.85rem" }}>
                  <span style={{ fontSize:"1.1rem" }}>💉</span>
                  <div style={{ fontWeight:800, fontSize:"0.95rem", color:C.ink }}>Key Vitals</div>
                </div>
                {summary.vitals.map(({ label, value }) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"0.42rem 0", borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:"0.82rem", color:C.muted, fontWeight:600 }}>{label}</div>
                    <div style={{ fontSize:"0.88rem", fontWeight:800, color:C.ink, textAlign:"right", maxWidth:"55%" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Symptoms */}
              <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:13, padding:"1rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.85rem" }}>
                  <span style={{ fontSize:"1.1rem" }}>🩺</span>
                  <div style={{ fontWeight:800, fontSize:"0.95rem", color:C.ink }}>Symptoms</div>
                </div>
                {summary.symptoms.map((s, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem", padding:"0.45rem 0", borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:C.caramel, flexShrink:0, marginTop:5 }}/>
                    <div style={{ fontSize:"0.88rem", color:C.mid, lineHeight:1.55 }}>{s}</div>
                  </div>
                ))}
              </div>

              {/* Diagnoses */}
              <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:13, padding:"1rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.85rem" }}>
                  <span style={{ fontSize:"1.1rem" }}>📝</span>
                  <div style={{ fontWeight:800, fontSize:"0.95rem", color:C.ink }}>Diagnoses</div>
                </div>
                {summary.diagnoses.map((d, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem", padding:"0.45rem 0", borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:C.sage, flexShrink:0, marginTop:5 }}/>
                    <div style={{ fontSize:"0.88rem", color:C.mid, lineHeight:1.55 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop:"1rem", padding:"0.75rem 1rem", background:"rgba(95,173,116,0.07)", border:`1px solid rgba(95,173,116,0.2)`, borderRadius:9, fontSize:"0.85rem", color:C.muted, lineHeight:1.65 }}>
              ⚕️ AI summarization is for reference only. Always review results with Emma's healthcare provider before making any medical decisions.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
