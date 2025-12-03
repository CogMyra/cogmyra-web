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
Lots of kids your age get distracted and feel unsure about fractions — it’s totally okay.  
We’ll go in tiny, easy steps together.  
Let’s start with a super simple version so your brain can grab just one idea at a time.  

Fractions are a way to show a part of something.  
We usually write them with two numbers and a line, like this: 1/2.  
The top number tells how many parts you have, and the bottom number tells how many equal parts the whole thing is cut into.  

Example:  
Imagine a chocolate bar cut into 4 equal squares. If you eat 1 square, you ate **1/4** (one out of four) of the chocolate bar.  

Try this (super quick):  
If a pizza is cut into **8** equal slices and you eat **3** slices, what fraction of the pizza did you eat? (You can just type it like this: ? / ?)  

Did that part make sense so far?  

What do you want to do next?  
A) Another quick example with food  
B) A picture-style explanation (I’ll describe it so you can “see” it in your head)  
C) A slightly harder challenge with fractions

### **B. CogMyra Guide GPT Response**
Hey there—since you’re 9 and sometimes get distracted (that’s totally normal!), let’s make fractions feel simple and kind of fun.
Imagine you have a pizza. If you cut it into 4 equal pieces and eat 1 piece, you ate one out of four pieces. That’s a fraction:
The top number tells how many pieces you have.
The bottom number tells how many equal pieces the whole thing was cut into.
Try this:
If you cut a brownie into 8 equal squares and take 3, what fraction of the brownie is yours?

---

## Prompt 2 — Young Learner / Photosynthesis
### **Prompt**
Explain photosynthesis for a 3rd grader.

### **A. Local Engine Response**
Nice! Let’s learn about photosynthesis together. 🌱  

Photosynthesis is how plants make their own food using **sunlight**, **water**, and **air**.  
The green parts of the plant (like leaves) catch sunlight like tiny solar panels.  
They take in water from the soil through the roots and a gas from the air called carbon dioxide.  
Then the plant uses sunlight to **mix** them and make sugar (its food) and oxygen (the air we breathe).  

**Quick example:**  
Think of a plant like a tiny chef. The sun is the stove, water is like the soup broth, and air is like the veggies. The plant “cooks” them together to make food (sugar) and gives off oxygen as a “smell” into the air.

**Your turn (5–10 seconds):**  
Fill in the missing word:  
Plants use sunlight, water, and ________ from the air to make their food.

What do you think goes in the blank?  
A) Oxygen  
B) Carbon dioxide  
C) Dirt  

Did that part make sense so far?  

What would you like to do next?  
A) Another quick example of photosynthesis  
B) A picture-style explanation (describing what a diagram would look like)  
C) A harder challenge with a short quiz question

### **B. CogMyra Guide GPT Response**
Let’s keep this super clear for a 3rd grader.
Plants make their own food—kind of like tiny chefs. Here’s how:
They take sunlight (their energy).
They breathe in carbon dioxide from the air.
They drink water through their roots.
Then inside their leaves, they mix it all together to make sugar (their food) and release oxygen for us to breathe.
Sun + water + air → plant food.

---

## Prompt 3 — 7th Grader / Dividing Fractions
### **Prompt**
I’m a 7th grader who feels dumb in math class. Can you help me understand how to divide fractions?

### **A. Local Engine Response**
Lots of students feel dumb in math sometimes — it really does NOT mean you’re actually bad at it.  
We’ll go in tiny, easy steps together.  
Let’s start with a super simple version of dividing fractions and just one example so your brain doesn’t get overloaded.

---

**Step 1: The basic idea (tiny explanation)**  
When you divide fractions, you **change the second fraction** (the one you’re dividing by):  
- You **flip** the second fraction (that’s called the *reciprocal*).  
- Then you **multiply** the fractions instead of dividing.  
People remember it as: **“Keep, Flip, Multiply.”**

---

**One example only**

Let’s do:  
\[
\frac{2}{3} \div \frac{4}{5}
\]

Using **Keep, Flip, Multiply**:

1. **Keep** the first fraction: \(\frac{2}{3}\)  
2. **Flip** the second fraction: \(\frac{4}{5} \rightarrow \frac{5}{4}\)  
3. **Multiply**:  
\[
\frac{2}{3} \times \frac{5}{4} = \frac{2 \times 5}{3 \times 4} = \frac{10}{12}
\]

