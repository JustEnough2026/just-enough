/* 店家管理設定：改這個檔案就能更新公告、營業狀態、價格與售完狀態。 */
window.STORE_CONFIG = {
  store: {
    name: "食材有限",
    englishName: "Just Enough",
    announcement: "餐點每日限量，建議先完成 LINE 預訂。",
    open: true,
    hours: "11:00–20:00（售完為止）",
    phone: "0981164258",
    phoneDisplay: "0981-164-258",
    address: "台南市永康區正強街200號（米里旁）",
    lineCommunity: "https://line.me/ti/g2/SHxp9hx5oUJKcqH6_zmynMuAqAprnRXjUx3apA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
    googleMaps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("台南市永康區正強街200號"),
    foodpanda: "",
    uberEats: ""
  },
  products: [
    { id:"kou", name:"口水雞（四分之一）", desc:"酸、辣、香，層次豐富", price:180, image:"images/spicy_chicken.jpg", badge:"人氣", soldOut:false, stock:null },
    { id:"oil-q", name:"油雞（四分之一）", desc:"鮮嫩多汁，清爽不膩", price:150, image:"images/oil_quarter.jpg", badge:"", soldOut:false, stock:null },
    { id:"oil-h", name:"油雞（半隻）", desc:"適合多人分享", price:250, image:"images/oil_half.jpg", badge:"", soldOut:false, stock:null },
    { id:"oil-rice", name:"油雞腿飯", desc:"每日限量，僅提供預約", price:110, image:"images/oil_rice.jpg", badge:"新品", soldOut:false, stock:null },
    { id:"hainan-spicy", name:"海南雞腿飯（辣）", desc:"每日限量，獨立數量", price:110, image:"images/hainan_rice.jpg", badge:"新品", soldOut:false, stock:null },
    { id:"hainan-mild", name:"海南雞腿飯（不辣）", desc:"每日限量，獨立數量", price:110, image:"images/hainan_rice.jpg", badge:"新品", soldOut:false, stock:null },
    { id:"noodle-s-spicy", name:"小涼粉（酸辣）", desc:"爽口彈滑，獨立數量", price:60, image:"images/noodles_small.jpg", badge:"", soldOut:false, stock:null },
    { id:"noodle-s-sesame", name:"小涼粉（胡麻）", desc:"香濃胡麻，獨立數量", price:60, image:"images/noodles_small.jpg", badge:"", soldOut:false, stock:null },
    { id:"noodle-l-spicy", name:"大涼粉（酸辣）", desc:"爽口彈滑，獨立數量", price:100, image:"images/noodles_large.jpg", badge:"", soldOut:false, stock:null },
    { id:"noodle-l-sesame", name:"大涼粉（胡麻）", desc:"香濃胡麻，獨立數量", price:100, image:"images/noodles_large.jpg", badge:"", soldOut:false, stock:null }
  ]
};
