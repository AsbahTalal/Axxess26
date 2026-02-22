import { useState, useEffect, useRef } from "react";

// ── Scroll-reveal hook ──────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ── Plant Logo SVG ──────────────────────────────────────────
function PlantLogo({ size = 32, color = "#D4920A" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 72 C40 72 39 54 40 44 C41 36 40 30 40 30" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M40 44 C36 40 28 38 24 30 C20 22 26 16 33 20 C37 22 40 30 40 30" fill={color}/>
      <ellipse cx="27" cy="26" rx="9" ry="12" transform="rotate(-30 27 26)" fill={color}/>
      <path d="M40 36 C44 30 52 26 56 18 C60 10 54 6 48 10 C44 13 40 22 40 22" fill={color}/>
      <ellipse cx="51" cy="16" rx="9" ry="12" transform="rotate(25 51 16)" fill={color}/>
    </svg>
  );
}

// ── Data ────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🥗", name: "Food Recommendation", desc: "Personalized meal suggestions based on child's age and nutritional needs." },
  { icon: "🤖", name: "Interactive Chatbot", desc: "Solve your queries by interacting with our intelligent assistant." },
  { icon: "🐻", name: "Smartwatch Pet Companion", desc: "Virtual pet motivates kids to build healthy daily habits." },
];

const HELP_TOPICS = [
  { emoji: "🫀", color: "#E8F5E9", name: "Health Sync",       desc: "Secure real-time health data tracking"       },
  { emoji: "📊", color: "#FFF8E1", name: "Dashboard Access",  desc: "Parent-friendly health overview"              },
  { emoji: "📈", color: "#E3F2FD", name: "Growth Guide",      desc: "Track development milestones easily"          },
  { emoji: "🔔", color: "#FCE4EC", name: "Setting Reminders", desc: "Smartwatch alerts for healthy habits"         },
  { emoji: "🍽️", color: "#F3E5F5", name: "Meal Planning",     desc: "Personalized nutrition plans for kids"        },
  { emoji: "💊", color: "#E8F4FD", name: "Supplement Guide",  desc: "Age-appropriate vitamin recommendations"      },
  { emoji: "🏃", color: "#FFF3E0", name: "Activity Tracker",  desc: "Daily movement goals for growing kids"        },
];

const C = {
  gold:      "#D4920A",
  goldLight: "#F5C842",
  goldBg:    "#FDF6E3",
  goldMuted: "#F0E0A8",
  text:      "#1A1A1A",
  textMid:   "#4A4A4A",
  textLight: "#888",
  white:     "#FFFFFF",
  bg:        "#FAFAF7",
  border:    "#EBEBEB",
  heroBg:    "#F5EDD8",
};

