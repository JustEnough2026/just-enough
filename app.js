const {store,products}=window.STORE_CONFIG;
const state={};
const selections={};
let utensil='⭕️ 餐具';
const $=s=>document.querySelector(s);
const money=n=>`$${Number(n).toLocaleString('zh-TW')}`;

$('#open-status').textContent=store.open?`營業中｜${store.hours}`:'今日店休';
[['line-link',store.lineCommunity],['map-link',store.googleMaps],['foodpanda-link',store.foodpanda],['uber-link',store.uberEats]].forEach(([id,u])=>{
  const e=$('#'+id); if(!e)return; if(u)e.href=u; else e.style.display='none';
});
$('#info-address').textContent=store.address;

const list=$('#product-list');
products.forEach(p=>{
  state[p.id]=0;
  selections[p.id]=p.options?.[0]||'';
  const d=document.createElement('article');
  d.className='product';
  d.innerHTML=`
    ${p.badge?`<span class="badge">${p.badge}</span>`:''}
    <img src="${p.image}" alt="${p.name}">
    <div class="product-content">
      <div class="product-head"><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div>
      ${p.desc?`<div>${p.desc}</div>`:''}
      ${p.options?`<div class="option-label">口味｜請選一個</div><div class="opts">${p.options.map((x,i)=>`<button type="button" class="opt ${i===0?'selected':''}" data-opt="${x}">${x}</button>`).join('')}</div>`:''}
      <div class="qty-wrap"><span class="qty-label">數量</span><div class="qty"><button type="button" data-d="-1" aria-label="減少">−</button><b>0</b><button type="button" data-d="1" aria-label="增加">＋</button></div></div>
    </div>`;
  d.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{
    selections[p.id]=b.dataset.opt;
    d.querySelectorAll('.opt').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
  }));
  d.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{
    state[p.id]=Math.max(0,state[p.id]+Number(b.dataset.d));
    d.querySelector('.qty b').textContent=state[p.id];
    render();
  }));
  list.appendChild(d);
});

function totals(){let c=0,t=0;products.forEach(p=>{c+=state[p.id];t+=state[p.id]*p.price});return[c,t]}
function render(){
  const[c,t]=totals();
  $('#cart-count').textContent=`${c} 份`;
  $('#cart-total').textContent=money(t);
  $('#sheet-total').textContent=money(t);
  $('#cart-items').innerHTML=products.filter(p=>state[p.id]>0).map(p=>`<div class="cart-item"><b>${p.name}${selections[p.id]?`（${selections[p.id]}）`:''}</b><span>${state[p.id]} 份 × ${money(p.price)}　＝ ${money(state[p.id]*p.price)}</span></div>`).join('')||'<p>尚未選擇餐點，請先回到菜單按「＋」。</p>';
}
function orderText(){
  const[c,t]=totals();
  const name=$('#customer-name').value.trim();
  const date=$('#pickup-date').value;
  const time=$('#pickup-time').value;
  const note=$('#note').value.trim();
  return `【食材有限 訂單】\n${products.filter(p=>state[p.id]>0).map(p=>`${p.name}${selections[p.id]?`（${selections[p.id]}）`:''} × ${state[p.id]} = ${money(state[p.id]*p.price)}`).join('\n')}\n總計：${money(t)}（${c}份）\n取餐人：${name||'未填'}\n取餐：${date||'未填'} ${time||''}\n餐具：${utensil}\n備註：${note||'無'}\nLINE 密碼：0000`;
}
$('#open-cart').addEventListener('click',()=>{$('#cart-sheet').classList.add('open');$('#cart-sheet').setAttribute('aria-hidden','false');render()});
$('#close-cart').addEventListener('click',()=>{$('#cart-sheet').classList.remove('open');$('#cart-sheet').setAttribute('aria-hidden','true')});
$('#cart-sheet').addEventListener('click',e=>{if(e.target.id==='cart-sheet')$('#close-cart').click()});
document.querySelectorAll('.utensils button').forEach((b,i)=>{
  if(i===0)b.classList.add('selected');
  b.addEventListener('click',()=>{
    utensil=b.dataset.utensil;
    document.querySelectorAll('.utensils button').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
  });
});
async function sendToLine(){try{await navigator.clipboard.writeText(orderText())}catch{} window.open(store.lineCommunity,'_blank')}
$('#send-line').addEventListener('click',sendToLine);
render();
