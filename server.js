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

// ─── SKU LIBRARY + FULL PRODUCT KNOWLEDGE BASE ──────────────────────────────
const SKUS = {
  "mag-ashwa": {
    label: "Liposomal Magnesium Ashwagandha Gummies",
    tag: "Deep sleep + stress relief",

    // THE SCIENCE - use this to educate on live
    science: `
MAGNESIUM DEFICIENCY CONTEXT:
- 50%+ of people are magnesium deficient due to modern soil depletion
- Stress actively drains magnesium faster than you can replenish it
- Creates a vicious cycle: low mag → more stress → lower mag → worse sleep
- Magnesium glycinate is the 11th most searched supplement on Amazon US - everyone is looking but most are getting the wrong thing
- Sleep deprivation is not just tiredness - it is cortisol dysregulation, impaired recovery, accelerated aging

THE SINGLE-FORM SATURATION PROBLEM (why most magnesium fails):
- Most brands use 1-2 forms (oxide or citrate or glycinate)
- Your gut has 4 distinct absorption pathways
- Using 1 form = using 1 lane of a 4-lane highway
- That pathway saturates within minutes - extra magnesium literally goes right through you
- Taking MORE of a single-form magnesium does nothing once that pathway is full
- This is why people say "I tried magnesium and it didn't work" - they were using the wrong form

THE 10-FORM COMPLEX SOLUTION:
Our formula activates ALL 4 absorption pathways simultaneously:

1. PARACELLULAR (between cells) - Citrate, Lactate, Gluconate
2. ION CHANNELS (active transport) - Malate, Taurate, Aspartate
3. DIPEPTIDE (amino acid pathways) - Glycinate (sleep + calm), Orotate (heart + energy)
4. LIPOSOMAL (direct cell delivery) - Liposomal Oxide (bypasses gut entirely), Aquamin® (72 ocean trace minerals)

Key forms to spotlight:
- Glycinate = sleep + anxiety reduction (gentlest on the gut)
- Taurate = heart health, blood pressure support
- Malate = energy production + muscle recovery
- Liposomal Oxide = bypasses stomach acid, goes directly to cells
- Aquamin® = 72 trace minerals from marine algae, whole-food mineral complex

BEADLET TECHNOLOGY:
- Micro-encapsulation wraps each form of magnesium in a protective shell
- Protects from stomach acid degradation during digestion
- Controlled time-release throughout the day and night
- Consistent potency from first gummy to last
- Most gummies degrade on the shelf or get destroyed by stomach acid before absorption
- Beadlets = you actually GET what is on the label

KSM-66® ASHWAGANDHA:
- Most clinically studied ashwagandha extract in the world - 24+ gold-standard clinical trials
- Works by reducing cortisol (your stress hormone) at the root
- Not a sedative - does not force sleep, regulates the nervous system
- Safe for daily use - adaptogenic, not habit-forming
- The difference between masking stress and actually fixing its biochemistry

L-THEANINE LAYER:
- Fast-acting calm within 30-60 minutes
- Generates alpha brain waves - the same state as meditation
- No drowsiness, no grogginess - calm without sedation
- Works synergistically with magnesium to quiet the nervous system
- Why people fall asleep faster AND wake up feeling rested

ZERO ADDED SUGAR:
- Most gummies = 4-6g added sugar per serving (spikes blood sugar right before bed)
- Blood sugar spike before bed = cortisol response = broken sleep
- We use vegan pectin, zero added sugar
- You are not fighting your own supplement to sleep

THE STACK EXPLAINED:
- Magnesium 10-form complex = physical calm, muscle relaxation, sleep architecture
- KSM-66 Ashwagandha = cortisol regulation, long-term stress resilience
- L-Theanine = fast-acting nervous system calm
- These three work together in a way no single supplement can replicate

SLEEP SCIENCE EDUCATION POINTS:
- Deep sleep (slow-wave sleep) is when physical recovery happens
- REM sleep is when emotional processing and memory consolidation happen
- Magnesium deficiency specifically destroys deep sleep architecture
- 3am wakeups are almost always cortisol spikes - not "light sleeping"
- Sleep tracker scores (Whoop, Oura, Apple Watch) directly measure this

DEMO IDEAS FOR LIVE:
- Oil and water test: Glass 1 - regular mag oxide sits on top of oil layer (cannot pass cell membranes). Glass 2 - liposomal passes through. Oil = your cell membranes.
- Show sleep tracker screenshots before/after (3-layer: overall score, deep sleep duration, HRV)
- Hold up a competitor gummy vs ours - read the label, count the forms`,

    diff: "The only 10-form magnesium gummy on TikTok Shop. Beadlet tech means you actually absorb what you paid for. Most competitors use 1-2 forms and hit a saturation ceiling your body cannot get past.",

    keyPhrases: [
      "10 forms, 4 pathways",
      "No saturation, no bottlenecks",
      "Tired but wired",
      "Beadlet technology",
      "Zero added sugar, high fiber",
      "KSM-66 - most studied ashwagandha",
      "You are not managing - you are fixing",
      "Less than your morning coffee",
      "Liposomal delivery",
      "The absorption problem nobody talks about",
      "Your magnesium is going right through you"
    ],

    timeline: `
Night 1-3: Fall asleep faster, feel more relaxed at bedtime
Week 1: Sleep quality visibly improves, muscle tension eases, less irritable during the day
Week 2-3: Deep sleep architecture improves, wake up refreshed not groggy, stress feels more manageable
Week 4+: Full stress resilience built, consistent deep sleep, cortisol regulation normalized
Note: Magnesium stores need 30-60 days to fully rebuild - short-term and long-term benefits are both real`,

    whoItsFor: [
      "Stressed professional - brain will not shut off at night",
      "Exhausted parent - tired but too wired to sleep",
      "Melatonin avoider - wants natural sleep, not dependency",
      "Athletes - muscle cramps, slow recovery, broken deep sleep",
      "Anxious mind - racing thoughts, 3am wakeups",
      "Light sleeper - wakes multiple times, never fully rested",
      "Biohacker - tracks HRV and sleep scores, wants to optimize",
      "Anyone who has tried magnesium glycinate and hit a ceiling"
    ],

    objections: [
      { q: "I already take magnesium glycinate and it works fine", a: "Glycinate is great - it is one of the best single forms. But it only opens one pathway. Once that saturates, you hit a ceiling. Our formula opens all 4 simultaneously - glycinate is in ours plus 9 other forms working alongside it." },
      { q: "I tried magnesium before and it did nothing", a: "That is the single-form saturation problem. One form, one pathway, it fills up in minutes, the rest passes through. This is not a dosage problem - it is a delivery problem. 10 forms, 4 pathways is a completely different mechanism." },
      { q: "Why not just take separate supplements for each?", a: "You would need 3-4 bottles, spend more, and still miss the beadlet technology that makes all of it actually absorb. The synergy of the stack inside the beadlet matters - these are designed to work together." },
      { q: "Will it make me drowsy or groggy?", a: "No. L-Theanine is the opposite of a sedative - it creates alpha brain wave calm without drowsiness. KSM-66 regulates cortisol, it does not sedate you. You will feel relaxed, not knocked out." },
      { q: "How long until it works?", a: "Most people feel the calm within the first few nights. Deep sleep score improvements show up in week 1-2 on trackers. Full magnesium store rebuilding takes 30-60 days but you will feel it working long before that." },
      { q: "Is it safe with my medication?", a: "Magnesium, ashwagandha, and L-theanine are all food-grade ingredients with strong safety records. If you are on blood pressure meds, blood thinners, or thyroid medication specifically, check with your doctor first." },
      { q: "Why is this more expensive than other gummies?", a: "Liposomal beadlet technology and 10 clinically-dosed forms cost more to manufacture than standard gummies. But if your single-form magnesium is not absorbing properly, you are spending money on expensive urine. A supplement that actually works is not expensive." }
    ],

    engagementPrompts: [
      "Type TIRED if you are exhausted but cannot fall asleep",
      "Type TRIED if you have taken magnesium before and felt nothing",
      "Type FORMS if you want me to break down all 10 forms",
      "Type TRACKER if you use a sleep tracker and want to know what to look for",
      "Type 3AM if you wake up in the middle of the night with your mind racing",
      "Poll: What is your sleep struggle? 1 = cannot fall asleep, 2 = cannot stay asleep, 3 = wake up exhausted"
    ],

    demoScript: `Oil and water demo: Fill two glasses with water. Add a layer of oil to both - this represents your cell membranes, which are lipid (fat) based. Drop regular magnesium oxide in glass 1 - watch it sit on top of the oil, cannot pass through. Drop our liposomal form in glass 2 - the lipid shell allows it to pass right through the oil layer. That is the difference between magnesium that goes to waste and magnesium that reaches your cells.`,

    pricing: "Regular $45. Flash price $22.99 for the next 10 minutes. 60-count = 30 days supply = $0.75/day. Less than a single shot of espresso. You are spending more than this on coffee to compensate for sleep that is not working."
  },

  "alpha-shilajit": {
    label: "Alpha Shilajit Gummies",
    tag: "Energy + vitality",

    science: `
WHAT IS SHILAJIT:
- Ancient resin formed over millions of years as plant matter compressed between Himalayan rocks
- Contains 85+ bioactive trace minerals and compounds including fulvic acid, humic acid, and dibenzo-alpha-pyrones
- Used in Ayurvedic medicine for thousands of years as a rejuvenator
- Modern science has validated the mechanisms behind what traditional medicine always knew

THE ENERGY PROBLEM SHILAJIT SOLVES:
- Mitochondria are your cellular energy factories - they produce ATP (your body's actual fuel)
- Modern diet, stress, and environmental toxins deplete the trace minerals mitochondria need to function
- Result: you are not lazy, your cells are literally running on empty
- Caffeine does not fix this - it just borrows against tomorrow's energy
- Shilajit provides the raw mineral materials mitochondria need to produce real energy

FULVIC ACID - THE KEY MECHANISM:
- Fulvic acid is the active transport molecule in shilajit
- It carries minerals through cell walls that would otherwise not absorb
- Acts as an electrolyte + mineral transporter simultaneously
- Also has antioxidant properties - reduces cellular oxidative stress
- The reason shilajit bioavailability is dramatically higher than taking individual mineral supplements

THE 85+ MINERALS:
- Not synthetic isolated minerals - a whole-food derived mineral complex
- Includes: zinc, iron, copper, manganese, silicon, selenium, and dozens more
- These minerals are cofactors for hundreds of enzymatic reactions including energy production
- Many people are deficient in multiple trace minerals without knowing it

TESTOSTERONE + VITALITY (handle carefully):
- Clinical studies show shilajit supports healthy testosterone levels in men
- Mechanism: provides zinc and other cofactors required for testosterone synthesis
- This is not a testosterone "booster" - it is removing a nutritional bottleneck
- Also supports sperm quality and motility in clinical studies
- Women benefit equally from energy and mineral support

COGNITIVE BENEFITS:
- Fulvic acid has been studied for its role in reducing cognitive decline
- Supports acetylcholine (memory and focus neurotransmitter) production
- Mental clarity improvements often reported before physical energy improvements
- Brain fog is frequently a trace mineral deficiency symptom

FORMAT ADVANTAGE:
- Traditional shilajit resin is sticky black tar with a strong bitter taste
- Compliance rates for resin are very low - most people stop within 2 weeks
- Our gummy delivers the same standardized extract in a form people actually take
- Standardized extract = consistent dose every time, unlike raw resin which varies`,

    diff: "Gummy format with clinically standardized extract. Most shilajit products are either raw resin (tastes like tar) or low-dose capsules. Standardized extract + gummy format = the version people actually take every day.",

    keyPhrases: [
      "85+ trace minerals",
      "Fulvic acid transport mechanism",
      "Mitochondrial energy production",
      "Cellular energy not caffeine energy",
      "No tar no mess",
      "What your mitochondria have been missing",
      "Himalayan mineral complex",
      "Real energy vs borrowed energy"
    ],

    timeline: `
Days 3-7: Mental clarity and focus improvements (brain notices minerals first)
Week 1-2: Sustained energy without the afternoon crash
Week 2-3: Physical performance and stamina improvements
Week 4+: Full mineral replenishment, hormonal balance support, long-term vitality`,

    whoItsFor: [
      "Chronically tired despite sleeping enough",
      "Relying on caffeine just to function normally",
      "Men over 30 experiencing energy and vitality decline",
      "Biohackers optimizing cellular performance",
      "Athletes seeking natural performance and recovery support",
      "Anyone with brain fog that caffeine does not fix",
      "People who have tried B vitamins and iron without results"
    ],

    objections: [
      { q: "What even is shilajit?", a: "Millions of years of compressed plant matter from the Himalayas. 85+ trace minerals your mitochondria need to produce cellular energy. Ancient medicine validated by modern science. The reason people who take it describe it as unlocking energy they forgot they had." },
      { q: "Is this just a testosterone booster for men?", a: "No - the energy and mineral support benefits everyone. Men do see testosterone support as a side benefit because zinc is a key cofactor, but the primary mechanism is cellular energy production. Women are some of our most consistent repeat customers." },
      { q: "Why gummies instead of the traditional resin?", a: "Because the resin tastes like tar and people stop taking it. Our standardized extract in gummy form delivers a consistent, clinically-dosed amount every day. The best supplement is the one you actually take." },
      { q: "Is there actual science behind this?", a: "Yes - fulvic acid and shilajit have been studied extensively. The mechanisms around mitochondrial support, mineral transport, and testosterone are published in peer-reviewed journals. This is not folk medicine - it is ancient wisdom with modern validation." },
      { q: "How is this different from just taking a multivitamin?", a: "Multivitamins use synthetic isolated minerals with poor absorption. Shilajit provides a whole-food mineral complex where fulvic acid actively transports minerals into your cells. Completely different absorption mechanism." }
    ],

    engagementPrompts: [
      "Type TIRED if you are sleeping enough but still exhausted",
      "Type CAFFEINE if you need coffee just to feel like a human being",
      "Type MINERALS if you want to know what fulvic acid actually does",
      "Type MEN if you want to know about the testosterone research",
      "Poll: Your energy problem - 1 = morning fatigue, 2 = afternoon crash, 3 = both"
    ],

    pricing: "Flash price active now. Link in bio. 60-count supply."
  },

  "hair-density": {
    label: "Hair Density Roll-On",
    tag: "Topical hair growth",

    science: `
WHY ORAL SUPPLEMENTS FAIL FOR HAIR:
- Hair follicles are at the end of the delivery chain - nutrients reach vital organs first
- By the time oral supplements reach the scalp, very little active ingredient remains
- Gut absorption, liver processing, and systemic distribution all reduce what reaches follicles
- This is why biotin gummies produce expensive urine more than visible hair growth

THE TOPICAL ADVANTAGE:
- Direct application bypasses the entire digestive system
- Active ingredients go straight to the dermis (skin layer where follicles live)
- No first-pass liver metabolism, no gut absorption variability
- Concentration at the target site is dramatically higher than oral route

THE HAIR GROWTH CYCLE (educate viewers):
- Anagen (growth phase): 2-6 years - follicle actively producing hair
- Catagen (transition): 2 weeks - growth stops, follicle shrinks
- Telogen (resting): 3 months - old hair sheds, new hair prepares
- Exogen (shedding): old hair falls out as new anagen begins
- Stress, nutritional deficiency, and hormonal shifts prematurely push follicles into telogen
- This is why stress-related hair loss happens 3-6 months AFTER the stressful event

WHAT CAUSES MOST HAIR LOSS:
- DHT (dihydrotestosterone) sensitivity - miniaturizes follicles over time
- Scalp inflammation - blocks blood flow to follicles
- Nutritional deficiency at the follicle level
- Stress-induced telogen effluvium (mass shedding)
- Poor scalp circulation

HOW THE ROLL-ON WORKS:
- Roll-on delivers actives directly to the scalp with zero waste
- Targets the dermal papilla (the control center of each follicle)
- Supports blood circulation to the scalp (nutrients in, waste out)
- Reduces DHT activity locally without systemic side effects
- The rolling mechanism itself stimulates microcirculation

ROLL-ON FORMAT ADVANTAGES:
- Precision application - only where you need it
- Zero product waste compared to drops or sprays
- Portable and mess-free - no spillage, no greasy residue
- The mechanical rolling action also provides gentle scalp massage
- Compliance is easy - 2 minutes per day at the scalp`,

    diff: "Topical delivery directly to the follicle - no gut required. Roll-on format means zero waste, precise application, and the rolling action itself stimulates scalp circulation. Most hair supplements are oral and never reach the follicle in meaningful concentrations.",

    keyPhrases: [
      "Direct to follicle delivery",
      "No gut no loss",
      "Precision roll-on application",
      "Targets the dermal papilla",
      "Scalp circulation",
      "Topical beats oral for hair",
      "Zero waste application",
      "The follicle is the target"
    ],

    timeline: `
Week 2-4: Reduced shedding in the shower drain (this is the first signal)
Month 2: Scalp health visibly improves, less inflammation
Month 3: Density improvements visible, baby hairs at hairline
Month 4-6: Full density improvement cycle completes
Note: Hair growth is slow by biology - patience is the most important ingredient`,

    whoItsFor: [
      "Noticing more hair in the shower drain",
      "Postpartum hair loss (3-6 months post birth)",
      "Stress-related shedding",
      "Hairline recession (early stages)",
      "Thin or fine hair wanting more density",
      "Anyone who tried oral biotin or supplements without visible results",
      "People wanting a non-pharmaceutical solution before considering Minoxidil"
    ],

    objections: [
      { q: "How long until I see results?", a: "The first signal is reduced shedding - usually visible in the shower drain within 3-4 weeks. Visible density takes 2-3 months because that is just how the hair growth cycle works. Hair does not grow overnight for anything." },
      { q: "I have been taking biotin for months and nothing has changed", a: "Biotin works at the gut level and by the time it reaches your scalp, very little remains. Topical delivery puts the actives directly at the follicle. It is not a higher dose - it is a better route." },
      { q: "Will it work for my hair type?", a: "The formula targets the follicle at the dermal papilla level - that mechanism works regardless of hair texture, color, or type." },
      { q: "Is it safe for color-treated or chemically processed hair?", a: "Yes - the application is to the scalp, not the hair shaft. Your color, keratin treatment, or chemical processing is completely unaffected." },
      { q: "Is this like Minoxidil?", a: "It supports similar goals through different mechanisms - circulation, DHT reduction, follicle nutrition - without the systemic side effects that come with pharmaceutical options." }
    ],

    engagementPrompts: [
      "Type DRAIN if you dread looking at how much hair you lose in the shower",
      "Type BIOTIN if you have tried oral supplements and seen nothing",
      "Type SHED if your shedding has increased in the last few months",
      "Type POSTPARTUM if you are experiencing hair loss after having a baby",
      "Poll: Your hair concern - 1 = shedding, 2 = density, 3 = hairline"
    ],

    pricing: "Flash price active now. Link in bio."
  },

  "sea-moss": {
    label: "Sea Moss Gummies",
    tag: "92 minerals daily",

    science: `
WHAT IS SEA MOSS:
- Chondrus crispus - Irish Sea Moss - red algae wildcrafted from the Atlantic Ocean
- One of the most nutrient-dense foods on the planet per gram
- Contains 92 of the 102 minerals the human body is made of
- Used as food medicine in Caribbean and Irish coastal communities for centuries
- Dr. Sebi popularized it in modern health communities for its mineral density

THE 92 MINERALS MATTER:
- Your body runs on minerals as cofactors for thousands of biochemical reactions
- Most people are deficient in multiple minerals simultaneously due to soil depletion
- Sea moss provides a whole-food mineral matrix - minerals in natural ratios that work together
- Key minerals: iodine, potassium, calcium, magnesium, zinc, selenium, iron, sulfur
- These are the same mineral ratios found in human blood plasma - evolutionary alignment

GUT HEALTH MECHANISM:
- Sea moss is high in carrageenan - a natural prebiotic fiber
- Feeds beneficial gut bacteria (Lactobacillus, Bifidobacterium)
- Forms a protective gel on the gut lining - reduces permeability (leaky gut support)
- Anti-inflammatory for the gut wall
- Supports mucus membrane integrity throughout the digestive tract

THYROID SUPPORT:
- Iodine is the primary mineral required for thyroid hormone production
- Most people are iodine deficient because salt consumption has decreased
- Thyroid hormone controls metabolism, energy, hair, skin, mood, and body temperature
- Sea moss provides natural food-source iodine - not synthetic iodide

IMMUNE FUNCTION:
- Beta-glucans in sea moss activate immune cell production
- Antiviral and antimicrobial compounds studied for immune modulation
- Potassium chloride specifically reduces mucus - historical use for respiratory health
- The gut-immune connection: 70% of immune tissue is in the gut - healthy gut = stronger immunity

SKIN AND BEAUTY BENEFITS:
- Collagen synthesis support through mineral cofactors
- Citrulline in sea moss supports skin elasticity
- Anti-inflammatory effect reduces acne and skin irritation
- Hydration at the cellular level
- Why "sea moss skin glow" has become a searchable outcome

FORMAT ADVANTAGE:
- Raw sea moss gel requires preparation, refrigeration, and tastes strongly oceanic
- Capsules are large and difficult for many to swallow
- Gummy format is consistent dose, great taste, daily compliance
- Consistency is everything with micronutrient supplementation`,

    diff: "The 92-mineral profile of wildcrafted Irish Sea Moss in a daily gummy you will actually take. Raw sea moss gel is effective but inconvenient - this is the version that fits real life.",

    keyPhrases: [
      "92 of the 102 minerals your body is made of",
      "Wildcrafted Irish Sea Moss",
      "Whole-food mineral matrix",
      "Gut lining protection",
      "Prebiotic fiber",
      "The mineral your thyroid is waiting for",
      "Blood plasma mineral ratios",
      "70% of immunity lives in the gut"
    ],

    timeline: `
Week 1: Gut comfort and regularity improvements (fiber effect)
Week 2-3: Energy levels, skin hydration, and clarity improvements
Week 3-4: Immune resilience, thyroid function support
Month 2+: Mineral replenishment complete, systemic benefits compound`,

    whoItsFor: [
      "Gut health focused - IBS, bloating, irregular digestion",
      "Immune support - frequent illness, slow recovery",
      "Thyroid health - fatigue, weight management, metabolism",
      "Skin and beauty - glow, elasticity, hydration",
      "Mineral deficiency from poor diet or food intolerances",
      "Plant-based and vegan dieters missing animal-source minerals",
      "Anyone following Dr. Sebi or ancestral nutrition principles"
    ],

    objections: [
      { q: "Why not just eat seaweed or make the raw gel?", a: "You would need to consume a significant and consistent amount of raw sea moss daily to match a standardized dose. The gel requires preparation, refrigeration, and the taste is not for everyone. This is the version that gets taken every day." },
      { q: "Does it taste like the ocean?", a: "No. The gummy format completely masks the marine taste. It tastes like a normal gummy. That is specifically why we made it this way." },
      { q: "How much iodine is in this - is it safe for my thyroid?", a: "The dose is calibrated within safe daily limits. If you have a diagnosed thyroid condition or are on thyroid medication, check with your doctor first - but for most people this is a gentle and appropriate iodine source." },
      { q: "Is it really wildcrafted?", a: "Yes - our sea moss is sourced from Atlantic waters not farmed pools. Wildcrafted means it grows in its natural mineral-rich environment which is why the mineral profile is so complete." },
      { q: "I eat a healthy diet - do I really need this?", a: "Modern soil is significantly depleted compared to even 50 years ago. The food grown in that soil contains a fraction of the minerals it used to. Sea moss fills gaps that diet alone cannot because the starting material is ocean water, not depleted soil." }
    ],

    engagementPrompts: [
      "Type GUT if you deal with bloating, irregularity, or digestive issues",
      "Type THYROID if you struggle with fatigue, weight, or slow metabolism",
      "Type GLOW if skin health and hydration is your main goal",
      "Type 92 if you want me to break down the mineral list",
      "Poll: Main reason you want sea moss - 1 = gut health, 2 = immunity, 3 = skin, 4 = minerals"
    ],

    pricing: "Flash price active now. Link in bio."
  },

  "turmeric": {
    label: "Turmeric Gummies",
    tag: "Anti-inflammatory support",

    science: `
THE INFLAMMATION PROBLEM:
- Chronic low-grade inflammation is behind most modern health issues: joint pain, brain fog, slow recovery, skin issues, digestive problems
- Acute inflammation is healing - chronic inflammation is damage
- Most people are in a state of chronic inflammation from diet, stress, poor sleep, and environmental toxins
- The body cannot recover properly when it is in a constant inflammatory state

WHY TURMERIC IS THE SOLUTION:
- Curcumin is the active compound in turmeric responsible for anti-inflammatory effects
- Inhibits NF-kB - the master switch for inflammatory gene expression
- Inhibits COX-2 enzymes (same mechanism as ibuprofen but without gut damage)
- Powerful antioxidant - neutralizes free radicals that drive cellular inflammation
- Crosses the blood-brain barrier - one of the few natural anti-inflammatories that affects neuroinflammation

THE ABSORPTION PROBLEM (and why most turmeric is useless):
- Raw turmeric powder is only 3-5% curcumin
- Curcumin has very low oral bioavailability on its own - absorbed poorly from the gut
- Most of it passes through unused
- This is why people say "I eat turmeric every day and feel nothing"
- Without a bioavailability enhancer, you are mostly wasting your time

BIOPERINE® - THE GAME CHANGER:
- BioPerine is a patented black pepper extract (piperine - the active compound)
- Inhibits enzymes that break down curcumin in the gut and liver
- Increases curcumin bioavailability by a significant amount
- Slows excretion so curcumin stays in your system long enough to work
- This is not a gimmick - it is a validated pharmaceutical mechanism
- Most cheap turmeric supplements skip BioPerine because it adds cost
- Without it you are eating expensive yellow powder

JOINT HEALTH MECHANISM:
- Reduces synovial membrane inflammation (the lining of your joints)
- Supports cartilage health by reducing inflammatory cytokines
- Reduces joint-specific oxidative stress
- Not a painkiller - addresses the underlying inflammation

BRAIN AND MOOD BENEFITS:
- Neuroinflammation is increasingly linked to depression and anxiety
- Curcumin crosses the blood-brain barrier - rare for most compounds
- Supports BDNF (brain-derived neurotrophic factor) - brain plasticity and growth
- Anti-depressant mechanisms studied in multiple clinical trials
- Cognitive protection against age-related neurodegeneration

POST-WORKOUT RECOVERY:
- Exercise-induced inflammation is necessary for adaptation - excessive is counterproductive
- Curcumin reduces DOMS (delayed onset muscle soreness) without blunting gains
- Speeds recovery time between training sessions
- Athletes who supplement with curcumin consistently show faster recovery markers`,

    diff: "BioPerine-activated curcumin in a gummy format. Most turmeric supplements skip BioPerine because it adds cost. Without it, bioavailability is near-zero. We include it because a supplement that does not absorb is not a supplement.",

    keyPhrases: [
      "BioPerine activates curcumin",
      "Most brands skip this",
      "Anti-inflammatory that actually absorbs",
      "Curcumin without BioPerine is expensive yellow powder",
      "NF-kB inhibition",
      "COX-2 pathway",
      "Crosses the blood-brain barrier",
      "Joint inflammation not joint pain - the real target",
      "The bioavailability problem nobody tells you about"
    ],

    timeline: `
Week 1-2: Reduced stiffness after sleep and prolonged sitting, faster workout recovery
Week 2-3: Joint comfort improvement during movement, reduced post-exercise soreness
Week 4+: Consistent systemic inflammation reduction, cognitive clarity, skin improvements
Note: Benefits compound with consistent use - 90 days is the gold standard window`,

    whoItsFor: [
      "Joint pain or stiffness - especially morning stiffness",
      "Post-workout recovery optimization",
      "Chronic systemic inflammation (skin, gut, brain, joints)",
      "Anyone who has tried turmeric powder or cheap supplements without results",
      "People seeking natural alternatives to daily NSAIDs (ibuprofen, aspirin)",
      "Older adults wanting to protect joint health proactively",
      "Brain fog sufferers - neuroinflammation connection"
    ],

    objections: [
      { q: "Can I just use turmeric from my kitchen?", a: "Kitchen turmeric is 3-5% curcumin and has near-zero absorption without black pepper. Even with black pepper in your cooking, the dose is inconsistent and the BioPerine ratio is not calibrated. This is standardized curcumin extract plus pharmaceutical-grade BioPerine - completely different." },
      { q: "I drink golden milk every day and still have joint pain", a: "Golden milk has the right idea but the wrong dose and the wrong delivery. The amount of curcumin in a golden milk latte is too low to reach therapeutic levels, and without standardized BioPerine it barely absorbs. This is the version that actually works at the mechanism level." },
      { q: "Is this just for joint pain?", a: "Joint pain is the most visible symptom but chronic inflammation affects everything - your brain, your gut, your skin, your mood, your recovery. Curcumin works systemically. Joint relief is often the first thing people notice but rarely the only thing." },
      { q: "How is this different from ibuprofen?", a: "Ibuprofen blocks COX enzymes aggressively and damages the gut lining with regular use. Curcumin works through the same pathway more gently and also addresses the upstream cause (NF-kB inflammation signaling) rather than just blocking the output. Long-term, one is protective and one is damaging." },
      { q: "How long does it take to work?", a: "Most people notice recovery and stiffness improvements in 1-2 weeks. Full anti-inflammatory benefit at the systemic level takes 4-6 weeks of consistent dosing. Curcumin builds in your system - it is not a one-dose fix." }
    ],

    engagementPrompts: [
      "Type JOINT if you have stiffness or soreness that will not go away",
      "Type TRIED if you have taken turmeric before and felt absolutely nothing",
      "Type IBUPROFEN if you take anti-inflammatories regularly and want a long-term alternative",
      "Type RECOVERY if workout soreness is slowing you down",
      "Poll: Your inflammation symptom - 1 = joints, 2 = post-workout, 3 = brain fog, 4 = gut"
    ],

    pricing: "Flash price active now. Link in bio."
  }
};

