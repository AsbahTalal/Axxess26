import { C, cardS } from "../../constants";
import { CT } from "../../components/Shared";

const QUICK_QUESTIONS = [
  "How is Emma sleeping this week?",
  "When is Emma's next appointment?",
  "Any health concerns I should know?",
  "Remind me about Emma's medication",
];

export default function PageAssistant({ messages, isTyping, chatInput, setChatInput, sendChat, chatBottomRef }) {
  return (
    <>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.2rem" }}>
        <div>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:C.ink }}>🤖 AI <span style={{ color:C.mocha }}>Assistant</span></div>
          <div style={{ color:C.muted, fontSize:"0.83rem", marginTop:"0.18rem" }}>Your personal pediatric health companion</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.38rem", fontSize:"0.74rem", color:C.sage, fontWeight:700 }}>
          <div style={{ width:6.5, height:6.5, borderRadius:"50%", background:C.sage }}/> Online
        </div>
      </div>

      <div style={cardS()}>
        <CT>💬 Chat</CT>

        {/* Message list */}
        <div style={{ background:C.card2, borderRadius:12, padding:"0.95rem", height:282, overflowY:"auto", marginBottom:"0.75rem", border:`1px solid ${C.border}` }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:"flex", gap:"0.5rem", marginBottom:"0.82rem", flexDirection:m.ai?"row":"row-reverse" }}>
              <div style={{ width:27, height:27, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.77rem", background:m.ai?`linear-gradient(135deg,${C.mocha},${C.mochaL})`:`linear-gradient(135deg,${C.sage},#4A9A62)` }}>
                {m.ai?"🌸":"👩"}
              </div>
              <div style={{ maxWidth:"78%", padding:"0.58rem 0.82rem", fontSize:"0.8rem", lineHeight:1.55, color:C.ink, borderRadius:m.ai?"10px 10px 10px 3px":"10px 10px 3px 10px", background:m.ai?"rgba(160,105,74,0.06)":"rgba(127,174,132,0.09)", border:m.ai?`1px solid rgba(160,105,74,0.13)`:`1px solid rgba(127,174,132,0.18)` }}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display:"flex", gap:"0.5rem" }}>
              <div style={{ width:27, height:27, borderRadius:"50%", background:`linear-gradient(135deg,${C.mocha},${C.mochaL})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.77rem" }}>🌸</div>
              <div style={{ padding:"0.58rem 0.82rem", fontSize:"0.8rem", color:C.muted, fontStyle:"italic", borderRadius:"10px 10px 10px 3px", background:"rgba(160,105,74,0.05)", border:`1px solid rgba(160,105,74,0.11)` }}>Typing…</div>
            </div>
          )}
          <div ref={chatBottomRef}/>
        </div>

        {/* Input row */}
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && sendChat()}
            placeholder="Ask me anything about Emma's health…"
            style={{ flex:1, background:C.card2, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"0.62rem 0.9rem", color:C.ink, fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", outline:"none" }}
            onFocus={e => e.target.style.borderColor=C.mocha}
            onBlur={e  => e.target.style.borderColor=C.border}
          />
          <button onClick={() => sendChat()} style={{ padding:"0 1.05rem", border:"none", borderRadius:10, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.85rem", boxShadow:"0 3px 11px rgba(160,105,74,0.22)" }}>Send</button>
        </div>

        {/* Quick-question chips */}
        <div style={{ display:"flex", gap:"0.42rem", marginTop:"0.65rem", flexWrap:"wrap" }}>
          {QUICK_QUESTIONS.map(q => (
            <button key={q} onClick={() => sendChat(q)} style={{ padding:"0.38rem 0.8rem", border:`1px solid ${C.border}`, borderRadius:999, background:"transparent", color:C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:"0.73rem", fontWeight:500 }}>{q}</button>
          ))}
        </div>
      </div>
    </>
  );
}
