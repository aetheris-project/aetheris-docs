"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "EN", native: "English" },
  { code: "it", label: "Italiano", flag: "IT", native: "Italiano" },
  { code: "es", label: "Spanish", flag: "ES", native: "Español" },
  { code: "fr", label: "French", flag: "FR", native: "Français" },
  { code: "de", label: "German", flag: "DE", native: "Deutsch" },
  { code: "pt", label: "Portuguese", flag: "PT", native: "Português" },
  { code: "nl", label: "Dutch", flag: "NL", native: "Nederlands" },
  { code: "pl", label: "Polish", flag: "PL", native: "Polski" },
  { code: "ru", label: "Russian", flag: "RU", native: "Русский" },
  { code: "ja", label: "Japanese", flag: "JA", native: "日本語" },
  { code: "zh-CN", label: "Chinese (Simplified)", flag: "ZH", native: "中文（简体）" },
  { code: "ko", label: "Korean", flag: "KO", native: "한국어" }
];

const INCLUDED_LANGS = LANGUAGES.map((l) => l.code).join(",");

function getLangFromCookie(): string | null {
  const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/i);
  return match ? match[1] : null;
}

function clearAllCookies() {
  const paths = ["; path=/"];
  const domains = [
    "",
    "; domain=.vercel.app",
    "; domain=" + window.location.hostname
  ];
  for (const p of paths) {
    for (const d of domains) {
      document.cookie = `googtrans=${d}${p}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}

export function LanguageTranslator() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [translating, setTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const saved = getLangFromCookie();
    if (saved) {
      const valid = LANGUAGES.find((l) => l.code.toLowerCase() === saved.toLowerCase());
      setCurrentLang(valid ? valid.code : "en");
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

  const initTranslateWidget = useCallback(() => {
    if (typeof window === "undefined") return;
    if ((window as any).google?.translate?.TranslateElement && scriptLoaded.current) {
      try {
        const TE = (window as any).google.translate.TranslateElement;
        new TE(
          {
            pageLanguage: "en",
            includedLanguages: INCLUDED_LANGS,
            layout: TE.InlineLayout?.SIMPLE ?? 0,
            autoDisplay: false,
            multilanguagePage: true
          },
          "google_translate_element"
        );
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookie = getLangFromCookie();
    if (!cookie) return;

    (window as any).googleTranslateElementInit = () => {
      scriptLoaded.current = true;
      initTranslateWidget();
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        scriptLoaded.current = false;
      };
      document.body.appendChild(script);
    } else {
      (window as any).googleTranslateElementInit?.();
    }
  }, [initTranslateWidget]);

  const applyTranslation = useCallback((lang: string) => {
    setIsOpen(false);

    if (lang === currentLang) return;

    if (lang === "en") {
      clearAllCookies();
      setCurrentLang("en");
      setTranslating(true);
      setTimeout(() => {
        window.location.reload();
      }, 150);
      return;
    }

    setCurrentLang(lang);
    setTranslating(true);
    document.cookie = `googtrans=/en/${lang}; path=/; SameSite=Lax; max-age=31536000`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}; SameSite=Lax; max-age=31536000`;

    setTimeout(() => {
      window.location.reload();
    }, 150);
  }, [currentLang]);

  const currentLanguage = LANGUAGES.find((l) => l.code.toLowerCase() === currentLang.toLowerCase()) ?? LANGUAGES[0];

  const isTranslated = currentLang !== "en";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#27272a] bg-[#141418]/80 px-2.5 text-xs font-medium text-[#a1a1aa] transition-colors hover:border-[#10b981]/40 hover:text-[#fafafa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="font-mono text-[10px] font-bold tracking-wider">{currentLanguage.flag}</span>
        <svg className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isTranslated && (
        <span className="pointer-events-none absolute -top-1 -right-1 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
        </span>
      )}

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-[#27272a] bg-[#141418] shadow-2xl shadow-black/60 ring-1 ring-black/5">
          <div className="border-b border-[#27272a] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
              Select language
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto p-1">
            {LANGUAGES.map((lang) => {
              const active = currentLang.toLowerCase() === lang.code.toLowerCase();
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => applyTranslation(lang.code)}
                  disabled={translating}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-150 ${
                    active
                      ? "bg-gradient-to-r from-[#10b981]/15 to-transparent text-[#10b981]"
                      : "text-[#a1a1aa] hover:bg-[#1a1a1f] hover:text-[#fafafa]"
                  } ${translating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className={`flex h-6 w-7 items-center justify-center rounded-md text-center font-mono text-[10px] font-bold ${
                    active ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#1a1a1f] text-[#a1a1aa]"
                  }`}>{lang.flag}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium leading-tight truncate">{lang.native}</span>
                    <span className="text-[10px] text-[#71717a] leading-tight truncate">{lang.label}</span>
                  </div>
                  {active && (
                    <svg className="ml-auto h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#27272a] bg-gradient-to-b from-[#0f0f12] to-[#141418] px-3 py-2">
            <div className="flex items-center gap-1.5">
              <svg className="h-3 w-3 text-[#71717a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-[10px] text-[#71717a]">Auto-translated by Google · Quality may vary</p>
            </div>
          </div>
        </div>
      )}

      <div id="google_translate_element" aria-hidden="true" style={{ display: "none !important", visibility: "hidden", height: 0, width: 0, overflow: "hidden", position: "absolute", left: "-9999px", top: "-9999px" }} />
    </div>
  );
}
