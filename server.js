const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(__dirname,"public")));
app.use("/api/",rateLimit({windowMs:60000,limit:20}));
app.get("/api/health",(_req,res)=>res.json({ok:true,configured:!!KEY,model:MODEL}));
app.post("/api/chat",async(req,res)=>{
 try {
  if(!KEY)return res.status(503).json({error:"Add OPENAI_API_KEY in Render environment variables."});
  const messages=req.body?.messages;
  if(!Array.isArray(messages)||!messages.length||messages.length>40)return res.status(400).json({error:"Invalid message list."});
  const safe=messages.map(m=>{
   if(!m||!["user","assistant"].includes(m.role)||typeof m.content!=="string")throw new Error("Invalid message.");
   return {role:m.role,content:m.content.slice(0,12000)};
  });
  const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+KEY,"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,messages:safe,temperature:0.7})});
  const data=await r.json();
  if(!r.ok)return res.status(r.status).json({error:data?.error?.message||"AI provider error."});
  res.json({reply:data.choices?.[0]?.message?.content||"No response generated."});
 } catch(e){res.status(400).json({error:e.message||"Request failed."});}
});
app.get("*",(_req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log("MyGPT running on "+PORT));