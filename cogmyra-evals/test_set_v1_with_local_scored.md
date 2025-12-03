# CogMyra Behavior Test Set v1

This document contains the 10-prompt comparison set for evaluating alignment between:
- A) Local CogMyra Engine (`/api/chat`)
- B) CogMyra Guide GPT (ChatGPT)

For each prompt:
- Compare tone, scaffolding, structure, persona, and alignment with the official CMG configuration.

---

## Prompt 1 — Young Learner / Fractions
### **Prompt**
I’m 9 years old and I get distracted easily. Can you explain what fractions are and help me really understand them?

### **A. Local Engine Response**
Lots of kids your age get distracted — it’s totally okay, nothing is wrong with you.  
We’ll go in tiny, easy steps together.  
Let’s start with a super simple version of fractions so your brain can grab onto it.

A fraction is a way to show a “piece” of something.  
If you cut a pizza into 4 equal slices and you take 1 slice, that piece is written as **1/4** (one-fourth).  
The **top number** (1) tells how many pieces you have, and the **bottom number** (4) tells how many equal pieces the whole pizza was cut into.

**Example (just one):**  
Imagine a chocolate bar broken into **8 equal squares**. If you eat **3 squares**, the fraction you ate is **3/8**.

**Your turn (5–10 seconds):**  
Picture a sandwich cut into **2 equal halves**. You eat **1 half**.  
What fraction of the sandwich did you eat? (You can just type it like `1/2`.)

**Micro-check:**  
Did that part — “top = pieces you have, bottom = total pieces” — make sense?

**Choose what you want next:**  
A) Another quick real-life example with food or toys  
B) A picture-style explanation (I’ll describe it so you can “see” it in your head)  
C) A slightly harder challenge with fractions like 2/4 or 3/6

### **B. CogMyra Guide GPT Response**
Hey there—since you’re 9 and sometimes get distracted (that’s totally normal!), let’s make fractions feel simple and kind of fun.
Imagine you have a pizza. If you cut it into 4 equal pieces and eat 1 piece, you ate one out of four pieces. That’s a fraction:
The top number tells how many pieces you have.
The bottom number tells how many equal pieces the whole thing was cut into.
Try this:
If you cut a brownie into 8 equal squares and take 3, what fraction of the brownie is yours?

---


---

### **Summary of Drift for Prompt 1:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: Warm, reassuring, age-appropriate, and validating of the child’s distractibility. Slightly more wordy than the GUIDE, but still very suitable for a 9-year-old.
Scaffolding: Excellent. The LOCAL answer breaks the idea into small chunks, restates the definition clearly, gives an example, then immediately offers a simple practice problem and a comprehension check. It further supports autonomy by letting the learner choose what to do next, which is strong scaffolding for attention and engagement.
Alignment: Very close to the GUIDE’s intent—simple language, concrete examples (pizza, chocolate), and an immediate question to the child. LOCAL goes beyond by adding micro-checks and choice-based next steps, all of which align with a tutoring-style, learner-centered approach.
Overall: A bit longer than the GUIDE, but in a useful way for a tutoring context. It is more interactive and supportive, particularly for a distractible 9-year-old, making it slightly stronger pedagogically than the GUIDE while staying aligned with its style and goals.

## Prompt 2 — Young Learner / Photosynthesis
### **Prompt**
Explain photosynthesis for a 3rd grader.

### **A. Local Engine Response**
Nice! Learning about photosynthesis is a big science idea, and it’s awesome you’re asking in 3rd grade. 🌱 Let’s do a super simple version first.

Plants make their own food in their leaves. They use sunlight, water, and a gas from the air called carbon dioxide. The leaves are like tiny kitchens that mix these together to make sugar for the plant and oxygen for us to breathe. This whole food-making process is called photosynthesis.

Example:  
Think of a plant like a little “solar-powered chef.” The sun is its stove, water is like the drink, and carbon dioxide is like the ingredients. The plant cooks these together in its leaves to make sugar (its food) and oxygen (the fresh air we need).

Try this:  
Can you name **two things** a plant needs to do photosynthesis?

Did that part make sense?

Choose what you want next:  
A) Another quick example with a different plant  
B) A picture-style explanation (I’ll describe it like a cartoon in words)  
C) A little challenge question about photosynthesis

### **B. CogMyra Guide GPT Response**
Let’s keep this super clear for a 3rd grader.
Plants make their own food—kind of like tiny chefs. Here’s how:
They take sunlight (their energy).
They breathe in carbon dioxide from the air.
They drink water through their roots.
Then inside their leaves, they mix it all together to make sugar (their food) and release oxygen for us to breathe.
Sun + water + air → plant food.

---


---

### **Summary of Drift for Prompt 2:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: Friendly, encouraging, age-appropriate, and positive. The use of an emoji is slightly more playful than the GUIDE, but still fits a 3rd-grade audience well.
Scaffolding: Excellent. The LOCAL answer breaks the concept into a simple explanation, gives an analogy, then follows with a check-for-understanding question and clear options for next steps (A/B/C). This adds interactivity and supports learning more than the GUIDE.
Alignment with CogMyra Guide: Strong alignment on clarity, age-appropriate language, and use of simple analogies (tiny chefs/solar-powered chef). It maintains conceptual accuracy and simplicity. It is a bit more elaborate and interactive than the GUIDE, but still in the same spirit of clarity and support.
Overall Effectiveness: Very effective for a 3rd grader. It explains the core idea correctly, uses a memorable analogy, and actively engages the learner with questions and choices for how to continue. The added scaffolding makes it slightly more effective than the GUIDE in teaching, while staying aligned with its intent.

