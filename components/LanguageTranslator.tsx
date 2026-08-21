"use client";

import { useState, useEffect, useRef } from "react";

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

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (options: object, id: string) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageTranslator() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Google Translate is already loaded
    if (typeof window !== "undefined" && window.google?.translate) {
      setLoaded(true);
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

  function initGoogleTranslate(lang: string) {
    if (lang === "en") {
      // Reset to original English
      const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("googtrans="));
      if (cookie) {
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      window.location.reload();
      return;
    }

    // Set the Google Translate cookie
    document.cookie = `googtrans=/en/${lang}; path=/`;

    // Load Google Translate script if not already loaded
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const TranslateElement = window.google.translate.TranslateElement as any;
          new TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: LANGUAGES.map((l) => l.code).join(","),
              layout: TranslateElement.InlineLayout?.SIMPLE ?? 0,
              autoDisplay: false
            },
            "google-translate-element"
          );
          setLoaded(true);
        }
      };
    } else {
      // Script already loaded, just reload with new cookie
      window.location.reload();
    }

    setCurrentLang(lang);
    setIsOpen(false);
  }

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
                onClick={() => initGoogleTranslate(lang.code)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  currentLang === lang.code
                    ? "bg-[#10b981]/10 text-[#10b981]"
                    : "text-[#a1a1aa] hover:bg-[#1a1a1f] hover:text-[#fafafa]"
                }`}
              >
                <span className="w-5 text-center font-mono text-[10px] font-bold">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-[#27272a] px-3 py-2">
            <p className="text-[10px] text-[#71717a]">Auto-translated via Google Translate</p>
          </div>
        </div>
      )}

      {/* Hidden div for Google Translate widget */}
      <div id="google-translate-element" className="hidden" />
    </div>
  );
}
