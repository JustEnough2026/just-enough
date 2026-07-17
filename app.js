const products=[
{id:"kou",name:"口水雞（四分之一）",desc:"酸、辣、香，層次豐富",price:180,img:"spicy_chicken.jpg"},
{id:"oil-q",name:"油雞（四分之一）",desc:"鮮嫩多汁，清爽不膩",price:150,img:"oil_quarter.jpg"},
{id:"oil-h",name:"油雞（半雞）",desc:"適合多人分享",price:250,img:"oil_half.jpg"},
{id:"noodle-s",name:"涼粉（小）",desc:"爽口彈滑",price:60,img:"noodles_small.jpg",options:["酸辣","胡麻"]},
{id:"noodle-l",name:"涼粉（大）",desc:"爽口彈滑",price:100,img:"noodles_large.jpg",options:["酸辣","胡麻"]},
{id:"oil-rice",name:"油雞腿飯",desc:"新品・每日限量",price:110,img:"oil_rice.jpg"},
{id:"hainan-rice-spicy",name:"海南雞腿飯（辣）",desc:"新品・每日限量",price:110,img:"hainan_rice.jpg"},
{id:"hainan-rice-mild",name:"海南雞腿飯（不辣）",desc:"新品・每日限量",price:110,img:"hainan_rice.jpg"}
];

const state=JSON.parse(localStorage.getItem("justEnoughCartV4")||"{}");
const list=document.querySelector("#product-list");
const tpl=document.querySelector("#product-template");

function save(){
  localStorage.setItem("justEnoughCartV4",JSON.stringify(state));
  renderBar();
}

products.forEach(p=>{
  const n=tpl.content.cloneNode(true);
  const card=n.querySelector(".product");
  const img=n.querySelector(".product-img");
  img.src=p.img;
  img.alt=p.name;
  img.onerror=()=>{img.style.display="none"};
  n.querySelector("h3").textContent=p.name;
  n.querySelector(".desc").textContent=p.desc;
  n.querySelector(".price").textContent="$"+p.price;
  state[p.id]??={qty:0,option:p.options?.[0]||""};
  n.querySelector(".qty").textContent=state[p.id].qty;
  const opts=n.querySelector(".options");
  (p.options||[]).forEach(o=>{
    const b=document.createElement("button");
    b.className="option"+(state[p.id].option===o?" active":"");
    b.textContent=o;
    b.onclick=()=>{
      state[p.id].option=o;
      opts.querySelectorAll(".option").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      save();
    };
    opts.appendChild(b);
  });
  n.querySelector(".plus").onclick=()=>{
    state[p.id].qty++;
    card.querySelector(".qty").textContent=state[p.id].qty;
    save();
  };
  n.querySelector(".minus").onclick=()=>{
    state[p.id].qty=Math.max(0,state[p.id].qty-1);
    card.querySelector(".qty").textContent=state[p.id].qty;
    save();
  };
  list.appendChild(n);
});

function selected(){return products.filter(p=>state[p.id]?.qty>0)}
function total(){return selected().reduce((s,p)=>s+p.price*state[p.id].qty,0)}
function renderBar(){
  const c=selected().reduce((s,p)=>s+state[p.id].qty,0);
  document.querySelector("#cart-count").textContent=c+" 份";
  document.querySelector("#cart-total").textContent="$"+total();
}
function buildOrder(){
  const name=document.querySelector("#customer-name").value.trim()||"未填";
  const date=document.querySelector("#pickup-date").value||"未填";
  const time=document.querySelector("#pickup-time").value||"未填";
  const note=document.querySelector("#note").value.trim()||"無";
  let lines=["【食材有限 新訂單】","","暱稱："+name,"取餐日期："+date,"取餐時間："+time,""];
  selected().forEach(p=>{
    const opt=state[p.id].option?`（${state[p.id].option}）`:"";
    lines.push(`${p.name}${opt} × ${state[p.id].qty}　$${p.price*state[p.id].qty}`);
  });
  lines.push("","總金額：$"+total(),"備註："+note);
  return lines.join("\n");
}
function openSheet(){
  const wrap=document.querySelector("#cart-items");
  wrap.innerHTML="";
  if(!selected().length)wrap.innerHTML="<p>尚未選擇餐點。</p>";
  selected().forEach(p=>{
    const d=document.createElement("div");
    d.className="cart-item";
    d.innerHTML=`<div><strong>${p.name}</strong><small>${state[p.id].option||""} × ${state[p.id].qty}</small></div><strong>$${p.price*state[p.id].qty}</strong>`;
    wrap.appendChild(d);
  });
  document.querySelector("#sheet-total").textContent="$"+total();
  document.querySelector("#cart-sheet").classList.add("open");
}
document.querySelector("#open-cart").onclick=openSheet;
document.querySelector("#close-cart").onclick=()=>document.querySelector("#cart-sheet").classList.remove("open");
document.querySelector("#copy-order").onclick=async()=>{
  if(!selected().length)return alert("請先選擇餐點");
  await navigator.clipboard.writeText(buildOrder());
  alert("訂單文字已複製");
};
document.querySelector("#send-line").onclick=async()=>{
  if(!selected().length)return alert("請先選擇餐點");
  const t=buildOrder();
  try{await navigator.clipboard.writeText(t)}catch(e){}
  window.open("https://line.me/R/msg/text/?"+encodeURIComponent(t),"_blank");
};
renderBar();
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
}