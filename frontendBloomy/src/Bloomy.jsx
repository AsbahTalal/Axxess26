import { useState, useRef, useEffect } from "react";
import { C, G, AI_REPLIES, FALLBACK, MOCK_SCAN } from "./constants";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Screens
import LandingPage    from "./pages/LandingPage";
import AuthPage       from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";

// Dashboard tabs
import PageOverview   from "./pages/dashboard/PageOverview";
import PageWellness   from "./pages/dashboard/PageWellness";
import PageDiet       from "./pages/dashboard/PageDiet";
import PageCalendar   from "./pages/dashboard/PageCalendar";
import PageRecords    from "./pages/dashboard/PageRecords";
import PageAssistant  from "./pages/dashboard/PageAssistant";
import PageSettings   from "./pages/dashboard/PageSettings";

// ─── NAV ITEM ─────────────────────────────────────────────────────
function NavItem({ id, icon, label, dashPage, setDashPage }) {
  return (
    <div onClick={() => setDashPage(id)} className="nav-hover"
      style={{ display:"flex", alignItems:"center", gap:"0.68rem", padding:"0.62rem 0.75rem", borderRadius:10, cursor:"pointer", fontWeight:500, fontSize:"0.855rem", color:dashPage===id?"#fff":C.ghost, background:dashPage===id?"rgba(255,255,255,0.15)":"transparent", transition:"all 0.16s", marginBottom:2 }}>
      <span style={{ fontSize:"0.97rem", width:"1.25rem", textAlign:"center" }}>{icon}</span>{label}
    </div>
  );
}

