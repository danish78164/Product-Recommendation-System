# 🛍️ Product Recommendation System Using AI
### Powered by Groq AI (LLaMA 3) — 100% Free, No Credit Card

---

## 📁 Project Structure

```
product-recommender/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ProductCard.js
│   ├── App.js
│   ├── api.js
│   ├── index.js
│   └── products.js
├── .env               ← paste your FREE Groq API key here
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Setup in 5 Steps

### Step 1 — Install Node.js
Download: https://nodejs.org → LTS version → install

```bash
node -v    # verify
npm -v     # verify
```

### Step 2 — Get FREE Groq API Key (No credit card!)
1. Go to → https://console.groq.com
2. Sign up with Google / GitHub (free)
3. Click **"API Keys"** → **"Create API Key"**
4. Copy the key (starts with `gsk_...`)

### Step 3 — Add API Key
Open `.env` and replace:
```
REACT_APP_GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 4 — Install Dependencies
```bash
npm install
```

### Step 5 — Start the App
```bash
npm start
```
Opens at **http://localhost:3000** ✅

---

## 🚀 How It Works

1. User types a preference: *"I want a phone under $500"*
2. Groq AI (LLaMA 3 model) reads the full product catalog
3. AI returns ranked product IDs + reasoning
4. App highlights recommended products with rank badges

---

## 🛠️ Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Frontend  | React 18             |
| AI Model  | LLaMA 3 via Groq API |
| Styling   | Inline CSS           |
| Build     | Create React App     |

---

## 🔑 Notes
- Groq free tier: **14,400 requests/day** — very generous
- Never commit `.env` (already in `.gitignore`)
- Restart `npm start` after editing `.env`
