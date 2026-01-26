# AI Jobs Institute Website

A bold, modern website for the AI Jobs Institute — the nation's first AI workforce hub, backed by NYC & NY State.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm start

# Open http://localhost:3000
```

## 📁 Project Structure

```
aiji-website/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # All styles
│   └── script.js       # Interactivity
├── server.js           # Express server for Render
├── package.json
├── render.yaml         # Render deployment config
└── README.md
```

## ⚙️ Configuration

### Formspree Email Capture

1. Go to [Formspree](https://formspree.io) and create a free account
2. Create a new form and copy your form ID
3. In `public/index.html`, replace `YOUR_FORM_ID` with your actual form ID:

```html
<!-- Find these lines (appears twice) -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Adding Partner Logos

Replace the placeholder divs with actual images:

```html
<!-- Before (placeholder) -->
<div class="partner-logo placeholder" data-name="NYSED">
  <span>NYSED</span>
</div>

<!-- After (with image) -->
<div class="partner-logo">
  <img src="images/nysed-logo.png" alt="NYSED">
</div>
```

Create an `images/` folder in `public/` and add your logo files.

### Updating Stats

Edit the stats section in `index.html`:

```html
<div class="stat-card">
  <span class="stat-number" data-value="1000">1,000+</span>
  <span class="stat-label">Workers to be Trained</span>
</div>
```

### Adding Council Photos

Replace placeholders with actual headshots:

```html
<!-- Before -->
<div class="council-image placeholder">
  <span>MC</span>
</div>

<!-- After -->
<div class="council-image">
  <img src="images/miguel-cardona.jpg" alt="Miguel Cardona">
</div>
```

## 🌐 Deploy to Render

### Option 1: One-Click Deploy

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repo
5. Render will auto-detect `render.yaml` and deploy

### Option 2: Manual Deploy

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click "Create Web Service"

## 🎨 Design System

### Colors
- **Background:** `#0a0a0a` (Carbon Black)
- **Accent:** `#f0ff00` (Electric Yellow)
- **Text:** `#f0f0f0` (Light)
- **Muted:** `#888888` (Gray)

### Fonts
- **Headlines:** Poppins (800 weight, all caps)
- **Body:** Inter (400-600 weight)
- **Technical:** Roboto Mono

### Brand Reference
Based on Pursuit brand guidelines with a bolder, more tech-forward adaptation for AIJI.

## 📝 Content Updates

All content is in `public/index.html`. Key sections:

| Section | Line ~Location |
|---------|----------------|
| Hero tagline | `<p class="hero-tagline">` |
| Hero description | `<p class="hero-description">` |
| Stats | `.stats-grid` |
| Initiatives | `.initiatives-grid` |
| Advisory Council | `.council-grid` |
| Partners | `.partners-category` |

## 🔧 Development

The site uses vanilla HTML/CSS/JS — no build step required. Just edit and refresh.

For local development with live reload, you can use any static server:

```bash
# Using npx
npx serve public

# Using Python
cd public && python -m http.server 3000
```

## 📄 License

Private - AI Jobs Institute / Pursuit

