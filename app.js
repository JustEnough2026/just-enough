const { store, products } = window.STORE_CONFIG;
const KEY = 'justEnoughCartV4';
const money = n => `$${Number(n).toLocaleString('zh-TW')}`;
const $ = s => document.querySelector(s);

const state = JSON.parse(localStorage.getItem(KEY) || '{}');
let utensil = localStorage.getItem('justEnoughUtensil') || '⭕️ 餐具';

function itemKey(p, option) { return option ? `${p.id}__${option}` : p.id; }
function getQty(p, option) { return Number(state[itemKey(p, option)] || 0); }
function setQty(p, option, qty) {
  state[itemKey(p, option)] = Math.max(0, qty);
  localStorage.setItem(KEY, JSON.stringify(state));
}

function initializeStore() {
  $('#announcement').textContent = store.announcement;
  $('#open-status').textContent = store.open ? `今日營業 ${store.hours}` : '今日店休';
  [['line-link',store.lineCommunity],['map-link',store.googleMaps],['foodpanda-link',store.foodpanda],['uber-link',store.uberEats]].forEach(([id,url]) => {
    const el = document.getElementById(id); if (!el) return;
    if (url) el.href = url; else el.style.display = 'none';
  });
  $('#phone-link').href = `tel:${store.phone}`;
  $('#info-phone').textContent = store.phoneDisplay;
  $('#info-phone').href = `tel:${store.phone}`;
  $('#info-address').textContent = store.address;
}

function renderProducts() {
  const list = $('#product-list'); list.innerHTML = '';
  products.forEach(p => {
    let selected = p.options?.[0] || null;
    const card = document.createElement('article'); card.className = 'product';
    card.innerHTML = `${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      <img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><div>${p.desc || ''}</div>
      <div class="price">${money(p.price)}</div>
      ${p.options ? `<div class="opts">${p.options.map((x,i)=>`<button type="button" class="opt${i===0?' selected':''}" data-option="${x}">${x}</button>`).join('')}</div>` : ''}
      <div class="qty"><button type="button" class="minus">−</button><b>${getQty(p,selected)}</b><button type="button" class="plus">＋</button></div>`;
    const qtyText = card.querySelector('.qty b');
    card.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => {
      selected = btn.dataset.option;
      card.querySelectorAll('.opt').forEach(x => x.classList.toggle('selected', x === btn));
      qtyText.textContent = getQty(p, selected);
    }));
    card.querySelector('.minus').addEventListener('click', () => { setQty(p, selected, getQty(p,selected)-1); qtyText.textContent=getQty(p,selected); renderCart(); });
    card.querySelector('.plus').addEventListener('click', () => { setQty(p, selected, getQty(p,selected)+1); qtyText.textContent=getQty(p,selected); renderCart(); });
    list.appendChild(card);
  });
}

function cartRows() {
  const rows=[];
  products.forEach(p => {
    const opts = p.options || [null];
    opts.forEach(opt => { const qty=getQty(p,opt); if(qty) rows.push({p,opt,qty}); });
  });
  return rows;
}
function renderCart() {
  const rows=cartRows(); const count=rows.reduce((a,r)=>a+r.qty,0); const total=rows.reduce((a,r)=>a+r.qty*r.p.price,0);
  $('#cart-count').textContent=`${count} 份`; $('#cart-total').textContent=money(total);
  const items=$('#cart-items'); if(items) items.innerHTML=rows.length?rows.map(r=>`<div class="cart-item"><span>${r.p.name}${r.opt?`（${r.opt}）`:''} × ${r.qty}</span><strong>${money(r.p.price*r.qty)}</strong></div>`).join(''):'<p>尚未選擇餐點</p>';
  if($('#sheet-total')) $('#sheet-total').textContent=money(total);
}
function orderText() {
  const rows=cartRows(); if(!rows.length) return '';
  const name=$('#customer-name')?.value.trim()||''; const phone=$('#customer-phone')?.value.trim()||''; const date=$('#pickup-date')?.value||''; const time=$('#pickup-time')?.value||''; const note=$('#note')?.value.trim()||'';
  const total=rows.reduce((a,r)=>a+r.qty*r.p.price,0);
  return [`【食材有限 Just Enough 訂單】`,...rows.map(r=>`${r.p.name}${r.opt?`（${r.opt}）`:''} × ${r.qty}　${money(r.p.price*r.qty)}`),``, `總金額：${money(total)}`,`取餐人：${name||'未填'}`,`電話：${phone||'未填'}`,`取餐日期：${date||'未填'}`,`取餐時間：${time||'未填'}`,`餐具：${utensil}`,`備註：${note||'無'}`].join('\n');
}
async function copyOrder(openLine=false){
  const text=orderText(); if(!text){alert('請先選擇餐點');return;}
  try{await navigator.clipboard.writeText(text);}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();}
  if(openLine) window.open(store.lineCommunity,'_blank'); else alert('訂單文字已複製');
}

initializeStore(); renderProducts(); renderCart();
const sheet=$('#cart-sheet');
$('#open-cart')?.addEventListener('click',()=>{renderCart();sheet?.setAttribute('aria-hidden','false');sheet?.classList.add('open');});
$('#close-cart')?.addEventListener('click',()=>{sheet?.setAttribute('aria-hidden','true');sheet?.classList.remove('open');});
sheet?.addEventListener('click',e=>{if(e.target===sheet){sheet.setAttribute('aria-hidden','true');sheet.classList.remove('open');}});
$('#send-line')?.addEventListener('click',()=>copyOrder(true));
$('#copy-order')?.addEventListener('click',()=>copyOrder(false));

document.querySelectorAll('.utensils button').forEach(btn=>{
  const choose=()=>{utensil=btn.textContent.trim();localStorage.setItem('justEnoughUtensil',utensil);document.querySelectorAll('.utensils button').forEach(x=>x.classList.toggle('selected',x===btn));};
  btn.addEventListener('click',choose); if(btn.textContent.trim()===utensil) btn.classList.add('selected');
});