// ─── EDUTAINMENT BENCHMARK + LIVE FRAMEWORK ──────────────────────────────────
const BENCHMARK = `
ROOT LABS EDUTAINMENT LIVE FRAMEWORK

CORE PHILOSOPHY:
- Entertainment-first, education second, product third
- The goal is to make viewers FEEL something before you sell them something
- Delayed product reveals outperform immediate product pitches every time
- The creator should feel like a knowledgeable friend who happened to find something that works - not a salesperson
- Every section should be watchable even by people who never buy

SCRIPT ARCHITECTURE:

HOOK (first 30 seconds - make or break):
- Open with the SYMPTOM not the product ("Tired but wired?" not "I have this magnesium gummy")
- Call out the exact audience who needs this - be specific
- Name something counterintuitive ("your magnesium might be going right through you")
- Promise a revelation - something they did not know before
- Do NOT mention the product name in the hook
- Hook variants: problem-led, curiosity-led, personal story-led

VISUAL HOOK (first 5 seconds before you speak):
- Physical action with the product or proof before any words
- Sleep tracker screenshot held up to camera
- Lab test or label comparison
- Demo setup visible in frame
- The eye needs a reason to stay before the ear does

THE PROBLEM SECTION (education layer 1 - 2-3 minutes):
- Make the audience feel SEEN - describe their exact situation
- Give the scientific reason WHY they are struggling
- Use a memorable analogy that makes the mechanism instantly understandable
- Examples: "1-lane vs 4-lane highway" for absorption, "oil and water" for liposomal delivery
- The audience should be nodding along and thinking "this explains everything"
- Engagement prompt here: Type TIRED / Type TRIED / Type YES

THE SCIENCE REVEAL (education layer 2 - mechanism):
- This is the edutainment core - make learning feel like a discovery
- Explain the mechanism the product uses to solve the problem
- Use visual aids if possible - show the label, do the demo
- Break it down so a 12-year-old could understand it
- Then build it back up so a biochemist would respect it
- Key: the science IS the sell - you are not pitching, you are teaching

SOCIAL PROOF LAYER:
- Lead with platform credibility ("top-rated on TikTok Shop")
- Use specific outcome language from real results ("sleeping through the night for the first time in years")
- Sleep tracker screenshots (before/after - show 3 layers: overall score, deep sleep, HRV)
- Community language - "people like you are seeing this"
- Never vague - "it worked for me" is weaker than "my sleep score went from 62 to 84 in 2 weeks"

ENGAGEMENT MECHANICS (every 2-3 minutes):
- Type prompts that segment the audience ("Type 1 if X, Type 2 if Y")
- Mirror their comments back - read them out and validate
- Poll questions - gets comment volume up which signals TikTok algorithm
- Ask questions that make them reveal their problem ("comment your sleep score if you track it")

OBJECTION HANDLING:
- Address objections BEFORE they type them
- Validate first ("that is a really fair question"), reframe second
- Keep answers to 2-3 sentences maximum
- Use the same analogy language you already established
- Never defensive - if you get defensive it means they hit a weak point in the product

FLASH SALE CTA:
- Give a specific believable reason for the discount ("we do this for live viewers only")
- Exact price + exact regular price + exact time window
- Price anchor = compare to daily coffee spend, not other supplements
- Ask for a signal ("Type IN CART if you are checking out - I will hold the price")
- Urgency through specificity not volume - do not shout, be specific

CLOSING:
- Paint two futures - with vs without the product, specifically
- Reinforce the community identity - "the people in this comment section who are actually taking this seriously"
- Final guarantee mention - 30 days, no questions asked
- End with warmth not pressure

TONE PRINCIPLES:
- Speak TO them not AT them
- Use "you might have noticed" not "you definitely have"
- Share your own experience first, then generalize
- Humor is allowed - self-deprecating beats product-hyping
- Slow down on the mechanism - that is where trust is built
- Speed up on the CTA - urgency needs momentum

CONTENT GUARDRAILS - never break:
- No shame-based hooks ("you're not fat, that's just cortisol" - overdone and harmful)
- No specific percentage claims for benefits
- No retail or store price comparisons (product is not sold in stores)
- No medical claims - use "supports" not "treats" or "cures"
- Product is called by its full name externally - never internal shorthand

KEY PHRASES THAT CONVERT:
"Tired but wired" / "10 forms, 4 pathways" / "No saturation no bottlenecks" /
"You are not managing - you are fixing" / "Less than your morning coffee" /
"Your magnesium is going right through you" / "The absorption problem nobody talks about" /
"BioPerine is what activates curcumin - most brands skip this" /
"Direct to follicle - no gut required" / "92 of the 102 minerals your body is made of"
`;

