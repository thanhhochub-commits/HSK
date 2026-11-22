(function(){
"use strict";
var root=document.getElementById("app");
var KEYS={home:"Trang chủ",roadmap:"Lộ trình",vocab:"Từ vựng",flashcards:"Flashcard",listening:"Luyện nghe",pronunciation:"Phát âm",writing:"Viết chữ Hán",grammar:"Ngữ pháp",exam:"Luyện đề",games:"Game học tập",leaderboard:"Bảng xếp hạng",progress:"Tiến độ",pro:"Gói Premium",checkout:"Thanh toán",account:"Tài khoản", "payment-status":"Trạng thái thanh toán",settings:"Cài đặt"};
var NAV=[["home","home"],["roadmap","map"],["vocab","book"],["flashcards","cards"],["listening","headphones"],["pronunciation","mic"],["writing","pen"],["grammar","layers"],["exam","clipboard"],["games","game"],["leaderboard","trophy"],["progress","chart"],["pro","star"],["account","user"],["settings","settings"]];
var PATHS={
home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
book:'<path d="M12 7v14m0-14C10 5 7 4 3 4v15c4 0 7 1 9 3 2-2 5-3 9-3V4c-4 0-7 1-9 3z"/>',
cards:'<rect x="7" y="4" width="15" height="15" rx="2"/><path d="M4 8H3a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1"/>',
headphones:'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="13" width="5" height="8" rx="2"/><rect x="17" y="13" width="5" height="8" rx="2"/>',
mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
pen:'<path d="m14 6 4 4M4 20l5-.8L20 8a2.8 2.8 0 0 0-4-4L5 15z"/>',
layers:'<path d="m12 2 10 6-10 6L2 8zM2 12l10 6 10-6M2 16l10 6 10-6"/>',
clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-5"/>',
game:'<path d="M7 10h10a5 5 0 0 1 4.8 4l1.1 5a2 2 0 0 1-3.1 2l-3.3-2H7.5l-3.3 2a2 2 0 0 1-3.1-2l1.1-5A5 5 0 0 1 7 10z"/><path d="M7 13v5m-2.5-2.5h5M16 14h.01M19 16h.01"/>',
trophy:'<path d="M7 3h10v8a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 16v4M8 21h8"/>',
chart:'<path d="M4 20v-6m5 6V8m5 12V4m5 16v-9"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.5 2.5 2 1 2.4-1.2 2.8 2.8-1.2 2.4 1 2 .5 2.5-2.5 2.5-2-.5-2 1-1 2.5h-4l-.5-2.5-2-1-2.4 1.2-2.8-2.8L4 14.5l-1-2L2.5 10 5 7.5l2 .5 2-1z"/>',
arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',chevron:'<path d="m9 18 6-6-6-6"/>',
check:'<path d="m4 12 5 5L20 6"/>',lock:'<rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
play:'<path d="m8 5 11 7-11 7z"/>',audio:'<path d="M11 5 6 9H3v6h3l5 4zM15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12"/>',
fire:'<path d="M12 22c5 0 8-3.5 8-8 0-3-1-5-4-8 .2 4-2 4-2 4-1-2-2-5-3-8-3 5-7 7-7 12 0 4.5 3 8 8 8z"/><path d="M12 22c2.2 0 4-1.7 4-4 0-1.6-.8-2.5-2-3.8-.2 1.8-1.1 2.2-2 2.4-1-1.3-1.4-2.4-2-3.5-1.4 2-2 3.1-2 4.9 0 2.3 1.8 4 4 4z"/>',
star:'<path d="m12 2 3.1 6.4 7.1 1-5.1 5 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5.1-5 7.1-1z"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',close:'<path d="M5 5l14 14M19 5 5 19"/>',
download:'<path d="M12 3v13m-5-5 5 5 5-5M4 18v3h16v-3"/>',
upload:'<path d="M12 17V4m-5 5 5-5 5 5M4 18v3h16v-3"/>',
refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5 9a8 8 0 0 1 14-2l1 5M4 12l1 5a8 8 0 0 0 14-2"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v5m0-8h.01"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
};
function ic(k){return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+(PATHS[k]||PATHS.star)+'</svg>';}
function panda(){return '<svg viewBox="0 0 170 150" role="img" aria-label="Linh vật gấu trúc" style="width:100%;height:100%"><ellipse cx="83" cy="142" rx="62" ry="7" fill="#bedfc9" opacity=".52"/><ellipse cx="92" cy="113" rx="46" ry="34" fill="#202a2a"/><ellipse cx="86" cy="117" rx="31" ry="25" fill="#fff"/><path d="M113 104 Q133 94 137 60 Q142 47 150 56 Q159 79 141 111" fill="#283232" stroke="#273332" stroke-width="3"/><circle cx="147" cy="56" r="11" fill="#253030"/><circle cx="47" cy="35" r="19" fill="#26302f"/><circle cx="128" cy="36" r="19" fill="#26302f"/><ellipse cx="88" cy="67" rx="67" ry="56" fill="#fff" stroke="#eaf0e9" stroke-width="2"/><ellipse cx="61" cy="67" rx="22" ry="27" fill="#283130" transform="rotate(19 61 67)"/><ellipse cx="117" cy="67" rx="22" ry="27" fill="#283130" transform="rotate(-19 117 67)"/><ellipse cx="66" cy="62" rx="6" ry="9" fill="#fff"/><ellipse cx="111" cy="62" rx="6" ry="9" fill="#fff"/><ellipse cx="51" cy="96" rx="11" ry="7" fill="#ffc3ba" opacity=".8"/><ellipse cx="126" cy="96" rx="11" ry="7" fill="#ffc3ba" opacity=".8"/><path d="M79 86Q87 78 95 86Q89 96 84 94Z" fill="#202c2a"/><path d="M86 95q-8 14-15 1m15-1q10 14 16 0" fill="none" stroke="#273332" stroke-width="4" stroke-linecap="round"/><path d="M52 119Q89 134 127 116" stroke="#1a9a6c" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M62 125l12 16-16-6" fill="#1a9a6c"/><ellipse cx="42" cy="134" rx="18" ry="11" fill="#26302f"/><ellipse cx="129" cy="137" rx="19" ry="11" fill="#26302f"/></svg>';}
function scenery(){return '<svg class="scene" viewBox="0 0 360 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 106Q39 28 78 80Q123 14 164 82Q211 26 250 79Q301 31 360 94v46H0Z" fill="#d4f2e2"/><path d="M0 121Q60 64 100 105Q155 55 218 104Q283 67 360 111v29H0Z" fill="#b6e5c9"/><path d="M0 126Q83 104 158 128Q261 99 360 119v21H0Z" fill="#86cea7"/><path d="M235 121h80V77h-80z" fill="#f9cb77"/><path d="M232 78h87l-19-13h-50z" fill="#e8883d"/><path d="M249 64h57V47h-57z" fill="#f4cc7b"/><path d="M246 48h63l-15-11h-33z" fill="#e48838"/><path d="M267 36h29l-8-9h-13z" fill="#eda651"/><path d="M261 89h7v32h-7zm21 0h7v32h-7z" fill="#bf663c"/><path d="M246 122h60v5h-60z" fill="#df925d"/><circle cx="218" cy="108" r="22" fill="#72c68f"/><circle cx="337" cy="116" r="24" fill="#60ba86"/></svg>';}
var W=[
["你好","nǐ hǎo","xin chào",1,"Giao tiếp","你好！很高兴认识你。"],
["谢谢","xiè xie","cảm ơn",1,"Giao tiếp","谢谢你的帮助。"],
["再见","zài jiàn","tạm biệt",1,"Giao tiếp","老师，再见！"],
["对不起","duì bu qǐ","xin lỗi",1,"Giao tiếp","对不起，我来晚了。"],
["没关系","méi guān xi","không sao",1,"Giao tiếp","没关系，我们等你。"],
["请","qǐng","xin mời",1,"Giao tiếp","请坐。"],
["是","shì","là, đúng",1,"Cơ bản","我是学生。"],
["不","bù","không",1,"Cơ bản","我不喝咖啡。"],
["有","yǒu","có",1,"Cơ bản","我有一本书。"],
["我","wǒ","tôi",1,"Cơ bản","我学习汉语。"],
["你","nǐ","bạn",1,"Cơ bản","你好吗？"],
["他","tā","anh ấy",1,"Cơ bản","他是我的朋友。"],
["她","tā","cô ấy",1,"Cơ bản","她喜欢音乐。"],
["我们","wǒ men","chúng tôi",1,"Cơ bản","我们一起学习。"],
["他们","tā men","họ",1,"Cơ bản","他们在学校。"],
["老师","lǎo shī","giáo viên",1,"Trường học","老师很友好。"],
["学生","xué sheng","học sinh",1,"Trường học","我是大学生。"],
["学校","xué xiào","trường học",1,"Trường học","学校很大。"],
["学习","xué xí","học tập",1,"Trường học","我喜欢学习中文。"],
["书","shū","sách",1,"Trường học","这本书很有意思。"],
["中国","Zhōng guó","Trung Quốc",1,"Địa điểm","我想去中国。"],
["北京","Běi jīng","Bắc Kinh",1,"Địa điểm","北京是中国的首都。"],
["家","jiā","nhà, gia đình",1,"Gia đình","我家有四个人。"],
["妈妈","mā ma","mẹ",1,"Gia đình","妈妈在做饭。"],
["爸爸","bà ba","bố",1,"Gia đình","爸爸喜欢喝茶。"],
["朋友","péng you","bạn bè",1,"Gia đình","他是我的好朋友。"],
["水","shuǐ","nước",1,"Ăn uống","我想喝水。"],
["茶","chá","trà",1,"Ăn uống","你喜欢喝茶吗？"],
["米饭","mǐ fàn","cơm",1,"Ăn uống","中午吃米饭。"],
["吃","chī","ăn",1,"Ăn uống","你吃什么？"],
["喝","hē","uống",1,"Ăn uống","我喝一杯水。"],
["买","mǎi","mua",1,"Mua sắm","我想买这本书。"],
["钱","qián","tiền",1,"Mua sắm","这个多少钱？"],
["多少","duō shao","bao nhiêu",1,"Mua sắm","你有多少本书？"],
["大","dà","to, lớn",1,"Miêu tả","这只熊猫很大。"],
["小","xiǎo","nhỏ",1,"Miêu tả","我的猫很小。"],
["好","hǎo","tốt",1,"Miêu tả","今天天气很好。"],
["今天","jīn tiān","hôm nay",1,"Thời gian","今天是星期六。"],
["明天","míng tiān","ngày mai",1,"Thời gian","明天见！"],
["昨天","zuó tiān","hôm qua",1,"Thời gian","昨天我很忙。"],
["现在","xiàn zài","bây giờ",1,"Thời gian","现在几点？"],
["时间","shí jiān","thời gian",2,"Thời gian","我没有时间。"],
["因为","yīn wèi","bởi vì",2,"Ngữ pháp","因为下雨，所以我在家。"],
["所以","suǒ yǐ","cho nên",2,"Ngữ pháp","我很累，所以想休息。"],
["但是","dàn shì","nhưng",2,"Ngữ pháp","我喜欢茶，但是不喜欢咖啡。"],
["已经","yǐ jīng","đã",2,"Thời gian","我已经吃饭了。"],
["觉得","jué de","cảm thấy, nghĩ rằng",2,"Giao tiếp","我觉得中文很有趣。"],
["希望","xī wàng","hy vọng",2,"Giao tiếp","希望你考试成功。"],
["准备","zhǔn bèi","chuẩn bị",2,"Học tập","我在准备考试。"],
["考试","kǎo shì","kỳ thi",2,"Học tập","明天有一个考试。"],
["旅游","lǚ yóu","du lịch",2,"Du lịch","我喜欢旅游。"],
["旅行","lǚ xíng","chuyến đi, du lịch",2,"Du lịch","这次旅行很开心。"],
["火车","huǒ chē","tàu hỏa",2,"Du lịch","坐火车去北京。"],
["飞机","fēi jī","máy bay",2,"Du lịch","飞机几点起飞？"],
["机场","jī chǎng","sân bay",2,"Du lịch","我们去机场。"],
["工作","gōng zuò","công việc",2,"Công việc","我在一家银行工作。"],
["公司","gōng sī","công ty",2,"Công việc","这家公司很大。"],
["同事","tóng shì","đồng nghiệp",2,"Công việc","我的同事很友好。"],
["重要","zhòng yào","quan trọng",3,"Công việc","这个问题很重要。"],
["比较","bǐ jiào","khá, so sánh",3,"Ngữ pháp","这本书比较容易。"],
["如果","rú guǒ","nếu",3,"Ngữ pháp","如果有时间，我会去。"],
["虽然","suī rán","tuy rằng",3,"Ngữ pháp","虽然很忙，但是我很开心。"],
["特别","tè bié","đặc biệt",3,"Miêu tả","这里的风景特别美。"],
["解决","jiě jué","giải quyết",3,"Công việc","我们要解决这个问题。"],
["理解","lǐ jiě","hiểu",3,"Học tập","我理解你的意思。"],
["提高","tí gāo","nâng cao",3,"Học tập","我想提高听力水平。"],
["锻炼","duàn liàn","rèn luyện",3,"Sức khỏe","每天锻炼身体。"],
["健康","jiàn kāng","sức khỏe, khỏe mạnh",3,"Sức khỏe","健康很重要。"],
["环境","huán jìng","môi trường",3,"Cuộc sống","保护环境很重要。"],
["发展","fā zhǎn","phát triển",3,"Công việc","城市发展得很快。"]
].map(function(w,i){return {id:i,h:w[0],p:w[1],v:w[2],level:w[3],topic:w[4],ex:w[5]};});
var GRAMMAR=[
{title:"是: câu giới thiệu",structure:"A + 是 + B",ex:"我是学生。",vi:"Tôi là học sinh.",hint:"Dùng 是 để nói A là B.",q:"Chọn câu đúng: Tôi là giáo viên.",opts:["我是老师。","我有老师。","我不老师。"],a:0},
{title:"不: phủ định",structure:"不 + động từ / tính từ",ex:"我不喝茶。",vi:"Tôi không uống trà.",hint:"Đặt 不 trước động từ.",q:"Chọn câu đúng: Tôi không uống cà phê.",opts:["我喝不咖啡。","我不喝咖啡。","我咖啡不喝。"],a:1},
{title:"吗: câu hỏi có/không",structure:"Câu kể + 吗？",ex:"你是学生吗？",vi:"Bạn có phải học sinh không?",hint:"Thêm 吗 ở cuối câu kể.",q:"Bạn có thích tiếng Trung không?",opts:["你喜欢汉语吗？","吗你喜欢汉语？","你吗喜欢汉语？"],a:0},
{title:"很: mức độ",structure:"Chủ ngữ + 很 + tính từ",ex:"今天很热。",vi:"Hôm nay rất nóng.",hint:"很 thường nối chủ ngữ với tính từ.",q:"Chọn câu tự nhiên: Cô ấy rất vui.",opts:["她很高兴。","她是很高兴。","很她高兴。"],a:0},
{title:"比: so sánh",structure:"A + 比 + B + tính từ",ex:"我比他高。",vi:"Tôi cao hơn anh ấy.",hint:"Không đặt 很 ngay sau 比 trong cấu trúc so sánh thông thường.",q:"Chọn câu đúng: Tôi cao hơn anh ấy.",opts:["我高比他。","我比他高。","我比很他高。"],a:1},
{title:"因为…所以…",structure:"因为 + nguyên nhân， 所以 + kết quả",ex:"因为下雨，所以我不出去。",vi:"Vì trời mưa nên tôi không ra ngoài.",hint:"Hai vế lần lượt nêu nguyên nhân và kết quả.",q:"Điền từ: ____ 下雨，____ 我在家。",opts:["虽然 / 但是","如果 / 就","因为 / 所以"],a:2},
{title:"了: hoàn thành / thay đổi",structure:"Động từ + 了 (một số cách dùng)",ex:"我吃饭了。",vi:"Tôi ăn cơm rồi.",hint:"了 có nhiều chức năng; không phải cứ hành động quá khứ đều phải có 了.",q:"Câu nào biểu thị đã ăn rồi?",opts:["我吃饭了。","我吃饭吗？","我不吃饭。"],a:0},
{title:"如果…就…",structure:"如果 + điều kiện，就 + kết quả",ex:"如果你有时间，我们就去。",vi:"Nếu bạn có thời gian thì chúng ta đi.",hint:"Nêu điều kiện và kết quả có thể xảy ra.",q:"Điền từ: ____ 明天下雨，我们 ____ 不去。",opts:["因为 / 所以","如果 / 就","虽然 / 但是"],a:1}
];
var EXAMS=[
{q:"'你好' có nghĩa là gì?",opts:["Tạm biệt","Xin chào","Cảm ơn","Không sao"],a:1,ex:"你好 (nǐ hǎo) là lời chào thông dụng.",tag:"Từ vựng"},
{q:"'谢谢' nghĩa là gì?",opts:["Cảm ơn","Xin lỗi","Chào buổi sáng","Vâng"],a:0,ex:"谢谢 (xiè xie) nghĩa là cảm ơn.",tag:"Từ vựng"},
{q:"Chọn câu tiếng Trung: Tôi là học sinh.",opts:["我有学生。","我是学生。","我去学生。","我不学生。"],a:1,ex:"我是学生。 dùng cấu trúc A + 是 + B.",tag:"Ngữ pháp"},
{q:"'明天' chỉ thời điểm nào?",opts:["Hôm nay","Hôm qua","Ngày mai","Bây giờ"],a:2,ex:"明天 = ngày mai; 今天 = hôm nay; 昨天 = hôm qua.",tag:"Từ vựng"},
{q:"Điền từ: 你___学生吗？",opts:["有","是","喝","买"],a:1,ex:"是 là động từ liên kết trong câu 你是学生吗？",tag:"Ngữ pháp"},
{q:"'飞机' có nghĩa là gì?",opts:["Tàu hỏa","Xe buýt","Sân bay","Máy bay"],a:3,ex:"飞机 (fēi jī) là máy bay.",tag:"Từ vựng"},
{q:"Chọn cấu trúc so sánh đúng.",opts:["我比他高。","我高比他。","比我他高。","我比很他高。"],a:0,ex:"A + 比 + B + tính từ là cấu trúc so sánh cơ bản.",tag:"Ngữ pháp"},
{q:"'考试' có nghĩa là gì?",opts:["Bài học","Kỳ thi","Giáo viên","Trường học"],a:1,ex:"考试 (kǎo shì) là kỳ thi hoặc thi cử.",tag:"Từ vựng"},
{q:"Chọn cặp liên từ chỉ nguyên nhân và kết quả.",opts:["虽然…但是…","如果…就…","因为…所以…","一边…一边…"],a:2,ex:"因为…所以… = bởi vì…cho nên…",tag:"Ngữ pháp"},
{q:"'健康' gần nghĩa nhất với?",opts:["Khỏe mạnh","Quan trọng","Đặc biệt","Phát triển"],a:0,ex:"健康 (jiàn kāng) nói về sức khỏe, khỏe mạnh.",tag:"Từ vựng"}
];
var LISTEN=[
{h:"你好！很高兴认识你。",hint:"Lời chào khi gặp người mới.",p:"nǐ hǎo, hěn gāo xìng rèn shi nǐ",v:"Xin chào! Rất vui được gặp bạn."},
{h:"明天我们一起去学校。",hint:"Một kế hoạch cho ngày mai.",p:"míng tiān wǒ men yì qǐ qù xué xiào",v:"Ngày mai chúng ta cùng đến trường."},
{h:"我想买一本中文书。",hint:"Một người muốn mua thứ gì đó.",p:"wǒ xiǎng mǎi yì běn zhōng wén shū",v:"Tôi muốn mua một cuốn sách tiếng Trung."},
{h:"因为今天下雨，所以我在家学习。",hint:"Nguyên nhân và kết quả.",p:"yīn wèi jīn tiān xià yǔ, suǒ yǐ wǒ zài jiā xué xí",v:"Vì hôm nay trời mưa nên tôi học ở nhà."}
];

/* Tích hợp nội dung bài học ngay vào các mô-đun học cũ.
   Nguồn PDF đa phần là ảnh scan, nên chỉ phân loại CHỦ ĐỀ từ thư mục Drive.
   Hội thoại, từ, giải thích và quiz bên dưới là bản biên soạn mới, không phải
   nguyên văn giáo trình hay đề thi được cấp phép. */
var STUDY=window.HSK_STUDY_CONTENT||{lessons:[],levels:[],grouped:{}};
var STUDY_LESSONS=STUDY.lessons||[];
var originalListenCount=LISTEN.length;
function studyFree(item){return !billingGate()||!!item?.free;}
function studyLessonCount(level){
 return STUDY_LESSONS.filter(function(l){return l.level===level;}).length;
}
function studyWordPool(level){var n=hskVocabLevel(level);return HSK_IMPORTED_WORDS.filter(function(w){return w.level===n;}).slice(0,150);}
function studyLevelsBar(){
 return '<div class="study-level-tabs">'+[1,2,3,4,5,6,7,8,9].map(function(l){
  var current=state.level===l;
  return '<button type="button" class="study-level-tab'+(current?' active':'')+'" data-action="level" data-id="'+l+'">'+(l>=7?'HSK '+l:'HSK '+l)+'</button>';
 }).join("")+'</div>';
}
(function appendStudyContent(){
 var seen=new Set(W.map(function(w){return w.h;}));
 STUDY_LESSONS.forEach(function(lesson,i){
   lesson.globalIndex=i;
   lesson.vocab.forEach(function(v){
     if(seen.has(v[0]))return;
     seen.add(v[0]);
     W.push({id:W.length,h:v[0],p:v[1],v:v[2],
       level:lesson.level,topic:lesson.topic,
       free:!!lesson.free,
       ex:(lesson.dialogue[0]||[])[0]||v[0]});
   });
   GRAMMAR.push({
     title:lesson.grammar,structure:lesson.grammar,
     ex:lesson.dialogue[0][0],vi:lesson.dialogue[0][1],
     hint:lesson.rule,q:lesson.question,opts:lesson.options,a:lesson.answer,
     level:lesson.level,free:!!lesson.free
   });
   LISTEN.push({
     h:lesson.dialogue.map(function(d){return d[0];}).join(" "),
     hint:"HSK "+lesson.level+" · "+lesson.title+" · hội thoại tự biên soạn",
     p:"",v:lesson.dialogue.map(function(d){return d[1];}).join(" "),
     level:lesson.level,free:!!lesson.free
   });
   var meanings=STUDY_LESSONS.filter(function(other){return other.level===lesson.level;})
      .flatMap(function(other){return other.vocab.map(function(v){return v[2];});});
   lesson.vocab.forEach(function(v,n){
      var distractors=meanings.filter(function(z){return z!==v[2];}).slice((i+n)%Math.max(1,meanings.length));
      distractors=distractors.concat(meanings.filter(function(z){return z!==v[2];}));
      distractors=Array.from(new Set(distractors)).slice(0,3);
      if(distractors.length<3)return;
      var a=(i+n)%4,options=distractors.slice();
      options.splice(a,0,v[2]);
      EXAMS.push({q:"“"+v[0]+"” có nghĩa là gì?",opts:options,a,
        ex:v[0]+" ("+v[1]+") nghĩa là "+v[2]+".",
        tag:"HSK "+lesson.level+" · "+lesson.topic,level:lesson.level});
   });
 });
})();
function studyOpenLesson(index){
 var lesson=STUDY_LESSONS[index];
 if(!lesson)return;
 if(!studyFree(lesson)){go("pro");return;}
 courseIndex=index;courseChoice=-1;
 try{sessionStorage.setItem("hsk-panda-course",String(index));}catch(_){}
 go("course-lesson");
}
function studyLessonPage(){
 var lesson=STUDY_LESSONS[courseIndex]||STUDY_LESSONS[0];
 if(!lesson)return head("Bài học","Nội dung đang cập nhật.");
 if(!studyFree(lesson))return premiumNotice(lesson.title);
 var done=(state.courseDone||[]).includes(lesson.id),answered=courseChoice>=0,
     correct=answered&&courseChoice===lesson.answer;
 var others=STUDY_LESSONS.filter(function(l){return l.level===lesson.level;}),
     pos=others.findIndex(function(l){return l.id===lesson.id;}),
     next=others[pos+1];
 return head("HSK "+lesson.level+" · "+esc(lesson.title),
     "Chủ đề: "+esc(lesson.topic)+" · Hội thoại, từ vựng, ngữ pháp và bài tập tương tác.")
 +'<div class="study-lesson-head"><span class="study-pill">Bài '+(pos+1)+' / '+others.length+'</span>'
 +(done?'<span class="study-pill completed">✓ Đã hoàn thành</span>':'<span class="study-pill">Tự biên soạn · luyện tập</span>')
 +button("Quay lại lộ trình","nav",'data-to="roadmap"',"sm secondary")+'</div>'
 +'<div class="study-lesson-layout">'
 +'<section class="panel study-lesson-section"><h2>🎧 Hội thoại thực hành</h2><p class="small-note">Bấm nghe bằng giọng đọc tiếng Trung trên thiết bị.</p>'
 +lesson.dialogue.map(function(d,i){
   return '<div class="study-dialogue"><div class="study-dialogue-line"><strong>'+esc(d[0])+'</strong>'
   +button("🔊 Nghe","studySpeak",'data-id="'+lesson.globalIndex+'" data-line="'+i+'"',"sm secondary")+'</div>'
   +'<p>'+esc(d[1])+'</p></div>';
 }).join("")
 +'</section><section class="panel study-lesson-section"><h2>🧩 Điểm ngữ pháp</h2>'
 +'<div class="study-pattern">'+esc(lesson.grammar)+'</div><p>'+esc(lesson.rule)+'</p>'
 +'<p class="small-note">Ghi nhớ cấu trúc, sau đó tự đặt thêm một câu tương tự.</p></section>'
 +'</div>'
 +'<section class="panel study-lesson-section"><div class="study-section-heading"><h2>📗 Từ vựng trọng tâm</h2><span>'+lesson.vocab.length+' mục</span></div>'
 +'<div class="study-word-grid">'+lesson.vocab.map(function(v){
    return '<div class="study-word-card"><b>'+esc(v[0])+'</b><span>'+esc(v[1])+'</span><p>'+esc(v[2])+'</p></div>';
 }).join("")+'</div><div class="study-shortcuts">'
 +button("Ôn bằng Flashcard","nav",'data-to="flashcards"',"secondary")
 +button("Tra cứu từ","nav",'data-to="vocab"',"secondary")
 +button("Tập viết","nav",'data-to="writing"',"secondary")+'</div></section>'
 +'<section class="panel study-lesson-section"><h2>✏️ Kiểm tra nhanh</h2><p><b>'+esc(lesson.question)+'</b></p>'
 +'<div class="study-quiz-options">'+lesson.options.map(function(opt,i){
   var cls=answered?(i===lesson.answer?'correct':i===courseChoice?'wrong':''):'';
   return '<button class="answer '+cls+'" data-action="studyAnswer" data-id="'+i+'" '+(answered?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+esc(opt)+'</button>';
 }).join("")+'</div>'
 +(answered?'<div class="feedback '+(correct?'':'error')+'" role="status"><strong>'
 +(correct?'✓ Đúng rồi!':'✕ Chưa đúng')+'</strong><p><b>Đáp án:</b> '+esc(lesson.options[lesson.answer])+'</p><p>'
 +esc(lesson.why)+'</p></div>':'')
 +'<div class="study-shortcuts">'+(!correct&&answered?button("Thử trả lời lại","studyRetry","","secondary"):'')
 +(next?button("Bài tiếp theo","studyNext","","") :button("Chọn cấp độ khác","nav",'data-to="roadmap"',""))+'</div>'
 +'</section><p class="small-note">Lưu ý: bài học và câu hỏi do HSK Panda biên soạn theo chủ đề tham khảo, không phải bài học sao chép từ sách và không phải đề thi HSK chính thức.</p>';
}


// Source: seven user-uploaded HSK handouts attributed to PREP.
// Reading, glossary and short Pinyin facts are shown openly; paid Pro still protects
// the original authored interactive lessons and practice features.
var HSK_IMPORTED_WORDS=[];
(function hskImportSevenLists(){
 var data=window.HSK_VOCAB_IMPORTED||[],repaired=window.HSK_VOCAB_CORRECTIONS||[];
 var map=new Map(),risky=new Set(["2:72","2:74","2:100","2:130"]);
 for(var item of data){map.set(item.level+":"+item.n,Object.assign({},item));}
 for(var item of repaired){map.set(item.level+":"+item.n,Object.assign({},item));}
 var ordered=Array.from(map.values()).filter(function(item){
   var key=item.level+":"+item.n;
   if(risky.has(key))return false; // contradictory printed Hanzi, Pinyin and Vietnamese
   return !!item.h&&/[\u3400-\u9fff]/.test(item.h)&&!!item.p&&!!item.v;
 }).sort(function(a,b){return a.level-b.level||a.n-b.n});
 var labels={1:"HSK 1",2:"HSK 2",3:"HSK 3",4:"HSK 4",5:"HSK 5",6:"HSK 6",79:"HSK 7–9"};
 for(var item of ordered){
   var record={
     id:W.length,h:item.h,p:item.p,v:item.v,level:item.level,
     group:labels[item.level]||"HSK",kind:item.kind||"",n:item.n,
     topic:"Từ vựng theo cấp",ex:"",fromPDF:true,free:item.n<=15,
     source:item.corrected?"Đối chiếu PDF":"PREP",
     flagged:(item.flags||[]).length>0
   };
   record.searchIndex=(record.h+" "+record.p+" "+record.v+" "+record.kind)
       .normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").toLowerCase();
   W.push(record);
   HSK_IMPORTED_WORDS.push(record);
 }
})();
function hskVocabLabel(level){return level===79?"HSK 7–9":"HSK "+level;}
function hskVocabLevel(level){return level>=7?79:level;}
function hskSearchNormalize(value){
 return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[đĐ]/g,"d").toLowerCase().trim();
}

var seed={name:"Bạn",level:1,xp:0,streak:0,lastStudy:"",learned:[],reviews:{},activity:{},results:[],grammarDone:[],courseDone:[],settings:{hidePinyin:false}};
var chosenPlan=30;var state=load();var vocabPageIndex=0;var courseIndex=0,courseChoice=-1;var flashIndex=0,flipped=false,vocabSearch="",vocabLevel=hskVocabLevel(state.level||1),grammarIndex=0,grammarChoice=-1,lessonIndex=0,listenIndex=0,listenFeedback="",pronResult="",canvas=null,canvasCtx=null,penDown=false,matching=null,exam=null,examTimer=null,mobileOpen=false;
function load(){try{var s=JSON.parse(localStorage.getItem("hsk-panda-v1"));return Object.assign({},seed,s||{}, {reviews:Object.assign({},s&&s.reviews||{}),activity:Object.assign({},s&&s.activity||{}),settings:Object.assign({},seed.settings,s&&s.settings||{})});}catch(e){return Object.assign({},seed);}}
function save(){try{localStorage.setItem("hsk-panda-v1",JSON.stringify(state));}catch(e){}}
function day(){return new Date().toLocaleDateString("sv-SE",{timeZone:"Asia/Ho_Chi_Minh"});}
function daysApart(a,b){if(!a||!b)return 99;return Math.round((new Date(b+"T00:00:00Z")-new Date(a+"T00:00:00Z"))/86400000);}
function activity(){var d=day();if(!state.activity[d])state.activity[d]={learned:0,reviewed:0,listened:0,pronounced:0,written:0,quizzes:0};return state.activity[d];}
function earn(x,type){var d=day();if(state.lastStudy!==d){state.streak=daysApart(state.lastStudy,d)===1?state.streak+1:1;state.lastStudy=d;}state.xp+=x;if(type){activity()[type]=(activity()[type]||0)+1;}save();}
function pct(a,b){return b?Math.min(100,Math.round(a*100/b)):0;}
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function go(view){if(!KEYS[view]&&["grammar-quiz","exam-result","course-lesson"].indexOf(view)<0)view="home";mobileOpen=false;location.hash=view;render();window.scrollTo(0,0);}
function urlPage(){var id=location.hash.replace(/^#/,"").split("?")[0];return KEYS[id]||["grammar-quiz","exam-result","course-lesson"].indexOf(id)>=0?id:"home";}
function button(label,action,attrs,cl){return '<button class="btn '+(cl||"")+'" data-action="'+action+'" '+(attrs||"")+'>'+label+'</button>';}
function navHtml(active){return '<aside class="sidebar '+(mobileOpen?"open":"")+'"><div class="brand"><div class="brand-logo">'+pandaLogo()+'</div><div><b>HSK Panda</b><small>Học tiếng Trung · Mỗi ngày</small></div></div><nav class="nav"><div class="nav-label">Khám phá</div>'+NAV.slice(0,11).map(function(n){return '<button class="nav-item '+(active===n[0]?"active":"")+'" data-action="nav" data-to="'+n[0]+'">'+ic(n[1])+'<span>'+KEYS[n[0]]+'</span></button>';}).join("")+'<div class="nav-label">Tài khoản & dữ liệu</div>'+NAV.slice(11).map(function(n){return '<button class="nav-item '+(active===n[0]?"active":"")+'" data-action="nav" data-to="'+n[0]+'">'+ic(n[1])+'<span>'+KEYS[n[0]]+'</span></button>';}).join("")+'</nav><div class="side-foot"><b>🌱 Học miễn phí, không áp lực</b><p>Tiến độ đang lưu trên thiết bị này. Có thể xuất dữ liệu trong Cài đặt.</p></div></aside>';}
function pandaLogo(){return '<svg viewBox="0 0 60 60" aria-label="Logo HSK Panda"><circle cx="15" cy="14" r="10" fill="#18352d"/><circle cx="45" cy="14" r="10" fill="#18352d"/><circle cx="30" cy="31" r="27" fill="#fff" stroke="#0c7859" stroke-width="3"/><ellipse cx="19" cy="30" rx="9" ry="11" fill="#203730"/><ellipse cx="41" cy="30" rx="9" ry="11" fill="#203730"/><circle cx="21" cy="28" r="3" fill="#fff"/><circle cx="39" cy="28" r="3" fill="#fff"/><ellipse cx="30" cy="39" rx="5" ry="3.5" fill="#21382e"/><path d="M25 44q5 6 10 0" stroke="#203730" stroke-width="2" fill="none"/><path d="M30 2q2-9 9-8" stroke="#189565" stroke-width="4" fill="none"/></svg>';}
function mobileNav(active){return '<div class="mobilenav">'+[["home","home","Trang chủ"],["vocab","book","Từ vựng"],["flashcards","cards","Ôn tập"],["exam","clipboard","Luyện đề"],["progress","chart","Tiến độ"]].map(function(n){return '<button data-action="nav" data-to="'+n[0]+'" class="'+(active===n[0]?"active":"")+'">'+ic(n[1])+n[2]+'</button>';}).join("")+'</div>';}
function topbar(){var b=billingInfo();return '<header class="topbar"><div class="top-actions"><button class="icon-btn mobile-menu" aria-label="Mở menu" data-action="menu">'+ic("menu")+'</button><button class="icon-btn" title="Thống kê" data-action="nav" data-to="progress">'+ic("chart")+'</button><button class="btn sm" data-action="nav" data-to="pro">👑 Gói Pro</button><button class="btn sm secondary" data-action="nav" data-to="account">'+(b.user?(b.pro?"✓ Tài khoản Pro":"Tài khoản"):"Đăng nhập")+'</button></div><div class="top-profile"><span class="profile-avatar">'+ic("user")+'</span><span class="profile-meta">'+esc(state.name)+'<small>'+(b.pro?"Thành viên HSK Pro":experimentalOpenAll()?"Trải nghiệm toàn bộ · miễn phí":"Học viên HSK "+state.level+" · học thử")+'</small></span></div></header>';}
function billingInfo(){return window.HSKPayment||{configured:false,live:false,user:null,pro:false,expiresAt:null,error:""};}
// Trạng thái thử nghiệm chỉ mở khóa UI bài học, không giả lập Pro thanh toán.
function experimentalOpenAll(){return window.HSK_BILLING_CONFIG?.experimentalOpenAll === true;}
function billingGate(){if(experimentalOpenAll())return false;var b=billingInfo();return b.configured && !b.pro;}
function premiumNotice(title){return head(title,"Bài đầu tiên miễn phí. Bạn có thể nâng cấp Pro để học các bài tiếp theo.")+'<section class="panel panel-pad" style="max-width:720px;margin:auto;text-align:center"><div style="font-size:46px">🐼🔒</div><h2>Bài tiếp theo thuộc gói HSK Pro</h2><p class="hint-text">Bài đầu vẫn học được miễn phí, không giới hạn số lần học lại.</p>'+button("Tìm hiểu gói HSK Pro","nav",'data-to="pro"',"")+'</section>';}
function head(title,desc){return '<div class="page-head"><h1>'+title+'</h1><p>'+desc+'</p></div>';}
function sectionHead(icon,title,sub,action){return '<div class="section-head"><div class="lead">'+ic(icon)+'<div><h2>'+title+'</h2><p>'+sub+'</p></div></div>'+(action||"")+'</div>';}
function stat(icon,title,val,extra){return '<div class="panel stat-card"><span class="stat-icon">'+ic(icon)+'</span><small>'+title+'</small><strong>'+val+'</strong>'+(extra?'<em>'+extra+'</em>':"")+'</div>';}
function tasks(){var a=activity();return [{key:"learned",target:10,label:"Học 10 từ mới",icon:"book",to:"vocab"},{key:"reviewed",target:10,label:"Ôn flashcard SRS",icon:"cards",to:"flashcards"},{key:"listened",target:1,label:"Luyện nghe một bài",icon:"headphones",to:"listening"},{key:"pronounced",target:1,label:"Thử luyện phát âm",icon:"mic",to:"pronunciation"},{key:"written",target:1,label:"Viết một chữ Hán",icon:"pen",to:"writing"},{key:"quizzes",target:1,label:"Làm một mini quiz",icon:"clipboard",to:"exam"}].map(function(t){t.value=a[t.key]||0;return t;});}
function homePage(){var ts=tasks(),completed=ts.filter(function(t){return t.value>=t.target;}).length;var progress=pct(state.learned.length,W.length);
return (experimentalOpenAll()?'<div class="notice"><b>🧪 Chế độ thử nghiệm</b><p>Mọi người được sử dụng đầy đủ chức năng miễn phí, không cần đăng nhập hoặc mua Pro.</p></div>':'')
+'<div class="welcome"><div><h1>Chào bạn, '+esc(state.name)+'! 👋</h1><p>Học từng chút một cùng gấu trúc. Hôm nay mình tiến thêm một bước nhé!</p></div><div class="welcome-art"><div class="panda-bubble">Mỗi ngày 20 phút nhé!</div><div class="panda">'+panda()+'</div>'+scenery()+'</div></div>'
+'<div class="overview"><section class="panel progress-card"><span class="book-emoji">📙</span><div class="progress-body"><h2>Lộ trình HSK '+state.level+'</h2><div class="progress-row"><div class="bar orange"><span style="width:'+progress+'%"></span></div><b>'+progress+'%</b></div><div class="progress-bottom"><small>Đã ghi nhớ '+state.learned.length+' / '+W.length+' từ trong thư viện mẫu</small>'+button("Học tiếp "+ic("play"),"nav",'data-to="vocab"',"sm")+'</div></div></section>'+stat("fire","Chuỗi học",state.streak+" ngày","Kiên trì mỗi ngày")+stat("star","Tổng XP",state.xp.toLocaleString("vi-VN")+" XP","Tích lũy qua bài tập")+stat("book","Từ đã học",state.learned.length+" từ","Trong thư viện mẫu")+'</div>'
+'<div class="grid-top"><section class="panel roadmap-card">'+sectionHead("map","Lộ trình học tập","Hành trình tiếng Trung từng chủ đề",'<button class="small-link" data-action="nav" data-to="roadmap">Xem lộ trình '+ic("chevron")+'</button>')+'<div class="roadmap"><div class="road-line"></div>'+["Giao tiếp","Gia đình","Trường học","Mua sắm","Du lịch"].map(function(t,i){var done=i<Math.min(5,Math.floor(state.learned.length/10));return '<button class="road-stop '+(done?"done":i===Math.floor(state.learned.length/10)?"current":"")+'" data-action="nav" data-to="vocab"><span class="road-dot">'+ic(done?"check":i===Math.floor(state.learned.length/10)?"play":"lock")+'</span><b>Chủ đề '+(i+1)+'</b><span>'+t+'</span></button>';}).join("")+'</div></section><section class="panel tasks">'+sectionHead("clipboard","Nhiệm vụ hôm nay","'+completed+' / 6 hoàn thành")+'<div>'+ts.map(function(t){return '<div class="task '+(t.value>=t.target?"done":"")+'"><span class="check">'+(t.value>=t.target?ic("check"):"")+'</span><span class="task-symbol">'+ic(t.icon)+'</span><span class="task-name">'+t.label+'</span><b>'+Math.min(t.value,t.target)+'/'+t.target+'</b></div>';}).join("")+'</div></section></div>'
+'<div class="panel method-strip"><div class="method-intro"><b>⭐ Học đúng phương pháp, nhớ lâu hơn</b><small>Phương pháp thực hành miễn phí trên trình duyệt</small></div><div class="method-pills">'+[["cards","Flashcard","flashcards"],["refresh","SRS","flashcards"],["headphones","Nghe chép","listening"],["audio","Shadowing","listening"],["mic","Phát âm","pronunciation"],["pen","Viết chữ Hán","writing"],["clipboard","Quiz","exam"],["game","Ghép cặp","games"]].map(function(c){return '<button class="method-chip" data-action="nav" data-to="'+c[2]+'">'+ic(c[0])+c[1]+'</button>';}).join("")+'</div></div>'
+'<div class="grid-bottom"><section class="panel panel-pad">'+sectionHead("cards","Flashcard ôn tập","Nhớ từ bằng cách tự trả lời")+'<div class="flash-mini"><div><div class="hanzi">'+W[flashIndex%W.length].h+'</div><div class="pinyin">'+W[flashIndex%W.length].p+'</div><div class="meaning">'+W[flashIndex%W.length].v+'</div></div></div>'+button("Ôn tập ngay "+ic("arrow"),"nav",'data-to="flashcards"',"full")+'</section>'
+'<section class="panel panel-pad">'+sectionHead("target","Phương pháp nổi bật","Học tập chủ động mỗi ngày")+[["cards","Flashcard","Ghi nhớ bằng truy hồi"],["refresh","SRS","Ôn theo lịch chống quên"],["headphones","Dictation","Nghe và chép chính tả"],["audio","Shadowing","Nghe rồi lặp lại"],["game","Game hóa","Ôn tập qua trò chơi"]].map(function(m){return '<div class="method-item">'+ic(m[0])+'<div><b>'+m[1]+'</b><small>'+m[2]+'</small></div></div>';}).join("")+'</section>'
+'<section class="panel panel-pad">'+sectionHead("layers","Học đa kỹ năng","Theo dõi nỗ lực của bạn")+[["Từ vựng",progress],["Luyện nghe",Math.min(100,(activity().listened||0)*20)],["Đọc/ngữ pháp",pct(state.grammarDone.length,GRAMMAR.length)],["Phát âm",Math.min(100,(activity().pronounced||0)*20)],["Viết chữ Hán",Math.min(100,(activity().written||0)*20)]].map(function(s){return '<div class="skill-item"><b>'+s[0]+'</b><div class="bar"><span style="width:'+s[1]+'%"></span></div><span>'+s[1]+'%</span></div>';}).join("")+'</section>'
+'<section class="panel panel-pad">'+sectionHead("trophy","Góc thành tích","Bảng minh họa, chưa có xếp hạng online")+[['Panda chăm chỉ','1.800'],['Bạn đồng hành','1.350'],[state.name+' (Bạn)',state.xp.toLocaleString("vi-VN")]].map(function(x,i){return '<div class="ranking-item '+(i===2?"mine":"")+'"><span class="rank">'+(i+1)+'</span><b>'+esc(x[0])+'</b><span class="xp">'+x[1]+' XP</span></div>';}).join("")+'<p class="small-note">Xếp hạng thật sẽ có khi kết nối tài khoản và cơ sở dữ liệu.</p>'+button("Xem thành tích", "nav",'data-to="progress"',"secondary sm full")+'</section></div>';}
function roadmapPage(){
 var levels=STUDY.levels||[1,2,3,4,5,6,7,8,9];
 var current=state.level||1,items=STUDY_LESSONS.filter(function(l){return l.level===current;}),
     done=items.filter(function(l){return (state.courseDone||[]).includes(l.id);}).length;
 return head("Lộ trình HSK 1–9 🗺️","Chọn cấp độ và học trực tiếp: từ mới, hội thoại, ngữ pháp và câu hỏi. Tất cả bài được mở miễn phí trong giai đoạn thử nghiệm.")
 +'<section class="panel panel-pad"><h2 style="margin-top:0">Chọn trình độ đang học</h2>'
 +studyLevelsBar()
 +'<p class="small-note">HSK 1–6 và nhóm HSK 7–9 được tổ chức theo chủ đề trong nguồn Drive, chưa phải bảng đối chiếu chính thức từng mục của HSK 3.0.</p>'
 +'</section>'
 +'<section class="study-level-summary"><div><span>HSK '+current+'</span><h2>'
 +(current>=7?'Chủ đề nâng cao · HSK 7–9':'Lộ trình chủ đề · HSK '+current)
 +'</h2><p>Đã hoàn thành '+done+' / '+items.length+' bài học</p></div>'
 +'<div class="bar"><span style="width:'+pct(done,items.length)+'%"></span></div></section>'
 +'<div class="study-roadmap-grid">'+items.map(function(l,i){
   var completed=(state.courseDone||[]).includes(l.id),free=!!l.free,locked=billingGate()&&!free;
   return '<article class="panel study-step"><div class="study-step-top"><span class="study-pill">Bài '+(i+1)+'</span>'
   +'<span class="study-pill '+(completed?'completed':'')+'">'
   +(completed?'✓ Hoàn thành':free?'Học miễn phí':locked?'🔒 Pro':'HSK Pro')+'</span></div>'
   +'<h3>'+esc(l.title)+'</h3><p>'+esc(l.topic)+' · '+esc(l.grammar)+'</p>'
   +'<div class="study-step-meta">5 từ vựng · 2 câu hội thoại · 1 câu luyện tập</div>'
   +button(locked?'Nâng cấp để học':completed?'Ôn lại bài':'Bắt đầu học',
      "studyOpen",'data-id="'+l.globalIndex+'"',locked?"secondary full":"full")
   +'</article>';
 }).join("")+'</div>'
 +'<div class="notice">Tài liệu trong Drive được dùng để xác định nhóm chủ đề. Phần kiến thức tương tác ở đây do HSK Panda tự biên soạn. Bạn không cần mở file PDF để học.</div>';
}
function vocabPage(){
 var counts=[1,2,3,4,5,6,79].map(function(level){
   var count=HSK_IMPORTED_WORDS.filter(function(w){return w.level===level;}).length;
   return '<span class="hsk-vocab-level-count">'+hskVocabLabel(level)+': <b>'+count.toLocaleString("vi-VN")+'</b></span>';
 }).join("");
 return head("Từ vựng HSK 1–9 📗","Tra cứu trực tiếp chữ Hán, Pinyin, nghĩa tiếng Việt và từ loại. Tập hợp HSK 7–9 giữ nguyên dạng nhóm theo nguồn.")
  +'<section class="hsk-vocab-banner"><span>📘 DANH SÁCH TỪ VỰNG ĐÃ PHÂN LOẠI</span>'
  +'<h2>'+HSK_IMPORTED_WORDS.length.toLocaleString("vi-VN")+' từ · 7 bộ HSK</h2>'
  +'<p>Dữ liệu tra cứu tham khảo từ bảy bảng từ vựng PREP mà bạn đã cung cấp. Phần giải nghĩa cần tiếp tục hiệu đính; không phải dữ liệu chuẩn được cơ quan tổ chức HSK xác nhận.</p>'
  +'<div class="hsk-vocab-level-counts">'+counts+'</div></section>'
  +'<div class="toolbar hsk-vocab-toolbar"><div class="search-wrap">'+ic("search")
  +'<input class="field" id="vocabSearch" autocomplete="off" placeholder="Tìm chữ Hán, Pinyin, nghĩa hoặc từ loại..." value="'+esc(vocabSearch)+'"></div>'
  +'<select id="vocabLevel" class="field hsk-vocab-select">'
  +'<option value="0">Tất cả cấp HSK</option>'
  +[1,2,3,4,5,6,79].map(function(n){return '<option value="'+n+'" '+(vocabLevel===n?"selected":"")+'>'+hskVocabLabel(n)+'</option>';}).join("")
  +'</select>'+button("Ôn Flashcard","nav",'data-to="flashcards"',"secondary")+'</div>'
  +'<div class="hsk-vocab-notice"><b>Ghi chú:</b> HSK 7–9 là một danh sách từ chung, không tự tách thành cấp 7, 8 và 9. Một số dòng trong PDF có mâu thuẫn đã được tạm ẩn để tránh dạy sai. Từ vựng có thể tra cứu miễn phí; gói Pro cung cấp bài học và luyện tập mở rộng.</div>'
  +'<div class="hsk-vocab-count" id="vocabCount"></div><div class="vocab-grid" id="vocabResults"></div>'
  +'<div id="hskVocabPages" class="hsk-vocab-pages"></div>'
  +'<p class="hsk-vocab-credit"><strong>Nguồn tham khảo:</strong> Các bảng “Từ vựng HSK 1–6, HSK 7–9” của PREP do người dùng cung cấp. Tên nguồn được giữ để ghi công, không sử dụng logo, thiết kế PDF hoặc nội dung bộ đề của PREP. Cần rà soát điều kiện quyền sử dụng trước khi khai thác thương mại.</p>';
}
function renderVocabResults(){
 var box=document.getElementById("vocabResults"),count=document.getElementById("vocabCount"),pager=document.getElementById("hskVocabPages");
 if(!box||!count||!pager)return;
 var query=hskSearchNormalize(vocabSearch),selected=vocabLevel;
 var matches=HSK_IMPORTED_WORDS.filter(function(w){
   return (!selected||selected===w.level)&&(!query||w.searchIndex.includes(query));
 });
 var batchSize=36,pages=Math.max(1,Math.ceil(matches.length/batchSize));
 vocabPageIndex=Math.max(0,Math.min(vocabPageIndex,pages-1));
 var offset=vocabPageIndex*batchSize;
 count.textContent=matches.length.toLocaleString("vi-VN")+" kết quả · Trang "+(vocabPageIndex+1)+" / "+pages;
 box.innerHTML=matches.slice(offset,offset+batchSize).map(function(w){
   var known=state.learned.includes(w.id);
   return '<article class="panel word-card hsk-vocab-card">'
    +'<div class="word-top"><span class="word-char">'+esc(w.h)+'</span><button class="icon-btn" aria-label="Nghe từ '+esc(w.h)+'" data-action="speak" data-id="'+w.id+'">'+ic("audio")+'</button></div>'
    +'<div class="word-pinyin">'+esc(w.p)+'</div><div class="word-mean">'+esc(w.v)+'</div>'
    +(w.kind?'<div class="hsk-vocab-kind">'+esc(w.kind)+'</div>':'')
    +'<div class="word-bottom"><small>'+hskVocabLabel(w.level)+' · #'+w.n+'</small>'
    +button(known?ic("check")+" Đã học":"Đánh dấu đã học","learn",'data-id="'+w.id+'"',known?"sm secondary":"sm")
    +'</div></article>';
 }).join("");
 if(!matches.length)box.innerHTML='<div class="empty">Không tìm thấy từ phù hợp. Hãy thử chữ Hán hoặc cách viết Pinyin không dấu.</div>';
 pager.innerHTML=pages>1?'<button class="btn sm secondary" data-action="vocabPaginate" data-page="'+(vocabPageIndex-1)+'" '+(vocabPageIndex===0?"disabled":"")+'>← Trước</button>'
   +'<span>Trang '+(vocabPageIndex+1)+' / '+pages+'</span>'
   +'<button class="btn sm secondary" data-action="vocabPaginate" data-page="'+(vocabPageIndex+1)+'" '+(vocabPageIndex>=pages-1?"disabled":"")+'>Tiếp →</button>':'';
}

function flashWords(){
 var level=hskVocabLevel(state.level||1);
 var fromPDF=HSK_IMPORTED_WORDS.filter(function(w){return w.level===level;});
 var source=fromPDF.length?fromPDF:W.filter(function(w){return w.level===state.level;});
 if(billingGate())source=source.filter(function(w){return w.free;});
 var due=source.filter(function(w){return !state.reviews[w.id]||state.reviews[w.id].next<=Date.now();});
 return due.length?due:source;
}

function flashPage(){
 var arr=flashWords(),w=arr[((flashIndex%arr.length)+arr.length)%arr.length];
 if(!w)return head("Flashcard","Chưa có từ nào.");
 return head("Flashcard + SRS 🧠","Ôn thẻ theo cấp HSK đang học. Toàn bộ Flashcard được mở miễn phí trong giai đoạn thử nghiệm.")+studyLevelsBar()
  +'<div class="flash-layout"><div class="flash-count">Thẻ cần ôn: '+arr.length+' · '+(Math.abs(flashIndex)%arr.length+1)+' / '+arr.length+'</div>'
  +'<div class="flash-central" role="button" tabindex="0" data-action="flip" aria-label="Chạm để cuộn lật, vuốt trái để ghi nhận chưa nhớ, vuốt phải để chuyển thẻ">'
  +'<span class="flash-level badge">'+hskVocabLabel(w.level)+'</span>'
  +'<span class="flash-swipe-tag flash-swipe-tag-left" aria-hidden="true">← Chưa nhớ</span>'
  +'<span class="flash-swipe-tag flash-swipe-tag-right" aria-hidden="true">Tiếp theo →</span>'
  +'<div class="hanzi">'+esc(w.h)+'</div>'
  +(flipped?'<div class="pinyin">'+esc(w.p)+'</div><div class="meaning">'+esc(w.v)+'</div><p class="example-line">'+w.ex+'</p>':'<div class="hint-text">Bạn có nhớ nghĩa và cách đọc của từ này?</div>')
  +'<div class="hint">'+(flipped?"Chạm để cuộn lật về mặt trước":"Chạm để cuộn lật xem đáp án")+'</div></div>'
  +'<div class="flash-controls flash-audio">'+button(ic("audio")+" Nghe từ","speak",'data-id="'+w.id+'"',"secondary")+'</div>'
  +'<div class="flash-swipe-actions">'+button("← Chưa nhớ","flashAgain",'data-id="'+w.id+'"',"flash-again")+button("Tiếp theo →","nextflash","","flash-next")+'</div>'
  +'<p class="flash-swipe-help">Vuốt trái: Chưa nhớ · Vuốt phải: Tiếp theo · Chạm thẻ để cuộn lật</p>'
  +'<div class="notice">Lịch ôn được lưu trong trình duyệt. Phiên bản thử nghiệm dùng lịch đơn giản theo mức độ nhớ, chưa phải thuật toán FSRS được hiệu chuẩn từ dữ liệu cá nhân.</div></div>';
}
function studyPracticeWord(){
 var words=studyWordPool(state.level).filter(function(w){return !billingGate()||w.free||w.id<8;});
 var pool=words.length?words:W;
 return pool[((lessonIndex%pool.length)+pool.length)%pool.length];
}
function studyListenSelector(){
 var arr=STUDY_LESSONS.filter(function(l){return l.level===state.level;});
 return '<section class="panel study-selector"><h2>🎧 Hội thoại HSK '+state.level+' theo chủ đề</h2>'
  +studyLevelsBar()
  +'<p class="small-note">Giọng đọc tiếng Trung được tạo bởi thiết bị; không dùng audio của sách có bản quyền.</p>'
  +'<div class="study-selector-grid">'+arr.map(function(l){
    var locked=billingGate()&&!l.free;
    return '<button class="study-selector-btn" data-action="studyListen" data-id="'+l.globalIndex+'">'
      +'<b>'+(locked?'🔒 ':'🎧 ')+esc(l.title)+'</b><small>'+esc(l.topic)+(locked?' · Pro':' · Nghe và chép')+'</small></button>';
  }).join("")+'</div></section>';
}
function listenPage(){var l=LISTEN[listenIndex];return head("Luyện nghe & Shadowing 🎧","Nghe câu tiếng Trung, chép lại hoặc đọc theo. Âm thanh dùng giọng đọc trên thiết bị nếu có hỗ trợ tiếng Trung.")+'<div class="exercise-card panel"><span class="pill">Bài '+(listenIndex+1)+' / '+LISTEN.length+'</span><h2>Nghe chép chính tả (Dictation)</h2><p class="hint-text">'+l.hint+'</p><div class="exercise-control">'+button(ic("audio")+" Phát âm thanh","listen","","")+button("Nghe chậm 0,8×","listen",'data-speed="0.8"',"secondary")+button("Bài tiếp theo "+ic("arrow"),"nextlisten","","outline")+'</div><hr class="extra-divider"><p><b>Gõ lại câu tiếng Trung bạn vừa nghe:</b></p><textarea class="field" id="dictationInput" rows="3" placeholder="Viết nội dung nghe được bằng chữ Hán..."></textarea><div class="exercise-control">'+button("Kiểm tra chính tả","checklisten","","")+button("Xem lời thoại","revealListen","","secondary")+button("Luyện Shadowing", "nav",'data-to="pronunciation"',"outline")+'</div><div id="listeningFeedback">'+listenFeedback+'</div></div><div class="notice">Shadowing: nghe câu rồi nói theo nhịp và ngữ điệu. Để tự nghe lại, bạn có thể ghi âm bằng ứng dụng ghi âm trên máy; chấm phát âm tự động chuyên sâu chưa được triển khai.</div>'+studyListenSelector();}
function studySpeakingPrompt(){
 var prompts=[
 ["Giới thiệu bản thân và người thân","请介绍你的名字和家人。"],
 ["Kể về lịch sinh hoạt trong một ngày","请说说你每天的生活。"],
 ["Kể lại một chuyến du lịch","请介绍一次难忘的旅行。"],
 ["Trình bày kế hoạch học tập sắp tới","请谈谈你的学习计划。"],
 ["Nêu quan điểm về lựa chọn nghề nghiệp","你认为选择工作时什么最重要？"],
 ["Thảo luận về bảo vệ môi trường","你怎样看待经济发展与环境保护的关系？"],
 ["Đưa ra ý kiến khi đàm phán thương mại","请说明协商在商务谈判中的作用。"],
 ["So sánh hai giải pháp chính sách","请比较两个政策方案的优点和局限。"],
 ["Đánh giá lập luận và giới hạn của dữ liệu","请评价一项研究的论证及其局限性。"]
 ];
 var p=prompts[(state.level||1)-1]||prompts[0];
 return '<section class="panel study-selector"><h2>🗣️ Luyện nói mở rộng · Chủ đề HSK '+state.level+'</h2>'
   +'<p class="small-note">Bài luyện nói do HSK Panda biên soạn. HSKK có cấp và định dạng thi riêng; đây không phải đề HSKK chính thức.</p>'
   +'<h3>'+esc(p[0])+'</h3><div class="study-pattern">'+esc(p[1])+'</div>'
   +'<div class="study-shortcuts">'+button("🔊 Nghe câu hỏi","studyPromptSpeak","","secondary")
   +button("Luyện hội thoại","nav",'data-to="roadmap"',"")+'</div></section>';
}
function pronPage(){var w=studyPracticeWord();return head("Luyện phát âm Pinyin 🎙️","HSK "+state.level+" · Nghe và đọc lại từ mẫu. Nhận dạng đúng chữ không chứng minh thanh điệu chuẩn.")+studyLevelsBar()+'<div class="exercise-card panel speaking-box"><span class="badge">Luyện nói cơ bản</span><div class="exercise-large">'+w.h+'</div><h2>'+w.p+'</h2><p>'+esc(w.v)+'</p><div class="exercise-control" style="justify-content:center">'+button(ic("audio")+" Nghe mẫu","speak",'data-id="'+w.id+'"',"secondary")+button(ic("mic")+" Bắt đầu ghi nhận lời nói","recognize",'data-id="'+w.id+'"',"")+button("Từ tiếp theo","nextPron","","outline")+'</div><div class="feedback" id="pronFeedback">'+(pronResult||"Bấm nghe mẫu, sau đó thử đọc theo. Nếu trình duyệt hỗ trợ nhận dạng, lời nói sẽ hiển thị ở đây.")+'</div></div><div class="notice warning">Bản này chỉ so sánh văn bản được nhận dạng với từ mục tiêu, không chấm điểm khẩu hình, thanh điệu hay độ chuẩn phát âm. Trình duyệt có thể yêu cầu quyền micro và kết nối mạng.</div>'+studySpeakingPrompt();}
function writingPage(){var w=studyPracticeWord();return head("Luyện viết chữ Hán ✍️","HSK "+state.level+" · Tập viết trên khung ô vuông, chưa có nhận diện thứ tự nét.")+studyLevelsBar()+'<div class="two-col"><section class="panel panel-pad"><div class="section-head"><div class="lead">'+ic("pen")+'<h2>Viết theo mẫu</h2></div><span class="badge">Ô chữ 米</span></div><div style="text-align:center"><div class="exercise-large">'+w.h+'</div><b>'+w.p+'</b><p class="hint-text">'+w.v+'</p></div><div class="exercise-control">'+button(ic("audio")+" Nghe đọc","speak",'data-id="'+w.id+'"',"secondary")+button("Chữ tiếp theo","nextWrite","","outline")+'</div><div class="notice">Quan sát chữ mẫu, viết lại nhiều lần. Bạn có thể dùng chuột hoặc màn hình cảm ứng.</div></section><section class="panel panel-pad"><h2 style="margin:0">Bảng luyện viết</h2><canvas class="writing-board" id="writeCanvas" width="420" height="320" aria-label="Bảng viết chữ Hán"></canvas><div class="exercise-control">'+button("Xóa nét","clearCanvas","","secondary")+button(ic("check")+" Đã luyện xong","finishWrite","","")+'</div></section></div>';}
function grammarPage(){
 var current=state.level||1;
 var cards=GRAMMAR.map(function(g,i){return {g:g,id:i};}).filter(function(x){
  return x.g.level===current||(current===1&&x.g.level==null);
 });
 return head("Ngữ pháp tương tác ✨","Học cấu trúc theo từng cấp HSK, xem ví dụ và làm câu hỏi ngay.")
 +studyLevelsBar()
 +'<p class="small-note">Cấu trúc được biên soạn để luyện tập, không sao chép nguyên văn giáo trình. Toàn bộ bài luyện đang mở miễn phí.</p>'
 +'<div class="grammar-grid">'+cards.map(function(x){
   var g=x.g,done=state.grammarDone.includes(x.id),locked=billingGate()&&x.id!==0&&!g.free;
   return '<article class="panel grammar-card">'
    +'<span class="badge '+(done?"success":"")+'">HSK '+current+' · '+(done?"✓ Đã luyện":locked?"🔒 Pro":"Luyện tập")+'</span>'
    +'<div class="title">'+esc(g.title)+'</div><p>'+esc(g.hint)+'</p>'
    +'<div class="example">'+esc(g.ex)+'<br><span style="font-family:Be Vietnam Pro;font-size:10px;color:#769083">'+esc(g.vi)+'</span></div>'
    +'<div class="exercise-control">'+button(locked?"Nâng cấp để học":"Làm bài "+ic("arrow"),"grammarQuiz",'data-id="'+x.id+'"',"sm secondary")+'</div></article>';
 }).join("")+'</div>';
}

function grammarQuizPage(){
 var g=GRAMMAR[grammarIndex];if(billingGate()&&grammarIndex>0&&!g?.free)return premiumNotice(g.title);var answered=grammarChoice>=0,correct=answered&&grammarChoice===g.a;
 return head("Mini quiz ngữ pháp","Chọn câu trả lời để biết đúng hay sai ngay, kèm giải thích dễ hiểu.")
 +'<div class="exercise-card panel"><span class="pill">Bài '+(grammarIndex+1)+' · '+esc(g.title)+'</span><h2>'+esc(g.q)+'</h2>'
 +'<div class="quiz-answers">'+g.opts.map(function(o,i){var cls=answered?(i===g.a?"correct":i===grammarChoice?"wrong":""):"";return '<button class="answer '+cls+'" data-action="grammarAnswer" data-id="'+i+'" '+(answered?'disabled aria-disabled="true"':'')+'><b style="margin-right:7px">'+String.fromCharCode(65+i)+'.</b>'+esc(o)+'</button>';}).join("")+'</div>'
 +(answered?'<div class="feedback '+(correct?'':'error')+'" role="status" aria-live="polite"><strong>'+(correct?'✓ Chính xác!':'✕ Chưa chính xác!')+'</strong><p>Đáp án đúng: <b>'+String.fromCharCode(65+g.a)+'. '+esc(g.opts[g.a])+'</b></p><p><b>Giải thích:</b> '+esc(g.hint)+'</p></div>':'<div class="small-note">Đáp án sẽ hiện sau khi bạn chọn. Mỗi câu chỉ được trả lời một lần.</div>')
 +'<div class="exercise-control">'+button("Quay lại thư viện","nav",'data-to="grammar"',"secondary")+(answered?button("Luyện bài tiếp theo "+ic("arrow"),"nextGrammar","",""):'')+'</div></div>';
}
function examPage(){if(exam)return examRunning();var last=state.results[state.results.length-1];return head("Luyện đề HSK 📝","HSK "+state.level+" · Mini test 10 câu tự biên soạn, chấm từng câu. Không phải đề thi thật.")+studyLevelsBar()+'<div class="two-col"><section class="panel panel-pad">'+sectionHead("clipboard","Mini test 10 câu","Kiểm tra từ vựng và ngữ pháp nền tảng")+'<div class="flash-mini" style="min-height:200px"><div style="text-align:center"><div style="font-size:45px">📝</div><h2 style="margin:9px 0">Thử sức ngay!</h2><p>10 câu · chấm từng câu ngay · có giải thích</p></div></div>'+button(ic("play")+" Bắt đầu luyện đề","startExam","","full")+'<p class="small-note">Bài kiểm tra luyện tập tự biên soạn. Bài thi chính thức có cấu trúc khác theo cấp độ và phiên bản.</p></section><section class="panel panel-pad">'+sectionHead("chart","Lần làm gần nhất","Kết quả của bạn trên thiết bị này")+(last?'<div style="text-align:center"><div class="big-number">'+last.correct+'/'+last.total+'</div><b>'+pct(last.correct,last.total)+'% câu đúng</b></div><hr class="extra-divider"><p>Ngày làm: '+esc(last.date)+'</p><p>Kiến thức cần ôn: '+last.wrongs.length+' câu</p>'+button("Làm đề mới","startExam","","full secondary")+'</section>':'<div class="empty">'+ic("clipboard")+'<p>Bạn chưa hoàn thành bài kiểm tra nào.</p></div></section>')+'</div>';}
function examRunning(){
 var q=exam.questions[exam.index],choice=exam.answers[exam.index],answered=choice>=0,correct=answered&&choice===q.a;
 var count=exam.answers.filter(function(a){return a>=0;}).length;
 var right=exam.answers.reduce(function(sum,a,i){return sum+(a>=0&&a===exam.questions[i].a?1:0);},0);
 return head("Luyện đề · Chấm đúng/sai ngay ✓","Bài tập HSK '+state.level+' tự biên soạn · Chọn đáp án, xem giải thích và chuyển câu.")
 +'<div class="quiz-shell"><div class="quiz-head"><span class="pill">Câu '+(exam.index+1)+' / '+exam.questions.length+' · Đã trả lời '+count+'/'+exam.questions.length+'</span><span class="pill">'+ic("clock")+' <span id="examClock">00:00</span></span></div>'
 +'<div class="bar"><span style="width:'+pct(count,exam.questions.length)+'%"></span></div>'
 +'<section class="panel quiz-question" style="margin-top:16px"><span class="badge">'+esc(q.tag)+'</span><h2>'+esc(q.q)+'</h2>'
 +'<div class="quiz-answers">'+q.opts.map(function(x,i){var cl=answered?(i===q.a?"correct":i===choice?"wrong":""):"";return '<button class="answer '+cl+'" data-action="examAnswer" data-id="'+i+'" '+(answered?'disabled aria-disabled="true"':'')+'><b style="margin-right:7px">'+String.fromCharCode(65+i)+'.</b>'+esc(x)+'</button>';}).join("")+'</div>'
 +(answered?'<div class="feedback '+(correct?'':'error')+'" role="status" aria-live="polite"><strong>'+(correct?'✓ Chính xác!':'✕ Chưa chính xác!')+'</strong><p>Đáp án đúng: <b>'+String.fromCharCode(65+q.a)+'. '+esc(q.opts[q.a])+'</b></p><p><b>Giải thích:</b> '+esc(q.ex)+'</p></div>':'<div class="small-note">Nhấn vào một đáp án để được chấm NGAY. Xanh = đúng, đỏ = sai. Mỗi câu chỉ được chọn một lần.</div>')
 +'<div class="quiz-footer">'+button("Câu trước","prevExam",exam.index===0?'disabled':'',"secondary")+(exam.index===exam.questions.length-1?button("Xem kết quả "+ic("arrow"),"finishExam",!answered?'disabled':'',"orange"):button("Câu tiếp theo "+ic("arrow"),"nextExam",!answered?'disabled':''))+'</div>'
 +'<p class="small-note">Đã đúng '+right+'/'+count+' câu đã trả lời. Phần luyện tập hiển thị đáp án ngay, khác với chế độ thi thử sẽ phát triển sau.</p>'
 +'</section></div>';
}
function examResultPage(){var r=state.results[state.results.length-1];if(!r)return examPage();return head("Kết quả mini test 🎉","Câu đúng được chấm tự động. Xem lại từng lỗi sai và ôn tập theo gợi ý.")+'<section class="panel quiz-result"><div style="font-size:44px">🐼</div><div class="big-number">'+r.correct+' / '+r.total+'</div><h2>'+pct(r.correct,r.total)+'% câu trả lời chính xác</h2><p>Câu sai: '+r.wrongs.length+' · Thời gian: '+Math.round(r.seconds/60)+' phút</p><div class="bottom-actions" style="justify-content:center">'+button("Làm lại đề","startExam","","")+button("Ôn từ vựng","nav",'data-to="vocab"',"secondary")+'</div></section><section class="panel panel-pad">'+sectionHead("target","Sổ lỗi sai của lần làm gần nhất","Xem giải thích, không chỉ nhớ đáp án")+(r.wrongs.length?r.wrongs.map(function(w,i){return '<div class="list-panel" style="border-bottom:1px solid #edf2ee"><span class="badge warn">Câu '+(w.number+1)+'</span><h3>'+esc(w.q)+'</h3><p>Đáp án đúng: <b>'+esc(w.correct)+'</b></p><p class="hint-text">'+esc(w.ex)+'</p></div>';}).join(""):'<div class="notice">Bạn đã trả lời đúng tất cả câu hỏi. Hãy thử một bộ đề mới khi nội dung được cập nhật.</div>')+'</section>';}
function initMatch(){var pool=W.slice(0,30).sort(function(){return Math.random()-.5;}).slice(0,6);var cards=[];pool.forEach(function(w){cards.push({id:w.id,text:w.h});cards.push({id:w.id,text:w.v});});matching={cards:cards.sort(function(){return Math.random()-.5;}),selected:[],matched:[],moves:0,locked:false};}
function gamePage(){if(!matching)initMatch();return head("Game ghép cặp 🎮","Ghép chữ Hán với nghĩa tiếng Việt. Game chạy miễn phí ngay trên trình duyệt.")+'<div class="panel panel-pad" style="max-width:850px;margin:auto">'+sectionHead("game","Thử thách trí nhớ","6 cặp từ · '+matching.moves+' lượt chọn")+'<div class="game-grid">'+matching.cards.map(function(c,i){var matched=matching.matched.indexOf(c.id)>=0;return '<button class="match-card '+(matched?"matched":"")+' '+(matching.selected.indexOf(i)>=0?"selected":"")+'" data-action="match" data-id="'+i+'" '+(matched?"disabled":"")+'>'+esc(c.text)+'</button>';}).join("")+'</div><div class="exercise-control">'+button("Chơi lại "+ic("refresh"),"newGame","","secondary")+button("Ôn bằng Flashcard","nav",'data-to="flashcards"',"outline")+'</div><p class="small-note">Đúng 1 cặp: +5 XP. Bạn có thể chơi lại để củng cố từ vựng.</p></div>';}
function leaderboardPage(){return head("Bảng xếp hạng 🏆","Bản thử nghiệm chỉ có thành tích cá nhân. Xếp hạng giữa học viên cần hệ thống tài khoản trực tuyến.")+'<div class="two-col"><section class="panel panel-pad">'+sectionHead("trophy","Thành tích của bạn","Dữ liệu trên trình duyệt hiện tại")+'<div style="text-align:center;padding:26px"><div style="font-size:48px">🏅</div><h2>'+esc(state.name)+'</h2><div class="big-number">'+state.xp.toLocaleString("vi-VN")+' XP</div><p>Chuỗi học '+state.streak+' ngày · '+state.learned.length+' từ đã ghi nhớ</p></div></section><section class="panel panel-pad">'+sectionHead("info","Sắp ra mắt","Bảng xếp hạng công bằng theo trình độ")+'<p>Bảng xếp hạng online cần Supabase để xác thực người dùng, đồng bộ điểm và phòng gian lận. Hiện tại website không tự tạo điểm số của những người dùng không tồn tại.</p>'+button("Tiếp tục học", "nav",'data-to="home"',"")+'</section></div>';}
function progressPage(){var active=Object.keys(state.activity).filter(function(d){return Object.values(state.activity[d]).some(function(v){return v>0;});}).length;return head("Tiến độ học tập 📈","Những con số này dựa trên hoạt động thực tế của bạn trong trình duyệt, không phải dữ liệu minh họa.")+'<div class="report-grid"><div class="panel"><small>Tổng XP</small><div class="big">'+state.xp.toLocaleString("vi-VN")+'</div></div><div class="panel"><small>Từ đã đánh dấu học</small><div class="big">'+state.learned.length+' / '+W.length+'</div></div><div class="panel"><small>Số ngày có hoạt động</small><div class="big">'+active+'</div></div><div class="panel"><small>Bài kiểm tra hoàn thành</small><div class="big">'+state.results.length+'</div></div><div class="panel"><small>Bài ngữ pháp đã luyện</small><div class="big">'+state.grammarDone.length+' / '+GRAMMAR.length+'</div></div><div class="panel"><small>Chuỗi học hiện tại</small><div class="big">'+state.streak+' ngày</div></div></div><div class="two-col"><section class="panel panel-pad">'+sectionHead("chart","Các hoạt động hôm nay","Cập nhật tự động sau khi bạn học")+'<div class="skill-bars">'+tasks().map(function(t){return '<div class="skill-item"><b style="width:145px">'+t.label+'</b><div class="bar"><span style="width:'+pct(t.value,t.target)+'%"></span></div><span>'+Math.min(t.value,t.target)+'/'+t.target+'</span></div>';}).join("")+'</div></section><section class="panel panel-pad">'+sectionHead("clipboard","Lịch sử kiểm tra","Các bài gần đây")+(state.results.length?state.results.slice(-6).reverse().map(function(r){return '<div class="method-item">'+ic("check")+'<div><b>'+r.correct+'/'+r.total+' câu đúng</b><small>'+esc(r.date)+'</small></div><strong style="margin-left:auto">'+pct(r.correct,r.total)+'%</strong></div>';}).join(""):'<div class="empty">Chưa có bài kiểm tra. Hãy vào Luyện đề!</div>')+'</section></div>';}

var PRICES={30:{label:"30 ngày",money:89000},90:{label:"90 ngày",money:219000},365:{label:"365 ngày",money:699000}};
function money(n){return Number(n).toLocaleString("vi-VN")+"đ";}
function proPage(){
 var b=billingInfo();
 var cards=Object.keys(PRICES).map(function(k){
  var p=PRICES[k],featured=k==="90";
  return '<div class="panel pro-plan '+(featured?"best":"")+'">'
   +'<span class="pill">'+(featured?"Được lựa chọn nhiều":"HSK Panda Pro")+'</span>'
   +'<h3>Pro '+p.label+'</h3><div class="pro-price">'+money(p.money)+'</div>'
   +'<p>Thời hạn '+p.label+' từ lúc payOS xác nhận thanh toán.</p>'
   +'<div class="pro-checks">✓ Mở khóa nội dung Pro hiện có<br>✓ Tiếp tục học không cần đăng nhập<br>✓ Gia hạn cộng dồn khi còn ngày<br>✓ Khôi phục bằng mã bí mật</div>'
   +button("Chọn gói "+p.label+" "+ic("arrow"),"choosePlan",'data-id="'+k+'"',"full "+(featured?"":"secondary"))
   +'</div>';
 }).join("");
 return head("HSK Panda Premium 🐼","Giữ nguyên bảng giá và payOS; trong giai đoạn thực nghiệm, mọi bài học được mở miễn phí.")
 +(experimentalOpenAll()?'<div class="notice"><b>🧪 Đang mở miễn phí mọi chức năng</b><p>Bạn không cần đăng nhập hoặc mua Pro để học. Phần giá và payOS được giữ lại để kiểm thử; nếu chủ động thanh toán, đó vẫn là giao dịch tiền thật.</p></div>':'')
 +'<section class="pro-hero"><div><span class="pill">'+(experimentalOpenAll()?"Toàn bộ kỹ năng mở miễn phí":"Học một bài miễn phí mỗi kỹ năng")+'</span><h2>Học tiếng Trung thú vị hơn<br>cùng HSK Panda</h2><p>Học và trải nghiệm đầy đủ chức năng trong giai đoạn thực nghiệm.</p></div><div class="pro-panda">'+panda()+'</div></section>'
 +(b.pro?'<div class="notice">✓ Pro đang hoạt động đến '+esc(new Date(b.expiresAt).toLocaleString("vi-VN"))+'. Nếu mua tiếp, thời gian được cộng dồn.</div>':'')
 +'<h2 class="pro-subtitle">Chọn gói phù hợp</h2><div class="pro-grid">'
 +'<div class="panel pro-plan"><span class="pill">'+(experimentalOpenAll()?"Mở toàn bộ · giai đoạn thử nghiệm":"Học thử miễn phí")+'</span><h3>FREE</h3><div class="pro-price">0đ</div><p>'+(experimentalOpenAll()?"Mở miễn phí trong thời gian thử nghiệm":"Không có thời hạn")+'</p><div class="pro-checks">✓ Tất cả bài học HSK 1–9<br>✓ Từ vựng, Flashcard và ôn tập<br>✓ Luyện nghe, phát âm, viết, ngữ pháp và đề<br>✓ Game, XP, luyện tập và theo dõi tiến độ</div>'
 +button("Học miễn phí","nav",'data-to="home"',"secondary full")+'</div>'
 +cards+'</div>'
 +'<p class="small-note">Gói Pro gắn với phiên trình duyệt của bạn. Hãy lưu mã khôi phục sau thanh toán để có thể chuyển thiết bị.</p>';
}

function checkoutPage(){
 var b=billingInfo(),p=PRICES[chosenPlan]||PRICES[30];
 var hasOrder=!!b.lastPayment,active=b.pro;
 return head("Nâng cấp HSK Pro","Thông tin gói và thanh toán qua payOS vẫn được lưu giữ.")
 +(experimentalOpenAll()?'<div class="notice"><b>🧪 Chưa cần thanh toán</b><p>Tất cả chức năng học đã được mở miễn phí trong giai đoạn thực nghiệm. Nút tạo QR dưới đây vẫn là thanh toán bằng tiền thật, nhưng không cần sử dụng để truy cập bài học.</p></div>':'')
 +'<div class="pay-layout"><section class="panel pay-order"><div class="pay-order-title">'
 +ic("lock")+'<div><h2>Thông tin gói học</h2><p>Giá và thời hạn cố định, không có phí ẩn trong website</p></div></div>'
 +'<div class="pay-line"><span>Gói</span><b>HSK Pro '+p.label+'</b></div>'
 +'<div class="pay-line"><span>Thời hạn</span><b>'+p.label+'</b></div>'
 +'<div class="pay-line pay-total"><span>Thanh toán</span><b>'+money(p.money)+'</b></div>'
 +'<div class="pay-feature">✓ Tạo QR payOS riêng cho mỗi đơn<br>✓ Không cần email hoặc mật khẩu<br>✓ Chỉ cấp Pro sau khi xác minh giao dịch<br>✓ Mua thêm được cộng thời hạn vào quyền hiện tại</div>'
 +'<div class="pay-warning"><b>Lưu ý về thiết bị</b><p>Quyền học ban đầu gắn với mã bí mật lưu trong trình duyệt này. Hãy sao chép mã khôi phục sau khi thanh toán. Người biết mã có thể truy cập gói của bạn, vì vậy không chia sẻ mã công khai.</p></div></section>'
 +'<section class="panel pay-order"><div style="text-align:center;font-size:46px">🐼</div>'
 +(active?'<h2>HSK Pro đang hoạt động</h2><p>Hết hạn hiện tại: '+esc(new Date(b.expiresAt).toLocaleString("vi-VN"))+'. Bạn có thể gia hạn thêm ngay.</p>':
 '<h2>Thanh toán bảo mật qua payOS</h2><p>Nhấn nút dưới để lấy QR '+money(p.money)+' và mã đơn tương ứng.</p>')
 +button((active?"Gia hạn gói ":"Tạo QR thanh toán ")+money(p.money), "planCheckout", "", "full")
 +(hasOrder?'<p class="pay-note">Trạng thái đơn gần nhất: '+esc(String(b.lastPayment.status||"đang cập nhật"))+'</p>'+button("Kiểm tra giao dịch","checkPayment","","secondary full"):'')
 +'<div class="pay-feature">✓ Xác minh chữ ký payOS<br>✓ Chống cấp trùng khi webhook gửi lại<br>✓ Đối soát khi ngân hàng cập nhật chậm</div>'
 +(active&&window.HSKPayment?.getRecoveryCode()?'<div class="notice"><b>Hãy lưu mã khôi phục quyền Pro:</b> '+button("Sao chép mã bí mật","copyRecovery","","secondary")+'<p class="hint-text">Không gửi mã này cho người khác.</p></div>':'')
 +'</section></div><p class="small-note">Bạn sẽ được chuyển sang trang thanh toán payOS. Chỉ thanh toán một lần cho mỗi đơn; không có gia hạn tự động trừ tiền.</p>';
}

function accountPage(){
 var b=billingInfo();
 return head("Tài khoản học viên 👤","Đăng nhập để đồng bộ quyền Pro sau khi hệ thống được kết nối.")
 +'<section class="panel panel-pad" style="max-width:680px;margin:auto">'+(!b.configured?
 '<div class="notice warning"><b>Chưa kết nối đăng nhập:</b> cần thêm Supabase Publishable Key vào cấu hình công khai. Không nhập API Key payOS hoặc khóa bí mật vào mã website.</div>'
 :b.user?'<h2>Đang đăng nhập</h2><p><b>Email:</b> '+esc(b.user.email||"")+'</p><p><b>Gói hiện tại:</b> '+(b.pro?"HSK Pro":"Free")+'</p>'+(b.pro?'<p><b>Hết hạn:</b> '+esc(new Date(b.expiresAt).toLocaleString("vi-VN"))+'</p>':'')+'<div class="bottom-actions">'+button("Cập nhật trạng thái","refreshAccess","","secondary")+button("Đăng xuất","signOut","","outline")+'</div>'
 :'<h2>Đăng nhập bằng email</h2><p>Nhập email và nhận đường dẫn đăng nhập. Không cần tạo mật khẩu.</p><input id="hsk-login-email" type="email" class="field" placeholder="email@example.com" autocomplete="email"><div class="exercise-control">'+button("Gửi đường dẫn đăng nhập","signInEmail","","")+button("Tiếp tục với Google","signInGoogle","","secondary")+'</div><p class="hint-text">Google cần được bật trong Supabase Authentication trước khi sử dụng.</p>')
 +(b.error?'<div class="feedback error">'+esc(b.error)+'</div>':'')
 +'</section>'+recoveryPageSection();
}
function recoveryPageSection(){
 var code=window.HSKPayment?.getRecoveryCode();
 return '<section class="panel panel-pad" style="max-width:680px;margin:18px auto">'
 +'<h2>Khôi phục gói Pro khi đổi thiết bị</h2>'
 +'<p>Nếu đã thanh toán nhưng muốn dùng trên trình duyệt khác, hãy nhập mã khôi phục đã sao chép từ thiết bị cũ.</p>'
 +'<input id="hsk-recovery-input" class="field" placeholder="Nhập mã 64 ký tự" autocomplete="off" spellcheck="false">'
 +'<div class="exercise-control">'+button("Khôi phục quyền Pro","restoreRecovery","","secondary")
 +(code?button("Sao chép mã đang có","copyRecovery","",""):'')+'</div>'
 +'<p class="hint-text">Mã này tương đương mật khẩu truy cập quyền Pro. Không đăng công khai và không gửi cho người lạ.</p>'
 +'</section>';
}
function paymentStatusPage(){
 var b=billingInfo(),p=b.lastPayment,active=b.pro;
 return head("Trạng thái thanh toán","Quyền Pro chỉ được cấp khi máy chủ nhận được xác nhận payOS.")
 +'<section class="panel panel-pad" style="max-width:700px;margin:auto;text-align:center">'
 +'<div style="font-size:46px">'+(active?"✅":"⏳")+'</div>'
 +(active?'<h2>HSK Pro đã mở khóa thành công!</h2><p>Hết hạn: '+esc(new Date(b.expiresAt).toLocaleString("vi-VN"))+'</p>'
 :'<h2>Đang xác minh thanh toán</h2><p>Nếu vừa chuyển tiền, hệ thống sẽ tự kiểm tra. Trở lại website không đồng nghĩa giao dịch đã hoàn tất.</p>')
 +(p?'<p class="hint-text">Trạng thái đơn: '+esc(String(p.status||"đang cập nhật"))+'</p>':'')
 +(b.error?'<div class="notice warning">'+esc(b.error)+'</div>':'')
 +'<div class="bottom-actions" style="justify-content:center">'
 +button("Kiểm tra lại","checkPayment",b.isChecking?"disabled":"","secondary")
 +button(active?"Học Pro ngay":"Xem gói Pro","nav",'data-to="'+(active?"home":"pro")+'"',"")+'</div>'
 +(active&&window.HSKPayment?.getRecoveryCode()?'<div class="notice" style="margin-top:18px"><b>Mã khôi phục khi đổi máy</b><p class="hint-text">Sao chép và giữ riêng. Người có mã có thể sử dụng quyền học Pro của bạn.</p>'+button("Sao chép mã khôi phục","copyRecovery","","secondary")+'</div>':'')
 +'</section>';
}

function settingsPage(){return head("Cài đặt & dữ liệu ⚙️","Chủ động quản lý hồ sơ và dữ liệu học tập. Tiến độ học tập lưu trên thiết bị; quyền Pro được xác minh trên Supabase.")+'<div class="settings-section"><section class="panel"><h2>Hồ sơ học tập</h2><p>Tên hiển thị trên dashboard (chỉ lưu trên thiết bị).</p><input id="profileName" class="field" maxlength="35" value="'+esc(state.name)+'" placeholder="Tên của bạn"><div class="exercise-control">'+button("Lưu tên","saveName","","")+button("Đổi cấp độ","nav",'data-to="roadmap"',"secondary")+'</div></section><section class="panel"><h2>Sao lưu và khôi phục</h2><p>Xuất file dữ liệu của bạn để chuyển sang thiết bị khác. Không cần tạo tài khoản.</p><div class="bottom-actions">'+button(ic("download")+" Xuất dữ liệu JSON","exportData","","secondary")+'<label class="btn outline upload-label">'+ic("upload")+' Nhập dữ liệu <input type="file" id="importFile" accept="application/json,.json"></label></div><p class="small-note">File xuất chứa tiến độ và tên hồ sơ đã lưu. Chỉ nhập file từ nguồn đáng tin cậy.</p></section><section class="panel"><h2>Quyền riêng tư</h2><p>HSK Panda bản thử nghiệm lưu dữ liệu trong localStorage của trình duyệt. Không có server tài khoản, không có thanh toán, không có dữ liệu AI.</p>'+button("Xóa toàn bộ tiến độ trên thiết bị","resetData","","orange")+'</section><section class="panel"><h2>Thông tin phiên bản</h2><p>HSK Panda MVP · Giao diện mô phỏng theo bản thiết kế đã chọn · Nội dung học thử chưa thay thế bộ giáo trình HSK hoàn chỉnh. Âm thanh phụ thuộc hỗ trợ của trình duyệt.</p></section></div>';}
function render(){var page=urlPage(),html=navHtml(page)+ '<div class="main">'+topbar()+'<main class="container">'+({"home":homePage,"roadmap":roadmapPage,"course-lesson":studyLessonPage,"vocab":vocabPage,"flashcards":flashPage,"listening":listenPage,"pronunciation":pronPage,"writing":writingPage,"grammar":grammarPage,"exam":examPage,"games":gamePage,"leaderboard":leaderboardPage,"progress":progressPage,"settings":settingsPage,"pro":proPage,"checkout":checkoutPage,"account":accountPage,"payment-status":paymentStatusPage,"grammar-quiz":grammarQuizPage,"exam-result":examResultPage}[page]||homePage)()+'<div class="footer">🐼 HSK Panda · Bản 2.2.1 · Bài học theo chủ đề · Thanh toán Pro qua payOS · Phản hồi đúng/sai tức thì · Nội dung thử nghiệm do nền tảng biên soạn · Không phải trang thi HSK chính thức</div></main></div>'+mobileNav(page);root.innerHTML='<div class="app-shell">'+html+'</div>';if(page==="vocab")renderVocabResults();if(page==="writing")setupCanvas();if(page==="exam"&&exam)updateClock();}
function say(text,speed){if(!("speechSynthesis" in window)){alert("Trình duyệt này chưa hỗ trợ phát âm tự động.");return;}try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang="zh-CN";u.rate=speed||.88;var list=speechSynthesis.getVoices();var voice=list.find(function(v){return /zh[-_]CN/i.test(v.lang);})||list.find(function(v){return /^zh/i.test(v.lang);});if(voice)u.voice=voice;speechSynthesis.speak(u);}catch(e){alert("Không thể phát âm trên thiết bị này.");}}
function markLearn(id){if(state.learned.indexOf(id)>=0)return;state.learned.push(id);earn(10,"learned");render();}
function rate(id,grade){var r=state.reviews[id]||{interval:0,repetitions:0};if(grade==="again"){r.interval=1/1440;r.repetitions=0;}else if(grade==="good"){r.repetitions++;r.interval=r.repetitions===1?1:Math.round(Math.max(2,r.interval*2.1));}else{r.repetitions++;r.interval=r.repetitions===1?3:Math.round(Math.max(4,r.interval*2.7));}r.next=Date.now()+r.interval*86400000;state.reviews[id]=r;if(state.learned.indexOf(id)<0)state.learned.push(id);earn(grade==="again"?1:7,"reviewed");flipped=false;flashIndex++;render();}

var flashFlipBusy=false,flashSwipeBusy=false,flashDrag=null,flashSuppressClickUntil=0;
function flashCurrentWord(){var a=flashWords();return a.length?a[((flashIndex%a.length)+a.length)%a.length]:null;}
function flashAdvance(){flashIndex++;flipped=false;render();}
function flashRollAnimation(previousMarkup,previousHeight){
 var card=document.querySelector(".flash-layout > .flash-central");
 if(!card)return false;
 var height=Math.max(previousHeight,card.offsetHeight),width=card.offsetWidth;
 if(height<1||width<1)return false;
 card.style.minHeight=height+"px";
 card.classList.add("flash-roll-playing");
 var overlay=document.createElement("div");
 overlay.className="flash-roll-overlay";
 overlay.setAttribute("aria-hidden","true");
 var count=9,step=height/count;
 for(var k=0;k<count;k++){
  var top=k*step;
  var strip=document.createElement("div");
  strip.className="flash-roll-slice";
  strip.style.top=top+"px";
  strip.style.height=(k===count-1?height-top:step+0.8)+"px";
  strip.style.animationDelay=(k*65)+"ms";
  strip.style.zIndex=String(count-k);
  var face=document.createElement("div");
  face.className="flash-central flash-roll-face";
  face.style.top=(-top)+"px";
  face.style.left="0";
  face.style.width=width+"px";
  face.style.height=height+"px";
  face.innerHTML=previousMarkup;
  strip.appendChild(face);overlay.appendChild(strip);
 }
 card.appendChild(overlay);
 setTimeout(function(){
  if(overlay.isConnected)overlay.remove();
  if(card.isConnected){card.classList.remove("flash-roll-playing");card.style.minHeight="";}
 },1200);
 return true;
}
function flipFlashcard(){
 if(flashFlipBusy||flashSwipeBusy)return;
 var card=document.querySelector(".flash-layout > .flash-central");
 var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 var old=card?card.innerHTML:"",oldHeight=card?card.offsetHeight:0;
 flashFlipBusy=true;
 flipped=!flipped;render();
 if(!reduce&&card)flashRollAnimation(old,oldHeight);
 setTimeout(function(){flashFlipBusy=false;},reduce?0:1200);
}
function flashMove(direction){
 if(flashSwipeBusy||flashFlipBusy)return;
 var word=flashCurrentWord();if(!word)return;
 var card=document.querySelector(".flash-layout > .flash-central");
 var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 var old=card?card.innerHTML:"",oldHeight=card?card.offsetHeight:0;
 flashSwipeBusy=true;flashDrag=null;
 if(direction==="left")rate(word.id,"again");else flashAdvance();
 if(!reduce&&card)flashRollAnimation(old,oldHeight);
 setTimeout(function(){flashSwipeBusy=false;},reduce?0:1200);
}
function flashDragReset(drag){
 if(!drag||!drag.card||!drag.card.isConnected)return;
 var card=drag.card;
 card.classList.remove("flash-dragging");
 card.style.transform="";
 card.style.opacity="";
 card.style.removeProperty("--flash-left-opacity");
 card.style.removeProperty("--flash-right-opacity");
}
document.addEventListener("pointerdown",function(e){
 var card=e.target.closest&&e.target.closest(".flash-central");
 if(!card||flashSwipeBusy||flashFlipBusy||urlPage()!=="flashcards"||!e.isPrimary||(e.pointerType==="mouse"&&e.button!==0))return;
 flashDrag={card:card,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,active:false};
});
document.addEventListener("pointermove",function(e){
 var d=flashDrag;
 if(!d||d.pointerId!==e.pointerId||flashSwipeBusy||!d.card.isConnected)return;
 var dx=e.clientX-d.startX,dy=e.clientY-d.startY;
 if(!d.active){
  if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)*1.25){flashDrag=null;return;}
  if(Math.abs(dx)<10||Math.abs(dx)<=Math.abs(dy)*1.25)return;
  d.active=true;
  d.card.classList.add("flash-dragging");
  try{d.card.setPointerCapture(e.pointerId);}catch(err){}
 }
 if(e.cancelable)e.preventDefault();
 var amount=Math.max(-30,Math.min(30,dx*0.12));
 d.card.style.transform="translate3d("+amount+"px,0,0)";
 d.card.style.opacity="1";
 d.card.style.setProperty("--flash-left-opacity",String(Math.min(1,Math.max(0,-dx)/115)));
 d.card.style.setProperty("--flash-right-opacity",String(Math.min(1,Math.max(0,dx)/115)));
},{passive:false});
document.addEventListener("pointerup",function(e){
 var d=flashDrag;
 if(!d||d.pointerId!==e.pointerId)return;
 flashDrag=null;
 if(!d.active)return;
 flashSuppressClickUntil=Date.now()+350;
 var dx=e.clientX-d.startX;
 var threshold=Math.min(90,Math.max(55,d.card.clientWidth*0.18));
 if(Math.abs(dx)>=threshold)flashMove(dx<0?"left":"right");
 else flashDragReset(d);
});
document.addEventListener("pointercancel",function(e){
 var d=flashDrag;
 if(d&&d.pointerId===e.pointerId){flashDrag=null;flashDragReset(d);}
});
function normalizeHan(s){return String(s||"").replace(/[\s\u3000.,!?，。？！；;：:（）()"'“”‘’]/g,"").toLowerCase();}
function checkListen(reveal){var l=LISTEN[listenIndex],v=document.getElementById("dictationInput");var typed=v?v.value:"";var correct=normalizeHan(typed)===normalizeHan(l.h);if(reveal){listenFeedback='<div class="feedback"><b>Đáp án:</b> '+l.h+'<br>'+esc(l.p)+'<br>'+esc(l.v)+'</div>';}else if(!typed.trim()){listenFeedback='<div class="feedback error">Bạn cần nhập câu nghe được trước khi kiểm tra.</div>';}else{listenFeedback='<div class="feedback '+(correct?"":"error")+'"><b>'+(correct?"Chính xác! +15 XP":"Chưa trùng khớp, thử nghe lại.")+'</b><br>'+(correct?"Tốt lắm, bạn đã nghe đúng cả câu.":"Đáp án: "+l.h+"<br>"+esc(l.v))+'</div>';if(correct)earn(15,"listened");}var box=document.getElementById("listeningFeedback");if(box)box.innerHTML=listenFeedback;}
function recognize(id){var SR=window.SpeechRecognition||window.webkitSpeechRecognition;var out=document.getElementById("pronFeedback");if(!SR){out.textContent="Trình duyệt chưa hỗ trợ SpeechRecognition. Hãy dùng Chrome nếu muốn thử, hoặc chỉ luyện nghe rồi đọc lại.";return;}var rec=new SR();rec.lang="zh-CN";rec.interimResults=false;rec.maxAlternatives=1;out.textContent="Đang nghe... Hãy phát âm rõ từ mẫu.";rec.onresult=function(e){var t=e.results[0][0].transcript||"",ok=normalizeHan(t)===normalizeHan(W[id].h);out.innerHTML="Máy nhận dạng: <b>"+esc(t)+"</b>.<br>"+(ok?"Đã nhận diện đúng từ mục tiêu. Đây chưa phải điểm chấm thanh điệu.":"Chưa nhận diện đúng từ. Nghe mẫu rồi thử lại.");earn(ok?10:2,"pronounced");};rec.onerror=function(e){out.textContent="Không nhận dạng được: "+e.error+". Kiểm tra quyền micro và kết nối.";};try{rec.start();}catch(e){out.textContent="Chức năng ghi nhận giọng nói không được cấp quyền.";} }
function setupCanvas(){canvas=document.getElementById("writeCanvas");if(!canvas)return;canvasCtx=canvas.getContext("2d");canvasCtx.lineWidth=6;canvasCtx.strokeStyle="#107b5a";canvasCtx.lineCap="round";canvasCtx.lineJoin="round";var point=function(e){var r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};};canvas.onpointerdown=function(e){e.preventDefault();penDown=true;canvas.setPointerCapture(e.pointerId);var p=point(e);canvasCtx.beginPath();canvasCtx.moveTo(p.x,p.y);canvasCtx.lineTo(p.x+.01,p.y+.01);canvasCtx.stroke();};canvas.onpointermove=function(e){if(!penDown)return;var p=point(e);canvasCtx.lineTo(p.x,p.y);canvasCtx.stroke();};canvas.onpointerup=function(){penDown=false;};canvas.onpointercancel=function(){penDown=false;};}
function startExam(){
 var level=state.level||1;
 var questions=EXAMS.filter(function(q){return (q.level||1)===level;})
   .slice().sort(function(){return Math.random()-.5;}).slice(0,10);
 if(questions.length<10)questions=questions.concat(EXAMS.filter(function(q){return (q.level||1)!==level;}).slice(0,10-questions.length));
 exam={questions:questions,answers:Array(questions.length).fill(-1),index:0,start:Date.now()};
 render();
}
function updateClock(){var el=document.getElementById("examClock");if(!el||!exam)return;var sec=Math.floor((Date.now()-exam.start)/1000);el.textContent=String(Math.floor(sec/60)).padStart(2,"0")+":"+String(sec%60).padStart(2,"0");}
function finishExam(){if(!exam)return;if(exam.answers.indexOf(-1)>=0&&!confirm("Bạn chưa trả lời hết câu. Vẫn nộp bài?"))return;var wrong=[],correct=0;exam.questions.forEach(function(q,i){if(exam.answers[i]===q.a)correct++;else wrong.push({number:i,q:q.q,correct:q.opts[q.a],ex:q.ex});});var r={date:day(),correct:correct,total:exam.questions.length,seconds:Math.floor((Date.now()-exam.start)/1000),wrongs:wrong};state.results.push(r);state.results=state.results.slice(-25);earn(correct*5+10,"quizzes");exam=null;go("exam-result");}
function grammarAnswer(n){
 if(grammarChoice!==-1||n<0||n>=GRAMMAR[grammarIndex].opts.length)return;
 grammarChoice=n;
 var g=GRAMMAR[grammarIndex];
 if(n===g.a && state.grammarDone.indexOf(grammarIndex)<0){state.grammarDone.push(grammarIndex);earn(10);}
 save();render();
}
function nextGrammar(){var next=(grammarIndex+1)%GRAMMAR.length;if(billingGate()&&next>0&&!GRAMMAR[next]?.free){go("pro");return;}grammarIndex=next;grammarChoice=-1;render();}
function match(n){if(!matching||matching.locked||matching.selected.indexOf(n)>=0)return;var c=matching.cards[n];if(matching.matched.indexOf(c.id)>=0)return;matching.selected.push(n);if(matching.selected.length===2){matching.moves++;matching.locked=true;var a=matching.cards[matching.selected[0]],b=matching.cards[matching.selected[1]];if(a.id===b.id){matching.matched.push(a.id);matching.selected=[];matching.locked=false;earn(5);render();if(matching.matched.length===6)setTimeout(function(){alert("🐼 Hoàn thành! Bạn đã ghép đúng cả 6 cặp.");},80);}else{render();setTimeout(function(){if(matching){matching.selected=[];matching.locked=false;render();}},650);}}else render();}
function downloadData(){var blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});var link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download="hsk-panda-tien-do-"+day()+".json";link.click();setTimeout(function(){URL.revokeObjectURL(link.href);},1000);}
function importData(file){if(!file)return;var reader=new FileReader();reader.onload=function(){try{var data=JSON.parse(reader.result);if(!data||typeof data!=="object"||!Array.isArray(data.learned)||!Array.isArray(data.results))throw Error("Định dạng không hợp lệ");if(!confirm("Nhập bản sao lưu sẽ thay thế tiến độ hiện tại. Tiếp tục?"))return;state=Object.assign({},seed,data);save();go("home");alert("Đã nhập tiến độ thành công.");}catch(e){alert("Không đọc được dữ liệu hợp lệ: "+e.message);}};reader.readAsText(file);}
document.addEventListener("input",function(e){if(e.target.id==="vocabSearch"){vocabSearch=e.target.value;vocabPageIndex=0;renderVocabResults();}});
document.addEventListener("change",function(e){if(e.target.id==="vocabLevel"){vocabLevel=Number(e.target.value);vocabPageIndex=0;renderVocabResults();}if(e.target.id==="importFile")importData(e.target.files[0]);});
document.addEventListener("keydown",function(e){
 if(!e.target.classList.contains("flash-central"))return;
 if(e.key==="Enter"||e.key===" "){e.preventDefault();flipFlashcard();}
 else if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();flashMove(e.key==="ArrowLeft"?"left":"right");}
});
document.addEventListener("click",function(e){if(Date.now()<flashSuppressClickUntil&&e.target.closest(".flash-central")){e.preventDefault();return;}var el=e.target.closest("[data-action]");if(!el)return;var action=el.dataset.action,id=Number(el.dataset.id),to=el.dataset.to;switch(action){
case "nav":go(to);break;
case "vocabPaginate":{var pageIndex=Number(el.dataset.page);if(pageIndex>=0){vocabPageIndex=pageIndex;renderVocabResults();}break;}
case "studyPromptSpeak":{var questions=[
 "请介绍你的名字和家人。","请说说你每天的生活。","请介绍一次难忘的旅行。","请谈谈你的学习计划。",
 "你认为选择工作时什么最重要？","你怎样看待经济发展与环境保护的关系？","请说明协商在商务谈判中的作用。",
 "请比较两个政策方案的优点和局限。","请评价一项研究的论证及其局限性。"];
 say(questions[(state.level||1)-1]||questions[0]);break;}
case "studyListen":{var item=STUDY_LESSONS[id];if(!item)break;if(!studyFree(item)){go("pro");break;}listenIndex=originalListenCount+id;listenFeedback="";render();break;}
case "studyOpen":studyOpenLesson(id);break;
case "studyAnswer":{
 var l=STUDY_LESSONS[courseIndex];
 if(!l||courseChoice>=0||id<0||id>=l.options.length)break;
 courseChoice=id;
 if(id===l.answer&&!state.courseDone.includes(l.id)){
   state.courseDone.push(l.id);earn(12,"quizzes");save();
 }
 render();break;
}
case "studyRetry":courseChoice=-1;render();break;
case "studyNext":{
 var l=STUDY_LESSONS[courseIndex],arr=STUDY_LESSONS.filter(function(x){return x.level===l.level;});
 var next=arr[arr.findIndex(function(x){return x.id===l.id;})+1];
 if(next)studyOpenLesson(next.globalIndex);else go("roadmap");
 break;
}
case "studySpeak":{
 var l=STUDY_LESSONS[courseIndex],line=Number(el.dataset.line);
 if(l&&l.dialogue[line])say(l.dialogue[line][0]);break;
}
case "choosePlan":chosenPlan=Number(el.dataset.id)||30;go("checkout");break;
case "signInEmail":{var input=document.getElementById("hsk-login-email");window.HSKPayment?.signInEmail(input?.value||"").then(function(m){alert(m);}).catch(function(e){alert(e.message);});break;}
case "signInGoogle":window.HSKPayment?.signInGoogle().catch(function(e){alert(e.message);});break;
case "signOut":window.HSKPayment?.signOut().catch(function(e){alert(e.message);});break;
case "refreshAccess":window.HSKPayment?.refresh().catch(function(e){alert(e.message);});break;
case "planCheckout":if(el.disabled)break;el.disabled=true;window.HSKPayment?.createPlanCheckout("pro_"+chosenPlan).catch(function(e){el.disabled=false;alert(e.message);});break;
case "copyRecovery":{var rec=window.HSKPayment?.getRecoveryCode();if(!rec){alert("Chưa có mã khôi phục.");break;}if(navigator.clipboard?.writeText){navigator.clipboard.writeText(rec).then(function(){alert("Đã sao chép mã khôi phục. Hãy lưu riêng.");}).catch(function(){prompt("Sao chép mã khôi phục:",rec);});}else{prompt("Sao chép mã khôi phục:",rec);}break;}
case "restoreRecovery":{var inp=document.getElementById("hsk-recovery-input");window.HSKPayment?.restoreRecoveryCode(inp?.value||"").then(function(){alert("Đã kiểm tra và khôi phục quyền học.");go("checkout");}).catch(function(e){alert(e.message);});break;}
case "checkPayment":window.HSKPayment?.checkPayment().catch(function(e){alert(e.message);});break;
case "menu":mobileOpen=!mobileOpen;render();break;
case "learn":markLearn(id);break;
case "speak":say(W[id].h);break;
case "flip":flipFlashcard();break;
case "flashAgain":flashMove("left");break;
case "nextflash":flashMove("right");break;
case "rate":rate(id,el.dataset.grade);break;
case "level":if(id>=1&&id<=9){state.level=id;vocabLevel=hskVocabLevel(id);vocabPageIndex=0;flashIndex=0;lessonIndex=0;save();render();}break;
case "listen":say(LISTEN[listenIndex].h,Number(el.dataset.speed)||.88);break;
case "nextlisten":if(billingGate()){go("pro");break;}listenIndex=(listenIndex+1)%LISTEN.length;listenFeedback="";render();break;
case "checklisten":checkListen(false);break;
case "revealListen":checkListen(true);break;
case "recognize":recognize(id);break;
case "nextPron":if(billingGate()){go("pro");break;}lessonIndex++;pronResult="";render();break;
case "nextWrite":if(billingGate()){go("pro");break;}lessonIndex++;render();break;
case "clearCanvas":if(canvasCtx)canvasCtx.clearRect(0,0,canvas.width,canvas.height);break;
case "finishWrite":earn(8,"written");alert("Đã ghi nhận một lượt luyện viết. +8 XP");render();break;
case "grammarQuiz":if(billingGate()&&id>0&&!GRAMMAR[id]?.free){go("pro");break;}grammarIndex=id;grammarChoice=-1;location.hash="grammar-quiz";render();break;
case "grammarAnswer":grammarAnswer(id);break;
case "nextGrammar":nextGrammar();break;
case "startExam":if(billingGate()&&state.results.length>0){go("pro");break;}startExam();break;
case "examAnswer":if(exam&&exam.answers[exam.index]===-1&&id>=0&&id<exam.questions[exam.index].opts.length){exam.answers[exam.index]=id;render();}break;
case "prevExam":if(exam&&exam.index>0)exam.index--;render();break;
case "nextExam":if(exam&&exam.index<exam.questions.length-1&&exam.answers[exam.index]!==-1)exam.index++;render();break;
case "finishExam":finishExam();break;
case "newGame":initMatch();render();break;
case "match":match(id);break;
case "saveName":var n=document.getElementById("profileName").value.trim();if(n){state.name=n.slice(0,35);save();render();}break;
case "exportData":downloadData();break;
case "resetData":if(confirm("Xóa toàn bộ dữ liệu học trên thiết bị này? Không thể hoàn tác nếu chưa xuất file sao lưu.")){state=Object.assign({},seed,{learned:[],reviews:{},activity:{},results:[],grammarDone:[],settings:{hidePinyin:false}});save();go("home");}break;
}});
window.addEventListener("hashchange",render);
window.addEventListener("hsk-billing-update",render);
setInterval(updateClock,1000);
render();
})();
