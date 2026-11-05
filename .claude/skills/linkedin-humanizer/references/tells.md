# Tells catalog: English, Hebrew, Arabic

Reference for `linkedin-humanizer`. Load during the scan step. Two layers:
generic AI tells (layer A) and LinkedIn tells (layer B). A post needs to be
clean on both.

Each entry: what to flag, why it reads as fake, and what to do instead.
Replacements are suggestions. The best replacement is usually a concrete
detail from the source, not a synonym.

Contents
1. Layer A: generic AI tells (EN / HE / AR)
2. Layer B: LinkedIn tells (EN / HE / AR)
3. Structural and formatting tells (language-independent)
4. Register notes per language
5. Things that look like tells but are not

---

## 1. Layer A: generic AI tells

### 1.1 Punctuation and typography

| Flag | Why | Do instead |
|---|---|---|
| Em dash — , en dash – as separator | The single most reliable AI marker in 2025-2026 text | Comma, period, colon, or split the sentence |
| Low German-style quotes „ " in Hebrew | Machine default, no Israeli types them | Straight quotes " " |
| Semicolons every paragraph | Looks polished, almost nobody posts like that | Period |
| Colon before a one-word reveal ("The result: chaos.") | Dramatic setup pattern | Say the sentence |
| Ellipsis used as suspense before a reveal | Same | Cut or use once, as trailing off |

### 1.2 Filler and throat-clearing

**English:** it's worth noting, it's important to note, keep in mind that,
it should be noted, in today's fast-paced world, in the digital age, in an
era of, when it comes to, at the end of the day, needless to say, that being
said, with that said, all things considered, in conclusion, overall, in
summary, ultimately, to sum up.

**Hebrew:** חשוב לציין, יש לציין, ראוי לציין, כדאי לציין, יצוין ש, נדגיש ש,
בעידן הדיגיטלי, בעידן המודרני, בעולם של היום, בימינו אנו, בסופו של יום,
בשורה התחתונה, לסיכום, לסיום, אם לסכם, יתרה מכך, יתרה מזאת, זאת ועוד,
יחד עם זאת (as a paragraph opener), מעבר לכך, לא זו בלבד.

**Arabic:** جدير بالذكر, تجدر الإشارة إلى, من الجدير بالذكر, لا يخفى على
أحد, من نافلة القول, مما لا شك فيه, في عالم اليوم سريع التغير, في عصر
التكنولوجيا, في ظل التطورات المتسارعة, في نهاية المطاف, في الختام, خلاصة
القول, وفي هذا السياق, علاوة على ذلك, بالإضافة إلى ذلك (as opener), ومن هنا,
وعليه.

Do instead: delete. If the sentence falls apart without it, the sentence had
no content.

### 1.3 AI vocabulary

**English:** delve, dive into, deep dive, navigate (metaphorical), leverage,
utilize, foster, underscore, highlight (verb), showcase, embark, unpack, tap
into, harness, empower, elevate, streamline, spearhead, tapestry, landscape,
realm, journey, testament, beacon, cornerstone, ecosystem, framework (vague),
paradigm, pivotal, crucial, essential, vital, key, robust, comprehensive,
seamless, holistic, nuanced, multifaceted, intricate, meticulous, transformative,
game-changer, ever-evolving, stands as a testament to, plays a crucial role,
at the heart of, a rich tapestry of, watershed moment.

**Hebrew:** מהווה / להוות / הינו / הינה (inflated copula), משמש כ, מתאפיין ב,
לייצר ערך / תוכן / חיבור / תחושה (לייצר for abstract objects; use ליצור,
להפיק, לעורר), משמעותי as a filler adjective, באופן משמעותי, באופן יחסי,
בצורה עקבית, ניתן ל (when אפשר works), לצלול לעומק, לשנות את כללי המשחק,
כאן נכנס לתמונה, מחוץ לקופסה, פורץ דרך, רב עוצמה, חוויה ייחודית, אבן דרך
(when nothing happened), אקוסיסטם, מסע (as metaphor for a job), ייחודי,
חדשני, מוביל, אסטרטגי as filler.

