// ChatBot Widget — floating chat that collects booking info and sends to n8n webhook
const { useState: useChatState, useEffect: useChatEffect, useRef: useChatRef } = React;

const WEBHOOK_URL = "https://kiraiskyn8n.duckdns.org/webhook/marcola/formulario";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:30", "17:00"];

function genRef() { return "MG-" + Math.floor(Math.random() * 90000 + 10000); }

function sanitizeChat(str) { return String(str || "").trim().slice(0, 500).replace(/[<>'"]/g, ""); }

// ── Chat bubble components ──────────────────────────────────────────
function BotMsg({ text, delay = 0 }) {
  const [visible, setVisible] = useChatState(delay === 0);
  useChatEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }
  }, []);
  if (!visible) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 10, animation: "chatIn .25s ease" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--red)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px 16px 16px 4px", padding: "10px 14px", fontSize: 13, lineHeight: 1.5, color: "var(--text)", maxWidth: "80%" }}>
        {text}
      </div>
    </div>
  );
}

function UserMsg({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10, animation: "chatIn .2s ease" }}>
      <div style={{ background: "var(--red)", borderRadius: "16px 16px 4px 16px", padding: "10px 14px", fontSize: 13, lineHeight: 1.5, color: "#fff", maxWidth: "80%" }}>
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--red)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px 16px 16px 4px", padding: "10px 16px" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[0, 150, 300].map(d => (
            <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-3)", display: "block", animation: `typing 1s ${d}ms infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Steps definition (built from translations) ──────────────────────
function buildSteps(t) {
  const b = t.booking;
  const isPt = b.labels.brand === "Marca";
  return [
    { key: "service", type: "buttons", question: isPt ? "Olá! 👋 Que tipo de intervenção precisas?" : "Hello! 👋 What type of service do you need?", options: b.services },
    { key: "model",   type: "text",    question: isPt ? "Qual é o modelo do teu carro?" : "What's your car model?", placeholder: b.placeholders.model },
    { key: "plate",   type: "text",    question: isPt ? "Matrícula?" : "Plate number?", placeholder: b.placeholders.plate },
    { key: "date",    type: "date",    question: isPt ? "Quando preferes vir?" : "When would you like to come?" },
    { key: "time",    type: "buttons", question: isPt ? "A que horas?" : "What time?", options: TIME_SLOTS },
    { key: "name",    type: "text",    question: isPt ? "Qual é o teu nome?" : "What's your name?", placeholder: b.placeholders.name },
    { key: "phone",   type: "phone",   question: isPt ? "Numero de telefone?" : "Phone number?", placeholder: b.placeholders.phone, inputMode: "tel" },
    { key: "notes",   type: "text",    question: isPt ? "Alguma nota adicional? (opcional)" : "Any additional notes? (optional)", placeholder: b.placeholders.notes, optional: true },
  ];
}