// ─── SCRAPE ─────────────────────────────────────────────────────────────────
async function runApify(actorId, input, apiKey, maxWaitMs = 60000) {
  const runRes = await axios.post(
    `https://api.apify.com/v2/acts/${actorId}/runs`,
    input,
    { headers: { "Content-Type": "application/json" }, params: { token: apiKey }, timeout: 15000 }
  );
  const runId = runRes.data.data.id;
  const datasetId = runRes.data.data.defaultDatasetId;
  console.log(`[Apify] ${actorId} started - run: ${runId}`);

  const start = Date.now();
  let status = "RUNNING";
  while (status === "RUNNING" && Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, 5000));
    const s = await axios.get(
      `https://api.apify.com/v2/actor-runs/${runId}`,
      { params: { token: apiKey }, timeout: 10000 }
    );
    status = s.data.data.status;
    console.log(`[Apify] ${actorId} status: ${status} (${Math.round((Date.now()-start)/1000)}s)`);
  }
  if (status !== "SUCCEEDED") throw new Error(`${actorId} ended with status: ${status}`);

  const res = await axios.get(
    `https://api.apify.com/v2/datasets/${datasetId}/items`,
    { params: { token: apiKey, limit: 30 }, timeout: 10000 }
  );
  const items = res.data || [];
  console.log(`[Apify] ${actorId} returned ${items.length} items`);
  return items;
}