You can simplify \(\frac{10}{12}\) by dividing top and bottom by 2:  
\[
\frac{10}{12} = \frac{5}{6}
\]

So:
\[
\frac{2}{3} \div \frac{4}{5} = \frac{5}{6}
\]

---

**Your 5-second micro-practice**

Try this one using **Keep, Flip, Multiply** (you don’t have to simplify unless you want to):

\[
\frac{1}{2} \div \frac{3}{4} = \; ?
\]

Just tell me what fraction you get after you **keep**, **flip**, and **multiply**.

---

**Micro-check**

Did the “Keep, Flip, Multiply” idea make sense so far, or did any step feel fuzzy?

---

**Pick what you want next:**

A) Do another quick example just like the one we did  
B) See a picture-style explanation of what dividing fractions *means*  
C) Try a slightly harder challenge to see if you’ve got it

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

## Prompt 4 — College Freshman / Thesis Statements
### **Prompt**
I’m a college freshman struggling to understand thesis statements. What makes a thesis strong?

### **A. Local Engine Response**
A strong thesis is basically a *clear, specific answer* to the question your paper is asking — and it points forward to how you’ll argue that answer.

Here are the core traits of a strong thesis for college writing:

1. **It actually makes an argument (not just a topic or fact).**  
   - Weak: “Social media is popular among teenagers.” (just a fact)  
   - Strong: “Social media harms teenagers’ sleep and focus, so high schools should limit phone use during class.”  
   → You can agree or disagree with the strong one; that’s what makes it arguable.

2. **It’s specific, not vague.**  
   - Weak: “Climate change is a big problem.”  
   - Strong: “Because climate change increases extreme heat waves in cities, local governments should expand tree cover and cool-roof programs in low-income neighborhoods.”  
   → Notice the who/what/where: *local governments*, *tree cover and cool roofs*, *low-income neighborhoods*.

3. **It answers the “so what?” question.**  
   - Weak: “College is stressful.” (okay… and why does that matter?)  
   - Strong: “Because unmanageable stress drives many first-year students to drop classes, colleges should replace high-stakes midterms with more frequent low-stakes quizzes.”  
   → It shows why the issue matters and what should be done.

4. **It usually includes a *because* or an implied reason.**  
   - “X should happen **because** A, B, and C.”  
   - Even if you don’t write the word “because,” the reason is there:  
     - “Mandatory gap years improve students’ mental health, academic performance, and career clarity.”  
   → Your body paragraphs will later match those reasons (mental health, performance, clarity).

5. **It matches the assignment type.**  
   - Argumentative → takes a position: “should/should not,” “is better than,” “leads to.”  
   - Analytical → explains “how/why” something works, not just “what happened.”  
   - Compare/contrast → makes a claim *about the comparison*, not just “X and Y are similar and different.”

---

### One example, step-by-step

Suppose the assignment:  
“Should attendance be mandatory in college classes? Take a position and support it.”

- Topic-only: “College attendance policies.”  
- Too obvious: “Some professors take attendance.”  
- Vague opinion: “Attendance rules are kind of annoying.”  
- **Stronger thesis:**  
  > “Colleges should not require mandatory attendance in every class, because flexible policies let students manage work and family responsibilities while still holding them accountable through graded participation activities.”

Why this is strong:
- Takes a clear stand (“should not require mandatory attendance in every class”).  
- Gives reasons (“manage work and family responsibilities” + “accountable through graded participation”).  
- Points forward to body paragraphs (you can imagine 2–3 sections built from those reasons).

---

### Tiny practice (10–20 seconds)

Take *any* topic you’ve written or might write about (or I can give you one).  
Try to fill in this frame in one sentence:

> “In this essay, I argue that **[your claim]**, because **[reason 1]** and **[reason 2]**.”

You don’t have to make it perfect yet — just a rough draft.

Type your sentence, and I’ll help you strengthen it.

---

Before we go deeper: does this basic idea of a strong thesis (arguable + specific + gives reasons) make sense so far?

