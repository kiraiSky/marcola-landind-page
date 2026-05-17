// Main App entry
const { useState: useStateA, useEffect: useEffectA } = React;

function App() {
  const [lang, setLang] = useStateA(() => localStorage.getItem("mg-lang") || "pt");
  const [theme, setTheme] = useStateA(() => localStorage.getItem("mg-theme") || "dark");

  useEffectA(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.lang = lang;
    localStorage.setItem("mg-theme", theme);
    localStorage.setItem("mg-lang", lang);
  }, [theme, lang]);

  const t = I18N[lang];

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main>
        <Hero t={t} />
        <Services t={t} />
        <Brands t={t} />
        <About t={t} />
        <Gallery t={t} />
        <Reviews t={t} />
        <Booking t={t} />
        <Contact t={t} />
        <FAQ t={t} />
      </main>
      <Footer t={t} />
      <ChatWidget />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
