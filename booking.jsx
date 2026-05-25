// Multi-step booking form
const { useState: useStateBk } = React;

const PHONE_COUNTRIES = [
  { code: "PT", flag: "🇵🇹", flagCode: "pt", name: "Portugal", dial: "351", min: 9, max: 9, placeholder: "935 208 176" },
  { code: "GB", flag: "🇬🇧", flagCode: "gb", name: "United Kingdom", dial: "44", min: 9, max: 10, trunk: "0", placeholder: "7123 456789" },
  { code: "ES", flag: "🇪🇸", flagCode: "es", name: "España", dial: "34", min: 9, max: 9, placeholder: "612 345 678" },
  { code: "FR", flag: "🇫🇷", flagCode: "fr", name: "France", dial: "33", min: 9, max: 9, trunk: "0", placeholder: "6 12 34 56 78" },
  { code: "DE", flag: "🇩🇪", flagCode: "de", name: "Deutschland", dial: "49", min: 7, max: 12, trunk: "0", placeholder: "151 23456789" },
  { code: "NL", flag: "🇳🇱", flagCode: "nl", name: "Nederland", dial: "31", min: 9, max: 9, trunk: "0", placeholder: "6 12345678" },
  { code: "BE", flag: "🇧🇪", flagCode: "be", name: "België", dial: "32", min: 8, max: 9, trunk: "0", placeholder: "470 12 34 56" },
  { code: "IE", flag: "🇮🇪", flagCode: "ie", name: "Ireland", dial: "353", min: 7, max: 9, trunk: "0", placeholder: "85 123 4567" },
  { code: "BR", flag: "🇧🇷", flagCode: "br", name: "Brasil", dial: "55", min: 10, max: 11, trunk: "0", placeholder: "11 91234 5678" },
  { code: "US", flag: "🇺🇸", flagCode: "us", name: "USA / Canada", dial: "1", min: 10, max: 10, placeholder: "415 555 0123" },
];

function getPhoneCountry(code) {
  return PHONE_COUNTRIES.find((country) => country.code === code) || PHONE_COUNTRIES[0];
}

function stripPhoneTrunk(digits, country) {
  if (country.trunk && digits.startsWith(country.trunk) && digits.length > country.max) {
    return digits.slice(country.trunk.length);
  }
  return digits;
}

