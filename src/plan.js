// The two-year programme: terms, courses, Scripture plan, and the engine that
// turns a date into that day's tasks and notes.
import { BOOK_NOTES, SEASON_NOTES } from "./guide";
import d000 from "./daily/d000";
import d050 from "./daily/d050";
import d110 from "./daily/d110";
import d170 from "./daily/d170";
import d230 from "./daily/d230";
import d290 from "./daily/d290";
import d350 from "./daily/d350";
import d410 from "./daily/d410";
import d470 from "./daily/d470";

// One unique entry per day: title, note on the reading, journal question, action, prayer.
export const DAILY = [...d000, ...d050, ...d110, ...d170, ...d230, ...d290, ...d350, ...d410, ...d470];

/* ---------- Bible data ---------- */
const OT = [["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Proverbs",31],["Ecclesiastes",12],["Song of Songs",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4]];
const NT = [["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]];
const ONE = new Set(["Obadiah","Philemon","2 John","3 John","Jude"]);
const flat = (books) => { const a = []; books.forEach(([b, n]) => { for (let c = 1; c <= n; c++) a.push([b, c]); }); return a; };
// Three tracks, each read exactly once across the programme: OT (without Psalms and Proverbs),
// NT (Mark first, then the other Gospels), and wisdom (Psalms, then Proverbs).
const OTX = flat(OT.filter((b) => b[0] !== "Proverbs")), NT2 = flat([["Mark",16], ...NT.filter((b) => b[0] !== "Mark")]), PS2 = flat([["Psalms",150],["Proverbs",31]]);
export const PLAN_CHAPTERS = OTX.length + NT2.length + PS2.length;
const NT_BOOKS = NT.map((b) => b[0]);
const OT_ALL = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1–2 Samuel","1–2 Kings","1–2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"];
const PROPHETS = ["Job","Psalms","Proverbs","Ecclesiastes","Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"];

/* ---------- Programme ---------- */
export const BREAK_TEXT = {
  break1: "No course reading during the break. Read one Gospel slowly (Luke works well at Christmas) and rest.",
  break2: "No course reading. Review last semester's notes and take your quarterly retreat this fortnight.",
  break3: "No course reading. Read the book of Acts in one sitting this week, then rest.",
};
const C = (code, name, units) => ({ code, name, units });

export const TERMS = [
  { key: "orient", name: "Orientation", days: 28, theme: "Set up your daily rhythms before the heavy reading begins",
    study: { type: "weekly", weeks: [
      { t: "Get your tools ready: a journal, your NKJV, the ESV Study Bible (or the free notes on esv.org for now), and bookmark STEP Bible. Then practise SOAP journaling on today's reading: Scripture, Observation, Application, Prayer.", n: "Method matters more than speed. Write the verse that stood out, what it says, what it means for you today, and turn it into a prayer. You'll use this for the next 553 days." },
      { t: "Read Tozer, The Pursuit of God (about 2 chapters a day). Ask one friend to be your weekly accountability partner.", n: "Tozer's big idea: God wants to be known personally, and spiritual hunger is the beginning of finding Him. Pray each chapter's closing prayer as your own." },
      { t: "Ask a pastor or mature believer to mentor you for two years. Find one weekly place to serve in your church.", n: "Choose a mentor whose life you'd like yours to look like in 20 years, not just someone who knows a lot. Ask for one hour a month." },
      { t: "Write your one-page \"Why I'm doing this\" letter to yourself, seal it, and keep it for graduation. Take the starting self-assessment on the Roadmap tab.", n: "Be honest in the letter: what you hope God will do, what you fear, and what you are willing to give. You'll read it again in 2028." },
    ] } },
  { key: "break1", name: "Break", days: 21, brk: true, theme: "Rest and read a Gospel slowly" },
  { key: "sem1", name: "Semester 1", days: 105, theme: "Foundations: the Word and the Life of Christ",
    study: { type: "rotate",
      fri: { t: "Discernment lab: write down any striking teaching or \"hidden secret\" you heard this week and test it. Is it clearly taught in more than one place? Does it fit the context? Do trusted scholars agree? Does it make Jesus bigger and you more loving? Then catch up on any course that is behind.", n: "The Bereans were called noble because they checked even Paul's teaching against Scripture (Acts 17:11). Testing isn't doubt; it's love for the truth." },
      courses: [
        C("101", "How to Study the Bible", [
          { w: 5, t: "Read Fee and Stuart, How to Read the Bible for All Its Worth (about 3 chapters this week).", n: "Key idea: a text can never mean what it never meant to its first readers. First ask 'What did it mean then?' and only then 'What does it mean for me now?'" },
          { w: 5, t: "Read Hendricks, Living By the Book, and do today's workbook exercise.", n: "Key idea: observation is the most neglected step. Before interpreting, list everything you see: who, what, where, when, repeated words, contrasts, commands." },
          { w: 3, t: "Inductive study of Philippians: observe, interpret and apply one paragraph today.", n: "Watch for the word 'joy' and the phrase 'in Christ'. Paul writes from prison, which makes his joy all the more striking." },
          { w: 2, t: "Write your 4–5 page Philippians study: outline, main themes, three word studies (STEP Bible) and your application.", n: "Pick word studies on words that carry the letter, such as 'joy' (chara), 'mind' (phroneō) and 'fellowship' (koinōnia)." },
        ]),
        C("102", "New Testament Survey", [
          { w: 13, t: "Talk Thru the Bible (NT) plus the BibleProject overview video for: {x}. Make a one-page card for each book (author, audience, purpose, key verse, Christ in this book).", seq: NT_BOOKS, n: "Knowing why a book was written unlocks every chapter in it. Always ask: who wrote it, to whom, and what problem were they facing?" },
          { w: 2, t: "Review all 27 summary cards and quiz yourself on each book.", n: "Try to say each book's purpose in one sentence from memory." },
        ]),
        C("103", "The Life and Teachings of Jesus", [
          { w: 8, t: "Read Ortlund, Gentle and Lowly (about 3 chapters this week). Note what it shows you about the heart of Jesus.", n: "Key idea from Matthew 11:29: the only place Jesus describes His own heart, He says 'gentle and lowly'. He is drawn to sinners, not repelled by them." },
          { w: 5, t: "Sermon on the Mount: study {x}. Put one teaching into practice this week and write what happened.", seq: ["Matthew 5:1–16","Matthew 5:17–48","Matthew 6:1–18","Matthew 6:19–34","Matthew 7"], n: "The Sermon on the Mount describes life in God's kingdom. It isn't a ladder to earn God's love; it's what a heart changed by His love begins to look like." },
          { w: 2, t: "Write \"Who is Jesus?\" in two pages, using only the Gospels.", n: "Include His names and titles, what He claimed, what He did, and how people reacted to Him." },
        ]),
        C("104", "Spiritual Formation I: Prayer", [
          { w: 8, t: "Read Murray, With Christ in the School of Prayer (about 4 lessons this week).", n: "Murray's key idea: prayer is learned, and Jesus Himself is the teacher. Pray 'Lord, teach me to pray' (Luke 11:1) before each lesson." },
          { w: 3, t: "Read Brother Lawrence, The Practice of the Presence of God.", n: "A kitchen worker who learned to talk with God while washing pots. Holiness happens in ordinary places." },
          { w: 4, t: "Re-read your prayer journal. Write down what God has answered and what He has taught you about prayer.", n: "Noticing answered prayer builds faith for the next prayer." },
        ]),
      ] } },
  { key: "break2", name: "Break", days: 14, brk: true, theme: "Review and retreat" },
  { key: "sem2", name: "Semester 2", days: 105, theme: "Knowing God: theology, the Old Testament and the disciplines",
    study: { type: "rotate",
      fri: { t: "Testimony and catch-up: refine your three-minute testimony (before Christ, how you met Him, life since) and pray for the people you will share it with. Then catch up on any course that is behind.", n: "They overcame by the blood of the Lamb and the word of their testimony (Rev 12:11). Your story is a powerful tool. Keep it short and about Jesus." },
      courses: [
        C("201", "Old Testament Survey", [
          { w: 13, t: "Talk Thru the Bible (OT) plus the BibleProject overview for: {x}.", seq: OT_ALL, n: "The Old Testament is the story Jesus came to complete. Look for promises, patterns and pictures that point forward to Him." },
          { w: 2, t: "Draw a timeline from Creation to the return from exile, and write a page on how the Old Testament points to Christ (Luke 24:27, 44).", n: "Big periods: Creation and patriarchs, Exodus, Conquest, Judges, Kingdom, Divided kingdom, Exile, Return." },
        ]),
        C("202", "Theology I", [
          { w: 12, t: "Grudem, Bible Doctrine: {x}. Write a short statement of what you believe, with key verses.", seq: ["The Word of God","Scripture's authority and sufficiency","The character of God","The Trinity","Creation and providence","Humanity in God's image","Sin","The person of Christ","The atonement","Calling, new birth and faith","Justification and adoption","Sanctification and perseverance"], n: "Grudem ends each chapter with application questions and a hymn. Don't skip them: theology should lead to worship." },
          { w: 3, t: "Put your statements together into one document: \"What I believe and why\".", n: "This becomes your personal statement of faith, which you'll finish in Semester 4." },
        ]),
        C("203", "Knowing and Loving God", [
          { w: 7, t: "Read Packer, Knowing God. Choose one attribute of God to meditate on and worship Him for this week.", n: "Packer's key idea: knowing about God isn't the same as knowing God. Turn every truth you learn into praise." },
          { w: 5, t: "Read Tozer, The Knowledge of the Holy.", n: "Tozer: 'What comes into our minds when we think about God is the most important thing about us.'" },
          { w: 3, t: "Write your list of 20 attributes of God, each with a verse and one way it changes how you live.", n: "For example: God is faithful (Lam 3:23), so I can trust Him with tomorrow's worries." },
        ]),
        C("204", "Spiritual Formation II: The Disciplines", [
          { w: 7, t: "Read Foster, Celebration of Discipline: one discipline's chapter, then practise it this week.", n: "Foster's key idea: disciplines don't earn grace; they put us where grace can change us, like a farmer preparing soil for rain." },
          { w: 5, t: "Read Whitney, Spiritual Disciplines for the Christian Life.", n: "Whitney's key idea: discipline without direction is drudgery. The goal is godliness, which means becoming like Jesus." },
          { w: 3, t: "Write your first Rule of Life: your daily, weekly and yearly rhythms with God on one page.", n: "A 'rule' is like a trellis that supports a growing vine. Keep it realistic for your actual life." },
        ]),
      ] } },
  { key: "int1", name: "Intensive 1", days: 21, theme: "Ephesians: your identity and inheritance in Christ",
    study: { type: "weekly", weeks: [
      { t: "Read all of Ephesians (about 20 minutes). Add every \"in Christ\", \"in Him\" and \"with Christ\" phrase to your list. Start Anderson, Victory Over the Darkness.", n: "Chapters 1–3 are who you are; chapters 4–6 are how you walk. Paul never gives commands until he has told you your identity." },
      { t: "Read all of Ephesians again. Keep building your \"in Christ\" list and keep reading Victory Over the Darkness.", n: "Anderson's key idea: you don't behave your way into identity; you believe your way into behaviour. What you believe about yourself shapes how you live." },
      { t: "Read all of Ephesians. Write \"Who I am in Christ\": a page of Scripture-based declarations to read aloud.", n: "Write each as 'I am... because...' with a verse, such as: 'I am seated with Christ in heavenly places (Eph 2:6).'" },
    ] } },
  { key: "sem3", name: "Semester 3", days: 105, theme: "Spirit and Power: the Holy Spirit, gifts and authority",
    study: { type: "rotate",
      fri: { t: "Gifts lab journal: log what you prayed for and what happened this week, including when nothing seemed to happen. Ask your mentor to weigh anything you sensed (1 Cor 14:29; 1 Thess 5:19–21). Then catch up.", n: "Paul says 'do not despise prophecies, test everything, hold fast what is good'. Both parts matter: stay open and stay careful." },
      courses: [
        C("301", "The Holy Spirit", [
          { w: 6, t: "Read Fee, Paul, the Spirit, and the People of God.", n: "Fee's key idea: for Paul, the Spirit isn't an optional extra. He is God's personal, empowering presence, the evidence that the new age has begun." },
          { w: 3, t: "Read Chan, Forgotten God.", n: "Chan asks: if the Holy Spirit were removed, would your life look any different? Let that question drive your prayers." },
          { w: 4, t: "Study the Spirit in {x}. Note each time the Spirit comes or acts and what happened.", seq: ["John 14–16","Acts 1–7","Acts 8–19","Acts 20–28 and Romans 8"], n: "In Acts, the Spirit's coming is usually followed by bold witness, praise, unity and power. Look for that pattern." },
          { w: 2, t: "Write your study \"The Spirit in Acts\".", n: "Finish with what Acts teaches you to expect and pray for today." },
        ]),
        C("302", "The Gifts of the Spirit", [
          { w: 4, t: "Read Deere, Surprised by the Power of the Spirit.", n: "Deere taught at Dallas Seminary believing the gifts had ceased, then changed his mind from Scripture. His story shows how to hold the Bible and the Spirit together." },
          { w: 4, t: "Read Storms, Practicing the Power.", n: "Storms' key idea: the gifts grow like any skill, through faith, practice, feedback and humility, inside a loving community." },
          { w: 4, t: "Read Keener, Gift and Giver, and study {x}.", seq: ["Romans 12:3–8","1 Corinthians 12","1 Corinthians 13–14","Ephesians 4:7–16 and 1 Peter 4:10–11"], n: "Every gift list is surrounded by teaching on love, humility and serving the body. Gifts are tools for others, not trophies." },
          { w: 3, t: "Write your gifts reflection: which gifts others confirm God is using in you, and how you will grow. Re-read 1 Corinthians 13 first.", n: "Look for where serving gives you joy, where others are built up, and what mature believers confirm." },
        ]),
        C("303", "Authority of the Believer", [
          { w: 4, t: "Read MacMillan, The Authority of the Believer.", n: "MacMillan's key idea: Christ is seated far above every power (Eph 1:20–21), and believers are seated with Him (2:6). Authority comes from position in Christ, not personal strength." },
          { w: 3, t: "Read Arnold, 3 Crucial Questions about Spiritual Warfare.", n: "Arnold keeps warfare biblical: it involves the world, the flesh and the devil, and the main weapons are truth, righteousness, faith, the Word and prayer." },
          { w: 4, t: "Read Anderson, The Bondage Breaker, and work through the Steps to Freedom in Christ with your mentor.", n: "Freedom usually comes through truth (John 8:32): renouncing lies, forgiving, confessing and submitting to God, then resisting the devil (James 4:7)." },
          { w: 2, t: "Study the key texts: {x}.", seq: ["Gen 1:26–28; Psalm 8; Luke 9:1–2; 10:17–20","Eph 1:19–2:6; 6:10–18; Col 2:13–15; James 4:7; 1 Pet 5:8–9; Rev 12:11"], n: "Notice Luke 10:20: Jesus tells the disciples to rejoice more that their names are written in heaven than that demons submit. Relationship comes before power." },
          { w: 2, t: "Write a three-page paper: What authority do believers have in Christ, where does it come from, and how do we use it with humility?", n: "Include both sides: real authority in Jesus' name, and its limits (God's will, submission, love, and the fact that authority is delegated)." },
        ]),
        C("304", "The Prophets and Wisdom", [
          { w: 13, t: "Read the ESV Study Bible introduction and watch the BibleProject overview for: {x}.", seq: PROPHETS, n: "The prophets mainly called God's people back to covenant faithfulness. Prediction was only part of their message; justice, mercy and true worship were central." },
          { w: 2, t: "Write a page tracing the Messiah and the Spirit through Isaiah (chapters 7, 9, 11, 42, 53, 61).", n: "Jesus read Isaiah 61 to announce His ministry (Luke 4:18–21)." },
        ]),
      ] } },
  { key: "break3", name: "Break", days: 21, brk: true, theme: "Rest and read Acts in one sitting" },
  { key: "sem4", name: "Semester 4", days: 105, theme: "Character and Calling: fruit, history and mission",
    study: { type: "rotate",
      fri: { t: "Share and catch up: share the gospel or your testimony with someone this week (your goal is at least one person a month). Then catch up on any course that is behind.", n: "A simple gospel outline: God loves you; sin separates us; Jesus died and rose to bring us back; turn and trust Him." },
      courses: [
        C("401", "Fruit of the Spirit and Holiness", [
          { w: 9, t: "Fruit of the week: {x}. Study it, pray for it, practise it in one real situation, and ask a friend how they see it in you. Keep reading Bridges, The Practice of Godliness.", seq: ["Love","Joy","Peace","Patience","Kindness","Goodness","Faithfulness","Gentleness","Self-control"], n: "It is one 'fruit' with nine flavours. It grows as you walk by the Spirit (Gal 5:16, 25), the way fruit grows on a healthy branch abiding in the vine (John 15:5)." },
          { w: 3, t: "Read Murray, Humility, then Scazzero, Emotionally Healthy Spirituality.", n: "Murray: humility is the root of every virtue. Scazzero: you can't be spiritually mature while remaining emotionally immature." },
          { w: 3, t: "Fruit self-assessment: rate yourself and ask two people who know you well to rate you. Write a growth plan for your two weakest areas.", n: "Other people often see our fruit (and its absence) more clearly than we do." },
        ]),
        C("402", "Church History and Revival", [
          { w: 7, t: "Read Shelley, Church History in Plain Language.", n: "History protects you from myths and shows that God has always kept His church through every age." },
          { w: 5, t: "Read Synan, The Century of the Holy Spirit.", n: "From Azusa Street (1906) to the global charismatic movement: the story of the Spirit's work in the 20th century." },
          { w: 1, t: "Read Ravenhill, Why Revival Tarries.", n: "A stirring call to prayer and holiness. Read it on your knees." },
          { w: 2, t: "Make a timeline of ten key moments in church history and five revivals, with one lesson from each for your life.", n: "Every revival has started with prayer, repentance and a fresh focus on Jesus." },
        ]),
        C("403", "Theology II and Apologetics", [
          { w: 6, t: "Grudem, Bible Doctrine: {x}. Add it to your statement of faith.", seq: ["The Holy Spirit","Spiritual gifts","The church","Baptism and the Lord's Supper","The return of Christ","Judgment and the new creation"], n: "Grudem is a continuationist, so his chapters on the Spirit and gifts fit your focus well." },
          { w: 6, t: "Read Lewis, Mere Christianity.", n: "Lewis argues from everyday experience (our sense of right and wrong) to God. Notice how he makes deep ideas simple." },
          { w: 3, t: "Write a two-page answer to one hard question a friend might ask, such as \"Why do you believe Jesus rose from the dead?\"", n: "Always be ready to give a reason for your hope, with gentleness and respect (1 Pet 3:15)." },
        ]),
        C("404", "Mission and Calling", [
          { w: 5, t: "Read Bonhoeffer, The Cost of Discipleship.", n: "Bonhoeffer warns against 'cheap grace': grace without discipleship. Real grace costs Jesus His life and calls us to follow Him." },
          { w: 5, t: "Study {x}, and pray for one unreached people group (joshuaproject.net).", seq: ["Matthew 28:18–20","Acts 1:8","Romans 10:13–15","Isaiah 6:1–8","Acts 13:1–3"], n: "The Great Commission starts with Jesus' authority and ends with His presence. You go with Him." },
          { w: 5, t: "Write your calling statement: your gifts, burdens, experiences, the people God has put on your heart, and what serving Christ looks like for you in the next five years.", n: "Calling is usually found where your gifts, your burden and the world's need meet, confirmed by others." },
        ]),
      ] } },
  { key: "int2", name: "Intensive 2", days: 28, theme: "Capstone and commissioning",
    study: { type: "weekly", weeks: [
      { t: "Plan the 4-week Bible study you will teach (Philippians, Ephesians or the Holy Spirit). Finalise your statement of faith.", n: "Plan each session around one main point, a few discussion questions and one application." },
      { t: "Teach week 1 of your study. Begin meeting with one newer believer to disciple them. Write version 2 of your Rule of Life.", n: "Discipleship is simply helping someone follow Jesus one step further than they are now." },
      { t: "Teach weeks 2 and 3. Finalise your calling statement.", n: "Ask your mentor to read your calling statement and pray over it with you." },
      { t: "Teach week 4. Re-take the full self-assessment and compare it with your start. Open your Orientation letter and write a reply. Ask your pastor and mentor to pray over you and commission you (Acts 13:2–3).", n: "Celebrate what God has done. This is a beginning, not an end." },
    ] } },
];
let off = 0; TERMS.forEach((t) => { t.start = off; off += t.days; });
export const TOTAL = off;

export const MEMORY = ["John 3:16","Romans 10:9–10","1 John 5:11–13","2 Corinthians 5:17","Isaiah 9:6","Luke 2:10–11","John 1:14",
"Psalm 119:105","2 Timothy 3:16–17","Joshua 1:8","John 1:1–5","Philippians 2:5–8","Philippians 2:9–11","Matthew 11:28–30","Hebrews 4:12","Matthew 6:33","John 14:6","John 15:5","Philippians 4:6–7","Philippians 4:13","Mark 10:45","Colossians 3:16",
"Psalm 46:10","Isaiah 26:3",
"Exodus 34:6–7","Isaiah 40:28–31","Psalm 23:1–3","Psalm 23:4–6","Psalm 139:1–6","Psalm 139:7–12","Lamentations 3:22–23","Romans 8:28","Romans 8:31–32","Romans 8:37–39","Jeremiah 9:23–24","Numbers 23:19","Hebrews 11:6","Matthew 6:9–13","Psalm 27:4",
"Ephesians 1:3","Ephesians 2:8–10","Ephesians 3:20–21",
"Acts 1:8","Romans 8:11","Romans 8:14–16","Luke 10:19","Ephesians 1:17–19","Ephesians 1:20–23","Ephesians 6:10–13","Ephesians 6:14–18","Mark 16:17–18","1 Corinthians 12:7–11","James 4:7","Colossians 2:13–15","2 Corinthians 10:4–5","1 John 4:4","Revelation 12:11",
"Acts 2:38–39","Joel 2:28","Zechariah 4:6",
"Galatians 5:22–23","Galatians 5:24–25","1 Corinthians 13:4–5","1 Corinthians 13:6–8","Matthew 28:18–20","Romans 12:1–2","Micah 6:8","2 Peter 1:5–8","Isaiah 6:8","John 13:34–35","Colossians 3:12–14","1 Peter 3:15","Romans 1:16","Matthew 5:14–16","2 Timothy 2:2",
"Acts 13:2–3","1 Timothy 4:12","1 Timothy 4:14–16","Philippians 1:6"];

const INTERCEDE = ["worship and thanksgiving for the week","your family","your church and pastors","your nation and its leaders","people who don't know Jesus yet","your friends, work and studies","missions and the nations"];

function prayerFor(tk, wk) {
  switch (tk) {
    case "orient": case "break1": return ["The Lord's Prayer", "Pray Matthew 6:9–13 one line at a time, adding your own words to each line.", "Jesus gave this prayer as a pattern, not just words to repeat. It starts with God (His name, kingdom, will) before our needs."];
    case "sem1": return wk < 5
      ? ["ACTS prayer", "Adoration, Confession, Thanksgiving, Supplication: a few minutes on each.", "ACTS keeps prayer balanced. Most of us jump straight to asking; starting with adoration and confession changes the way you ask."]
      : ["Praying Scripture", "Turn this morning's reading into prayer. On Fridays pray one of Paul's prayers (Eph 1:15–23; 3:14–21; Phil 1:9–11; Col 1:9–14).", "When you pray Scripture you pray God's will in God's words, which builds confidence that He hears you (1 John 5:14–15)."];
    case "break2": return ["Praying Scripture", "Pray a psalm from today's reading back to God.", "The Psalms give you words for every emotion. Nothing is too honest to bring to God."];
    case "sem2": return wk < 8
      ? ["Intercession", "Work through your prayer list and write down answers as they come.", "Intercession means standing in the gap for others (Ezek 22:30). Writing answers down builds faith and shows God's faithfulness over time."]
      : ["Listening prayer", "Ask God a question, wait in silence, write what you sense, then test it against Scripture and with your mentor (John 10:27).", "Jesus' sheep hear His voice. God usually speaks quietly: a thought, a verse, a picture, a gentle impression. He never contradicts Scripture."];
    case "int1": return ["Paul's prayers for you", "Pray Ephesians 1:17–23 and 3:14–21 over yourself, slowly.", "Paul doesn't pray for more blessing; he prays that we would see what we already have in Christ."];
    case "sem3": return wk < 7
      ? ["Praying in the Spirit", "Pray in the Spirit and with your understanding (1 Cor 14:15; Jude 20). If you have not yet received the baptism in the Holy Spirit, ask for it (Luke 11:13; Acts 2).", "Praying in tongues builds up your inner life (1 Cor 14:4) and lets the Spirit pray through you when you don't know what to pray (Rom 8:26)."]
      : ["Praying with authority", "Stand on Scripture against fear and temptation in Jesus' name (James 4:7), and pray for anyone sick you know (James 5:14–16).", "Authority prayer speaks to situations in Jesus' name, the way He did. It works from a place of submission to God and rest, not striving."];
    case "break3": return ["Praying in the Spirit", "Spend part of your prayer time praying in the Spirit, then pray with understanding.", "Keep the habit alive during the break."];
    default: return ["Extended prayer", "Take your time today. Once a week, give God a full unhurried hour (Acts 4:23–31).", "The early church prayed together and the place was shaken. Long, unhurried prayer is where depth grows."];
  }
}

const DISCIPLINE = {
  orient: ["Scripture intake: read daily","Prayer: 10 minutes daily","Examen every evening","Begin memorising"],
  break1: ["Rest","Gratitude"],
  sem1: ["Sabbath: one day with no study, just worship and rest","Hidden kindness (Matt 6:1–4)","Practising the presence: short prayers at meals and travel","Sabbath"],
  break2: ["Solitude","Rest"],
  sem2: ["Fasting","Solitude and silence: 10 quiet minutes","Confession to your accountability friend (James 5:16)","Generosity"],
  int1: ["Declare who you are in Christ daily","Generosity: give time or money cheerfully","Silence"],
  sem3: ["Simplicity: a week off social media","Service in secret","Fasting with prayer for others","Solitude"],
  break3: ["Rest","Worship"],
  sem4: ["Worship as a way of life (Rom 12:1)","Hospitality","Generosity beyond the tithe","Silence and listening"],
  int2: ["Encourage someone daily","Rest well","Gratitude journal"],
};
const SERVE = {
  orient: "Find one weekly place to serve in your local church.",
  break1: "Serve someone in your family or church this week.",
  sem1: "Serve in your weekly ministry. Do one hidden act of kindness this week.",
  break2: "Serve someone in need this week.",
  sem2: "Serve in your weekly ministry. Share your testimony with one person (three this semester).",
  int1: "Bless one person this week from who you are in Christ: encourage, give or help.",
  sem3: "Join the prayer ministry team: pray for people after the service or in your group. Keep your weekly serving role.",
  break3: "Visit or help someone lonely, sick or poor (Matt 25:34–40).",
  sem4: "Lead something small: a Bible study, prayer meeting or children's lesson. Share the gospel at least once this month.",
  int2: "Teach your study and meet with the person you are discipling.",
};

/* ---------- Dates (all in UTC noon to avoid timezone drift) ---------- */
const DAY = 86400000;
export const pad = (n) => String(n).padStart(2, "0");
export const iso = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
export const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d, 12)); };
export const todayISO = () => { const n = new Date(); return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`; };
export const addDays = (s, n) => iso(new Date(parse(s).getTime() + n * DAY));
export const diff = (a, b) => Math.round((parse(b) - parse(a)) / DAY);
export const DOW = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
export const MON = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const longDate = (s) => { const d = parse(s); return `${DOW[d.getUTCDay()]}, ${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
export const shortDate = (s) => { const d = parse(s); return `${d.getUTCDate()} ${MON[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`; };

/* ---------- Engine ---------- */
export function termAt(day) { for (const t of TERMS) if (day >= t.start && day < t.start + t.days) return t; return null; }
function slice(arr, day) { const N = arr.length, a = Math.round((day * N) / TOTAL), b = Math.round(((day + 1) * N) / TOTAL); return arr.slice(a, b); }
function fmt(chs) {
  const g = [];
  chs.forEach(([b, c]) => { const l = g[g.length - 1]; if (l && l.b === b && l.e === c - 1) l.e = c; else g.push({ b, s: c, e: c }); });
  return g.map((x) => { if (ONE.has(x.b)) return x.b; let b = x.b; if (b === "Psalms" && x.s === x.e) b = "Psalm"; return `${b} ${x.s}${x.e !== x.s ? "–" + x.e : ""}`; });
}
const booksIn = (day) => [...new Set([...slice(OTX, day), ...slice(NT2, day), ...slice(PS2, day)].map((c) => c[0]))];
export const reading = (day) => [...fmt(slice(OTX, day)), ...fmt(slice(NT2, day)), ...fmt(slice(PS2, day))];
export const chapterCount = (day) => slice(OTX, day).length + slice(NT2, day).length + slice(PS2, day).length;
export const bibleLink = (refs) => "https://www.biblegateway.com/passage/?search=" + encodeURIComponent(refs.join("; ").replace(/–/g, "-")) + "&version=NKJV";

function unit(course, wk) {
  let w = wk;
  for (const u of course.units) {
    if (w < u.w) {
      const meta = { k: w + 1, of: u.w, first: w === 0 };
      if (!u.seq) return { t: u.t, n: u.n, ...meta };
      const L = u.seq.length, a = Math.floor((w * L) / u.w), b = Math.max(a + 1, Math.floor(((w + 1) * L) / u.w));
      return { t: u.t.replace("{x}", u.seq.slice(a, Math.min(b, L)).join(", ") || u.seq[L - 1]), n: u.n, ...meta };
    }
    w -= u.w;
  }
  const last = course.units[course.units.length - 1];
  return { t: last.t.replace("{x}", "review"), n: last.n, k: 1, of: 1, first: false };
}
const firstWeekdayOfMonth = (d, dow) => { const x = parse(d); return x.getUTCDay() === dow && x.getUTCDate() <= 7; };

// The day each book is first opened, so its introduction shows once.
const FIRST_DAY = {};
for (let d = 0; d < 553; d++) booksIn(d).forEach((b) => { if (!(b in FIRST_DAY)) FIRST_DAY[b] = d; });

// Weekday steps so a week-long assignment reads differently each day.
const STEP = [
  "Step 1: start it, and decide when in the day you'll give it your best time.",
  "Step 2: keep going, and mark one thing that surprises or challenges you.",
  "Step 3: halfway there. Write three sentences on what God is showing you.",
  "Step 4: talk about it with someone, or pray it through with your accountability friend.",
  "Step 5: finish it and write your one-line takeaway in the journal.",
];

export const MIN_IDS = ["read", "pray", "memory"];

export function dayPlan(d, settings) {
  const day = diff(settings.start, d);
  if (day < 0 || day >= TOTAL) return null;
  const t = termAt(day), dayIn = day - t.start, wk = Math.floor(dayIn / 7), dow = parse(d).getUTCDay(), T = [];
  const add = (watch, id, title, detail, o = {}) => T.push({ watch, id, title, detail, ...o });
  const refs = reading(day), W = DAILY[day];
  add("morning", "worship", "Quiet and worship", "Still yourself and thank Him. Today's theme: " + W.t + ".", { mins: 5 });
  add("morning", "read", "Bible reading", refs.join(" · "), { mins: 20, refs, core: true });
  add("morning", "journal", "Journal", W.q, { mins: 5 });
  const [pt, pd, pn] = prayerFor(t.key, wk);
  add("morning", "pray", "Prayer: " + pt, pd + " Today, also pray for " + INTERCEDE[dow] + ". Close with: \u201c" + W.p + "\u201d", { mins: 15, core: true });
  const mv = MEMORY[Math.min(Math.floor(day / 7), MEMORY.length - 1)];
  add("morning", "memory", "Memory verse: " + mv, dow === 6 ? "Review day: say every verse you've learned so far." : "Say it aloud three times without looking.", { mins: 2, core: true, refs: [mv] });

  let studyNote = null, studyTitle = null;
  if (dow === 0) add("study", "sabbath", "Sabbath rest", "No study today. Worship at church, rest, and enjoy God and the people you love.");
  else if (dow === 6) add("study", "lab", "Lab day (about 2 hours)", t.brk ? "Light week: tidy your notes and plan the next term." : "Catch up on reading, work on this week's written assignment, and plan next week.", { mins: 120 });
  else if (t.brk) add("study", "study", "Break reading · week " + (wk + 1), BREAK_TEXT[t.key] + " " + STEP[dow - 1].replace(/^Step (\d)/, "Week " + (wk + 1) + ", step $1"));
  else if (t.study.type === "weekly") { const w = t.study.weeks[Math.min(wk, t.study.weeks.length - 1)]; studyTitle = t.name + ", week " + (wk + 1); studyNote = dow === 1 || dayIn % 7 === 0 ? w.n : null; add("study", "study", studyTitle, w.t + " " + STEP[dow - 1], { mins: 40 }); }
  else if (dow === 5) { studyTitle = "Friday: " + (t.key === "sem1" ? "Discernment lab" : t.key === "sem3" ? "Gifts lab journal" : "Catch-up") + " · week " + (wk + 1); studyNote = wk === 0 ? t.study.fri.n : null; add("study", "study", studyTitle, "Week " + (wk + 1) + " of " + Math.ceil(t.days / 7) + ". " + t.study.fri.t, { mins: 40 }); }
  else { const c = t.study.courses[dow - 1], u = unit(c, wk); studyTitle = c.code + " " + c.name + " · week " + (wk + 1); studyNote = u.first ? u.n : null; add("study", "study", studyTitle, (u.of > 1 ? "Session " + u.k + " of " + u.of + ". " : "") + u.t, { mins: 40 }); }

  add("day", "presence", "Live it today", W.a);
  if (dow === 0) add("day", "church", "Church and sermon notes", "Worship with your church. Write down the main point of the sermon and talk about it with someone.", { special: true });
  if (dow === settings.fastDay && t.key !== "orient") {
    const lvl = ["sem1", "break2"].includes(t.key) ? "Skip one meal and pray in that time." : ["sem2", "int1"].includes(t.key) ? "Skip two meals and use the time to pray." : "Fast from sunrise to sunset (water only, with medical common sense) and pray.";
    add("day", "fast", "Fast day", lvl, { special: true });
  }
  if (dow === settings.groupDay) add("day", "group", t.key === "sem3" ? "Small group and gifts lab" : "Small group or accountability meeting", t.key === "sem3" ? "Meet with your group or prayer team. Practise praying for one another and sharing encouraging words (1 Cor 14:3)." : "Meet your group or accountability friend. Share your week and pray for each other.", { special: true });
  if (dow === 6) {
    add("day", "serve", "Serve", SERVE[t.key], { special: true });
    add("day", "review", "Weekly review (15 min)", "Count the days you kept the rhythm. What did God say? What did you learn? Where did you serve? Which fruit was tested? Send your prayer needs to your accountability friend.", { special: true, mins: 15 });
  }
  if (dow === 1) { const list = DISCIPLINE[t.key] || DISCIPLINE.sem1; add("day", "discipline", "Discipline of the week: " + list[wk % list.length], "Choose when you'll practise it this week and put it in your calendar.", { special: true }); }
  if (firstWeekdayOfMonth(d, 6)) add("day", "halfday", "Monthly half-day of prayer", "Three or four hours alone with God: worship, read a whole book of the Bible aloud, intercede, listen, write what you sense.", { special: true, mins: 180 });
  if (firstWeekdayOfMonth(d, 1)) add("day", "mentor", "Book this month's mentor meeting", "One hour with your mentor. Bring your weekly reviews and one decision you're facing.", { special: true });
  if (/^sem/.test(t.key) && dayIn >= t.days - 7 && dow === 6) add("day", "retreat", "Quarterly retreat", "Review the semester, take the self-assessment on the Roadmap tab, update your Rule of Life, and ask God for next term's focus.", { special: true });
  add("evening", "examen", "Evening examen", "Where did I see God today? Did I live today's word, \u201c" + W.t + "\u201d? Where did the fruit of the Spirit show, and where did I fail? Confess, give thanks, and pray for tomorrow.", { mins: 10 });

  const notes = {
    word: { title: W.t, note: W.n },
    season: dayIn < 7 ? SEASON_NOTES[t.key] : null,
    books: booksIn(day).filter((b) => FIRST_DAY[b] === day).map((b) => ({ book: b, note: BOOK_NOTES[b] })),
    study: studyNote ? { title: studyTitle, note: studyNote } : null,
    prayer: dayIn % 7 === 0 || day === 0 ? { title: pt, note: pn } : null,
  };
  return { day, term: t, week: wk + 1, weeks: Math.ceil(t.days / 7), tasks: T, notes, memory: mv };
}
