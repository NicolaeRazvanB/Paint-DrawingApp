let canvas_foreground = document.querySelector("#canvas_foreground");
let ctx_foreground = canvas_foreground.getContext("2d");
let canvas_background = document.querySelector("#canvas_background");
let ctx_background = canvas_background.getContext("2d");

ctx_background.fillStyle = "white";
ctx_background.fillRect(
  0,
  0,
  canvas_background.width,
  canvas_background.height
);

let state = {
  penSize: 10,
  isDrawing: false,
  color: "black",
  isDrawingShape: "none",
};

//Freestyle drawing block
canvas_foreground.addEventListener("mousedown", (e) => {
  state.isDrawing = true;
  x = e.offsetX;
  y = e.offsetY;
});
canvas_foreground.addEventListener("mouseup", () => {
  state.isDrawing = false;
  x = undefined;
  y = undefined;
});

const drawLine = (x1, y1, x2, y2) => {
  ctx_foreground.beginPath();
  ctx_foreground.moveTo(x1, y1);
  ctx_foreground.lineTo(x2, y2);
  ctx_foreground.strokeStyle = state.color;
  ctx_foreground.lineWidth = state.penSize * 2;
  ctx_foreground.stroke();
};

const draw = (x2, y2) => {
  if (state.isDrawing) {
    ctx_foreground.fillStyle = state.color;
    ctx_foreground.beginPath();
    ctx_foreground.arc(x2, y2, state.penSize, 0, Math.PI * 2);
    ctx_foreground.closePath();
    ctx_foreground.fill();
    drawLine(x, y, x2, y2);
  }
  x = x2;
  y = y2;
};

canvas_foreground.addEventListener("mousemove", (event) => {
  draw(event.offsetX, event.offsetY);
});
// Clear function

document.querySelector("#clear").addEventListener("click", function () {
  ctx_foreground.clearRect(
    0,
    0,
    canvas_foreground.width,
    canvas_foreground.height
  );
  ctx_background.clearRect(
    0,
    0,
    canvas_background.width,
    canvas_background.height
  );
  ctx_background.fillStyle = "white";
  ctx_background.fillRect(
    0,
    0,
    canvas_background.width,
    canvas_background.height
  );

  document.querySelector("#backgroundColor").value = "#FFFFFF";
});

//Download as PNG function
document.querySelector("a").addEventListener("click", (event) => {
  ctx_background.drawImage(canvas_foreground, 0, 0);
  event.target.href = canvas_background.toDataURL();
  ctx_background.clearRect(
    0,
    0,
    canvas_background.width,
    canvas_background.height
  );
  ctx_background.fillStyle = document.querySelector("#backgroundColor").value;
  ctx_background.fillRect(
    0,
    0,
    canvas_background.width,
    canvas_background.height
  );
});

//Color pickers for pen and background

let colorInput = document.querySelector("#penColor");
colorInput.addEventListener("input", () => {
  state.color = colorInput.value;
});

let backgroundInput = document.querySelector("#backgroundColor");
backgroundInput.addEventListener("input", () => {
  ctx_background.fillStyle = backgroundInput.value;
  ctx_background.fillRect(
    0,
    0,
    canvas_background.width,
    canvas_background.height
  );
});

const penSizeChange = (pensize) => {
  state.penSize = pensize;
};

//Drawing shapes block
const drawShape = (shape) => {
  state.isDrawingShape = shape;
  console.log(state.isDrawingShape);
};