export default function Bloomy() {
  const [screen,      setScreen]      = useState("landing");
  const [dashPage,    setDashPage]    = useState("overview");
  const [authLoading, setAuthLoading] = useState(true);
  const [userId,      setUserId]      = useState(null);

  // ── Onboarding ──────────────────────────────────────────────────
  const [step,      setStep]      = useState(1);
  const [gender,    setGender]    = useState("girl");
  const [allergies, setAllergies] = useState(["🥛 Dairy"]);
  const [bedMin,    setBedMin]    = useState(20*60+30);
  const [wakeMin,   setWakeMin]   = useState(7*60);
  const [obForm,    setObForm]    = useState({ name:"", dob:"", region:"", height:"", weight:"" });

  // ── Parent + children ───────────────────────────────────────────
  const [parentProfile, setParentProfile] = useState({
    name:"", email:"", phone:"", avatar:"👩", timezone:"",
  });
  const [children, setChildren] = useState([
    { id:1, name:"", dob:"", gender:"girl", age:0, weight:"", height:"", bloodType:"", doctor:"", allergies:[], avatar:"👧", color:C.mocha },
  ]);
  const [activeChild,  setActiveChild]  = useState(0);
  const [editParent,   setEditParent]   = useState(false);
  const [addingChild,  setAddingChild]  = useState(false);
  const [newChild,     setNewChild]     = useState({ name:"", dob:"", gender:"girl", weight:"", height:"", bloodType:"", doctor:"", avatar:"🧒" });

  // ── Scanner ─────────────────────────────────────────────────────
  const [scanResult, setScanResult] = useState(null);
  const [scanning,   setScanning]   = useState(false);
  const fileRef = useRef(null);

  // ── Mood ────────────────────────────────────────────────────────
  const [moodLog, setMoodLog] = useState([
    { date:"Feb 15", happy:true  }, { date:"Feb 16", happy:true  }, { date:"Feb 17", happy:false },
    { date:"Feb 18", happy:true  }, { date:"Feb 19", happy:true  }, { date:"Feb 20", happy:true  },
    { date:"Feb 21", happy:null  },
  ]);

  // ── Chat ────────────────────────────────────────────────────────
  const [messages,  setMessages]  = useState([
    { ai:true, text:"Hi! I'm your child's Bloomy health assistant. Today: 3/6 hydration reminders done, slept 9.5 hrs, heart rate 88 bpm — looking lovely! 🌸" },
    { ai:true, text:"⏰ Reminder: Check-up with the doctor coming up soon. Want me to add it to your calendar?" },
    { ai:true, text:"💊 Medication Alert: Daily allergy med reminder for tomorrow at 8:00 AM. I'll send a nudge at 7:45 AM!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping,  setIsTyping]  = useState(false);
  const chatBottomRef = useRef(null);
  const fallbackIdx   = useRef(0);

  // ── Notifications ───────────────────────────────────────────────
  const [notif, setNotif] = useState(null);

  // ── Firebase Auth listener ───────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Always seed profile from Firebase Auth (guaranteed reliable)
        const authName  = user.displayName || "";
        const authEmail = user.email || "";
        setParentProfile(p => ({
          ...p,
          name:  authName  || p.name,
          email: authEmail || p.email,
        }));
        // Try to load saved profile + children from Firestore
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            // Merge Firestore profile — Firebase Auth displayName wins for name
            const loadedName = authName || data.profile?.name || "";
            setParentProfile(p => ({ ...p, ...data.profile, name: loadedName, email: authEmail || data.profile?.email || "" }));
            if (data.children?.length) {
              setChildren(data.children);
              setActiveChild(0);
              const n = data.children[0].name;
              const firstName = (loadedName || "").split(" ")[0] || "there";
              setMessages([
                { ai:true, text:`Hi ${firstName}! I'm ${n}'s Bloomy health assistant. Today: 3/6 hydration reminders done, slept 9.5 hrs, heart rate 88 bpm — looking lovely! 🌸` },
                { ai:true, text:`⏰ Reminder: ${n}'s check-up is coming up soon. Want me to add it to your calendar?` },
                { ai:true, text:`💊 Medication Alert: ${n}'s daily allergy med is due at 8:00 AM tomorrow. I'll send a nudge at 7:45 AM!` },
              ]);
            }
            setScreen("dashboard");
          } else {
            // New user — go to onboarding
            setScreen("onboarding");
          }
        } catch {
          setScreen("onboarding");
        }
      } else {
        setUserId(null);
        // Not signed in — stay on landing/auth
        if (screen === "dashboard" || screen === "onboarding") setScreen("landing");
      }
      setAuthLoading(false);
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived ──────────────────────────────────────────────────
  const child = children[activeChild] || children[0];

  // Auto-personalize welcome messages whenever names become available
  useEffect(() => {
    const n = child?.name;
    const firstName = parentProfile?.name?.split(" ")[0];
    if (!n || !firstName) return;
    setMessages(prev => {
      // Don't overwrite an actual conversation (only touch initial AI-only messages)
      if (prev.some(m => !m.ai)) return prev;
      return [
        { ai:true, text:`Hi ${firstName}! I'm ${n}'s Bloomy health assistant. Today: 3/6 hydration reminders done, slept 9.5 hrs, heart rate 88 bpm — looking lovely! 🌸` },
        { ai:true, text:`⏰ Reminder: ${n}'s check-up is coming up soon. Want me to add it to your calendar?` },
        { ai:true, text:`💊 Medication Alert: ${n}'s daily allergy med is due at 8:00 AM tomorrow. I'll send a nudge at 7:45 AM!` },
      ];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child?.name, parentProfile?.name]);

  // ─── Helpers ──────────────────────────────────────────────────
  const toggleAllergy = (tag) => setAllergies(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]);

  const adjustTime = (type, delta) =>
    type === "bed" ? setBedMin(p => (p+delta+1440)%1440) : setWakeMin(p => (p+delta+1440)%1440);

  const fireNotif = (title, body) => {
    setNotif({ title, body });
    setTimeout(() => setNotif(null), 3500);
  };

  const sendChat = (override) => {
    const txt = (override ?? chatInput).trim();
    if (!txt) return;
    setMessages(p => [...p, { ai:false, text:txt }]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = AI_REPLIES[txt] || FALLBACK[fallbackIdx.current++ % FALLBACK.length];
      setIsTyping(false);
      setMessages(p => [...p, { ai:true, text:reply }]);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior:"smooth" }), 50);
    }, 1100);
  };

  const handleScan = (e) => {
    if (!e.target.files?.length) return;
    setScanning(true);
    setScanResult(null);
    setTimeout(() => { setScanning(false); setScanResult(MOCK_SCAN); }, 2200);
  };

  const saveNewChild = () => {
    if (!newChild.name) return;
    const updated = [...children, { ...newChild, id:Date.now(), age:4, color:C.lavBlush }];
    setChildren(updated);
    setAddingChild(false);
    setNewChild({ name:"", dob:"", gender:"girl", weight:"", height:"", bloodType:"", doctor:"", avatar:"🧒" });
    fireNotif("🌸 Child Added", `${newChild.name}'s profile has been created!`);
    // Persist to Firestore
    if (userId) {
      setDoc(doc(db, "users", userId), { children: updated }, { merge: true }).catch(() => {});
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  SCREEN ROUTING
  // ═══════════════════════════════════════════════════════════════

  // While Firebase resolves the auth state, show a minimal loading screen
  if (authLoading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", color:C.mocha }}>
      bloomy<span style={{ color:C.caramel }}>.</span>
    </div>
  );

  if (screen === "landing")
    return <LandingPage setScreen={setScreen}/>;

  if (screen === "login" || screen === "register")
    return <AuthPage screen={screen} setScreen={setScreen} fireNotif={fireNotif} setParentProfile={setParentProfile}/>;

  const finalizeOnboarding = async () => {
    let age = 7;
    if (obForm.dob) {
      const birth = new Date(obForm.dob);
      const now   = new Date();
      age = now.getFullYear() - birth.getFullYear();
      if (now.getMonth() < birth.getMonth() ||
         (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
      age = Math.max(0, age);
    }
    const newChildRecord = {
      id: 1, name: obForm.name || "Your Child", dob: obForm.dob || "",
      gender, age, weight: obForm.weight || "", height: obForm.height || "",
      bloodType: "", doctor: "", allergies,
      avatar: gender === "boy" ? "👦" : "👧", color: C.mocha,
    };
    setChildren([newChildRecord]);
    setActiveChild(0);

    // Use Firebase Auth displayName as authoritative source — no stale closure risk
    const savedName  = auth.currentUser?.displayName || parentProfile.name || "";
    const savedEmail = auth.currentUser?.email        || parentProfile.email || "";

    // Ensure parentProfile reflects final name before writing
    setParentProfile(p => ({ ...p, name: savedName, email: savedEmail }));

    const n         = newChildRecord.name;
    const firstName = savedName.split(" ")[0] || "there";
    setMessages([
      { ai:true, text:`Hi ${firstName}! I'm ${n}'s Bloomy health assistant. Today: 3/6 hydration reminders done, slept 9.5 hrs, heart rate 88 bpm — looking lovely! 🌸` },
      { ai:true, text:`⏰ Reminder: ${n}'s check-up is coming up soon. Want me to add it to your calendar?` },
      { ai:true, text:`💊 Medication Alert: ${n}'s daily allergy med is due at 8:00 AM tomorrow. I'll send a nudge at 7:45 AM!` },
    ]);

    // Persist profile + child to Firestore
    if (userId) {
      try {
        await setDoc(doc(db, "users", userId), {
          profile:  { name: savedName, email: savedEmail, avatar: parentProfile.avatar },
          children: [newChildRecord],
        });
      } catch {
        // Firestore unavailable — continue anyway
      }
    }
    setScreen("dashboard");
  };

  if (screen === "onboarding")
    return (
      <OnboardingPage
        setScreen={setScreen}
        step={step} setStep={setStep}
        gender={gender} setGender={setGender}
        allergies={allergies} toggleAllergy={toggleAllergy}
        bedMin={bedMin} wakeMin={wakeMin}
        obForm={obForm} setObForm={setObForm}
        adjustTime={adjustTime}
        finalizeOnboarding={finalizeOnboarding}
      />
    );

  // ═══════════════════════════════════════════════════════════════
  //  DASHBOARD
  // ═══════════════════════════════════════════════════════════════
  const handleLogout = async () => {
    try { await signOut(auth); } catch { /* ignore */ }
    setScreen("landing");
  };

  const pages = {
    overview:  <PageOverview  setDashPage={setDashPage} child={child} parentProfile={parentProfile} moodLog={moodLog} setMoodLog={setMoodLog} fireNotif={fireNotif}/>,
    wellness:  <PageWellness  child={child} moodLog={moodLog} setMoodLog={setMoodLog} fireNotif={fireNotif}/>,
    diet:      <PageDiet      child={child} scanResult={scanResult} setScanResult={setScanResult} scanning={scanning} setScanning={setScanning} fileRef={fileRef} handleScan={handleScan}/>,
    calendar:  <PageCalendar  child={child} fireNotif={fireNotif}/>,
    records:   <PageRecords/>,
    assistant: <PageAssistant messages={messages} isTyping={isTyping} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} chatBottomRef={chatBottomRef} child={child}/>,
    settings:  <PageSettings  parentProfile={parentProfile} setParentProfile={setParentProfile} editParent={editParent} setEditParent={setEditParent} addingChild={addingChild} setAddingChild={setAddingChild} newChild={newChild} setNewChild={setNewChild} children={children} setChildren={setChildren} activeChild={activeChild} setActiveChild={setActiveChild} saveNewChild={saveNewChild} fireNotif={fireNotif}/>,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:C.bg, color:C.ink }}>
      <style>{G}</style>

      {/* Toast notification */}
      {notif && (
        <div style={{ position:"fixed", top:"1.25rem", right:"1.25rem", zIndex:1000, background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"0.85rem 1.05rem", maxWidth:272, boxShadow:"0 8px 28px rgba(160,105,74,0.15)", animation:"slideIn 0.3s ease" }}>
          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.86rem", color:C.ink, marginBottom:"0.2rem" }}>{notif.title}</div>
          <div style={{ fontSize:"0.76rem", color:C.muted }}>{notif.body}</div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width:222, minWidth:222, background:C.sidebar, display:"flex", flexDirection:"column", padding:"1.3rem 0.85rem", position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>
        <div onClick={() => setScreen("landing")} style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.25rem", color:"#FAF5EE", padding:"0 0.42rem", marginBottom:"1.7rem", cursor:"pointer" }}>
          bloomy<span style={{ color:C.caramel }}>.</span>
        </div>

        <NavItem id="overview"  icon="🏠" label="Overview"        dashPage={dashPage} setDashPage={setDashPage}/>
        <NavItem id="wellness"  icon="📈" label="Wellness"         dashPage={dashPage} setDashPage={setDashPage}/>
        <NavItem id="diet"      icon="🥑" label="Diet & Lifestyle" dashPage={dashPage} setDashPage={setDashPage}/>
        <NavItem id="calendar"  icon="📅" label="Calendar"         dashPage={dashPage} setDashPage={setDashPage}/>
        <NavItem id="records"   icon="📋" label="Medical Records"  dashPage={dashPage} setDashPage={setDashPage}/>
        <NavItem id="assistant" icon="🤖" label="AI Assistant"     dashPage={dashPage} setDashPage={setDashPage}/>
        <NavItem id="settings"  icon="⚙️" label="Settings"         dashPage={dashPage} setDashPage={setDashPage}/>

        <div style={{ fontSize:"0.6rem", textTransform:"uppercase", letterSpacing:"0.08em", color:C.ghost, padding:"0 0.52rem", margin:"1rem 0 0.42rem" }}>My Children</div>
        {children.map((ch, i) => (
          <div key={ch.id} onClick={() => setActiveChild(i)} className="nav-hover"
            style={{ display:"flex", alignItems:"center", gap:"0.48rem", borderRadius:10, padding:"0.48rem 0.62rem", cursor:"pointer", border:`1px solid ${activeChild===i?"rgba(255,255,255,0.22)":"transparent"}`, background:activeChild===i?"rgba(255,255,255,0.13)":"transparent", marginBottom:3, transition:"all 0.16s" }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(255,255,255,0.14)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.78rem" }}>{ch.avatar}</div>
            <span style={{ fontSize:"0.81rem", fontWeight:activeChild===i?700:500, color:activeChild===i?"#fff":C.ghost }}>{ch.name}, {ch.age}</span>
          </div>
        ))}
        <button onClick={() => setDashPage("settings")} style={{ width:"100%", padding:"0.42rem", border:"1px solid rgba(255,255,255,0.11)", borderRadius:8, background:"transparent", color:C.ghost, fontSize:"0.76rem", fontWeight:700, marginTop:2 }}>+ Add Child</button>

        <div style={{ marginTop:"auto" }}>
          <div onClick={handleLogout} className="nav-hover"
            style={{ display:"flex", alignItems:"center", gap:"0.52rem", padding:"0.52rem 0.62rem", borderRadius:9, cursor:"pointer", color:C.ghost, fontSize:"0.81rem", fontWeight:500 }}>
            🚪 Log Out
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflowY:"auto", padding:"1.8rem 1.9rem" }}>
        {pages[dashPage]}
      </main>
    </div>
  );
}
