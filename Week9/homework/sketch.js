let video;
let handpose;
let predictions = [];

let imgS = [];
let blendAmt = 0;
let blendSlider;

function preload() {
  imgS[0] = loadImage("map1.jpg");
  imgS[1] = loadImage("map2.jpg");
  imgS[2] = loadImage("map3.jpg");

  handpose = ml5.handPose({ flipped: true });
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');

  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();

  // 你的系统可用版本
  handpose.detectStart(video, results => {
    predictions = results;
  });

  blendSlider = createSlider(0, 1, 0, 0.01);
  blendSlider.position(20, 20);
  blendSlider.style('width', '200px');
}

function draw() {
  background(0);

  updateBlendByHand();
  blendAmt = blendSlider.value();

  drawBlend3Images();
  drawDebug();
}

// -----------------------------
// 手指位置控制 blendAmt
// -----------------------------
function updateBlendByHand() {
  if (predictions.length === 0) return;

  let hand = predictions[0];
  let x = hand.keypoints[8].x;

  let mapped = map(x, 0, width, 0, 1);
  mapped = constrain(mapped, 0, 1);

  blendAmt = mapped;
  blendSlider.value(blendAmt);
}


// -----------------------------
// 3 张图像渐进式 blend
// -----------------------------
function drawBlend3Images() {
  let imgA, imgB, localBlend;

  // 阶段 1：图1 → 图2
  if (blendAmt < 0.5) {
    imgA = imgS[0];
    imgB = imgS[1];
    localBlend = map(blendAmt, 0, 0.5, 0, 1);
  }
  // 阶段 2：图2 → 图3
  else {
    imgA = imgS[1];
    imgB = imgS[2];
    localBlend = map(blendAmt, 0.5, 1, 0, 1);
  }

  // 画底图
  image(imgA, 0, 0, width, height);

  // 第二层按 localBlend 透明度叠加
  push();
  tint(255, localBlend * 255);
  image(imgB, 0, 0, width, height);
  pop();
}


// -----------------------------
// 显示关键点
// -----------------------------
function drawDebug() {
  if (predictions.length === 0) return;

  let pts = predictions[0].keypoints;

  fill(0, 255, 0);
  noStroke();
  for (let p of pts) {
    circle(p.x, p.y, 8);
  }
}







// let video;
// let handpose;
// let predictions = [];

// let imgS = [];
// let blendAmt = 0;
// let blendSlider;

// function preload() {
//   imgS[0] = loadImage("map1.jpg");
//   imgS[1] = loadImage("map2.jpg");

//   handpose = ml5.handPose({ flipped: true });
// }

// function setup() {
//   let canvas = createCanvas(800, 600);
//   canvas.parent('canvas-container');

//   video = createCapture(VIDEO);
//   video.size(800, 600);
//   video.hide();

//   // 使用你系统能跑的 API：detectStart
//   handpose.detectStart(video, results => {
//     predictions = results;
//   });

//   blendSlider = createSlider(0, 1, 0, 0.01);
//   blendSlider.position(20, 20);
//   blendSlider.style('width', '200px');
// }

// function draw() {
//   background(0);

//   updateBlendByHand();
//   blendAmt = blendSlider.value();

//   drawBlendImages();
//   drawDebug();
// }


// // -----------------------------
// // 根据手指位置控制滑块值
// // -----------------------------
// function updateBlendByHand() {
//   if (predictions.length === 0) return;

//   let hand = predictions[0];
//   let x = hand.keypoints[8].x;  // 你版本是 keypoints，而不是 landmarks

//   let mapped = map(x, 0, width, 0, 1);
//   mapped = constrain(mapped, 0, 1);

//   blendAmt = mapped;
//   blendSlider.value(blendAmt);
// }


// // -----------------------------
// // blend 绘制两张图
// // -----------------------------
// function drawBlendImages() {
//   let imgA = imgS[0];
//   let imgB = imgS[1];

//   image(imgA, 0, 0, width, height);

//   push();
//   tint(255, blendAmt * 255);
//   image(imgB, 0, 0, width, height);
//   pop();
// }


// // -----------------------------
// // 手部关键点显示
// // -----------------------------
// function drawDebug() {
//   if (predictions.length === 0) return;

//   let pts = predictions[0].keypoints;

//   fill(0, 255, 0);
//   noStroke();
//   for (let p of pts) {
//     circle(p.x, p.y, 8);
//   }
// }
// ————————————————————————————

// let video;
// let handpose;
// let predictions = [];

// let imgS = [];
// let blendAmt = 0; 
// let blendSlider;  
// let something = 0;
// let switchAllowed = true

// function preload() {
//   imgS[0] = loadImage("map1.jpg");
//   imgS[1] = loadImage("map2.jpg");
//   handpose = ml5.handPose ({flipped: true});
// }


// function setup() {
//   let canvas = createCanvas(800, 600);
//   canvas.parent('canvas-container');

//   video = createCapture(VIDEO);
//   video.size(800, 600);
//   video.hide();
//   // handpose = ml5.handpose(video, () => {
//   //   console.log("Handpose model loaded!"); });
//   // handpose.on("predict", results => {
//   //   predictions = results; });
//   handpose.detectStart(video, detectHandLeftRight);
//   blendSlider = createSlider(0, 1, 0, 0.01); 
//   blendSlider.position(15, 142);
//   blendSlider.style('width', '200px');
//   blendSlider.elt.style.opacity = '0';
// }

// function draw() {
//   background(0);
//   detectHandLeftRight();
//   blendAmt = blendSlider.value();
//   //drawBlend();
//   drawSwitch();
//   drawDebug();
// }

// function detectHandLeftRight(results) {
//   if (results) predictions = results
//   if (predictions.length === 0) return;
//   console.log(predictions)
//   let hand = predictions[0];
//   let x = hand.keypoints[8].x; 

//   blendAmt = map(x, 0, width, 0, 1);
//   blendAmt = constrain(blendAmt, 0, 1);
//   blendSlider.value(blendAmt);
// }

// function drawBlend() {
//   image(img1, 0, 0, width, height);
//   push();
//   tint(255, blendAmt * 255);
//   image(img2, 0, 0, width, height);
//   pop();
// }
// function drawSwitch(){
//   // if (something){
//   //   image(imgS[0], 0, 0, width, height);
//   // }
//   // else {
//   //   image(imgS[1], 0, 0, width, height);
//   // }

//   image(imgS[something], 0, 0, width, height);

// }

// function drawDebug() {
//   if (predictions.length > 0) {
//     let pts = predictions[0].keypoints;
//     if(dist(pts[4].x, pts[4].y, pts[8].x, pts[8].y) < 30){
//       fill(255,0,0)
//       //advance the count
//       if(switchAllowed){
//         something++
//         switchAllowed = false
//         if(something >= imgS.length){
//           something = 0
//         }
//       }

//     }
//     else { 
//       fill(0, 255, 0);
//       switchAllowed = true
//     }
//     noStroke();
//     for (let p of pts) {
//       circle(p.x, p.y, 8);
//     }
//   }
// }

