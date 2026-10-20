import { useEffect, useMemo, useRef, useState } from "react";
import demoDocument from "@/assets/talent365-demo.html?raw";
import { DAY_MS, PROGRAMME_DAYS } from "@/lib/programme";

const STORAGE_KEY = "distrub:talent365:practice:v1";

export function Talent365Demo() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [saved, setSaved] = useState<string | null | undefined>(undefined);
  const [height, setHeight] = useState(1400);

  useEffect(() => {
    try { setSaved(localStorage.getItem(STORAGE_KEY)); } catch { setSaved(null); }
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "talent365:height" && Number.isFinite(event.data.height)) {
        setHeight(Math.min(30000, Math.max(500, event.data.height)));
      }
      if (event.data?.type === "talent365:save" && typeof event.data.state === "string" && event.data.state.length < 2_000_000) {
        try { localStorage.setItem(STORAGE_KEY, event.data.state); } catch { /* In-memory simulation still works. */ }
      }
      if (event.data?.type === "talent365:navigate") frame.current?.scrollIntoView({ block: "start" });
      if (event.data?.type === "talent365:dialog" && Number.isFinite(event.data.top) && frame.current) {
        window.scrollTo({ top: window.scrollY + frame.current.getBoundingClientRect().top + event.data.top - 90 });
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  const document = useMemo(() => {
    if (saved === undefined) return "";
    const setup = `const DAY_MS=${DAY_MS};const PROGRAMME_DAYS=${PROGRAMME_DAYS};const programmeDay=function(start,now){return Math.max(0,Math.min(PROGRAMME_DAYS,Math.floor((Date.parse(now)-Date.parse(start))/DAY_MS)+1));};window.__TALENT365_SAVED_STATE__=${JSON.stringify(saved).replace(/</g, "\\u003c")};`;
    const observer = `new ResizeObserver(()=>window.parent.postMessage({type:'talent365:height',height:Math.ceil(document.getElementById('root').getBoundingClientRect().height)},'*')).observe(document.getElementById('root'));window.addEventListener('hashchange',()=>window.parent.postMessage({type:'talent365:navigate'},'*'));`;
    return demoDocument.replace("'use strict';", `'use strict';${setup}`).replace("})();", `${observer}\n})();`);
  }, [saved]);

  if (saved === undefined) return <div className="min-h-96 bg-background" aria-busy="true" />;
  return <iframe ref={frame} title="Talent / 365 interactive programme demo" srcDoc={document} sandbox="allow-scripts allow-forms allow-downloads" className="block w-full scroll-mt-20 border-0 bg-background" height={height} />;
}