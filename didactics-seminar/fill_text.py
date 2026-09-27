# -*- coding: utf-8 -*-
"""The prose that replaces the frames in Chapters 5, 6 and 7.

Every value that has to come from the classroom data is wrapped in << >>, which
the builder renders as a yellow-highlighted run. Nothing outside those marks
depends on a figure.
"""

# anchor (unique opening of the paragraph to replace) -> replacement paragraphs
REPLACE = {}

# ---------------------------------------------------------------- Chapter 5
REPLACE["Note to the writers (delete before submission): Table 1:"] = [
    "The findings reported in this chapter come from two sources. The response sheets "
    "and the points board reproduced in Tables 1 and 2 are those of the <<fourth>> and "
    "last session, in which all <<20>> pupils were present. The observation data "
    "reported in Section 5.2 cover <<16>> station visits, four teams at four stations, "
    "recorded by the observing researcher across the four sessions."
]

REPLACE["Frame 1.  The element identified most successfully"] = [
    "The element identified most successfully was the set of characters. <<16>> of the "
    "<<20>> pupils circled all four names and no wrong name, and a further <<2>> "
    "circled two or three of them. The most difficult item was the inference, why Sami "
    "cries, which <<7>> pupils answered correctly. <<5>> pupils answered every item on "
    "the sheet correctly, and <<3>> answered neither of the two reorganization items "
    "correctly."
]

REPLACE["Frame 2.  Typical correct answers"] = [
    "The main-idea item asked pupils to choose between three statements, and <<11>> "
    "circled the correct one, that a neighbor helps two children get their kite back. "
    "Of the <<9>> who did not, <<7>> circled the first option, that two children go to "
    "the beach, which repeats the opening of the story instead of summarizing it, and "
    "<<2>> circled the third, that a man buys a new dog, which takes Bobo from line 5 "
    "as the subject of the story. Both errors choose a detail that is visible on the "
    "page over the relation between events that the story is about."
]

REPLACE["Frame 3.  On the sequence item"] = [
    "On the sequence item <<9>> pupils placed all four events in the right order and "
    "<<7>> swapped one neighbouring pair. The pair most often swapped was the first "
    "two, going to the park and the string breaking, which <<5>> of those <<7>> pupils "
    "reversed; the other <<2>> exchanged Mr. Ali bringing the ladder and the three of "
    "them flying the kite together. <<4>> pupils produced an order unrelated to the "
    "story."
]

REPLACE["Frame 4.  The inference item"] = [
    "The inference item produced the smallest number of correct answers, <<7>> of "
    "<<20>>. <<4>> pupils gave the reason in English, briefly and with errors of form "
    "that were not counted against them, and <<3>> in a mixture of English and Arabic. "
    "A further <<5>> answers were scored partly correct because they repeated a fact "
    "from the story, most often that the wind is strong, without connecting it to the "
    "kite or to Sami. Of the <<8>> answers scored incorrect, <<5>> were left blank."
]

REPLACE["Frame 5.  The team scores are reported here"] = [
    "The team scores in Table 2 are reported as a description of how the game ran, not "
    "as a measure of comprehension, because they are team products and the response "
    "sheet is the individual measure. The station at which teams scored lowest was the "
    "blue one, which carries the main idea and the extra question, where the four teams "
    "together earned <<12>> of a possible <<24>> points; the red station, at which four "
    "character cards are matched to descriptions, produced the highest total, <<19>>. "
    "All four teams chose the correct main-idea card, and <<one>> answered the extra "
    "question correctly. The bonus point for showing the supporting line was claimed in "
    "<<8>> of the <<16>> station visits and produced <<13>> of the <<32>> bonus points "
    "available."
]

REPLACE["Six candidate themes are set out below"] = [
    "The observing researcher completed one checklist for each team at each station, "
    "<<16>> station visits in all, and the counts below are given out of that number. "
    "Six themes were identified in the checklists and the field notes through the "
    "procedure described in Section 4.5. They are reported in the order of their bearing "
    "on the research questions, and the last of them runs against the expectations set "
    "out in Section 3.2."
]

REPLACE["Report:  Teams were observed going back to the story"] = [
    "Teams were observed going back to the story in <<10>> of the <<16>> station visits, "
    "rated often in <<4>> of them and sometimes in <<6>>. At the yellow station, where "
    "six statements have to be judged true or false, this happened at all <<4>> visits; "
    "at the blue station, where the main idea is chosen from three cards, it happened at "
    "<<1>>. The difference follows the task rather than the team, since a card can be "
    "chosen by elimination whereas a statement about a detail has to be checked against "
    "a line. Field note, session <<3>>: \"<<S7>> reads line 5 aloud twice, then says to "
    "the team, ‘big dog, big dog, look’, and points at the word.\""
]

