
const express = require("express");
const app = express();

app.use(express.json());

const operations = {
  hello: ({ name }) => {
  if (!name) {
    return "Hello! Welcome to CloudFunc 🚀";
  }
  return `Hello ${name}! Welcome to CloudFunc 🚀`;
},

  sum: ({ numbers }) => numbers.reduce((a,b)=>a+b,0),
  multiply: ({ numbers }) => numbers.reduce((a,b)=>a*b,1),
  uppercase: ({ text }) => text.toUpperCase(),
  reverse: ({ text }) => text.split("").reverse().join(""),
  wordCount: ({ text }) => text.trim().split(/\s+/).length,
  sortNumbers: ({ numbers }) => [...numbers].sort((a,b)=>a-b),
  filterEven: ({ numbers }) => numbers.filter(n=>n%2===0),
  mergeObjects: ({ objects }) => Object.assign({}, ...objects),
  delay: async ({ time }) => {
    await new Promise(r => setTimeout(r, time || 1000));
    return `Delayed for ${time||1000} ms`;
  }
};

app.post("/run", async (req,res)=>{
  try{
    const { action, ...payload } = req.body;
    if(!action) return res.status(400).json({error:"action is required"});
    if(!operations[action]) return res.status(400).json({error:"unsupported action"});
    const result = await operations[action](payload);
    res.json({ success:true, action, result });
  }catch(e){
    res.status(400).json({ success:false, error:e.message });
  }
});

app.listen(3000,"0.0.0.0",()=>{
  console.log("Function Runner running on port 3000");
});
