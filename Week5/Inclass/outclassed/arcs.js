// let moonTexture;
// let moonTextures = [];
// let shapes = [];
// let stars = [];

// // 鼠标旋转相关
// let camAngleX = 0;
// let camAngleY = 0;
// let lastMouseX, lastMouseY;
// let isDragging = false;

// function preload() {
//   moonTextures.push(loadImage('moon_texture1.jpg'));
//   moonTextures.push(loadImage('moon_texture2.jpg'));
//   moonTextures.push(loadImage('moon_texture3.jpg'));
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   moonTexture = random(moonTextures);

//   ambientLight(80);
//   pointLight(255, 255, 220, 600, -300, -800);
//   noStroke();

//   // 星云
//   for (let i = 0; i < 20; i++) {
//     let palette = [
//       [255,182,193],[135,206,250],[255,255,102],[216,191,216],[144,238,144]
//     ];
//     let c = random(palette);
//     shapes.push({
//       size: random(20, 60),
//       offset: random(TWO_PI),
//       speed: random(0.0005, 0.0015),
//       radius: random(200, 500),
//       noiseX: random(1000),
//       noiseY: random(2000),
//       noiseZ: random(3000),
//       alphaBase: random(180, 255),
//       shapeType: int(random(2)),
//       colorBase: c,
//       link: i < 5 ? "https://lynnliu3086.github.io/ACCD-CT1-LYNN/Week2/NewMy/Research/project6.html" : null,
//       worldPos: createVector(0,0,0),
//       clickEffect: {active:false, startTime:0},
//       colorOffset: random(TWO_PI) // 用于渐变动画
//     });
//   }

//   // 小星星粒子
//   for (let i = 0; i < 100; i++) {
//     stars.push({
//       radius: random(100, 800),
//       speed: random(0.0001, 0.0005),
//       offset: random(TWO_PI),
//       size: random(2,5),
//       noiseX: random(1000),
//       noiseY: random(2000),
//       noiseZ: random(3000),
//       alphaBase: random(100,200),
//       colorBase: [random(180,255), random(180,255), random(180,255)],
//       colorOffset: random(TWO_PI)
//     });
//   }
// }

// function draw() {
//   background(0);

//   // 鼠标拖动摄像机控制
//   rotateX(camAngleY);
//   rotateY(camAngleX);

//   let moonAngle = millis() * 0.0006;

//   // 月球
//   push();
//   rotateY(moonAngle);
//   texture(moonTexture);
//   sphere(200, 64, 64);
//   pop();

//   // 星云
//   for (let s of shapes) {
//     push();
//     let t = millis() * s.speed;
//     let x = s.radius * cos(t + s.offset) + map(noise(s.noiseX + t),0,1,-50,50);
//     let y = s.radius * sin(t*1.3 + s.offset/2) + map(noise(s.noiseY + t),0,1,-50,50);
//     let z = s.radius * sin(t*0.8 + s.offset) + map(noise(s.noiseZ + t),0,1,-50,50);
//     s.worldPos.set(x,y,z);
//     translate(x,y,z);

//     // 精确 3D 悬停
//     let highlight = false;
//     if(s.link){
//       highlight = isMouseOverSphere(s.worldPos, s.size/2);
//     }

//     // 弹性缩放
//     let scaleFactor = highlight ? 1 + 0.3 * sin(millis()*0.01) : 1;
//     scale(scaleFactor);

//     // 明亮童趣颜色 + 渐变动画
//     let colorAnim = millis()*0.0003 + s.colorOffset;
//     let r = s.colorBase[0] + (highlight?80:0) + 50*sin(colorAnim);
//     let g = s.colorBase[1] + (highlight?80:0) + 50*sin(colorAnim+PI/3);
//     let b = s.colorBase[2] + (highlight?80:0) + 50*sin(colorAnim+2*PI/3);
//     let alpha = s.alphaBase + (highlight?60:0) + 30*sin(t*1.1+s.offset+moonAngle);

//     emissiveMaterial(constrain(r,0,255),constrain(g,0,255),constrain(b,0,255),constrain(alpha,0,255));

//     if(s.shapeType===0) sphere(s.size/2,24,24);
//     else box(s.size,s.size,s.size);

//     // 点击光晕
//     if(s.clickEffect.active){
//       let elapsed = millis() - s.clickEffect.startTime;
//       if(elapsed<600){
//         push();
//         let glowScale = map(elapsed,0,600,1.2,3);
//         let glowAlpha = map(elapsed,0,600,200,0);
//         scale(glowScale);
//         let glowColor = [
//           constrain(s.colorBase[0]+random(-20,20),0,255),
//           constrain(s.colorBase[1]+random(-20,20),0,255),
//           constrain(s.colorBase[2]+random(-20,20),0,255)
//         ];
//         emissiveMaterial(glowColor[0],glowColor[1],glowColor[2],glowAlpha);
//         sphere(s.size,16,16);
//         pop();
//       } else s.clickEffect.active = false;
//     }
//     pop();
//   }

