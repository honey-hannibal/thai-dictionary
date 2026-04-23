import { useState, useEffect, useCallback } from "react";

var BG = "#080b10";
var SURFACE = "#0f1420";
var CARD = "#141c2e";
var BORDER = "#1e2a40";
var GOLD = "#f0a500";
var RED = "#f05060";
var GREEN = "#3ecf8e";
var BLUE = "#4a9eff";
var PURPLE = "#a78bfa";
var MUTED = "#4a5568";
var DIM = "#8896ab";
var TEXT = "#dce6f0";
var WHITE = "#ffffff";

var TONES = [
  {name:"สามัญ",label:"平聲",symbol:"-",color:"#3ecf8e"},
  {name:"เอก",label:"低聲",symbol:"v",color:"#f05060"},
  {name:"โท",label:"降聲",symbol:"↓",color:"#f0a500"},
  {name:"ตรี",label:"高聲",symbol:"↑",color:"#a78bfa"},
  {name:"จัตวา",label:"升聲",symbol:"^",color:"#4a9eff"},
];

var WORDS = [
  {
    id:1,thai:"กิน",rtgs:"gin",tone:"สามัญ",pos:"動詞",level:"初級",
    zh:"吃",en:"to eat",ipa:"gin33",
    synonyms:[{th:"รับประทาน",zh:"用餐正式"},{th:"ทาน",zh:"吃禮貌"}],
    antonyms:[{th:"อด",zh:"忍住不吃"},{th:"อิ่ม",zh:"吃飽"}],
    collocations:["กินข้าว 吃飯","กินน้ำ 喝水","กินยา 吃藥"],
    examples:[
      {th:"วันนี้เราไปกินข้าวที่ร้านอาหารไทยด้วยกัน",zh:"今天我們一起去泰式餐廳吃飯",en:"Today we go eat Thai food together."},
      {th:"คุณกินข้าวแล้วหรือยัง",zh:"你吃飯了嗎",en:"Have you eaten yet?"},
    ],
    notes:"口語常用，比 รับประทาน 更隨性"
  },
  {
    id:2,thai:"น้ำ",rtgs:"nam",tone:"โท",pos:"名詞",level:"初級",
    zh:"水",en:"water",ipa:"nam51",
    synonyms:[],
    antonyms:[{th:"ไฟ",zh:"火"}],
    collocations:["น้ำผลไม้ 果汁","น้ำแข็ง 冰","น้ำร้อน 熱水"],
    examples:[
      {th:"ขอน้ำหนึ่งแก้วได้ไหม",zh:"可以給我一杯水嗎",en:"Can I have a glass of water?"},
      {th:"น้ำในแม่น้ำนี้สะอาดมาก",zh:"這條河的水很乾淨",en:"The water in this river is very clean."},
    ],
    notes:"也可指各種液體，如 น้ำผลไม้ 果汁"
  },
  {
    id:3,thai:"สวัสดี",rtgs:"sawatdi",tone:"สามัญ",pos:"感嘆詞",level:"初級",
    zh:"你好或再見",en:"hello or goodbye",ipa:"sa.wat.di33",
    synonyms:[],antonyms:[],
    collocations:["สวัสดีครับ 你好男","สวัสดีค่ะ 你好女","สวัสดีตอนเช้า 早安"],
    examples:[
      {th:"สวัสดีครับ ผมชื่อโต้ง",zh:"你好我叫 Tong",en:"Hello, my name is Tong."},
      {th:"สวัสดีค่ะ ยินดีที่ได้รู้จัก",zh:"您好很高興認識你",en:"Hello, nice to meet you."},
    ],
    notes:"同時用於問候和道別，需加 ครับ 男 或 ค่ะ 女"
  },
  {
    id:4,thai:"รัก",rtgs:"rak",tone:"ตรี",pos:"動詞",level:"初級",
    zh:"愛",en:"to love",ipa:"rak45",
    synonyms:[{th:"ชอบ",zh:"喜歡"},{th:"หลงใหล",zh:"著迷"}],
    antonyms:[{th:"เกลียด",zh:"討厭"},{th:"ชัง",zh:"憎恨"}],
    collocations:["รักกัน 互相愛","รักษา 治療","รักใคร่ 愛慕"],
    examples:[
      {th:"ฉันรักเธอ",zh:"我愛你",en:"I love you."},
      {th:"เขารักครอบครัวมาก",zh:"他非常愛家人",en:"He loves his family very much."},
    ],
    notes:"รัก 比 ชอบ 程度更深"
  },
  {
    id:5,thai:"ขอบคุณ",rtgs:"khopkhun",tone:"สามัญ",pos:"動詞",level:"初級",
    zh:"謝謝",en:"thank you",ipa:"khop.khun33",
    synonyms:[{th:"ขอบใจ",zh:"謝謝非正式"}],antonyms:[],
    collocations:["ขอบคุณมาก 非常謝謝","ขอบคุณครับ 謝謝男","ขอบคุณค่ะ 謝謝女"],
    examples:[
      {th:"ขอบคุณมากนะครับ",zh:"非常感謝你",en:"Thank you very much."},
      {th:"ขอบคุณสำหรับของขวัญ",zh:"謝謝你的禮物",en:"Thank you for the gift."},
    ],
    notes:"比 ขอบใจ 更正式有禮"
  },
  {
    id:6,thai:"ไป",rtgs:"pai",tone:"สามัญ",pos:"動詞",level:"初級",
    zh:"去",en:"to go",ipa:"pai33",
    synonyms:[{th:"เดินทาง",zh:"前往"}],
    antonyms:[{th:"มา",zh:"來"},{th:"กลับ",zh:"回"}],
    collocations:["ไปด้วย 一起去","ไปแล้ว 已經去了","ไปมา 來來往往"],
    examples:[
      {th:"พรุ่งนี้ฉันจะไปกรุงเทพ",zh:"明天我要去曼谷",en:"Tomorrow I will go to Bangkok."},
      {th:"ไปด้วยกันไหม",zh:"要一起去嗎",en:"Shall we go together?"},
    ],
    notes:"也用作方向助詞放動詞後表示向外移動"
  },
];

