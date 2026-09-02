const {store,products,luwei}=window.STORE_CONFIG;
const state={}, selections={};
let utensil='⭕️ 餐具', luweiSpice=luwei.spice[0];
const $=s=>document.querySelector(s);
const money=n=>`$${Number(n).toLocaleString('zh-TW')}`;
const key=(p,opt='')=>`${p.id}__${opt}`;
const luKey=(item,spice)=>`${item.id}__${spice}`;

$('#open-status').textContent=store.open?store.hours:'今日店休';
[['line-link',store.lineCommunity],['map-link',store.googleMaps],['foodpanda-link',store.foodpanda],['uber-link',store.uberEats]].forEach(([id,u])=>{const e=$('#'+id);if(!e)return;if(u)e.href=u;else e.style.display='none';});
$('#info-address').textContent=store.address;

const list=$('#product-list');
const categoryOrder=[
  ['雞肉類',''],
  ['涼粉類',''],
  ['飯類','全天供應'],
  ['便當類','11:00–16:00']
];
const categoryLists={};
categoryOrder.forEach(([name,hours])=>{
  const section=document.createElement('section'); section.className='menu-category';
  section.innerHTML=`<div class="category-title-row"><h3 class="category-title">${name}</h3>${hours?`<span class="hours-tag">${hours}</span>`:''}</div><div class="products category-products"></div>`;
  list.appendChild(section); categoryLists[name]=section.querySelector('.category-products');
});

function productCard(p){
  selections[p.id]=p.options?.[0]||'';
  if(p.options)p.options.forEach(opt=>state[key(p,opt)]=0);else state[key(p)]=0;
  const d=document.createElement('article'); d.className='product'+(!p.image?' no-image':'');
  d.innerHTML=`${p.badge?`<span class="badge">${p.badge}</span>`:''}${p.image?`<img src="${p.image}" alt="${p.name}">`:''}<div class="product-content"><div class="product-head"><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div>${p.options?`<div class="option-label">口味｜先選口味，再按＋加入</div><div class="opts">${p.options.map((x,i)=>`<button type="button" class="opt ${i===0?'selected':''}" data-opt="${x}">${x}</button>`).join('')}</div>`:''}<div class="qty-wrap"><span class="qty-label">數量</span><div class="qty"><button type="button" data-d="-1">−</button><b>0</b><button type="button" data-d="1">＋</button></div></div>${p.options?'<div class="flavor-counts"></div>':''}</div>`;
  const qtyEl=d.querySelector('.qty b'), countsEl=d.querySelector('.flavor-counts');
  const refresh=()=>{const opt=selections[p.id];qtyEl.textContent=state[key(p,opt)]||0;if(countsEl)countsEl.innerHTML=p.options.filter(o=>(state[key(p,o)]||0)>0).map(o=>`<span>${o} × ${state[key(p,o)]}</span>`).join('');};
  d.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{selections[p.id]=b.dataset.opt;d.querySelectorAll('.opt').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');refresh();}));
  d.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{const k=key(p,selections[p.id]);state[k]=Math.max(0,(state[k]||0)+Number(b.dataset.d));refresh();render();}));
  refresh(); return d;
}
products.forEach(p=>categoryLists[p.category].appendChild(productCard(p)));

// 滷味：一份一張卡片；選辣度、品項，再用同一組 − / ＋ 調整數量
const luSection=document.createElement('section'); luSection.className='menu-category luwei-section';
luSection.innerHTML=`
  <div class="category-title-row">
    <h3 class="category-title">🌙 滷味類</h3>
    <span class="hours-tag">${luwei.hours}</span>
  </div>
  <div id="luwei-servings"></div>
  <button type="button" id="add-luwei-serving" class="add-serving">＋ 新增一份</button>`;
list.appendChild(luSection);

let luweiServingSeq=0;
const luweiServings=[];
const allLuItems=luwei.groups.flatMap(g=>g.items.map(item=>({...item,group:g.name})));

function addLuweiServing(){
  const serving={id:++luweiServingSeq,spice:luwei.spice[0],itemId:allLuItems[0].id,qty:{}};
  allLuItems.forEach(item=>serving.qty[item.id]=0);
  luweiServings.push(serving);
  renderLuweiServings(); render();
}
function servingItem(serving){return allLuItems.find(x=>x.id===serving.itemId)||allLuItems[0];}
function servingCount(serving){return Object.values(serving.qty).reduce((a,b)=>a+b,0);}
function servingSubtotal(serving){return allLuItems.reduce((sum,item)=>sum+(serving.qty[item.id]||0)*item.price,0);}
function renderLuweiServings(){
  const wrap=$('#luwei-servings'); wrap.innerHTML='';
  luweiServings.forEach((serving,index)=>{
    const item=servingItem(serving);
    const card=document.createElement('article'); card.className='product luwei-serving-card no-image';
    card.innerHTML=`<div class="product-content">
      <div class="product-head"><h3>滷味｜第 ${index+1} 份</h3>${luweiServings.length>1?'<button type="button" class="remove-serving">刪除這份</button>':''}</div>
      <div class="option-label">辣度｜選擇這一份的辣度</div>
      <div class="opts spice-options">${luwei.spice.map(x=>`<button type="button" class="opt ${x===serving.spice?'selected':''}" data-spice="${x}">${x}</button>`).join('')}</div>
      <div class="option-label">品項｜先選品項，再按＋加入</div>
      <div class="luwei-item-options">${luwei.groups.map(g=>`<div class="luwei-choice-group"><b>${g.name}</b><div class="opts">${g.items.map(x=>`<button type="button" class="opt item-opt ${x.id===serving.itemId?'selected':''}" data-item="${x.id}">${x.name} ${money(x.price)}</button>`).join('')}</div></div>`).join('')}</div>
      <div class="qty-wrap luwei-main-qty"><span class="qty-label">${item.name} ${money(item.price)}</span><div class="qty"><button type="button" data-d="-1">−</button><b>${serving.qty[item.id]||0}</b><button type="button" data-d="1">＋</button></div></div>
      <div class="flavor-counts serving-summary">${allLuItems.filter(x=>(serving.qty[x.id]||0)>0).map(x=>`<span>${x.name} × ${serving.qty[x.id]}</span>`).join('')}</div>
      ${(servingCount(serving)>0)?`<div class="serving-total">${servingCount(serving)}項｜${money(servingSubtotal(serving))}</div>`:''}
    </div>`;
    card.querySelectorAll('[data-spice]').forEach(b=>b.addEventListener('click',()=>{serving.spice=b.dataset.spice;renderLuweiServings();render();}));
    card.querySelectorAll('[data-item]').forEach(b=>b.addEventListener('click',()=>{serving.itemId=b.dataset.item;renderLuweiServings();}));
    card.querySelectorAll('.luwei-main-qty .qty button').forEach(b=>b.addEventListener('click',()=>{const id=serving.itemId;serving.qty[id]=Math.max(0,(serving.qty[id]||0)+Number(b.dataset.d));renderLuweiServings();render();}));
    const del=card.querySelector('.remove-serving'); if(del)del.addEventListener('click',()=>{luweiServings.splice(index,1);renderLuweiServings();render();});
    wrap.appendChild(card);
  });
}
$('#add-luwei-serving').addEventListener('click',addLuweiServing);
addLuweiServing();

