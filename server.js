import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.KIMI_API_KEY,
  baseURL: "https://api.moonshot.ai/v1",
});

const PORT = 3001;

app.post("/run-agent", async (req, res) => {
  try {
    const { input } = req.body;

    const prompt = `
You are an AI Business Operations Assistant.

Your job:
1. Analyze messy business input
2. Extract leads, tasks, and follow-ups
3. Prioritize based on urgency and revenue potential
4. Recommend next actions
5. Draft professional responses

Return ONLY valid JSON in this format:
{
  "summary": "",
  "prioritized_tasks": [],
  "recommended_actions": [],
  "draft_messages": []
}

Be decisive. Be specific. No fluff.
Do not include markdown, backticks, or explanations. Only raw JSON.

Input:
${input}
`;

    const response = await openai.chat.completions.create({
      model: "kimi-k2-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const output = response.choices[0].message.content;

    // Reality Check: Clean response (handles Kimi quirks of wrapping JSON)
    const cleanOutput = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json({ result: cleanOutput });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