function useSpeech() {
  var state = useState(null);
  var playingId = state[0];
  var setPlayingId = state[1];
  var speak = useCallback(function(text, id) {
    var synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setPlayingId(null);
      return;
    }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "th-TH";
    u.rate = 0.82;
    u.pitch = 1.05;
    u.onstart = function() { setPlayingId(id); };
    u.onend = function() { setPlayingId(null); };
    u.onerror = function() { setPlayingId(null); };
    synth.speak(u);
  }, []);
  return { speak: speak, playingId: playingId };
}

function SpeakBtn(props) {
  var text = props.text;
  var id = props.id;
  var speak = props.speak;
  var playingId = props.playingId;
  var label = props.label;
  var isPlaying = playingId === id;
  return (
    <button
      onClick={function(e) { e.stopPropagation(); speak(text, id); }}
      style={{
        display:"inline-flex", alignItems:"center", gap:5,
        padding:"5px 13px", borderRadius:99,
        background: isPlaying ? "rgba(240,80,96,0.15)" : "rgba(255,255,255,0.06)",
        border: "1px solid " + (isPlaying ? RED : BORDER),
        color: isPlaying ? RED : DIM,
        fontSize:13, fontWeight:600, cursor:"pointer",
        whiteSpace:"nowrap", flexShrink:0,
      }}
    >
      {isPlaying ? "⏹" : "🔊"} {isPlaying ? "停止" : label}
    </button>
  );
}

function Tag(props) {
  return (
    <span style={{
      fontSize:12, padding:"3px 10px", borderRadius:99,
      background: props.color + "22",
      color: props.color,
      border: "1px solid " + props.color + "44"
    }}>{props.label}</span>
  );
}

function Block(props) {
  return (
    <div style={{background:"#0c1018",borderRadius:12,padding:"13px 15px",marginBottom:12,border:"1px solid " + BORDER}}>
      <div style={{fontSize:11,color:MUTED,marginBottom:10,fontWeight:700}}>{props.title}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{props.children}</div>
    </div>
  );
}

