import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

type IdentityStatus = "idle" | "error";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus>("idle");
  const handlersAttachedRef = useRef(false);

  const asPath = router.isReady ? router.asPath : "";
  const hasToken =
    asPath.includes("#confirmation_token=") ||
    asPath.includes("#invite_token=") ||
    asPath.includes("#recovery_token=");

  function attachIdentityHandlers() {
    if (handlersAttachedRef.current) return;

    // @ts-expect-error - provided by the Netlify Identity widget script at runtime
    const identity = window.netlifyIdentity;
    if (!identity?.on || !identity?.init) return;

    handlersAttachedRef.current = true;

    identity.on("login", () => {
      // Remove sensitive token hash from the URL
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      window.location.assign("/admin/");
    });

    identity.on("error", () => {
      setIdentityStatus("error");
    });
  }

  function initIdentityIfPresent() {
    // @ts-expect-error - provided by the Netlify Identity widget script at runtime
    const identity = window.netlifyIdentity;
    if (!identity?.init) return;

    identity.init();
    attachIdentityHandlers();
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasToken) return;

    // No setState here: just kick Identity so it can process the token in the URL hash.
    initIdentityIfPresent();
  }, [hasToken]);

  const showConfirmingOverlay = hasToken && identityStatus !== "error";

  return (
    <>
      <Script
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window === "undefined") return;
          initIdentityIfPresent();
        }}
      />

      {showConfirmingOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              Confirming your email…
            </div>
            <div style={{ marginTop: 8, opacity: 0.85 }}>
              If successful, you’ll be redirected to the admin area.
            </div>
          </div>
        </div>
      )}

      {identityStatus === "error" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              Couldn’t confirm automatically
            </div>
            <div style={{ marginTop: 8, opacity: 0.85 }}>
              Go to{" "}
              <a href="/admin/" style={{ textDecoration: "underline" }}>
                /admin
              </a>{" "}
              and click “Log in”.
            </div>
          </div>
        </div>
      )}

      <Component {...pageProps} />
    </>
  );
}
