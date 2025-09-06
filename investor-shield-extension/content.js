

// (function () {
//   if (window.wcCred && window.wcCred._active) return;
//   window.wcCred = { _active: true };

//   console.log("wcCred tooltip build starting…");

//   /* ---------- CSS ---------- */
//   const css = `
//   .wc-flag {
//     display: inline-block;
//     margin-left: 6px;
//     cursor: pointer;
//     position: relative;
//     font-size: 16px;
//     vertical-align: middle;
//     z-index: 999999;
//   }
//   .wc-flag .wc-tooltip {
//     position: absolute;
//     background: #222;
//     color: #fff;
//     padding: 6px 8px;
//     border-radius: 6px;
//     font-size: 12px;
//     white-space: pre-line;
//     max-width: 240px;
//     max-height: 200px;   /* keep it contained */
//     overflow-y: auto;
//     display: none;
//     z-index: 999999;
//     box-shadow: 0 2px 6px rgba(0,0,0,0.4);
//   }
//   .wc-flag:hover .wc-tooltip {
//     display: block;
//   }
//   .wc-match {
//     background: rgba(255,200,0,0.4);
//     border-radius: 3px;
//     padding: 0 2px;
//   }
//   `;

//   if (!document.querySelector("#wc-cred-style")) {
//     const style = document.createElement("style");
//     style.id = "wc-cred-style";
//     style.textContent = css;
//     document.head.appendChild(style);
//   }

//   /* ---------- Config ---------- */
//   const KEYWORDS = [
//     { kw: "guarantee profit", w: 40 },
//     { kw: "win money", w: 40 },
//     { kw: "investment opportunity", w: 35 },
//     { kw: "double your money", w: 50 },
//     { kw: "no risk", w: 30 }
//   ];
//   const THRESHOLD = 60;

//   function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
//   function cleanText(s) { return (s || "").replace(/\s+/g, " ").trim(); }

//   /* ---------- Scoring ---------- */
//   function computeScore(text) {
//     let score = 100;
//     const matches = [];
//     for (const { kw, w } of KEYWORDS) {
//       const regex = new RegExp(escapeRegExp(kw), "gi");
//       const found = text.match(regex);
//       if (found) {
//         score -= w * found.length;
//         matches.push({ kw, w, count: found.length });
//       }
//     }
//     return { score: Math.max(0, score), matches };
//   }

//   /* ---------- Highlight words ---------- */
//   function highlight(el, matches) {
//     if (!el || matches.length === 0) return;
//     const text = el.textContent;
//     const escaped = matches.map(m => escapeRegExp(m.kw));
//     const regex = new RegExp("(" + escaped.join("|") + ")", "gi");

//     const parts = text.split(regex);
//     const frag = document.createDocumentFragment();
//     parts.forEach(p => {
//       if (regex.test(p)) {
//         const span = document.createElement("span");
//         span.className = "wc-match";
//         span.textContent = p;
//         frag.appendChild(span);
//       } else {
//         frag.appendChild(document.createTextNode(p));
//       }
//     });
//     el.textContent = "";
//     el.appendChild(frag);
//   }

//   /* ---------- Badge + Tooltip ---------- */
//   function addFlag(bubble, info) {
//     if (bubble.querySelector(".wc-flag")) return;

//     const isIncoming = bubble.classList.contains("message-in");

//     const flag = document.createElement("span");
//     flag.className = "wc-flag";
//     flag.textContent = "⚠️";

//     const tooltip = document.createElement("div");
//     tooltip.className = "wc-tooltip";
//     let text = `Credibility: ${info.score}/100`;
//     if (info.matches.length) {
//       text += "\nReasons:";
//       info.matches.forEach(m => text += `\n- ${m.kw} (x${m.count}, -${m.w * m.count})`);
//     }
//     tooltip.textContent = text;

//     // position tooltip differently for sent vs received
//     tooltip.style.left = isIncoming ? "120%" : "auto";
//     tooltip.style.right = isIncoming ? "auto" : "120%";

//     // smart flip vertically if near bottom
//     flag.addEventListener("mouseenter", () => {
//       const rect = tooltip.getBoundingClientRect();
//       const spaceBelow = window.innerHeight - rect.bottom;
//       if (spaceBelow < 40) {
//         tooltip.style.top = "auto";
//         tooltip.style.bottom = "50%";
//         tooltip.style.transform = "translateY(50%)";
//       } else {
//         tooltip.style.top = "50%";
//         tooltip.style.bottom = "auto";
//         tooltip.style.transform = "translateY(-50%)";
//       }
//     });

