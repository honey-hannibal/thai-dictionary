import { useState, useEffect, useRef, useCallback } from “react”;

const C = {
bg:”#080b10”, surface:”#0f1420”, card:”#141c2e”, border:”#1e2a40”,
gold:”#f0a500”, red:”#f05060”, green:”#3ecf8e”, blue:”#4a9eff”,
purple:”#a78bfa”, muted:”#4a5568”, dim:”#8896ab”, text:”#dce6f0”, white:”#ffffff”,
};

const TONES = [
{name:“สามัญ”,label:“平聲”,symbol:”–”,color:”#3ecf8e”},
{name:“เอก”,label:“低聲”,symbol:“↘”,color:”#f05060”},
{name:“โท”,label:“降聲”,symbol:“↓”,color:”#f0a500”},
{name:“ตรี”,label:“高聲”,symbol:“↑”,color:”#a78bfa”},
{name:“จัตวา”,label:“升聲”,symbol:“↗”,color:”#4a9eff”},
];

const LEVELS = { “初級”: C.green, “中級”: C.gold, “高級”: C.red };

const WORDS = [
{
id:1, thai:“กิน”, rtgs:“gin”, tone:“สามัญ”, pos:“動詞”, level:“初級”,
zh:“吃”, en:“to eat”, ipa:“ɡin˧”,
synonyms:[{th:“รับประทาน”,zh:“用餐（正式）”},{th:“ทาน”,zh:“吃（禮貌）”}],
antonyms:[{th:“อด”,zh:“忍住不吃”},{th:“อิ่ม”,zh:“吃飽”}],
collocations:[“กินข้าว 吃飯”,“กินน้ำ 喝水”,“กินยา 吃藥”],
examples:[
{th:“วันนี้เราไปกินข้าวที่ร้านอาหารไทยด้วยกัน”,zh:“今天我們一起去泰式餐廳吃飯”,en:“Today we go eat Thai food together.”},
{th:“คุณกินข้าวแล้วหรือยัง”,zh:“你吃飯了嗎？”,en:“Have you eaten yet?”},
],
notes:“口語常用，比 รับประทาน 更隨性；กินข้าว 字面是「吃飯」，也泛指「吃東西」”
},
{
id:2, thai:“น้ำ”, rtgs:“nam”, tone:“โท”, pos:“名詞”, level:“初級”,
zh:“水”, en:“water”, ipa:“náːm˥˩”,
synonyms:[], antonyms:[{th:“ไฟ”,zh:“火”}],
collocations:[“น้ำผลไม้ 果汁”,“น้ำแข็ง 冰”,“น้ำร้อน 熱水”],
examples:[
{th:“ขอน้ำหนึ่งแก้วได้ไหม”,zh:“可以給我一杯水嗎？”,en:“Can I have a glass of water?”},
{th:“น้ำในแม่น้ำนี้สะอาดมาก”,zh:“這條河的水很乾淨”,en:“The water in this river is very clean.”},
],
notes:“也可指各種液體，如 น้ำผลไม้（果汁）、น้ำแข็ง（冰）”
},
{
id:3, thai:“สวัสดี”, rtgs:“sawatdi”, tone:“สามัญ”, pos:“感嘆詞”, level:“初級”,
zh:“你好／再見”, en:“hello / goodbye”, ipa:“sà.wàt.diː˧”,
synonyms:[], antonyms:[],
collocations:[“สวัสดีครับ 你好（男）”,“สวัสดีค่ะ 你好（女）”,“สวัสดีตอนเช้า 早安”],
examples:[
{th:“สวัสดีครับ ผมชื่อโต้ง”,zh:“你好，我叫 Tong”,en:“Hello, my name is Tong.”},
{th:“สวัสดีค่ะ ยินดีที่ได้รู้จัก”,zh:“您好，很高興認識你”,en:“Hello, nice to meet you.”},
],
notes:“同時用於問候和道別；需加禮貌詞尾 ครับ（男）/ ค่ะ（女）才算完整”
},
{
id:4, thai:“รัก”, rtgs:“rak”, tone:“ตรี”, pos:“動詞”, level:“初級”,
zh:“愛”, en:“to love”, ipa:“rák˥”,
synonyms:[{th:“ชอบ”,zh:“喜歡”},{th:“หลงใหล”,zh:“著迷”}],
antonyms:[{th:“เกลียด”,zh:“討厭”},{th:“ชัง”,zh:“憎恨”}],
collocations:[“รักกัน 互相愛”,“รักษา 治療”,“รักใคร่ 愛慕”],
examples:[
{th:“ฉันรักเธอ”,zh:“我愛你”,en:“I love you.”},
{th:“เขารักครอบครัวมาก”,zh:“他非常愛家人”,en:“He loves his family very much.”},
],
notes:“รัก 比 ชอบ 程度更深，用於深厚感情”
},
{
id:5, thai:“ขอบคุณ”, rtgs:“khopkhun”, tone:“สามัญ”, pos:“動詞”, level:“初級”,
zh:“謝謝”, en:“thank you”, ipa:“kʰɔ̀ːp.kʰun˧”,
synonyms:[{th:“ขอบใจ”,zh:“謝謝（非正式）”}], antonyms:[],
collocations:[“ขอบคุณมาก 非常謝謝”,“ขอบคุณครับ/ค่ะ 謝謝（有禮）”],
examples:[
{th:“ขอบคุณมากนะครับ”,zh:“非常感謝你”,en:“Thank you very much.”},
{th:“ขอบคุณสำหรับของขวัญ”,zh:“謝謝你的禮物”,en:“Thank you for the gift.”},
],
notes:“比 ขอบใจ 更正式有禮，日常交際必備詞”
},
{
id:6, thai:“ไป”, rtgs:“pai”, tone:“สามัญ”, pos:“動詞”, level:“初級”,
zh:“去”, en:“to go”, ipa:“pai˧”,
synonyms:[{th:“เดินทาง”,zh:“前往”}],
antonyms:[{th:“มา”,zh:“來”},{th:“กลับ”,zh:“回”}],
collocations:[“ไปด้วย 一起去”,“ไปแล้ว 已經去了”,“ไปมา 來來往往”],
examples:[
{th:“พรุ่งนี้ฉันจะไปกรุงเทพ”,zh:“明天我要去曼谷”,en:“Tomorrow I will go to Bangkok.”},
{th:“ไปด้วยกันไหม”,zh:“要一起去嗎？”,en:“Shall we go together?”},
],
notes:“也用作方向助詞，放動詞後表示向外移動”
},
];

function useSpeech() {
const [playingId, setPlayingId] = useState(null);
const speak = useCallback((text, id) => {
const synth = window.speechSynthesis;
if (synth.speaking) {
synth.cancel();
setPlayingId(null);
return;
}
const u = new SpeechSynthesisUtterance(text);
u.lang = “th-TH”;
u.rate = 0.82;
u.pitch = 1.05;
u.onstart = () => setPlayingId(id);
u.onend = () => setPlayingId(null);
u.onerror = () => setPlayingId(null);
synth.speak(u);
}, []);
return { speak, playingId };
}

function SpeakPill({ text, id, speak, playingId, label }) {
const isPlaying = playingId === id;
return (
<button
onClick={(e) => { e.stopPropagation(); speak(text, id); }}
style={{
display: “inline-flex”, alignItems: “center”, gap: 5,
padding: “5px 13px”, borderRadius: 99,
background: isPlaying ? “rgba(240,80,96,0.15)” : “rgba(255,255,255,0.06)”,
border: `1px solid ${isPlaying ? C.red : C.border}`,
color: isPlaying ? C.red : C.dim,
fontSize: 13, fontWeight: 600, cursor: “pointer”,
whiteSpace: “nowrap”, flexShrink: 0, transition: “all .2s”,
}}
>
<span style={{ fontSize: 14 }}>{isPlaying ? “⏹” : “🔊”}</span>
{isPlaying ? “停止” : label}
</button>
);
}

function Tag({ label, color }) {
return (
<span style={{
fontSize: 12, padding: “3px 10px”, borderRadius: 99,
background: color + “22”, color, border: `1px solid ${color}44`
}}>{label}</span>
);
}

function TransBox({ flag, lang, text }) {
return (
<div style={{ background: “#080b10”, borderRadius: 10, padding: “11px 13px”, border: `1px solid ${C.border}` }}>
<div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{flag} {lang}</div>
<div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{text}</div>
</div>
);
}

function Block({ title, children }) {
return (
<div style={{ background: “#0c1018”, borderRadius: 12, padding: “13px 15px”, marginBottom: 12, border: `1px solid ${C.border}` }}>
<div style={{ fontSize: 11, color: C.muted, marginBottom: 10, fontWeight: 700, letterSpacing: “0.06em” }}>{title}</div>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 8 }}>{children}</div>
</div>
);
}

function Chip({ th, zh, color }) {
return (
<div style={{ background: color + “12”, border: `1px solid ${color}33`, borderRadius: 8, padding: “5px 12px”, fontSize: 13 }}>
<span style={{ color }}>{th}</span>
<span style={{ color: C.muted, fontSize: 12, marginLeft: 5 }}>{zh}</span>
</div>
);
}

function WordDetail({ word, isFav, onFav, speak, playingId }) {
const tone = TONES.find((t) => t.name === word.tone) || TONES[0];
return (
<div>
<div style={{
background: `linear-gradient(135deg,${C.card},#0a1020)`,
borderRadius: 16, padding: “22px 24px”, marginBottom: 14, border: `1px solid ${C.border}`
}}>
<div style={{ display: “flex”, alignItems: “center”, gap: 12, marginBottom: 6, flexWrap: “wrap” }}>
<span style={{ fontSize: 52, fontWeight: 900, color: C.white, lineHeight: 1 }}>{word.thai}</span>
<SpeakPill text={word.thai} id={“word-” + word.id} speak={speak} playingId={playingId} label=“發音” />
<button onClick={onFav} style={{
marginLeft: “auto”, background: isFav ? “rgba(240,80,96,0.15)” : “transparent”,
border: `1px solid ${isFav ? C.red : C.border}`,
borderRadius: 10, padding: “8px 12px”, cursor: “pointer”,
fontSize: 18, color: isFav ? C.red : C.muted, transition: “all .2s”
}}>
{isFav ? “❤️” : “🤍”}
</button>
</div>
<div style={{ fontSize: 15, color: C.muted, marginBottom: 14 }}>
{word.rtgs}
{word.ipa && <span style={{ fontSize: 13, color: C.muted, marginLeft: 10 }}>[{word.ipa}]</span>}
</div>
<div style={{ display: “flex”, gap: 8, flexWrap: “wrap”, marginBottom: 16 }}>
<Tag label={word.pos} color={C.purple} />
<Tag label={word.level} color={LEVELS[word.level] || C.green} />
<Tag label={tone.symbol + “ “ + tone.name + “ “ + tone.label} color={tone.color} />
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 10 }}>
<TransBox flag="🇹🇼" lang="中文意思" text={word.zh} />
<TransBox flag="🇺🇸" lang="English" text={word.en} />
</div>
</div>

```
  <Block title="🎵 聲調對照">
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
      {TONES.map((t) => (
        <div key={t.name} style={{
          background: t.color + "18",
          border: `1px solid ${t.color}${word.tone === t.name ? "99" : "33"}`,
          borderRadius: 8, padding: "5px 11px", fontSize: 12,
          color: word.tone === t.name ? t.color : C.muted,
          fontWeight: word.tone === t.name ? 700 : 400
        }}>
          {t.symbol} {t.name} {t.label}
        </div>
      ))}
    </div>
  </Block>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
    <Block title="🔁 近義詞">
      {word.synonyms && word.synonyms.length > 0
        ? word.synonyms.map((w) => <Chip key={w.th} th={w.th} zh={w.zh} color={C.green} />)
        : <span style={{ color: C.muted, fontSize: 13 }}>—</span>}
    </Block>
    <Block title="⇄ 反義詞">
      {word.antonyms && word.antonyms.length > 0
        ? word.antonyms.map((w) => <Chip key={w.th} th={w.th} zh={w.zh} color={C.red} />)
        : <span style={{ color: C.muted, fontSize: 13 }}>—</span>}
    </Block>
  </div>

  {word.collocations && word.collocations.length > 0 && (
    <Block title="🔗 常見搭配">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {word.collocations.map((c) => (
          <span key={c} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "4px 12px", fontSize: 13, color: C.text
          }}>{c}</span>
        ))}
      </div>
    </Block>
  )}

  <Block title="💬 例句">
    {word.examples && word.examples.map((ex, i) => (
      <div key={i} style={{
        background: C.card, borderRadius: 12, padding: "14px 16px",
        marginBottom: 10, borderLeft: `3px solid ${C.gold}`,
        width: "100%", boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 15, color: "#fde68a", lineHeight: 1.6, flex: 1 }}>{ex.th}</div>
          <SpeakPill text={ex.th} id={"ex-" + i + "-" + word.id} speak={speak} playingId={playingId} label="聽" />
        </div>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 3 }}>🇨🇳 {ex.zh}</div>
        <div style={{ fontSize: 13, color: C.muted }}>🇬🇧 {ex.en}</div>
      </div>
    ))}
  </Block>

  {word.notes && (
    <Block title="📌 學習備註">
      <p style={{ color: C.dim, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{word.notes}</p>
    </Block>
  )}
</div>
```

);
}

function Flashcard({ word, speak, playingId }) {
const [flipped, setFlipped] = useState(false);
useEffect(() => { setFlipped(false); }, [word.id]);
return (
<div style={{ display: “flex”, flexDirection: “column”, alignItems: “center”, paddingTop: 20 }}>
<div
onClick={() => setFlipped((f) => !f)}
style={{
width: “100%”, maxWidth: 420, minHeight: 240,
background: flipped
? “linear-gradient(135deg,#1a2040,#0a1020)”
: `linear-gradient(135deg,${C.card},#0a1020)`,
border: `2px solid ${flipped ? C.gold : C.border}`,
borderRadius: 20, display: “flex”, flexDirection: “column”,
alignItems: “center”, justifyContent: “center”,
cursor: “pointer”, padding: 32, boxSizing: “border-box”,
transition: “all .3s”, userSelect: “none”
}}
>
{!flipped ? (
<>
<div style={{ fontSize: 56, fontWeight: 900, color: C.white, marginBottom: 8 }}>{word.thai}</div>
<div style={{ fontSize: 16, color: C.muted }}>{word.rtgs}</div>
<div style={{ fontSize: 13, color: C.muted, marginTop: 16 }}>點擊翻面查看翻譯</div>
</>
) : (
<>
<div style={{ fontSize: 32, fontWeight: 700, color: C.gold, marginBottom: 8 }}>{word.zh}</div>
<div style={{ fontSize: 18, color: C.dim, marginBottom: 12 }}>{word.en}</div>
<div style={{ fontSize: 13, color: C.muted }}>{word.pos} · {word.level}</div>
</>
)}
</div>
<div style={{ marginTop: 20 }}>
<SpeakPill text={word.thai} id={“fc-” + word.id} speak={speak} playingId={playingId} label=“聽發音” />
</div>
</div>
);
}

function QuizPanel({ word, allWords }) {
const [answered, setAnswered] = useState(null);
const [options, setOptions] = useState([]);

useEffect(() => {
const others = allWords
.filter((w) => w.id !== word.id)
.sort(() => Math.random() - 0.5)
.slice(0, 3);
setOptions([…others, word].sort(() => Math.random() - 0.5));
setAnswered(null);
}, [word.id]);

return (
<div style={{ maxWidth: 460 }}>
<div style={{
background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
padding: “24px”, marginBottom: 20, textAlign: “center”
}}>
<div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>這個泰文單字的中文意思是？</div>
<div style={{ fontSize: 54, fontWeight: 900, color: C.white }}>{word.thai}</div>
<div style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>{word.rtgs}</div>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 10 }}>
{options.map((opt) => {
const correct = opt.id === word.id;
const chosen = answered !== null;
const bg = !chosen ? C.card : correct ? “#064e3b” : answered === opt.id ? “#7f1d1d” : C.card;
const borderColor = !chosen ? C.border : correct ? C.green : answered === opt.id ? C.red : C.border;
return (
<button
key={opt.id}
onClick={() => { if (!answered) setAnswered(opt.id); }}
disabled={!!answered}
style={{
background: bg, border: `2px solid ${borderColor}`,
borderRadius: 12, padding: “14px 10px”, color: C.text,
fontSize: 16, cursor: answered ? “default” : “pointer”,
transition: “all .2s”, fontWeight: 600
}}
>
{opt.zh}
{chosen && correct ? “ ✓” : “”}
{chosen && answered === opt.id && !correct ? “ ✗” : “”}
</button>
);
})}
</div>
{answered && (
<div style={{ marginTop: 16, textAlign: “center”, fontSize: 15, color: answered === word.id ? C.green : C.red }}>
{answered === word.id ? “🎉 答對了！” : “❌ 正確答案是：” + word.zh}
</div>
)}
</div>
);
}

export default function ThaiDict() {
const [query, setQuery] = useState(””);
const [results, setResults] = useState(WORDS);
const [selected, setSel] = useState(null);
const [favorites, setFav] = useState([]);
const [history, setHist] = useState([]);
const [tab, setTab] = useState(“search”);
const [learned, setLearned] = useState([]);
const [panel, setPanel] = useState(“detail”);
const [showDetail, setShowDetail] = useState(false);
const { speak, playingId } = useSpeech();
const goal = 5;

useEffect(() => {
const q = query.trim().toLowerCase();
if (!q) { setResults(WORDS); return; }
setResults(WORDS.filter((w) =>
w.thai.includes(q) || w.rtgs.toLowerCase().includes(q) ||
w.zh.includes(q) || w.en.toLowerCase().includes(q)
));
}, [query]);

const openWord = (w) => {
setSel(w);
setHist((h) => [w, …h.filter((x) => x.id !== w.id)].slice(0, 12));
if (!learned.includes(w.id)) setLearned((l) => […l, w.id]);
setShowDetail(true);
};

const toggleFav = (id) => setFav((f) => f.includes(id) ? f.filter((x) => x !== id) : […f, id]);

const listWords = tab === “favorites” ? WORDS.filter((w) => favorites.includes(w.id))
: tab === “history” ? history : results;

const progress = Math.min(100, Math.round(learned.length / goal * 100));

if (showDetail && selected) {
return (
<div style={{ minHeight: “100vh”, background: C.bg, color: C.text, fontFamily: “Georgia,serif” }}>
<div style={{
background: C.surface, borderBottom: `1px solid ${C.border}`,
padding: “14px 16px”, display: “flex”, alignItems: “center”, gap: 12,
position: “sticky”, top: 0, zIndex: 10
}}>
<button onClick={() => setShowDetail(false)} style={{
background: “transparent”, border: “none”, color: C.gold,
fontSize: 22, cursor: “pointer”, padding: “0 4px”
}}>←</button>
<span style={{ fontSize: 22, fontWeight: 900, color: C.white }}>{selected.thai}</span>
<span style={{ fontSize: 13, color: C.muted, marginLeft: 4 }}>{selected.rtgs}</span>
</div>
<div style={{ padding: 16 }}>
<div style={{ display: “flex”, gap: 8, marginBottom: 16, overflowX: “auto” }}>
{[[“detail”,“📖 字典”],[“flashcard”,“🃏 抽卡”],[“quiz”,“✏️ 測驗”]].map(([k, l]) => (
<button key={k} onClick={() => setPanel(k)} style={{
padding: “6px 16px”, borderRadius: 99, border: `1px solid ${C.border}`,
background: panel === k ? C.gold : “transparent”,
color: panel === k ? “#000” : C.muted,
fontSize: 13, cursor: “pointer”, fontWeight: panel === k ? 700 : 400, whiteSpace: “nowrap”
}}>{l}</button>
))}
</div>
{panel === “detail” && (
<WordDetail word={selected} isFav={favorites.includes(selected.id)}
onFav={() => toggleFav(selected.id)} speak={speak} playingId={playingId} />
)}
{panel === “flashcard” && <Flashcard word={selected} speak={speak} playingId={playingId} />}
{panel === “quiz” && <QuizPanel word={selected} allWords={WORDS} />}
</div>
</div>
);
}

return (
<div style={{ minHeight: “100vh”, background: C.bg, color: C.text, fontFamily: “Georgia,serif” }}>
<div style={{
background: C.surface, borderBottom: `1px solid ${C.border}`,
padding: “16px 20px 0”, position: “sticky”, top: 0, zIndex: 10
}}>
<div style={{ display: “flex”, alignItems: “center”, gap: 12, marginBottom: 14 }}>
<div style={{
fontSize: 24, fontWeight: 900,
background: `linear-gradient(120deg,${C.gold},${C.red})`,
WebkitBackgroundClip: “text”, WebkitTextFillColor: “transparent”
}}>🇹🇭 พจนานุกรม</div>
<span style={{ fontSize: 11, color: C.muted }}>泰中英字典</span>
</div>

```
    <div style={{
      background: C.card, borderRadius: 10, padding: "8px 14px", marginBottom: 14,
      border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 5 }}>
          <span>今日目標</span>
          <span style={{ color: C.gold }}>{learned.length}/{goal} 字</span>
        </div>
        <div style={{ height: 5, background: C.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: progress + "%",
            background: progress >= 100
              ? "linear-gradient(90deg,#3ecf8e,#22c55e)"
              : "linear-gradient(90deg,#f0a500,#f05060)",
            borderRadius: 99, transition: "width .5s ease"
          }} />
        </div>
      </div>
      <span style={{ fontSize: 18 }}>{progress >= 100 ? "🎉" : "📚"}</span>
    </div>

    <div style={{ display: "flex" }}>
      {[["search","🔍 搜尋"],["favorites","❤️ 收藏"],["history","🕐 歷史"]].map(([k, l]) => (
        <button key={k} onClick={() => setTab(k)} style={{
          flex: 1, padding: "9px 0", background: "none", border: "none", cursor: "pointer",
          borderBottom: tab === k ? `2px solid ${C.gold}` : "2px solid transparent",
          color: tab === k ? C.gold : C.muted, fontSize: 13, transition: "all .2s"
        }}>{l}</button>
      ))}
    </div>
  </div>

  {tab === "search" && (
    <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="輸入泰文 / 中文 / 英文…"
        style={{
          width: "100%", background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 9, padding: "10px 14px", color: C.text, fontSize: 15,
          outline: "none", boxSizing: "border-box"
        }}
      />
    </div>
  )}

  <div>
    {listWords.length === 0 && (
      <div style={{ padding: 24, color: C.muted, textAlign: "center", fontSize: 14 }}>
        {tab === "favorites" ? "還沒有收藏的單字 ❤️" : tab === "history" ? "還沒有查詢記錄 🕐" : "找不到「" + query + "」"}
      </div>
    )}
    {listWords.map((w) => (
      <div key={w.id} onClick={() => openWord(w)} style={{
        padding: "14px 16px", cursor: "pointer", borderBottom: `1px solid ${C.border}`,
        background: "transparent", transition: "background .15s"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.white }}>{w.thai}</span>
            <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{w.rtgs}</span>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 99,
              background: (LEVELS[w.level] || C.green) + "22",
              color: LEVELS[w.level] || C.green,
              border: `1px solid ${(LEVELS[w.level] || C.green)}44`
            }}>{w.level}</span>
            {favorites.includes(w.id) && <span style={{ fontSize: 14 }}>❤️</span>}
          </div>
        </div>
        <div style={{ fontSize: 13, color: C.dim, marginTop: 3 }}>
          {w.zh} · <span style={{ color: C.muted }}>{w.en}</span>
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>點擊查看詳細 →</div>
      </div>
    ))}
  </div>
</div>
```

);
}
