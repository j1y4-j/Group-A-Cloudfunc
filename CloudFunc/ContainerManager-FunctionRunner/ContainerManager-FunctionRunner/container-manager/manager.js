
const express = require("express");
const Docker = require("dockerode");
const fetch = global.fetch;

const app = express();
const docker = new Docker();
app.use(express.json());

const PORT = 4000;
const CONTAINER_NAME = "function-runner-instance";

async function getContainer() {
  const list = await docker.listContainers({all:true});
  return list.find(c => c.Names.includes("/"+CONTAINER_NAME));
}

app.post("/execute", async (req,res)=>{
  const { image, payload } = req.body;
  if(!image || !payload) return res.status(400).json({error:"image and payload required"});

  try{
    let info = await getContainer();
    let container;

    if(!info){
      container = await docker.createContainer({
        Image: image,
        name: CONTAINER_NAME,
        ExposedPorts: {"3000/tcp":{}},
        HostConfig:{ PortBindings:{ "3000/tcp":[{HostPort:"3000"}] } }
      });
      await container.start();
    } else if(info.State !== "running"){
      container = docker.getContainer(info.Id);
      await container.start();
    }

    const resp = await fetch("http://localhost:3000/run",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    res.json({ success:true, functionResponse:data });

  }catch(e){
    res.status(500).json({ error:e.message });
  }
});

app.listen(PORT,"0.0.0.0",()=>{
  console.log(`Container Manager running on port ${PORT}`);
});
