# Flowbot Lite — Build Spec

> Reference document for human contributors and AI assistants.
> Covers: current build, planned features, nice-to-haves, and change log.

---

## Status

**Working prototype (MVP)** — hackathon build, locally tested.

---

## Objective (Non-Negotiable)

Build a working AI agent that:

- Takes messy business input (leads, tasks, emails)
- Organizes and prioritizes it
- Outputs clear next actions + drafted responses

**Definition of Done:**
A user inputs raw business data → system returns:
1. Prioritized task list
2. Suggested actions
3. At least 1 drafted email/message

> If it doesn't think, decide, and recommend actions — it's not done.

---

## Tech Stack

| Layer     | Choice                              |
|-----------|-------------------------------------|
| Frontend  | Vanilla HTML + JS (no build step)   |
| Backend   | Node.js + Express                   |
| LLM       | Kimi K2 via Moonshot AI (default)   |
| Hosting   | Local / Netlify (via netlify-cli)   |

---

## System Architecture

```
[Browser: index.html]
        |
        | POST /run-agent (JSON)
        v
[Express Server: server.js :3001]
        |
        | OpenAI-compatible API call
        v
[LLM Provider: Moonshot AI / Kimi K2]
        |
        | Structured JSON response
        v
[Browser renders output]
```

**Principles:**
- One endpoint = fast debugging
- Prompt embedded = no complexity
- Returns raw JSON = flexible UI later
- No database (in-memory only)
- No authentication

---

## Core Features (Implemented)

### Input Module
- Free text input (textarea)
- Placeholder with example prompt

### Processing Agent
Agent responsibilities (via single structured prompt):
- Extract entities (names, intent, urgency)
- Classify: Lead / Follow-up / Task
- Assign priority: High (revenue/urgent) / Medium / Low
- Generate structured JSON output

**Required output schema:**
```json
{
  "summary": "",
  "prioritized_tasks": [],
  "recommended_actions": [],
  "draft_messages": []
}
```

### Output Module (UI)
- Summary display (shown when populated)
- Top 3 prioritized tasks
- Full recommended actions list
- Draft messages panel

### Drafting Engine
Generates 1–3 responses:
- Follow-up email
- Lead reply
- Scheduling message

Tone: professional, concise, action-oriented.

---

## Constraints (Stay Focused)

**DO NOT:**
- Build authentication
- Build a database
- Over-engineer the UI
- Add unnecessary features

**DO:**
- Ship a working loop
- Make output clean and structured
- Optimize for demo clarity

---

## Demo Script

**Flow (30–45 seconds):**
1. Paste messy input
2. Click **Run Agent**
3. Show:
   - "Here's what matters most"
   - "Here's what to do"
   - "Here's what to send"

**Demo input:**
```
New leads:
- John (CEO of a startup) asked for pricing and said they want to move quickly
- Sarah requested more info last week but hasn't responded since
- Mike booked a call for Friday at 2pm

Clients:
- Need to send invoice to Acme Corp (overdue)
- Follow up with Lisa from last month about proposal (worth ~$5k deal)

Internal:
- Schedule team meeting for next week
- Review marketing campaign performance

Notes:
- Focus on closing deals this week
```

---

## Success Criteria (Judging Lens)

Must clearly demonstrate:
- Time savings
- Decision-making automation
- Revenue relevance

> If it feels like a chatbot → you lose.
> If it feels like a business tool → you win.

---

## AI Provider

**Default:** Moonshot AI (Kimi K2 Turbo)
- OpenAI-compatible API
- Base URL: `https://api.moonshot.ai/v1`
- Model: `kimi-k2-turbo-preview`
- Cost-effective, strong JSON output

**Swappable to any OpenAI-compatible provider** — see README for examples (OpenAI, Groq, Anthropic, Ollama).

---

## Planned Features

> Tracked here for contributors. Prioritized by impact.

| Priority | Feature                        | Notes                                      |
|----------|--------------------------------|--------------------------------------------|
| High     | Multi-provider support         | Config-driven, no code change needed       |
| High     | WhatsApp integration           | Chat with agent via WhatsApp, no new app   |
| Medium   | Conversation history / memory  | Context across sessions                    |
| Medium   | Email integration              | Gmail / Outlook send + read                |
| Medium   | Calendar integration           | Google Calendar / Outlook scheduling       |
| Low      | CRM sync                       | HubSpot, Salesforce                        |
| Low      | Mobile app                     | Post-MVP                                   |
| Future   | Multi-agent orchestration      | Yonnie / CoosaAI integration               |
| Future   | Persistent memory              | Long-term context across users             |

---

## Nice-to-Haves

- CSV / structured JSON input (alongside free text)
- Priority badges on tasks (🔴 High / 🟡 Medium / 🟢 Low)
- Copy-to-clipboard on draft messages
- Dark/light mode toggle
- Response time indicator

---

## Future Integration Targets

This build is designed to be folded into:
- **Yonnie** — personal AI assistant (`/Users/erica-owner/dev/Yonnie`)
- **CoosaAI** — planned future platform

The single-agent architecture and OpenAI-compatible interface are intentionally portable for this reason.

---

## Change Log

All contributors are acknowledged here.

---

### v1.0.0 — Hackathon MVP
**Date:** 2026-03-30
**Contributors:** Flowbot Forge

- Initial Express + Kimi K2 backend
- Vanilla HTML/CSS/JS frontend
- Single `/run-agent` endpoint
- Structured JSON prompt with Kimi quirk handling (strip markdown wrappers)
- Summary display (optional upgrade, implemented)
- Top 3 tasks, actions list, draft messages panels
- `.env`-based API key configuration
- MIT License

---

### v1.0.1 — Spec + Prompt Hardening
**Date:** 2026-03-30
**Contributors:** Flowbot Forge

- Added `SPEC.md` — this document — for contributor and AI reference
- Strengthened prompt: added explicit "Only raw JSON" instruction to reduce Kimi markdown wrapping
- README expanded: AI provider options, WhatsApp roadmap item, full usage docs

---

## Contributing

Contributions are welcome. Please open a PR and reference the relevant section of this spec.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with a clear message: `git commit -m 'feat: description'`
4. Push and open a Pull Request
5. You will be acknowledged in the Change Log

---

*This document is the source of truth for build decisions. When in doubt, refer here first.*