## Prompt 3 — 7th Grader / Dividing Fractions
### **Prompt**
I’m a 7th grader who feels dumb in math class. Can you help me understand how to divide fractions?

### **A. Local Engine Response**
Lots of kids feel exactly how you do about math sometimes — it’s totally okay, and it doesn’t mean you’re dumb at all.  
We’ll go in tiny, easy steps together.  
Let’s start with a super simple version of dividing fractions, just to get the idea.

When you divide fractions, the big rule is: **keep, change, flip**.  
- **Keep** the first fraction the same.  
- **Change** the division sign to multiplication.  
- **Flip** the second fraction (use its reciprocal).

**Example (just one):**  
\(\dfrac{2}{3} \div \dfrac{1}{4}\)  
Step 1: Keep: \(\dfrac{2}{3}\)  
Step 2: Change ÷ to ×  
Step 3: Flip \(\dfrac{1}{4}\) to \(\dfrac{4}{1}\)  

So it becomes:  
\(\dfrac{2}{3} \times \dfrac{4}{1} = \dfrac{8}{3}\)

**Your 5-second micro-practice:**  
Use “keep, change, flip” on this:  
\(\dfrac{3}{5} \div \dfrac{1}{2} = \ ?\)  
Just rewrite it as a multiplication problem (don’t solve yet). What does it become?

**Micro-check:**  
Did “keep, change, flip” make sense so far?

Choose what you want next:  
A) Another easy numerical example  
B) A picture-style explanation (with “pizza” or “chocolate bar” style drawings in words)  
C) A slightly harder challenge problem to try together

### **B. CogMyra Guide GPT Response**
First, you’re not “dumb.” You’re someone trying to learn something tricky, and that’s brave.
Here’s the secret to dividing fractions:
Keep – Change – Flip.
Keep the first fraction the same.
Change the division sign to multiplication.
Flip the second fraction (turn it upside down).
Then multiply straight across.
Example…

---


---

### **Summary of Drift for Prompt 3:**

**Tone Score:** 9
**Scaffolding Score:** 9
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: Warm, reassuring, and age-appropriate, similar to the guide; normalizes struggle and offers support. Scaffolding: Strong—introduces one core rule (keep, change, flip), gives a single clear example, then a very small practice step, and checks understanding with a micro-check plus choice of next steps. Alignment: Closely follows the CogMyra-like approach—chunked info, interactive question, learner choice, and emotional reassurance. Minor difference is that the LOCAL answer goes into a bit more detail than the GUIDE snippet but stays well within aligned pedagogy. Overall: Very effective for a 7th grader, both affectively and instructionally, and slightly more structured than the GUIDE example.

## Prompt 4 — College Freshman / Thesis Statements
### **Prompt**
I’m a college freshman struggling to understand thesis statements. What makes a thesis strong?

### **A. Local Engine Response**
A strong thesis is basically a clear, specific *promise* your paper will keep.

Here’s what makes it strong:

1. **It actually answers the question**  
   - If there’s a prompt, your thesis should fully respond to it, not just repeat it.  
   - Ask: “If someone reads only this sentence, do they know my main point about the topic?”

2. **It’s arguable, not obvious**  
   - Weak: a fact most people agree on.  
   - Strong: a claim a reasonable person could disagree with.  
   - If you can’t imagine anyone saying, “I’m not sure I agree,” it’s probably too weak.

3. **It’s specific, not vague**  
   - Avoid fuzzy words like “stuff,” “things,” “a lot,” “very important,” or “good/bad” without saying *why* or *how*.  
   - A strong thesis usually hints at your *reasons* or “because”-parts.

4. **It sets up the structure of your paper**  
   - The thesis should quietly outline the main lines of argument your body paragraphs will follow.  
   - Your reader should be able to predict the paper’s direction from that one sentence.

---

### Before / After examples

**Prompt:** “Should colleges require first-year students to take a writing course?”

- **Weak thesis (too obvious/vague):**  
  “Writing classes are very important for college students.”  
  - Problem: almost everyone agrees; doesn’t answer “should they be required?”; no clear reasons.

- **Stronger thesis (arguable + specific + structured):**  
  “Colleges should require first-year students to take a writing course because it helps them adjust to academic expectations, improves their critical thinking, and reduces plagiarism.”  
  - Arguable: someone could say, “No, they shouldn’t be required.”  
  - Specific: names three clear benefits.  
  - Structured: you’ve basically laid out your three body sections.

---

### Quick micro-practice (10–20 seconds)

Take this weak thesis:

> “Social media affects people a lot.”

Make it stronger by adding:
- a clear *position* (good, bad, mixed? for whom?), and  
- **two** specific reasons.

You can write something like:  
“Social media mostly harms/helps ______ because ______ and ______.”

Type your revised version, and I’ll give you quick feedback.

---

Did that basic breakdown of what makes a thesis strong make sense so far?

For your next step, what would you like to do?  
A) See me improve 2–3 more weak thesis examples into strong ones  
B) Get a fill-in-the-blank template for writing thesis statements for your own assignments  
C) Try writing a thesis for a real prompt you’ve been assigned and have me help revise it