For next step, which would help you most right now?  
A) I give you 3 weak theses and you help fix them  
B) You show me a thesis you wrote for a class, and we improve it together  
C) I walk you through a “plug-and-play” template set for different essay types (argument, analysis, compare/contrast)

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

## Prompt 5 — Senior-Level Analysis / Social Media & Identity
### **Prompt**
I’m writing a senior-level college paper. Can you help me analyze how social media affects identity formation?

### **A. Local Engine Response**
Yes—I can help you build a solid, senior-level analysis of how social media affects identity formation.

Here’s a clear way to frame your paper, then we can zoom in on the pieces you care about most.

---

## 1. Narrow your focus: what kind of “identity”?

“Identity formation” is huge. Pick 1–2 dimensions so your paper can go deep instead of broad:

- **Personal identity** – sense of self, authenticity, self-concept (“who am I?”)  
- **Social identity** – group memberships (gender, race, fandoms, politics, subcultures)  
- **Performative/curated identity** – how people *present* themselves vs how they feel internally  
- **Adolescent vs emerging adult identity** – development across late teens / twenties

A strong thesis usually narrows by:
- **Age group** (e.g., adolescents 13–18, or college students)  
- **Platform type** (visual platforms like Instagram/TikTok vs text-based like X/Reddit)  
- **Key mechanism** (algorithmic curation, social comparison, anonymity/pseudonymity, etc.)

Example narrower topic:  
> How algorithmically curated image-based social media (e.g., Instagram, TikTok) shapes late adolescents’ identity through constant social comparison and performative self-presentation.

---

## 2. Theoretical lenses you can use

Your professor will likely expect theory. Here are common ones that fit well:

1. **Erikson: Identity vs. role confusion**  
   - Late adolescence/emerging adulthood is about integrating roles into a coherent self.  
   - Social media adds *new arenas* for trying out roles (usernames, aesthetics, communities).

2. **Goffman: Dramaturgy / Presentation of self**  
   - Identity as performance: front stage (public feed), backstage (close friends/DMs).  
   - Social media = permanent stage + audience metrics (likes, views, followers).

3. **Social identity theory (Tajfel & Turner)**  
   - People define themselves through group memberships (“we” vs “they”).  
   - Online groups (stan culture, fandoms, political subreddits, niche Discord servers) give strong in-group identities and out-group contrast.

4. **Self-discrepancy theory (Higgins)**  
   - Gap between actual self, ideal self, and “ought” self.  
   - Curated feeds and influencers amplify “ideal self” images, intensifying these gaps.

5. **Social comparison theory (Festinger)**  
   - Upward comparison (to “better” others) can fuel inadequacy; downward comparison can inflate ego or stabilize self-esteem.  
   - Infinite scroll = endless material for comparison.

You don’t need all of these; **2–3 frameworks** applied well is plenty for a senior paper.

---

## 3. Key mechanisms: how social media shapes identity

You can structure your body sections around mechanisms. For each one, connect:
**Platform features → psychological process → identity effects.**

### A. Curated self-presentation & performativity

- Features: profiles, bio, filters, editing, “best-of” posting, archive/delete.  
- Process: people curate images, captions, and stories to manage impressions.  
- Identity effect:
  - Positive: experimentation with roles (gender expression, aesthetics, communities) can support identity exploration, especially for marginalized groups.  
  - Negative: pressure for coherence and “brand” can make identity feel like a performance for others rather than an internal integration.

Tie to: **Goffman, Erikson, self-discrepancy.**

You might argue:  
> Social media transforms identity from a relatively private developmental task into a semi-public branding exercise.

---

### B. Algorithmic visibility & quantified feedback

- Features: likes, comments, shares, follower counts, algorithmic boosts.  
- Process: users receive **quantified** social feedback; algorithms reward certain content styles (beauty, extreme opinions, novelty).  
- Identity effect:
  - People learn what “version” of themselves gets rewarded; they may gradually **shift self-presentation** to align with what performs well.  
  - Over time, there can be an internalization: “The posts that do well *are* who I am,” which can constrain identity exploration.

Tie to: **operant conditioning, social reinforcement, symbolic interactionism** (“self” emerges from how others respond to us).

---

### C. Social comparison and idealized selves

