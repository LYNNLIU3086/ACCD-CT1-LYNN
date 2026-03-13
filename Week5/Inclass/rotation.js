  function setup() {
  createCanvas(400, 400)
  colorMode(HSB,TWO_PI,1,1)}

  function draw() {
  background(TWO_PI*0.75,0.2,0.9)
  
  push()
  rotate(QUARTER_PI*0.2);
  drawGrid(20);
  pop()

  push()
  translate(width*0.5,height*0.5)
  rotate(QUARTER_PI)
  drawGrid(20);
  rect(0,0,100,100);
  pop()
  
}
  function drawGrid(numlines){
  for(let Y = 0;Y <= numlines; Y++) {
      line(0,Y * height/numlines,width,Y*height/numlines) }
  for(let X = 0;X <= numlines; X++) {
      line(X * width/numlines,0,X*height/numlines,height) }
  

  }