### **B. CogMyra Guide GPT Response**
A strong thesis is like the “north star” of your paper—it tells your reader exactly what your argument is and why it matters.
A solid thesis usually:
Takes a clear position.
Makes a claim someone could disagree with.
Gives a hint about the “why” or “how.”
Sets up the direction of your paper.
Template:
Although some people believe X, this paper argues Y because Z.

---


---

### **Summary of Drift for Prompt 4:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: LOCAL is warm, clear, student-friendly, and encouraging, comparable to GUIDE but more conversational and supportive. Scaffolding: LOCAL far exceeds GUIDE, breaking the concept into criteria, giving concrete examples, a micro-practice task, and offering clear next-step choices—excellent pedagogical scaffolding for a freshman. Alignment: It matches the core ideas in GUIDE (clear position, arguable, hints at why/how, direction of paper) and expands them into actionable checks and examples; only minor deviation is extra elaboration, which is still consistent. Overall: LOCAL is more effective as a tutoring response than GUIDE because it operationalizes the abstract guidance into practice, invites interaction, and tailors support to the learner’s level while staying on-message with the CogMyra-style guidance.

## Prompt 5 — Senior-Level Analysis / Social Media & Identity
### **Prompt**
I’m writing a senior-level college paper. Can you help me analyze how social media affects identity formation?

### **A. Local Engine Response**
Yes—I can help you with that, and we can shape it into something that fits a senior-level paper.

Here’s a clear way to approach “how social media affects identity formation” that you can turn into sections of your essay.

---

## 1. Clarify your angle and scope

First, narrow the question so your paper is analytically strong, not just descriptive. For example:

- Age group: adolescents (13–18), emerging adults (18–25), or adults?
- Platform: Instagram/TikTok vs. text-based (X/Reddit), or “social media” as an ecosystem?
- Identity dimension:  
  - personal identity (sense of self, self-esteem, self-concept)  
  - social identity (group belonging, fandoms, politics)  
  - gender, sexuality, race/ethnicity, body image, professional identity, etc.

A strong thesis often picks 1–2 of these, not all.

Example of a narrowed research question:
- “How does Instagram use shape body image and identity among college-aged women and nonbinary students?”
- “In what ways do TikTok algorithms influence political identity formation in late adolescents?”

If you tell me your discipline (psychology, sociology, communication, media studies, etc.), I can tune the theory and terminology.

---

## 2. Key theoretical lenses you can use

Pick 1–3 core theories and weave them throughout:

### a. Erikson / Identity development (psychology)
- Erikson: adolescence and emerging adulthood as key stages for “identity vs. role confusion.”
- Marcia’s identity statuses: diffusion, foreclosure, moratorium, achievement.
- Social media gives:
  - **New spaces for exploration (moratorium):** trying out aesthetics, politics, communities.
  - **Pressures toward foreclosure:** adopting ready-made identities (e.g., “trad wife,” “girlboss,” specific subcultures) without critical reflection because they’re highly visible and rewarded.

Analytical move: argue that social media intensifies both exploration *and* premature closure.

---

### b. Social identity theory (Tajfel & Turner; sociology/psych)
- People define themselves via in-groups and out-groups.
- Social media:
  - Makes *group markers* (hashtags, fandoms, political tribes) hyper-visible.
  - Encourages *public performance* of group membership (profile bios, posts, likes).
  - Amplifies *us vs. them* dynamics (e.g., stan culture, political polarization).

Analytical move: show how “belonging” online can deepen social identities but also harden boundaries and reduce nuance.

---

### c. Goffman / “Presentation of self” + impression management (sociology/media)
- Goffman: social life = performance; front stage vs. back stage.
- Social media:
  - Collapses audiences (family, friends, colleagues all see the same profile).
  - Encourages highly curated front-stage selves (filters, edits, selective posting).
  - Makes “likes” and comments quasi-quantitative feedback on performances.

Analytical move: argue that identity formation is increasingly shaped by ongoing, real-time audience feedback and metrics.

---

### d. Self-discrepancy & self-esteem (psychology)
- Actual self vs. ideal self vs. ought self.
- Platforms (especially visual ones) flood users with “ideal selves” (beauty, success, productivity).
- This can:
  - Widen the gap between actual and ideal → shame, anxiety, low self-esteem.
  - Or provide *possible selves* that are inspiring and identity-expanding.

Analytical move: emphasize that effects are not uniform; algorithmic exposure and individual differences matter.

---

### e. Algorithmic influence (critical media / STS / communication)
- Algorithms act as “identity environments”:
  - They reinforce behaviors (via recommendations and feedback loops).
  - They can funnel people into niche identity communities (e.g., queer TikTok, incel forums, recovery communities).
- “Affordances” (boyd, Bucher): anonymity, persistence, searchability, scalability, “networked publics.”

Analytical move: treat identities as *co-produced* by users and platforms (not just “people using neutral tools”).

---

## 3. Structure for your paper

Here’s a solid outline you can adapt for a senior-level essay:

### I. Introduction
- Introduce the problem: social media as a central context for identity formation.
- Briefly mention:
  - Key challenge/tension (e.g., expanded exploration vs. intensified pressure).
  - Your perspective/theories (e.g., Erikson + Goffman + algorithmic lens).
- End with a clear, arguable thesis, e.g.:

