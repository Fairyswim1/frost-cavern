export const VERSION='1.0.0';
export const fmt=n=>Number.isInteger(n)?String(n):String(n);
export function calculate(a,op,b){if(!Number.isFinite(a)||!Number.isFinite(b))throw Error('유한한 수가 필요해요.');if(op==='+')return a+b;if(op==='−')return a-b;if(op==='×')return a*b||0;if(op==='÷'){if(b===0)throw Error('0으로 나눌 수 없어요.');return a/b||0;}throw Error('지원하지 않는 연산');}
export function initial(l){return {room:'start',temp:l.temp,energy:l.energy,air:l.air,turn:0,shield:false,treasure:false,visited:['start'],used:{},status:'playing',message:'도구로 온도를 바꾼 뒤 연결된 방으로 이동하세요.'};}
export function actions(l,s){return [...l.cards.map(c=>({kind:'card',id:c.id})),...(l.shield?[{kind:'shield'}]:[]),...l.edges.filter(e=>e.from===s.room).map(e=>({kind:'move',to:e.to}))];}
export function step(l,old,a){const s=structuredClone(old);if(s.status!=='playing')return {state:s,accepted:false,error:'끝난 탐사예요. 되돌리거나 다시 시작하세요.'};let msg='';
 if(a.kind==='card'){const c=l.cards.find(c=>c.id===a.id);if(!c||s.energy<c.cost||(s.used[c.id]||0)>=c.uses)return {state:s,accepted:false,error:'에너지나 도구 횟수가 부족해요.'};const before=s.temp;s.temp=calculate(s.temp,c.op,c.n);s.energy-=c.cost;s.used[c.id]=(s.used[c.id]||0)+1;msg=fmt(before)+' '+c.op+' ('+fmt(c.n)+') = '+fmt(s.temp);}
 else if(a.kind==='shield'){if(!l.shield||s.shield||s.energy<1)return {state:s,accepted:false,error:'보호막을 준비할 수 없어요.'};s.energy--;s.shield=true;msg='다음 냉기 한 번을 막을 준비가 됐어요.';}
 else if(a.kind==='move'){const e=l.edges.find(e=>e.from===s.room&&e.to===a.to);if(!e)return {state:s,accepted:false,error:'연결된 길이 없어요.'};if(s.temp<e.min||s.temp>e.max)return {state:s,accepted:false,error:'문 온도가 맞지 않아요. 먼저 도구를 사용하세요.'};const r=l.rooms.find(r=>r.id===a.to);s.room=r.id;msg=r.name+'에 도착했어요.';if(r.weather){if(s.shield){s.shield=false;msg+=' 보호막이 냉기를 막았어요.';}else{const before=s.temp;s.temp+=r.weather;msg+=' 냉기: '+fmt(before)+' + ('+r.weather+') = '+fmt(s.temp);}}if(!s.visited.includes(r.id)){s.energy+=r.supply||0;s.visited.push(r.id);if(r.supply)msg+=' 에너지 '+r.supply+' 보급!';}if(r.treasure)s.treasure=true;}
 else return {state:s,accepted:false,error:'알 수 없는 행동'};
 s.air--;s.turn++;s.message=msg;
 if(s.temp < -12 || s.temp > 12){s.status='lost';s.message+=' 안전 범위를 벗어나 장치가 고장 났어요. 되돌리기로 회복할 수 있어요.';}
 else if(l.rooms.find(r=>r.id===s.room)?.exit&&s.treasure){s.status='won';s.message+=' 보물을 가지고 무사히 탈출했어요!';}
 else if(s.air<=0){s.status='lost';s.message+=' 남은 행동을 모두 썼어요. 되돌리거나 경로를 다시 계획하세요.';}
 if(s.status==='playing'&&!l.cards.some(c=>s.energy>=c.cost&&(s.used[c.id]||0)<c.uses)&&!(l.shield&&!s.shield&&s.energy>=1)&&!l.edges.some(e=>e.from===s.room&&s.temp>=e.min&&s.temp<=e.max)){s.status='lost';s.message+=' 사용할 도구와 통과할 문이 없어요. 되돌려 다른 계획을 시도하세요.';} return {state:s,accepted:true};}
export function solve(l){const q=[{s:initial(l),path:[]}],seen=new Set();for(let i=0;i<q.length;i++){const {s,path}=q[i];if(s.status==='won')return path;if(s.status!=='playing')continue;const key=JSON.stringify([s.room,s.temp,s.energy,s.air,s.shield,s.visited,s.used]);if(seen.has(key))continue;seen.add(key);for(const a of actions(l,s)){const r=step(l,s,a);if(r.accepted)q.push({s:r.state,path:path.concat(a)});}if(q.length>250000)throw Error('탐색 한도');}return null;}
