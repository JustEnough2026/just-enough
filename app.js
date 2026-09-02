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

// 滷味：先選辣度，再選品項
const luSection=document.createElement('section'); luSection.className='menu-category luwei-section';
luSection.innerHTML=`<div class="category-title-row"><h3 class="category-title">🌙 滷味類</h3><span class="hours-tag">${luwei.hours}</span></div><div class="luwei-box"><div class="luwei-spice-title">先選辣度</div><div class="opts luwei-spice">${luwei.spice.map((s,i)=>`<button type="button" class="opt ${i===0?'selected':''}" data-spice="${s}">${s}</button>`).join('')}</div><div id="luwei-groups"></div></div>`;
list.appendChild(luSection);
luSection.querySelectorAll('[data-spice]').forEach(b=>b.addEventListener('click',()=>{luweiSpice=b.dataset.spice;luSection.querySelectorAll('[data-spice]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');refreshLuwei();}));
const luGroups=$('#luwei-groups'), luRows=[];
luwei.groups.forEach(g=>{const box=document.createElement('div');box.className='luwei-group';box.innerHTML=`<h4>${g.name}</h4><div class="luwei-items"></div>`;const wrap=box.querySelector('.luwei-items');g.items.forEach(item=>{luwei.spice.forEach(s=>state[luKey(item,s)]=0);const row=document.createElement('div');row.className='luwei-item';row.innerHTML=`<div><b>${item.name}</b><span>${money(item.price)}</span></div><div class="qty"><button type="button" data-d="-1">−</button><b class="luqty">0</b><button type="button" data-d="1">＋</button></div>`;row.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{const k=luKey(item,luweiSpice);state[k]=Math.max(0,(state[k]||0)+Number(b.dataset.d));refreshLuwei();render();}));wrap.appendChild(row);luRows.push({item,row});});luGroups.appendChild(box);});
function refreshLuwei(){luRows.forEach(({item,row})=>{row.querySelector('.luqty').textContent=state[luKey(item,luweiSpice)]||0;const selected=luwei.spice.filter(s=>(state[luKey(item,s)]||0)>0).map(s=>`${s}×${state[luKey(item,s)]}`).join('、');let note=row.querySelector('.lu-selected');if(!note){note=document.createElement('small');note.className='lu-selected';row.firstElementChild.appendChild(note);}note.textContent=selected;});}
refreshLuwei();

function lines(){const out=[];products.forEach(p=>{if(p.options)p.options.forEach(opt=>{const q=state[key(p,opt)]||0;if(q>0)out.push({name:p.name,opt,q,price:p.price});});else{const q=state[key(p)]||0;if(q>0)out.push({name:p.name,opt:'',q,price:p.price});}});luwei.groups.forEach(g=>g.items.forEach(item=>luwei.spice.forEach(spice=>{const q=state[luKey(item,spice)]||0;if(q>0)out.push({name:item.name,opt:spice,q,price:item.price,luwei:true});})));return out;}
function totals(){return lines().reduce(([c,t],x)=>[c+x.q,t+x.q*x.price],[0,0]);}
function render(){const[c,t]=totals();$('#cart-count').textContent=`${c} 份`;$('#cart-total').textContent=money(t);$('#sheet-total').textContent=money(t);$('#cart-items').innerHTML=lines().map(x=>`<div class="cart-item"><b>${x.name}${x.opt?`（${x.opt}）`:''}</b><span>${x.q} 份 × ${money(x.price)}　＝ ${money(x.q*x.price)}</span></div>`).join('')||'<p>尚未選擇餐點，請先回到菜單按「＋」。</p>';}
function orderText(){const[c,t]=totals(),name=$('#customer-name').value.trim(),rawDate=$('#pickup-date').value,time=$('#pickup-time').value,note=$('#note').value.trim();const date=rawDate?`${Number(rawDate.slice(5,7))}/${Number(rawDate.slice(8,10))}`:'';const header=[name||'未填',date||'未填',time||'未填'].join(' ');const items=lines().map(x=>`${x.name}${x.opt?`（${x.opt}）`:''} ${money(x.price)} ×${x.q}`).join('\n');const parts=[header,items,`共 ${c} 份｜總計 ${money(t)}`,utensil];if(note)parts.push(`備註：${note}`);return parts.join('\n');}
$('#open-cart').addEventListener('click',()=>{$('#cart-sheet').classList.add('open');$('#cart-sheet').setAttribute('aria-hidden','false');render();});
$('#close-cart').addEventListener('click',()=>{$('#cart-sheet').classList.remove('open');$('#cart-sheet').setAttribute('aria-hidden','true');});
$('#back-order').addEventListener('click',()=>$('#close-cart').click());
$('#cart-sheet').addEventListener('click',e=>{if(e.target.id==='cart-sheet')$('#close-cart').click();});
document.querySelectorAll('.utensils button').forEach((b,i)=>{if(i===0)b.classList.add('selected');b.addEventListener('click',()=>{utensil=b.dataset.utensil;document.querySelectorAll('.utensils button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');});});
$('#send-line').addEventListener('click',()=>{window.location.href='https://line.me/R/msg/text/?'+encodeURIComponent(orderText());});
render();
