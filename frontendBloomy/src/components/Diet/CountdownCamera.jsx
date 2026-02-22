import { useEffect, useRef, useState } from "react";

export default function CountdownCamera({ onSnap, scanning }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [count, setCount] = useState(null);

  useEffect(() => {
    let stream;
    async function start() {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    start();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const snapFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => onSnap(blob), "image/jpeg", 0.9);
  };

  const startCountdown = () => {
    let c = 3;
    setCount(c);
    const timer = setInterval(() => {
      c--;
      if (c === 0) {
        clearInterval(timer);
        snapFrame();
        setCount(null);
      } else {
        setCount(c);
      }
    }, 700);
  };

  return (
    <div style={{ position: "relative" }}>
      <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} />

      {count && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: 70,
          fontWeight: 900,
          color: "white",
          background: "rgba(0,0,0,0.4)"
        }}>
          {count}
        </div>
      )}

      <button onClick={startCountdown} disabled={scanning} style={{ marginTop: 12 }}>
        📸 Scan (3-2-1)
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}