let posX
let posY

let velX
let velY

let radius = 100

function setup() {
  createCanvas(800, 800)
  colorMode(HSB, width, 100,100)
  posX = width*0.5
  posY = height*0.5
  velX = -2
  velY = 3
}

function draw() {
  posX = posX +velX
  posY += velY

  if(posY + radius >= height || posY - radius <= 0){
     velY = velY*-1
  }

    if(posX + radius >= width || posX - radius <= 0){
     velX = velX*-1
  }
  background(0,0,85)

  noStroke()
  fill(posX,100,100)
  circle(posX, posY, radius * 2);
   
  stroke(255,100,0)
  strokeWeight(10)
  fill(width*0.75,100,100)
  rect(width*0.5 - 50,height*0.5 - 50,100,100)
}
 