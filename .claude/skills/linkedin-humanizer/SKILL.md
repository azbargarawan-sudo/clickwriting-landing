---
name: linkedin-humanizer
description: >-
  Remove AI-writing tells from LinkedIn posts, comments, About sections and
  recommendations, and write new LinkedIn text that reads like a real person
  typed it on their phone. Covers both generic AI tells (em dashes, "delve",
  rule of three, "it's worth noting") and LinkedIn's own cliches ("thrilled to
  announce", "Agree?", emoji bullets, broetry, hashtag stuffing). Works in
  English, Hebrew and Arabic. Use whenever the user pastes a LinkedIn post or
  draft, asks to "humanize" or "make it not sound like AI", says "פוסט
  ללינקדאין", "שלא יישמע כמו AI", "منشور لينكدإن", "خليه ما يبين AI",
  "إزالة علامات الذكاء الاصطناعي", or invokes /linkedin-humanize. Also use
  when asked to write a LinkedIn post from scratch, even if nobody mentions AI.
---

# LinkedIn Humanizer

This skill extends `humanizer`. Everything in the base humanizer still holds
(no em dashes, no filler, no AI vocabulary, vary rhythm, be concrete). On top
of that, LinkedIn has grown its own dialect of fake writing, and most of it was
there before AI. A post can pass every generic humanizer check and still scream
"LinkedIn bot". This skill catches both layers.

When both skills could apply to LinkedIn text, follow this one.

Do not announce in the output that you humanized anything. Just hand back the
post.

## The one rule

Write like one specific person telling one specific colleague something they
actually noticed this week. Not an inspirational speaker. Not a brand. Not a
helpful assistant summarizing a topic.

If the post could have been written by anyone in the industry, it fails.

## Three input modes

1. **Rewrite.** The user pastes an AI-generated or AI-sounding post. Rewrite
   it fully. Keep the facts, the names, the numbers and the point. Change
   everything else as needed.
2. **Light edit.** The user pastes their own draft and asks you to check it.
   Keep their voice. Fix only real tells. If they write short and blunt, stay
   short and blunt. List what you changed in one short paragraph after the
   post, no table.
3. **Write from scratch.** The user gives a topic, a story or bullet notes.
   Write the post humanized from the first line. Ask one question at most if
   the notes are missing the one concrete detail the post needs (a number, a
   name, what actually happened). Otherwise just write.

## Hard bans: generic AI tells

Short version of the base humanizer. Treat each as a hard stop.

- Em dashes (—) and en dashes (–) as separators. Use a comma, a period, or
  split the sentence.
- Filler: "it's worth noting", "it's important to note", "in today's
  fast-paced world", "at the end of the day", "that being said".
- AI vocabulary: delve, leverage, utilize, navigate, foster, unpack, tap into,
  landscape, journey, tapestry, testament, game-changer, pivotal, crucial,
  robust, seamless, holistic, nuanced.
- The rule of three ("clear, concise, and compelling"). Use one, two, or four.
- "Not only X but also Y". "It's not just X, it's Y". Two plain sentences.
- Mechanical paragraph openers: Furthermore, Moreover, Additionally.
- Closing summaries: "In conclusion", "Ultimately", "Overall".
- Fake enthusiasm and hedging everything.

The full trilingual list is in `references/tells.md`. Load it when you scan.

## Hard bans: LinkedIn tells

These are what makes a post read as LinkedIn-generated even when the grammar
is human. Full catalog with Hebrew and Arabic equivalents in
`references/tells.md`.

**Announcement openers**
- "I'm thrilled / excited / humbled / honored to announce"
- "Big news!", "Some personal news", "I'm beyond grateful"
- "After X incredible years at..."
- Hebrew: "נרגש/ת לשתף", "גאה לבשר", "אחרי X שנים מדהימות ב"
- Arabic: "يسعدني أن أشارككم", "فخور بالإعلان", "بكل فخر واعتزاز"

**Engagement bait**
- "Agree?", "Thoughts?", "Let that sink in.", "Read that again."
- "Repost if this resonated", "Tag someone who needs to hear this"
- "Follow me for more", "PS: I help X do Y. DM me."
- "Unpopular opinion:", "Hot take:", "Nobody talks about this:"
- Hebrew: "מסכימים?", "שתפו אם", "תייגו מישהו ש", "מה דעתכם?" as a reflex
- Arabic: "هل توافقون؟", "شاركوني رأيكم", "أعد قراءتها مرة أخرى"

**Fake story arcs**
- "A year ago I was X. Today I'm Y." with no middle.
- Rejection to triumph in three beats. "They said no. I kept going. Now..."
- "I failed. Here's what I learned:" followed by a numbered list of generic
  lessons.
- Invented dialogue with a mentor, a CEO, a cab driver, a child, that exists
  only to deliver the moral.