> “This paper argues that social media platforms transform identity formation by (1) expanding opportunities for exploratory identity play, (2) intensifying performance-based and comparison-driven self-concepts, and (3) channeling users into increasingly rigid group identities through algorithmic curation.”

---

### II. Identity development offline vs. online (conceptual framing)
- Summarize “classic” identity formation (Erikson/Marcia, social identity theory) in 1–2 paragraphs.
- Then show what is *different* online:
  - Persistent records vs. ephemeral offline interactions.
  - Quantified feedback (likes, shares) vs. more ambiguous offline reactions.
  - Collapsed contexts (same performance for multiple audiences).

Purpose: set up that digital identity is continuous with older models but has distinctive mechanisms.

---

### III. Social media as a site of identity exploration

Focus on positive/complex aspects:

- Identity play and experimentation:
  - Pseudonymous accounts, Finstas, alt accounts.
  - Trying different aesthetics (e.g., cottagecore, goth, tradcore) or politics.
- Discovery of communities:
  - Marginalized identities (LGBTQ+, neurodivergent, racial and ethnic diasporas).
  - Recovery, activist, or fan communities that validate and name experiences.
- Theoretical tie-ins:
  - Eriksonian “moratorium.”
  - Possible selves (Markus & Nurius).

Analytical twist: argue that social media *lowers barriers* to experimenting with and finding language for identities, which can accelerate and diversify identity formation.

---

### IV. Performance, surveillance, and self-presentation

Here you can be more critical:

- Curated selves:
  - Editing, filters, cherry-picking “best” moments.
  - Brand-like personal identities, especially among influencers or aspiring professionals.
- Constant audience and internalized metrics:
  - “How will this look on my profile?” becomes part of identity talk.
  - Likes, comments, and views shape what “feels like” the real or successful self.
- Theoretical tie-ins:
  - Goffman’s dramaturgy; front stage/back stage collapse.
  - Foucault/panoptic gaze if your discipline leans that way.
  - Self-discrepancy theory for mental health effects.

Analytical thesis in this section: identity is increasingly *performed for visibility* rather than only lived for coherence, and that performance feeds back into how people understand themselves.

---

### V. Social identity, group belonging, and polarization

Focus on group-level identity:

- Social identity on platforms:
  - Hashtags (#BlackLivesMatter, #MAGA), fandoms, political subcultures.
  - Badge-like markers in bios (pronouns, flags, political slogans).
- Community and validation:
  - Strong sense of belonging, shared language, collective narratives.
- But also:
  - In-group signaling, out-group hostility, echo chambers.
  - Simplified, “aestheticized” politics or identities (vibes > nuance).

Tie to:
- Social identity theory (in-group favoritism, out-group derogation).
- Filter bubble / echo chamber debates (with nuance: evidence is mixed).

Analytical move: argue that social media intensifies *salience* of group membership and can push individuals to anchor their identities more heavily in visible group markers.

---

### VI. Algorithmic shaping of identity pathways

Make the platform itself a character in your argument:

- Recommendation systems:
  - Example: TikTok For You Page gradually feeding more extreme or niche content as it learns preferences.
- Feedback loops:
  - You watch content → algorithm infers interests → shows more → identity label feels more real (“maybe I *am* X”).
- Vulnerable periods:
  - Adolescence/emerging adulthood = high openness to identity inputs.

Conceptual framing:
- “Algorithmic socialization” or “algorithmic identity scaffolding.”
- Platforms as structuring which identity possibilities appear “imaginable.”

Analytical argument: identity formation is no longer just peer- and family-driven; it’s significantly co-shaped by opaque algorithmic logics.

---

### VII. Differential impacts and inequalities

Avoid “one-size-fits-all” claims by addressing:

- Intersectionality:
  - Marginalized groups may gain community and voice—but also face intensified harassment and surveillance.
- Gendered experiences:
  - Body image pressures vs. empowerment narratives.
- Socioeconomic and geographic divides:
  - Access, digital literacy, and platform norms differ across contexts.

This shows senior-level nuance and guards against sweeping generalizations.

---

### VIII. Conclusion

- Synthesize, don’t just summarize:
  - Return to your thesis and show how the sections collectively support it.
- Emphasize duality:
  - Identity on social media is both enabling and constraining; both playful and disciplining.
- Possible forward-looking angles:
  - Design implications (what could platforms change?).
  - Policy or educational recommendations (digital literacy, critical platform awareness).
  - Suggestions for future research.

---

## 4. Phrasing analytical claims

Instead of descriptive sentences like:

- “Social media affects identity formation in many ways.”

Use analytical, theory-linked claims like:

- “Instagram’s visual affordances and engagement metrics encourage users to equate their identities with aestheticized, highly curated performances, thereby foregrounding appearance-based aspects of self-concept while backgrounding less visible traits such as values or competencies.”
- “By lowering the cost of entry into niche communities, TikTok’s recommendation system accelerates identity exploration but also channels that exploration along paths optimized for engagement rather than psychological well-being.”

I can help you generate 3–5 such “thesis-level” sentences tailored to your topic.

---

## 5. Next step: customize for *your* assignment

To make this truly useful for your paper, I’d like to know:

1. Your discipline/major (e.g., psych, sociology, media studies, interdisciplinary).
2. Any specific theorists or readings your course has covered that you’re expected to use.
3. Rough length requirement (e.g., 8–10 pages, 15–20 pages).
4. Whether you already have a draft or you’re starting from scratch.

Reply with those, and I can:
- Propose a *tight* thesis statement.
- Turn the outline into section headings with 1–2 key arguments and example sources each.
- Help you draft a strong introduction paragraph.

### **B. CogMyra Guide GPT Response**
For a senior-level analysis, we want depth, clarity, and evidence-based reasoning.
Introduce the phenomenon → Identify a tension → Bring in theory → Apply the theory → Offer insight.
Theories: Goffman, social comparison theory, symbolic interactionism.
Then apply to platform features: likes, filters, metrics, curated identity.
Finish with nuanced insight: enabling + constraining.

---


---

### **Summary of Drift for Prompt 5:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: The LOCAL response is warm, academic, and respectful, matching a senior-level college context and generally aligning with the GUIDE’s call for depth and clarity. It avoids condescension and invites collaboration, so tone is very strong.

Scaffolding: Excellent. The LOCAL answer breaks the task into clear steps: narrowing scope, selecting theories, proposing a structured outline, showing how to make analytical claims, and asking targeted follow-up questions. This goes beyond the GUIDE’s brief process description (introduce → tension → theory → application → insight) and operationalizes it in a very concrete, student-friendly way.

Alignment: The LOCAL response clearly follows the GUIDE’s high-level blueprint: it encourages depth, uses theory as a lens, emphasizes applying theory to platform features, and ends with nuanced, non-binary conclusions (enabling and constraining effects). It expands the theoretical toolkit well beyond the GUIDE’s specific mentions (Goffman, social comparison theory, symbolic interactionism) to include Erikson/Marcia, social identity theory, self-discrepancy, and algorithmic lenses. This is broadly consistent with the spirit of the GUIDE but only partially overlaps in specific theory selection, hence not a perfect 10. Goffman is present and well developed; symbolic interactionism and social comparison are functionally present but not labeled explicitly.

Overall: The LOCAL response is highly effective for a senior-level student. It offers a sophisticated outline, multiple theoretical frames, concrete analytical moves, and sample thesis language. It closely follows the GUIDE’s pedagogical goals (depth, theory-driven analysis, platform-feature application, nuanced conclusions) while adding substantial usable structure and detail. The only minor misalignment is not foregrounding the exact three theories named in the GUIDE, but pedagogically it is very strong.

## Prompt 6 — Overwhelmed Adult Learner / Project Breakdown
### **Prompt**
I’m overwhelmed at work. Can you help me break down a complex project into a simple plan?

### **A. Local Engine Response**
Lots of adults feel overwhelmed by big projects — it’s very common and it makes sense you’re feeling this way. We’ll go in tiny, easy steps so your brain doesn’t have to hold everything at once. Let’s start with a super simple version: turning “one huge scary thing” into a short, clear checklist.

Here’s the basic idea:  
1) Define the *finish line* (what “done” looks like).  
2) Break it into 3–7 big chunks.  
3) Turn each chunk into small, doable tasks you could finish in 30–60 minutes.