function WordDetail(props) {
  var word = props.word;
  var isFav = props.isFav;
  var onFav = props.onFav;
  var speak = props.speak;
  var playingId = props.playingId;
  var tone = TONES.find(function(t) { return t.name === word.tone; }) || TONES[0];
  var levelColor = word.level === "初級" ? GREEN : word.level === "中級" ? GOLD : RED;

  return (
    <div>
      <div style={{background:"linear-gradient(135deg," + CARD + ",#0a1020)",borderRadius:16,padding:"22px 24px",marginBottom:14,border:"1px solid " + BORDER}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6,flexWrap:"wrap"}}>
          <span style={{fontSize:52,fontWeight:900,color:WHITE,lineHeight:1}}>{word.thai}</span>
          <SpeakBtn text={word.thai} id={"word-"+word.id} speak={speak} playingId={playingId} label="發音" />
          <button onClick={onFav} style={{marginLeft:"auto",background:isFav?"rgba(240,80,96,0.15)":"transparent",border:"1px solid "+(isFav?RED:BORDER),borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:18,color:isFav?RED:MUTED}}>
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div style={{fontSize:15,color:MUTED,marginBottom:14}}>
          {word.rtgs} <span style={{fontSize:13,marginLeft:10}}>[{word.ipa}]</span>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          <Tag label={word.pos} color={PURPLE} />
          <Tag label={word.level} color={levelColor} />
          <Tag label={tone.symbol + " " + tone.name + " " + tone.label} color={tone.color} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{background:"#080b10",borderRadius:10,padding:"11px 13px",border:"1px solid "+BORDER}}>
            <div style={{fontSize:11,color:MUTED,marginBottom:4}}>🇹🇼 中文意思</div>
            <div style={{fontSize:20,fontWeight:700,color:WHITE}}>{word.zh}</div>
          </div>
          <div style={{background:"#080b10",borderRadius:10,padding:"11px 13px",border:"1px solid "+BORDER}}>
            <div style={{fontSize:11,color:MUTED,marginBottom:4}}>🇺🇸 English</div>
            <div style={{fontSize:20,fontWeight:700,color:WHITE}}>{word.en}</div>
          </div>
        </div>
      </div>

      <Block title="🎵 聲調對照">
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {TONES.map(function(t) {
            return (
              <div key={t.name} style={{background:t.color+"18",border:"1px solid "+t.color+(word.tone===t.name?"99":"33"),borderRadius:8,padding:"5px 11px",fontSize:12,color:word.tone===t.name?t.color:MUTED,fontWeight:word.tone===t.name?700:400}}>
                {t.symbol} {t.name} {t.label}
              </div>
            );
          })}
        </div>
      </Block>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Block title="🔁 近義詞">
          {word.synonyms && word.synonyms.length > 0 ? word.synonyms.map(function(w) {
            return <div key={w.th} style={{background:GREEN+"12",border:"1px solid "+GREEN+"33",borderRadius:8,padding:"5px 12px",fontSize:13}}><span style={{color:GREEN}}>{w.th}</span><span style={{color:MUTED,fontSize:12,marginLeft:5}}>{w.zh}</span></div>;
          }) : <span style={{color:MUTED,fontSize:13}}>—</span>}
        </Block>
        <Block title="⇄ 反義詞">
          {word.antonyms && word.antonyms.length > 0 ? word.antonyms.map(function(w) {
            return <div key={w.th} style={{background:RED+"12",border:"1px solid "+RED+"33",borderRadius:8,padding:"5px 12px",fontSize:13}}><span style={{color:RED}}>{w.th}</span><span style={{color:MUTED,fontSize:12,marginLeft:5}}>{w.zh}</span></div>;
          }) : <span style={{color:MUTED,fontSize:13}}>—</span>}
        </Block>
      </div>

      {word.collocations && word.collocations.length > 0 && (
        <Block title="🔗 常見搭配">
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {word.collocations.map(function(c) {
              return <span key={c} style={{background:CARD,border:"1px solid "+BORDER,borderRadius:8,padding:"4px 12px",fontSize:13,color:TEXT}}>{c}</span>;
            })}
          </div>
        </Block>
      )}

      <Block title="💬 例句">
        {word.examples && word.examples.map(function(ex, i) {
          return (
            <div key={i} style={{background:CARD,borderRadius:12,padding:"14px 16px",marginBottom:10,borderLeft:"3px solid "+GOLD,width:"100%",boxSizing:"border-box"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:8}}>
                <div style={{fontSize:15,color:"#fde68a",lineHeight:1.6,flex:1}}>{ex.th}</div>
                <SpeakBtn text={ex.th} id={"ex-"+i+"-"+word.id} speak={speak} playingId={playingId} label="聽" />
              </div>
              <div style={{fontSize:13,color:DIM,marginBottom:3}}>🇹🇼 {ex.zh}</div>
              <div style={{fontSize:13,color:MUTED}}>🇺🇸 {ex.en}</div>
            </div>
          );
        })}
      </Block>

      {word.notes && (
        <Block title="📌 學習備註">
          <p style={{color:DIM,fontSize:14,lineHeight:1.8,margin:0}}>{word.notes}</p>
        </Block>
      )}
    </div>
  );
}

