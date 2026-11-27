/* Murelle: prices/availability come from the Google Sheet. If anything fails, the page stays as-is. */
(function(){
var CSV='https://docs.google.com/spreadsheets/d/e/2PACX-1vQIQFOQ8GA1pZ6BM7GdDp3iZR9AXH9_i4_3_k2jlnkGsvCYsQ-nVvrFFfCJtgcBOmqr6rZUO7UJh9s8/pub?output=csv';
function parse(t){var r=[],row=[],c='',q=false;for(var i=0;i<t.length;i++){var ch=t[i];
 if(q){if(ch=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=ch}
 else if(ch=='"')q=true;else if(ch==','){row.push(c);c=''}
 else if(ch=='\n'){row.push(c);r.push(row);row=[];c=''}else if(ch!='\r')c+=ch}
 if(c||row.length){row.push(c);r.push(row)}return r}
function ar(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]})}
function en(s){return String(s).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)})}
function num(v){v=en(v||'').replace(/[^\d]/g,'');return v?parseInt(v,10):null}
function setPrice(a,p){
 var sp=a.querySelector('.price');if(sp)sp.textContent=ar(p)+' جنيه';
 try{var u=new URL(a.href),t=u.searchParams.get('text')||'';
  var n=t.replace(/(بسعر\s*)[٠-٩\d]+/,function(m,x){return x+ar(p)});
  if(n!==t){u.searchParams.set('text',n);a.href=u.toString()}}catch(e){}}
window.murelleApply=function(doc,csv){
 var rows=parse(csv);if(rows.length<2)return 0;var done=0;
 rows.slice(1).forEach(function(r){var slug=(r[0]||'').trim();if(!slug)return;
  var card=null;doc.querySelectorAll('#grid .card, .card').forEach(function(c){var l=c.querySelector('a[href*="p/'+slug+'.html"]');if(l&&!card)card=c});
  if(!card)return;
  var btns=card.querySelectorAll('.sizes .btn-order');
  var isMusk=card.getAttribute('data-cat')==='musk';
  var p50=num(r[3]),p100=num(r[4]),pq=num(r[6]);
  btns.forEach(function(b){var s=(b.querySelector('.size')||{}).textContent||'';
   if(/100/.test(s)&&p100)setPrice(b,p100);
   else if(/ربع/.test(s)&&pq)setPrice(b,pq);
   else if(/50/.test(s)&&p50)setPrice(b,p50)});
  var av=(r[5]||'').trim();
  if(av==='لا'||av.toLowerCase()==='no'){card.classList.add('soldout');card.style.opacity='.55';
   btns.forEach(function(b){b.removeAttribute('href');b.style.pointerEvents='none';var w=b.querySelector('.wa');if(w)w.textContent='نفذت الكمية'})}
  done++});
 return done};
window.murelleLoad=function(doc){return fetch(CSV+'&t='+Date.now()).then(function(r){return r.text()}).then(function(t){return window.murelleApply(doc,t)}).catch(function(){return 0})};
if(!window.MURELLE_MANUAL){var go=function(){window.murelleLoad(document)};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',go):go()}
})();