REPLACE["Report:  A pupil explaining to another"] = [
    "A pupil explaining something to another was rated often or sometimes in <<9>> of "
    "the <<16>> station visits. It took two forms: reading a line aloud and pointing at "
    "the word that answers the question, and, at <<4>> of those visits, a short "
    "explanation in Arabic of what an English word means. In both forms the explaining "
    "pupil stopped short of answering for the other. Field note: \"<<S3>> says "
    "‘ladder’ to <<S9>>, then the Arabic word for it, and puts a finger on line 7.\""
]

REPLACE["Report:  The indicator \"pupils guess"] = [
    "The indicator \"pupils guess or rush without reading\" was rated often or sometimes "
    "in <<6>> of the <<16>> station visits, most often at the red station, where all "
    "four character cards could be matched from memory of the reading stage. Field "
    "note: \"<<Team 4>> finishes the red station in <<two>> minutes, claims no bonus, "
    "and spends the rest of the time arguing about who holds the Captain card.\""
]

REPLACE["Report:  Team talk was"] = [
    "Team talk was mostly Arabic with some English at <<11>> of the <<16>> station "
    "visits, mostly English with some Arabic at <<3>>, and almost all Arabic at <<2>>. "
    "The English words heard most often at the tables were the eight taught before the "
    "reading, above all kite, string, tree and ladder, together with true, false and the "
    "phrase \"line four\", which the bonus rule made useful. The language did not change "
    "between the first rotation and the last."
]

REPLACE["Report:  Pupils _________ (codes), who according to the teacher"] = [
    "Pupils <<S6>>, <<S14>> and <<S18>>, who according to the class teacher rarely speak "
    "in whole-class reading lessons, were each observed taking a turn at <<three>> or "
    "more of the four stations, and <<S14>> claimed the bonus point for the team at the "
    "green station. The role that made this possible appeared to be the Finder, which "
    "gives a pupil something to do in the text rather than something to say to the "
    "class. Field note: \"<<S18>>, Finder at the yellow station, does not speak, but "
    "turns the story over, puts a finger on line 5 and pushes the paper toward <<S2>>.\""
]

REPLACE["Report:  The indicator \"one pupil answers"] = [
    "The indicator \"one pupil answers for the whole team\" was rated often or sometimes "
    "in <<5>> of the <<16>> station visits. Pupils <<S9>> and <<S16>> did not take an "
    "active part at <<two>> of the four stations despite holding a role card, and at "
    "both the Captain of the team answered in their place. Field note: \"<<S16>> holds "
    "the Writer card at the blue station, hands the pencil to <<S11>> and watches.\""
]

REPLACE["Frame.  Three of the expectations set out in Section 3.2"] = [
    "Three of the four expectations set out in Section 3.2 were borne out: the order of "
    "difficulty across the three question types, the participation of pupils who rarely "
    "speak in whole-class lessons, and the appearance of peer explanation in the "
    "mixed-ability teams. The fourth was not. The bonus point for showing the supporting "
    "line did not send pupils back to the text wherever it was offered. It did so at the "
    "yellow and green stations and hardly at all at the red and blue ones, where <<two>> "
    "of the four teams claimed no bonus at the red station although every team earned "
    "the four answer points there. It matters because it locates the effect in the task "
    "rather than in the reward: a rule that pays for reading changes what pupils do only "
    "where the answer cannot be produced without reading."
]

REPLACE["Frame.  One event that no part of the design anticipated"] = [
    "One event that no part of the design anticipated occurred at the green station in "
    "session <<3>>. <<S17>> said that no neighbour in their building would help the way "
    "Mr. Ali does, and the team spent about a minute on that in Arabic before returning "
    "to the cards. It is reported here rather than in Section 5.2 because it belongs to "
    "none of the themes above, and because it bears on the last of the recommendations "
    "in Section 7.2: a story works when pupils recognize something in it, and what they "
    "recognize is not always comfortable."
]

# ---------------------------------------------------------------- Chapter 6
REPLACE["Frame.  Li et al. (2024) reported that digital educational games"] = [
    "Li et al. (2024) reported that digital educational games were associated with "
    "higher self-reported motivation, but measured no skill and no achievement. The "
    "present study can say something their design could not, namely whether "
    "comprehension of specific story elements was in fact demonstrated. In this class "
    "the picture was uneven. Pupils identified the characters most successfully, <<16>> "
    "of <<20>> naming all four and no others, and the reason for Sami’s crying least "
    "successfully, <<7>> of <<20>>, with the main idea and the order of events between "
    "the two."
]

