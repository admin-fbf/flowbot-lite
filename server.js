import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3001;

// Provider configurations
const PROVIDERS = {
  // Kimi (Moonshot AI) - Primary
  "kimi-k2-0711-preview": {
    apiKey: process.env.KIMI_API_KEY,
    baseURL: "https://api.moonshot.ai/v1",
    model: "kimi-k2-0711-preview",
  },
  "kimi-k2-turbo-preview": {
    apiKey: process.env.KIMI_API_KEY,
    baseURL: "https://api.moonshot.ai/v1",
    model: "kimi-k2-turbo-preview",
  },
  // Gemini via OpenAI-compatible endpoint
  "gemini-2.0-flash-exp": {
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    model: "gemini-2.0-flash-exp",
  },
  // Ollama (local)
  "mistral": {
    apiKey: "ollama", // Ollama doesn't need a real key
    baseURL: process.env.OLLAMA_URL || "http://localhost:11434/v1",
    model: "mistral",
  },
  "llama3:8b": {
    apiKey: "ollama",
    baseURL: process.env.OLLAMA_URL || "http://localhost:11434/v1",
    model: "llama3:8b",
  },
};

// Default model (matches Yonnie's config)
const DEFAULT_MODEL = "kimi-k2-turbo-preview";

/**
 * Get OpenAI client for a specific model
 */
function getClient(modelName) {
  const config = PROVIDERS[modelName];
  if (!config) {
    throw new Error(`Unknown model: ${modelName}`);
  }
  if (!config.apiKey) {
    throw new Error(`API key not configured for model: ${modelName}`);
  }
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
}

/**
 * Check if a model is available (has API key configured)
 */
function isModelAvailable(modelName) {
  const config = PROVIDERS[modelName];
  return config && config.apiKey;
}

const PROMPT_TEMPLATE = `
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
`;

app.post("/run-agent", async (req, res) => {
  try {
    const { input, model_override } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Missing 'input' field" });
    }

    // Determine which model to use
    const requestedModel = model_override || DEFAULT_MODEL;

    // Check if requested model is available
    if (!isModelAvailable(requestedModel)) {
      console.log(`Model ${requestedModel} not available, returning 503`);
      return res.status(503).json({
        error: `Model ${requestedModel} not configured`,
        available_models: Object.keys(PROVIDERS).filter(isModelAvailable)
      });
    }

    const config = PROVIDERS[requestedModel];
    const client = getClient(requestedModel);

    console.log(`Processing request with model: ${requestedModel}`);

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [{ role: "user", content: PROMPT_TEMPLATE + input }],
      temperature: 0.3,
    });

    const output = response.choices[0].message.content;

    // Reality Check: Clean response (handles markdown wrapping quirks)
    const cleanOutput = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json({
      result: cleanOutput,
      model_used: requestedModel
    });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);

    // Return 503 for connection/API errors so client knows to retry with fallback
    const status = error.code === "ECONNREFUSED" ? 503 : 500;
    res.status(status).json({
      error: error.message || "Something went wrong",
      model_attempted: req.body.model_override || DEFAULT_MODEL
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  const available = Object.keys(PROVIDERS).filter(isModelAvailable);
  res.json({
    status: "ok",
    available_models: available,
    default_model: DEFAULT_MODEL
  });
});

app.listen(PORT, () => {
  const available = Object.keys(PROVIDERS).filter(isModelAvailable);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Available models: ${available.join(", ")}`);
});