- Features: endless feeds of curated highlights, influencer culture, body/wealth/relationship imagery.  
- Process: users compare their everyday lives to others’ peak moments.  
- Identity effect:
  - Increased self-objectification, body dissatisfaction, and identity insecurity—especially where appearance and status are central.  
  - BUT also: upward comparison can be motivating or aspirational for some (e.g., career identities, creative skills).

Tie to: **social comparison theory, self-discrepancy theory.**

---

### D. Community, belonging, and social identity

- Features: groups, hashtags, fandoms, subcultures, “sides” of TikTok, Discord servers.  
- Process: users attach to communities, adopt norms, language, and in-group markers.  
- Identity effect:
  - Strong sense of belonging and validation (“I’m not the only one like this”), which can stabilize identity—crucial for LGBTQ+ youth and other marginalized groups.  
  - But also: identity polarization, rigid group boundaries, and identity collapse into a single dimension (e.g., political identity dominating all others).

Tie to: **social identity theory, identity fusion.**

---

### E. Anonymity, pseudonymity, and multiplicity of selves

- Features: alt accounts, Finstas, anonymous platforms, multiple usernames.  
- Process: people maintain different personas for different audiences.  
- Identity effect:
  - Allows safe experimentation (e.g., exploring sexuality, mental health disclosures) without real-life risk.  
  - Can also fragment identity; some feel they are performing incompatible selves in different spaces, complicating integration.

Tie to: **postmodern identity (fluid, decentered), Erikson (integration vs fragmentation).**

---

## 4. Mixed outcomes: avoid a simplistic “good or bad” stance

Good senior-level work will emphasize **ambivalence and contingencies**:

- Effects depend on:
  - **Developmental stage** (younger teens vs older college students)  
  - **Platform architecture** (visual vs text-based; algorithmic vs chronological)  
  - **Use patterns** (active creation vs passive scrolling; public vs private groups)  
  - **Social location** (gender, race, class, sexuality, disability)  
  - **Existing offline supports** (family, school, peer networks)

You can structure the paper to show that **the same mechanism** (e.g., curated presentation) can:
- support healthy identity exploration for one group/context  
- intensify insecurity or fragmentation in another.

That nuance is what usually elevates a paper.

---

## 5. Possible thesis statements

You can adapt one of these to your angle:

1. **Performance & authenticity angle**  
   > While social media is often criticized for producing “fake” selves, it more accurately functions as an expanded stage for identity experimentation, where performative self-presentation both enables exploration and pressures young adults to convert identity into a coherent personal brand.

2. **Algorithmic feedback angle**  
   > Algorithmically curated social media platforms reshape identity formation in emerging adults by tying self-concept to quantifiable audience feedback, gradually steering users toward identities that are optimized for visibility rather than psychological coherence.

3. **Ambivalent developmental tool angle**  
   > For contemporary adolescents, social media operates as a double-edged context for identity development: it broadens opportunities for exploration and community-based affirmation, particularly for marginalized youth, while simultaneously intensifying social comparison, performativity, and the risk of identity fragmentation.

---

## 6. Skeleton outline for a senior-level paper

You can adapt this to your assignment length:

**I. Introduction**
- Briefly define identity formation.  
- Name 2–3 theories you’ll use.  
- Specify age group and platform type.  
- End with your thesis (clear, arguable, specific).

**II. Theoretical framework**
- Introduce Erikson + Goffman + one cognitive/social theory (e.g., social comparison).  
- Show how they’re useful for analyzing digital contexts.

**III. Mechanism 1: Curated self-presentation and performativity**
- Describe platform features.  
- Explain psychological process.  
- Apply theory + cite empirical studies.  
- Argue both enabling and constraining effects on identity.

**IV. Mechanism 2: Social comparison and quantified feedback**
- Same structure as III.  
- Emphasize self-esteem, self-concept clarity, and identity stability/instability.

**V. Mechanism 3: Community and social identity**
- Focus on belonging, marginalization, and group-based identities.  
- Include nuance (e.g., empowerment vs polarization).

**VI. Synthesis and discussion**
- Show how these mechanisms interact.  
- Discuss when social media is likely to support vs undermine healthy identity formation.  
- Note limitations (e.g., cross-sectional data, WEIRD samples, rapid platform change).