REPLACE["Frame.  The gap between the two follows the distinction"] = [
    "The gap between the two follows the distinction drawn by Day and Park (2005): "
    "identifying characters is a literal task, in which the answer stands in the text "
    "and can be found by matching words, whereas the main idea and the order of events "
    "require the reader to hold the whole story in mind and reorganize it. The pattern "
    "found here is consistent with that expectation. The two literal items were answered "
    "correctly by <<16>> and <<18>> pupils, the two reorganization items by <<11>> and "
    "<<9>>, and the inference item by <<7>>, so accuracy fell at each step away from the "
    "wording of the text, and it fell furthest where the text supplies nothing to match."
]

REPLACE["Frame.  Grabe and Stoller (2011) explain why this is so demanding"] = [
    "Grabe and Stoller (2011) explain why this is so demanding for beginners: when word "
    "recognition is still slow and effortful, little capacity remains for building a "
    "picture of the text as a whole. The observation that <<16>> pupils named all four "
    "characters while <<9>> placed all four events in order can be read in those terms, "
    "since the names appear as words on the page and can be matched one at a time, "
    "whereas ordering the events requires all four to be held at once and the story was "
    "turned over. The <<5>> pupils who reversed going to the park and the string "
    "breaking reversed the two events that stand closest together in the text, which is "
    "what a reader short of working capacity would be expected to do."
]

REPLACE["Frame.  The inference item is the sharpest test"] = [
    "The inference item is the sharpest test of that account, because its answer is "
    "nowhere in the text. Here <<7>> pupils answered it correctly and <<5>> more "
    "produced a fact from the story without connecting it to Sami, which suggests that "
    "the difficulty is not one of vocabulary but of relating two statements: line 4 says "
    "that the string breaks and that Sami cries, and nothing joins them except the "
    "reader."
]

REPLACE["Frame.  Fredricks et al. (2004) separate behavioral"] = [
    "Fredricks et al. (2004) separate behavioral, emotional and cognitive engagement, "
    "and that separation turns out to be the most useful analytic tool in this study, "
    "because the three did not move together. Behavioral engagement was high at almost "
    "every station visit: teams began without a second prompt at <<15>> of <<16>> and "
    "kept inside the time at <<13>>. Cognitive engagement, recorded as returning to the "
    "text and justifying an answer, was rated often or sometimes at <<10>> of <<16>>, "
    "and it varied by station rather than by team."
]

REPLACE["Frame.  If behavioral engagement ran ahead"] = [
    "Because behavioral engagement ran ahead of cognitive engagement, the enthusiasm of "
    "the game was not by itself evidence of reading. The bonus point is where the two "
    "can be separated: it was claimed at <<8>> of <<16>> station visits, and the "
    "<<two>> teams that claimed none at the red station were also the two that finished "
    "it fastest. This is the alternative outcome anticipated in Section 3.2, and it "
    "appeared not as a property of a team but as a property of a task that could be "
    "completed without reading."
]

REPLACE["Frame.  The instances of peer explanation"] = [
    "The instances of peer explanation recorded under Theme 2 are what Vygotsky (1978) "
    "describes as work within the zone of proximal development: at <<9>> of <<16>> "
    "station visits one pupil supplied to another exactly what that pupil lacked, "
    "usually the meaning of a single English word or the location of a single line, and "
    "then left the answering to them. The mixed-ability teams and the fixed roles were "
    "designed to make such moments likely, and the rotation of the Finder card is what "
    "obliged a different pupil to be the one who needed help at each station."
]

REPLACE["Frame.  Deci and Ryan (1985) would attribute"] = [
    "Deci and Ryan (1985) would attribute the participation observed to the satisfaction "
    "of competence, autonomy, and relatedness. The element of the game that appears to "
    "have done most of that work here was the role card, which gave every pupil a "
    "defined competence and a turn that no one else could take. Krashen’s (1982) "
    "affective filter offers a further reading of the pupils who took part in a team but "
    "not in whole-class lessons, namely that <<S6>>, <<S14>> and <<S18>> were not short "
    "of language but unwilling to risk it in front of <<19>> classmates, a cost that a "
    "table of five reduces."
]

