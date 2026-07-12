/** Inline script — runs before paint to match cookie or system preference. */
export const THEME_INIT_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(dark|light)(?:;|$)/);var t=m?m[1]:null;if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var r=document.documentElement;if(t==="dark"){r.classList.add("dark");r.style.colorScheme="dark";r.style.backgroundColor="#0a0a0a";}else{r.classList.remove("dark");r.style.colorScheme="light";r.style.backgroundColor="#ffffff";}try{localStorage.setItem("theme",t);}catch(e){}}catch(e){}})();`;

/** Critical CSS so the first frame has the right colors before Tailwind loads.
 *  Gate gradients are CSS backgrounds (not <img>) so the wrong theme asset
 *  never paints for a frame while display:none catches up. */
export const THEME_CRITICAL_CSS = `
:root{--background:#ffffff;--foreground:#0a0a0a;color-scheme:light}
html.dark{--background:#0a0a0a;--foreground:#fafafa;color-scheme:dark}
html,body{background-color:var(--background);color:var(--foreground)}
html.dark .theme-light-only{display:none!important}
html:not(.dark) .theme-dark-only{display:none!important}
.gate-gradient-fallback{
  background-color:var(--background);
  background-repeat:no-repeat;
  background-size:cover;
  background-position:center top;
}
html:not(.dark) .gate-gradient-fallback{
  background-color:#6fd0f2;
  background-image:url(/gate-gradient.svg);
}
html.dark .gate-gradient-fallback{
  background-color:#0a0a0a;
  background-image:url(/gate-gradient-dark.svg);
}
`;