// ── Main ChatWidget ──────────────────────────────────────────────────
function ChatWidget({ t, lang }) {
  const [open, setOpen] = useChatState(false);
  const [step, setStep] = useChatState(0);
  const [data, setData] = useChatState({});
  const [messages, setMessages] = useChatState([]);
  const [input, setInput] = useChatState("");
  const [typing, setTyping] = useChatState(false);
  const [done, setDone] = useChatState(false);
  const [loading, setLoading] = useChatState(false);
  const [started, setStarted] = useChatState(false);
  const [phoneCountry, setPhoneCountry] = useChatState("PT");
  const [phoneError, setPhoneError] = useChatState("");
  const [ref] = useChatState(genRef);
  const bottomRef = useChatRef(null);
  const inputRef = useChatRef(null);
  const STEPS = buildSteps(t);

  useChatEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useChatEffect(() => {
    if (open && !started) {
      setStarted(true);
      setTimeout(() => addBotMsg(buildSteps(t)[0].question), 400);
    }
  }, [open]);

  // Reset chat when language changes mid-conversation
  useChatEffect(() => {
    if (started && !done) {
      setStep(0); setData({}); setMessages([]); setInput("");
      setPhoneCountry("PT"); setPhoneError("");
      setTyping(false); setStarted(false);
      setTimeout(() => { setStarted(true); addBotMsg(buildSteps(t)[0].question); }, 300);
    }
  }, [t]);

  useChatEffect(() => {
    if (open && inputRef.current && ["text", "phone"].includes(STEPS[step]?.type)) {
      inputRef.current.focus();
    }
  }, [step, open]);

  const addBotMsg = (text) => {
    setMessages(m => [...m, { type: "bot", text }]);
  };

  const addUserMsg = (text) => {
    setMessages(m => [...m, { type: "user", text }]);
  };

  const advanceStep = (value, displayValue, extraData = {}) => {
    const currentStep = STEPS[step];
    const clean = sanitizeChat(value);
    const nextData = { ...data, [currentStep.key]: clean, ...extraData };
    setData(nextData);
    addUserMsg(displayValue || clean);
    setInput("");
    setPhoneError("");

    const nextStep = step + 1;
    if (nextStep >= STEPS.length) {
      // All done — send
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addBotMsg("Perfeito! ✅ A enviar a tua marcação...");
        submitForm(nextData);
      }, 800);
    } else {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setStep(nextStep);
        addBotMsg(STEPS[nextStep].question);
      }, 700);
    }
  };

  const submitForm = async (formData) => {
    setLoading(true);
    const phone = normalizePhone(formData.phone || "", formData.phoneCountry || phoneCountry);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref,
          ...formData,
          phone: phone.international,
          phoneE164: phone.e164,
          phoneCountry: phone.country.code,
          phonePrefix: `+${phone.country.dial}`,
          phoneNational: phone.national,
          submittedAt: new Date().toISOString(),
          lang: lang || "pt",
          source: "chatbot",
        }),
      });
      setTimeout(() => {
        setLoading(false);
        setDone(true);
        addBotMsg(`Marcação recebida! 🎉\n\nA tua referência é **${ref}**.\n\nVais receber confirmação no WhatsApp em breve. Até já! 👋`);
      }, 1000);
    } catch {
      setLoading(false);
      addBotMsg("Ocorreu um erro ao enviar. Por favor tenta pelo formulário da página ou contacta-nos pelo WhatsApp.");
    }
  };

  const handleText = () => {
    const currentStep = STEPS[step];
    if (!input.trim() && !currentStep.optional) return;
    advanceStep(input.trim() || "—", input.trim() || "(sem resposta)");
  };

  const handlePhone = () => {
    const phone = normalizePhone(input, phoneCountry);
    if (!phone.valid) {
      setPhoneError(`Exemplo: ${getPhoneCountry(phoneCountry).placeholder}`);
      return;
    }
    advanceStep(phone.international, phone.display, {
      phoneE164: phone.e164,
      phoneCountry: phone.country.code,
      phonePrefix: `+${phone.country.dial}`,
      phoneNational: phone.national,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (currentStepDef?.type === "phone") handlePhone();
      else handleText();
    }
  };

  const resetChat = () => {
    setStep(0); setData({}); setMessages([]); setInput("");
    setPhoneCountry("PT"); setPhoneError("");
    setTyping(false); setDone(false); setLoading(false); setStarted(false);
  };

  const currentStepDef = STEPS[step];

  return (
    <>
      <style>{`
        @keyframes chatIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes typing { 0%,60%,100% { transform: translateY(0); opacity:.4; } 30% { transform: translateY(-4px); opacity:1; } }
        @keyframes chatOpen { from { opacity: 0; transform: scale(.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .chat-input::placeholder { color: var(--text-3); }
        .chat-input:focus { outline: none; border-color: var(--red) !important; }
        .chat-btn-opt:hover { border-color: var(--red) !important; color: var(--red) !important; }
        .chat-send:hover { background: #c0392b !important; }
        .chat-skip:hover { color: var(--text) !important; }
      `}</style>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 360, height: 520,
          background: "var(--bg-soft)", border: "1px solid var(--border)",
          borderRadius: 20, display: "flex", flexDirection: "column",
          boxShadow: "0 24px 60px rgba(0,0,0,.5)", zIndex: 200,
          animation: "chatOpen .3s cubic-bezier(.2,.7,.2,1)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Saira Condensed", fontWeight: 700, fontSize: 15, color: "var(--text)", textTransform: "uppercase", letterSpacing: ".04em" }}>Marcola Garagem</div>
              <div style={{ fontSize: 11, color: "#22c55e", display: "flex", alignItems: "center", gap: 5, fontFamily: "Oswald", letterSpacing: ".08em" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>
                Online
              </div>
            </div>
            <button onClick={() => { setOpen(false); }} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column" }}>
            {messages.map((m, i) =>
              m.type === "bot"
                ? <BotMsg key={i} text={m.text} />
                : <UserMsg key={i} text={m.text} />
            )}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          {!done && !typing && started && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}>
              {currentStepDef?.type === "buttons" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {currentStepDef.options.map(opt => (
                    <button key={opt} className="chat-btn-opt" onClick={() => advanceStep(opt)}
                      style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-2)", borderRadius: 10, padding: "9px 14px", fontSize: 13, cursor: "pointer", textAlign: "left", transition: "border-color .15s, color .15s", fontFamily: "Manrope, sans-serif" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentStepDef?.type === "date" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setInput(e.target.value)}
                    onClick={e => { try { e.target.showPicker(); } catch (_) {} }}
                    className="chat-input"
                    style={{ flex: 1, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 13, fontFamily: "Oswald", transition: "border-color .15s", cursor: "pointer" }}
                  />
                  <button onClick={() => input && advanceStep(input)} className="chat-send"
                    style={{ background: "var(--red)", border: "none", color: "#fff", borderRadius: 10, padding: "0 16px", cursor: "pointer", fontSize: 18, transition: "background .15s" }}>
                    →
                  </button>
                </div>
              )}

              {currentStepDef?.type === "phone" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "118px 1fr auto", gap: 8 }}>
                    <PhoneCountryPicker
                      value={phoneCountry}
                      onChange={countryCode => { setPhoneCountry(countryCode); setPhoneError(""); }}
                      compact
                    />
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => { setInput(e.target.value); setPhoneError(""); }}
                      onBlur={() => {
                        const phone = normalizePhone(input, phoneCountry);
                        if (phone.national) setInput(formatPhoneNational(phone.national));
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={getPhoneCountry(phoneCountry).placeholder}
                      inputMode="tel"
                      autoComplete="tel-national"
                      className="chat-input"
                      style={{ minWidth: 0, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 13, fontFamily: "Manrope, sans-serif", transition: "border-color .15s" }}
                    />
                    <button onClick={handlePhone} className="chat-send"
                      style={{ background: "var(--red)", border: "none", color: "#fff", borderRadius: 10, padding: "0 14px", cursor: "pointer", fontSize: 18, transition: "background .15s" }}>
                      â†’
                    </button>
                  </div>
                  <div style={{ color: phoneError ? "var(--red)" : "var(--text-3)", fontSize: 11, lineHeight: 1.35 }}>
                    {phoneError || (input && normalizePhone(input, phoneCountry).valid ? `Sera enviado: ${normalizePhone(input, phoneCountry).e164}` : `Exemplo: ${getPhoneCountry(phoneCountry).placeholder}`)}
                  </div>
                </div>
              )}

              {currentStepDef?.type === "text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={currentStepDef.placeholder}
                      inputMode={currentStepDef.inputMode || "text"}
                      className="chat-input"
                      style={{ flex: 1, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", color: "var(--text)", fontSize: 13, fontFamily: "Manrope, sans-serif", transition: "border-color .15s" }}
                    />
                    <button onClick={handleText} className="chat-send"
                      style={{ background: "var(--red)", border: "none", color: "#fff", borderRadius: 10, padding: "0 16px", cursor: "pointer", fontSize: 18, transition: "background .15s" }}>
                      →
                    </button>
                  </div>
                  {currentStepDef.optional && (
                    <button className="chat-skip" onClick={() => advanceStep("", "(sem resposta)")}
                      style={{ background: "none", border: "none", color: "var(--text-3)", fontSize: 11, cursor: "pointer", textAlign: "left", fontFamily: "Oswald", letterSpacing: ".08em", padding: "2px 0", transition: "color .15s" }}>
                      Saltar →
                    </button>
                  )}
                </div>
              )}

              {done && (
                <button onClick={resetChat}
                  style={{ width: "100%", background: "var(--bg-elev)", border: "1px solid var(--border)", color: "var(--text-2)", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "Saira Condensed", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                  Nova marcação
                </button>
              )}
            </div>
          )}

          {done && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}>
              <button onClick={resetChat}
                style={{ width: "100%", background: "var(--bg-elev)", border: "1px solid var(--border)", color: "var(--text-2)", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "Saira Condensed", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                Nova marcação
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat de marcação"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 60, height: 60, borderRadius: "50%",
          background: "#1fa452", border: "none",
          color: "#fff", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 16px 50px -12px rgba(31,164,82,.55), 0 0 0 4px rgba(31,164,82,.18)",
          zIndex: 190, transition: "transform .2s, background .2s",
          animation: "fab-in .6s ease .8s both",
          transform: open ? "scale(1.08)" : "scale(1)",
        }}
      >
        {open
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>
    </>
  );
}

Object.assign(window, { ChatWidget });
