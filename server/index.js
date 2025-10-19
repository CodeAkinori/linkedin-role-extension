import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";
import { GROQ_API_KEY } from "../config.js";

const app = express();
const PORT = 3000;

const groq = new Groq({ apiKey: GROQ_API_KEY });

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/analisar", async (req, res) => {
  try {
    const { vaga, cv } = req.body;
    if (!vaga || !cv) return res.status(400).json({ error: "vaga e cv são obrigatórios" });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Analise a vaga abaixo e meu CV em Markdown. 
Resuma em português para cada ponto:
- Decisão final: vale a pena ou não
- 3 principais pontos fortes
- 3 principais pontos a melhorar
- Conclusão compacta (2-3 linhas)

Use linguagem direta, evite tabelas ou listas longas.
Vaga: ${vaga}
CV: ${cv}`
        }
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      reasoning_effort: "medium"
    });

    const output = chatCompletion.choices[0]?.message?.content || "Não foi possível analisar";
    const decision = /vale a pena/i.test(output) ? "sim" : "não";

    res.json({ decision, output });

  } catch (err) {
    console.error("Erro Groq API:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