async function scrapeProfile(handle) {
  const clean = handle.replace("@", "").trim();
  const APIFY_KEY = process.env.APIFY_API_KEY;

  if (!APIFY_KEY) {
    console.log("[Scrape] No Apify key - using fallback");
    return { handle: clean, displayName: clean, bio: "", posts: [], transcripts: [], source: "fallback" };
  }

  try {
    // ── STEP 1: Profile scraper ──────────────────────────────────────
    console.log(`[Scrape] Step 1: scraping @${clean} profile`);
    const profileItems = await runApify(
      "clockworks~tiktok-profile-scraper",
      { profiles: [clean], resultsPerPage: 20, profileScrapeSections: ["videos"] },
      APIFY_KEY, 60000
    );

    if (!profileItems.length) throw new Error("Profile scraper returned no data");

    // Log first item keys so we know what fields are available
    console.log("[Scrape] First item keys:", Object.keys(profileItems[0]).join(", "));

    const first = profileItems[0];
    const displayName = first.authorMeta?.name || first.authorMeta?.nickName || first.author?.nickname || clean;
    const bio = first.authorMeta?.signature || first.author?.signature || "";
    const followers = first.authorMeta?.fans || first.authorMeta?.followers || first.author?.followerCount || 0;

    // Extract posts - try all known field names for captions and video URLs
    const posts = profileItems
      .map(item => ({
        caption: item.text || item.desc || item.description || "",
        videoUrl: item.webVideoUrl || item.videoUrl || item.video?.playAddr || item.videoMeta?.downloadAddr || null,
        likes: item.diggCount || item.likeCount || item.stats?.diggCount || 0,
        comments: item.commentCount || item.stats?.commentCount || 0,
        shares: item.shareCount || item.stats?.shareCount || 0
      }))
      .filter(p => p.caption)
      .sort((a, b) => (b.likes + b.comments * 3) - (a.likes + a.comments * 3));

    console.log(`[Scrape] Got ${posts.length} posts, ${posts.filter(p => p.videoUrl).length} with video URLs`);
    if (posts.length > 0) console.log("[Scrape] Sample caption:", posts[0].caption.slice(0, 100));

    // ── STEP 2: Transcripts via clockworks scraper with transcript option ──
    const videoUrls = posts.filter(p => p.videoUrl).slice(0, 5).map(p => p.videoUrl);
    let transcripts = [];

    if (videoUrls.length > 0) {
      console.log(`[Scrape] Step 2: fetching transcripts for ${videoUrls.length} videos via Whisper`);
      // Run transcript scraper for each video URL in parallel (max 3 to control cost)
      const urlsToTranscribe = videoUrls.slice(0, 3);
      const transcriptPromises = urlsToTranscribe.map(async (url) => {
        try {
          const items = await runApify(
            "linen_snack~tiktok-video-transcirpt-using-openai-whisper-api",
            {
              tiktokVideoUrl: url,
              openaiApiKey: process.env.OPENAI_API_KEY,
              taskType: "transcription",
              transcriptionModel: "whisper-1",
              responseFormat: "json"
            },
            APIFY_KEY, 90000
          );
          const item = items[0];
          if (!item) return null;
          const text = item.transcription || item.transcript || item.text || "";
          if (text.length < 20) return null;
          console.log(`[Scrape] Transcript for ${url.slice(-30)}: ${text.slice(0, 80)}...`);
          return { videoUrl: url, transcript: text };
        } catch (err) {
          console.warn(`[Scrape] Transcript failed for ${url.slice(-30)}:`, err.message);
          return null;
        }
      });
      const results = await Promise.all(transcriptPromises);
      transcripts = results.filter(Boolean);
      console.log(`[Scrape] Got ${transcripts.length} transcripts`);
    }

    return {
      handle: clean,
      displayName,
      bio,
      followers,
      posts: posts.slice(0, 15),
      transcripts,
      source: "apify"
    };

  } catch (err) {
    console.error("[Scrape] Failed:", err.message);
    return { handle: clean, displayName: clean, bio: "", posts: [], transcripts: [], source: "fallback" };
  }
}