- Vulnerability as a formula: "I don't usually share this, but..."

**Formatting tells**
- Broetry: every sentence on its own line, for the entire post.
- Emoji bullets (🚀 ✅ 💡 👉 🔥) at the start of lines.
- Bold or fake-bold unicode text. LinkedIn has no markdown, so any **bold**
  or ### header in a draft is a tell by itself.
- Hashtag stuffing: more than three, or hashtags inside sentences.
- "Here's the thing:" / "The best part?" / "The result:" as one-line
  paragraphs setting up a reveal.
- "That's it. That's the post."
- Ending with a one-line moral in sentence case like a poster.

**Vocabulary that only exists on LinkedIn**
- synergy, thought leader, rockstar, ninja, growth mindset, circle back,
  move the needle, value-add, disruptive, passionate about, servant leader,
  people-first, authentic (as a self-description), grateful (as a closer)
- Hebrew: "לייצר ערך", "לייצר אימפקט", "משמעותי" as filler, "בעידן
  הדיגיטלי", "חשוב לציין", "מהווה", "לקחת אחריות" as a slogan
- Arabic: "نقلة نوعية", "رحلة", "شغف", "بصمة", "تمكين", "ريادة",
  "استثنائي", "في عالم اليوم سريع التغير", "جدير بالذكر", "تجدر الإشارة",
  "يلعب دوراً محورياً"

## What a real LinkedIn post does

Keep these. They are not tells, they are what works on the platform.

- **One idea.** A post is one observation, one story or one opinion. Two
  ideas means two posts.
- **A hook that is a fact, not a tease.** The first line is cut off after
  about 200 characters on desktop and two to three lines on mobile. Put the
  concrete thing there: the number, the name, the thing that happened.
  "We lost our biggest client on a Tuesday" beats "Something happened last
  week that changed how I think about clients."
- **Short paragraphs, but paragraphs.** One to three sentences each, with a
  blank line between. This is how LinkedIn is read on a phone. It is not
  broetry as long as the sentences within a paragraph connect.
- **Concrete details.** Dates, amounts, names of tools, what someone said
  word for word. "Three people quit in March" over "we had retention
  challenges."
- **An actual opinion.** The writer thinks something. Say it without "I
  might be wrong, but".
- **An ending that stops.** End on the last concrete sentence, or on one
  genuine question the writer actually wants answered. Not a moral, not a
  summary, not a CTA.
- **Rhythm.** Long sentence, long sentence, short one. A fragment sometimes.
  Starting with "And" or "But" is fine.
- **Imperfection.** A small aside in parentheses. A repeated word. A
  self-correction ("well, almost"). Real people do this.
- **Hashtags**, if the writer uses them: up to three, at the very end, on
  their own line, specific rather than #Leadership #Growth #Success.
- **Emoji**, if the writer uses them: one, maybe two, inside the text where a
  person would put one. Never as bullets.

## Procedure

1. **Read the whole thing first.** Find the one real point and the one real
   detail. If there is no real detail, that is the main problem, not the
   vocabulary. Ask for it (mode 3) or flag it (mode 2).
2. **Detect language and register.** English, Hebrew or Arabic. For Hebrew
   and Arabic, match the register the user writes in. Israeli LinkedIn is
   spoken Hebrew, not newspaper Hebrew. Arabic LinkedIn varies by country.
   If the user writes in dialect, keep dialect touches; if they write MSA,
   write clean, light MSA, not sermon MSA. Full notes in
   `references/tells.md`.
3. **Scan.** Load `references/tells.md`. Mark every hit in both layers
   (generic AI, LinkedIn).
4. **Rewrite.** Open with the concrete thing. Cut every hit. Replace
   abstractions with specifics from the source. Break list structures into
   sentences unless the content is truly a list. Vary sentence length on
   purpose.
5. **Audit pass.** Reread the new text as a stranger scrolling on a phone.
   Ask: could I name the person who wrote this? Is there a line I have seen
   on LinkedIn a hundred times? Fix it. Then run the self-check below.
6. **Deliver.** Plain text, ready to paste. No markdown, no headers, no bold.
   In mode 2, add one short paragraph on what you changed and why.

## Length

LinkedIn allows 3,000 characters. Most good posts are 600 to 1,300. Match
what the source needs. Do not pad a two-paragraph thought into eight
paragraphs, and do not cut a real story short to hit a number.

## Language notes

**English.** Contractions are normal. "I'm", "we'd", "didn't". Sentence
fragments are fine. Avoid the LinkedIn-American register of "folks",
"super excited", "incredible humans" unless the writer actually talks that
way.

**Hebrew.** Spoken Hebrew. "כאילו", "בקיצור", "האמת", "לא יודע/ת", "נו".
Not "הינו", "מהווה", "ניתן לראות", "יש לציין". Gender: match the writer.
If unknown, ask once or write in first person so it does not matter.
Hebrew LinkedIn posts that sound like a press release from a startup
("גאים להכריז על גיוס") are the local version of "thrilled to announce".
Write it as someone telling a friend: "סגרנו סבב. לקח שנה וחצי."

