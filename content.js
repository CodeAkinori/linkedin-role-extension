function extrairTexto() {
  const possiveis = [
    "#job-details",
    "#job-details > div",
    ".jobs-description__container",
    ".jobs-description__content",
    ".jobs-unified-description__text",
    ".show-more-less-html__markup",
    ".description"
  ];

  for (const sel of possiveis) {
    const el = document.querySelector(sel);
    if (el && el.innerText && el.innerText.trim().length > 50) return el.innerText.trim();
  }

  return (document.body.innerText || "").replace(/\s{3,}/g, "\n").trim();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extrair") {
    try {
      sendResponse({ ok: true, texto: extrairTexto() });
    } catch (err) {
      sendResponse({ ok: false, erro: err.message });
    }
  }
});

console.log("[Analisa Vaga] content.js ativo em:", location.href);
