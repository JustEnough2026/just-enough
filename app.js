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

// 滷味：做成和涼粉相同的「選項在卡片裡」操作
const luSection=document.createElement('section'); luSection.className='menu-category luwei-section';
luSection.innerHTML=`
  <div class="category-title-row">
    <h3 class="category-title">🌙 滷味類</h3>
    <span class="hours-tag">${luwei.hours}</span>
  </div>
  <div class="product luwei-card no-image">
    <div class="product-content">
      <div class="product-head"><h3>滷味</h3></div>
      <div class="option-label">辣度｜先選辣度，再選品項加入</div>
      <div class="opts luwei-spice">
        ${luwei.spice.map((spice,i)=>`<button type="button" class="opt ${i===0?'selected':''}" data-spice="${spice}">${spice}</button>`).join('')}
      </div>
      <div class="luwei-current"><span>目前辣度</span><strong id="luwei-current-spice">${luweiSpice}</strong></div>
      <div class="luwei-item-title">品項</div>
      <div id="luwei-groups"></div>
      <div id="luwei-selected-summary" class="flavor-counts luwei-selected-summary"></div>
    </div>
  </div>`;
list.appendChild(luSection);

luSection.querySelectorAll('[data-spice]').forEach(b=>b.addEventListener('click',()=>{
  luweiSpice=b.dataset.spice;
  luSection.querySelectorAll('[data-spice]').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
  refreshLuwei();
}));

const luGroups=$('#luwei-groups'), luRows=[];
luwei.groups.forEach(g=>{
  const box=document.createElement('div');
  box.className='luwei-group';
  box.innerHTML=`<h4>${g.name}</h4><div class="luwei-items"></div>`;
  const wrap=box.querySelector('.luwei-items');
  g.items.forEach(item=>{
    luwei.spice.forEach(spice=>state[luKey(item,spice)]=0);
    const row=document.createElement('div');
    row.className='luwei-item';
    row.innerHTML=`
      <div class="luwei-item-name"><b>${item.name}</b><span>${money(item.price)}</span></div>
      <div class="qty">
        <button type="button" data-d="-1">−</button>
        <b class="luqty">0</b>
        <button type="button" data-d="1">＋</button>
      </div>`;
    row.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{
      const k=luKey(item,luweiSpice);
      state[k]=Math.max(0,(state[k]||0)+Number(b.dataset.d));
      refreshLuwei();
      render();
    }));
    wrap.appendChild(row);
    luRows.push({item,row});
  });
  luGroups.appendChild(box);
});

function refreshLuwei(){
  $('#luwei-current-spice').textContent=luweiSpice;
  luRows.forEach(({item,row})=>{
    row.querySelector('.luqty').textContent=state[luKey(item,luweiSpice)]||0;
  });
  const summary=[];
  luwei.spice.forEach(spice=>{
    let count=0;
    luwei.groups.forEach(g=>g.items.forEach(item=>count+=state[luKey(item,spice)]||0));
    if(count>0) summary.push(`<span>${spice} × ${count}</span>`);
  });
  $('#luwei-selected-summary').innerHTML=summary.join('');
}
refreshLuwei();

function lines(){const out=[];products.forEach(p=>{if(p.options)p.options.forEach(opt=>{const q=state[key(p,opt)]||0;if(q>0)out.push({name:p.name,opt,q,price:p.price});});else{const q=state[key(p)]||0;if(q>0)out.push({name:p.name,opt:'',q,price:p.price});}});luwei.groups.forEach(g=>g.items.forEach(item=>luwei.spice.forEach(spice=>{const q=state[luKey(item,spice)]||0;if(q>0)out.push({name:item.name,opt:spice,q,price:item.price,luwei:true});})));return out;}
function totals(){return lines().reduce(([c,t],x)=>[c+x.q,t+x.q*x.price],[0,0]);}
function orderText(){
  const name=$('#customer-name').value.trim(),rawDate=$('#pickup-date').value,time=$('#pickup-time').value,note=$('#note').value.trim();
  const parts=[
    '【食材有限 Just Enough】',
    '',
    `取餐人：${name||'未填'}`,
    `取餐日期：${rawDate||'未填'}`,
    `取餐時間：${time||'未填'}`,
    ''
  ];
  let totalMoney=0, totalServings=0;

  // 一般餐點
  products.forEach(p=>{
    if(p.options){
      p.options.forEach(opt=>{
        const q=state[key(p,opt)]||0;
        if(q>0){
          const subtotal=q*p.price;
          parts.push(`${p.name}(${opt})*${q} ${money(subtotal)}`);
          totalMoney+=subtotal; totalServings+=q;
        }
      });
    }else{
      const q=state[key(p)]||0;
      if(q>0){
        const subtotal=q*p.price;
        parts.push(`${p.name}*${q} ${money(subtotal)}`);
        totalMoney+=subtotal; totalServings+=q;
      }
    }
  });

  // 滷味：依辣度分組，每個辣度組合算 1 份
  const spiceGroups=[];
  luwei.spice.forEach(spice=>{
    const group=[]; let itemCount=0, subtotal=0;
    luwei.groups.forEach(g=>g.items.forEach(item=>{
      const q=state[luKey(item,spice)]||0;
      if(q>0){
        const lineTotal=q*item.price;
        group.push(`${item.name}*${q} ${money(lineTotal)}`);
        itemCount+=q; subtotal+=lineTotal;
      }
    }));
    if(group.length){
      spiceGroups.push({spice,group,itemCount,subtotal});
      totalMoney+=subtotal; totalServings+=1;
    }
  });

  spiceGroups.forEach(({spice,group,itemCount,subtotal})=>{
    parts.push('',`${spice}：`,...group,`${itemCount}項｜${money(subtotal)}`);
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
