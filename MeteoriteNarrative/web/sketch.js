let imgData = [];
let images = [];

function preload() {
  // 尝试加载 JSON
  imgData = loadJSON('image_data_detected.json',
    () => console.log("✅ JSON 加载成功", imgData),
    (err) => console.error("❌ JSON 加载失败", err)
  );

  // 尝试加载图片
  for (let i = 0; i < 1; i++) { // 先测试第一张
    loadImage('detected_images/img001.jpg',
      img => {
        images[i] = img;
        console.log("✅ 图片加载成功", 'detected_images/img001.jpg');
      },
      err => console.error("❌ 图片加载失败", 'detected_images/img001.jpg', err)
    );
  }
}

function setup() {
  createCanvas(800, 600);
  background(0);
}

function draw() {
  background(0);

  if (images[0]) {
    image(images[0], 0, 0, width, height);
  } else {
    fill(255, 0, 0);
    textSize(20);
    text("图片未加载", 50, 50);
  }

  if (!imgData || imgData.length === 0) {
    fill(255, 255, 0);
    text("JSON 未加载或为空", 50, 100);
  }
}
