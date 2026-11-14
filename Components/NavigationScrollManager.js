"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function NavigationScrollManager() {
  const pathname = usePathname();
  const currentPathRef = useRef(pathname);
  const initialRenderRef = useRef(true);
  const skipNextPathChangeRef = useRef(false);

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      currentPathRef.current = pathname;

      const navigationType = performance.getEntriesByType("navigation")[0]?.type;
      if (navigationType === "reload" && !window.location.hash) {
        window.scrollTo({ top: 0 });
      }

      return;
    }

    const pathChanged = pathname !== currentPathRef.current;
    currentPathRef.current = pathname;

    if (!pathChanged) {
      return;
    }

    if (skipNextPathChangeRef.current) {
      skipNextPathChangeRef.current = false;
      return;
    }

    if (!window.location.hash) {
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);

  useEffect(() => {
    function handlePopState() {
      skipNextPathChangeRef.current =
        window.location.pathname !== currentPathRef.current;
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return null;
}