**Arabic.** Avoid stiff فصحى with ornamental sentence openers ("لا يخفى على
أحد", "من نافلة القول"). Avoid the "rhetorical pairs" habit (العمل الجاد
والمثابرة، النجاح والتميز). One noun is enough. Keep verbs active and early.
If the user writes Palestinian or Levantine dialect, keep the post in a
light dialect-flavored register (شو، هيك، كتير) the way people actually post.
If they write MSA, write short MSA sentences without the preaching tone.
Never add diacritics the user did not use.

**Transliteration and mixing.** Israeli and Arab LinkedIn posts mix in
English terms (פיצ'ר, דדליין, feedback, deadline). Keep that. Do not
translate "sprint" to "ספרינט" if the user wrote "sprint" in Latin letters.

## Examples

One per language. More in `references/examples.md`.

**English, before:**
> I'm thrilled to announce that after an incredible journey, I've decided to
> embark on a new chapter! 🚀 Over the past 5 years, I've had the privilege
> of working alongside some truly amazing humans. Here's what I learned:
> ✅ Growth happens outside your comfort zone ✅ Your network is your net
> worth ✅ Never stop learning. Grateful for every lesson. Onwards! Agree?
> #Leadership #Growth #NewBeginnings

**English, after:**
> Friday was my last day at Meridian. Five years, three managers, one office
> move and a product I still think about when I can't sleep.
>
> The thing I'll take with me isn't a lesson, it's a habit. Dana made me
> write down what I expected to happen before every launch, then compare it
> after. I was wrong about 70% of the time. That number went down. Slowly.
>
> Starting at Kilo in two weeks. Smaller team, same problem space. If you
> work on payments infrastructure and want to argue about it, I'm around.

**Hebrew, before:**
> נרגשת לשתף שאחרי 4 שנים מדהימות אני מסיימת את התפקיד שלי! 💫 הייתה לי
> הזכות לעבוד עם אנשים יוצאי דופן וללמוד המון. חשוב לציין שהצמיחה האמיתית
> מתרחשת מחוץ לאזור הנוחות. תודה לכל מי שהיה חלק מהמסע הזה. מסכימים?

**Hebrew, after:**
> אתמול החזרתי את הלפטופ. ארבע שנים ב-Wix, שלושה צוותים, ופרויקט אחד
> שעדיין לא ברור לי איך הוא יצא לאוויר בזמן.
>
> מה שאני לוקחת: יונתן לימד אותי לשלוח את הגרסה הלא מושלמת ביום רביעי
> במקום את המושלמת ביום שני. לקח לי שנה להפסיק להתווכח איתו על זה.
>
> מתחילה משהו חדש בעוד שבועיים, פרטים כשיהיה מה לספר.

**Arabic, before:**
> يسعدني أن أشارككم أنني بعد رحلة استثنائية استمرت خمس سنوات، قررت أن أبدأ
> فصلاً جديداً في مسيرتي المهنية. 🚀 كان لي شرف العمل مع فريق رائد ومتميز.
> تجدر الإشارة إلى أن النمو الحقيقي يحدث خارج منطقة الراحة. ممتن لكل من كان
> جزءاً من هذه الرحلة. هل توافقون؟

**Arabic, after:**
> الخميس كان آخر يوم لي في أرامكس. خمس سنوات، ثلاثة مدراء، ومشروع واحد ما
> زلت أفكر فيه قبل النوم.
>
> أكثر شيء بقي معي مش درس، عادة. سمر كانت تخليني أكتب شو متوقع يصير قبل
> كل إطلاق، وبعدين نقارن. كنت غلطان بحوالي ٧٠٪ من المرات. الرقم نزل مع
> الوقت. ببطء.
>
> بعد أسبوعين أبدأ في مكان جديد. فريق أصغر، نفس المجال. إذا بتشتغل على
> أنظمة الدفع وبدك تتناقش، أنا موجود.

Notice what the rewrites do: a real day, a real company, a real person's
name, one number, a habit instead of a lesson, and an ending that stops.

## Self-check before delivering

1. Any em dash, emoji bullet, markdown or fake-bold? Kill it.
2. Could the first line be the first line of a thousand other posts? Rewrite
   it with the concrete detail.
3. Is there a question, CTA or moral at the end? Cut it, unless the writer
   genuinely wants an answer to one specific question.
4. Count the lists of three. Break them.
5. Is every sentence its own paragraph? Merge some.
6. Is there at least one name, number, date or quoted line? If not, go back
   to the source or ask.
7. Read it in the writer's voice. Does it sound like them, or like LinkedIn?

If it passes all seven, send it.
