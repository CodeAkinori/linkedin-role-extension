document.getElementById("extrair").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return alert("Nenhuma aba ativa encontrada.");

  // injeta o script se não estiver ativo
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });

  // envia a mensagem de extração
  chrome.tabs.sendMessage(tab.id, { action: "extrair" }, (resposta) => {
    const area = document.getElementById("saida");

    if (chrome.runtime.lastError) {
      area.value = "";
      alert("Erro: não foi possível comunicar com a página. Abra uma vaga e tente novamente.");
      return;
    }

    if (resposta && resposta.ok) {
      area.value = resposta.texto;
    } else {
      area.value = "";
      alert("Falha ao extrair texto da vaga.");
    }
  });
});
