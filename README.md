# Flowbot Lite

**AI Business Operations Agent** - Transform messy business communications into organized, actionable insights.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)

---

## What It Does

Flowbot Lite is a lightweight AI agent that analyzes unstructured business input (emails, notes, messages) and returns:

- **Prioritized Tasks** - What needs to be done, ranked by urgency and revenue potential
- **Recommended Actions** - Specific next steps to move things forward
- **Draft Messages** - Professional responses ready to send

Perfect for founders, sales teams, and operations managers who deal with information overload.

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [Moonshot AI (Kimi)](https://platform.moonshot.cn/) API key

### Installation

```bash
# Clone the repo
git clone https://github.com/admin-fbf/flowbot-lite.git
cd flowbot-lite

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your KIMI_API_KEY
```

### Run

```bash
npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Usage

1. Paste messy business input into the text area (emails, Slack messages, meeting notes, etc.)
2. Click **Run Agent**
3. Get back organized, actionable output

### Example Input

```
hey can u follow up with acme corp they seemed interested in the enterprise plan
also john from techstart wants a demo next week sometime
remind me to send the proposal to sarah at bigco - she's the decision maker
the investor meeting got moved to friday 3pm
```

### Example Output

```json
{
  "summary": "4 action items identified: 2 high-priority sales follow-ups, 1 proposal delivery, 1 calendar update",
  "prioritized_tasks": [
    "Send proposal to Sarah at BigCo (decision maker - high revenue potential)",
    "Schedule demo with John from TechStart for next week",
    "Follow up with Acme Corp on enterprise plan interest",
    "Update calendar: Investor meeting moved to Friday 3pm"
  ],
  "recommended_actions": [
    "Email Sarah at BigCo with proposal attached - include ROI summary",
    "Send John 3 available time slots for demo next week",
    "Draft follow-up email to Acme Corp asking about timeline and budget"
  ],
  "draft_messages": [
    "Hi Sarah, Following up on our conversation - attached is the proposal we discussed. Happy to jump on a call to walk through the ROI projections. Best, [Your name]"
  ]
}
```

---

## Project Structure

```
flowbot-lite/
├── server.js          # Express backend with /run-agent endpoint
├── public/
│   └── index.html     # Simple web UI
├── package.json       # Dependencies
├── .env.example       # Environment template
└── README.md          # This file
```

---

## API Reference

### POST /run-agent

Analyzes business input and returns structured output.

**Request:**
```json
{
  "input": "Your messy business text here..."
}
```

**Response:**
```json
{
  "result": {
    "summary": "Brief overview",
    "prioritized_tasks": ["Task 1", "Task 2"],
    "recommended_actions": ["Action 1", "Action 2"],
    "draft_messages": ["Draft email 1"]
  }
}
```

---

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `KIMI_API_KEY` | Your Moonshot AI API key | Yes |

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Provider:** Moonshot AI (Kimi K2 Turbo)
- **Frontend:** Vanilla HTML/CSS/JS

---

## AI Provider

Flowbot Lite ships with [Moonshot AI's Kimi](https://platform.moonshot.cn/) as the default, but **you can use any OpenAI-compatible provider**.

### Default: Kimi

- Excellent at structured JSON output
- Cost-effective for MVP projects
- Strong performance on business/reasoning tasks

### Using a Different Provider

Swap to OpenAI, Anthropic, Groq, Together AI, or any OpenAI-compatible API by editing `server.js`:

**OpenAI:**
```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // No baseURL needed - defaults to OpenAI
});
```

**Anthropic (via OpenAI-compatible proxy):**
```javascript
const openai = new OpenAI({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: "https://api.anthropic.com/v1",
});
```

**Groq (fast inference):**
```javascript
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
```

**Local models (Ollama):**
```javascript
const openai = new OpenAI({
  apiKey: "ollama",  // Not used but required
  baseURL: "http://localhost:11434/v1",
});
```

Just update the model name in the `chat.completions.create()` call to match your provider.

---

## Roadmap

- [ ] Multi-provider support (OpenAI, Anthropic, local models)
- [ ] Conversation history / context memory
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Email integration (Gmail, Outlook)
- [ ] CRM sync (HubSpot, Salesforce)
- [ ] **WhatsApp integration** - Chat with your agent via WhatsApp, with full conversation history and context. No app to download, works on any device you already use.
- [ ] Mobile app

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## About Flowbot Forge

Flowbot Lite is built by [Flowbot Forge](https://flowbotforge.com), an AI automation studio helping businesses streamline operations with intelligent agents.

---

**Built with speed at a hackathon. Designed to save you hours every week.**