**Arabic:** يُعتبر / يُعد (as empty copula), يلعب دوراً محورياً / حيوياً /
هاماً, يشكّل, يساهم بشكل كبير, رحلة (for a job or a project), شغف, بصمة,
تمكين, ريادة, ريادي, رائد, استثنائي, نقلة نوعية, خارطة طريق, منظومة
متكاملة, نسيج, بيئة خصبة, آفاق, تعزيز, ترسيخ, مواكبة, الارتقاء بـ, سلس,
شامل, متكامل, متميز, فعّال as filler, تسليط الضوء على, الغوص في, استكشاف
(metaphorical), بوصلة, حجر الزاوية, منارة, نسج.

Do instead: the plain word, or the specific thing. "Leverage our network" is
"ask people we know". "رحلة التعلم" is "السنتين اللي قضيتهم أتعلم".

### 1.4 Structural tics

- **Rule of three.** "Clear, concise, and compelling." Hebrew: "מהיר, יעיל
  ונוח". Arabic: "الجودة والسرعة والدقة". Use one, two or four. Uneven is
  human.
- **Not only X but also Y.** Hebrew: "לא רק X אלא גם Y". Arabic: "ليس فقط X
  بل أيضاً Y". Two plain sentences.
- **It's not X, it's Y.** Hebrew: "זה לא X, זה Y". Arabic: "الأمر لا يتعلق
  بـ X بل بـ Y". Say what it is.
- **From X to Y sweeping ranges.** "From startups to Fortune 500s." "מסטארטאפים
  ועד תאגידים." "من الشركات الناشئة إلى الكبرى."
- **Rhetorical pairs in Arabic.** العمل الجاد والمثابرة, النجاح والتميز,
  الإبداع والابتكار, الخبرة والكفاءة. One noun.
- **Mechanical transitions.** Furthermore, Moreover, Additionally,
  Consequently, Notably. Hebrew: בנוסף, יתרה מכך, כמו כן at paragraph
  start. Arabic: علاوة على ذلك, بالإضافة إلى ذلك, وبالتالي, ومن ثم at
  paragraph start.
- **Heading echo.** First sentence restates the title or the hook.
- **Bold-term lists.** "* **Consistency:** being consistent matters."
- **Balanced on-one-hand / on-the-other-hand.**
- **Uniform paragraph and sentence length.**

### 1.5 Tone

- Relentless positivity, motivational ending.
- Hedging everything: may, might, could, some argue, in many cases.
- Over-explaining the obvious.
- Fake enthusiasm: Great question! Absolutely! Hebrew: שאלה מעולה! בהחלט!
  Arabic: سؤال رائع! بالتأكيد!
- Service closers: "Hope this helps", "אשמח לעזור", "أتمنى أن يكون هذا
  مفيداً".

---

## 2. Layer B: LinkedIn tells

### 2.1 Announcement openers

| English | Hebrew | Arabic |
|---|---|---|
| I'm thrilled / excited / humbled / honored / delighted / proud to announce | נרגש/ת לשתף, נרגש/ת לבשר, גאה לבשר, שמח/ה לשתף, גאים להכריז | يسعدني أن أشارككم, يسرني أن أعلن, فخور بالإعلان, بكل فخر واعتزاز, يشرفني |
| Big news! / Some personal news | חדשות גדולות! / קצת חדשות אישיות | خبر سعيد / بشرى |
| After X incredible / amazing years at | אחרי X שנים מדהימות / מופלאות ב | بعد X سنوات رائعة / استثنائية في |
| I'm beyond grateful / so grateful | אסיר/ת תודה, מלא/ת הכרת תודה | ممتن للغاية, كلي امتنان |
| New chapter / next chapter | פרק חדש, פותח/ת פרק חדש | فصل جديد, مرحلة جديدة |
| I'm happy to share that | שמח/ה לשתף ש | يسعدني أن أخبركم |