//   // 小星星粒子
//   for (let st of stars){
//     push();
//     let t = millis()*st.speed;
//     let x = st.radius * cos(t + st.offset) + map(noise(st.noiseX + t),0,1,-30,30);
//     let y = st.radius * sin(t*1.3 + st.offset/2) + map(noise(st.noiseY + t),0,1,-30,30);
//     let z = st.radius * sin(t*0.8 + st.offset) + map(noise(st.noiseZ + t),0,1,-30,30);
//     translate(x,y,z);

//     // 小星星颜色渐变
//     let colorAnim = millis()*0.0005 + st.colorOffset;
//     let alpha = st.alphaBase + 50*sin(t*0.7+st.offset);
//     let r = st.colorBase[0] + 30*sin(colorAnim);
//     let g = st.colorBase[1] + 30*sin(colorAnim+PI/3);
//     let b = st.colorBase[2] + 30*sin(colorAnim+2*PI/3);
//     emissiveMaterial(constrain(r,0,255),constrain(g,0,255),constrain(b,0,255),constrain(alpha,0,255));

//     let starScale = 1 + 0.2*sin(millis()*0.02);
//     scale(starScale);

//     sphere(st.size,8,8);
//     pop();
//   }
// }

// // 精确射线-球体检测
// function isMouseOverSphere(pos, radius){
//   let camZ = (height/2.0)/tan(PI*30.0/180.0);
//   let camPos = createVector(0,0,camZ);
//   let mouseNDC = createVector(
//     (mouseX / width) * 2 - 1,
//     -((mouseY / height) * 2 - 1),
//     -1
//   );
//   let rayDir = createVector(mouseNDC.x * width/height, mouseNDC.y, -1).normalize();
//   let L = p5.Vector.sub(pos, camPos);
//   let tca = L.dot(rayDir);
//   if(tca < 0) return false;
//   let d2 = L.dot(L) - tca * tca;
//   return d2 <= radius*radius;
// }

// function mousePressed(){
//   for(let s of shapes){
//     if(s.link && isMouseOverSphere(s.worldPos, s.size/2)){
//       window.open(s.link,"_blank");
//       s.clickEffect.active = true;
//       s.clickEffect.startTime = millis();
//     }
//   }
// }

// // 鼠标拖动控制视角
// function mouseDragged(){
//   if(!isDragging){
//     lastMouseX = mouseX;
//     lastMouseY = mouseY;
//     isDragging = true;
//   }
//   let dx = mouseX - lastMouseX;
//   let dy = mouseY - lastMouseY;
//   camAngleX += dx * 0.005;
//   camAngleY += dy * 0.005;
//   lastMouseX = mouseX;
//   lastMouseY = mouseY;
// }

// function mouseReleased(){
//   isDragging = false;
// }

// function windowResized(){
//   resizeCanvas(windowWidth, windowHeight);
// }

// =====================
// 中心漂浮导航逻辑
// =====================
const centerMenu = document.getElementById('center-menu');
const menuItems = centerMenu.querySelectorAll('.menu-item');
const menuDot = document.getElementById('menu-dot');
let expanded = false;

function expandMenu() {
  const n = menuItems.length;
  const baseRadius = Math.min(window.innerWidth, window.innerHeight) / 4;
  const radiusStep = 100;

  menuItems.forEach((item, i) => {
    const layer = Math.floor(i / 6);
    let angle = (i % 6) / 6 * 2 * Math.PI + (Math.random()-0.5)*0.4;
    const radius = baseRadius + layer*radiusStep + Math.random()*50;
    const yOffset = -40 + Math.random()*80;

    item.style.setProperty('--x', `${Math.cos(angle)*radius}px`);
    item.style.setProperty('--y', `${Math.sin(angle)*radius + yOffset}px`);
    item.style.opacity = 1;
    item.style.transform = `translate(var(--x), var(--y)) scale(1)`;

    // 漂浮动画（CSS 已有 floatRoomText）
    const duration = 3 + Math.random()*2;
    item.style.animation = `floatRoomText ${duration}s ease-in-out infinite alternate`;

    // 背后多边形光晕
    const shape = item.querySelector('.menu-shape');
    shape.style.animation = `floatRoomShape ${4+Math.random()*2}s ease-in-out infinite alternate`;
    shape.style.transform = `rotate(${Math.random()*360}deg)`;
  });



}

