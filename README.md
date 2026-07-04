# AI Purchase Order Ingestion — Interactive HTML MVP

A single-page demo of an AI-powered Purchase Order ingestion platform. The app lives in the `mvp/` folder and covers the full user journey: Overview → Dashboard → Inbox → AI Processing → Validation → Maker Review → Checker Approval → ERP Export → Audit Trail.

## Demo flow

1. **Overview** — read workflow steps and advantages, then click **Start Demo Journey**
2. **Inbox** → select **PO-24119** → **Start AI Processing**
3. Watch AI processing → auto-navigates to **Validation**
4. **Continue to Maker Review** → **Approve**
5. **Checker Approval** → check digital signature → **Approve**
6. **ERP Export** → **Push to ERP** → **View Audit Trail**
7. Use the **AI Copilot** button (bottom-right) on any screen

## Why a local server?

The MVP is plain HTML/CSS/JS, but it loads mock data with `fetch()` and uses ES modules. Browsers block those when opening `index.html` directly via `file://`. A local static server fixes that.

## Run with npx (recommended)

Requires [Node.js](https://nodejs.org). From the project root:

```bash
cd mvp
npx serve .
```

Open the URL shown in the terminal (usually **http://localhost:3000**).

### Options

```bash
# Use port 8080
npx serve . -l 8080

# Open browser automatically
npx serve . --open
```

Stop the server with `Ctrl + C`.

### Alternative with http-server

```bash
cd mvp
npx http-server . -p 8080
```

Then open **http://localhost:8080**.

## Run with Python

```bash
cd mvp
python -m http.server 8080
```

Then open **http://localhost:8080**.

## Project structure

```
mvp/
├── index.html          # Entry point
├── css/                # Design tokens, layout, components
├── js/
│   ├── app.js          # Bootstrap
│   ├── router.js       # Hash-based routing
│   ├── pages/          # Screen modules
│   └── data/           # Mock JSON data
└── assets/             # PO sample document
```

Specifications and design docs are in [`tech_docs/`](tech_docs/).