let balls = [];
let numBalls = 20; // 球的数量
let mondrianColors;

function setup() {
  createCanvas(1900, 800);
  colorMode(RGB); // 用RGB模式更方便指定蒙德里安色

  // 蒙德里安经典色
  mondrianColors = [
    color(237, 34, 36),   // 红
    color(0, 48, 135),    // 蓝
    color(255, 221, 0),   // 黄
    color(255, 255, 255),  // 白
    color(0, 0, 0)         // 黑
  ];
  
  // 初始化每个球
  for (let i = 0; i < numBalls; i++) {
    balls.push({
      radius: random(20, 80),
      tX: random(10000),
      tY: random(10000),
      color: random(mondrianColors) // 每个球随机取蒙德里安颜色
    });
  }
}

function draw() {
  background(255); // 白色背景，更符合蒙德里安风格
  
  for (let ball of balls) {
    // 使用噪声生成平滑非线性运动
    let posX = noise(ball.tX) * width;
    let posY = noise(ball.tY) * height;
    
    // 更新噪声时间
    ball.tX += random(0.001, 0.001);
    ball.tY += random(0.001, 0.001);
    
    // 绘制小球
    noStroke();
    fill(ball.color);
    circle(posX, posY, ball.radius * 2);
  }
  
}








//课上
// let posX
// let posY

// let velX
// let velY

// let radius = 100

// function setup() {
//   createCanvas(800, 800)
//   colorMode(HSB, width, 100,100)
//   posX = width*0.5
//   posY = height*0.5
  
//   velX = random(-100,100)
//   velY = 
//   velX = random(-3,4)
// }

// function draw() {
//   posX = posX +velX
//   posY += velY

//   if(posY + radius >= height || posY - radius <= 0){
//      velY = velY*-1
//   }

//     if(posX + radius >= width || posX - radius <= 0){
//      velX = velX*-1
//   }
//   background(0,0,85)

//   noStroke()
//   fill(posX,100,100)
//   circle(posX, posY, radius * 2);
   
//   stroke(255,100,0)
//   strokeWeight(10)
//   fill(width*0.75,100,100)
//   rect(width*0.5 - 50,height*0.5 - 50,100,100)
// }











// 网格
// let gridSize = 8; // 网格数量（横纵）
// let cellWidth, cellHeight;
// let cells = [];
// let mondrianColors;

// function setup() {
//   createCanvas(800, 800);
//   colorMode(RGB);
//   noStroke();

//   cellWidth = width / gridSize;
//   cellHeight = height / gridSize;

//   // 蒙德里安经典色
//   mondrianColors = [
//     color(237, 34, 36),   // 红
//     color(0, 48, 135),    // 蓝
//     color(255, 221, 0),   // 黄
//     color(255, 255, 255), // 白
//     color(0, 0, 0)        // 黑
//   ];

//   // 初始化每个格子
//   for (let i = 0; i < gridSize; i++) {
//     for (let j = 0; j < gridSize; j++) {
//       cells.push({
//         x: i * cellWidth + cellWidth / 2,
//         y: j * cellHeight + cellHeight / 2,
//         tX: random(1000),
//         tY: random(1000),
//         w: cellWidth * 0.8,
//         h: cellHeight * 0.8,
//         color: random(mondrianColors)
//       });
//     }
//   }
// }

// function draw() {
//   background(255); // 白色背景

//   for (let cell of cells) {
//     // 使用噪声生成轻微移动和大小变化
//     let offsetX = (noise(cell.tX) - 0.5) * cellWidth * 0.5;
//     let offsetY = (noise(cell.tY) - 0.5) * cellHeight * 0.5;
//     let w = cell.w * (0.8 + noise(cell.tX) * 0.4);
//     let h = cell.h * (0.8 + noise(cell.tY) * 0.4);

//     fill(cell.color);
//     rect(cell.x + offsetX - w / 2, cell.y + offsetY - h / 2, w, h);

//     // 更新噪声时间
//     cell.tX += 0.01;
//     cell.tY += 0.01;
//   }
// }





// 点
// let elements = [];
// let numElements = 50; // 元素数量
// let mondrianColors;

// function setup() {
//   createCanvas(800, 800);
//   colorMode(RGB);
//   noStroke();

//   // 蒙德里安经典色
//   mondrianColors = [
//     color(237, 34, 36),   // 红
//     color(0, 48, 135),    // 蓝
//     color(255, 221, 0),   // 黄
//     color(255, 255, 255), // 白
//     color(0, 0, 0)        // 黑
//   ];

//   // 初始化元素（圆或矩形）
//   for (let i = 0; i < numElements; i++) {
//     elements.push({
//       x: random(width),
//       y: random(height),
//       tX: random(1000),
//       tY: random(1000),
//       w: random(20, 80),
//       h: random(20, 80),
//       type: random(['circle', 'rect']),
//       color: random(mondrianColors)
//     });
//   }
// }

// function draw() {
//   background(255); // 白色背景

//   for (let el of elements) {
//     // 噪声控制位置轻微漂浮
//     let offsetX = (noise(el.tX) - 0.5) * 50;
//     let offsetY = (noise(el.tY) - 0.5) * 50;
//     let w = el.w * (0.8 + noise(el.tX) * 0.4);
//     let h = el.h * (0.8 + noise(el.tY) * 0.4);

//     fill(el.color);

//     if (el.type === 'circle') {
//       ellipse(el.x + offsetX, el.y + offsetY, w, w);
//     } else {
//       rect(el.x + offsetX - w / 2, el.y + offsetY - h / 2, w, h);
//     }

//     // 更新噪声时间
//     el.tX += 0.01;
//     el.tY += 0.01;
//   }
// }
