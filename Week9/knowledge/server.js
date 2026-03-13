const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = 'nodes.json';

// 获取所有节点
app.get('/nodes', (req,res)=>{
  if(!fs.existsSync(DATA_FILE)) return res.json([]);
  const data=JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
  res.json(data);
});

// 新增节点
app.post('/nodes', (req,res)=>{
  const node=req.body;
  let data=[];
  if(fs.existsSync(DATA_FILE)) data=JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
  data.push(node);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2));
  res.json({status:'ok'});
});

const PORT=3000;
app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));
