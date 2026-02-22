import { useState } from "react";
import CountdownCamera from "../components/scanner/CountdownCamera";

async function scanLabel({ kidId, imageBlob }) {
  const form = new FormData();
  form.append("kid_id", kidId);
  form.append("image", imageBlob, "label.jpg");

  const res = await fetch("http://localhost:8000/scan-label", {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Scan failed");

  return res.json();
}

export default function LabelScan() {
  const [kidId] = useState("kid1"); // hardcode for now
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSnap(blob) {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await scanLabel({
        kidId,
        imageBlob: blob,
      });

      setResult(data);
    } catch (err) {
      setError("Scan failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Scan Nutrition Label</h2>

      <CountdownCamera onSnap={handleSnap} />

      {loading && <p>Reading label...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>
            Fit Score: {result.fit_score} ({result.fit_label})
          </h3>

          {result.allergy_hits.length > 0 && (
            <div style={{ color: "red" }}>
              ⚠ Allergy Alert: {result.allergy_hits.join(", ")}
            </div>
          )}

          <ul>
            {result.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}