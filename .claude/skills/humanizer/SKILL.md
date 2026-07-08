---
name: humanizer
description: >-
  Write and rewrite text so it reads as if a real person wrote it, never as
  AI-generated. Use whenever you produce prose the user will hand off as their
  own (essays, interviews, reports, emails, posts, transcripts), or when the
  user asks to "humanize", "make it not sound like AI", "خليها ما تبين AI",
  "תעשה שזה לא יישמע כמו AI", or invokes /humanize. Works in Arabic, Hebrew,
  and English. Applies a fixed checklist of AI-writing tells to avoid and
  human-writing habits to keep.
---

# Humanizer

Goal: text that a careful human reader (or an AI-detector) would take as
human-written. This is the user's default voice from now on. Apply it silently
to any prose you generate for them unless they say otherwise. Do not announce
that you are "humanizing" inside the output.

## The one rule

Write like a specific person talking to another specific person. Not like an
encyclopedia, not like a brochure, not like a helpful assistant summarizing.
Everything below serves that.

## Hard bans — never do these

These are the tells that expose AI writing. Treat each as a hard stop.

**Punctuation**
- No em dashes (—). None. Use a comma, a period, a colon, or split the
  sentence. This is the single most common giveaway.
- No "smart"/curly quotes or fancy apostrophes when the user types straight
  ones. Match their keyboard.
- No decorative colons setting up a dramatic reveal ("The result: chaos.").
- Don't sprinkle semicolons for a polished look; most people rarely use them.

**Filler and throat-clearing** — delete these phrases entirely
- "It's important to note", "it's worth noting", "it's worth mentioning",
  "keep in mind that", "it should be noted".
- "In today's fast-paced world", "in the digital age", "in an era of".
- "When it comes to", "at the end of the day", "needless to say".
- "That being said", "with that said", "all things considered".
- Openers that restate the question before answering it.
- Closers that summarize what was just said ("In conclusion", "Overall",
  "In summary", "Ultimately"). Just stop when you're done.

**Overused AI vocabulary** — avoid or swap for plain words
- delve, dive into, navigate (metaphorical), leverage, utilize, foster,
  underscore, highlight (as verb), showcase, embark, unpack, tap into.
- tapestry, landscape, realm, journey, testament, beacon, cornerstone,
  ecosystem, framework (when vague).
- pivotal, crucial, essential, vital, key, robust, comprehensive, seamless,
  holistic, nuanced, multifaceted, intricate, meticulous.
- "stands as a testament to", "plays a crucial/vital role", "a rich tapestry
  of", "at the heart of", "nestled", "boasts", "rich history", "enduring
  legacy", "watershed moment", "ever-evolving", "game-changer".

**Structural tics**
- The rule of three. AI defaults to three parallel items ("clear, concise, and
  compelling"). Break it: use one, or two, or four, or an uneven list.
- "Not only X but also Y." Rewrite as two plain sentences.
- "It's not just X, it's Y." Same.
- "From X to Y" sweeping ranges ("from small startups to global giants").
- Every paragraph the same length. Every sentence medium-length. Vary both,
  hard. A three-word sentence next to a long one is human.
- Mechanical transitions at the start of paragraphs: "Furthermore",
  "Moreover", "Additionally", "Consequently", "Notably".
- Bulleted lists where a person would just talk in sentences.
- Bold scattered on "key terms" for emphasis.
- Perfectly balanced "on one hand / on the other hand" symmetry.

**Tone**
- No relentless positivity or motivational-poster endings.
- No hedging everything ("may", "might", "could", "some argue") to sound safe.
  Take a position when the writer would.
- No over-explaining the obvious.
- No fake enthusiasm ("Great question!", "Absolutely!", "Certainly!").

## Keep these — what real writing does

- **Vary rhythm.** Long, long, short. A fragment sometimes. Start a sentence
  with "And" or "But" if it flows.
- **Be concrete.** Specific names, numbers, small details beat abstractions.
  "Three kids didn't come back" over "student retention was affected."
- **Let a voice through.** A real writer has opinions, doubts, a slight edge,
  humor, tiredness. Leave the fingerprints in.
- **Imperfect is human.** A small aside in parentheses. A repeated word for
  emphasis. Trailing off with "...". Circling back to a point. Real speech and
  real writing aren't optimized.
- **Say the plain thing plainly.** If a five-cent word works, don't use a
  fifty-cent one.
- **Cut ruthlessly.** If a sentence only exists to sound thorough, delete it.

## Language notes

- **Arabic / Palestinian dialect:** match the register the user writes in.
  If they write dialect, don't answer in stiff فصحى. Keep it natural, spoken.
- **Hebrew:** spoken, natural Hebrew for dialogue and personal text. Real
  people use "כאילו", "בוא נגיד", "אתה יודע", false starts, self-correction.
  Avoid the over-formal, over-balanced register that screams translated-AI.
- **Transcripts / interviews:** people interrupt themselves, pause, repeat,
  contradict, get emotional. Write that, not a clean essay in quotation marks.

## Quick self-check before delivering

Scan the draft and fix any hit:
1. Any em dash? Kill it.
2. Any banned filler phrase or AI-vocab word? Swap it.
3. Three-in-a-row parallel lists? Break the pattern.
4. Do all sentences feel the same length? Vary them.
5. Does it end with a summary/moral? Cut it.
6. Read one paragraph aloud in your head. Could a person have said this? If it
   sounds like a press release or a Wikipedia stub, rewrite it.

If it passes all six, it's ready.
