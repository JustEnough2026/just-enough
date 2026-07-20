const {store, products} = window.STORE_CONFIG;
const KEY = "justEnoughCartV3";
const state = JSON.parse(localStorage.getItem(KEY) || "{}");
const $ = s => document.querySelector(s);
const money = n => `$${n.toLocaleString("zh-TW")}`;

function initializeStore(){
  $("#announcement").textContent = store.announcement;
  $("#open-status").textContent = store.open ? `今日營業 ${store.hours}` : "今日店休";
  $("#open-status").classList.toggle("closed", !store.open);
  $("#phone-link").href = `tel:${store.phone}`;
  $("#line-link").href = store.lineCommunity;
  $("#map-link").href = store.googleMaps;
  $("#info-phone").href = `tel:${store.phone}`;
  $("#info-phone").textContent = store.phoneDisplay;
  $("#info-address").textContent = store.address;
  [["#foodpanda-link",store.foodpanda],["#uber-link",store.uberEats]].forEach(([id,url])=>{
    const el=$(id); if(url){el.href=url}else{el.hidden=true}
  });
  const now=new Date();
  const local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  $("#pickup-date").min=local; $("#pickup-date").value=local;
}

function save(){ localStorage.setItem(KEY, JSON.stringify(state)); renderBar(); }
function maxQty(p){ return Number.isInteger(p.stock) ? p.stock : 99; }

function renderProducts(){
  const list=$("#product-list"), tpl=$("#product-template");
  products.forEach(p=>{
    state[p.id] ??= {qty:0};
    if(p.soldOut) state[p.id].qty=0;
    if(Number.isInteger(p.stock)) state[p.id].qty=Math.min(state[p.id].qty,p.stock);
    const node=tpl.content.cloneNode(true), card=node.querySelector(".product");
    card.dataset.id=p.id; card.classList.toggle("sold-out",p.soldOut);
    const img=node.querySelector(".product-img"); img.src=p.image; img.alt=p.name;
    node.querySelector("h3").textContent=p.name;
    node.querySelector(".desc").textContent=p.desc;
    node.querySelector(".price").textContent=money(p.price);
    node.querySelector(".badge").textContent=p.badge||"";
    node.querySelector(".stock").textContent=Number.isInteger(p.stock)?`今日剩餘 ${p.stock} 份`:"";
    const qty=node.querySelector(".qty"), minus=node.querySelector(".minus"), plus=node.querySelector(".plus");
    qty.textContent=state[p.id].qty; minus.disabled=p.soldOut; plus.disabled=p.soldOut;
    minus.onclick=()=>{state[p.id].qty=Math.max(0,state[p.id].qty-1);qty.textContent=state[p.id].qty;save()};
    plus.onclick=()=>{if(state[p.id].qty>=maxQty(p))return alert("已達今日可訂數量");state[p.id].qty++;qty.textContent=state[p.id].qty;save()};
    list.appendChild(node);
  });
  save();
}
const selected=()=>products.filter(p=>state[p.id]?.qty>0);
const total=()=>selected().reduce((sum,p)=>sum+p.price*state[p.id].qty,0);
function renderBar(){
  const count=selected().reduce((sum,p)=>sum+state[p.id].qty,0);
  $("#cart-count").textContent=`${count} 份`; $("#cart-total").textContent=money(total());
}
function buildOrder(){
  const name=$("#customer-name").value.trim()||"未填";
  const phone=$("#customer-phone").value.trim()||"未填";
  const date=$("#pickup-date").value||"未填";
  const time=$("#pickup-time").value||"未填";
  const note=$("#note").value.trim()||"無";
  const lines=[`【${store.name} ${store.englishName}】`,"",`取餐人：${name}`,`電話：${phone}`,`取餐日期：${date}`,`取餐時間：${time}`,""];
  selected().forEach(p=>lines.push(`${p.name} × ${state[p.id].qty}　${money(p.price*state[p.id].qty)}`));
  lines.push("",`總金額：${money(total())}`,"",`備註：${note}`);
  return lines.join("\n");
}
function openSheet(){
  const wrap=$("#cart-items");wrap.innerHTML="";
  if(!selected().length)wrap.innerHTML="<p>尚未選擇餐點。</p>";
  selected().forEach(p=>{const d=document.createElement("div");d.className="cart-item";d.innerHTML=`<div><strong>${p.name}</strong><small>數量 × ${state[p.id].qty}</small></div><strong>${money(p.price*state[p.id].qty)}</strong>`;wrap.appendChild(d)});
  $("#sheet-total").textContent=money(total()); $("#cart-sheet").classList.add("open"); $("#cart-sheet").setAttribute("aria-hidden","false");
}
function closeSheet(){ $("#cart-sheet").classList.remove("open"); $("#cart-sheet").setAttribute("aria-hidden","true"); }
async function copy(text){ try{await navigator.clipboard.writeText(text);return true}catch{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();const ok=document.execCommand("copy");ta.remove();return ok} }
$("#open-cart").onclick=openSheet; $("#close-cart").onclick=closeSheet;
$("#cart-sheet").onclick=e=>{if(e.target===$("#cart-sheet"))closeSheet()};
$("#copy-order").onclick=async()=>{if(!selected().length)return alert("請先選擇餐點");await copy(buildOrder());alert("訂單文字已複製")};
$("#send-line").onclick=async()=>{if(!selected().length)return alert("請先選擇餐點");const text=buildOrder();await copy(text);location.href=`https://line.me/R/msg/text/?${encodeURIComponent(text)}`};
initializeStore(); renderProducts();
