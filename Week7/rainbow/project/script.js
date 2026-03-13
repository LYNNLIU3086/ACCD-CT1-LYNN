let ecosystem;

class Ecosystem {
  constructor(numAgents) {
    this.agents = [];
    this.foods = [];
    for (let i = 0; i < numAgents; i++) {
      this.agents.push(new Agent(random(width), random(height)));
    }
    for (let i = 0; i < 20; i++) {
      this.foods.push(new Food(random(width), random(height)));
    }
  }

  update() {
    for (let agent of this.agents) {
      agent.move();
      agent.eat(this.foods);
      agent.display();
    }
    for (let food of this.foods) {
      food.display();
    }
  }
}

class Agent {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.speed = 2;
  }

  move() {
    this.pos.add(this.vel);
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  eat(foods) {
    for (let i = foods.length - 1; i >= 0; i--) {
      let food = foods[i];
      if (dist(this.pos.x, this.pos.y, food.pos.x, food.pos.y) < 10) {
        foods.splice(i, 1);
        foods.push(new Food(random(width), random(height))); // 新食物再生
      }
    }
  }

  display() {
    fill(0, 255, 100);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}

class Food {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }

  display() {
    fill(255, 150, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 6, 6);
  }
}

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-container");
  ecosystem = new Ecosystem(10);
}

function draw() {
  background(20, 30, 40, 50);
  let num = int(document.getElementById("numAgents").value);
  let spd = float(document.getElementById("speed").value);
  for (let a of ecosystem.agents) a.speed = spd;

  while (ecosystem.agents.length < num)
    ecosystem.agents.push(new Agent(random(width), random(height)));
  while (ecosystem.agents.length > num)
    ecosystem.agents.pop();

  ecosystem.update();
}

function mousePressed() {
  ecosystem.foods.push(new Food(mouseX, mouseY));
}

document.getElementById("resetBtn").onclick = () => {
  ecosystem = new Ecosystem(int(document.getElementById("numAgents").value));
};