function formatPhoneNational(digits) {
  return String(digits || "").replace(/\D/g, "").replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

function normalizePhone(raw, countryCode) {
  const country = getPhoneCountry(countryCode);
  const rawText = String(raw || "").trim();
  let digits = rawText.replace(/\D/g, "");
  let intl = "";

  if (rawText.startsWith("+")) {
    intl = digits;
  } else if (digits.startsWith("00")) {
    intl = digits.slice(2);
  } else if (digits.startsWith(country.dial) && digits.length > country.max) {
    intl = digits;
  } else {
    intl = country.dial + stripPhoneTrunk(digits, country);
  }

  const matchedCountry = PHONE_COUNTRIES
    .slice()
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((item) => intl.startsWith(item.dial)) || country;
  const national = stripPhoneTrunk(intl.slice(matchedCountry.dial.length), matchedCountry);
  const valid = national.length >= matchedCountry.min && national.length <= matchedCountry.max;

  return {
    valid,
    country: matchedCountry,
    national,
    international: matchedCountry.dial + national,
    e164: `+${matchedCountry.dial}${national}`,
    display: `${matchedCountry.flag} +${matchedCountry.dial} ${formatPhoneNational(national)}`.trim(),
  };
}

function CountryFlag({ country }) {
  return (
    <img
      className="country-flag"
      src={`https://flagcdn.com/w40/${country.flagCode}.png`}
      srcSet={`https://flagcdn.com/w80/${country.flagCode}.png 2x`}
      alt=""
      loading="lazy"
    />
  );
}

function PhoneCountryPicker({ value, onChange, compact = false }) {
  const [open, setOpen] = useStateBk(false);
  const selected = getPhoneCountry(value);

  return (
    <div className={`country-picker ${compact ? "compact" : ""}`}>
      <button
        type="button"
        className="country-picker-btn"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Indicativo ${selected.name}`}
      >
        <CountryFlag country={selected} />
        <span>+{selected.dial}</span>
        <span className="country-chevron">⌄</span>
      </button>
      {open && (
        <div className="country-picker-menu" role="listbox">
          {PHONE_COUNTRIES.map((country) => (
            <button
              type="button"
              key={country.code}
              className={`country-picker-option ${country.code === selected.code ? "active" : ""}`}
              onClick={() => {
                onChange(country.code);
                setOpen(false);
              }}
              role="option"
              aria-selected={country.code === selected.code}
            >
              <CountryFlag country={country} />
              <span>+{country.dial}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Booking({ t, lang }) {
  const [step, setStep] = useStateBk(0);
  const [data, setData] = useStateBk({
    service: "",
    brand: "", model: "", year: "", plate: "",
    date: "", time: "",
    name: "", phone: "", phoneCountry: "PT", email: "", notes: "",
  });
  const [done, setDone] = useStateBk(false);
  const [loading, setLoading] = useStateBk(false);
  const [error, setError] = useStateBk(null);
  const [lastSubmit, setLastSubmit] = useStateBk(0);
  const [ref] = useStateBk(() => "MG-" + Math.floor(Math.random() * 90000 + 10000));

  const total = 4;
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!data.service;
    if (step === 1) return data.model && data.plate;
    if (step === 2) return data.date && data.time;
    if (step === 3) return data.name && normalizePhone(data.phone, data.phoneCountry).valid;
    return false;
  };

  const sanitize = (str) => String(str).trim().slice(0, 500).replace(/[<>'"]/g, "");

  const validateStep4 = () => {
    const phone = normalizePhone(data.phone, data.phoneCountry);
    if (!phone.valid) return "Numero de telefone invalido para o pais selecionado.";
    if (data.name.length < 2) return "Nome demasiado curto.";
    return null;
  };

  const submit = async () => {
    const validationError = validateStep4();
    if (validationError) { setError(validationError); return; }
    const now = Date.now();
    if (now - lastSubmit < 30000) { setError("Aguarda 30 segundos antes de tentar novamente."); return; }
    setLastSubmit(now);
    setLoading(true);
    setError(null);
    const phone = normalizePhone(data.phone, data.phoneCountry);
    try {
      await fetch("https://kiraiskyn8n.duckdns.org/webhook/marcola/formulario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref,
          service: sanitize(data.service),
          brand: sanitize(data.brand),
          model: sanitize(data.model),
          year: sanitize(data.year),
          plate: sanitize(data.plate),
          date: sanitize(data.date),
          time: sanitize(data.time),
          name: sanitize(data.name),
          phone: phone.international,
          phoneE164: phone.e164,
          phoneCountry: phone.country.code,
          phonePrefix: `+${phone.country.dial}`,
          phoneNational: phone.national,
          email: sanitize(data.email),
          notes: sanitize(data.notes),
          lang: lang || "pt",
          submittedAt: new Date().toISOString(),
        }),
      });
      setDone(true);
    } catch (err) {
      setError("Erro ao enviar. Tenta novamente ou contacta-nos pelo WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setData({ service: "", brand: "", model: "", year: "", plate: "", date: "", time: "", name: "", phone: "", phoneCountry: "PT", email: "", notes: "" });
  };

  // build time slots
  const slots = ["09:00", "10:00", "11:00", "14:00", "15:30", "17:00"];

  return (
    <section id="booking" className="section-pad" style={{ background: "var(--bg-soft)" }}>
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
                        <label>{t.booking.labels.model}</label>
                        <input value={data.model} onChange={(e) => set("model", e.target.value)} placeholder={t.booking.placeholders.model} />
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
                        onClick={(e) => { try { e.target.showPicker(); } catch (_) {} }}
                        style={{ cursor: "pointer" }}
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
                            style={{ justifyContent: "center", padding: "12px 8px", fontFamily: "Oswald, sans-serif", fontSize: 13 }}
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
                      <div className="summary-row"><span>{t.booking.sumVehicle}</span><b>{data.model}{data.plate ? ` · ${data.plate}` : ""}</b></div>
                      <div className="summary-row"><span>{t.booking.sumDate}</span><b>{data.date} · {data.time}</b></div>
                    </div>
                    <div className="field">
                      <label>{t.booking.labels.name}</label>
                      <input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder={t.booking.placeholders.name} />
                    </div>
                    <div className="field">
                      <label>{t.booking.labels.phone}</label>
                      <div className="phone-control">
                        <PhoneCountryPicker
                          value={data.phoneCountry}
                          onChange={(countryCode) => set("phoneCountry", countryCode)}
                        />
                        <input
                          value={data.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          onBlur={() => {
                            const phone = normalizePhone(data.phone, data.phoneCountry);
                            if (phone.national) set("phone", formatPhoneNational(phone.national));
                          }}
                          placeholder={getPhoneCountry(data.phoneCountry).placeholder}
                          inputMode="tel"
                          autoComplete="tel-national"
                        />
                      </div>
                      {data.phone && (
                        <div className={`field-hint ${normalizePhone(data.phone, data.phoneCountry).valid ? "ok" : ""}`}>
                          {normalizePhone(data.phone, data.phoneCountry).valid
                            ? `Sera enviado: ${normalizePhone(data.phone, data.phoneCountry).e164}`
                            : `Exemplo: ${getPhoneCountry(data.phoneCountry).placeholder}`}
                        </div>
                      )}
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
                    <button className="btn btn-red" disabled={!canNext() || loading} onClick={submit} style={{ opacity: canNext() && !loading ? 1 : .5 }}>
                      {loading ? "A enviar…" : <>{t.booking.finish} <IconArrowR /></>}
                    </button>
                  )}
                </div>
                {error && (
                  <p style={{ color: "var(--red)", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</p>
                )}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { PHONE_COUNTRIES, getPhoneCountry, normalizePhone, formatPhoneNational, CountryFlag, PhoneCountryPicker, Booking });
