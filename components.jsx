// Main UI components (Nav, Hero, Services, Brands, About, Gallery, Reviews, Contact, FAQ, Footer)
const { useState, useEffect, useRef, useMemo } = React;

// ---- shared helpers ----
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          io.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -48px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ as: Tag = "div", className = "", stagger = false, children, ...rest }) {
  const ref = useReveal();
  const cls = `${stagger ? "reveal-stagger" : "reveal"} ${className}`;
  return (
    <Tag ref={ref} className={cls} {...rest}>{children}</Tag>
  );
}

function IconArrow({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 19L19 5M19 5H8M19 5v11" />
    </svg>
  );
}
function IconArrowR() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
}
function IconArrowL() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
}
function IconWA({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.8.8 2.5.8 3.3.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  );
}
function IconSun() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>; }
function IconMoon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z"/></svg>; }
function IconPhone() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2.3z"/></svg>; }

// ============================================================
// NAV
// ============================================================
function Nav({ t, lang, setLang, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    { href: "#services", label: t.nav.services, n: "01" },
    { href: "#about", label: t.nav.about, n: "02" },
    { href: "#gallery", label: t.nav.gallery, n: "03" },
    { href: "#reviews", label: t.nav.reviews, n: "04" },
    { href: "#booking", label: t.nav.booking, n: "05" },
    { href: "#contact", label: t.nav.contact, n: "06" },
  ];

  return (
    <>
      <header className={`topbar${open ? " topbar-drawer-open" : ""}`}>
        <div className="container-wide nav">
          <a href="#top" className="brand">
            <img src="assets/logo.png" alt="Marcola Garagem — car mechanic and workshop in Quarteira, Algarve" width="44" height="44" />
            <div className="brand-meta">
              <b>MARCOLA</b>
              <small>Garagem · Quarteira</small>
            </div>
          </a>
          <nav className="nav-links">
            {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
          <div className="nav-tools">
            <button className="lang-btn" onClick={() => setLang(lang === "pt" ? "en" : "pt")} aria-label="Toggle language">
              <span className={lang === "pt" ? "on" : ""}>PT</span>
              <span className="sep">/</span>
              <span className={lang === "en" ? "on" : ""}>EN</span>
            </button>
            <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
            <a className="nav-phone" href={`tel:${PHONE_TEL}`}>
              <i className="dot"></i>
              <span>{PHONE_DISPLAY}</span>
            </a>
            <button className={`hamburger ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        {links.map(l => (
          <a key={l.href} className="mlink" href={l.href} onClick={() => setOpen(false)}>
            <span>/ {l.n}</span>
            <span style={{ fontFamily: "Saira Condensed", fontSize: "inherit", color: "inherit", letterSpacing: 0, fontWeight: 700 }}>{l.label}</span>
          </a>
        ))}
        <div className="mobile-drawer-foot">
          <a className="btn btn-red" href="#booking" onClick={() => setOpen(false)} style={{ justifyContent: "center", width: "100%" }}>
            {t.nav.book} <IconArrow size={16} />
          </a>
          <a className="btn btn-wa" href={WA_URL} target="_blank" rel="noreferrer" style={{ justifyContent: "center", width: "100%" }}>
            <IconWA /> WhatsApp
          </a>
          <a className="btn btn-ghost" href={`tel:${PHONE_TEL}`} style={{ justifyContent: "center", width: "100%" }}>
            <IconPhone /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero({ t }) {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 1000);
        if (ref.current) ref.current.style.setProperty("--paraY", `${y * 0.35}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-left">
        <Reveal stagger className="hero-content-top">
          <div>
            <span className="hero-eyebrow">
              <span className="pulse"></span>
              <span>{t.hero.eyebrow}</span>
              <span className="bar"></span>
              <span style={{ color: "var(--text-3)" }}>N° 01</span>
            </span>
          </div>
          <span className="hero-kicker">— {t.hero.kicker}</span>
          <h1>{t.hero.title1} {t.hero.title2}.</h1>
          <p className="lead" style={{ marginTop: 24, fontStyle: "normal" }}>
            <span style={{ color: "var(--text-3)", fontFamily: "'Oswald', monospace", fontSize: 12, letterSpacing: ".15em", textTransform: "uppercase", display: "block", marginBottom: 14 }}>{t.hero.title3}</span>
            {t.hero.lead}
          </p>
          <div className="hero-cta">
            <a className="btn btn-red" href="#booking">{t.hero.ctaBook} <IconArrow size={18} /></a>
            <a className="btn btn-wa" href={WA_URL} target="_blank" rel="noreferrer"><IconWA />{t.hero.ctaWa}</a>
          </div>
        </Reveal>
        <Reveal className="hero-content-bottom">
          <div className="hero-meta">
            <div><b><span className="acc">{t.hero.stat1n}</span></b><span>{t.hero.stat1l}</span></div>
            <div><b>{t.hero.stat2n}</b><span>{t.hero.stat2l}</span></div>
            <div><b>{t.hero.stat3n}<span className="acc">★</span></b><span>{t.hero.stat3l}</span></div>
            <div><b>{t.hero.stat4n}</b><span>{t.hero.stat4l}</span></div>
          </div>
        </Reveal>
        <div className="scroll-cue">
          <span>{t.hero.scroll}</span>
          <span className="line"></span>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-bg" ref={ref}></div>
        <span className="hero-vline"></span>
        <span className="hero-vlabel">N 37°04' · W 8°06' · Quarteira</span>
        <div className="hero-tick-strip">
          <span className="tick"></span>
          <span>{t.hero.bayLabel}</span>
        </div>
        <div className="hero-photo-tag">
          <div>
            <span className="red-mark"></span>
            <span className="ref">{t.hero.inShop}</span>
            <b>Porsche Macan GTS</b>
          </div>
          <span className="ref">'24</span>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES
// ============================================================
function Services({ t }) {
  return (
    <section id="services" className="section-pad" style={{ background: "var(--bg-soft)" }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="section-title"><span className="chrome">{t.services.title1}</span> <span className="outline">{t.services.title2}</span></h2>
          <p className="section-sub">{t.services.sub}</p>
        </Reveal>
        <Reveal stagger className="svc-grid">
          {t.services.list.map((s, i) => (
            <div className="svc" key={i}>
              <div className="svc-head">
                <span className="svc-num">/ 0{i + 1}</span>
                <span className="svc-arrow"><IconArrow size={20} /></span>
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="tags">
                  {s.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// BRANDS STRIP
// ============================================================
function Brands({ t }) {
  const list = ["Porsche", "Land Rover", "BMW", "Audi", "Mercedes-Benz", "Volkswagen", "Renault", "Peugeot", "Toyota", "Volvo", "Mini", "Ford"];
  return (
    <section id="brands" className="section-pad-sm">
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.brands.eyebrow}</span>
          <h2 className="section-title">
            <span>{t.brands.title1}</span> <span className="red" style={{ color: "var(--red)" }}>{t.brands.title2}</span> <span className="chrome">{t.brands.title3}</span>
          </h2>
          <p className="section-sub">{t.brands.sub}</p>
        </Reveal>
      </div>
      <div className="brands-strip">
        <div className="brands-track">
          {[...list, ...list].map((b, i) => <span key={i}>{b}</span>)}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT
// ============================================================
function About({ t }) {
  return (
    <section id="about" className="section-pad">
      <div className="container">
        <div className="about">
          <Reveal>
            <div className="about-imgwrap">
              <span className="about-badge">{t.about.badge}</span>
              <img src="assets/photo-diagnostic.png" alt={t.about.imgAlt} loading="lazy" width="800" height="1000" />
              <div className="about-caption">
                <b>{t.about.caption1}</b>
                <span>{t.about.caption2}</span>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2 className="section-title"><span className="outline">{t.about.title1}</span> <span>{t.about.title2}</span> <span className="chrome">{t.about.title3}</span></h2>
            <p className="section-sub">{t.about.p1}</p>
            <p style={{ color: "var(--text-2)", marginTop: 16, fontSize: 16, lineHeight: 1.55, maxWidth: 640 }}>{t.about.p2}</p>
            <Reveal stagger className="about-list">
              {t.about.items.map((it, i) => (
                <div className="about-list-item" key={i}>
                  <span className="n">{it.n}</span>
                  <div>
                    <h4>{it.title}</h4>
                    <p>{it.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// GALLERY
// ============================================================
function Gallery({ t }) {
  const photos = [
    { src: "assets/photo-evoque.png", placeholder: false },
    { src: "assets/photo-porsche.png", placeholder: false },
    { src: "assets/photo-diagnostic.png", placeholder: false },
    { src: null, placeholder: true },
    { src: null, placeholder: true },
    { src: null, placeholder: true },
  ];
  const [page, setPage] = useState(0);
  const pages = Math.ceil(photos.length / 2);

  return (
    <section id="gallery" className="section-pad" style={{ background: "var(--bg-soft)" }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.gallery.eyebrow}</span>
          <h2 className="section-title"><span className="outline">{t.gallery.title1}</span> <span className="chrome">{t.gallery.title2}</span></h2>
          <p className="section-sub">{t.gallery.sub}</p>
        </Reveal>
        <Reveal className="gallery">
          <div className="gallery-track-wrap">
            <div className="gallery-track" style={{ transform: `translateX(calc(-${page * 100}% - ${page * 24}px))` }}>
              {photos.map((p, i) => (
                <div className={`gallery-card ${p.placeholder ? "placeholder" : ""}`} key={i}>
                  {p.placeholder ? (
                    <div>
                      {t.gallery.items[i].meta}<br />
                      <span style={{ opacity: .5 }}>{t.gallery.items[i].cap}</span>
                    </div>
                  ) : (
                    <>
                      <img src={p.src} alt={`${t.gallery.items[i].cap} — ${t.gallery.items[i].meta} at Marcola Garagem, Quarteira`} loading="lazy" width="800" height="600" />
                      <div className="gallery-cap">
                        <b>{t.gallery.items[i].cap}</b>
                        <span>{t.gallery.items[i].meta}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="gallery-nav">
            <div className="gallery-dots">
              {Array.from({ length: pages }).map((_, i) => (
                <b key={i} className={i === page ? "active" : ""} onClick={() => setPage(i)}></b>
              ))}
            </div>
            <div className="gallery-arrows">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous"><IconArrowL /></button>
              <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} aria-label="Next"><IconArrowR /></button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// REVIEWS
// ============================================================
function Reviews({ t }) {
  const list = t.reviews.list;
  const N = list.length;
  const items = useMemo(() => [...list, ...list, ...list], [list]);
  // Start at N+1 so list[0] peeks on the left and list[1..3] are visible
  const [idx, setIdx] = useState(N + 1);
  const [noTransit, setNoTransit] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cardW, setCardW] = useState(0);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const side = Math.max(24, (vw - 1320) / 2 + 24);
      setCardW(Math.floor((vw - 2 * side - 2 * 24) / 3));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Infinite loop: when out of the safe band [N+1 .. N*2], jump ±N without transition
  useEffect(() => {
    if (idx >= N * 2 + 1 || idx <= N) {
      const timer = setTimeout(() => {
        setNoTransit(true);
        setIdx(i => i >= N * 2 + 1 ? i - N : i + N);
      }, 820);
      return () => clearTimeout(timer);
    }
  }, [idx, N]);

  useEffect(() => {
    if (noTransit) {
      const timer = setTimeout(() => setNoTransit(false), 50);
      return () => clearTimeout(timer);
    }
  }, [noTransit]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIdx(i => i + 1), 10000);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => setIdx(i => i - 1);
  const next = () => setIdx(i => i + 1);
  const activeIdx = (idx - 1 + N * 10) % N;

  return (
    <section id="reviews" className="section-pad" style={{ background: "var(--bg)" }}>
      <div className="container">
        <Reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <span className="eyebrow">{t.reviews.eyebrow}</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              <span>{t.reviews.title1}</span> <span className="chrome">{t.reviews.title2}</span> <span className="outline">{t.reviews.title3}</span>
            </h2>
          </div>
          <div className="gallery-arrows" style={{ marginBottom: 8 }}>
            <button onClick={prev} aria-label="Anterior"><IconArrowL /></button>
            <button onClick={next} aria-label="Próximo"><IconArrowR /></button>
          </div>
        </Reveal>
      </div>

      <div
        style={{ overflow: "hidden", marginTop: 48 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div style={{
          display: "flex",
          gap: 24,
          paddingLeft: "max(24px, calc((100vw - 1320px) / 2 + 24px))",
          transform: `translateX(-${idx * (cardW + 24)}px)`,
          transition: noTransit ? "none" : "transform .8s cubic-bezier(.65,0,.35,1)",
        }}>
          {items.map((r, i) => (
            <div key={i} className="review" style={{ flex: `0 0 ${cardW}px` }}>
              <div className="review-stars">{"★".repeat(r.stars)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-foot">
                <span className="av">{r.initial}</span>
                <div><b>{r.name}</b><span>{r.when}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <Reveal style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32, flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {list.map((_, i) => (
              <button key={i} onClick={() => setIdx(N + 1 + i)}
                style={{ width: i === activeIdx ? 32 : 10, height: 4, background: i === activeIdx ? "var(--red)" : "var(--border)", border: "none", cursor: "pointer", borderRadius: 2, transition: "width .3s, background .3s", padding: 0 }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "Saira Condensed", fontSize: 48, fontWeight: 800, lineHeight: 1 }}>4.9</span>
              <span style={{ color: "var(--text-3)", fontFamily: "Saira Condensed", fontSize: 20 }}>/5</span>
              <span style={{ fontFamily: "Oswald", fontSize: 11, color: "var(--text-3)", letterSpacing: ".15em", textTransform: "uppercase", marginLeft: 8 }}>+ 180 {t.reviews.reviews}</span>
            </div>
            <a className="btn btn-ghost" href="https://www.google.com/search?q=Marcola+Garagem+Quarteira" target="_blank" rel="noreferrer">Google Reviews <IconArrowR /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Returns true if currently within business hours (Europe/Lisbon timezone).
// Mon–Fri 08:30–18:30, Sat 09:00–13:00, Sun closed.
function checkIsOpen() {
  const now = new Date();
  const lisbon = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const parts = Object.fromEntries(lisbon.map(p => [p.type, p.value]));
  const day = parts.weekday;   // "Mon", "Tue", ... "Sun"
  const h = parseInt(parts.hour, 10);
  const m = parseInt(parts.minute, 10);
  const mins = h * 60 + m;

  if (["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)) {
    return mins >= 8 * 60 + 30 && mins < 18 * 60 + 30;
  }
  if (day === "Sat") {
    return mins >= 9 * 60 && mins < 13 * 60;
  }
  return false; // Sunday
}

// ============================================================
// CONTACT (map + info)
// ============================================================
function Contact({ t }) {
  const [isOpen, setIsOpen] = React.useState(checkIsOpen);

  React.useEffect(() => {
    const id = setInterval(() => setIsOpen(checkIsOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="contact" className="section-pad" style={{ paddingBottom: 0 }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="section-title"><span className="outline">{t.contact.title1}</span> <span className="chrome">{t.contact.title2}</span></h2>
        </Reveal>
        <Reveal stagger className="contact-grid">
          <div className="contact-info">
            <div className="contact-row">
              <span className="k">{t.contact.labels.address}</span>
              <span className="v">
                <a href={MAP_LINK} target="_blank" rel="noreferrer">{ADDRESS}</a>
              </span>
            </div>
            <div className="contact-row">
              <span className="k">{t.contact.labels.phone}</span>
              <span className="v"><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></span>
            </div>
            <div className="contact-row">
              <span className="k">{t.contact.labels.whatsapp}</span>
              <span className="v"><a href={WA_URL} target="_blank" rel="noreferrer">{PHONE_DISPLAY}</a></span>
            </div>
            <div className="contact-row">
              <span className="k">{t.contact.labels.hours}</span>
              <span className="v">
                <div className="hours-table">
                  {t.contact.hours.map((h, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 24, minWidth: 240, maxWidth: 320 }}>
                      <span style={{ color: "var(--text-2)" }}>{h[0]}</span>
                      <span className={h[1].toLowerCase().includes("encerrado") || h[1].toLowerCase().includes("closed") ? "closed" : ""}>{h[1]}</span>
                    </div>
                  ))}
                </div>
              </span>
            </div>
          </div>
          <div className="map-wrap">
            <div className="map-pin">
              <b>Marcola Garagem</b>
              <span>{ADDRESS}</span>
              {isOpen
                ? <span className="open"><i></i>{t.contact.open}</span>
                : <span style={{ fontFamily: "var(--mono, 'Oswald')", fontSize: 10, letterSpacing: ".15em", color: "var(--text-3)", marginTop: 10, textTransform: "uppercase", display: "flex", gap: 6, alignItems: "center" }}><i style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-3)", display: "inline-block" }}></i>{t.contact.closed}</span>
              }
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  marginTop: 12,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 12px",
                  background: "var(--red)",
                  color: "#fff",
                  fontFamily: "var(--mono, 'Oswald')",
                  fontSize: 10,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Direções
              </a>
            </div>
            <iframe src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa Marcola Garagem"></iframe>
          </div>
        </Reveal>
      </div>
      <Reveal>
        <div className="cta-strip">
          <div>
            <h3>{t.contact.cta.title}</h3>
            <p>{t.contact.cta.body}</p>
          </div>
          <div className="cta-strip-actions">
            <a className="btn btn-red" href="#booking">{t.contact.cta.primary} <IconArrow size={16} /></a>
            <a className="btn btn-wa" href={WA_URL} target="_blank" rel="noreferrer"><IconWA />{t.contact.cta.wa}</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ============================================================
// FAQ
// ============================================================
function FAQ({ t }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section-pad" style={{ background: "var(--bg-soft)" }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.faq.eyebrow}</span>
          <h2 className="section-title"><span>{t.faq.title1}</span> <span className="chrome">{t.faq.title2}</span></h2>
        </Reveal>
        <Reveal stagger className="faq">
          {t.faq.items.map((item, i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={i}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{item.q}</span>
                <span className="plus"></span>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ t }) {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src="assets/logo.png" alt="Marcola Garagem — car workshop logo" width="56" height="56" />
            <p>{t.footer.tag}</p>
          </div>
          <div className="foot-col">
            <h5>{t.footer.explore}</h5>
            {t.footer.exploreLinks.map((l, i) => (
              <a key={i} href={l.href}>{l.label}</a>
            ))}
          </div>
          <div className="foot-col">
            <h5>{t.footer.legal}</h5>
            {t.footer.legalLinks.map((l, i) => <span key={i} className="foot-legal">{l}</span>)}
            <a href={`mailto:geral@marcolagaragem.pt?subject=${encodeURIComponent(t.footer.dpoSubject)}`}>{t.footer.dpoLink}</a>
          </div>
          <div className="foot-col">
            <h5>{t.footer.followUs}</h5>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer">{t.footer.waLink}</a>
            <a href="https://www.google.com/search?q=Marcola+Garagem+Quarteira" target="_blank" rel="noopener noreferrer">{t.footer.googleLink}</a>
            <a href={`tel:${PHONE_TEL}`}>{t.footer.callLink}</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{t.footer.copy}</span>
          <span>{t.footer.lic}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav, Hero, Services, Brands, About, Gallery, Reviews, Contact, FAQ, Footer,
  Reveal, useReveal,
  IconArrow, IconArrowL, IconArrowR, IconWA, IconPhone,
});
