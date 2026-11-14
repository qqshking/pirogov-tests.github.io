// Логика тестирования; банк миологии загружается из myology-questions.js.
const $=s=>document.querySelector(s);
const show=id=>{["v-home","v-set","v-quiz","v-res"].forEach(v=>$("#"+v).hidden=v!==id);view=id;window.scrollTo(0,0)};
const sh=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pl=n=>n==1?"ответ":(n>=2&&n<=4?"ответа":"ответов");
let L=[],cur=0,S={},round=1,bad=[],view="v-home",T=null,Q=[];

function optList(x,reveal,live,onchg){
  const f=document.createDocumentFragment();
  x.o.forEach((o,i)=>{
    const l=document.createElement("label");l.className="opt";
    const cb=document.createElement("input");cb.type="checkbox";cb.checked=x.p.has(i);cb.disabled=!live;
    if(live)cb.onchange=()=>{cb.checked?x.p.add(i):x.p.delete(i);onchg&&onchg()};
    const b=document.createElement("i");b.className="box";
    const s=document.createElement("span");s.textContent=o.t;
    l.append(cb,b,s);
    if(reveal){
      const sel=x.p.has(i);let t="";
      l.classList.add("done");
      if(sel&&o.c){l.classList.add("ok");t="верно"}
      else if(sel){l.classList.add("bad");t="неверно"}
      else if(o.c){l.classList.add("miss");t="нужно было выбрать"}
      if(t){const e=document.createElement("em");e.className="tag";e.textContent=t;l.append(e)}
    }
    f.append(l);
  });
  return f;
}
function mainLabel(){
  const x=L[cur];
  $("#main").textContent=x.done?(cur==L.length-1?"Завершить":"Дальше"):(x.p.size?"Проверить":"Пропустить");
}
function render(){
  const x=L[cur];
  $("#pos").textContent="Вопрос "+(cur+1)+" из "+L.length;
  $("#chip").hidden=round==1;
  $("#chip").textContent="Работа над ошибками, круг "+(round-1);
  $("#bar").style.width=((cur+1)/L.length*100)+"%";
  $("#qn").textContent="№"+x.n+" в базе";
  $("#qt").textContent=x.q;
  const k=x.o.filter(o=>o.c).length;
  $("#hint-t").textContent=S.hint?"Выберите "+k+" "+pl(k):"Выберите верные ответы";
  $("#ans").replaceChildren(optList(x,x.done,!x.done,()=>{mainLabel();save()}));
  $("#prev").disabled=cur==0;
  mainLabel();
  save();
}
function begin(rows,rd){
  round=rd;
  L=rows.map(r=>({r,ri:Q.indexOf(r),n:r[0],q:r[1],o:r[2].map((a,k)=>({t:a[0],c:!!a[1],k})),p:new Set(),done:false}));
  if(S.sq)sh(L);
  if(S.sa)L.forEach(x=>sh(x.o));
  cur=0;show("v-quiz");render();
}
function go(){
  S={sq:$("#sq").checked,sa:$("#sa").checked,hint:$("#hint").checked};
  let rows=Q.slice();
  if(!$("#all").checked)rows=sh(rows).slice(0,30).sort((a,b)=>Q.indexOf(a)-Q.indexOf(b));
  begin(rows,1);
}
function finish(){
  let ok=0,no=0;bad=[];
  L.forEach(x=>{
    if(!x.p.size){no++;bad.push(x);return}
    if(x.o.every((o,i)=>o.c===x.p.has(i)))ok++;else bad.push(x);
  });
  const n=L.length,pc=Math.round(ok/n*100);
  $("#ring").style.setProperty("--p",ok/n*100);
  $("#pct").textContent=pc+"%";
  $("#s-ok").textContent=ok;$("#s-bad").textContent=bad.length-no;$("#s-no").textContent=no;
  $("#rt").textContent=!bad.length?(round>1?"Ошибок не осталось":"Без единой ошибки"):pc>=85?"Почти идеально":pc>=60?"Неплохо, есть что подтянуть":"Стоит повторить материал";
  $("#rs").textContent=(round>1?"Круг "+(round-1)+" работы над ошибками: ":"")+ok+" из "+n+" верно";
  $("#retry").hidden=!bad.length;
  $("#retry").textContent="Прорешать ошибки ("+bad.length+")";
  const w=$("#wrong");w.replaceChildren();
  if(bad.length){const h=document.createElement("h2");h.className="wh";h.textContent="Разбор ошибок";w.append(h)}
  bad.forEach(x=>{
    const d=document.createElement("div");d.className="card wq";
    const q=document.createElement("p");q.className="qn";q.textContent="№"+x.n+" в базе";
    const t=document.createElement("h3");t.textContent=x.q;
    d.append(q,t,optList(x,true,false));w.append(d);
  });
  if(round==1)try{localStorage.setItem("anat-last:"+T.id,JSON.stringify({pc,ok,n}))}catch(e){}
  show("v-res");save();
}
$("#go").onclick=go;
$("#again").onclick=()=>{show("v-set");save()};
$("#retry").onclick=()=>begin(bad.map(x=>x.r),round+1);
$("#fin").onclick=finish;
$("#prev").onclick=()=>{if(cur>0){cur--;render()}};
$("#main").onclick=()=>{
  const x=L[cur];
  if(!x.done&&x.p.size){x.done=true;render();return}
  if(cur==L.length-1){finish();return}
  cur++;render();
};

