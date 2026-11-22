(function(){
"use strict";
function sanitize(s){return String(s||"").replace(/\u2028|\u2029/g," ").replace(/\s+/g," ").trim();}
function isPOS(s){return /^(Danh|Động|Tính|Giới|Phó|Lượng|Số|Trợ|Đại|Thán|Hậu|Tiền|Liên|Số lượng|Định|Hình|Từ|động|tính|lượng|giới|phó|trợ|Thành|Quán|Cấu|Chỉ|Loại|Hư)/.test(s);}
function parse(text,opts){
 var lines=String(text).replace(/\r/g,"").split("\n"),expected=opts.expected,rows=[],row=null,duplicates=[],errors=[];
 for(var i=0;i<lines.length;i++){
  var line=lines[i],m=line.match(/^\s*(\d{1,5})\s{2,}(.*)$/);
  if(!m||Number(m[1])<1||Number(m[1])>expected){if(row)row.lines.push(line);continue;}
  var n=Number(m[1]),data=m[2];
  // Certain printed 3-digit indexes are broken across two narrow PDF columns.
  if(opts.level===1&&n===11&&data.match(/^\s*4\s{2,}零/))n=114;
  if(opts.level===1&&n===11&&data.match(/^\s*5\s{2,}六/))n=115;
  if(row)rows.push(row);
  row={n:n,raw:data,lines:[],start:i};
 }
 if(row)rows.push(row);
 var result=[];
 for(var r=0;r<rows.length;r++){
  var rec=rows[r],parts=rec.raw.trim().split(/\s{2,}/).map(sanitize),
      han=parts[0]||"",pin=parts[1]||"",pos="",mean="",quality=[];
  if(parts.length>=3){
    if(isPOS(parts[2])){pos=parts[2];mean=parts.slice(3).join(" ");}
    else mean=parts.slice(2).join(" ");
  }
  // If the Chinese characters are positioned on the line before the row number,
  // recover them without guessing another entry or joining adjacent vocabulary.
  if(!/[\u3400-\u9fff]/.test(han)){
   var earlier=lines.slice(Math.max((rows[r-1]?.start||0)+1,rec.start-8),rec.start).reverse();
   for(var prev of earlier){var m=prev.match(/^\s{3,17}([\u3400-\u9fff]{1,8}[¹²³0-9]?)\s*$/);if(m){han=m[1];break;}}
   if(han===parts[0]||!/[\u3400-\u9fff]/.test(han))quality.push("han-missing");
   if(parts.length===2){pin=parts[0];if(isPOS(parts[1]))pos=parts[1];else mean=parts[1];}
  }
  for(var ln of rec.lines){
   var t=sanitize(ln),indent=ln.search(/\S/);
   if(!t||/^<PARSED|^STT\b|^Các từ highlight|^HSK\d|^PREP|^Đăng ký lộ trình|^Từ vựng HSK|^Danh sách, pinyin|^Nghĩa tiếng Việt|^Áp dụng:|^Biên soạn|^Theo đề cương|^Số từ:|^Chữ số nhỏ|^loại trong ngoặc/.test(t))continue;
   if(indent>=53){mean+=(mean?" ":"")+t;}
   else if(indent>=37){pos+=(pos?" ":"")+t;}
   else if(indent>=17){
     // The PDF sometimes wraps pinyin on an extra line.
     if(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüa-zA-Z\u0300-\u036fˇ\s-]+$/i.test(t)&&!isPOS(t)){pin+=(pin?"":"")+t;}
   }
   else if(indent>=0&&indent<=16&&/^[\u3400-\u9fff]+$/.test(t)&&!/[\u3400-\u9fff]/.test(han)){han=t;}
  }
  han=sanitize(han);pin=sanitize(pin).replace(/([a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜǹḿ])\s+(?=[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜǹḿ])/gi,"$1").normalize("NFC");
  pos=sanitize(pos);mean=sanitize(mean);
  if(!/[\u3400-\u9fff]/.test(han))quality.push("han-missing");
  if(!/^[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüǹḿ][a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüǹḿ\u0300-\u036fˇ'’\s-]*$/i.test(pin))quality.push("pinyin-suspect");
  if(!mean||mean.length<2)quality.push("meaning-missing");
  if(mean.length>360)mean=mean.slice(0,357)+"…";
  var word={n:rec.n,h:han,p:pin,kind:pos,v:mean,source:"PREP",flags:Array.from(new Set(quality))};
  result.push(word);
 }
 var nums=new Set(result.map(x=>x.n)),missing=[];
 for(var id=1;id<=expected;id++)if(!nums.has(id))missing.push(id);
 var unique=new Set(),valid=[],excluded=[];
 for(var w of result){
   if(unique.has(w.n)){duplicates.push(w.n);continue;}unique.add(w.n);
   if(w.flags.includes("han-missing")||w.flags.includes("meaning-missing"))excluded.push(w);
   else valid.push(w);
 }
 return {valid,excluded,missing,duplicates,all:result.length,expected,source:opts.level};
}
return {parse};
})