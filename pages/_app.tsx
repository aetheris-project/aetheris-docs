import { useEffect, useRef } from "react";
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

const INCLUDED_LANGS = "en,it,es,fr,de,pt,nl,pl,ru,ja,zh-CN,ko";

function GoogleTranslateInit() {
  const inited = useRef(false);

  useEffect(() => {
    const cookie = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/i);
    if (!cookie) return;

    const initFn = () => {
      if (inited.current) return;
      inited.current = true;
      if (typeof window !== "undefined" && (window as any).google?.translate?.TranslateElement) {
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
          // ignore re-init errors
        }
      }
    };

    (window as any).googleTranslateElementInit = initFn;

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        inited.current = false;
      };
      document.body.appendChild(script);
    } else {
      if ((window as any).google?.translate?.TranslateElement) {
        initFn();
      } else {
        (window as any).googleTranslateElementInit?.();
      }
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
