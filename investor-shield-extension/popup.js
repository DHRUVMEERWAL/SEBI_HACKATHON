document.getElementById("checkBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: highlightCredibility
    },
    (results) => {
      if (results && results[0] && results[0].result) {
        document.getElementById("output").textContent = JSON.stringify(results[0].result, null, 2);
      } else {
        document.getElementById("output").textContent = "No messages found.";
      }
    }
  );
});

// Runs inside WhatsApp Web
function highlightCredibility() {
  const keywords = [
    "guarantee profit", "win money", "lottery", "free gift", "risk-free"
  ];

  const bubbles = document.querySelectorAll("div._amjv");
  const results = [];

  bubbles.forEach(bubble => {
    const spans = bubble.querySelectorAll("span._ao3e.selectable-text.copyable-text span");
    if (!spans.length) return;

    const text = Array.from(spans)
      .map(el => el.innerText.trim())
      .filter(Boolean)
      .join(" ");

    if (!text) return;

    // Calculate credibility score (0–100)
    let score = 100; // assume safe
    let foundKeywords = [];

    keywords.forEach(word => {
      if (text.toLowerCase().includes(word)) {
        score -= 30; // decrease score for each suspicious keyword
        foundKeywords.push(word);
      }
    });

    if (score < 0) score = 0;

    // Highlight in DOM
    let className = "credibility-low";
    if (score < 50) className = "credibility-high";
    else if (score < 80) className = "credibility-medium";

    bubble.classList.add(className);

    // Add score label
    if (!bubble.querySelector(".credibility-label")) {
      const label = document.createElement("span");
      label.className = "credibility-label";
      label.textContent = `Score: ${score}`;
      bubble.appendChild(label);
    }

    results.push({ text, score, foundKeywords });
  });

  return results;
}
