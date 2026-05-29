import { useEffect } from "react";
import { useRouter } from "next/router";

interface GoatCounterConfig {
  appendTo?: string;
  customPath?: string;
}

export function GoatCounterSetup({ 
  appendTo = "#goatcounter-page-views", 
  customPath
}: GoatCounterConfig = {}) {
  const router = useRouter();

  useEffect(() => {
    const path = customPath || window.location.pathname || "/";
    const url =
      "https://adamgoldstone.goatcounter.com/counter/" +
      encodeURIComponent(path) +
      ".json";

    fetch(url)
      .then((response) => {
        if (response.status === 404) {
          return { count: 0 };
        }
        if (!response.ok) {
          throw new Error(`GoatCounter fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data: { count?: string | number }) => {
        const container = document.querySelector(appendTo);
        if (container) {
          const rawCount = String(data.count ?? 0).replace(/,/g, "");
          const paddedCount = rawCount.padStart(6, "0");
          container.textContent = paddedCount;
        }
      })
      .catch((err) => console.error(err));
  }, [appendTo, customPath, router.asPath]);

  return null;
}