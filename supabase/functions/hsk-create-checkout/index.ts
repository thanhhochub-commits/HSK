// HSK Panda legacy 2K checkout — permanently retired.
// Already-paid trials remain readable from hsk-guest-status to their expiry.
const headers={
 "Access-Control-Allow-Origin":"https://thanhhochub-commits.github.io",
 "Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info",
 "Access-Control-Allow-Methods":"POST,OPTIONS",
 "Content-Type":"application/json",
};
Deno.serve((req)=>{
 if(req.method==="OPTIONS")return new Response("",{headers});
 return new Response(JSON.stringify({error:"Gói thử 2.000đ đã ngừng bán. Vui lòng chọn gói Pro 30, 90 hoặc 365 ngày."}),{
  status:410,headers
 });
});