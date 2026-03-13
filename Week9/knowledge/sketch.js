new p5((p)=>{
  class Node {
    constructor(id, title, content){
      this.id = id;
      this.title = title;
      this.content = content;
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p5.Vector.random2D().mult(0.5);
      this.radius = 20;
      this.dragging = false;
    }

    update(){
      if(!this.dragging){
        this.pos.add(this.vel);
        if(this.pos.x < this.radius || this.pos.x > p.width-this.radius) this.vel.x*=-1;
        if(this.pos.y < this.radius || this.pos.y > p.height-this.radius) this.vel.y*=-1;
      }
    }

    display(highlight=false){
      p.noStroke();
      if(highlight) p.fill(255, 180, 50, 220);
      else p.fill(100, 200, 255, 180);
      p.ellipse(this.pos.x, this.pos.y, this.radius*2);

      // 悬停显示内容
      if(p.dist(p.mouseX,p.mouseY,this.pos.x,this.pos.y)<this.radius){
        p.fill(255);
        p.textSize(12);
        p.text(this.title, this.pos.x+this.radius+5, this.pos.y);
        p.textSize(10);
        p.text(this.content, this.pos.x+this.radius+5, this.pos.y+14);
      }
    }

    isMouseOver(){
      return p.dist(p.mouseX,p.mouseY,this.pos.x,this.pos.y)<this.radius;
    }
  }

  let nodes = [];
  let edges = []; // 保存连线关系
  let nodeId = 0;
  let draggedNode = null;
  let firstClickNode = null;

  p.setup = function(){
    const cnv = p.createCanvas(window.innerWidth, window.innerHeight);
    cnv.parent('container');
    p.textFont('Arial');
    p.textAlign(p.LEFT, p.TOP);
  }

  p.draw = function(){
    p.background(10);

    // 绘制连线
    p.stroke(255,40);
    for(let e of edges){
      let a = nodes.find(n=>n.id===e[0]);
      let b = nodes.find(n=>n.id===e[1]);
      if(a && b) p.line(a.pos.x,a.pos.y,b.pos.x,b.pos.y);
    }

    // 高亮搜索节点
    let searchText = document.getElementById('searchNode').value.trim().toLowerCase();

    for(let n of nodes){
      n.update();
      let highlight = searchText && (n.title.toLowerCase().includes(searchText) || n.content.toLowerCase().includes(searchText));
      n.display(highlight);
    }
  }

  document.getElementById('addNodeBtn').addEventListener('click',()=>{
    const title = document.getElementById('nodeTitle').value.trim();
    const content = document.getElementById('nodeContent').value.trim();
    if(!title) return;
    nodes.push(new Node(nodeId++, title, content));
    document.getElementById('nodeTitle').value="";
    document.getElementById('nodeContent').value="";
  });

  // 点击建立关系
  p.mousePressed = function(){
    for(let n of nodes){
      if(n.isMouseOver()){
        draggedNode = n;
        n.dragging = true;

        if(firstClickNode && firstClickNode !== n){
          edges.push([firstClickNode.id, n.id]);
          firstClickNode = null;
        } else firstClickNode = n;

        break;
      }
    }
  }

  p.mouseDragged = function(){
    if(draggedNode){
      draggedNode.pos.x = p.mouseX;
      draggedNode.pos.y = p.mouseY;
    }
  }

  p.mouseReleased = function(){
    if(draggedNode){
      draggedNode.dragging = false;
      draggedNode = null;
    }
  }

  p.windowResized = function(){
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  }

  // 保存 JSON
  document.getElementById('saveBtn').addEventListener('click',()=>{
    const data = {
      nodes: nodes.map(n=>({id:n.id,title:n.title,content:n.content,pos:{x:n.pos.x,y:n.pos.y}})),
      edges: edges
    };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // 导入 JSON
  document.getElementById('loadBtn').addEventListener('click',()=>{
    document.getElementById('fileInput').click();
  });

  document.getElementById('fileInput').addEventListener('change',(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt){
      try{
        const data = JSON.parse(evt.target.result);
        nodes = data.nodes.map(n=>{ 
          const node = new Node(n.id,n.title,n.content); 
          node.pos = p.createVector(n.pos.x,n.pos.y); 
          return node; 
        });
        edges = data.edges || [];
        nodeId = nodes.length ? Math.max(...nodes.map(n=>n.id))+1 : 0;
      } catch(err){ console.error(err); }
    };
    reader.readAsText(file);
  });
});

