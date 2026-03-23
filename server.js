require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── SKU LIBRARY ────────────────────────────────────────────────────────────
const SKUS = {
  "mag-ashwa": {
    label: "Liposomal Magnesium Ashwagandha Gummies",
    tag: "Deep sleep + stress relief",
    mech: "10-form magnesium complex activating all 4 absorption pathways (paracellular, ion channels, dipeptide, liposomal). Beadlet technology protects from stomach acid and delivers controlled release. KSM-66 Ashwagandha reduces cortisol. L-Theanine adds fast-acting calm without drowsiness. Zero added sugar.",
    diff: "Only 10-form magnesium gummy on TikTok Shop. Beadlet tech means you actually get what is on the label. Most competitors use 1-2 forms and saturate one pathway.",
    keyPhrases: ["10 forms, 4 pathways", "No saturation, no bottlenecks", "Tired but wired", "Beadlet technology", "Zero added sugar", "KSM-66 most studied ashwagandha", "You're not managing - you're fixing"],
    timeline: "Night 1-3: fall asleep easier. Week 1: sleep improves, less irritable. Week 2-3: deep sleep quality. Week 4+: full stress resilience.",
    whoItsFor: ["Stressed professional - brain won't shut off", "Exhausted parent - tired but wired", "Melatonin avoider", "Athletes - muscle cramps, slow recovery", "Anxious mind - racing thoughts"],
    objections: [
      { q: "I tried magnesium before and it didn't work", a: "Single form saturated one pathway. Ours uses ALL 4. Like comparing a 1-lane road to a 4-lane highway." },
      { q: "Why not take separate supplements?", a: "You'd need 3 bottles, cost more, and miss the beadlet tech and multi-pathway complex. These work better together." },
      { q: "Will it make me drowsy?", a: "No. L-Theanine gives calm without sedation. Regulates the nervous system, doesn't knock you out." },
      { q: "How long until it works?", a: "Feel it in the first week. Full benefits at 30-60 days when stores are rebuilt." },
      { q: "Is it safe with my medication?", a: "Generally yes, but check with your doctor if you're on blood pressure meds, blood thinners, or thyroid meds." }
    ],
    engagementPrompts: ["Type TIRED if you're exhausted but can't fall asleep", "Type TRIED if magnesium didn't work for you before", "Type FORMS if you want the full breakdown"],
    pricing: "Regular $45. Flash price $22.99 for the next 10 minutes. 60-count = $0.75/day. Less than your morning coffee."
  },
  "alpha-shilajit": {
    label: "Alpha Shilajit Gummies",
    tag: "Energy + vitality",
    mech: "85+ trace minerals and fulvic acid support cellular energy production at the mitochondrial level. Clinically standardized shilajit extract in gummy format - no tar, no mess.",
    diff: "Gummy format makes shilajit actually easy to take daily. Most shilajit is sold as sticky resin that tastes terrible and people stop taking within a week.",
    keyPhrases: ["85+ trace minerals", "Fulvic acid", "Mitochondrial energy", "No tar no mess"],
    timeline: "Week 1-2: improved energy and mental clarity. Week 3-4: physical performance and stamina.",
    whoItsFor: ["Chronically low energy", "Men looking for natural vitality support", "Biohackers", "Athletes wanting natural performance support"],
    objections: [
      { q: "What even is shilajit?", a: "Ancient mineral resin formed over centuries in Himalayan rocks. 85+ trace minerals your body uses for energy production at the cellular level." },
      { q: "Is this just a testosterone booster?", a: "No - it supports overall cellular energy and mineral balance. The energy benefits are real and not hormone-dependent." },
      { q: "Why gummies and not resin?", a: "Resin tastes like tar and most people stop taking it within a week. Gummy format means you actually take it every day." }
    ],
    engagementPrompts: ["Type ENERGY if you're running on caffeine just to function", "Type MINERALS if you want to know what's inside"],
    pricing: "Flash price active now. Link in bio."
  },
  "hair-density": {
    label: "Hair Density Roll-On",
    tag: "Topical hair growth",
    mech: "Direct scalp delivery bypasses gut absorption entirely. Active ingredients go straight to the follicle via roll-on application. No gut needed, no absorption loss.",
    diff: "Roll-on format for precise application directly to scalp. No drips, no waste, no mess. Most hair growth products are oral supplements that have to survive the gut before reaching the scalp.",
    keyPhrases: ["Direct to follicle", "No gut needed", "Precise application", "Zero waste"],
    timeline: "Week 4-8: reduced shedding. Month 2-3: visible density improvement.",
    whoItsFor: ["Noticing more hair in the shower drain", "Postpartum hair loss", "Stress-related shedding", "Anyone who tried oral supplements without results"],
    objections: [
      { q: "How long until I see results?", a: "Reduced shedding typically in 4-8 weeks. Visible density at 2-3 months. Hair growth is slow - that is just biology." },
      { q: "Will it work for my hair type?", a: "The formula works at the follicle level regardless of hair texture or type." },
      { q: "Is it safe for colored or treated hair?", a: "Yes - topical application to the scalp does not affect the hair shaft or color." }
    ],
    engagementPrompts: ["Type SHED if you are noticing more hair fall than normal", "Type DRAIN if you dread checking the shower"],
    pricing: "Flash price active now. Link in bio."
  },
  "sea-moss": {
    label: "Sea Moss Gummies",
    tag: "92 minerals daily",
    mech: "Wildcrafted Irish Sea Moss delivers a bioavailable mineral matrix supporting gut lining, immune function, and thyroid health. 92 minerals in a single source.",
    diff: "Gummy format makes sea moss actually enjoyable to take daily. Raw sea moss gel is messy and inconsistent. This is the format people stick with.",
    keyPhrases: ["92 minerals", "Wildcrafted Irish Sea Moss", "Gut lining support", "The form you will actually take"],
    timeline: "Week 1-2: gut comfort improvement. Week 3-4: energy and immune support.",
    whoItsFor: ["Gut health focused", "Immune support seekers", "Ancestral nutrition", "Thyroid health"],
    objections: [
      { q: "Why not just eat seaweed?", a: "You would need to eat a significant amount of seaweed daily to match the mineral density. This is a precise, standardized dose." },
      { q: "Does it taste like the ocean?", a: "No - the gummy format masks the taste completely. That is the whole point." },
      { q: "How much iodine is in this?", a: "Within safe daily limits. If you have a thyroid condition, check with your doctor." }
    ],
    engagementPrompts: ["Type GUT if you are working on your gut health", "Type MINERALS if you want to know what 92 minerals does for your body"],
    pricing: "Flash price active now. Link in bio."
  },
  "turmeric": {
    label: "Turmeric Gummies",
    tag: "Anti-inflammatory support",
    mech: "Curcumin paired with BioPerine (black pepper extract) dramatically enhances absorption. Without BioPerine, most curcumin passes through unused. Together they create a bioavailable anti-inflammatory that actually reaches the bloodstream.",
    diff: "BioPerine is what activates curcumin. Most turmeric supplements skip it entirely because it adds cost. We include it because without it the product does not work properly.",
    keyPhrases: ["BioPerine activates curcumin", "Most brands skip this", "Anti-inflammatory that actually absorbs", "Joint comfort"],
    timeline: "Week 2-3: joint comfort improvement. Week 4+: consistent inflammation support.",
    whoItsFor: ["Joint pain or stiffness", "Post-workout recovery", "Chronic inflammation", "Anyone who tried turmeric before without results"],
    objections: [
      { q: "Can I just use turmeric powder from my kitchen?", a: "Kitchen turmeric is only about 3% curcumin and has near-zero absorption without black pepper. This is standardized extract plus BioPerine - not the same thing." },
      { q: "How long does it take to work?", a: "Most people notice joint comfort in 2-3 weeks. Full anti-inflammatory benefit builds over 4-6 weeks." },
      { q: "Is it safe to take daily?", a: "Yes - turmeric and black pepper are both food-grade ingredients with strong long-term safety records." }
    ],
    engagementPrompts: ["Type JOINT if you have stiffness or soreness that won't go away", "Type TRIED if you've taken turmeric before and felt nothing"],
    pricing: "Flash price active now. Link in bio."
  }
};