Do instead: say what happened, with the day and the place. "Friday was my
last day at X." "אתמול החזרתי את הלפטופ." "الخميس كان آخر يوم لي في X."

### 2.2 Engagement bait

| English | Hebrew | Arabic |
|---|---|---|
| Agree? / Thoughts? / What do you think? (reflex) | מסכימים? / מה דעתכם? / מה אתם חושבים? | هل توافقون؟ / ما رأيكم؟ / شاركوني رأيكم |
| Let that sink in. / Read that again. | תנו לזה לשקוע. / תקראו את זה שוב. | دع هذا يترسخ. / أعد قراءتها. |
| Repost if this resonated / Share if you agree | שתפו אם זה מדבר אליכם | شارك إذا أعجبك / أعد النشر |
| Tag someone who needs to hear this | תייגו מישהו שצריך לשמוע את זה | ضع إشارة لشخص يحتاج هذا |
| Follow me for more / Ring the bell | עקבו אחריי לעוד תוכן | تابعني للمزيد |
| PS: I help X do Y. DM me. | נ.ב. אני עוזר/ת ל-X לעשות Y. דברו איתי. | ملاحظة: أساعد X على Y. راسلني. |
| Unpopular opinion: / Hot take: / Controversial: | דעה לא פופולרית: / הולך/ת להיות לא פופולרי/ת | رأي غير شائع: / رأي قد لا يعجب البعض: |
| Nobody talks about this: / This is your sign | אף אחד לא מדבר על זה: / זה הסימן שלכם | لا أحد يتحدث عن هذا: / هذه إشارتك |
| Stop doing X. Start doing Y. | תפסיקו X. תתחילו Y. | توقف عن X. ابدأ بـ Y. |
| Comment "YES" and I'll send it | תגיבו "כן" ואשלח | اكتب "نعم" في التعليقات |

Do instead: end on the last concrete sentence. If the writer really wants an
answer, ask one specific question with a specific object: "Has anyone shipped
Stripe Connect in Israel without a local entity?" not "Thoughts?"

### 2.3 Fake story arcs

- **A year ago / today.** "A year ago I was unemployed. Today I lead a team of
  40." No middle, no cost. Hebrew: "לפני שנה הייתי... היום אני...". Arabic:
  "قبل سنة كنت... اليوم أنا...".
- **Rejection to triumph in three beats.** They said no. I kept going. Now I
  run the place.
- **Here's what I learned.** Followed by three to five generic lessons. Hebrew:
  "מה למדתי:". Arabic: "ماذا تعلمت:" / "الدروس المستفادة:".
- **The cab driver / the barista / my 6-year-old taught me.** Dialogue that
  exists only to deliver a moral.
- **Vulnerability as formula.** "I don't usually share this, but", "This is
  hard to write". Hebrew: "לא נוהג/ת לשתף דברים כאלה, אבל". Arabic: "لا
  أعتاد مشاركة هذا، لكن".
- **The humble brag.** "I was so surprised when Forbes called."
- **The fake failure.** "I failed. My failure was caring too much."

Do instead: one real event, in order, with the boring parts that make it
true. What day. Who said what. What it cost. What you still don't know.

### 2.4 Formatting tells

- **Broetry.** Every sentence on its own line, for the whole post. Real people
  write a few sentences together and then break.
- **Emoji bullets.** 🚀 ✅ 💡 👉 🔥 ⭐ 📌 at the start of lines.
- **Emoji after every sentence.**
- **Markdown or fake bold.** ** **, ### headers, 𝗯𝗼𝗹𝗱 𝘂𝗻𝗶𝗰𝗼𝗱𝗲. LinkedIn
  renders none of this and the unicode kind breaks screen readers.