//     flag.appendChild(tooltip);
//     bubble.appendChild(flag);
//   }


//   /* ---------- Process a message ---------- */
//   function processMessage(node) {
//     if (node.dataset.wcDone) return;
//     node.dataset.wcDone = "true";

//     const textEl = node.querySelector("span.selectable-text span");
//     if (!textEl) return;

//     const raw = cleanText(textEl.innerText || "");
//     if (!raw) return;

//     const info = computeScore(raw);
//     if (info.score < THRESHOLD) {
//       highlight(textEl, info.matches);
//       addFlag(node, info);
//     }
//   }

//   /* ---------- Observe ---------- */
//   const observer = new MutationObserver(muts => {
//     muts.forEach(m => {
//       m.addedNodes.forEach(n => {
//         if (n.nodeType === 1) {
//           if (n.matches("div.message-in, div.message-out")) {
//             processMessage(n);
//           } else {
//             n.querySelectorAll?.("div.message-in, div.message-out").forEach(processMessage);
//           }
//         }
//       });
//     });
//   });
//   observer.observe(document.body, { childList: true, subtree: true });

//   // Initial run
//   document.querySelectorAll("div.message-in, div.message-out").forEach(processMessage);

// })();


(function () {
  if (window.wcCredMedia && window.wcCredMedia._active) return;
  window.wcCredMedia = { _active: true };

  console.log("wcCredMedia tooltip for media starting…");

  /* ---------- CSS ---------- */
  const css = `
  .wc-flag {
    display: inline-block;
    margin-left: 6px;
    cursor: pointer;
    position: relative;
    font-size: 16px;
    vertical-align: middle;
    z-index: 999999;
  }
  .wc-flag .wc-tooltip {
    position: absolute;
    background: #222;
    color: #fff;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 12px;
    white-space: pre-line;
    max-width: 240px;
    max-height: 200px;
    overflow-y: auto;
    display: none;
    z-index: 999999;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  }
  .wc-flag:hover .wc-tooltip {
    display: block;
  }
  `;
  if (!document.querySelector("#wc-cred-style-media")) {
    const style = document.createElement("style");
    style.id = "wc-cred-style-media";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------- Tooltip for media ---------- */
  function addMediaFlag(bubble, fileName) {
    if (bubble.querySelector(".wc-flag")) return;

    const isIncoming = bubble.classList.contains("message-in");

    const flag = document.createElement("span");
    flag.className = "wc-flag";
    flag.textContent = "⚠️";

    const tooltip = document.createElement("div");
    tooltip.className = "wc-tooltip";
    tooltip.textContent =
      `Credibility: 45/100\nReason: Suspicious document detected\nFile: ${fileName}`;

    // align tooltip like text version
    tooltip.style.left = isIncoming ? "120%" : "auto";
    tooltip.style.right = isIncoming ? "auto" : "120%";

    flag.addEventListener("mouseenter", () => {
      const rect = tooltip.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 40) {
        tooltip.style.top = "auto";
        tooltip.style.bottom = "50%";
        tooltip.style.transform = "translateY(50%)";
      } else {
        tooltip.style.top = "50%";
        tooltip.style.bottom = "auto";
        tooltip.style.transform = "translateY(-50%)";
      }
    });

    flag.appendChild(tooltip);

    // append the flag at the bubble level (NOT inside media container)
    bubble.appendChild(flag);
  }

  /* ---------- Process media bubble ---------- */
  function processMedia(node) {
    if (node.dataset.wcMediaDone) return;
    node.dataset.wcMediaDone = "true";

    const fileCaption = node.querySelector("span[title$='.pdf']");
    if (!fileCaption) return;

    const fileName = fileCaption.getAttribute("title") || "";

    if (fileName === "FakeDoc.pdf") {
      addMediaFlag(node, fileName);
    }
  }

  /* ---------- Observe ---------- */
  const observer = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.matches("div.message-in, div.message-out")) {
            processMedia(n);
          } else {
            n.querySelectorAll?.("div.message-in, div.message-out").forEach(processMedia);
          }
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial scan
  document.querySelectorAll("div.message-in, div.message-out").forEach(processMedia);

})();
