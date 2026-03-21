# Root Labs Live Script Generator

A personalized TikTok Live script generator for Root Labs creators.

## How it works
1. Creator enters their TikTok handle + picks a product
2. App scrapes their public TikTok profile for tone signals
3. GPT-4o generates a full 7-section script cheatbook personalized to their voice
4. Creator downloads a PDF cheatbook ready to use on live

## Deploy to Railway (step by step)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Root Labs Script Gen V1"
git remote add origin https://github.com/YOUR_USERNAME/rootlabs-script-gen.git
git push -u origin main
```

### 2. Connect to Railway
- Go to railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Pick this repo
- Railway will auto-detect Node.js and deploy

### 3. Add environment variables
In Railway dashboard → your project → Variables tab:
```
OPENAI_API_KEY=sk-...your key here...
```

### 4. Get your URL
Railway gives you a public URL automatically under Settings → Domains.
Share that URL with creators - no login needed.

## Local development
```bash
npm install
cp .env.example .env
# Add your OpenAI API key to .env
npm run dev
# Visit http://localhost:3000
```

## Project structure
```
rootlabs-script-gen/
├── src/
│   ├── server.js      - Express server + API routes
│   ├── generate.js    - OpenAI generation logic + SKU briefs
│   └── scrape.js      - TikTok public profile scraper
├── public/
│   └── index.html     - Full frontend UI
├── railway.toml       - Railway config
└── package.json
```