// ── Carousel ────────────────────────────────────────────────
function HelpCarousel() {
  const [index, setIndex] = useState(0);
  const VISIBLE = 4;
  const max = HELP_TOPICS.length - VISIBLE;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex", gap: 18,
          transition: "transform 0.45s cubic-bezier(.22,1,.36,1)",
          transform: `translateX(calc(-${index} * (100% / ${VISIBLE} + ${18 * (VISIBLE - 1) / VISIBLE}px)))`,
        }}>
          {HELP_TOPICS.map((t, i) => (
            <div key={i} style={{ minWidth: `calc((100% - ${(VISIBLE - 1) * 18}px) / ${VISIBLE})`, flexShrink: 0 }}>
              <div className="help-card">
                <div style={{ width: "100%", aspectRatio: "4/3", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
                  {t.emoji}
                </div>
                <div style={{ padding: "18px 16px" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 5 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.5 }}>{t.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}
        style={{ position: "absolute", top: "38%", left: -22, transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: index === 0 ? "#F5F5F5" : C.white, border: `1.5px solid ${index === 0 ? C.border : C.goldMuted}`, cursor: index === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: index === 0 ? "#CCC" : C.gold, boxShadow: index === 0 ? "none" : "0 4px 16px rgba(212,146,10,0.15)", transition: "all 0.2s", zIndex: 2 }}>
        ‹
      </button>

      <button onClick={() => setIndex(i => Math.min(max, i + 1))} disabled={index >= max}
        style={{ position: "absolute", top: "38%", right: -22, transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: index >= max ? "#F5F5F5" : C.white, border: `1.5px solid ${index >= max ? C.border : C.goldMuted}`, cursor: index >= max ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: index >= max ? "#CCC" : C.gold, boxShadow: index >= max ? "none" : "0 4px 16px rgba(212,146,10,0.15)", transition: "all 0.2s", zIndex: 2 }}>
        ›
      </button>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
        {Array.from({ length: max + 1 }).map((_, i) => (
          <button key={i} onClick={() => setIndex(i)}
            style={{ width: i === index ? 24 : 8, height: 8, borderRadius: 99, background: i === index ? C.gold : C.goldMuted, border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function LandingPage({ setScreen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Playfair+Display:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; background: ${C.bg}; color: ${C.text}; margin: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-link { font-size: 15px; font-weight: 600; color: ${C.textMid}; cursor: pointer; position: relative; transition: color 0.2s; }
        .nav-link:hover { color: ${C.gold}; }
        .nav-link.active { color: ${C.text}; font-weight: 700; }
        .nav-link.active::after { content: ''; position: absolute; bottom: -5px; left: 0; right: 0; height: 2px; background: ${C.text}; border-radius: 2px; }

        .btn-login { padding: 12px 28px; background: ${C.gold}; color: #fff; border: none; border-radius: 10px; font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .btn-login:hover { background: #B87D00; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(212,146,10,0.35); }

        .btn-primary { padding: 14px 28px; background: ${C.gold}; color: #fff; border: none; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; display: inline-block; }
        .btn-primary:hover { background: #B87D00; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,146,10,0.3); }

        .btn-secondary { padding: 14px 24px; background: transparent; color: ${C.textMid}; border: none; font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: color 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-secondary:hover { color: ${C.gold}; }

        .feat-card { border: 1.5px solid ${C.border}; border-radius: 18px; padding: 28px 24px; background: ${C.white}; transition: all 0.22s; cursor: default; }
        .feat-card:hover { border-color: ${C.goldMuted}; box-shadow: 0 8px 32px rgba(212,146,10,0.1); transform: translateY(-4px); }

        .help-card { border-radius: 18px; overflow: hidden; background: ${C.white}; border: 1.5px solid ${C.border}; transition: all 0.22s; cursor: pointer; }
        .help-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(0,0,0,0.1); border-color: ${C.goldMuted}; }

        .social-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid ${C.border}; background: ${C.white}; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: all 0.2s; text-decoration: none; color: ${C.textMid}; }
        .social-btn:hover { border-color: ${C.gold}; background: ${C.goldBg}; }

        .footer-link { font-size: 13px; color: ${C.textLight}; font-weight: 600; transition: color 0.2s; cursor: pointer; }
        .footer-link:hover { color: ${C.gold}; }

        .hero-blob { animation: blobFloat 5s ease-in-out infinite; border-radius: 60% 40% 55% 45% / 50% 45% 55% 50%; }
        @keyframes blobFloat {
          0%,100% { transform: translateY(0); border-radius: 60% 40% 55% 45%/50% 45% 55% 50%; }
          50% { transform: translateY(-12px); border-radius: 55% 45% 60% 40%/45% 55% 50% 50%; }
        }
        .bear-wobble { animation: bearWobble 3s ease-in-out infinite; }
        @keyframes bearWobble {
          0%,100% { transform: rotate(-2deg) scale(1); }
          50% { transform: rotate(2deg) scale(1.04); }
        }
        .badge-float { animation: badgeFloat 4s ease-in-out infinite; }
        .badge-float-delay { animation: badgeFloat 4s ease-in-out 1.5s infinite; }
        @keyframes badgeFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ display: "flex", alignItems: "center", padding: "18px 72px", background: scrolled ? "rgba(255,253,248,0.96)" : C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)", transition: "background 0.3s" }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <PlantLogo size={34} color={C.gold} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.gold }}>Bloomy</span>
        </a>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 36, marginRight: 40 }}>
          <span className="nav-link active">Home</span>
          <span className="nav-link">About Us</span>
          <span className="nav-link">How to use</span>
        </div>
        <button className="btn-login" onClick={() => setScreen("login")}>Log In</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(160deg, ${C.heroBg} 0%, #F7E9C4 60%, #FAFAF7 100%)`, padding: "0 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", minHeight: 420, paddingTop: 56, paddingBottom: 56 }}>
          <div>
            <Reveal>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.gold, marginBottom: 12, fontStyle: "italic" }}>One Smart Solution</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 18 }}>for Growing Healthy Every Day.</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.75, maxWidth: 440, marginBottom: 32 }}>
                Using your child's health profile (age, height, weight, and medical inputs), Bloomy helps parents monitor nutrition while a friendly pet companion motivates kids through smartwatch reminders.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <button className="btn-primary" onClick={() => setScreen("register")}>Get started for free</button>
                <button className="btn-secondary" onClick={() => setScreen("register")}>See how it works →</button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <div className="hero-blob" style={{ width: 380, height: 340, background: "radial-gradient(ellipse at 40% 40%, #FDF0C0 0%, #FAE190 60%, #F5C842 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 60px rgba(212,146,10,0.18)" }}>
              <span className="bear-wobble" style={{ fontSize: 110 }}>🐻</span>
            </div>
            <div className="badge-float" style={{ position: "absolute", top: 10, right: 10, background: C.white, borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 28px rgba(0,0,0,0.1)" }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Nutrition tracked</div>
                <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>Updated daily</div>
              </div>
            </div>
            <div className="badge-float-delay" style={{ position: "absolute", bottom: 24, left: 10, background: C.white, borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 28px rgba(0,0,0,0.1)" }}>
              <span style={{ fontSize: 20 }}>⌚</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Smartwatch sync</div>
                <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>Real-time alerts</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: C.white, padding: "72px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 56, alignItems: "start" }}>
            <Reveal>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: C.gold, marginBottom: 14 }}>Features We Provide</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: C.text, marginBottom: 14, lineHeight: 1.25 }}>Health Profile Tracking 💛</h2>
                <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.7 }}>We calculate growth indicators and monitor key health patterns over time.</p>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {FEATURES.map((f, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="feat-card">
                    <span style={{ fontSize: 48, marginBottom: 16, display: "block" }}>{f.icon}</span>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 8 }}>{f.name}</div>
                    <div style={{ fontSize: 13, color: C.textLight, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HELP TOPICS — CAROUSEL ── */}
      <section style={{ background: C.bg, padding: "72px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: C.gold, marginBottom: 14 }}>Help Topics</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 40 }}>Enhance Your Child's Lifestyle</h2>
          </Reveal>
          <div style={{ padding: "0 28px" }}>
            <HelpCarousel />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.goldBg, borderTop: `1px solid ${C.goldMuted}`, padding: "60px 72px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: `1px solid ${C.goldMuted}` }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <PlantLogo size={28} color={C.gold} />
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.gold }}>Bloomy</span>
              </div>
              <p style={{ fontSize: 13, color: C.textLight, lineHeight: 1.7, marginBottom: 18 }}>Your child's health grows with us</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["f", "𝕏", "📷", "in", "▶"].map((s, i) => <a key={i} className="social-btn">{s}</a>)}
              </div>
            </div>

            {[
              { title: "Product", links: ["Features","Pricing","Case studies","Reviews","Updates"] },
              { title: "Company", links: ["About","Contact us","Careers","Culture","Blog"] },
              { title: "Support", links: ["Getting started","Help center","Server status","Report a bug","Chat support"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 18 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => <span key={l} className="footer-link">{l}</span>)}
                </div>
              </div>
            ))}

            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 18 }}>Contact us</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "✉️", text: "support@bloomy.com" },
                  { icon: "📞", text: "(903) 123 – 4567" },
                  { icon: "📍", text: "800 W. Campbell Road\nRichardson, TX 75080" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: C.textMid, fontWeight: 600, lineHeight: 1.5 }}>
                    <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                    <span style={{ whiteSpace: "pre-line" }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 28 }}>
            <p style={{ fontSize: 13, color: C.textLight, fontWeight: 600 }}>Copyright © 2026</p>
            <div style={{ display: "flex", gap: 24 }}>
              {["All Rights Reserved", "Terms and Conditions", "Privacy Policy"].map((l, i) => (
                <span key={i} className="footer-link">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