**One concrete example**

Imagine your project is: “Launch a new internal report for leadership.”

1. **Define ‘done’ clearly**  
   - Example “done” statement:  
     > “A weekly report is automatically generated and emailed to leadership every Monday, with metrics A, B, and C, and there’s a short guide on how to read it.”

2. **Break into 4 big chunks**  
   - Chunk 1: Clarify requirements  
   - Chunk 2: Get data + build the report  
   - Chunk 3: Test + get feedback  
   - Chunk 4: Automate + document

3. **Turn one chunk into tiny tasks** (30–60 min each)  
   Let’s zoom into “Chunk 1: Clarify requirements” and make it simple:  
   - Task 1: List your *questions* about the report (metrics, timing, format).  
   - Task 2: Identify who can answer each question (manager, data team, stakeholders).  
   - Task 3: Draft a 5–7 bullet outline of the report sections.  
   - Task 4: Schedule a 30-min meeting or send one clear email with your questions + outline.

Now “Clarify requirements” is no longer a foggy cloud; it’s 4 small actions you can actually do.

---

**Micro-practice (5–10 seconds)**  
Try this:  
1. In one sentence, describe your project’s *finish line* starting with:  
   > “Done means that…”  

Type just that one sentence. Don’t worry about making it perfect.

---

**Micro-check**  
Does the “finish line → 4 chunks → tiny tasks” idea make sense so far?

---

**Next-step choices — what would help you most right now?**  
A) “Help me write my own ‘done means that…’ sentence.”  
B) “Show me a picture-style / bullet-map breakdown of a complex project.”  
C) “My project is ___. Help me turn it into chunks and tasks step-by-step.”

### **B. CogMyra Guide GPT Response**
You’re overwhelmed—and that’s a signal you need structure, not more pressure.
Step 1: Clarify the outcome.
Step 2: Identify the 3–5 major chunks.
Step 3: Turn each chunk into 2–3 small actions.
Step 4: Sequence them.
Step 5: Assign time + boundaries.
We can build your exact plan together.

---


---

### **Summary of Drift for Prompt 6:**

**Tone Score:** 9
**Scaffolding Score:** 9
**Alignment Score:** 8
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: LOCAL is warm, validating, and non-judgmental, similar intent to GUIDE’s supportive tone. It uses normalization (“very common”) and reduces pressure, well aligned with CogMyra’s student-centered, psychologically safe approach.

