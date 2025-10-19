document.addEventListener("DOMContentLoaded", async () => {
  const btnExtrair = document.getElementById("extrair");
  const vagaTexto = document.getElementById("vagaTexto");
  const cvMarkdown = document.getElementById("cvMarkdown");
  const resultado = document.getElementById("resultado");

  try {
    const resp = await fetch(chrome.runtime.getURL("static/resume.md"));
    cvMarkdown.value = (await resp.text()).trim();
  } catch {
    cvMarkdown.value = "⚠️ Erro ao carregar CV";
  }

  btnExtrair.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return alert("Nenhuma aba ativa encontrada.");

    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });

    chrome.tabs.sendMessage(tab.id, { action: "extrair" }, async (resposta) => {
      if (!resposta?.ok) return alert("Falha ao extrair texto da vaga.");

      vagaTexto.value = resposta.texto;
      resultado.textContent = "Analisando... ⏳";

      try {
        const apiResp = await fetch("http://localhost:3000/analisar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vaga: resposta.texto, cv: cvMarkdown.value })
        });

        const data = await apiResp.json();

        resultado.textContent =
          data.decision === "sim"
            ? `Vale a pena ✅\n\n${data.output}`
            : `Não vale a pena ❌\n\n${data.output}`;

      } catch (err) {
        console.error(err);
        resultado.textContent = "⚠️ Erro ao comunicar com o servidor Node";
      }
    });
  });
});