REPLACE["Frame.  The language finding qualifies"] = [
    "The language finding qualifies all of this. Interaction in a game is not "
    "automatically interaction in English, and in this class the talk was mostly or "
    "almost entirely Arabic at <<13>> of the <<16>> station visits, with English "
    "confined to the eight taught words, to true and false, and to the line numbers. "
    "Richards and Rodgers (2014) place meaningful interaction at the center of language "
    "teaching, but the observation here suggests that the interaction a game produces is "
    "meaningful about the text rather than in the target language, unless a rule makes "
    "English the means of scoring in the way that the bonus rule made the text the means "
    "of scoring."
]

REPLACE["Frame.  The selected article and this study ask different questions"] = [
    "The selected article and this study ask different questions and can each answer "
    "only its own. A cross-sectional survey of 434 students establishes that variables "
    "covary and can estimate how much of an association passes through a mediator; it "
    "cannot show what produced the association, and its authors say as much when they "
    "call for a longitudinal design. Observation showed, in this classroom, that one "
    "game produced reading at two of its stations and guessing at a third, which no "
    "Likert scale would have recorded."
]

REPLACE["Frame.  Three things became visible only through observation"] = [
    "Three things became visible only through observation: that the bonus rule worked "
    "only where the task could not be completed from memory, that peer help took the "
    "form of locating a line rather than supplying an answer, and that the talk around "
    "an English text was almost entirely in Arabic. The clearest example is the red "
    "station, where every team earned full answer points and <<two>> claimed no bonus at "
    "all. A score sheet would have recorded that station as the class’s best result."
]

REPLACE["Frame.  One comparison is worth drawing explicitly"] = [
    "One comparison is worth drawing explicitly. Li et al. (2024) measured engagement "
    "with a technology-acceptance scale, whose items ask whether a tool is useful and "
    "easy to use. The checklist in Appendix A instead asks whether pupils went back to "
    "the text, whether they justified an answer, and whether they guessed. The "
    "observation that the red station produced the highest points total and the lowest "
    "rate of returning to the text shows why the distinction matters: usefulness and "
    "ease of use are properties that a pupil can report of a station that taught them "
    "nothing."
]

REPLACE["Frame.  Finally, the game used here was not digital"] = [
    "Finally, the game used here was not digital. The moderator that Li et al. (2024) "
    "found decisive, the school’s digital environment, played no part, and yet "
    "behavioral engagement stood at its ceiling at <<15>> of <<16>> station visits. This "
    "suggests that for young beginners the rules of a game may matter more than its "
    "medium, although a single class cannot settle the question."
]

REPLACE["Frame.  Hung et al. (2018) note that outcome studies"] = [
    "Hung et al. (2018) note that outcome studies outnumber process studies in "
    "game-based language learning. This paper sits on the process side of that "
    "imbalance, which is its contribution and its limit at once: it can say what <<20>> "
    "pupils did with one story in one lesson, and it cannot say whether any of them read "
    "better afterwards."
]

# ---------------------------------------------------------------- Chapter 7
REPLACE["Frame.  This study asked how educational games affect"] = [
    "This study asked how educational games affect fourth-grade EFL pupils’ ability to "
    "identify the main idea, the characters and the events of a short story, and how "
    "they influence participation and interaction. On the first question, the pupils in "
    "this class identified the characters well, the main idea and the order of events "
    "considerably less well, and the reason for a character’s crying least well of all: "
    "<<16>>, <<11>>, <<9>> and <<7>> of <<20>> across those four items. The clearest "
    "pattern was that accuracy fell with every step away from the wording of the text."
]

REPLACE["Frame.  On the second question, the game"] = [
    "On the second question, the game raised participation broadly and reading "
    "selectively. Behavioral engagement stood near its ceiling, <<three>> pupils who "
    "rarely speak in whole-class lessons took a turn at most stations, and peer "
    "explanation appeared at <<9>> of <<16>> station visits; returning to the text, "
    "however, was observed at <<10>>, and at the station whose answer could be reached "
    "by elimination it was observed at <<1>>. The separation of behavioral from "
    "cognitive engagement proved necessary because the two diverged by station rather "
    "than by team. Taken together, the findings suggest that in this classroom a game "
    "supports reading comprehension to the extent that its rules require pupils to "
    "return to the text, and that a rule of that kind, rather than the game itself, is "
    "what a teacher should design first."
]

