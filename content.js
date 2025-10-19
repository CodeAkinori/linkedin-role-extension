// content.js
// Extrai o texto da vaga no LinkedIn (apenas scraping do conteúdo legível)

function extrairTexto() {
  // tenta regiões conhecidas primeiro
  const possiveis = [
    "#job-details",
    "#job-details > div",
    ".jobs-description__container",
    ".jobs-description__content",
    ".jobs-unified-description__text",
    ".show-more-less-html__markup",
    ".description"
  ];

  for (const seletor of possiveis) {
    const el = document.querySelector(seletor);
    if (el && el.innerText && el.innerText.trim().length > 50) {
      return el.innerText.trim();
    }
  }

  // fallback: coleta todo o texto principal do <main>
  const main = document.querySelector("main") || document.body;
  let texto = main.innerText || "";
  texto = texto.replace(/\s{3,}/g, "\n").trim();
  return texto;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extrair") {
    try {
      const texto = extrairTexto();
      sendResponse({ ok: true, texto });
    } catch (err) {
      console.error("Erro ao extrair:", err);
      sendResponse({ ok: false, erro: err.message });
    }
  }
});

// Log de injeção
console.log("[Analisa Vaga] content.js ativo em:", location.href);

// Observa navegação SPA
let ultimaUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== ultimaUrl) {
    ultimaUrl = url;
    console.log("[Analisa Vaga] URL alterada:", url);
  }
}).observe(document, { subtree: true, childList: true });
