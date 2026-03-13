let thisCanvas = document.getElementById('starfield')
let posX = []
let posY = []
let size = []
let numStars = 500

function setup() {
  createCanvas(600, 600)
  colorMode(HSB,360,100,100)
  
    for(let i = 0;i < numStars; i++) {
      posX.push(random(width))
      posY[i] = random(height) //不要这个，不通用
      size.push(random(1,3
      ))
  }
}

function draw() {
  background(0)
  fill(0,0,100)
  for(let i = 0;i < numStars; i++) {
  circle(posX[i],posY[i],random(size[i],size[i]+1),)

  }
}




