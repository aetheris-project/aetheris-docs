import { useEffect } from "react";
import type { AppProps } from "next/app";
import "nextra-theme-docs/style.css";
import "../styles/docs.css";

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

function GoogleTranslateInit() {
  useEffect(() => {
    const cookie = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (!cookie) return;

    // Initialize Google Translate widget
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const TE = window.google.translate.TranslateElement as any;
        new TE(
          {
            pageLanguage: "en",
            includedLanguages: "en,it,es,fr,de,pt,nl,pl,ru,ja,zh,ko",
            layout: TE.InlineLayout?.SIMPLE ?? 0,
            autoDisplay: false
          },
          "google_translate_element"
        );
      }
    };

    // Load script if not already present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit?.();
    }
  }, []);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleTranslateInit />
      <Component {...pageProps} />
    </>
  );
}