function save(){
  try{
    if(!T||view=="v-home")return;
    if(view=="v-set"){localStorage.removeItem(keyOf(T.id));return}
    localStorage.setItem(keyOf(T.id),JSON.stringify({v:1,view,S,round,cur,L:L.map(x=>({i:x.ri,o:x.o.map(o=>o.k),p:[...x.p],d:x.done?1:0}))}));
  }catch(e){}
}
const keyOf=id=>id=="kol1"?"anat-kol1-progress-v1":"anat-progress-v1:"+id;
const rd=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const el=(g,c,x)=>{const e=document.createElement(g);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
function info(t){
  try{
    const p=rd(keyOf(t.id));
    if(p&&p.v==1&&Array.isArray(p.L)&&p.L.length){
      const m=p.L.length,d=p.L.filter(z=>z.d).length;
      if(p.view=="v-res"){
        const ok=p.L.filter(z=>z.p.length&&z.o.every((k,j)=>!!t.Q[z.i][2][k][1]===z.p.includes(j))).length;
        return{s:"Результат: "+ok+" из "+m+(ok<m?". Ошибки можно прорешать":""),b:"Открыть"};
      }
      return{s:(p.round>1?"Работа над ошибками: ":"")+"решено "+d+" из "+m,f:d/m,b:"Продолжить"};
    }
  }catch(e){}
  const l=rd("anat-last:"+t.id);
  return{s:l?"Последний результат: "+l.pc+"%":"Ещё не проходили",b:"Начать"};
}
function home(){
  const box=$("#list");box.replaceChildren();
  TESTS.forEach(t=>{
    const i=info(t),b=el("button","tcard"),top=el("div","tt");
    top.append(el("h3",null,t.title),el("span","go",i.b));
    b.append(top,el("p","sm",t.sub+", вопросов: "+t.Q.length),el("p","sm st",i.s));
    if(i.f!=null){const tr=el("div","track tbar"),f=el("div");f.style.cssText="height:100%;background:var(--acc);border-radius:99px;width:"+Math.round(i.f*100)+"%";tr.append(f);b.append(tr)}
    b.onclick=()=>openTest(t);
    box.append(b);
  });
  show("v-home");
}
function openTest(t){
  T=t;Q=t.Q;
  $("#cnt").textContent=Q.length;$("#set-title").textContent=t.title;
  if(!load())show("v-set");
}
function load(){
  try{
    const s=rd(keyOf(T.id));
    if(!s||s.v!=1||!Array.isArray(s.L)||!s.L.length)return false;
    const A=s.L.map(z=>{
      const r=Q[z.i];
      if(!r||z.o.length!=r[2].length)throw 0;
      return{r,ri:z.i,n:r[0],q:r[1],o:z.o.map(k=>({t:r[2][k][0],c:!!r[2][k][1],k})),p:new Set(z.p),done:!!z.d};
    });
    L=A;S=s.S||{};round=s.round||1;cur=Math.min(Math.max(s.cur|0,0),L.length-1);
    if(s.view=="v-res")finish();else{show("v-quiz");render()}
    return true;
  }catch(e){L=[];return false}
}
$("#back1").onclick=()=>location.href="anatomy.html";$("#home1").onclick=()=>location.href="anatomy.html";$("#home2").onclick=()=>location.href="anatomy.html";
home();
openTest(TESTS[0]);
