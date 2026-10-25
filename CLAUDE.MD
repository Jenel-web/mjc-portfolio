# Portfolio User Scenarios

This file describes the real people who open Mark Jenel Cortas's portfolio, what they're thinking, and what makes them stay or leave. Read it before designing, writing copy or building any section. Every decision should serve at least one of these people. If a choice serves none of them, cut it.

## Who Mark is (context for every decision)

- IT student at the Polytechnic University of the Philippines, open to internships.
- Builds web and mobile apps end to end: Spring Boot, React, Next.js, Flutter, Supabase.
- Focused on generative AI and AI-assisted development.
- Hook: _"Good software starts with a bad experience. I turn pain points into web and mobile apps that solve them."_
- Projects: Countdown Math Arena (real-time multiplayer math game), EconLens (makes economic news easier to understand), Pag-IBIG Housing Loan app (loan filing and amortization preview).

---

## Scenario 1: The recruiter skimming between tasks

**Who they are:** A tech recruiter or HR staff member at a company hiring interns. Often not an engineer. Has 40 applications open and is reviewing yours on a phone or a second monitor.

**Why they're here:** Your link was on your resume or LinkedIn. They're doing a quick check before deciding whether to pass you to the engineering team.

**What they're actually thinking:**

> "I have about 30 seconds for this. Is he a real candidate or just another template? What role is he going for? Is he available, and when? Where's the resume? I don't know what Supabase is, so just show me he's built something that works."

**What they need to see (in the first screen):**

- His name, the role he wants and "open to internships" without scrolling.
- A resume button that opens or downloads immediately.
- One sign of real work, like a project screenshot or a short result line.
- A professional photo, so he feels like a real person.

**What makes them leave:**

- A slow load or a big animation before any content appears.
- Not being able to tell what role he wants.
- A resume link that's broken, hidden or asks them to sign in.
- Placeholder images or lorem ipsum text. These read as "unfinished" or "not serious."
- Walls of jargon with no plain-English explanation.

**Design implications:** The hero must work on a phone. The resume button goes in the hero. Project cards need one plain-language line that a non-engineer understands.

---

## Scenario 2: The engineering lead checking if he can actually build

**Who they are:** A senior developer or engineering manager. The recruiter forwarded the profile, and now they decide whether Mark gets an interview.

**Why they're here:** To judge real skill. They've seen hundreds of student portfolios and can spot a tutorial clone or a template instantly.

**What they're actually thinking:**

> "Every student says 'fullstack.' Show me a hard problem you solved. How did you handle real-time sync in that game? Is the code on GitHub clean? Did you write tests? If you used AI, do you understand what it wrote? Is this a to-do app with a new name?"

**What they need to see:**

- Projects as short case studies: the problem, his role, key technical decisions and the result.
- A specific hard part per project, such as "kept two players' timers in sync over Socket.io" or "calculated monthly amortization server-side with Spring Boot."
- Working GitHub and live demo links. Readable READMEs.
- Honest framing of AI use: AI as a tool he directs, with him owning the architecture and debugging.
- Skills shown in context ("used in"), not as a keyword list.

**What makes them leave:**

- Skill-chip walls with 20 technologies and no evidence.
- Projects that are only screenshots with no explanation of how they work.
- Dead demo links or empty repos.
- Overclaims like "expert" or "senior-level" from a student.
- Vague copy like "I build scalable, robust solutions."

**Design implications:** Give the best project the most space. Each project gets a "how it works" or "hardest part" line. Fold skills into projects where possible.

---

## Scenario 3: The founder or small business looking for a builder

**Who they are:** A startup founder, small business owner or someone with an idea who needs an app built. Clicked "Work With Me."

**Why they're here:** They have a problem and want to know if Mark can turn it into a working product, and whether he's easy to work with.

**What they're actually thinking:**

> "I don't care about the framework. I care whether he gets my problem and finishes things. Has he built something real people use? Will he communicate well, or vanish halfway? How do I reach him, and how fast will he reply?"

**What they need to see:**

- The "pain point to solution" story, which is exactly Mark's hook. Each project should start with the problem it solves for a real person.
- Finished, usable products (live demos), not just code.
- Signs of reliability: how he works, how he communicates, what the process looks like.
- A simple contact path: email, a short form or a booking link, plus expected response time.

**What makes them leave:**

- Purely technical copy that ignores the user's problem.
- No clear way to contact him, or a form that feels like it goes nowhere.
- Unfinished projects or "coming soon" sections.
- A site that feels like it was made for recruiters only.

**Design implications:** Lead each project with the problem, not the stack. The contact section should be direct and friendly, with one obvious action.

---

## Scenario 4: The interviewer preparing for a call

**Who they are:** The person who will interview Mark later today or tomorrow. Opens the portfolio 10 minutes before the call.

**Why they're here:** To find talking points and decide what to ask.

**What they're actually thinking:**

> "What should I ask him about? Which project is he proudest of? What's he curious about outside of code? Is there something that makes him different from the other three candidates I'm talking to this week?"

**What they need to see:**

- A clear "flagship" project that invites questions.
- Personality in the About section: his interest in how the human mind and the economy work, and how that led to EconLens. This gives an easy, human opening question.
- His point of view on software ("great software comes from understanding people").
- What he's working on or learning right now, so the site feels current.

**What makes them leave (or go in unimpressed):**

- An About section that repeats the hero or only lists facts.
- Nothing personal or memorable, so he blends into the other candidates.
- Outdated content, such as an old "currently learning" line or a stale year.

**Design implications:** The About section needs one genuinely personal, specific detail. Include a "currently building / learning" line and keep it updated.

---

## Rules to avoid a generic portfolio

These patterns make a portfolio look AI-generated or template-made. Avoid them unless there's a specific reason.

**Copy**

- No "passionate," "dedicated," "hardworking," "scalable, robust solutions" or "turning ideas into reality."
- No overclaims ("expert," "10x," "senior-level") for a student.
- Every claim should be backed by a project, a number or a link.
- Write like Mark talks: confident, plain, specific.

**Layout and visuals**

- No three identical cards in a row as the main project layout. Give the flagship project more space.
- No equal visual weight everywhere. One thing per section should clearly dominate.
- No placeholder photos or silhouettes, ever.
- No 20-chip skill walls. Group skills by use, or attach them to projects.
- Avoid copying the default "dark navy, orange accent, `// section` labels" look without a reason. If a style is kept, it should support one distinctive idea, not be the whole identity.

**Content**

- Every project answers: what problem, for whom, what Mark built, what was hard, and the result.
- Use real screenshots or short screen recordings, not mockup stock images.
- Links must work. Test demos and GitHub links before every deploy.

**The distinctive idea**
Mark's site should have one thing only he would have. Candidates:

- The "pain point to solution" thread running through every section (each project opens with the bad experience it fixes).
- A large cutout photo as the hero's centerpiece.
- A small playable element from Countdown Math Arena.

Pick one and commit to it.

---

## Quick check before shipping any section

1. Would the recruiter understand it in 5 seconds on a phone?
2. Would the engineering lead find evidence, not claims?
3. Would the founder see a problem being solved?
4. Would the interviewer find something to ask about?
5. Could this section appear on any other student's portfolio unchanged? If yes, rewrite it.
