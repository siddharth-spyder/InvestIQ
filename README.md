# 📊 InvestIQ – Interactive Portfolio Sandbox for Beginner Investors  

## 🌟 Inspiration  
Most beginner investors have **no idea** what cash, bonds, stocks, index funds, or crypto actually mean — or how risky they are during real crashes.  
Almost every financial tool assumes prior knowledge, which leaves beginners confused and overwhelmed.  

We wanted to fix that by building a **beginner-first**, **visual**, **game-like** investing education tool.  
A tool where users *learn by doing*, not reading boring textbooks.  

Thus, **InvestIQ** was born.  

---

## 🧩 What it does  
InvestIQ is a **multi-page, interactive financial learning platform** that teaches beginners how investing works using:  
- 🎮 **Drag-and-drop portfolio building**  
- 📊 **Live animated pie charts**  
- ⚠️ **Real-time risk calculation**  
- 🧠 **Beginner-friendly explanations**  
- 📰 **Real market event stories with external links**  
- 🌈 **Cyberpunk neon UI/UX and animations**  

### 💡 Core Features  
- 🧱 Drag money-blocks (Cash, Bonds, Index Funds, Stocks, Crypto) into your portfolio  
- 📈 See instant percentage allocation  
- 🔥 Watch the risk meter rise or fall  
- 🧯 Get real explanations on diversification & overexposure  
- 📰 Learn from real events — 2008 crash, COVID crash, Bitcoin cycles  
- 🚀 Enjoy a visually immersive neon cyberpunk interface  

InvestIQ transforms financial literacy into something **fun, intuitive, and exciting**.

---

## 🛠️ How we built it  

### 🔧 Tech Stack  
- **HTML5** – Multi‑page website structure  
- **CSS3** – Neon, glow, glitch, and scanline animations  
- **Bootstrap 5** – Responsive grid system  
- **JavaScript** –  
  - 🏗️ Custom drag-and-drop engine  
  - 📊 Real-time Chart.js updates  
  - 🎛️ Weighted risk calculator  
  - 🗂️ Dynamic portfolio explanation system  
  - ✨ Page-aware navigation highlighting  
- **Chart.js** – Animated doughnut chart  

### 🧱 Architecture  
- 5‑page system:  
  - 🏠 `index.html`  
  - 📘 `basics.html`  
  - 📦 `assets.html`  
  - ⚙️ `builder.html`  
  - 📰 `stories.html`  
- Shared theme, shared CSS, shared JS  

Everything was built **manually** — no frameworks, no templates, just pure front-end engineering.

---

## 🧗 Challenges we ran into  

### 1️⃣ Getting drag-and-drop perfectly smooth  
Native DnD events behave differently across browsers.  
We had to handle:  
- ghost images  
- dragover blocking  
- drop zone highlighting  
- asset data transfers  

### 2️⃣ Making neon animations beautiful AND readable  
Balancing bright neon colors with legibility required dozens of tests.

### 3️⃣ Explaining finance simply  
We rewrote copy repeatedly to keep it:  
- simple  
- non-technical  
- non-misleading  
- educational but fun  

### 4️⃣ Syncing chart, risk meter & explanations  
All components update simultaneously, which required careful JS sequencing.

### 5️⃣ Keeping UI consistent across 5 different pages  
The cyberpunk theme had to feel unified everywhere.

---

## 🏅 Accomplishments we’re proud of  

- 🎮 **A fully gamified investing learning tool**  
- 🎨 **A unique cyberpunk finance aesthetic**  
- 🔥 **Smooth drag-and-drop engine built from scratch**  
- 📚 **Real investing education with real-world events**  
- 🤝 **Beginner-friendly explanations that actually make sense**  
- 📱 **Fully responsive, animated, multi-page interface**  

InvestIQ doesn’t just show numbers — it **teaches** through interaction.  

---

## 📘 What we learned  

- Great UI/UX is the key to explaining complex topics  
- Jargon is unnecessary when teaching beginners  
- Animations need strict control to avoid overwhelming users  
- Real historical events make financial concepts relatable  
- Structuring a multi-page hackathon project requires clean planning  

---

## 🔮 What’s next for InvestIQ  

### 🚀 Future Add-ons  
- 🤖 **AI-powered “Investment Coach”**  
  Natural-language explanations of user portfolios  
- 📉 **Crash Simulator**  
  See your portfolio survive (or collapse) in:  
  - Dot-com bubble  
  - 2008 meltdown  
  - COVID-2020  
  - Bitcoin winters  
- 🧱 **More assets**  
  - Gold  
  - Real Estate  
  - REITs  
- 🏆 **Gamified badges**  
  - Diversification Master  
  - Risk Navigator  
  - Safe Crypto User  
- 👤 **User accounts + saved portfolios**  

InvestIQ is becoming a **complete beginner-friendly investing platform**.

---

## ⚠️ Disclaimer  
This project is for **educational purposes only** and is **NOT financial advice**.  