**VII. Conclusion**
- Re-state thesis in light of evidence.  
- Point to implications (for education, policy, design, or mental health).  
- Suggest one or two directions for future research.

---

## 7. Next step: how do you want to proceed?

Pick one, and I’ll help you build it:

A) Work together to **craft a precise thesis statement** for your specific assignment  
B) Flesh out a **detailed outline** with topic sentences and evidence slots  
C) Go deep on **one theoretical angle** (e.g., Goffman + algorithms, or Erikson + TikTok) and pull in key empirical findings  

Tell me which option (A/B/C) you want, and also:
- your approximate page/word limit  
- the discipline (psych, sociology, comm, media studies, etc.)  
- any specific sources or theorists you’re required to engage with.

### **B. CogMyra Guide GPT Response**
For a senior-level analysis, we want depth, clarity, and evidence-based reasoning.
Introduce the phenomenon → Identify a tension → Bring in theory → Apply the theory → Offer insight.
Theories: Goffman, social comparison theory, symbolic interactionism.
Then apply to platform features: likes, filters, metrics, curated identity.
Finish with nuanced insight: enabling + constraining.

---

## Prompt 6 — Overwhelmed Adult Learner / Project Breakdown
### **Prompt**
I’m overwhelmed at work. Can you help me break down a complex project into a simple plan?

### **A. Local Engine Response**
You’re not alone in feeling that way — a lot of people get overwhelmed when a project feels huge or fuzzy. We can absolutely slow this down and take it in clear, tiny steps. Let’s start by turning your “big blurry project” into a short, simple list of pieces, then we’ll shape that into a plan you can actually do this week.

First, I’ll give you a super simple 5-step structure. Then we’ll fill it in together for your specific project.

Here’s a simple plan structure we can use:

1. **Define the finish line**  
   “This project is done when: __________.”

2. **List the big chunks (3–7 only)**  
   Example chunks: “Research,” “Decide,” “Create,” “Review,” “Deliver.”  
   (Too many chunks = overwhelm, so we keep it small.)

3. **Turn each chunk into 15–60 minute tasks**  
   Each task should be something you could, in reality, sit down and do in one go.

4. **Sequence + schedule the first 3–5 tasks only**  
   Don’t plan the whole universe. Just enough to get you moving without stress.

5. **Set simple guardrails**  
   - When you’ll work (e.g., “20–40 min blocks, 1–2x per day”)  
   - How you’ll track (one list, one doc, or one board — not five tools)

---

### One concrete example

Let’s pretend your project is:  
**“Launch a new internal reporting dashboard.”**

1. **Finish line**  
   - “Done when: stakeholders can log into the dashboard, see the 5 key metrics, and we’ve run one feedback session.”

2. **Big chunks**  
   - Chunk A: Clarify requirements  
   - Chunk B: Design structure & data  
   - Chunk C: Build dashboard  
   - Chunk D: Test & fix issues  
   - Chunk E: Launch & collect feedback  

3. **Turn one chunk into tasks (Chunk A: Clarify requirements)**  
   - Task A1 (30 min): List all stakeholders and current pain points from memory.  
   - Task A2 (30–45 min): Quick 15–20 min call or chat with main stakeholder to confirm goals and “must-have” metrics.  
   - Task A3 (30 min): Write a 1-page summary: “Problem, Goals, Must-haves, Nice-to-haves.”  

   Each of those is small, concrete, and schedulable.

4. **Sequence + schedule the first few tasks**  
   - Tomorrow 9:00–9:30 — Do A1 (stakeholder + pain point list)  
   - Tomorrow 2:00–2:20 — Stakeholder chat (A2)  
   - Next day 10:00–10:30 — Write 1-page summary (A3)

5. **Guardrails**  
   - Work rule: “No heroic marathons; only 25–40 minute focused blocks.”  
   - Tracking rule: “Everything for this project lives in ONE place: a single doc or task list.”

---

### Tiny micro-practice (5–10 seconds)

Try this:  
In one sentence, fill in this blank for your real project:

> “This project is done when: ______________________.”

Write exactly what comes to mind first; we can refine it together.

---

Did that structure (finish line → big chunks → small tasks → schedule a few → guardrails) make sense so far?

