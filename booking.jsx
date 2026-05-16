// Multi-step booking form
const { useState: useStateBk } = React;

function Booking({ t }) {
  const [step, setStep] = useStateBk(0);
  const [data, setData] = useStateBk({
    service: "",
    brand: "", model: "", year: "", plate: "",
    date: "", time: "",
    name: "", phone: "", email: "", notes: "",
  });
  const [done, setDone] = useStateBk(false);
  const [ref] = useStateBk(() => "MG-" + Math.floor(Math.random() * 90000 + 10000));

  const total = 4;
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!data.service;
    if (step === 1) return data.brand && data.model && data.year;
    if (step === 2) return data.date && data.time;
    if (step === 3) return data.name && data.phone;
    return false;
  };

  const submit = () => {
    setDone(true);
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setData({ service: "", brand: "", model: "", year: "", plate: "", date: "", time: "", name: "", phone: "", email: "", notes: "" });
  };

  // build time slots
  const slots = ["08:30", "09:30", "10:30", "11:30", "14:00", "15:30", "17:00"];

  return (
    <section id="booking" className="section-pad">
      <div className="container">
        <Reveal>
          <span className="eyebrow">{t.booking.eyebrow}</span>
          <h2 className="section-title">
            <span className="outline">{t.booking.title1}</span> <span>{t.booking.title2}</span> <span className="chrome">{t.booking.title3}</span>
          </h2>
          <p className="section-sub">{t.booking.sub}</p>
        </Reveal>

        <Reveal className="booking-wrap">
          <div className="booking-side">
            <div>
              <h3>{t.booking.sideTitle}</h3>
              <ul className="booking-perks">
                {t.booking.perks.map((p, i) => (
                  <li key={i}>
                    <span className="ico">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12l5 5 9-12"/></svg>
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="alt">{t.booking.altText}</div>
              <a className="btn btn-ghost" href={`tel:${PHONE_TEL}`} style={{ marginTop: 12 }}>
                <IconPhone /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="booking-form">
            {done ? (
              <div className="confirm-card">
                <div className="ok">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12l5 5 9-12"/></svg>
                </div>
                <h3>{t.booking.confirmTitle}</h3>
                <p>{t.booking.confirmBody}</p>
                <div className="code">{t.booking.confirmCode} {ref}</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
                  <a className="btn btn-wa" href={WA_URL} target="_blank" rel="noreferrer"><IconWA />WhatsApp</a>
                  <button className="btn btn-ghost" onClick={reset}>{t.booking.confirmAgain}</button>
                </div>
              </div>
            ) : (
              <>
                <div className="steps-strip">
                  {Array.from({ length: total }).map((_, i) => (
                    <b key={i} className={i < step ? "done" : i === step ? "current" : ""}></b>
                  ))}
                </div>

                <div className="step-eyebrow">{t.booking.stepLabel} {step + 1} {t.booking.of} {total}</div>

                {step === 0 && (
                  <>
                    <div className="step-title">{t.booking.s1.title}</div>
                    <div className="pick-grid">
                      {t.booking.services.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`pick ${data.service === s ? "active" : ""}`}
                          onClick={() => set("service", s)}
                        >
                          <span className="check"></span>
                          <span>{s}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="step-title">{t.booking.s2.title}</div>
                    <div className="field-row">
                      <div className="field">
                        <label>{t.booking.labels.brand}</label>
                        <input value={data.brand} onChange={(e) => set("brand", e.target.value)} placeholder={t.booking.placeholders.brand} />
                      </div>
                      <div className="field">
                        <label>{t.booking.labels.model}</label>
                        <input value={data.model} onChange={(e) => set("model", e.target.value)} placeholder={t.booking.placeholders.model} />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>{t.booking.labels.year}</label>
                        <input value={data.year} onChange={(e) => set("year", e.target.value)} placeholder={t.booking.placeholders.year} inputMode="numeric" />
                      </div>
                      <div className="field">
                        <label>{t.booking.labels.plate}</label>
                        <input value={data.plate} onChange={(e) => set("plate", e.target.value.toUpperCase())} placeholder={t.booking.placeholders.plate} />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="step-title">{t.booking.s3.title}</div>
                    <div className="field">
                      <label>{t.booking.labels.date}</label>
                      <input
                        type="date"
                        value={data.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => set("date", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>{t.booking.labels.time}</label>
                      <div className="pick-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                        {slots.map((s) => (
                          <button
                            type="button"
                            key={s}
                            className={`pick ${data.time === s ? "active" : ""}`}
                            onClick={() => set("time", s)}
                            style={{ justifyContent: "center", padding: "12px 8px", fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="step-title">{t.booking.s4.title}</div>
                    <div className="summary">
                      <div className="summary-row"><span>{t.booking.sumService}</span><b>{data.service}</b></div>
                      <div className="summary-row"><span>{t.booking.sumVehicle}</span><b>{data.brand} {data.model} ({data.year}){data.plate ? ` · ${data.plate}` : ""}</b></div>
                      <div className="summary-row"><span>{t.booking.sumDate}</span><b>{data.date} · {data.time}</b></div>
                    </div>
                    <div className="field">
                      <label>{t.booking.labels.name}</label>
                      <input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder={t.booking.placeholders.name} />
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>{t.booking.labels.phone}</label>
                        <input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t.booking.placeholders.phone} inputMode="tel" />
                      </div>
                      <div className="field">
                        <label>{t.booking.labels.email}</label>
                        <input value={data.email} onChange={(e) => set("email", e.target.value)} placeholder={t.booking.placeholders.email} type="email" />
                      </div>
                    </div>
                    <div className="field">
                      <label>{t.booking.labels.notes}</label>
                      <textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t.booking.placeholders.notes} rows={3}></textarea>
                    </div>
                  </>
                )}

                <div className="step-nav">
                  <button className="back" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                    ← {t.booking.back}
                  </button>
                  {step < total - 1 ? (
                    <button className="btn btn-red" disabled={!canNext()} onClick={() => setStep((s) => s + 1)} style={{ opacity: canNext() ? 1 : .5 }}>
                      {t.booking.next} <IconArrowR />
                    </button>
                  ) : (
                    <button className="btn btn-red" disabled={!canNext()} onClick={submit} style={{ opacity: canNext() ? 1 : .5 }}>
                      {t.booking.finish} <IconArrowR />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { Booking });
