import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.error("❌ Missing GROQ_API_KEY in .env");
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/analyze", async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ error: "Job description missing" });

    // Path to resume
    const resumePath = path.join(__dirname, "../extension/static/resume-example.md");
    const resume = fs.existsSync(resumePath)
      ? fs.readFileSync(resumePath, "utf8")
      : "No resume content found.";

    const prompt = `
Você é um assistente que analisa se um candidato deve se candidatar a uma vaga.
Compare o currículo abaixo com a descrição da vaga e responda em português.
Resuma apenas os pontos principais e diga se vale a pena ou não se candidatar.

Vaga:
${jobDescription}

Currículo:
${resume}
`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 700,
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    res.json({ result: text || "⚠️ Nenhuma resposta gerada." });
  } catch (error) {
    console.error("❌ Erro Groq API:", error);
    res.status(500).json({
      error: "Erro ao chamar a Groq API",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
