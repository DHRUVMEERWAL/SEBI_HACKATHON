// background.js (MV3 service worker)

console.log("Investor Shield background loaded.");

// Very basic heuristic analyzer; replace with your API later.
function mockAnalyze(text) {
  const lc = text.toLowerCase();

  // Signals
  let score = 10; // start low risk
  const reasons = [];

  const redWords = [
    "guaranteed", "risk-free", "100% return", "jackpot",
    "act now", "limited time", "urgent", "verify your account",
    "seed phrase", "private key"
  ];

  const yellowWords = [
    "profit", "payout", "bonus", "investment", "insider",
    "return", "double your", "pump", "dump", "tip", "crypto"
  ];

  const urlRegex = /(https?:\/\/|www\.)[^\s]+/gi;
  const hasUrl = urlRegex.test(text);
  if (hasUrl) {
    score += 25;
    reasons.push("Contains a link");
  }
  redWords.forEach(w => {
    if (lc.includes(w)) {
      score += 30;
      reasons.push(`Keyword: "${w}"`);
    }
  });
  yellowWords.forEach(w => {
    if (lc.includes(w)) {
      score += 10;
      reasons.push(`Keyword: "${w}"`);
    }
  });

  // Cap score
  if (score > 99) score = 99;

  // Pick a short reason for tooltip
  const reason = reasons.length ? reasons.slice(0, 3).join(" • ") : "No obvious red flags";

  return { score, reason };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "analyzeMessage" && typeof msg.text === "string") {
    try {
      const res = mockAnalyze(msg.text);
      sendResponse(res);
    } catch (e) {
      console.error("Analyzer error:", e);
      sendResponse({ score: 50, reason: "Analyzer error" });
    }
    // Return true not needed since we respond synchronously.
    return;
  }

  if (msg && msg.type === "getEnabled") {
    chrome.storage.local.get({ enabled: true }, (data) => {
      sendResponse({ enabled: data.enabled });
    });
    return true;
  }

  if (msg && msg.type === "setEnabled") {
    chrome.storage.local.set({ enabled: !!msg.enabled }, () => sendResponse({ ok: true }));
    return true;
  }
});