function collapseMenu() {
  menuDot.style.display = 'block';
  menuItems.forEach(item => {
    item.style.opacity = 0;
    item.style.transform = 'translate(0,0)';
    item.style.animation = '';
    const shape = item.querySelector('.menu-shape');
    shape.style.animation = '';
  });
}

centerMenu.addEventListener('click', () => {
  expanded = !expanded;
  if(expanded) expandMenu();
  else collapseMenu();
});


// =====================

// p5.js 3D 场景
// =====================
let moonTexture;
let moonTextures = [];
let shapes = [];
let stars = [];
let camAngleX = 0, camAngleY = 0;
let lastMouseX, lastMouseY;
let isDragging = false;

function preload() {
  moonTextures.push(loadImage('moon_texture1.jpg'));
  moonTextures.push(loadImage('moon_texture2.jpg'));
  moonTextures.push(loadImage('moon_texture3.jpg'));
  // moonTextures.push(loadImage('moon_texture4.jpg'));
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('canvas-container');
  moonTexture = random(moonTextures);
  ambientLight(80);
  pointLight(255, 255, 220, 600, -300, -800);
  noStroke();

  for(let i=0;i<20;i++){
    let palette=[[255,182,193],[135,206,250],[255,255,102],[216,191,216],[144,238,144]];
    let c=random(palette);
    shapes.push({
      size: random(20,60),
      offset: random(TWO_PI),
      speed: random(0.0005,0.0015),
      radius: random(200,500),
      noiseX: random(1000),
      noiseY: random(2000),
      noiseZ: random(3000),
      alphaBase: random(180,255),
      shapeType: int(random(2)),
      colorBase: c,
      worldPos: createVector(0,0,0)
    });
  }

  for(let i=0;i<100;i++){
    stars.push({
      radius: random(100,800),
      speed: random(0.0001,0.0005),
      offset: random(TWO_PI),
      size: random(2,5),
      noiseX: random(1000),
      noiseY: random(2000),
      noiseZ: random(3000),
      alphaBase: random(100,200),
      colorBase:[random(180,255),random(180,255),random(180,255)],
      colorOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  rotateX(camAngleY);
  rotateY(camAngleX);

  // 月球
  push();
  rotateY(millis()*0.0006);
  texture(moonTexture);
  sphere(200,64,64);
  pop();

  // 星云
  for(let s of shapes){
    push();
    let t = millis()*s.speed;
    let x = s.radius*cos(t+s.offset)+map(noise(s.noiseX+t),0,1,-50,50);
    let y = s.radius*sin(t*1.3+s.offset/2)+map(noise(s.noiseY+t),0,1,-50,50);
    let z = s.radius*sin(t*0.8+s.offset)+map(noise(s.noiseZ+t),0,1,-50,50);
    translate(x,y,z);

    let colorAnim = millis()*0.0003 + s.offset;
    let r=s.colorBase[0]+50*sin(colorAnim);
    let g=s.colorBase[1]+50*sin(colorAnim+PI/3);
    let b=s.colorBase[2]+50*sin(colorAnim+2*PI/3);
    let alpha = s.alphaBase + 30*sin(t*1.1+s.offset);
    emissiveMaterial(constrain(r,0,255),constrain(g,0,255),constrain(b,0,255),constrain(alpha,0,255));

    if(s.shapeType===0) sphere(s.size/2,24,24);
    else box(s.size,s.size,s.size);
    pop();
  }

  // 小星星
  for(let st of stars){
    push();
    let t = millis()*st.speed;
    let x = st.radius*cos(t+st.offset)+map(noise(st.noiseX+t),0,1,-30,30);
    let y = st.radius*sin(t*1.3+st.offset/2)+map(noise(st.noiseY+t),0,1,-30,30);
    let z = st.radius*sin(t*0.8+st.offset)+map(noise(st.noiseZ+t),0,1,-30,30);
    translate(x,y,z);

    let colorAnim = millis()*0.0005 + st.colorOffset;
    let alpha = st.alphaBase + 50*sin(t*0.7+st.offset);
    let r=st.colorBase[0]+30*sin(colorAnim);
    let g=st.colorBase[1]+30*sin(colorAnim+PI/3);
    let b=st.colorBase[2]+30*sin(colorAnim+2*PI/3);
    emissiveMaterial(constrain(r,0,255),constrain(g,0,255),constrain(b,0,255),constrain(alpha,0,255));
    scale(1 + 0.2*sin(millis()*0.02));
    sphere(st.size,8,8);
    pop();
  }
}

// 鼠标控制旋转
function mouseDragged(){
  let dx = mouseX - (lastMouseX||mouseX);
  let dy = mouseY - (lastMouseY||mouseY);
  camAngleX += dx*0.005;
  camAngleY += dy*0.005;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}
function mouseReleased(){ lastMouseX = null; lastMouseY=null; }

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
