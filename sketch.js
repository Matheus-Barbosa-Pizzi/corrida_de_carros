var canvas;
var backgroundImage, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];
var fuelImg, coinImg, coneImg, pneuImg, lifeImg;
var fuels, coins, obstacles;
var boomImg;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("../assets/car1.png");
  car2_img = loadImage("../assets/car2.png");
  track = loadImage("../assets/pista.png");
  fuelImg = loadImage("../assets/fuel.png");  
  coinImg = loadImage("../assets/coin.png");
  coneImg = loadImage("../assets/cone.png");
  pneuImg = loadImage("../assets/pneu.png");
  lifeImg = loadImage("../assets/life.png");
  boomImg = loadImage("../assets/boom.jpg");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