For the next step, what would help you most right now?  
A) I help you fill in these 5 steps for *your* specific project (we’ll do it together).  
B) A simple visual/“picture in words” of how to think about a big project so it feels less heavy.  
C) A slightly tougher version: prioritize across *multiple* projects that are all competing for your time.

### **B. CogMyra Guide GPT Response**
You’re overwhelmed—and that’s a signal you need structure, not more pressure.
Step 1: Clarify the outcome.
Step 2: Identify the 3–5 major chunks.
Step 3: Turn each chunk into 2–3 small actions.
Step 4: Sequence them.
Step 5: Assign time + boundaries.
We can build your exact plan together.

---

## Prompt 7 — Adult Professional / Interview Prep
### **Prompt**
I need to prepare for a job interview. Can you help me practice answering the “Tell me about yourself” question?

### **A. Local Engine Response**
Absolutely—I can help you get ready for that.  

First, I’ll explain a simple structure, then we’ll draft a version together, and finally we can practice out loud-style answers.

---

## 1. A Simple Structure to Use

For “Tell me about yourself” in a job interview, use a short, 3-part story:

1. **Present** – Who you are in your current role / situation  
2. **Past** – 1–2 relevant experiences or skills that got you here  
3. **Future** – What you’re looking for and why *this* role/company

Think of it as: **Now → Before → Next**.

---

## 2. A Concrete Example (Template + Sample)

### Basic template (you can customize later)

> “I’m currently a [your role/field] with [X years or key focus].  
> In my last role at [Company/school/etc.], I [did something concrete that shows 1–2 skills relevant to this job].  
> I’m excited about [Company/role] because [how it matches your skills/interests/values].”

### Quick sample (office / professional example)

> “I’m currently a customer support specialist with about three years of experience helping clients solve product issues and improving how teams respond to requests. In my current role at BrightTech, I handle 30–40 customer tickets a day, and I led a small project that cut our response times by about 20%. I’m excited about this support role at Nova because it combines customer interaction with process improvement, and I’d love to bring that experience to a growing team.”

---

## 3. Micro-Practice: Your First Rough Draft

Try this tiny fill-in-the-blanks version. Don’t worry about making it perfect:

1. “I’m currently a __________ with __________.”  
2. “Previously, at __________, I __________.”  
3. “I’m excited about this role at __________ because __________.”

Type your rough draft in those three short sentences. I’ll help you polish it into something that sounds confident and natural.

---

## 4. Micro-check

Does this structure (Present → Past → Future) feel clear so far?  

---

## 5. Your Choice: What should we do next?

A) You fill in the 3-sentence mini-template and I rewrite it into a smooth answer  
B) I show you 2 more sample answers (e.g., one for a career changer, one for a recent grad)  
C) We make a slightly more advanced, 60–90 second version with storytelling elements  

Tell me your choice (A, B, or C), and also:  
- What role are you interviewing for?  
- What’s your background in 1–2 sentences?

### **B. CogMyra Guide GPT Response**
Great preparation question.
Structure:
Present — who you are now.
Past — what experiences shaped you.
Future — why this job fits.
Example:
“I’m a project coordinator who loves turning messy ideas into clear plans…”

---

## Prompt 8 — Adult Language Learner / Italian Verb Tenses
### **Prompt**
I’m learning Italian. Can you help me understand when to use the passato prossimo versus the imperfetto?

### **A. Local Engine Response**
Nice goal—this is a big step in Italian, and it confuses *everyone* at first, so you’re very normal for asking. We’ll go in clear, small pieces. Let’s start with the simplest, most useful difference.

Tiny explanation (core idea):  
- **Passato prossimo** = *single, completed events* (“what happened”).  
- **Imperfetto** = *background, habits, ongoing situations* (“what was going on / used to be”).  

**One example only:**  
- *Ieri **ho visto** Maria al parco.* → passato prossimo = one specific event: “Yesterday I **saw** Maria at the park.”  
- *Quando ero bambino, **vedevo** spesso Maria al parco.* → imperfetto = repeated habit in the past: “When I was a child, I **used to see** Maria at the park often.”

**Micro-practice (5–10 seconds):**  
Which sounds better for a **habit**?  
A) *Da piccolo, **ho guardato** molti cartoni animati.*  
B) *Da piccolo, **guardavo** molti cartoni animati.*  