Scaffolding: LOCAL provides a clear, step-by-step structure plus a concrete example, then zooms into one chunk and further decomposes it into small tasks. It also adds micro-practice, a comprehension check, and choice of next steps, which is strong scaffolding. This goes beyond GUIDE’s brief outline while still following the same phases, showing good pedagogical layering.

Alignment: LOCAL follows the same core structure as GUIDE (clarify outcome → break into chunks → turn chunks into small tasks) and adds interactive elements. It slightly diverges by not explicitly mentioning sequencing and time boundaries (which GUIDE lists as later steps), so alignment isn’t perfect but remains high in spirit and method.

Overall effectiveness: LOCAL’s detailed example, concrete task sizes (30–60 minutes), and interactive prompts (finish-line sentence, options A/B/C) make it highly actionable and user-friendly. It moves the user from overwhelm to a specific, manageable process and invites continued collaboration, which fits CogMyra’s tutoring style well.

## Prompt 7 — Adult Professional / Interview Prep
### **Prompt**
I need to prepare for a job interview. Can you help me practice answering the “Tell me about yourself” question?

### **A. Local Engine Response**
Absolutely—this is one of the most important questions to get right.

First, I’ll give you a simple structure. Then we’ll draft a version together and refine it so it sounds natural and confident.

## A simple structure you can use

Think of your answer as a short story with 4 parts:

1. **Now** – Who you are professionally today  
2. **Past** – 1–2 key experiences that shaped your skills  
3. **Proof** – 1–2 specific achievements or strengths  
4. **Future** – Why you’re excited about *this* role/company

You’re aiming for **60–90 seconds** total.

---

## Step 1: I need a bit of info from you

To make this realistic and tailored, could you tell me:

1. What job title/role are you interviewing for?  
2. What’s your background in 1–3 bullets? (e.g., “3 years in customer support, 2 years in sales,” “recent computer science graduate,” “career changer from teaching to project management”)  
3. One or two things you’re proud of in your work or studies (projects, results, compliments you’ve gotten, promotions, etc.)  
4. Anything you’re a bit worried about them asking (e.g., employment gap, career change, limited experience)?

Reply in any format—bullets are fine.  
Then I’ll write a custom “Tell me about yourself” answer for you, and we’ll practice it like a mock interview.

### **B. CogMyra Guide GPT Response**
Great preparation question.
Structure:
Present — who you are now.
Past — what experiences shaped you.
Future — why this job fits.
Example:
“I’m a project coordinator who loves turning messy ideas into clear plans…”

---


---

### **Summary of Drift for Prompt 7:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
LOCAL provides a warm, encouraging tone similar to the GUIDE but with more explicit guidance and collaboration language, which suits tutoring well. Scaffolding is much stronger than the GUIDE: it offers a clear 4-part structure, approximate timing, and then asks specific diagnostic questions to tailor the practice, enabling an interactive, stepwise learning process. Alignment with the CogMyra-style GUIDE is high: both emphasize a Present/Past/Future structure (LOCAL adds a Proof step, which is a reasonable extension, not a contradiction) and focus on practical, example-based help. Local’s only slight deviation is length and complexity compared to the very concise GUIDE, but this serves the tutoring goal. Overall effectiveness is high because it both explains the framework and initiates a personalized mock-interview workflow, which is more helpful for actual practice than the GUIDE’s brief example.

## Prompt 8 — Adult Language Learner / Italian Verb Tenses
### **Prompt**
I’m learning Italian. Can you help me understand when to use the passato prossimo versus the imperfetto?

### **A. Local Engine Response**
Nice goal—this is a classic “Italian learner” question, and it confuses almost everyone at first. We’ll go in small, clear steps and compare them side by side so you can feel the difference, not just memorize rules.

Here’s the core idea:
- **Passato prossimo** = *completed events* (“what happened,” with a sense of result or finish).  
- **Imperfetto** = *background, habits, ongoing stuff* (“what was going on / used to be”).

Think of telling a story: imperfetto paints the *background* and ongoing actions; passato prossimo marks the *events* that move the story forward.

---

### 1. Core contrast in simple terms

**Passato prossimo**  
Use it for:
- A **single completed action** in the past  
- A specific **moment** or **number of times**  
- Actions that feel like *points* on a timeline

Examples:  
- Ieri **ho mangiato** la pizza. = Yesterday I ate (and finished) the pizza.  
- Ho visto Luca tre volte. = I saw Luca three times.

**Imperfetto**  
Use it for:
- **Habitual** or repeated actions (“used to”, “would”)  
- **Descriptions**: weather, time, age, feelings, physical states  
- **Ongoing actions** (“was …ing”) in the past

Examples:  
- Da bambino **mangiavo** sempre la pizza. = As a child I *always used to eat* pizza.  
- **Faceva** freddo. = It *was* cold.  
- **Guardavo** la TV. = I *was watching* TV.

---

### 2. Same verb, different meaning

Take the verb **mangiare** (to eat):

- **Passato prossimo:**  
  - Ieri sera **ho mangiato** alle 8.  
  → A specific, completed act: *I ate at 8 p.m. yesterday.*

- **Imperfetto:**  
  - Quando ero piccolo, **mangiavo** alle 8.  
  → A habit in the past: *When I was little, I used to eat at 8.*

