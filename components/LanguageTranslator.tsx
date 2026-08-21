"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "EN" },
  { code: "it", label: "Italiano", flag: "IT" },
  { code: "es", label: "Espanol", flag: "ES" },
  { code: "fr", label: "Francais", flag: "FR" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "pt", label: "Portugues", flag: "PT" },
  { code: "nl", label: "Nederlands", flag: "NL" },
  { code: "pl", label: "Polski", flag: "PL" },
  { code: "ru", label: "Pycckni", flag: "RU" },
  { code: "ja", label: "Japanese", flag: "JA" },
  { code: "zh", label: "Chinese", flag: "ZH" },
  { code: "ko", label: "Korean", flag: "KO" }
];

export function LanguageTranslator() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [translating, setTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const widgetKey = useRef(0);

  useEffect(() => {
    // Read cookie on mount
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match) {
      setCurrentLang(match[1]);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyTranslation = useCallback((lang: string) => {
    if (lang === "en") {
      // Clear cookie and reload
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // Also clear for google.com domain
      document.cookie = "googtrans=; path=/; domain=.vercel.app; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setCurrentLang("en");
      setTranslating(false);
      window.location.reload();
      return;
    }

    setCurrentLang(lang);
    setTranslating(true);
    document.cookie = `googtrans=/en/${lang}; path=/`;

    // Load Google Translate script
    const existingScript = document.getElementById("google-translate-script");
    if (existingScript) {
      existingScript.remove();
    }

    // Force reinitialize by reloading
    window.location.reload();
  }, []);

  const currentLanguage = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#27272a] bg-[#141418]/80 px-2.5 text-xs font-medium text-[#a1a1aa] transition-colors hover:border-[#10b981]/40 hover:text-[#fafafa]"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {currentLanguage.flag}
        <svg className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-[#27272a] bg-[#141418] shadow-2xl shadow-black/50">
          <div className="p-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => applyTranslation(lang.code)}
                disabled={translating}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  currentLang === lang.code
                    ? "bg-[#10b981]/10 text-[#10b981]"
                    : "text-[#a1a1aa] hover:bg-[#1a1a1f] hover:text-[#fafafa]"
                } ${translating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="w-5 text-center font-mono text-[10px] font-bold">{lang.flag}</span>
                <span>{lang.label}</span>
                {currentLang === lang.code && lang.code !== "en" && (
                  <svg className="ml-auto h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-[#27272a] px-3 py-2">
            <p className="text-[10px] text-[#71717a]">Auto-translated via Google Translate</p>
          </div>
        </div>
      )}

      {/* Google Translate container - rendered in footer area */}
      <div id="google_translate_element" style={{ position: "fixed", bottom: 0, right: 0, zIndex: -1, opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