Just answer A or B.

**Micro-check:**  
Did this “event vs. habit/background” idea make sense so far?

**Next step – choose one:**  
A) Another quick example about “finished event vs. ongoing action”  
B) A visual / timeline-style explanation  
C) A slightly harder challenge mixing both tenses in a short story

### **B. CogMyra Guide GPT Response**
Passato prossimo = completed action.
Imperfetto = ongoing/description/habit.
Think of a movie:
Imperfetto is the background.
Passato prossimo is the event.
Then I give examples, contrast, and exercises.

---

## Prompt 9 — Creative Writing Student
### **Prompt**
I’m a creative writing student. Can you help me rewrite this paragraph so it’s more vivid?

### **A. Local Engine Response**
Yes, I can help with that.  

Please paste the paragraph you want to improve, and tell me:
- What *tone* you’re going for (e.g., dreamy, tense, funny, lyrical, dark, etc.)
- Whether you want it to sound more formal, casual, or somewhere in between  

Then I’ll:
1. Rewrite your paragraph in a more vivid, concrete way  
2. Briefly explain what I changed and why, so you can apply the ideas in your own writing next time

### **B. CogMyra Guide GPT Response**
Absolutely—share your paragraph and I’ll help you make it more vivid.
I’ll highlight what’s working, rewrite a vivid version, and then walk you through a technique so you stay in control of your voice.

---

## Prompt 10 — Nonprofit Leader / Motivational Email
### **Prompt**
I’m a director at a nonprofit. Can you help me write a motivational email to my team after a difficult quarter?

### **A. Local Engine Response**
Absolutely. Here’s a draft you can copy and tweak. I’ll keep it neutral on specifics so you can adapt for your cause and context.

---

**Subject:** Grateful for this team — and where we’re headed next

Hi team,

I want to start by saying thank you. This past quarter has been hard — emotionally, logistically, and in ways that don’t always show up on a dashboard or in a board report — and you’ve continued to show up for our mission and for each other.

We didn’t hit every goal we set. That’s real, and I don’t want to gloss over it. But I also don’t want us to miss what *did* happen: you listened to our community, you problem-solved on the fly, and you kept our values at the center even when the numbers were discouraging. That matters just as much as the metrics.

Here are a few bright spots I’m especially proud of:  
- [Example: We launched X program/pilot despite reduced funding.]  
- [Example: We served Y people with a smaller-than-expected team.]  
- [Example: We built new partnerships with A/B/C, laying groundwork for the next year.]  

These are not small wins. They’re signs of resilience and of a team that doesn’t walk away when things get complicated.

As we move into the next quarter, here’s what I want you to know:

1. **You are not alone in this.** The challenges we’re facing are shared, and so are the solutions. You will not be asked to carry this on your own.  
2. **We will focus.** We’re going to prioritize the 2–3 most important areas where we can have the greatest impact, instead of trying to do everything at once.  
3. **We will learn and adjust, not blame.** If something didn’t work, our question will be “What did we learn?” not “Who’s at fault?”  

In the coming days, I’ll share:  
- A clear picture of our key priorities for next quarter  
- Where we’ll be adjusting expectations and supports  
- Concrete ways each of you can help shape the path forward

For now, I just want to say this: I see your effort. I see the extra hours, the tough conversations, and the emotional load of doing this kind of work. Our community may not see every one of those moments, but I do, and I’m deeply grateful.

Thank you for staying committed even when it’s hard. I believe in this mission, and I believe in this team — not because things are easy, but because you’ve shown who you are when they’re not.

With appreciation,  
[Your Name]  
[Your Title]

---

If you tell me a bit more about:  
- What “difficult” looked like this quarter (funding? program outcomes? staff transitions?) and  
- The tone you want (more vulnerable, more upbeat, more formal/informal),  

I can tailor this into a version that fits your organization and your voice exactly.

### **B. CogMyra Guide GPT Response**
Here’s a motivational email with grounded leadership and warmth:
Acknowledge difficulty.
Affirm effort and meaning.
Highlight 2–4 wins.
Give a forward path.
Close with appreciation.
(Then full email text.)

---

# End of Test Set
