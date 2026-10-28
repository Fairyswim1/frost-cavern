const c=(id,op,n,cost,uses)=>({id,op,n,cost,uses});
const warm=n=>c('warm','+',2,1,n),flip=()=>c('flip','×',-1,2,1),half=n=>c('half','÷',2,1,n),sub=()=>c('sub','−',-2,1,1),cool=()=>c('cool','−',2,1,1);
const room=(id,name,x,y,extra={})=>({id,name,x,y,...extra});
const simple=(target,weather=0)=>[room('start','入口',12,55),room('relic','雪の心',52,35,{treasure:true,weather}),room('exit','帰還',88,55,{exit:true})];
const edge=(from,to,temp)=>({from,to,min:temp,max:temp});
const levels=[
 {name:'얼어붙은 첫 문',intro:'온도 장치로 +2를 두 번 더해 문에 적힌 온도를 만드세요. 보물을 챙긴 뒤 출구로 나가면 성공!',temp:-3,energy:3,air:6,cards:[warm(3)],rooms:simple(1),edges:[edge('start','relic',1),edge('relic','exit',1)],decision:'음수에서 양수를 더해 문 통과'},
 {name:'차가움을 빼면',intro:'더하기 도구는 한 번뿐! −(−2)는 음수를 빼는 연산이에요. 두 도구를 조합해 보세요.',temp:-3,energy:2,air:4,cards:[warm(1),sub()],rooms:simple(1),edges:[edge('start','relic',1),edge('relic','exit',1)],decision:'음수 빼기와 제한된 도구 조합'},
 {name:'한 번에 뒤집기',intro:'×(−1)은 부호를 뒤집어요. 덧셈을 반복할 시간은 없어요. 에너지 2를 써서 행동을 줄일까요?',temp:-6,energy:2,air:3,cards:[warm(6),flip()],rooms:simple(6),edges:[edge('start','relic',6),edge('relic','exit',6)],decision:'시간과 에너지를 교환하는 곱셈'},
 {name:'절반의 길',intro:'÷2는 절댓값을 절반으로 만들어요. 부호와 크기를 따로 계획해 보세요.',temp:-5,energy:3,air:5,cards:[warm(2),flip(),half(1)],rooms:simple(2.5),edges:[edge('start','relic',2.5),edge('relic','exit',2.5)],decision:'음수·소수 나눗셈을 포함한 연산 순서'},
 {name:'멀리 돌아 채우기',intro:'직진하면 에너지가 부족해요. 보급소는 처음 들어갈 때만 에너지를 3 채워 줘요. 돌아갈 시간까지 계산하세요.',temp:-4,energy:1,air:7,cards:[warm(4),flip(),half(1)],rooms:[room('start','입구',12,55),room('supply','보급소',40,15,{supply:3}),room('relic','눈꽃 보물',65,60,{treasure:true}),room('exit','출구',90,28,{exit:true})],edges:[edge('start','supply',-4),edge('start','relic',2),edge('supply','relic',2),edge('relic','exit',2)],decision:'우회 보급과 직진의 자원 선택'},
 {name:'냉기 속 보물',intro:'보물 방에 들어간 직후 온도에 −8이 더해져요. 미리 보호막을 켜면 한 번의 냉기를 막아요. 준비에 1행동·에너지 1이 필요해요.',temp:4,energy:3,air:5,shield:true,cards:[warm(3),half(1)],rooms:simple(4,-8),edges:[edge('start','relic',4),edge('relic','exit',2)],decision:'보호막 준비와 사후 복구의 비용 비교'},
 {name:'위험한 경계',intro:'온도가 −12 미만 또는 +12 초과면 장치가 고장 나요. 문을 통과한 뒤의 냉기까지 살펴보세요.',temp:-8,energy:3,air:4,shield:true,cards:[warm(2),flip(),half(1)],rooms:simple(-8,-6),edges:[edge('start','relic',-8),edge('relic','exit',-4)],decision:'문 조건뿐 아니라 도착 후 안전 범위 판단'},
 {name:'동굴의 마지막 빛',intro:'보급, 부호 뒤집기, 나눗셈, 냉기, 마지막 문을 함께 계획하세요. 보호막으로 아낀 행동과 에너지를 비교해 보세요.',temp:-6,energy:1,air:8,shield:true,cards:[warm(3),flip(),half(2),cool()],rooms:[room('start','입구',10,60),room('supply','보급소',36,20,{supply:5}),room('relic','눈꽃 보물',64,62,{treasure:true,weather:-8}),room('exit','출구',90,22,{exit:true})],edges:[edge('start','supply',-6),edge('supply','relic',3),edge('relic','exit',1)],decision:'보급·연산 순서·냉기 보호·행동 제한 결합'}
];
for(const l of levels)for(const r of l.rooms){if(r.id==='start')r.name='입구';if(r.id==='relic')r.name='눈꽃 보물';if(r.id==='exit')r.name='출구';}
export {levels};