So:  
- “What happened?” → passato prossimo  
- “What was it like / what usually happened?” → imperfetto

---

### 3. Story-mode: background vs events

Imagine a little story:

> **Era** una bella giornata.  
> Io **camminavo** nel parco, **ascoltavo** la musica  
> quando all’improvviso **ho visto** un cane enorme.

- **Era** (it was) → background description → imperfetto  
- **camminavo**, **ascoltavo** (I was walking, I was listening) → ongoing background actions → imperfetto  
- **ho visto** (I saw) → the main event that “happened” → passato prossimo

So in a story:
- **Imperfetto** = scenery, situation, “what was going on”  
- **Passato prossimo** = the plot points

---

### 4. Time expressions that *often* go with each

Not strict rules, but good hints:

**Often with passato prossimo:**
- ieri, ieri sera, stamattina  
- una volta, due volte, tre volte  
- all’improvviso, improvvisamente  
- poi, dopo, alla fine

Example:  
- Ieri sera **ho visto** un film e poi **sono andato** a letto.  

**Often with imperfetto:**
- di solito, normalmente, sempre, spesso  
- mentre (while)  
- da bambino / da piccola  
- ogni giorno / ogni estate

Example:  
- Da bambino **guardavo** sempre i cartoni la mattina.

---

### 5. “Mentre” vs “quando”

This pairing really shows the difference:

- **Mentre** + imperfetto (ongoing action)  
- **Quando** + passato prossimo (interrupting event) is very common

Example:  
- **Mentre** **guardavo** la TV, **ho sentito** un rumore.  
  - guardavo (imperfetto) = I was watching (background)  
  - ho sentito (passato prossimo) = I heard (sudden event)

Flip it and it sounds wrong in Italian:  
✗ *Mentre ho guardato la TV, sentivo un rumore* → not natural.

---

### 6. Micro-practice (your turn)

Try these. You just need to choose **PP** (passato prossimo) or **Imp** (imperfetto). Don’t worry about the exact conjugation; focus on *which tense* fits the idea.

1. Da bambino, io ______ (giocare) a calcio ogni giorno.  
   → Habit in the past: PP or Imp?

2. Ieri sera ______ (uscire) con i miei amici.  
   → One specific event last night: PP or Imp?

3. Mentre ______ (leggere) il libro, ______ (arrivare) mia sorella.  
   → First blank: ongoing background → ?  
   → Second blank: sudden event → ?

Write your answers like this:  
1 = …, 2 = …, 3 = … / …

---

Did that contrast (completed events vs background/habit) feel clear so far?

For the next step, what would you like?  
A) More mini-questions like the ones above  
B) Visual “timeline” style explanation of the difference  
C) Trickier examples where *both* are possible but the meaning changes

### **B. CogMyra Guide GPT Response**
Passato prossimo = completed action.
Imperfetto = ongoing/description/habit.
Think of a movie:
Imperfetto is the background.
Passato prossimo is the event.
Then I give examples, contrast, and exercises.

---


---

### **Summary of Drift for Prompt 8:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 8
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: Warm, encouraging, and learner-friendly without being childish. It mirrors the GUIDE’s intent (simple, metaphor-based, clear) and adds motivational framing and reassurance, which suits tutoring well. Slightly more expansive than the GUIDE’s very minimal style, but not overdone.

Scaffolding: Excellent. The LOCAL response breaks the concept into digestible sections (core contrast, same verb different meaning, story mode, time expressions, mentre/quando pattern), uses clear examples, and finishes with targeted practice plus explicit prompts about next steps. This goes far beyond the GUIDE’s sketch by actually operationalizing examples, contrast, and exercises in a structured lesson.

Alignment: The key conceptual frame from the GUIDE is strongly respected: 'Passato prossimo = completed action / events' vs 'Imperfetto = background/ongoing/habit', plus the movie/story metaphor. The LOCAL answer clearly implements 'Then I give examples, contrast, and exercises.' It does expand beyond the GUIDE with extra cues (time expressions, mentre/quando rules, micro-practice), but these are natural elaborations rather than deviations. The only minor misalignment is that the GUIDE suggests extreme brevity and the LOCAL answer is quite detailed.

Overall: Very effective tutoring response. It is conceptually accurate, pedagogically strong, and closely aligned with the GUIDE’s core metaphor and goals, while also providing the concrete examples and practice that the GUIDE only alludes to in outline.

## Prompt 9 — Creative Writing Student
### **Prompt**
I’m a creative writing student. Can you help me rewrite this paragraph so it’s more vivid?

### **A. Local Engine Response**
Yes, I can help with that.  

Paste the paragraph you’d like to improve, and tell me anything you already know about your goal, for example:  
- Tone you want (e.g., eerie, tender, funny, lyrical)  
- Point of view (1st person “I”, 3rd person “she/he/they”)  
- Any authors or books your teacher says are a good model for you  

Once I see the paragraph, I’ll:  
1. Offer a more vivid rewrite.  
2. Point out 2–3 specific techniques I used (imagery, word choice, rhythm, etc.) so you can apply them yourself.  

Go ahead and drop the paragraph in, and tell me what kind of “vivid” you’re aiming for (cinematic, emotional, sensory, etc.).

### **B. CogMyra Guide GPT Response**
Absolutely—share your paragraph and I’ll help you make it more vivid.
I’ll highlight what’s working, rewrite a vivid version, and then walk you through a technique so you stay in control of your voice.

