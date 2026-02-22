import { useState } from "react";
import { C, cardS, DIET_ADVICE } from "../../constants";
import { CT } from "../../components/Shared";
import CountdownCamera from "../../components/Diet/CountdownCamera";

export default function PageDiet({
  child,
  scanResult,
  setScanResult,
  scanning,
  setScanning
}) {
  const [dietTab, setDietTab] = useState("advice");

  const [snapPreview, setSnapPreview] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const [extractedText, setExtractedText] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  async function applyBackendResult(data) {
    setExtractedText(data.extracted_text || "");
    setAiSummary(data.summary || "");

    setScanResult({
      safe: (data.allergy_hits?.length || 0) === 0,
      warning:
        (data.allergy_hits?.length || 0) === 0
          ? "No allergens detected."
          : `Detected: ${data.allergy_hits.join(", ")}`,
      allergens: data.allergy_hits || [],
      mayContain: [],
      nutrients: [
        {
          label: "Sugar",
          val: data.nutrition?.sugar_g != null ? `${data.nutrition.sugar_g} g` : "—"
        },
        {
          label: "Sodium",
          val: data.nutrition?.sodium_mg != null ? `${data.nutrition.sodium_mg} mg` : "—"
        },
        {
          label: "Fit Score",
          val: `${data.fit_score} (${data.fit_label})`
        }
      ]
    });
  }

  async function handleSnap(blob) {
    setScanning(true);
    setScanResult(null);
    setExtractedText("");
    setAiSummary("");

    setSnapPreview(URL.createObjectURL(blob));
    setUploadPreview(null);

    try {
      const form = new FormData();
      form.append("kid_id", child?.id || "kid1");
      form.append("image", blob, "label.jpg");

      const res = await fetch("http://localhost:8000/scan-label", {
        method: "POST",
        body: form
      });

      if (!res.ok) throw new Error("Scan failed");
      const data = await res.json();
      await applyBackendResult(data);
    } catch (e) {
      setScanResult({
        safe: false,
        warning: "Could not read label. Try better lighting and aim at INGREDIENTS.",
        allergens: [],
        mayContain: [],
        nutrients: []
      });
    } finally {
      setScanning(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setScanResult(null);
    setExtractedText("");
    setAiSummary("");

    setUploadPreview(URL.createObjectURL(file));
    setSnapPreview(null);

    try {
      const form = new FormData();
      form.append("kid_id", child?.id || "kid1");
      form.append("image", file);

      const res = await fetch("http://localhost:8000/scan-label", {
        method: "POST",
        body: form
      });

      if (!res.ok) throw new Error("Upload scan failed");
      const data = await res.json();
      await applyBackendResult(data);
    } catch (err) {
      setScanResult({
        safe: false,
        warning: "Could not read upload. Try a closer crop of INGREDIENTS or Nutrition Facts.",
        allergens: [],
        mayContain: [],
        nutrients: []
      });
    } finally {
      setScanning(false);
      e.target.value = ""; // allow re-upload of same file
    }
  }

  return (
    <>
      <div
        style={{
          fontFamily: "'Nunito',sans-serif",
          fontWeight: 900,
          fontSize: "1.5rem",
          color: C.ink,
          marginBottom: "0.22rem"
        }}
      >
        🥑 Diet & <span style={{ color: C.mocha }}>Lifestyle</span>
      </div>

      <div style={{ color: C.muted, fontSize: "0.83rem", marginBottom: "1.1rem" }}>
        Personalized nutrition & smart label scanning
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          marginBottom: "1.2rem",
          background: C.card2,
          borderRadius: 12,
          padding: "4px",
          width: "fit-content",
          border: `1px solid ${C.border}`
        }}
      >
        {[
          ["advice", "🥑 Advice"],
          ["scanner", "📸 Scanner"]
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setDietTab(id)}
            style={{
              padding: "0.48rem 1.1rem",
              borderRadius: 9,
              border: "none",
              fontWeight: 700,
              background: dietTab === id ? C.card : "transparent",
              color: dietTab === id ? C.mocha : C.muted,
              cursor: "pointer"
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Advice Tab */}
      {dietTab === "advice" && (
        <>
          <div
            style={{
              background: `linear-gradient(135deg,${C.mocha},${C.mochaL})`,
              borderRadius: 17,
              padding: "1.3rem",
              color: "#fff",
              marginBottom: "1rem"
            }}
          >
            <strong>This week's focus for {child?.name || "Emma"}:</strong>
            <div style={{ marginTop: 6 }}>Increase hydration and reduce processed sugars.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem" }}>
            {DIET_ADVICE.map(({ icon, title, tip }) => (
              <div key={title} style={cardS()}>
                <div style={{ fontSize: "1.6rem" }}>{icon}</div>
                <div style={{ fontWeight: 800 }}>{title}</div>
                <div style={{ fontSize: "0.8rem", color: C.mid }}>{tip}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Scanner Tab */}
      {dietTab === "scanner" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
          {/* Left panel */}
          <div style={cardS()}>
            <CT>📷 Scan Nutrition Label</CT>

            <CountdownCamera onSnap={handleSnap} scanning={scanning} />

            {snapPreview && (
              <img
                src={snapPreview}
                alt="Captured"
                style={{ width: "100%", marginTop: 12, borderRadius: 12, border: `1px solid ${C.border}` }}
              />
            )}

            {/* Upload fallback */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: "0.78rem", color: C.muted, marginBottom: 6 }}>
                Having trouble with live scan? Upload a photo instead:
              </div>

              <label
                style={{
                  display: "inline-block",
                  width: "100%",
                  textAlign: "center",
                  padding: "0.65rem 1rem",
                  borderRadius: 999,
                  border: `1.5px solid ${C.border}`,
                  background: C.card2,
                  fontWeight: 900,
                  cursor: scanning ? "not-allowed" : "pointer",
                  opacity: scanning ? 0.6 : 1
                }}
              >
                📎 Upload Nutrition Label
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={scanning}
                  style={{ display: "none" }}
                />
              </label>

              {uploadPreview && (
                <img
                  src={uploadPreview}
                  alt="Uploaded label"
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    marginTop: 12
                  }}
                />
              )}
            </div>

            {!scanning && !scanResult && (
              <div style={{ marginTop: 12 }}>
                <strong>Known Allergies:</strong>
                <div style={{ marginTop: 6 }}>
                  {child?.allergies?.map((a) => (
                    <span
                      key={a}
                      style={{
                        marginRight: 6,
                        padding: "4px 10px",
                        background: "rgba(192,96,96,0.15)",
                        borderRadius: 20
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={cardS()}>
            <CT>🔍 Scan Results</CT>

            {!scanResult && !scanning && <div style={{ color: C.muted }}>No scan yet.</div>}
            {scanning && <div>Analyzing…</div>}

            {scanResult && !scanning && (
              <>
                <div
                  style={{
                    padding: "0.9rem",
                    marginBottom: "0.9rem",
                    borderRadius: 10,
                    background: scanResult.safe ? "rgba(95,173,116,0.15)" : "rgba(192,96,96,0.15)"
                  }}
                >
                  <strong>{scanResult.safe ? "✅ Safe" : "🚨 Allergen Alert"}</strong>
                  <div>{scanResult.warning}</div>
                </div>

                {aiSummary && (
                  <div
                    style={{
                      marginBottom: "0.9rem",
                      padding: "0.9rem",
                      borderRadius: 12,
                      background: "rgba(160,105,74,0.06)",
                      border: `1px solid ${C.border}`
                    }}
                  >
                    <div style={{ fontWeight: 900, color: C.mocha, marginBottom: 6 }}>✨ AI Summary</div>
                    <div style={{ fontSize: "0.85rem", color: C.ink, lineHeight: 1.55 }}>{aiSummary}</div>
                  </div>
                )}

                <div>
                  {scanResult.nutrients.map((n) => (
                    <div key={n.label}>
                      <strong>{n.label}:</strong> {n.val}
                    </div>
                  ))}
                </div>

                {extractedText && (
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: "pointer" }}>🧠 Extracted Label Text</summary>
                    <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.75rem", marginTop: 8 }}>
                      {extractedText}
                    </pre>
                  </details>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}