function Flashcard(props) {
  var word = props.word;
  var speak = props.speak;
  var playingId = props.playingId;
  var flippedState = useState(false);
  var flipped = flippedState[0];
  var setFlipped = flippedState[1];
  useEffect(function() { setFlipped(false); }, [word.id]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:20}}>
      <div onClick={function() { setFlipped(function(f) { return !f; }); }} style={{width:"100%",maxWidth:420,minHeight:240,background:flipped?"linear-gradient(135deg,#1a2040,#0a1020)":"linear-gradient(135deg,"+CARD+",#0a1020)",border:"2px solid "+(flipped?GOLD:BORDER),borderRadius:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:32,boxSizing:"border-box",userSelect:"none"}}>
        {!flipped ? (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:56,fontWeight:900,color:WHITE,marginBottom:8}}>{word.thai}</div>
            <div style={{fontSize:16,color:MUTED}}>{word.rtgs}</div>
            <div style={{fontSize:13,color:MUTED,marginTop:16}}>點擊翻面查看翻譯</div>
          </div>
        ) : (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:700,color:GOLD,marginBottom:8}}>{word.zh}</div>
            <div style={{fontSize:18,color:DIM,marginBottom:12}}>{word.en}</div>
            <div style={{fontSize:13,color:MUTED}}>{word.pos}</div>
          </div>
        )}
      </div>
      <div style={{marginTop:20}}>
        <SpeakBtn text={word.thai} id={"fc-"+word.id} speak={speak} playingId={playingId} label="聽發音" />
      </div>
    </div>
  );
}

