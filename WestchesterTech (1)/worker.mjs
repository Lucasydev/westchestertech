const allowedRoles = new Set(["student", "club", "mentor", "sponsor", "hackathon"]);
const limits = {name:80, email:254, role:20, organization:120, message:1200};
const saveInterest = `INSERT INTO interests (email,role,name,organization,message)
  VALUES (?,?,?,?,?) ON CONFLICT(email,role) DO UPDATE SET name=excluded.name,
  organization=excluded.organization, message=excluded.message, updated_at=CURRENT_TIMESTAMP`;
function result(code, value) {
  return Response.json(value,{status:code,headers:{"Cache-Control":"no-store"}});
}
async function receive(request, env) {
  if(request.method !== "POST")return new Response(null,{status:405,headers:{Allow:"POST"}});
  if(request.headers.get("Origin") !== new URL(request.url).origin)return result(403,{error:"Open this form on the WestchesterTech site."});
  if(request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json")return result(415,{error:"Send the form as JSON."});
  const reader=request.body?.getReader();
  if(!reader)return result(400,{error:"Please complete the interest form."});
  const chunks=[];
  let size=0;
  for(;;){
    const {done,value}=await reader.read();
    if(done)break;
    size+=value.byteLength;
    if(size>12000){await reader.cancel();return result(413,{error:"Your form is too long."})}
    chunks.push(value);
  }
  let input;
  try{input=JSON.parse(await new Blob(chunks).text())}catch{return result(400,{error:"Please check the form and try again."})}
  if(!input||typeof input!=="object"||Array.isArray(input))return result(400,{error:"Invalid form."});
  const data={};
  for(const [field,max] of Object.entries(limits)){
    const v=input[field]??"";
    if(typeof v!=="string"||v.trim().length>max)return result(400,{error:"Please check the "+field+" field."});
    data[field]=v.trim();
  }
  if(!data.name||!allowedRoles.has(data.role)||!/^\S+@[^@\s]+\.[^@\s]+$/.test(data.email)||data.email.split("@").length!==2)
    return result(400,{error:"Please enter a name, valid email address, and role."});
  try{
    await env.DB.prepare(saveInterest).bind(data.email.toLowerCase(),data.role,data.name,data.organization,data.message).run();
    return result(201,{ok:true});
  }catch{return result(503,{error:"Saving is temporarily unavailable. Please try again."})}
}
export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    if(url.pathname==="/api/interests")return receive(request,env);
    if(request.method!=="GET"&&request.method!=="HEAD")return new Response(null,{status:405,headers:{Allow:"GET, HEAD"}});
    const key=url.pathname==="/"?"/index.html":url.pathname;
    const asset=Object.hasOwn(WEB_FILES,key)?WEB_FILES[key]:null;
    if(!asset)return new Response("Page not found",{status:404});
    const body=request.method==="HEAD"?null:Uint8Array.from(atob(asset.body),ch=>ch.charCodeAt(0));
    return new Response(body,{headers:{"Content-Type":asset.type,"X-Content-Type-Options":"nosniff"}});
  }
};