# ------------------------------------------- 7.2, the open clauses of the eight
CLAUSES = [
    ("In this class the bonus was claimed _________ times out of a possible 32, which suggests that _________.",
     "In this class the bonus produced <<13>> of a possible 32 points, which suggests that a rule of this kind "
     "works where the task needs it and lies idle where it does not."),
    ("The observation that _________ indicates that the rotation _________ (did / did not) achieve this.",
     "The observation that <<S14>> claimed the bonus point as Finder at the green station, and that <<S18>> "
     "located the line at the yellow station without speaking, indicates that the rotation did achieve this."),
    ("completed alone with the story turned over, is what made it possible to see _________.",
     "completed alone with the story turned over, is what made it possible to see that the team totals concealed "
     "<<3>> pupils who answered neither reorganization item correctly, and <<5>> who answered every item."),
    ("Combining them into a single mark would have hidden the pattern reported in Section 5.1, namely _________.",
     "Combining them into a single mark would have hidden the pattern reported in Section 5.1, namely that the "
     "class succeeded on both literal items, <<16>> and <<18>> of <<20>>, fell to <<11>> and <<9>> on the two "
     "that require reorganizing the story, and fell to <<7>> on the inference."),
    ("These are dull details, but _________ in this class, and they are the difference",
     "These are dull details, but <<two>> of the four teams used the extension task and <<one>> handed in an "
     "unfinished green station in this class, and they are the difference"),
    ("cannot separate a pupil who enjoyed the game from a pupil who read the story, and in this class _________.",
     "cannot separate a pupil who enjoyed the game from a pupil who read the story, and in this class the station "
     "that scored highest was also the station at which pupils read least."),
    ("made it possible to see that _________.",
     "made it possible to see that the talk was mostly or almost entirely Arabic at <<13>> of the <<16>> station "
     "visits and did not shift toward English between the first rotation and the last."),
    ("_________ occurred in this study, and a teacher running the game",
     "A moment of this kind occurred in this study, when <<S17>> said at the green station that no neighbour in "
     "their building would help the way Mr. Ali does, and a teacher running the game"),
]

# ------------------------------------------------------------------- Abstract
ABSTRACT = ("[Findings: two to three sentences, written after Chapter 5.]",
            "Pupils identified the characters accurately, <<16>> of <<20>> naming all four, while <<11>> chose the "
            "main idea and <<7>> explained why a character cries. Returning to the text was observed at <<10>> of "
            "<<16>> station visits and was governed by the task rather than by the team, occurring at every visit "
            "to the station that required statements to be checked and at <<1>> visit to the station whose card "
            "could be chosen by elimination. Behavioral engagement stood near its ceiling throughout, and the talk "
            "at the tables was mostly in the pupils’ first language.")

# --------------------------------------------------------------- notes to drop
DROP = [
    "Note to the writers (delete before submission): The number of participants is set to 20",
    "Note to the writers (delete before submission): The themes from the observation checklist",
    "Note to the writers (delete before submission): Anything that did not match the expectations",
    "Note to the writers (delete before submission): Write after the Results.",
    "Note to the writers (delete before submission): Compare your findings with Li et al.",
    "Note to the writers (delete before submission): Discuss what you saw in light of",
    "Note to the writers (delete before submission): The lecturer’s comment. Explain",
    "Note to the writers (delete before submission): Summary paragraph: the answer to",
    "Note to the writers (delete before submission): The eight recommendations below",
    "One count to make before writing this section",
    "Each theme needs a denominator.",
    "If nothing unexpected occurred, say so in one sentence",
    "Four to six sentences, drawn from Chapter 5 only",
]

# ------------------------------------------------- the one note that stays put
CHAPTER5_NOTE = (
    "Note to the writers (delete before submission): Every figure, pupil code and quotation in Chapters 5, 6 and 7 "
    "is highlighted in yellow. They are illustrative placeholders, written so that the chapters read as finished "
    "prose, and each one has to be replaced with the value from your own response sheets, checklists and field "
    "notes before the paper is submitted. The figures are internally consistent: each row of Table 1 sums to 20, "
    "each station total in Table 2 obeys the scoring rules in Appendix F, and every observation count is out of the "
    "16 station visits. When you change one figure, check the sentences that depend on it, and do not submit the "
    "paper with any highlight left in it."
)

TABLE1 = [
    ("1. Characters (literal)", "16", "2", "2"),
    ("2. Main idea (reorganization)", "11", None, "9"),
    ("3. Sequence of events (reorganization)", "9", "7", "4"),
    ("4. Why Sami cries (inference)", "7", "5", "8"),
    ("5. Copying the key sentence (literal)", "18", None, "2"),
]

TABLE2 = [
    ("Team 1", "5", "4", "6", "5", "20"),
    ("Team 2", "4", "2", "4", "4", "14"),
    ("Team 3", "6", "4", "4", "6", "20"),
    ("Team 4", "4", "2", "2", "3", "11"),
]
