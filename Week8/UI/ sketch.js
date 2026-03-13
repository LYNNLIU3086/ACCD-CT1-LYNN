let brush;
let colorPicker, sizeSlider, sizeValue, clearBtn;
let canvas;

function setup() {
  canvas = createCanvas(600, 400);
  canvas.parent('canvasContainer');
  background(20);

  colorPicker = select('#colorPicker');
  sizeSlider = select('#sizeSlider');
  sizeValue = select('#sizeValue');
  clearBtn = select('#clearBtn');

  brush = new Brush(colorPicker.value(), sizeSlider.value());

  sizeSlider.input(() => {
    sizeValue.html(sizeSlider.value());
    brush.update(colorPicker.value(), sizeSlider.value());
  });

  colorPicker.input(() => {
    brush.update(colorPicker.value(), sizeSlider.value());
  });

  clearBtn.mousePressed(() => {
    background(20);
  });
}

function draw() {
  if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    brush.draw(mouseX, mouseY);
  }
}
