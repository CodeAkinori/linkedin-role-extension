// popup.js — versão com CV Markdown fixo em static/cv.md

document.addEventListener("DOMContentLoaded", async () => {
  const btnExtrair = document.getElementById("extrair");
  const vagaTexto = document.getElementById("vagaTexto");
  const cvMarkdown = document.getElementById("cvMarkdown");

  // Carrega o currículo automaticamente
  try {
    const resposta = await fetch(chrome.runtime.getURL("static/resume.md"));
    const markdown = await resposta.text();
    cvMarkdown.value = markdown.trim();
    console.log("✅ Currículo carregado de static/cv.md");
  } catch (err) {
    console.error("Erro ao carregar cv.md:", err);
    cvMarkdown.value = "⚠️ Erro ao carregar o currículo.";
  }

  // Extrair descrição da vaga
  btnExtrair.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return alert("Nenhuma aba ativa encontrada.");

    // injeta o content script se necessário
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    chrome.tabs.sendMessage(tab.id, { action: "extrair" }, (resposta) => {
      if (chrome.runtime.lastError) {
        vagaTexto.value = "";
        alert("Erro: não foi possível comunicar com a página. Abra uma vaga e tente novamente.");
        return;
      }

      if (resposta && resposta.ok) {
        vagaTexto.value = resposta.texto;
        console.log("📄 Texto da vaga extraído com sucesso!");
      } else {
        vagaTexto.value = "";
        alert("Falha ao extrair texto da vaga.");
      }
    });
  });
});
