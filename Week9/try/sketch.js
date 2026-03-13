new p5((p) => {
  class FlowField {
    constructor(cols, rows, scale) {
      this.cols = cols; this.rows = rows; this.scale = scale;
      this.field = new Array(cols * rows); this.zoff = 0;
      for (let i=0;i<this.field.length;i++) this.field[i]=p.createVector(0,0);
    }
    update(noiseScale,strength){
      for(let i=0;i<this.cols;i++){
        for(let j=0;j<this.rows;j++){
          const idx=j*this.cols+i;
          const angle=p.noise(i*noiseScale,j*noiseScale,this.zoff)*p.TWO_PI*2;
          this.field[idx].set(p.cos(angle)*strength,p.sin(angle)*strength);
        }
      }
      this.zoff+=0.002;
    }
    lookup(pos){
      const col=Math.floor(p.constrain(pos.x/this.scale,0,this.cols-1));
      const row=Math.floor(p.constrain(pos.y/this.scale,0,this.rows-1));
      return this.field[row*this.cols+col].copy();
    }
    disturb(x,y,magnitude){
      const col=Math.floor(p.constrain(x/this.scale,0,this.cols-1));
      const row=Math.floor(p.constrain(y/this.scale,0,this.rows-1));
      const radius=2;
      for(let i=-radius;i<=radius;i++){
        for(let j=-radius;j<=radius;j++){
          const c=col+i, r=row+j;
          if(c>=0&&r>=0&&c<this.cols&&r<this.rows){
            const idx=r*this.cols+c;
            const angle=p.random(p.TWO_PI);
            this.field[idx].add(p.createVector(p.cos(angle),p.sin(angle)).mult(magnitude));
          }
        }
      }
    }
    draw(){
      p.stroke(255,30);
      for(let i=0;i<this.cols;i++){
        for(let j=0;j<this.rows;j++){
          const idx=j*this.cols+i, v=this.field[idx];
          const x=i*this.scale+this.scale*0.5, y=j*this.scale+this.scale*0.5;
          p.push(); p.translate(x,y); p.rotate(v.heading()); p.line(0,0,this.scale*0.4,0); p.pop();
        }
      }
    }
  }

  class Agent {
    constructor(id,x,y,r=6){this.id=id; this.pos=p.createVector(x,y); this.vel=p.createVector(p.random(-1,1),p.random(-1,1)); this.acc=p.createVector(0,0); this.radius=r; this.maxSpeed=p.random(1,3); this.maxForce=0.12;}
    applyForce(f){this.acc.add(f);}
    interact(others,strength){
      const perception=60; let steer=p.createVector(0,0); let total=0;
      for(let o of others){if(o===this)continue;const d=p.dist(this.pos.x,this.pos.y,o.pos.x,o.pos.y); if(d<perception){let diff=p5.Vector.sub(this.pos,o.pos); diff.normalize(); diff.div(d); steer.add(diff); total++;}}
      if(total>0){steer.div(total); steer.setMag(this.maxSpeed); steer.sub(this.vel); steer.limit(this.maxForce); steer.mult(strength); this.applyForce(steer);}
    }
    follow(flow,strength){const desired=flow.lookup(this.pos).mult(strength); const steer=p5.Vector.sub(desired,this.vel); steer.limit(this.maxForce*2); this.applyForce(steer);}
    edges(){if(this.pos.x>p.width+10)this.pos.x=-10;if(this.pos.x<-10)this.pos.x=p.width+10;if(this.pos.y>p.height+10)this.pos.y=-10;if(this.pos.y<-10)this.pos.y=p.height+10;}
    update(){this.vel.add(this.acc); this.vel.limit(this.maxSpeed); this.pos.add(this.vel); this.acc.mult(0);}
    display(){p.noStroke(); p.fill(255); p.ellipse(this.pos.x,this.pos.y,this.radius*2.2);}
  }

  class System {
    constructor(){this.agents=[]; this.flow=null; this.nextId=0;}
    init(numAgents,fieldScale){this.agents=[]; this.nextId=0; for(let i=0;i<numAgents;i++) this.addAgent(p.random(p.width),p.random(p.height)); this.flow=new FlowField(Math.ceil(p.width/fieldScale),Math.ceil(p.height/fieldScale),fieldScale);}
    addAgent(x,y){const a=new Agent(this.nextId++,x,y,p.random(4,10)); this.agents.push(a); return a;}
    update(params,mouseDown){
      this.flow.update(params.noiseScale,params.flowStrength);
      for(let a of this.agents) a.follow(this.flow,params.flowStrength);
      for(let a of this.agents){a.interact(this.agents,params.interactionStrength); a.update(); a.edges();}
      if(mouseDown){const m=p.createVector(p.mouseX,p.mouseY); for(let a of this.agents){const d=p.dist(a.pos.x,a.pos.y,m.x,m.y); if(d<160){const f=p5.Vector.sub(m,a.pos).setMag(0.6*(1-d/160)); a.applyForce(f); this.flow.disturb(m.x,m.y,0.2);}}}
    }
    draw(showField,showLinks){
      if(showField) this.flow.draw();
      if(showLinks){p.stroke(255,30); for(let i=0;i<this.agents.length;i++){for(let j=i+1;j<this.agents.length;j++){const a=this.agents[i],b=this.agents[j];const d=p.dist(a.pos.x,a.pos.y,b.pos.x,b.pos.y); if(d<120){p.strokeWeight(p.map(d,0,120,1.8,0.05)); p.line(a.pos.x,a.pos.y,b.pos.x,b.pos.y);}}}}
      for(let a of this.agents) a.display();
    }
  }

  let sys; 
  let params={numAgents:80,noiseScale:0.01,flowStrength:1.2,interactionStrength:0.9,showField:true,showLinks:true};
  let paused=false, mouseDown=false;

  p.setup=function(){
    const container=document.getElementById('container');
    const cnv=p.createCanvas(window.innerWidth,window.innerHeight);
    cnv.parent('container'); p.pixelDensity(1);
    sys=new System(); sys.init(params.numAgents,28);
    bindUI(); p.background(10);
  }

  p.draw=function(){
    if(paused) return; p.background(10);
    sys.update(params,mouseDown);
    sys.draw(params.showField,params.showLinks);
  }

  p.mousePressed=function(){
    if(p.mouseX>=0&&p.mouseX<=p.width&&p.mouseY>=0&&p.mouseY<=p.height){sys.addAgent(p.mouseX,p.mouseY); mouseDown=true;}
  }

  p.mouseReleased=function(){mouseDown=false;}

  p.windowResized=function(){p.resizeCanvas(window.innerWidth,window.innerHeight); const fs=sys.flow.scale; sys.flow=new FlowField(Math.ceil(p.width/fs),Math.ceil(p.height/fs),fs);}

  function bindUI(){
    const numAgents=document.getElementById('numAgents'),
          noiseScale=document.getElementById('noiseScale'),
          flowStrength=document.getElementById('flowStrength'),
          interaction=document.getElementById('interaction'),
          showField=document.getElementById('showField'),
          showLinks=document.getElementById('showLinks'),
          addAgentBtn=document.getElementById('addAgentBtn'),
          resetBtn=document.getElementById('resetBtn'),
          collapseBtn=document.getElementById('collapseBtn'),
          uiPanel=document.getElementById('uiPanel');
    let collapsed=false;

    collapseBtn.addEventListener('click',()=>{
      collapsed=!collapsed;
      if(collapsed){uiPanel.classList.add('collapsed'); collapseBtn.innerHTML='&#9654;';}
      else{uiPanel.classList.remove('collapsed'); collapseBtn.innerHTML='&#9664;';}
    });

    document.getElementById('numAgentsLabel').textContent=numAgents.value;
    document.getElementById('noiseLabel').textContent=Number(noiseScale.value).toFixed(3);
    document.getElementById('flowStrengthLabel').textContent=Number(flowStrength.value).toFixed(2);
    document.getElementById('interactionLabel').textContent=Number(interaction.value);

    numAgents.addEventListener('input',(e)=>{const v=Number(e.target.value); document.getElementById('numAgentsLabel').textContent=v; if(v>sys.agents.length){for(let i=sys.agents.length;i<v;i++) sys.addAgent(p.random(p.width),p.random(p.height));} else sys.agents.splice(v);});
    noiseScale.addEventListener('input',(e)=>{params.noiseScale=Number(e.target.value); document.getElementById('noiseLabel').textContent=params.noiseScale.toFixed(3);});
    flowStrength.addEventListener('input',(e)=>{params.flowStrength=Number(e.target.value); document.getElementById('flowStrengthLabel').textContent=params.flowStrength.toFixed(2);});
    interaction.addEventListener('input',(e)=>{params.interactionStrength=Number(e.target.value); document.getElementById('interactionLabel').textContent=params.interactionStrength;});
    showField.addEventListener('change',(e)=>{params.showField=e.target.checked;});
    showLinks.addEventListener('change',(e)=>{params.showLinks=e.target.checked;});
    addAgentBtn.addEventListener('click',()=>{sys.addAgent(p.random(p.width),p.random(p.height)); numAgents.value=sys.agents.length; document.getElementById('numAgentsLabel').textContent=sys.agents.length;});
    resetBtn.addEventListener('click',()=>{sys.init(Math.max(10,Number(numAgents.value)),sys.flow.scale); p.background(10);});

    window.addEventListener('keydown',(e)=>{if(e.code==='Space'){paused=!paused; e.preventDefault();} if(e.code==='KeyC'){p.clear(); p.background(10);}});
  }
});
