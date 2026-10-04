/* TypeNest Academy - 100-Level Curriculum (deterministic generators, seeded per level) */
(function(){
const WORDS=`a all ask add ads as ash dad dash fall falls flag flash flask glad gas had hall half hag lad lads lash lass sad salad shall slash gash sag lag hash jag alfalfa gal fad fads red fire ride rid sire side slide guide hide use user sure rule rude fur rug dig kid kids lid lie lies like life file fill gift girl grid her here hire hurt idea irk is it its if in ink just key keys kite lead leaf less let lift lip list rush rise risk seed see seek self sell set shed shell sir sit slip suit tire tie tide toe top tip tree true try type typed tug two wade wake walk wall we wed weed well were wet what when where while who whole why wide wife wild will wind wine wise wish with wolf wood word work would write wrote yard year yes yet you your youth pop pie pet pipe pour power pull pure put quit quiet quote quiz queue owl our out over own open order oil old one or off of on pen people please pretty problem promise proud purple very back move name never can come box next exam moon bank mix cabin vivid van vase bag big bit boy bring brown best between begin both bone bus but buy by calm came camp car case cat city class clean clock close cloud club coat cold cook cool copy cost cup cut dance dark day deep desk dish door down draw dream dress drink drive drop dry dust each ear earn east easy eat egg end enjoy enter even ever every eye fact fan far farm fast fat fear feed feel fine first fish five fix floor flow fly food foot for form fox free fresh friend from front fruit full fun game gave get give go goat gold good grass great green group grow guess hand happy hard has hat have he head hear heart heat help high hill him hold home hope horse hot hour house how huge hunt hurry ice jam jar job join joke joy jump keep kick king knee know lake lamp land large last late laugh learn left leg lemon letter light line lion little live long look lost love low lucky lunch make man many map mark may me meal mean meat meet mind mine minute miss model money month more most mother mouse mouth much music must my nail near need nest net new nice night nine no noise noon north nose not note now number nut the and that this they will there their about which think people could other than then also after zero zone zoo`.split(/\s+/);
const NAMES="Sam Dana Kate Ravi Lisa Omar Tara Hugo Nina Paul India Delhi Pune Paris Texas Kyoto Lima Oslo Cairo Dubai Asha Neil Mumbai Goa".split(' ');
const TRICKY="accommodate rhythm queue necessary separate definitely receive occasion embarrass government maintenance privilege conscience millennium restaurant calendar parallel weird acquire bureaucracy questionnaire recommend surprise vacuum wednesday liaison miniature pronunciation threshold twelfth".split(' ');
const SNIP=['if(a<b){c[0]=d/e;}','x=y|z;','a:"b",\'c\'~d','p/q\\r','{k:[1,2]}','a<=b>c;','(m+n)*o-p=q'];
const EXAM=["The quick brown fox jumps over the lazy dog while the sun sets behind the hills.","Typing is a skill that grows with steady practice, patience, and a calm and even rhythm.","Every good typist keeps both eyes on the screen and lets the fingers find the keys.","Accuracy always comes first, because speed is simply accuracy repeated again and again.","A clean document shows care, and careful work earns the trust of every reader.","Government offices expect candidates to type passages without errors under strict time limits.","Practice a little each day, rest your wrists, and sit with a straight and relaxed back.","Small steady gains add up, and soon the keyboard feels like a natural part of your hands."];
const CHAPTERS=["Home Row Foundation","Top Row Expansion","Bottom Row & Shifting","Numbers, Symbols & Code","Velocity & Elite Mastery"];
const G=[[1,"fj"],[5,"dk"],[9,"sl"],[13,"a;"],[17,"gh"],[21,"ru"],[25,"ei"],[29,"woqp"],[33,"ty"],[37,""],[41,"vbmn"],[45,"cxz,."],[49,""],[53,""],[57,""],[61,"12345"],[65,"67890"],[69,"!@#$%"],[72,"^&*()_+-="],[75,"{}[]<>"],[78,"/\\|:\"'~"],[81,""]];
const T=[[1,"Anchor Keys F & J"],[5,"Inner Keys D & K"],[9,"Outer Keys S & L"],[13,"Pinky Mastery A & ;"],[17,"Center Keys G & H"],[21,"Index Reach R & U"],[25,"Middle Reach E & I"],[29,"Ring & Pinky Reach"],[33,"Top Center T & Y"],[37,"Real-Word Synthesis"],[41,"Bottom Index V B N M"],[45,"Bottom Middle & Ring"],[49,"Shift Key Rules"],[53,"Names & Places"],[57,"Tri-Row Fluency"],[61,"Number Row 1-5"],[65,"Number Row 6-0"],[69,"Symbols ! @ # $ %"],[72,"Symbols ^ & * ( ) _ + - ="],[75,"Brackets { } [ ] < >"],[78,"Syntax / \\ | : \" ' ~"],[81,"Word Endurance"],[86,"Tricky Words"],[91,"Exam Mock Run"],[96,"Speed Demon Sprint"],[100,"Grandmaster Graduation"]];
const at=(l,n)=>{let g=l[0];for(const x of l)if(x[0]<=n)g=x;return g};
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const EXAMMIN={91:30,92:32,93:35,94:38,95:40,96:60,97:65,98:70,99:80,100:40};
const levels=[];
for(let n=1;n<=100;n++){
 const r=rng(n*7919),pick=a=>a[Math.floor(r()*a.length)];
 const combo=(s,a,b)=>{let l=a+Math.floor(r()*(b-a+1)),o='';for(let i=0;i<l;i++)o+=pick(s);return o};
 let type=n%20===0?'Boss':n>80?(n===90?'Arcade':n<=85||n>90?'Timed Drill':'Review'):n%10===0?'Arcade':['Intro','New Keys','Review','Timed Drill'][(n-1)%4];
 const newKeys=at(G,n)[1];
 if(!newKeys&&type==='Intro')type='Review';
 const pool=G.filter(g=>g[0]<=n).map(g=>g[1]).join('');
 const poolS=[...pool],nkS=[...(newKeys||pool)];
 const lets=poolS.filter(c=>/[a-z]/.test(c));
 const cand=WORDS.filter(w=>[...w].every(c=>lets.includes(c)));
 const nc=cand.filter(w=>[...w].some(c=>nkS.includes(c)));
 const digits=poolS.filter(c=>/\d/.test(c)),syms=poolS.filter(c=>/[^a-z0-9;]/.test(c));
 const lens={Intro:40,'New Keys':60,Review:80,'Timed Drill':110,Arcade:130,Boss:220};
 const target=n>80?200+(n-80)*10:lens[type];
 const exam=n>=91&&n<=95;
 let text='';
 if(n>=91){let s=[...EXAM].sort(()=>r()-.5),i=0;while(text.length<target){text+=(text?' ':'')+s[i++%s.length]}}
 else{
  const out=[];let len=0,sc=0;
  while(len<target){
   let t;
   if(n>=86)t=pick(TRICKY);
   else if(n>=81)t=pick(WORDS);
   else if(type==='Intro')t=combo(nkS,2,4);
   else if(n>=75&&n>=78&&r()<.4)t=pick(SNIP);
   else if(n>=69){const x=r();t=x<.45?combo(nkS,2,4):x<.8?pick(cand)+pick(syms)+(r()<.4?combo(digits,1,2):''):pick(syms)+combo(digits,1,3)}
   else if(n>=61){t=r()<.5?combo(nkS,2,4):pick(cand)+combo(digits,1,2)}
   else if(cand.length>=6&&r()<(type==='New Keys'?.5:.85))t=(nc.length>=3&&r()<.6)?pick(nc):pick(cand);
   else{t=combo(poolS,2,4);if(![...t].some(c=>nkS.includes(c)))t=pick(nkS)+t.slice(1)}
   if(n>=49&&n<=52&&r()<.5)t=cap(t);
   if(n>=53&&n<=60){if(n<=56&&r()<.4)t=cap(pick(NAMES));if(sc===0)t=cap(t);sc++;if(sc>=6+Math.floor(r()*4)){t+='.';sc=0}else if(r()<.15&&pool.includes(','))t+=','}
   else if(n>=37&&n<61&&/^[a-z]/i.test(t)&&r()<.18){const p=poolS.filter(c=>';,.'.includes(c));if(p.length)t+=pick(p)}
   out.push(t);len+=t.length+1;
  }
  text=out.join(' ');
 }
 const min=EXAMMIN[n]||(n>80?35:Math.round(5+n*.2));
 const tgt=n>=96&&n<100?min+10:Math.ceil(min*1.3);
 levels.push({id:n,chapter:Math.ceil(n/20),title:(n%20===0&&n<100?'Boss Sprint: ':'')+at(T,n)[1],type,newKeys,subtitle:(newKeys||at(T,n)[1]).toUpperCase(),text,minAcc:n===100?100:95,minWpm:n===100?40:min,targetWpm:tgt,exam,noPenalty:!exam});
}
window.TN_CURRICULUM={chapters:CHAPTERS,levels,types:{'Intro':['fa-circle-play','b-intro'],'New Keys':['fa-box-open','b-new'],'Review':['fa-magnifying-glass','b-review'],'Timed Drill':['fa-stopwatch','b-timed'],'Arcade':['fa-gamepad','b-arcade'],'Boss':['fa-trophy','b-boss']}};
})();
