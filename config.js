window.STORE_CONFIG = {
  store: {
    name: "食材有限",
    englishName: "Just Enough",
    announcement: "餐點每日限量，建議先完成 LINE 預訂。",
    open: true,
    hours: "11:00–21:00（依品項供應時段）",
    address: "台南市永康區正強街200號（米里旁）",
    lineCommunity: "https://line.me/ti/g2/SHxp9hx5oUJKcqH6_zmynMuAqAprnRXjUx3apA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
    googleMaps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("台南市永康區正強街200號"),
    foodpanda: "",
    uberEats: ""
  },
  products: [
    {id:"kou",name:"口水雞（辣）",price:180,image:"spicy_chicken.jpg",category:"雞肉類"},
    {id:"oil-q",name:"油雞（四分之一）",price:150,image:"oil_quarter.jpg",category:"雞肉類"},
    {id:"oil-h",name:"油雞（半雞）",price:250,image:"oil_half.jpg",category:"雞肉類"},
    {id:"boss",name:"霸氣雞腿涼粉",price:120,image:"boss_noodles.jpg",options:["酸辣","胡麻","綜合"],category:"涼粉類",badge:"新品"},
    {id:"seafood-l",name:"海鮮涼粉（大）",price:110,image:"seafood_large.jpg",options:["酸辣","胡麻","綜合"],category:"涼粉類",badge:"新品"},
    {id:"seafood-s",name:"海鮮涼粉（小）",price:70,image:"seafood_small.jpg",options:["酸辣","胡麻","綜合"],category:"涼粉類",badge:"新品"},
    {id:"noodle-l",name:"大涼粉",price:100,image:"noodles_large.jpg",options:["酸辣","胡麻","綜合"],category:"涼粉類"},
    {id:"noodle-s",name:"小涼粉",price:60,image:"noodles_small.jpg",options:["酸辣","胡麻","綜合"],category:"涼粉類"},
    {id:"shredded-rice",name:"手撕雞肉飯",price:50,category:"飯類"},
    {id:"minced-rice",name:"肉燥飯",price:40,category:"飯類"},
    {id:"hainan",name:"海南雞腿飯",price:110,image:"hainan_rice.jpg",options:["辣","不辣"],category:"便當類"},
    {id:"oil-rice",name:"油雞腿飯",price:110,image:"oil_rice.jpg",category:"便當類"},
    {id:"braised-pork-rice",name:"肉燥飯便當",price:70,image:"braised_pork_rice.jpg",category:"便當類"},
    {id:"shredded-chicken-rice",name:"雞絲便當",price:80,image:"shredded_chicken_rice.jpg",category:"便當類"}
  ],
  luwei: {
    title:"滷味類",
    hours:"16:00–21:00",
    spice:["不辣","小辣","中辣","大辣"],
    groups:[
      {name:"肉類",items:[
        {id:"lu-pig-intestine",name:"豬大腸",price:35},
        {id:"lu-pig-head",name:"豬頭皮",price:30},
        {id:"lu-rice-sausage",name:"糯米腸",price:35},
        {id:"lu-chicken-feet",name:"雞爪（4隻）",price:20},
        {id:"lu-pig-ear",name:"豬耳朵",price:30}
      ]},
      {name:"蔬菜類",items:[
        {id:"lu-cabbage",name:"高麗菜",price:20},
        {id:"lu-wood-ear",name:"木耳",price:20},
        {id:"lu-king-oyster",name:"杏鮑菇",price:25},
        {id:"lu-baby-cabbage",name:"娃娃菜",price:25},
        {id:"lu-peanut",name:"花生",price:20}
      ]},
      {name:"副食類",items:[
        {id:"lu-sausage",name:"小熱狗（4條）",price:20},
        {id:"lu-quail-egg",name:"小烏蛋（4顆）",price:20},
        {id:"lu-tofu",name:"豆乾",price:15},
        {id:"lu-tempura",name:"甜不辣",price:15},
        {id:"lu-blood-cake",name:"米血",price:20},
        {id:"lu-kelp",name:"海帶",price:15}
      ]},
      {name:"麵類",items:[
        {id:"lu-science-noodle",name:"科學麵",price:15},
        {id:"lu-steamed-noodle",name:"蒸煮麵",price:15},
        {id:"lu-pot-noodle",name:"鍋燒意麵",price:15}
      ]}
    ]
  }
};