function lines(){
  const out=[];
  products.forEach(p=>{if(p.options)p.options.forEach(opt=>{const q=state[key(p,opt)]||0;if(q>0)out.push({name:p.name,opt,q,price:p.price});});else{const q=state[key(p)]||0;if(q>0)out.push({name:p.name,opt:'',q,price:p.price});}});
  luweiServings.forEach((serving,si)=>allLuItems.forEach(item=>{const q=serving.qty[item.id]||0;if(q>0)out.push({name:item.name,opt:serving.spice,q,price:item.price,luwei:true,serving:si+1});}));
  return out;
}
function totals(){
  let c=0,t=0;
  products.forEach(p=>{if(p.options)p.options.forEach(opt=>{const q=state[key(p,opt)]||0;c+=q;t+=q*p.price;});else{const q=state[key(p)]||0;c+=q;t+=q*p.price;}});
  luweiServings.forEach(s=>{if(servingCount(s)>0){c+=1;t+=servingSubtotal(s);}});
  return[c,t];
}
function orderText(){
  const name=$('#customer-name').value.trim(),rawDate=$('#pickup-date').value,time=$('#pickup-time').value,note=$('#note').value.trim();
  const parts=['【食材有限 Just Enough】','',`取餐人：${name||'未填'}`,`取餐日期：${rawDate||'未填'}`,`取餐時間：${time||'未填'}`,''];
  let totalMoney=0,totalServings=0;
  products.forEach(p=>{
    if(p.options)p.options.forEach(opt=>{const q=state[key(p,opt)]||0;if(q>0){const subtotal=q*p.price;parts.push(`${p.name}(${opt})*${q} ${money(subtotal)}`);totalMoney+=subtotal;totalServings+=q;}});
    else{const q=state[key(p)]||0;if(q>0){const subtotal=q*p.price;parts.push(`${p.name}*${q} ${money(subtotal)}`);totalMoney+=subtotal;totalServings+=q;}}
  });
  luweiServings.forEach((serving,index)=>{
    const chosen=allLuItems.filter(item=>(serving.qty[item.id]||0)>0);
    if(!chosen.length)return;
    const subtotal=servingSubtotal(serving),itemCount=servingCount(serving);
    parts.push('',`滷味第${index+1}份｜${serving.spice}：`);
    chosen.forEach(item=>{const q=serving.qty[item.id];parts.push(`${item.name}*${q} ${money(q*item.price)}`);});
    parts.push(`${itemCount}項｜${money(subtotal)}`);
    totalMoney+=subtotal; totalServings+=1;
  });
  parts.push('',`共幾份：${totalServings}份`,`總金額：${money(totalMoney)}`,'',`餐具：${utensil.startsWith('⭕️')?'⭕️':'❌'}`,'',`備註：${note}`);
  return parts.join('\n');
}

function render(){
  const[c,t]=totals();
  $('#cart-count').textContent=`${c} 份`;
  $('#cart-total').textContent=money(t);
  const box=$('#cart-items');
  if(box){
    box.innerHTML='';
    const pre=document.createElement('pre');
    pre.className='order-preview';
    pre.textContent=orderText();
    box.appendChild(pre);
  }
}
$('#open-cart').addEventListener('click',()=>{$('#cart-sheet').classList.add('open');$('#cart-sheet').setAttribute('aria-hidden','false');render();});
$('#close-cart').addEventListener('click',()=>{$('#cart-sheet').classList.remove('open');$('#cart-sheet').setAttribute('aria-hidden','true');});
$('#back-order').addEventListener('click',()=>$('#close-cart').click());
$('#cart-sheet').addEventListener('click',e=>{if(e.target.id==='cart-sheet')$('#close-cart').click();});
document.querySelectorAll('.utensils button').forEach((b,i)=>{if(i===0)b.classList.add('selected');b.addEventListener('click',()=>{utensil=b.dataset.utensil;document.querySelectorAll('.utensils button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');});});
$('#send-line').addEventListener('click',()=>{window.location.href='https://line.me/R/msg/text/?'+encodeURIComponent(orderText());});
render();
