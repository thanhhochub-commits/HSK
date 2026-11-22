/* HSK Panda v2.0 — Nội dung học tương tác tự biên soạn.
   Các CHỦ ĐỀ được tổ chức theo nhóm tài liệu đã kiểm tra trên Drive:
   Giáo trình HSK1–6, sách Hán ngữ, BOYA, bộ đề HSK/HSKK, ngữ pháp,
   Business Chinese, tài liệu HSK7–9. Không sao chép nội dung gốc.
   Các mức học là đề xuất sư phạm, CHƯA xác nhận bám chính xác từng
   danh mục từ vựng HSK 3.0 hoặc đề thi chính thức. */
(function(){
"use strict";
const lessons=[];
const idx={};
function L(level,title,topic,grammar,rule,dialogue,vocab,question,options,answer,why){
 const n=(idx[level]||0)+1;idx[level]=n;
 lessons.push({id:"HSK-"+level+"-"+String(n).padStart(2,"0"),level,
  title,topic,grammar,rule,dialogue,vocab,question,options,answer,why,
  free:n===1,
  band:level>=7?"HSK 7–9 · thực hành nâng cao":"HSK "+level+" · bài luyện tham khảo"});
}
L(1,"Xin chào và giới thiệu","Giao tiếp","我叫 + tên","Dùng 我叫 để tự giới thiệu tên; câu hỏi 叫什么名字 dùng để hỏi tên.",
 [["你好！","Xin chào!"],["我叫小安。你叫什么名字？","Tôi tên Tiểu An. Bạn tên là gì?"]],
 [["你好","nǐ hǎo","xin chào"],["叫","jiào","gọi là, tên là"],["名字","míngzi","tên"],["学生","xuésheng","học sinh"],["老师","lǎoshī","giáo viên"]],
 "Chọn câu diễn đạt “Tôi tên Tiểu An”.",["我是老师。","我叫小安。","你叫什么名字？"],1,"我叫 + tên được dùng để nói tên của mình.");
L(1,"Giới thiệu gia đình","Gia đình","这是 + danh từ","这是 dùng để giới thiệu người hoặc vật đang ở gần.",
 [["这是我妈妈。","Đây là mẹ tôi."],["你家有几口人？","Nhà bạn có mấy người?"]],
 [["妈妈","māma","mẹ"],["爸爸","bàba","bố"],["家","jiā","nhà"],["有","yǒu","có"],["谁","shéi","ai"]],
 "Câu nào có nghĩa “Đây là mẹ tôi”?",["这是我妈妈。","我没有妈妈。","妈妈在哪儿？"],0,"这是 + người/vật dùng để giới thiệu.");
L(1,"Ngày và giờ","Thời gian","现在 + 几点？","Để hỏi giờ hiện tại, dùng 现在几点？; 几 thường hỏi số lượng nhỏ.",
 [["现在几点？","Bây giờ mấy giờ?"],["现在三点。","Bây giờ ba giờ."]],
 [["今天","jīntiān","hôm nay"],["明天","míngtiān","ngày mai"],["点","diǎn","giờ (đồng hồ)"],["现在","xiànzài","bây giờ"],["几","jǐ","mấy, bao nhiêu"]],
 "Điền từ để hỏi giờ: 现在___点？",["喝","几","谁"],1,"几 + 点 dùng để hỏi mấy giờ.");
L(1,"Ăn uống cơ bản","Ăn uống","想 + động từ","想 + động từ diễn đạt ý muốn thực hiện hành động.",
 [["你想喝什么？","Bạn muốn uống gì?"],["我想喝水。","Tôi muốn uống nước."]],
 [["茶","chá","trà"],["水","shuǐ","nước"],["米饭","mǐfàn","cơm"],["喝","hē","uống"],["吃","chī","ăn"]],
 "Muốn nói “Tôi muốn uống nước”, chọn:",["我想喝水。","我吃水。","我有喝水。"],0,"想 + 喝 diễn đạt muốn uống.");
L(2,"Hỏi đường và phương hướng","Du lịch","往 + hướng + 走","往右走 có nghĩa đi về phía bên phải.",
 [["请问，车站在哪儿？","Xin hỏi, bến xe ở đâu?"],["往右走，就到了。","Đi về bên phải là tới."]],
 [["路","lù","đường"],["左","zuǒ","trái"],["右","yòu","phải"],["车站","chēzhàn","bến xe"],["近","jìn","gần"]],
 "“往右走” là hướng dẫn gì?",["Đi sang trái","Đi về bên phải","Đi thẳng mãi"],1,"右 là bên phải, 往...走 là đi về phía...");
L(2,"Thói quen hằng ngày","Sinh hoạt","每天 + hoạt động","每天 đứng đầu hoặc trong câu để chỉ hoạt động lặp lại hằng ngày.",
 [["我每天早上六点起床。","Mỗi sáng tôi dậy lúc sáu giờ."],["晚上我常常运动。","Buổi tối tôi thường tập thể dục."]],
 [["起床","qǐchuáng","thức dậy"],["每天","měitiān","mỗi ngày"],["早上","zǎoshang","buổi sáng"],["运动","yùndòng","vận động"],["晚上","wǎnshang","buổi tối"]],
 "Trong câu “我每天运动”, 每天 chỉ điều gì?",["Mỗi ngày","Ngày mai","Hôm qua"],0,"每天 biểu thị tần suất hằng ngày.");
L(2,"Mua sắm quần áo","Mua sắm","A 比 B + tính từ","Cấu trúc 比 được dùng để so sánh hai đối tượng.",
 [["这件衣服太贵了。","Bộ quần áo này đắt quá."],["那件比这件便宜。","Cái kia rẻ hơn cái này."]],
 [["便宜","piányi","rẻ"],["贵","guì","đắt"],["多少钱","duōshao qián","bao nhiêu tiền"],["颜色","yánsè","màu sắc"],["件","jiàn","lượng từ quần áo"]],
 "“那件比这件便宜” diễn đạt:",["Cái kia rẻ hơn cái này","Cái kia đắt nhất","Hai cái bằng giá"],0,"比 + tính từ dùng để so sánh.");
L(2,"Sức khỏe và nghỉ ngơi","Sức khỏe","应该 + động từ","应该 biểu thị lời khuyên hoặc điều nên làm.",
 [["我今天身体不舒服。","Hôm nay tôi không khỏe."],["你应该多休息。","Bạn nên nghỉ ngơi nhiều."]],
 [["生病","shēngbìng","bị bệnh"],["医生","yīshēng","bác sĩ"],["药","yào","thuốc"],["身体","shēntǐ","cơ thể"],["休息","xiūxi","nghỉ ngơi"]],
 "Câu nào thể hiện lời khuyên?",["你应该休息。","你已经走了。","你是谁？"],0,"应该 + động từ nghĩa là nên làm việc gì.");
L(3,"Đặt vé và đi du lịch","Du lịch","先…再…","先 nêu hành động trước; 再 nêu việc làm sau.",
 [["我们先订票，再去机场。","Chúng ta đặt vé trước, rồi đến sân bay."],["别忘了带护照。","Đừng quên mang hộ chiếu."]],
 [["旅行","lǚxíng","du lịch"],["机场","jīchǎng","sân bay"],["护照","hùzhào","hộ chiếu"],["订","dìng","đặt trước"],["地图","dìtú","bản đồ"]],
 "Trong “先订票，再去机场”, việc nào trước?",["Đến sân bay","Đặt vé","Lấy hành lý"],1,"先 đứng trước hành động thực hiện đầu tiên.");
L(3,"Học tập hiệu quả","Học tập","越来越 + tính từ","越来越 biểu thị mức độ tăng dần theo thời gian.",
 [["我的汉语越来越好了。","Tiếng Trung của tôi ngày càng tốt."],["我每天认真练习。","Tôi luyện tập nghiêm túc mỗi ngày."]],
 [["提高","tígāo","nâng cao"],["练习","liànxí","luyện tập"],["作业","zuòyè","bài tập"],["认真","rènzhēn","nghiêm túc"],["成绩","chéngjì","thành tích, điểm số"]],
 "“越来越好” nghĩa là:",["Càng ngày càng tốt","Chưa từng tốt","Tốt như trước"],0,"越来越 diễn tả thay đổi tăng dần.");
L(3,"Làm việc với đồng nghiệp","Công việc","已经…了","已经…了 thường diễn tả sự việc đã xảy ra hoặc hoàn thành.",
 [["经理已经开会了。","Quản lý đã họp rồi."],["我还没有完成报告。","Tôi vẫn chưa hoàn thành báo cáo."]],
 [["会议","huìyì","cuộc họp"],["同事","tóngshì","đồng nghiệp"],["经理","jīnglǐ","quản lý"],["迟到","chídào","đến muộn"],["完成","wánchéng","hoàn thành"]],
 "“我已经完成了” diễn đạt:",["Tôi sắp bắt đầu","Tôi đã hoàn thành","Tôi không muốn làm"],1,"已经 thường biểu thị việc đã diễn ra.");
L(3,"Bảo vệ môi trường","Môi trường","应该 + động từ","Dùng 应该 để đề xuất hành vi nên làm.",
 [["我们应该保护环境。","Chúng ta nên bảo vệ môi trường."],["请把垃圾放进垃圾桶。","Hãy bỏ rác vào thùng rác."]],
 [["环境","huánjìng","môi trường"],["垃圾","lājī","rác"],["节约","jiéyuē","tiết kiệm"],["保护","bǎohù","bảo vệ"],["干净","gānjìng","sạch"]],
 "Câu nào nói về bảo vệ môi trường?",["我们应该保护环境。","你叫什么名字？","我想喝咖啡。"],0,"保护环境 là bảo vệ môi trường.");
L(4,"Giải thích và thấu hiểu","Giao tiếp","虽然…但是…","虽然 đưa ra tình huống tương phản; 但是 nối kết quả trái chiều.",
 [["虽然我们有误会，但是可以交流。","Tuy có hiểu lầm, chúng ta vẫn có thể trao đổi."],["我想听听你的建议。","Tôi muốn nghe góp ý của bạn."]],
 [["交流","jiāoliú","giao lưu, trao đổi"],["理解","lǐjiě","hiểu"],["误会","wùhuì","hiểu lầm"],["解释","jiěshì","giải thích"],["建议","jiànyì","kiến nghị, góp ý"]],
 "Chọn cặp từ thể hiện nhượng bộ, tương phản:",["因为…所以…","虽然…但是…","只有…才…"],1,"虽然…但是… có nghĩa tuy... nhưng...");
L(4,"Học bổng và du học","Học tập","为了 + mục tiêu","为了 dùng để chỉ mục đích của một hành động.",
 [["为了申请奖学金，我准备面试。","Để xin học bổng, tôi chuẩn bị phỏng vấn."],["你的专业是什么？","Chuyên ngành của bạn là gì?"]],
 [["申请","shēnqǐng","nộp đơn, xin"],["奖学金","jiǎngxuéjīn","học bổng"],["专业","zhuānyè","chuyên ngành"],["计划","jìhuà","kế hoạch"],["面试","miànshì","phỏng vấn"]],
 "在“为了申请奖学金”中，为了 chỉ:",["Địa điểm","Mục đích","Quá khứ"],1,"为了 biểu thị mục đích.");
L(4,"Khí hậu và ô nhiễm","Môi trường","不但…而且…","Nêu hai đặc điểm hoặc tác động được bổ sung với nhau.",
 [["空气污染不但影响健康，而且影响生活。","Ô nhiễm không khí không chỉ ảnh hưởng sức khỏe mà còn ảnh hưởng đời sống."],["我们要减少浪费。","Chúng ta cần giảm lãng phí."]],
 [["气候","qìhòu","khí hậu"],["温度","wēndù","nhiệt độ"],["污染","wūrǎn","ô nhiễm"],["影响","yǐngxiǎng","ảnh hưởng"],["减少","jiǎnshǎo","giảm bớt"]],
 "“不但…而且…” tương đương:",["Không những… mà còn…","Nếu… thì…","Vì… nên…"],0,"不但…而且… thêm thông tin có cùng hướng.");
L(4,"Mua hàng trực tuyến","Mua sắm","如果…就…","Nếu điều kiện trong vế 如果 xảy ra thì vế 就 thể hiện kết quả.",
 [["如果质量有问题，就可以退货。","Nếu chất lượng có vấn đề thì có thể trả hàng."],["先看看其他人的评价。","Hãy xem đánh giá của người khác trước."]],
 [["网购","wǎnggòu","mua sắm trực tuyến"],["质量","zhìliàng","chất lượng"],["价格","jiàgé","giá cả"],["退货","tuìhuò","trả hàng"],["评价","píngjià","đánh giá"]],
 "“如果…就…” thể hiện quan hệ gì?",["Tương phản","Điều kiện và kết quả","Liệt kê"],1,"如果 có nghĩa nếu, 就 nối kết quả.");
L(5,"Phỏng vấn và nghề nghiệp","Công việc","既然…就…","既然 nêu tiền đề đã biết; 就 dẫn tới cách xử lý.",
 [["既然你有经验，就试试这份工作吧。","Vì bạn đã có kinh nghiệm, hãy thử công việc này."],["请介绍一下你的简历。","Hãy giới thiệu sơ lược hồ sơ của bạn."]],
 [["求职","qiúzhí","tìm việc"],["简历","jiǎnlì","sơ yếu lý lịch, CV"],["经验","jīngyàn","kinh nghiệm"],["责任","zérèn","trách nhiệm"],["机会","jīhuì","cơ hội"]],
 "Từ “简历” liên quan trực tiếp tới:",["Hồ sơ xin việc","Thực đơn","Vé tàu"],0,"简历 dùng khi nộp hồ sơ hoặc phỏng vấn.");
L(5,"Phong tục và văn hóa","Văn hóa","无论…都…","Nhấn mạnh kết quả không thay đổi dù điều kiện ra sao.",
 [["无论来自哪里，我们都应该互相尊重。","Dù đến từ đâu, chúng ta đều nên tôn trọng nhau."],["春节是重要的传统节日。","Tết xuân là một ngày lễ truyền thống quan trọng."]],
 [["传统","chuántǒng","truyền thống"],["习俗","xísú","phong tục"],["节日","jiérì","ngày lễ"],["尊重","zūnzhòng","tôn trọng"],["文化","wénhuà","văn hóa"]],
 "Cấu trúc 无论…都… nghĩa gần nhất:",["Chỉ khi… mới…","Bất kể… đều…","Sau khi… thì…"],1,"无论 nêu điều kiện bất kỳ, 都 nêu kết quả nhất quán.");
L(5,"Lập ngân sách và quyết định","Tiếng Trung thương mại","与其…不如…","Dùng để nêu lựa chọn được ưu tiên hơn giữa hai phương án.",
 [["与其盲目投资，不如先分析风险。","Thay vì đầu tư mù quáng, tốt hơn hãy phân tích rủi ro trước."],["我们必须控制预算。","Chúng ta phải kiểm soát ngân sách."]],
 [["预算","yùsuàn","ngân sách"],["风险","fēngxiǎn","rủi ro"],["收入","shōurù","thu nhập"],["支出","zhīchū","chi tiêu"],["决策","juécè","quyết định"]],
 "“与其A，不如B” ưu tiên lựa chọn nào?",["A","B","Không lựa chọn nào"],1,"不如 nêu phương án được coi là tốt hơn.");
L(5,"Tin tức và thông tin","Đọc hiểu","根据 + căn cứ","根据 dẫn nguồn thông tin làm cơ sở cho nhận định.",
 [["根据调查，这条消息还没有证据。","Theo khảo sát, thông tin này vẫn chưa có bằng chứng."],["阅读时要分清事实和观点。","Khi đọc cần phân biệt sự thật và quan điểm."]],
 [["网络","wǎngluò","mạng"],["信息","xìnxī","thông tin"],["传播","chuánbō","lan truyền"],["观点","guāndiǎn","quan điểm"],["证据","zhèngjù","bằng chứng"]],
 "“根据报告” nghĩa là:",["Trước bản báo cáo","Theo bản báo cáo","Không có báo cáo"],1,"根据 dùng để dẫn căn cứ.");
L(6,"Chuỗi cung ứng và logistics","Tiếng Trung thương mại","由于…因此…","Nêu nguyên nhân rồi suy ra kết quả theo văn phong trang trọng.",
 [["由于运输延误，因此库存不足。","Do vận chuyển chậm trễ nên tồn kho không đủ."],["我们需要提高物流效率。","Chúng ta cần nâng cao hiệu suất logistics."]],
 [["供应链","gōngyìngliàn","chuỗi cung ứng"],["运输","yùnshū","vận chuyển"],["库存","kùcún","hàng tồn kho"],["效率","xiàolǜ","hiệu suất"],["延误","yánwù","trì hoãn"]],
 "“库存不足” nghĩa là:",["Dư thừa hàng","Thiếu hàng tồn kho","Hết chi phí"],1,"库存 là hàng tồn, 不足 là không đủ.");
L(6,"Dữ liệu và nghiên cứu","Học thuật","不仅…还…","Liên kết hai tác động hoặc đặc điểm cùng hướng.",
 [["调查不仅收集数据，还需要分析结果。","Khảo sát không chỉ thu thập dữ liệu mà còn cần phân tích kết quả."],["结论必须有可靠的证据。","Kết luận phải có bằng chứng đáng tin."]],
 [["调查","diàochá","khảo sát, điều tra"],["数据","shùjù","dữ liệu"],["分析","fēnxī","phân tích"],["假设","jiǎshè","giả thuyết"],["结论","jiélùn","kết luận"]],
 "Cặp 不仅…还… diễn tả:",["Không chỉ… mà còn…","Vì… nên…","Chỉ khi… mới…"],0,"不仅…还… biểu thị bổ sung ý.");
L(6,"Phát triển bền vững","Môi trường","与此同时","Dùng để nối hai sự việc diễn ra cùng lúc hoặc cùng bối cảnh.",
 [["企业采取减排措施，与此同时提高资源利用率。","Doanh nghiệp áp dụng biện pháp giảm phát thải, đồng thời nâng hiệu quả sử dụng tài nguyên."],["我们需要保护生态环境。","Chúng ta cần bảo vệ môi trường sinh thái."]],
 [["可持续","kě chí xù","bền vững"],["资源","zīyuán","tài nguyên"],["生态","shēngtài","sinh thái"],["措施","cuòshī","biện pháp"],["减排","jiǎnpái","giảm phát thải"]],
 "“与此同时” nghĩa gần nhất:",["Đồng thời","Ngay hôm qua","Sau nhiều năm"],0,"与此同时 nối hai hành động hoặc sự việc đồng thời.");
L(6,"Lập luận và phản biện","Học thuật","之所以…是因为…","Nêu hiện tượng rồi chỉ ra nguyên nhân giải thích cho hiện tượng ấy.",
 [["我之所以不同意，是因为论据不充分。","Sở dĩ tôi không đồng ý vì luận cứ chưa đầy đủ."],["请说明你的立场和逻辑。","Hãy nêu lập trường và logic của bạn."]],
 [["论点","lùndiǎn","luận điểm"],["论据","lùnjù","luận cứ"],["反驳","fǎnbó","phản bác"],["立场","lìchǎng","lập trường"],["逻辑","luójí","logic"]],
 "Trong câu “之所以…是因为…”, vế sau nêu gì?",["Nguyên nhân","Thời gian","Mệnh lệnh"],0,"是因为 dùng để giải thích nguyên nhân.");
L(7,"Đàm phán hợp đồng","HSK 7–9 · Thương mại","只有…才…","Chỉ khi điều kiện được đáp ứng thì kết quả mới khả thi.",
 [["只有双方充分协商，才能达成协议。","Chỉ khi hai bên bàn bạc đầy đủ mới đạt được thỏa thuận."],["我们需要重新审查合同条款。","Chúng ta cần rà soát lại điều khoản hợp đồng."]],
 [["谈判","tánpàn","đàm phán"],["条款","tiáokuǎn","điều khoản"],["合同","hétóng","hợp đồng"],["协商","xiéshāng","thương lượng"],["妥协","tuǒxié","thỏa hiệp"]],
 "“只有A，才B” diễn tả:",["A là điều kiện cần cho B","A và B không liên quan","B xảy ra trước A"],0,"只有…才… nêu điều kiện cần.");
L(7,"Văn hóa và ngữ cảnh","HSK 7–9 · Đọc hiểu","即使…也…","Nhấn mạnh kết quả vẫn xảy ra ngay cả khi gặp điều kiện bất lợi.",
 [["即使时代变化，文化传统也值得研究。","Dù thời đại thay đổi, truyền thống văn hóa vẫn đáng nghiên cứu."],["理解作品要考虑历史语境。","Hiểu tác phẩm cần xét ngữ cảnh lịch sử."]],
 [["典籍","diǎnjí","thư tịch cổ"],["传承","chuánchéng","kế thừa, truyền lại"],["语境","yǔjìng","ngữ cảnh"],["诠释","quánshì","diễn giải"],["象征","xiàngzhēng","biểu tượng"]],
 "“语境” trong đọc hiểu nghĩa là:",["Ngữ cảnh","Đáp án","Thời hạn"],0,"语境 là hoàn cảnh ngôn ngữ cần xét khi hiểu lời nói hoặc văn bản.");
L(8,"Đánh giá chính sách","HSK 7–9 · Học thuật","鉴于 + bối cảnh","鉴于 thường nêu tình huống hoặc căn cứ làm cơ sở cho quyết định.",
 [["鉴于评估结果，我们调整了实施方案。","Xét kết quả đánh giá, chúng tôi điều chỉnh phương án thực hiện."],["政策的长期效应需要持续观察。","Tác động dài hạn của chính sách cần được theo dõi liên tục."]],
 [["政策","zhèngcè","chính sách"],["实施","shíshī","triển khai"],["评估","pínggū","đánh giá"],["效应","xiàoyìng","hiệu ứng, tác động"],["利益相关者","lìyì xiāngguān zhě","bên liên quan"]],
 "“鉴于评估结果” gần nghĩa nhất:",["Xét kết quả đánh giá","Bỏ qua đánh giá","Thay vì đánh giá"],0,"鉴于 dẫn căn cứ, thường gặp trong văn bản trang trọng.");
L(8,"Lập luận phản biện chuyên sâu","HSK 7–9 · Viết luận","尽管…仍然…","Thể hiện kết quả vẫn giữ nguyên dù có trở ngại hoặc phản đề.",
 [["尽管存在不同观点，我们仍然重视实证证据。","Dù có các quan điểm khác nhau, chúng tôi vẫn coi trọng bằng chứng thực chứng."],["论证要避免逻辑偏见。","Lập luận cần tránh thiên kiến logic."]],
 [["论证","lùnzhèng","luận chứng"],["推理","tuīlǐ","suy luận"],["前提","qiántí","tiền đề"],["偏见","piānjiàn","định kiến"],["反例","fǎnlì","phản ví dụ"]],
 "“反例” được dùng trong tranh luận để chỉ:",["Ví dụ phản chứng","Lời chào","Đoạn kết"],0,"反例 là ví dụ phản bác một mệnh đề tổng quát.");
L(9,"Nghiên cứu liên ngành","HSK 7–9 · Học thuật","在…前提下","Trình bày một hành động hoặc kết luận dưới điều kiện, tiền đề nhất định.",
 [["在数据可靠的前提下，才能作出合理推断。","Khi dữ liệu đáng tin cậy, ta mới có thể suy luận hợp lý."],["跨学科研究需要明确方法论。","Nghiên cứu liên ngành cần phương pháp luận rõ ràng."]],
 [["跨学科","kuà xuékē","liên ngành"],["方法论","fāngfǎlùn","phương pháp luận"],["实证","shízhèng","thực chứng"],["变量","biànliàng","biến số"],["可靠性","kěkàoxìng","độ tin cậy"]],
 "“可靠性” nghĩa là gì?",["Độ tin cậy","Tốc độ","Trình tự"],0,"可靠性 là tính hoặc độ đáng tin cậy.");
L(9,"Diễn thuyết và lập luận","HSK 7–9 · Khẩu ngữ","倘若…则…","Cách nói trang trọng của “nếu… thì…”, thường gặp trong lập luận.",
 [["倘若缺乏共识，则需要进一步讨论。","Nếu thiếu đồng thuận thì cần thảo luận thêm."],["好的论述应兼顾逻辑与修辞。","Bài trình bày tốt nên kết hợp logic và tu từ."]],
 [["修辞","xiūcí","tu từ"],["论述","lùnshù","trình bày lập luận"],["辩证","biànzhèng","biện chứng"],["内涵","nèihán","hàm nghĩa"],["共识","gòngshí","đồng thuận"]],
 "“倘若…则…” trong văn phong trang trọng biểu thị:",["Giả định và kết quả","Liệt kê thời gian","Trình tự nét viết"],0,"倘若…则… có nghĩa nếu… thì….");

const grouped={};for(const l of lessons){(grouped[l.level]||=[]).push(l);}
window.HSK_STUDY_CONTENT=Object.freeze({
  version:"HSK-PANDA-ORIGINAL-2026-11-22",
  copyright:"Bài học, hội thoại và câu hỏi tự biên soạn; không sao chép đề HSK hay nội dung sách trên Drive.",
  note:"Nội dung tham khảo theo chủ đề từ các thư mục giáo trình HSK1–6, ngữ pháp, HSKK, thương mại và HSK7–9 trong Drive. Đây KHÔNG phải bộ từ vựng chính thức hoặc đề thi thật.",
  levels:[1,2,3,4,5,6,7,8,9],
  lessons,grouped
});
})();