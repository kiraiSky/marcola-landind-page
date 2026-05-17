// Main UI components (Nav, Hero, Services, Brands, About, Gallery, Reviews, Contact, FAQ, Footer)
const { useState, useEffect, useRef, useMemo } = React;

// ---- shared helpers ----
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // fallback: if user has reduced motion or IO is slow, reveal after short delay
    const fallback = setTimeout(() => el.classList.add("visible"), 600);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          clearTimeout(fallback);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallback); };
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
      <header className="topbar">
        <div className="container-wide nav">
          <a href="#top" className="brand">
            <img src="assets/logo.png" alt="Marcola Garagem" />
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
          <h1>
            <small className="kicker">— {t.hero.kicker}</small>
            {t.hero.title1}<br/>{t.hero.title2}<span className="red">.</span>
          </h1>
          <p className="lead" style={{ marginTop: 24, fontStyle: "normal" }}>
            <span style={{ color: "var(--text-3)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: ".15em", textTransform: "uppercase", display: "block", marginBottom: 14 }}>{t.hero.title3}</span>
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
          <span>BAY 01 / LIVE</span>
        </div>
        <div className="hero-photo-tag">
          <div>
            <span className="red-mark"></span>
            <span className="ref">In the shop</span>
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
    <section id="services" className="section-pad">
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
        <div className="brands-strip">
          <div className="brands-track">
            {[...list, ...list].map((b, i) => <span key={i}>{b}</span>)}
          </div>
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
              <img src="assets/photo-diagnostic.png" alt="Diagnóstico ao vivo" />
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
            <div className="about-list">
              {t.about.items.map((it, i) => (
                <div className="about-list-item" key={i}>
                  <span className="n">{it.n}</span>
                  <div>
                    <h4>{it.title}</h4>
                    <p>{it.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
    <section id="gallery" className="section-pad">
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
                      <img src={p.src} alt={t.gallery.items[i].cap} />
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
  return (
    <section id="reviews" className="section-pad" style={{ background: "var(--bg-soft)" }}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.reviews.eyebrow}</span>
          <h2 className="section-title"><span>{t.reviews.title1}</span> <span className="chrome">{t.reviews.title2}</span> <span className="outline">{t.reviews.title3}</span></h2>
        </Reveal>
        <Reveal stagger className="reviews">
          {t.reviews.list.map((r, i) => (
            <div className="review" key={i}>
              <div className="review-stars">{"★".repeat(r.stars)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-foot">
                <span className="av">{r.initial}</span>
                <div>
                  <b>{r.name}</b>
                  <span>{r.when}</span>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
        <Reveal className="reviews-summary">
          <div className="score">4.9<span className="of">/5</span></div>
          <div className="meta">
            <b>{t.reviews.summary}</b>
            <span>+ 180 {t.reviews.reviews}</span>
          </div>
          <a className="btn btn-ghost" href="https://www.google.com/search?q=Marcola+Garagem+Quarteira" target="_blank" rel="noreferrer">Google Reviews <IconArrowR /></a>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT (map + info)
// ============================================================
function Contact({ t }) {
  return (
    <section id="contact" className="section-pad">
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="section-title"><span className="outline">{t.contact.title1}</span> <span className="chrome">{t.contact.title2}</span></h2>
        </Reveal>
        <Reveal className="contact-grid">
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
              <span className="open"><i></i>{t.contact.open}</span>
            </div>
            <iframe src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa Marcola Garagem"></iframe>
          </div>
        </Reveal>
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
      </div>
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
        <Reveal className="faq">
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
            <img src="assets/logo.png" alt="Marcola" />
            <p>{t.footer.tag}</p>
          </div>
          <div className="foot-col">
            <h5>{t.footer.explore}</h5>
            <a href="#services">{t.nav.services}</a>
            <a href="#about">{t.nav.about}</a>
            <a href="#gallery">{t.nav.gallery}</a>
            <a href="#reviews">{t.nav.reviews}</a>
            <a href="#booking">{t.nav.booking}</a>
            <a href="#contact">{t.nav.contact}</a>
          </div>
          <div className="foot-col">
            <h5>{t.footer.legal}</h5>
            {t.footer.legalLinks.map((l, i) => <a key={i} href="#">{l}</a>)}
          </div>
          <div className="foot-col">
            <h5>{t.footer.followUs}</h5>
            <a href={WA_URL} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="https://www.google.com/search?q=Marcola+Garagem+Quarteira" target="_blank" rel="noreferrer">Google</a>
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