- **Hashtag stuffing.** More than three, or hashtags mid-sentence
  (#grateful for the #opportunity), or generic ones: #Leadership #Growth
  #Success #Motivation #Mindset. Hebrew: #מנהיגות #צמיחה #השראה. Arabic:
  #قيادة #نجاح #تطوير_الذات #إلهام.
- **One-line setup paragraphs.** "Here's the thing:" / "The best part?" /
  "The result:" / "And then it hit me." Hebrew: "והנה העניין:" / "החלק הכי
  טוב?" Arabic: "وهنا المفاجأة:" / "والأهم من ذلك؟"
- **That's it. That's the post.**
- **Poster-style moral as the last line.** "Be kind. Always." Hebrew: "תהיו
  טובים. תמיד." Arabic: "كن طيباً. دائماً."
- **ALL CAPS words for emphasis.** NEVER, ALWAYS, THIS.
- **Numbered listicle hooks.** "7 lessons from 7 years", "5 things I wish I
  knew". Hebrew: "7 דברים שלמדתי ב-7 שנים". Arabic: "٧ دروس من ٧ سنوات".

### 2.5 LinkedIn-only vocabulary

**English:** synergy, thought leader, thought leadership, rockstar, ninja,
guru, visionary, growth mindset, circle back, move the needle, value-add,
disruptive, disrupt, passionate about, servant leader, people-first,
authentic (self-described), vulnerable (self-described), humbled, grateful
(as a closer), impact (as a verb), impactful, learnings, ideate, bandwidth,
low-hanging fruit, north star, double down, lean in, superpower, 10x,
world-class, best-in-class, cutting-edge, next-level, incredible humans,
amazing team, dream team, family (for a company).

**Hebrew:** לייצר ערך, לייצר אימפקט, אימפקט, להשפיע (as the whole point of
a post), משמעותי, מסע, פרק, הזכות (הייתה לי הזכות), זכיתי ל, אנשים יוצאי
דופן, אנשים מדהימים, משפחה (for a workplace), צמיחה אישית, לצאת מאזור
הנוחות, לקחת אחריות (as slogan), מנהיגות, להוביל שינוי, חזון, ערכים
(without naming one), אקוסיסטם, סטארטאפ ניישן, לשבור את התקרה, לפרוץ
דרך, גאווה (as a closer), תודה ענקית.

**Arabic:** شغف, رحلة, بصمة, تمكين, ريادة, قيادة ملهمة, إلهام, نموذج
يحتذى به, قصة نجاح, تحقيق الذات, تطوير الذات, الخروج من منطقة الراحة,
التميز, الإبداع والابتكار, رؤية, قيم (without naming one), فريق استثنائي,
عائلة (for a workplace), امتنان, فخر, شرف, مسيرة, تحدي (as a noun for every
task), صناعة الفرق, إحداث فرق, ترك أثر, مواصلة العطاء.

Do instead: say what the person did. Not "led a cross-functional team to
drive impact" but "got sales and engineering to agree on one price list,
which took four months".

### 2.6 About-section and headline tells

- "Results-driven professional with a proven track record"
- "Helping X achieve Y through Z"
- "Passionate about building products people love"
- Pipe-separated keyword salad: "CEO | Founder | Speaker | Investor | Dad"
- Hebrew: "מנהל/ת מנוסה עם ניסיון מוכח", "עוזר/ת ל-X להשיג Y", "יזם/ית |
  מרצה | מנטור/ית"
- Arabic: "خبير في", "شغوف بـ", "أساعد X على تحقيق Y", "رائد أعمال | متحدث
  | مستشار"

Do instead: one sentence about what they actually do, one about for whom,
one specific thing they are working on now.

---

## 3. Structural and formatting tells (language-independent)

Signals that do not depend on vocabulary:

| Signal | How to spot it | Fix |
|---|---|---|
| Uniform paragraphs | Every paragraph is 1 sentence, or every one is 3 | Merge some, split one |
| Uniform sentence length | All sentences 12 to 20 words | Add a 4-word sentence and a 30-word one |
| Perfect enumeration | Exactly three items, parallel grammar | Two items, or four, uneven |
| Hook that is a tease | First line promises instead of states | Put the concrete fact first |
| Moral last line | Last line is shorter than the rest and contains no fact | Delete it. End on the previous line |
| No proper nouns | No names, companies, tools, places | Add from the source or ask |
| No numbers, or only round ones | "many", "countless", "100s", "10x" | A real number, even an odd one |
| Symmetric hedging | "On one hand... on the other hand" | Take the position |
| Dialogue that only delivers the lesson | Someone says exactly the moral | Cut the dialogue or make it real |

---

## 4. Register notes per language

### English
- Contractions always. "I am thrilled" is already a tell; "I'm" alone does
  not save it.
- American LinkedIn register ("folks", "super excited", "incredible humans",
  "y'all") only if the writer talks that way.
- British or Israeli-English writers tend to be drier. Keep that.

### Hebrew
- Spoken Hebrew is the LinkedIn register in Israel. Newspaper Hebrew (הינו,
  מהווה, ניתן, אשר, כאשר, על מנת, מבלי, במידה ו) reads as AI or as a
  government memo.
- Use: ש instead of אשר, כש instead of כאשר, כדי instead of על מנת, בלי
  instead of מבלי, אם instead of במידה ו, כי instead of מאחר ש.
- Natural spoken markers: בקיצור, האמת, כאילו (sparingly), נו, לא יודע/ת,
  בוא/י נגיד, טוב.
- Gender: match the writer. If unknown, ask once, or write in first-person
  past tense where it rarely matters.
- English loanwords in Latin or Hebrew letters are normal: פיצ'ר, דדליין,
  סטנדאפ, PR, sprint. Do not "fix" them.
- Startup press-release Hebrew ("גאים להכריז על סבב גיוס של", "מצטרפים
  למשפחת", "הצטרפות אסטרטגית") is the Israeli "thrilled to announce".

### Arabic
- The default AI failure in Arabic is sermon MSA: ornamental openers,
  rhetorical pairs, passive constructions, diacritics nobody typed.
- MSA writers: short sentences, verb early, one noun instead of a pair, no
  إنّ at every sentence start, no وقد for narrative.
- Dialect writers (Palestinian, Levantine, Egyptian, Gulf): keep the dialect
  flavor at the level they used. شو, هيك, كتير, بدي, ليش for Levantine. مش
  works across Levantine and Egyptian. Do not translate their dialect to MSA
  and do not invent dialect for an MSA writer.
- Mixed Arabic-English is normal in tech and business posts. Keep deadline,
  sprint, feedback, PR in Latin letters if that is how the writer had them.
- Numerals: match the writer (٧٠٪ or 70%).
- Religious formulas (الحمد لله, بفضل الله, ما شاء الله) are normal human
  writing in many communities and are not tells. Keep them if the writer
  used them; do not add them.

---

## 5. Things that look like tells but are not

Do not over-correct. These are human:

- One emoji in the body where a person would put one.
- "Thank you" to a named person for a named thing.
- A genuine question with a specific object at the end.
- Short paragraphs with blank lines between them (this is how LinkedIn is
  read, it is not broetry).
- A list, when the content really is a list (three tools compared, four
  steps actually taken).
- "I" at the start of many sentences. First-person posts do that.
- An English word in a Hebrew or Arabic post.
- A religious formula in an Arabic post.
- One hashtag with the event or product name.
- Repeating a word for emphasis. "It was slow. Really slow."
- An aside in parentheses.
- A sentence starting with And or But.
- A slightly awkward phrasing the writer would actually use.

The test is always the same: is this phrase doing work (carrying a fact, a
name, a feeling the writer has), or is it there because posts are supposed
to have it?
