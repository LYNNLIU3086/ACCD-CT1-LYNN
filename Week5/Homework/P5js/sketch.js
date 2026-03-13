let angle = 0;
let planetRadius = 180;
let noiseOffset = 0;
let satX, satY, targetX, targetY;
let lastMoveTime = 0;
let moveInterval = 3000;
let planetTrail = [];
let satelliteTrail = [];

let paused = false;
let showTrail = true;
let planetColor, satColor;
let planetSpeed = 2;
let satelliteLerp = 0.02;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 0.6);
  canvas.parent("sketch-holder");
  angleMode(DEGREES);
  noStroke();
  satX = width / 2;
  satY = height / 2;
  targetX = random(width);
  targetY = random(height);

  planetColor = color(120, 180, 255);
  satColor = color(255, 100, 150);

  document.getElementById("pauseBtn").addEventListener("click", () => {
    paused = !paused;
    document.getElementById("pauseBtn").textContent = paused ? "Play" : "Pause";
  });

  document.getElementById("toggleTrailBtn").addEventListener("click", () => {
    showTrail = !showTrail;
  });

  document.getElementById("randomColorBtn").addEventListener("click", () => {
    planetColor = color(random(50, 255), random(50, 255), random(50, 255));
    satColor = color(random(50, 255), random(50, 255), random(50, 255));
  });

  document.getElementById("randomParamsBtn").addEventListener("click", () => {
    planetRadius = random(120, 250);
    planetSpeed = random(1, 4);
    satelliteLerp = random(0.01, 0.05);
  });
}

function draw() {
  if (paused) return;

  background(10, 10, 30, 50);

  // 中心恒星
  drawGlow(width/2, height/2, 80, color(255,230,150,200));
  fill(255,240,180,230);
  ellipse(width/2, height/2, 60);

  // 行星
  let r = planetRadius + 20 * sin(frameCount*0.5);
  let px = width/2 + r*cos(angle);
  let py = height/2 + r*sin(angle);
  angle += planetSpeed;

  let planetSize = 40 + 10*noise(noiseOffset);
  drawGlow(px, py, planetSize*1.6, color(red(planetColor),green(planetColor),blue(planetColor),100));
  fill(planetColor);
  ellipse(px, py, planetSize);

  planetTrail.push(createVector(px, py));
  if(planetTrail.length>120) planetTrail.shift();
  if(showTrail) drawTrail(planetTrail, color(red(planetColor),green(planetColor),blue(planetColor),120));

  // 卫星漂移
  if(millis()-lastMoveTime>moveInterval){
    targetX = random(width);
    targetY = random(height);
    lastMoveTime = millis();
    moveInterval = random(2000,5000);
  }

  satX = lerp(satX,targetX,satelliteLerp);
  satY = lerp(satY,targetY,satelliteLerp);

  let satSize = 60 + 20*noise(noiseOffset+100);
  drawGlow(satX,satY,satSize*1.5,color(red(satColor),green(satColor),blue(satColor),100));
  fill(satColor);
  ellipse(satX,satY,satSize);

  satelliteTrail.push(createVector(satX,satY));
  if(satelliteTrail.length>80) satelliteTrail.shift();
  if(showTrail) drawTrail(satelliteTrail,color(red(satColor),green(satColor),blue(satColor),90));

  // 星光闪烁
  for(let i=0;i<2;i++){
    stroke(255,random(80,180));
    point(random(width),random(height));
  }

  noiseOffset += 0.01;
}

function drawGlow(x,y,size,col){
  noStroke();
  for(let i=10;i>0;i--){
    let alpha = map(i,10,0,0,255);
    fill(red(col),green(col),blue(col),alpha/8);
    ellipse(x,y,size+i*8);
  }
}

function drawTrail(points,col){
  noFill();
  strokeWeight(2);
  beginShape();
  for(let i=0;i<points.length;i++){
    let p = points[i];
    stroke(red(col),green(col),blue(col),map(i,0,points.length,0,200));
    vertex(p.x,p.y);
  }
  endShape();
  noStroke();
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight*0.6);
}
