import { useState, useEffect } from "react";
import { C, cardS, inp2 } from "../../constants";
import { CT } from "../../components/Shared";

const AVATARS       = ["👩","👨","🧑","👩‍🦱","👨‍🦱","👩‍🦳","👨‍🦳"];
const CHILD_AVATARS = ["👧","👦","🧒","👶","🧒‍♀️","👧🏽","👦🏽"];

export default function PageSettings({
  parentProfile, setParentProfile,
  editParent, setEditParent,
  addingChild, setAddingChild,
  newChild, setNewChild,
  children, setChildren,
  activeChild, setActiveChild,
  saveNewChild, fireNotif,
}) {
  const [pForm, setPForm] = useState({ ...parentProfile });

  // Sync local form whenever the real parentProfile changes (e.g. Firebase loads)
  useEffect(() => {
    if (!editParent) setPForm({ ...parentProfile });
  }, [parentProfile]);

  return (
    <>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", color:C.ink, marginBottom:"0.22rem" }}>⚙️ <span style={{ color:C.mocha }}>Settings</span></div>
      <div style={{ color:C.muted, fontSize:"0.83rem", marginBottom:"1.3rem" }}>Manage your profile and your children's profiles</div>

      {/* ── Parent profile ── */}
      <div style={cardS({ marginBottom:"1rem" })}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
          <CT>👤 Parent Profile</CT>
          <button onClick={() => setEditParent(p => !p)} style={{ padding:"0.42rem 0.95rem", border:`1.5px solid ${C.border}`, borderRadius:9, background:editParent?C.mocha:"transparent", color:editParent?"#fff":C.mid, fontSize:"0.78rem", fontWeight:700 }}>
            {editParent?"✓ Save Changes":"✏️ Edit Profile"}
          </button>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"1.2rem", marginBottom:"1.2rem" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:`linear-gradient(135deg,${C.mochaL},${C.caramel})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", border:`3px solid ${C.border}` }}>{pForm.avatar}</div>
          {editParent && (
            <div>
              <div style={{ fontSize:"0.72rem", fontWeight:800, color:C.mid, marginBottom:"0.4rem" }}>Choose Avatar</div>
              <div style={{ display:"flex", gap:6 }}>
                {AVATARS.map(av => (
                  <button key={av} onClick={() => setPForm(p => ({ ...p, avatar:av }))} style={{ width:34, height:34, borderRadius:"50%", border:`1.5px solid ${pForm.avatar===av?C.mocha:C.border}`, background:pForm.avatar===av?"rgba(160,105,74,0.1)":C.card2, fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>{av}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.82rem 1.4rem" }}>
          {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Timezone","timezone","text"]].map(([label, key, type]) => (
            <div key={key}>
              <div style={{ fontSize:"0.72rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.32rem", fontWeight:700 }}>{label}</div>
              {editParent
                ? <input style={{ ...inp2, marginBottom:0 }} type={type} value={pForm[key]} onChange={e => setPForm(p => ({ ...p, [key]:e.target.value }))}/>
                : <div style={{ fontSize:"0.88rem", fontWeight:600, color:C.ink, padding:"0.38rem 0" }}>{pForm[key]}</div>
              }
            </div>
          ))}
        </div>

        {editParent && (
          <button onClick={() => { setParentProfile(pForm); setEditParent(false); fireNotif("✅ Profile Saved","Your profile has been updated!"); }} style={{ marginTop:"1rem", padding:"0.6rem 1.5rem", border:"none", borderRadius:11, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.85rem", boxShadow:"0 3px 11px rgba(160,105,74,0.22)" }}>
            Save Changes
          </button>
        )}
      </div>

      {/* ── Children profiles ── */}
      <div style={cardS()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
          <CT>👶 Children's Profiles</CT>
          <button onClick={() => setAddingChild(true)} style={{ padding:"0.42rem 0.95rem", border:"none", borderRadius:9, background:C.mocha, color:"#fff", fontSize:"0.78rem", fontWeight:800, boxShadow:"0 3px 10px rgba(160,105,74,0.2)" }}>+ Add Child</button>
        </div>

        {children.map((ch, i) => (
          <div key={ch.id} onClick={() => setActiveChild(i)} style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0.85rem 1rem", borderRadius:13, marginBottom:"0.55rem", background:activeChild===i?"rgba(160,105,74,0.08)":C.card2, border:`1.5px solid ${activeChild===i?C.mocha:C.border}`, cursor:"pointer", transition:"all 0.18s" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${C.mochaL},${C.caramel})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>{ch.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:"0.9rem", color:C.ink }}>{ch.name}</div>
              <div style={{ fontSize:"0.73rem", color:C.muted, marginTop:2 }}>Age {ch.age} · {ch.gender} · {ch.height} · {ch.weight}</div>
              {ch.allergies?.length > 0 && <div style={{ fontSize:"0.7rem", color:C.dustRose, marginTop:3 }}>⚠️ Allergies: {ch.allergies.join(", ")}</div>}
            </div>
            {activeChild === i && <div style={{ fontSize:"0.72rem", fontWeight:800, color:C.mocha, background:"rgba(160,105,74,0.1)", border:`1px solid rgba(160,105,74,0.2)`, borderRadius:99, padding:"3px 10px" }}>Active</div>}
          </div>
        ))}

        {/* Add child form */}
        {addingChild && (
          <div style={{ marginTop:"0.9rem", padding:"1.2rem", background:C.card2, border:`1.5px solid ${C.border}`, borderRadius:15, animation:"fadeUp 0.3s ease" }}>
            <div style={{ fontWeight:800, fontSize:"0.9rem", color:C.ink, marginBottom:"0.9rem" }}>🌸 Add a New Child</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem 1.2rem", marginBottom:"0.9rem" }}>
              {[["Name","name","text","e.g. Lily"],["Date of Birth","dob","date",""],["Height","height","text","e.g. 105 cm"],["Weight","weight","text","e.g. 18 kg"],["Blood Type","bloodType","text","e.g. O+"],["Doctor","doctor","text","e.g. Dr. Lee"]].map(([label, key, type, ph]) => (
                <div key={key}>
                  <div style={{ fontSize:"0.72rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.3rem", fontWeight:700 }}>{label}</div>
                  <input style={{ ...inp2, marginBottom:0 }} type={type} placeholder={ph} value={newChild[key]||""} onChange={e => setNewChild(p => ({ ...p, [key]:e.target.value }))}/>
                </div>
              ))}
              <div style={{ gridColumn:"span 2" }}>
                <div style={{ fontSize:"0.72rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.4rem", fontWeight:700 }}>Gender</div>
                <div style={{ display:"flex", gap:9 }}>
                  {[["girl","👧","Girl"],["boy","👦","Boy"]].map(([val, icon, lbl]) => (
                    <div key={val} onClick={() => setNewChild(p => ({ ...p, gender:val }))} style={{ flex:1, border:`1.5px solid ${newChild.gender===val?C.mocha:C.border}`, borderRadius:10, padding:"10px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:9, background:newChild.gender===val?"rgba(160,105,74,0.07)":C.card }}>
                      <span style={{ fontSize:22 }}>{icon}</span><span style={{ fontSize:13.5, fontWeight:800, color:C.ink }}>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn:"span 2" }}>
                <div style={{ fontSize:"0.72rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"0.4rem", fontWeight:700 }}>Choose Avatar</div>
                <div style={{ display:"flex", gap:7 }}>
                  {CHILD_AVATARS.map(av => (
                    <button key={av} onClick={() => setNewChild(p => ({ ...p, avatar:av }))} style={{ width:36, height:36, borderRadius:"50%", border:`1.5px solid ${newChild.avatar===av?C.mocha:C.border}`, background:newChild.avatar===av?"rgba(160,105,74,0.1)":C.card, fontSize:"1.15rem", display:"flex", alignItems:"center", justifyContent:"center" }}>{av}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"0.6rem" }}>
              <button onClick={saveNewChild} style={{ padding:"0.6rem 1.4rem", border:"none", borderRadius:10, background:C.mocha, color:"#fff", fontWeight:800, fontSize:"0.83rem", boxShadow:"0 3px 10px rgba(160,105,74,0.2)" }}>Save Child Profile</button>
              <button onClick={() => setAddingChild(false)} style={{ padding:"0.6rem 1.1rem", border:`1.5px solid ${C.border}`, borderRadius:10, background:"transparent", color:C.mid, fontWeight:700, fontSize:"0.83rem" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