const BENCHMARK = `
BENCHMARK - from top-performing Root Labs live script:

HOOK: Open with a punchy symptom question ("Tired but wired?"). Name the real cause immediately. Promise a revelation.
PROBLEM: Lead with a relatable stat. Explain WHY existing solutions fail using simple analogies (1-lane vs 4-lane highway). Make audience feel seen.
SOLUTION: Position product as the first real fix. Explain mechanism in plain language - the science is the sell. Name specific technology.
SOCIAL PROOF: Platform credibility first. Specific outcome language from real results. Avoid vague claims.
ENGAGEMENT: Typed response prompts every 2-3 minutes. Mirror language back to commenters.
OBJECTIONS: Address before they type it. Short answers using the same analogy language. Never defensive - validate then reframe.
CTA: Exact flash price + regular price. Specific time window. Ask for a signal ("Type IN CART").
CLOSE: Contrast two futures (with vs without). Specific believable urgency. Community identity statement, not just a discount.

KEY CONVERTING PHRASES: "Tired but wired" / "10 forms, 4 pathways" / "No saturation, no bottlenecks" / "You're not managing - you're fixing" / "Less than your morning coffee"
`;

// ─── SCRAPE ─────────────────────────────────────────────────────────────────
async function scrapeProfile(handle) {
  const clean = handle.replace("@", "").trim();
  try {
    const url = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${clean}`;
    const res = await axios.get(url, { timeout: 6000 });
    return {
      handle: clean,
      displayName: res.data.author_name || clean,
      bio: res.data.title || ""
    };
  } catch {
    return { handle: clean, displayName: clean, bio: "" };
  }
}

// ─── GENERATE ───────────────────────────────────────────────────────────────
async function generateScript({ handle, sku, desc, profile }) {
  const product = SKUS[sku];
  if (!product) throw new Error("Unknown SKU: " + sku);

  const creatorContext = [
    `TikTok handle: @${handle}`,
    profile?.displayName && profile.displayName !== handle ? `Display name: ${profile.displayName}` : null,
    profile?.bio ? `Bio: ${profile.bio}` : null,
    desc && desc !== "not provided" ? `Creator says about themselves: ${desc}` : null
  ].filter(Boolean).join("\n");

  const systemPrompt = `You write TikTok Live scripts for Root Labs, a wellness supplement brand. Create conversion-focused, personalized live script cheatbooks for specific creators.

${BENCHMARK}

CONTENT GUARDRAILS - never break these:
- No shame-based or body-shaming hooks
- No specific percentage benefit claims
- No retail or store price comparisons (product is not sold in stores)
- Refer to the product externally as its full name, never internal shorthand

PRODUCT BRIEF:
Product: ${product.label}
What it does: ${product.tag}
Mechanism: ${product.mech}
Key differentiator: ${product.diff}
Key phrases to weave in: ${product.keyPhrases.join(", ")}
Timeline to results: ${product.timeline}
Who it is for: ${product.whoItsFor.join(", ")}
Pricing: ${product.pricing}

CREATOR PROFILE:
${creatorContext}

Adapt every section to this creator's voice. Commit to a tone and stay consistent. Return ONLY valid JSON with zero extra text:
{
  "hook": {
    "v1": "problem-led hook",
    "v2": "curiosity-led hook",
    "v3": "personal story-led hook"
  },
  "visualHook": "specific on-camera instruction for first 5 seconds",
  "positioning": "2-3 paragraph product positioning in creator voice",
  "socialProof": "social proof and mechanism explainer",
  "engagementPrompts": ["prompt 1", "prompt 2", "prompt 3"],
  "objections": [
    {"q": "objection", "a": "answer in creator voice"},
    {"q": "objection", "a": "answer in creator voice"},
    {"q": "objection", "a": "answer in creator voice"}
  ],
  "cta": "flash sale CTA with specific urgency and price",
  "closing": "closing lines - community identity and final push"
}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Generate the script now." }
    ],
    temperature: 0.8,
    max_tokens: 2000
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.post("/api/generate", async (req, res) => {
  const { handle, sku, desc } = req.body;
  if (!handle || !sku) return res.status(400).json({ error: "handle and sku required" });
  try {
    const profile = await scrapeProfile(handle);
    const script = await generateScript({ handle, sku, desc, profile });
    res.json({ success: true, script });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Root Labs Script Gen running on port ${PORT}`));