function QuizPanel(props) {
  var word = props.word;
  var allWords = props.allWords;
  var answeredState = useState(null);
  var answered = answeredState[0];
  var setAnswered = answeredState[1];
  var optionsState = useState([]);
  var options = optionsState[0];
  var setOptions = optionsState[1];

  useEffect(function() {
    var others = allWords.filter(function(w) { return w.id !== word.id; }).sort(function() { return Math.random() - 0.5; }).slice(0, 3);
    setOptions([...others, word].sort(function() { return Math.random() - 0.5; }));
    setAnswered(null);
  }, [word.id]);

  return (
    <div style={{maxWidth:460}}>
      <div style={{background:CARD,border:"1px solid "+BORDER,borderRadius:16,padding:"24px",marginBottom:20,textAlign:"center"}}>
        <div style={{fontSize:13,color:MUTED,marginBottom:12}}>這個泰文單字的中文意思是？</div>
        <div style={{fontSize:54,fontWeight:900,color:WHITE}}>{word.thai}</div>
        <div style={{fontSize:15,color:MUTED,marginTop:6}}>{word.rtgs}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {options.map(function(opt) {
          var correct = opt.id === word.id;
          var chosen = answered !== null;
          var bg = !chosen ? CARD : correct ? "#064e3b" : answered === opt.id ? "#7f1d1d" : CARD;
          var bc = !chosen ? BORDER : correct ? GREEN : answered === opt.id ? RED : BORDER;
          return (
            <button key={opt.id} onClick={function() { if (!answered) setAnswered(opt.id); }} disabled={!!answered}
              style={{background:bg,border:"2px solid "+bc,borderRadius:12,padding:"14px 10px",color:TEXT,fontSize:16,cursor:answered?"default":"pointer",fontWeight:600}}>
              {opt.zh}{chosen && correct ? " ✓" : ""}{chosen && answered === opt.id && !correct ? " ✗" : ""}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{marginTop:16,textAlign:"center",fontSize:15,color:answered===word.id?GREEN:RED}}>
          {answered === word.id ? "🎉 答對了！" : "❌ 正確答案是：" + word.zh}
        </div>
      )}
    </div>
  );
}

export default function ThaiDict() {
  var queryState = useState("");
  var query = queryState[0];
  var setQuery = queryState[1];
  var resultsState = useState(WORDS);
  var results = resultsState[0];
  var setResults = resultsState[1];
  var selState = useState(null);
  var selected = selState[0];
  var setSel = selState[1];
  var favState = useState([]);
  var favorites = favState[0];
  var setFav = favState[1];
  var histState = useState([]);
  var history = histState[0];
  var setHist = histState[1];
  var tabState = useState("search");
  var tab = tabState[0];
  var setTab = tabState[1];
  var learnedState = useState([]);
  var learned = learnedState[0];
  var setLearned = learnedState[1];
  var panelState = useState("detail");
  var panel = panelState[0];
  var setPanel = panelState[1];
  var showState = useState(false);
  var showDetail = showState[0];
  var setShowDetail = showState[1];
  var speech = useSpeech();
  var speak = speech.speak;
  var playingId = speech.playingId;
  var goal = 5;

  useEffect(function() {
    var q = query.trim().toLowerCase();
    if (!q) { setResults(WORDS); return; }
    setResults(WORDS.filter(function(w) {
      return w.thai.includes(q) || w.rtgs.toLowerCase().includes(q) || w.zh.includes(q) || w.en.toLowerCase().includes(q);
    }));
  }, [query]);

  function openWord(w) {
    setSel(w);
    setHist(function(h) { return [w, ...h.filter(function(x) { return x.id !== w.id; })].slice(0, 12); });
    if (!learned.includes(w.id)) setLearned(function(l) { return [...l, w.id]; });
    setShowDetail(true);
  }

  function toggleFav(id) {
    setFav(function(f) { return f.includes(id) ? f.filter(function(x) { return x !== id; }) : [...f, id]; });
  }

  var listWords = tab === "favorites" ? WORDS.filter(function(w) { return favorites.includes(w.id); })
    : tab === "history" ? history : results;
  var progress = Math.min(100, Math.round(learned.length / goal * 100));

  if (showDetail && selected) {
    return (
      <div style={{minHeight:"100vh",background:BG,color:TEXT,fontFamily:"Georgia,serif"}}>
        <div style={{background:SURFACE,borderBottom:"1px solid "+BORDER,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}>
          <button onClick={function() { setShowDetail(false); }} style={{background:"transparent",border:"none",color:GOLD,fontSize:22,cursor:"pointer"}}>←</button>
          <span style={{fontSize:22,fontWeight:900,color:WHITE}}>{selected.thai}</span>
          <span style={{fontSize:13,color:MUTED,marginLeft:4}}>{selected.rtgs}</span>
        </div>
        <div style={{padding:16}}>
          <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto"}}>
            {[["detail","📖 字典"],["flashcard","🃏 抽卡"],["quiz","✏️ 測驗"]].map(function(item) {
              var k = item[0]; var l = item[1];
              return <button key={k} onClick={function() { setPanel(k); }} style={{padding:"6px 16px",borderRadius:99,border:"1px solid "+BORDER,background:panel===k?GOLD:"transparent",color:panel===k?"#000":MUTED,fontSize:13,cursor:"pointer",fontWeight:panel===k?700:400,whiteSpace:"nowrap"}}>{l}</button>;
            })}
          </div>
          {panel === "detail" && <WordDetail word={selected} isFav={favorites.includes(selected.id)} onFav={function() { toggleFav(selected.id); }} speak={speak} playingId={playingId} />}
          {panel === "flashcard" && <Flashcard word={selected} speak={speak} playingId={playingId} />}
          {panel === "quiz" && <QuizPanel word={selected} allWords={WORDS} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:BG,color:TEXT,fontFamily:"Georgia,serif"}}>
      <div style={{background:SURFACE,borderBottom:"1px solid "+BORDER,padding:"16px 20px 0",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{fontSize:24,fontWeight:900,background:"linear-gradient(120deg,"+GOLD+","+RED+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🇹🇭 พจนานุกรม</div>
          <span style={{fontSize:11,color:MUTED}}>泰中英字典</span>
        </div>
        <div style={{background:CARD,borderRadius:10,padding:"8px 14px",marginBottom:14,border:"1px solid "+BORDER,display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:MUTED,marginBottom:5}}>
              <span>今日目標</span><span style={{color:GOLD}}>{learned.length}/{goal} 字</span>
            </div>
            <div style={{height:5,background:BORDER,borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:progress+"%",background:progress>=100?"linear-gradient(90deg,#3ecf8e,#22c55e)":"linear-gradient(90deg,"+GOLD+","+RED+")",borderRadius:99}} />
            </div>
          </div>
          <span style={{fontSize:18}}>{progress >= 100 ? "🎉" : "📚"}</span>
        </div>
        <div style={{display:"flex"}}>
          {[["search","🔍 搜尋"],["favorites","❤️ 收藏"],["history","🕐 歷史"]].map(function(item) {
            var k = item[0]; var l = item[1];
            return <button key={k} onClick={function() { setTab(k); }} style={{flex:1,padding:"9px 0",background:"none",border:"none",cursor:"pointer",borderBottom:tab===k?"2px solid "+GOLD:"2px solid transparent",color:tab===k?GOLD:MUTED,fontSize:13}}>{l}</button>;
          })}
        </div>
      </div>

      {tab === "search" && (
        <div style={{padding:"12px 14px",borderBottom:"1px solid "+BORDER}}>
          <input value={query} onChange={function(e) { setQuery(e.target.value); }} placeholder="輸入泰文 / 中文 / 英文"
            style={{width:"100%",background:CARD,border:"1px solid "+BORDER,borderRadius:9,padding:"10px 14px",color:TEXT,fontSize:15,outline:"none",boxSizing:"border-box"}} />
        </div>
      )}

      <div>
        {listWords.length === 0 && (
          <div style={{padding:24,color:MUTED,textAlign:"center",fontSize:14}}>
            {tab === "favorites" ? "還沒有收藏的單字" : tab === "history" ? "還沒有查詢記錄" : "找不到 " + query}
          </div>
        )}
        {listWords.map(function(w) {
          var levelColor = w.level === "初級" ? GREEN : w.level === "中級" ? GOLD : RED;
          return (
            <div key={w.id} onClick={function() { openWord(w); }} style={{padding:"14px 16px",cursor:"pointer",borderBottom:"1px solid "+BORDER}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <span style={{fontSize:20,fontWeight:800,color:WHITE}}>{w.thai}</span>
                  <span style={{fontSize:11,color:MUTED,marginLeft:8}}>{w.rtgs}</span>
                </div>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:levelColor+"22",color:levelColor,border:"1px solid "+levelColor+"44"}}>{w.level}</span>
                  {favorites.includes(w.id) && <span>❤️</span>}
                </div>
              </div>
              <div style={{fontSize:13,color:DIM,marginTop:3}}>{w.zh} · <span style={{color:MUTED}}>{w.en}</span></div>
              <div style={{fontSize:11,color:MUTED,marginTop:4}}>點擊查看詳細 →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
