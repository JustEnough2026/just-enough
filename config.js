/* 店家管理設定：改這個檔案就能更新公告、營業狀態、價格與售完狀態。 */
window.STORE_CONFIG = {
  store: {
    name: "食材有限",
    englishName: "Just Enough",
    announcement: "餐點每日限量，建議先完成 LINE 預訂。",
    open: true,
    hours: "11:00–19:30（售完為止）",
    address: "台南市永康區正強街200號（米里旁）",
    lineCommunity: "https://line.me/ti/g2/SHxp9hx5oUJKcqH6_zmynMuAqAprnRXjUx3apA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
    googleMaps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("台南市永康區正強街200號"),
    foodpanda: "",
    uberEats: ""
  },
  products: [
    {id:"kou",name:"口水雞（辣）",desc:"",price:180,image:"spicy_chicken.jpg",badge:"",soldOut:false},
    {id:"oil-q",name:"油雞腿（1/4隻）",desc:"",price:150,image:"oil_quarter.jpg",badge:"",soldOut:false},
    {id:"oil-h",name:"油雞腿（半隻）",desc:"",price:250,image:"oil_half.jpg",badge:"",soldOut:false},
    {id:"hainan",name:"海南雞腿飯",desc:"",price:110,image:"hainan_rice.jpg",options:["辣","不辣"],badge:"",soldOut:false},
    {id:"oil-rice",name:"油雞腿飯",desc:"",price:110,image:"oil_rice.jpg",options:["辣","不辣"],badge:"",soldOut:false},
    {id:"boss",name:"霸氣雞腿涼粉",desc:"",price:120,image:"boss_noodles.jpg",options:["酸辣","胡麻","綜合"],badge:"新品",soldOut:false},
    {id:"seafood-l",name:"海鮮涼粉（大）",desc:"",price:110,image:"seafood_large.jpg",options:["酸辣","胡麻","綜合"],badge:"新品",soldOut:false},
    {id:"seafood-s",name:"海鮮涼粉（小）",desc:"",price:70,image:"seafood_small.jpg",options:["酸辣","胡麻","綜合"],badge:"新品",soldOut:false},
    {id:"noodle-l",name:"大涼粉",desc:"",price:100,image:"noodles_large.jpg",options:["酸辣","胡麻","綜合"],badge:"",soldOut:false},
    {id:"noodle-s",name:"小涼粉",desc:"",price:60,image:"noodles_small.jpg",options:["酸辣","胡麻","綜合"],badge:"",soldOut:false}
  ]
};
