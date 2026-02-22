// ─── COLOUR PALETTE — Softer Warm Latte ──────────────────────────
export const C = {
  bg:       "#F8F3ED",
  card:     "#FEFCF9",
  card2:    "#F2EBE1",
  sidebar:  "#5C3D2E",
  sidebarH: "rgba(255,255,255,0.11)",
  ink:      "#3A2412",
  mid:      "#7A5540",
  muted:    "#A8856A",
  ghost:    "#C9AE96",
  border:   "#E5D8CC",
  mocha:    "#A0694A",
  mochaL:   "#C99778",
  caramel:  "#C9A86C",
  sage:     "#7FAE84",
  dustRose: "#C48A8A",
  lavBlush: "#A890B8",
  cream:    "#EDE0CF",
  happyG:   "#5FAD74",
  sadR:     "#C06060",
  focus:    "rgba(160,105,74,0.15)",
};

export const STEPS = [
  { label:"Child's Basic Info",  eyebrow:"👶 Getting Started",  title:"Tell us about your child",        subtitle:"This helps us personalize their nutrition dashboard and daily health goals." },
  { label:"Health & Allergies",  eyebrow:"⚠️ Health & Safety",  title:"Allergies & Medical History",     subtitle:"Select any known allergies and attach relevant medical files. This keeps your child safe." },
  { label:"Daily Routine",       eyebrow:"🌙 Daily Routine",    title:"Set your child's sleep schedule", subtitle:"Bloomy will automatically activate bedtime mode on the smartwatch, quieting notifications until morning." },
];

export const ALLERGIES = ["🥜 Peanuts","🥛 Dairy","🌾 Gluten / Wheat","🥚 Eggs","🐟 Fish","🦐 Shellfish","🌰 Tree Nuts","🫘 Soy","🌿 Sesame","+ Add custom"];

export const fmt = (m) => `${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`;

export const AI_REPLIES = {
  "How is Emma sleeping this week?":    "Emma's sleep this week has been wonderful! 🌙 She averaged 9.2 hrs per night — right in the ideal 9–11 hr range. A slight dip Wednesday correlates with school days. Overall great sleep hygiene!",
  "When is Emma's next appointment?":   "📅 Emma's next appointment is with Dr. Smith on February 22nd at 10:00 AM. She also has a dental cleaning with Dr. Lee on February 27th at 2:30 PM. Want me to set reminders?",
  "Any health concerns I should know?": "A few gentle things to watch: 💧 Hydration is below target today (3/6 reminders). An extra glass before bed helps! 🤧 Spring allergy season is approaching — her history suggests flares. Bring it up at the Feb 22 visit. Otherwise Emma looks wonderful! 🌸",
  "Remind me about Emma's medication":  "💊 Daily Allergy Med (Cetirizine 5mg) — every morning at 8:00 AM. I'll send a watch nudge at 7:45 AM tomorrow. No other recurring meds on file. Need to add one?",
};

export const FALLBACK = [
  "Based on Emma's health data, I'd recommend discussing this with Dr. Smith at the Feb 22 check-up. Want me to add a note? 📝",
  "Everything looks lovely overall — her wellness score this week is 82/100. Anything specific you'd like me to focus on? 🌸",
  "I'll keep a gentle eye on that pattern and alert you if anything changes. You're doing a wonderful job! 💛",
];

export const DIET_ADVICE = [
  { icon:"🥑", title:"Healthy Fats for Brain Growth",  tip:"Add avocado, walnuts, or a drizzle of olive oil to meals. Omega-3s support Emma's concentration and memory at school.", tag:"Nutrition"  },
  { icon:"🫐", title:"Berry Boost for Immunity",        tip:"Blueberries and strawberries are rich in antioxidants. A small bowl as a snack 3× a week can strengthen her immune system.", tag:"Snack"      },
  { icon:"💧", title:"Hydration Habit",                 tip:"Emma is only hitting 50% of her daily water goal. Try fun water bottles or infused water with cucumber or lemon.", tag:"Hydration"  },
  { icon:"🌾", title:"Whole Grains Over Refined",       tip:"Swap white bread for whole wheat or oat-based options. This stabilizes energy and keeps her fuller longer.", tag:"Meal Swap"  },
  { icon:"🥕", title:"Rainbow Plate Challenge",         tip:"Aim for 3 different colored vegetables at dinner this week — each color provides different micronutrients.", tag:"Challenge"  },
  { icon:"😴", title:"Sleep & Nutrition Link",          tip:"Emma's 9.5 hr sleep is excellent! Maintain it with a light, low-sugar dinner and no screens 1 hr before bed.", tag:"Lifestyle"  },
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────
export const G = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { margin:0; background:#F8F3ED; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-thumb { background:#C9AE96; border-radius:99px; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
  @keyframes bloom   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
  input::placeholder, textarea::placeholder { color:#C9AE96; }
  input:focus, select:focus, textarea:focus { outline:none !important; border-color:#A0694A !important; box-shadow:0 0 0 3px rgba(160,105,74,0.13) !important; }
  button { cursor:pointer; font-family:'Nunito',sans-serif; }
  .nav-hover:hover { background:rgba(255,255,255,0.11) !important; }
`;

export const cardS = (x = {}) => ({ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "1.4rem", ...x });

export const inp2 = { width:"100%", background:C.card2, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"0.72rem 1rem", color:C.ink, fontFamily:"'DM Sans',sans-serif", fontSize:"0.93rem", outline:"none", appearance:"none" };

export const MOCK_SCAN = {
  product:"Snack Bar (Scanned Label)",
  allergens:["🥜 Peanuts","🥛 Dairy","🌾 Gluten / Wheat"],
  mayContain:["🌰 Tree Nuts","🫘 Soy"],
  warning:"Contains Peanuts & Dairy — matches Emma's known allergies!",
  safe:false,
  nutrients:[
    { label:"Calories",    val:"210 kcal" },
    { label:"Total Sugar", val:"18g ⚠️"   },
    { label:"Protein",     val:"4g"        },
    { label:"Sodium",      val:"180mg"     },
  ],
};

export const WK = [{l:"Mon"},{l:"Tue"},{l:"Wed"},{l:"Thu"},{l:"Fri"},{l:"Sat"},{l:"Today"}];
