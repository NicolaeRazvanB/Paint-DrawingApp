//Initial setup
let canvas = document.querySelector("#board");
let ctx = canvas.getContext("2d");
let W = canvas.width;
let H = canvas.height;
let history = []; //Array of objects that have been drawn
let mx = 0,
  my = 0,
  smx = 0,
  smy = 0;
let baseShape = {
  name: "rectangular",
  color: "black",
  width: 2.5,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};
let shape = {
  name: "rectangular",
  color: "black",
  width: 2.5,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};
let state = {
  penSize: 2.5,
  penColor: "black",
  backgroundColor: "white",
  isDrawing: false,
  shape: "rectangular",
};

//TOOLS AND BUTTONS
// Clear function
document.querySelector("#clear").addEventListener("click", function () {
  history = [];
  state.backgroundColor = "#FFFFFF";
  document.querySelector("#backgroundColor").value = "#FFFFFF";
});

//Download as PNG function
document.getElementById("downloadSketch").addEventListener("click", (event) => {
  let link = document.createElement("a");
  link.download = "sketch.png";
  link.href = canvas.toDataURL();
  link.click();
});

//Color pickers for pen and background

let colorInput = document.querySelector("#penColor");
colorInput.addEventListener("input", () => {
  state.penColor = colorInput.value;
  shape.color = colorInput.value;
});

let backgroundInput = document.querySelector("#backgroundColor");
backgroundInput.addEventListener("input", () => {
  state.backgroundColor = backgroundInput.value;
});

const penSizeChange = (pensize) => {
  state.penSize = pensize;
  shape.width = pensize;
};
//SHAPE type handle
const setShape = (shapeName) => {
  state.shape = shapeName;
  shape.name = shapeName;
  if (shapeName === "line") {
    document.getElementById("line").style.backgroundColor = "rgb(0, 204, 102)";
    document.getElementById("rectangular").style.backgroundColor = "aquamarine";
    document.getElementById("ellipse").style.backgroundColor = "aquamarine";
  }

  if (shapeName === "rectangular") {
    document.getElementById("line").style.backgroundColor = "aquamarine";
    document.getElementById("rectangular").style.backgroundColor =
      "rgb(0, 204, 102)";
    document.getElementById("ellipse").style.backgroundColor = "aquamarine";
  }
  if (shapeName === "ellipse") {
    document.getElementById("line").style.backgroundColor = "aquamarine";
    document.getElementById("rectangular").style.backgroundColor = "aquamarine";
    document.getElementById("ellipse").style.backgroundColor =
      "rgb(0, 204, 102)";
  }
};

//DRAWING function
drawModel = (model) => {
  ctx.strokeStyle = model.color;
  ctx.lineWidth = model.width;

  if (model.name === "rectangular") {
    ctx.strokeRect(model.x, model.y, model.w, model.h);
  }
  if (model.name === "line") {
    ctx.beginPath();
    ctx.moveTo(model.sx, model.sy);
    ctx.lineTo(model.x, model.y);
    ctx.stroke();
  }
  if (model.name === "ellipse") {
    ctx.beginPath();
    ctx.ellipse(
      model.x + model.w / 2,
      model.y - model.h / 2,
      model.w,
      model.h,
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
};

//Animation block
initModel = () => {
  //Clear drawing-board
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = state.backgroundColor;
  ctx.fillRect(0, 0, W, H);
  //Re-draw models from history array
  if (history.length !== 0) {
    history.forEach((item) => {
      drawModel(item);
    });
  }
  requestAnimationFrame(initModel);
};

updateModel = () => {
  // if (JSON.stringify(shape) !== JSON.stringify(baseShape)) history.push(shape);
  // history = [...new Set(history)];
  // console.log(history);
  if (
    shape.name === "rectangular" &&
    shape.x !== 0 &&
    shape.y !== 0 &&
    shape.h !== 0 &&
    shape.w !== 0
  )
    history.push(shape);
  if (
    shape.name === "ellipse" &&
    shape.x !== 0 &&
    shape.y !== 0 &&
    shape.h !== 0 &&
    shape.w !== 0
  )
    history.push(shape);
  if (
    shape.name === "line" &&
    shape.sx !== 0 &&
    shape.sy !== 0 &&
    shape.x !== 0 &&
    shape.y !== 0
  )
    history.push(shape);
  history = [...new Set(history)];
};
setInterval(updateModel, 10);

//Events handlers for drawing
document.addEventListener("mousemove", (e) => {
  mx = Math.round(e.x - canvas.getBoundingClientRect().x);
  my = Math.round(e.y - canvas.getBoundingClientRect().y);

  if (state.isDrawing) {
    if (state.shape === "rectangular" || state.shape === "ellipse") {
      shape.x = Math.min(smx, mx);
      shape.y = Math.min(smy, my);
      shape.w = Math.abs(mx - smx);
      shape.h = Math.abs(my - smy);
    }
    if (state.shape === "line") {
      shape.sx = smx;
      shape.sy = smy;
      shape.x = mx;
      shape.y = my;
    }
  }
});

canvas.addEventListener("mousedown", (e) => {
  state.isDrawing = true;
  smx = mx;
  smy = my;
});
canvas.addEventListener("mouseup", (e) => {
  state.isDrawing = false;
  shape = JSON.parse(JSON.stringify(baseShape));
  shape.color = state.penColor;
  shape.width = state.penSize;
  shape.name = state.shape;
});

initModel(); //Running the animation function