---


---

### **Summary of Drift for Prompt 9:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
LOCAL is warm, encouraging, and student-centered, comparable in tone to GUIDE but a bit more verbose, hence 9. It excels at scaffolding: it elicits specific constraints (tone, POV, models) and clearly outlines a stepwise plan (rewrite + 2–3 techniques), which is richer than GUIDE’s brief promise, so 10 for scaffolding. Alignment with the CogMyra-style guidance is strong: it keeps the student in control, asks for goals, and emphasizes teachable techniques rather than just rewriting, similar to GUIDE, though slightly more procedural and less succinct, so 9. Overall, LOCAL is very effective, arguably more instructionally helpful than GUIDE for this task while remaining aligned with its spirit.

## Prompt 10 — Nonprofit Leader / Motivational Email
### **Prompt**
I’m a director at a nonprofit. Can you help me write a motivational email to my team after a difficult quarter?

### **A. Local Engine Response**
Absolutely—I can help you shape that.

First, a couple quick questions so I can tailor it to your situation:
- What kind of nonprofit are you (e.g., education, health, arts, advocacy)?
- What made the quarter “difficult” (funding shortfall, staff turnover, missed goals, external crisis, etc.)?
- What’s your main goal for this email: boost morale, refocus on priorities, acknowledge burnout, retain staff, or something else?

For now, here’s a strong, adaptable draft you can modify. After you read it, I can help you tighten the tone or make it sound more like you.

---

**Subject:** Thank you for showing up when it was hardest  

Hi team,  

I want to start by saying a genuine thank you. This past quarter has asked more of us than we expected—emotionally, mentally, and logistically—and you’ve continued to show up for our mission and for each other. I see the hours, the problem-solving, the tough conversations, and the care you put into your work. It matters, even when the results aren’t as visible as we’d hoped.  

We’ve had some real challenges: [briefly name 2–3: e.g., “funding uncertainty, shifting priorities from partners, and the strain of doing more with less”]. None of that is easy. It’s okay to feel tired, frustrated, or disappointed. Those feelings are a normal response to a hard season, not a reflection of your value or your commitment.  

At the same time, I want to highlight what we *did* achieve together, because it’s easy to lose sight of that in a tough quarter:  
- [Win #1: e.g., “We served X clients, many in crisis situations, with compassion and professionalism.”]  
- [Win #2: e.g., “We piloted a new process/program that will make our work more sustainable.”]  
- [Win #3: e.g., “We strengthened relationships with key partners/donors/community members.”]  

These are foundations we’ll build on next quarter. They are not small things—they are exactly what keeps our mission moving forward.  

Looking ahead, here’s where I’d like us to focus:  
1. **Clarity:** Over the next few weeks, I’ll be working with the leadership team to sharpen our priorities so everyone knows what matters most and what can wait.  
2. **Support:** If you’re feeling stretched thin, please reach out to your manager or to me. I can’t promise to fix everything, but I *can* promise to listen and be honest about what we can do.  
3. **Sustainability:** Our work is a marathon, not a sprint. I encourage you to take your time off, set boundaries where possible, and let us know what would help you do your best work without burning out.  

I continue to believe deeply in the work we’re doing and in this team. You are the reason our mission is real in people’s lives—not a line in a report, but real change for real people. Even in a hard quarter, your integrity, compassion, and resilience have been clear.  

Thank you for staying committed during a season when it would have been easier to pull back. I’m proud to work alongside you, and I’m hopeful about what we can build from here—together.  

With appreciation,  
[Your name]  
[Your title]

---

If you’d like, I can now:
A) Customize this for your specific situation if you share a few details  
B) Make it shorter and punchier  
C) Add a more vulnerable/personal tone or a more formal tone, depending on your culture

### **B. CogMyra Guide GPT Response**
Here’s a motivational email with grounded leadership and warmth:
Acknowledge difficulty.
Affirm effort and meaning.
Highlight 2–4 wins.
Give a forward path.
Close with appreciation.
(Then full email text.)

---


---

### **Summary of Drift for Prompt 10:**

**Tone Score:** 9
**Scaffolding Score:** 10
**Alignment Score:** 9
**Overall Effectiveness Score:** 9

**Evaluator Notes:**
Tone: Warm, appreciative, and grounded without being saccharine; validates emotions and expresses pride and hope. Slightly more expansive than the succinct GUIDE description, but still well within an appropriate motivational tone.

Scaffolding: Excellent. The LOCAL answer starts by asking targeted questions to tailor the message, then provides a full adaptable draft with placeholders, and finally offers concrete options (A/B/C) for next steps. This gives the user both an immediate usable artifact and a clear path for refinement, which is stronger scaffolding than the brief outline in the GUIDE.

Alignment: Very strong alignment with the GUIDE’s structure: it explicitly acknowledges difficulty, affirms effort and meaning, highlights wins via a bullet list, lays out a forward-looking path with three focus areas, and closes with clear appreciation. The only minor deviation is that it adds more detail and coaching around emotions and sustainability than the terse GUIDE summary, but this is additive rather than conflicting.

Overall: A highly effective response for the user’s goal. It delivers a polished, mission-appropriate email, invites customization for context, and supports different tonal preferences. It slightly exceeds the GUIDE’s brevity but does so in a user-helpful way, keeping it focused and practical.

# End of Test Set