// ─── GENERATE ───────────────────────────────────────────────────────────────
async function generateScript({ handle, sku, desc, profile }) {
  const product = SKUS[sku];
  if (!product) throw new Error("Unknown SKU: " + sku);

  // ── Build rich creator context from Apify profile + transcripts ──
  const postSample = (profile?.posts || [])
    .slice(0, 10)
    .map((p, i) => `Caption ${i+1}: "${p.caption}" (${p.likes} likes, ${p.comments} comments)`)
    .join("\n");

  const transcriptSample = (profile?.transcripts || [])
    .slice(0, 4)
    .map((t, i) => `Video ${i+1} transcript: "${t.transcript.slice(0, 400)}${t.transcript.length > 400 ? "..." : ""}"`)
    .join("\n\n");

  // Log what we have so we can debug
  console.log(`[Generate] Creator context - source: ${profile?.source}, posts: ${(profile?.posts||[]).length}, transcripts: ${(profile?.transcripts||[]).length}, desc: ${desc}`);

  const creatorContext = [
    `TikTok handle: @${handle}`,
    profile?.displayName && profile.displayName !== handle ? `Display name: ${profile.displayName}` : null,
    profile?.bio ? `Bio: "${profile.bio}"` : null,
    profile?.followers ? `Followers: ${Number(profile.followers).toLocaleString()}` : null,
    postSample ? `\nRECENT CAPTIONS (analyze these for tone, vocabulary, humor, and how they communicate):\n${postSample}` : null,
    transcriptSample ? `\nVIDEO TRANSCRIPTS (this is their exact spoken voice - replicate it precisely):\n${transcriptSample}` : null,
    desc && desc !== "not provided" ? `\nCreator self-description: ${desc}` : null,
    !postSample && !transcriptSample && !desc ? `\nNo profile data available - infer a relatable, conversational tone from the handle name. Write as if they are a health-conscious everyday person.` : null
  ].filter(Boolean).join("\n");

  const systemPrompt = `You are an expert TikTok Live script writer for Root Labs, a premium wellness supplement brand. Your job is to create richly educational, entertainment-first live scripts that teach viewers something real before selling them anything.

PHILOSOPHY: The creator is a knowledgeable friend who discovered something that works - not a salesperson. Every section should be watchable even by people who never buy. Education builds trust. Trust builds conversion.

${BENCHMARK}

DEEP PRODUCT KNOWLEDGE - use this to make scripts genuinely educational:
${product.science}

PRODUCT IDENTITY:
Full name: ${product.label}
Core promise: ${product.tag}
Key differentiator: ${product.diff}
Phrases to weave in naturally: ${product.keyPhrases.join(", ")}
Results timeline: ${product.timeline}
Target audience: ${product.whoItsFor.join(", ")}
Engagement prompts bank: ${product.engagementPrompts.join(" | ")}
${product.demoScript ? "Demo idea: " + product.demoScript : ""}
Pricing: ${product.pricing}

CREATOR PROFILE:
${creatorContext}

SCRIPT REQUIREMENTS:
- Hooks must NOT mention the product name - open with the symptom or problem
- Positioning must explain the MECHANISM not just the benefit - make them understand WHY it works
- Social proof must be specific - sleep tracker scores, specific outcomes, not vague "it works"
- Objection answers must be 2-3 sentences max, conversational, using the same analogy language
- CTA must have a specific believable reason for the discount and a specific time window
- Closing must contrast two futures and end with community identity not just discount
- Every section must sound like THIS CREATOR specifically - use their vocabulary and rhythm from transcripts

Return ONLY valid JSON, zero extra text, no markdown:
{
  "hook": {
    "v1": "problem-led hook - symptom first, no product mention",
    "v2": "curiosity-led hook - counterintuitive insight that makes them stop scrolling",
    "v3": "personal story-led hook - creator shares their own experience first"
  },
  "visualHook": "specific physical action to do on camera in first 5 seconds before speaking",
  "positioning": "3 rich paragraphs: paragraph 1 = the problem they have been dealing with, paragraph 2 = why everything they tried before failed (mechanism), paragraph 3 = what makes this different (the science)",
  "socialProof": "specific proof section - platform ranking, real outcome language, tracker scores if relevant, community validation",
  "engagementPrompts": ["prompt 1 - audience segmentation", "prompt 2 - reveals their problem", "prompt 3 - gets them invested in the answer"],
  "objections": [
    {"q": "most common objection verbatim as viewer would type it", "a": "conversational answer using established analogy language"},
    {"q": "second objection", "a": "answer"},
    {"q": "third objection", "a": "answer"}
  ],
  "cta": "flash sale CTA with specific price, specific time window, specific reason for discount, and signal ask",
  "closing": "closing that paints two futures and ends with community identity"
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

// Debug endpoint - see raw Apify data for any handle
app.get("/api/debug/:handle", async (req, res) => {
  try {
    const profile = await scrapeProfile(req.params.handle);
    res.json({
      source: profile.source,
      displayName: profile.displayName,
      bio: profile.bio,
      followers: profile.followers,
      postCount: profile.posts.length,
      transcriptCount: profile.transcripts.length,
      sampleCaptions: profile.posts.slice(0, 3).map(p => p.caption),
      sampleTranscripts: profile.transcripts.slice(0, 2).map(t => t.transcript.slice(0, 200)),
      hasVideoUrls: profile.posts.filter(p => p.videoUrl).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
