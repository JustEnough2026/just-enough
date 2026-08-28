const {store,products}=window.STORE_CONFIG;
const state={}; const selections={}; let utensil='⭕️ 餐具';
const $=s=>document.querySelector(s); const money=n=>`$${Number(n).toLocaleString('zh-TW')}`;
$('#announcement').textContent=store.announcement;
$('#open-status').textContent=store.open?`今日營業 ${store.hours}`:'今日店休';
[['line-link',store.lineCommunity],['map-link',store.googleMaps],['foodpanda-link',store.foodpanda],['uber-link',store.uberEats]].forEach(([id,u])=>{const e=$('#'+id);if(!e)return;if(u)e.href=u;else e.style.display='none'});
$('#phone-link').href=`tel:${store.phone}`; $('#info-phone').textContent=store.phoneDisplay; $('#info-phone').href=`tel:${store.phone}`; $('#info-address').textContent=store.address;
const list=$('#product-list');
products.forEach(p=>{state[p.id]=0; selections[p.id]=p.options?.[0]||''; const d=document.createElement('article'); d.className='product card';
 d.innerHTML=`${p.badge?`<span class="badge">${p.badge}</span>`:''}<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><div>${p.desc||''}</div><div class="price">${money(p.price)}</div>${p.options?`<div class="opts">${p.options.map((x,i)=>`<button type="button" class="opt ${i===0?'selected':''}" data-opt="${x}">${x}</button>`).join('')}</div>`:''}<div class="qty"><button type="button" data-d="-1">−</button><b>0</b><button type="button" data-d="1">＋</button></div>`;
 d.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',()=>{selections[p.id]=b.dataset.opt;d.querySelectorAll('.opt').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}));
 d.querySelectorAll('.qty button').forEach(b=>b.addEventListener('click',()=>{state[p.id]=Math.max(0,state[p.id]+Number(b.dataset.d));d.querySelector('.qty b').textContent=state[p.id];render()})); list.appendChild(d)});
function totals(){let c=0,t=0;products.forEach(p=>{c+=state[p.id];t+=state[p.id]*p.price});return[c,t]}
function render(){const[c,t]=totals();$('#cart-count').textContent=`${c} 份`;$('#cart-total').textContent=money(t);$('#sheet-total').textContent=money(t);$('#cart-items').innerHTML=products.filter(p=>state[p.id]>0).map(p=>`<p><b>${p.name}${selections[p.id]?`（${selections[p.id]}）`:''}</b> × ${state[p.id]}　${money(state[p.id]*p.price)}</p>`).join('')||'<p>尚未選擇餐點</p>'}
function orderText(){const[c,t]=totals();const name=$('#customer-name').value.trim();const phone=$('#customer-phone').value.trim();const date=$('#pickup-date').value;const time=$('#pickup-time').value;const note=$('#note').value.trim();return `【食材有限 訂單】\n${products.filter(p=>state[p.id]>0).map(p=>`${p.name}${selections[p.id]?`（${selections[p.id]}）`:''} × ${state[p.id]} = ${money(state[p.id]*p.price)}`).join('\n')}\n總計：${money(t)}（${c}份）\n取餐人：${name||'未填'}\n電話：${phone||'未填'}\n取餐：${date||'未填'} ${time||''}\n餐具：${utensil}\n備註：${note||'無'}\nLINE 密碼：0000`}
$('#open-cart').addEventListener('click',()=>{$('#cart-sheet').classList.add('open');$('#cart-sheet').setAttribute('aria-hidden','false');render()});
$('#close-cart').addEventListener('click',()=>{$('#cart-sheet').classList.remove('open');$('#cart-sheet').setAttribute('aria-hidden','true')});
document.querySelectorAll('.utensils button').forEach((b,i)=>{if(i===0)b.classList.add('selected');b.addEventListener('click',()=>{utensil=b.textContent.trim();document.querySelectorAll('.utensils button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')})});
async function copy(){try{await navigator.clipboard.writeText(orderText());alert('訂單已複製')}catch{prompt('請複製以下訂單：',orderText())}}
$('#copy-order').addEventListener('click',copy); $('#send-line').addEventListener('click',async()=>{await copy();window.open(store.lineCommunity,'_blank')});
render();
