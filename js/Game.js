class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();
    var obstaclesPositions = [

      { x: width / 2 + 250, y: height - 800, image: pneuImg },
      { x: width / 2 - 150, y: height - 1300, image: coneImg },
      { x: width / 2 + 250, y: height - 1800, image: pneuImg },
      { x: width / 2 - 180, y: height - 2300, image: coneImg },
      { x: width / 2, y: height - 2800, image: pneuImg },
      { x: width / 2 - 180, y: height - 3333, image: coneImg },
      { x: width / 2 + 180, y: height - 3800, image: pneuImg },
      { x: width / 2 + 250, y: height - 4300, image: coneImg },
      { x: width / 2 - 150, y: height - 4800, image: pneuImg },
      { x: width / 2 + 250, y: height - 5300, image: coneImg },
      { x: width / 2, y: height - 5800, image: pneuImg },
      { x: width / 2 - 180, y: height - 6300, image: coneImg },
    ];

    this.addSprites(fuels, 4, fuelImg, 0.2);
    this.addSprites(coins, 18, coinImg, 0.9);
    this.addSprites(obstacles, obstaclesPosition.length, coneImg, 0.4, obstaclesPositions);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {

    for (var i = 0; i < numberOfSprites; i++) {

      var x, y;
      if (positions.length > 0) {

        x = positions[i].x;
        y = positions[i].y;
        spriteImage = position[i].image;
      } else {

        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderboard();

      //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          this.handleFuel(index);
          this.handleCoin(index);

          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // manipulando eventos de teclado
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleResetButton() {

    this.resetButton.mousePressed(() => {

      database.ref("/").set({

        carsAtEnd: 0,
        playerCount: 0,
        gameState: 0,
        players: {}
      });

      window.location.reload();
    })
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW)) {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW)) {
      player.positionX += 5;
      player.update();
    }
  }

  handleFuel(index) {

    cars[index-1].overlap(fuels, function(collector, collected)) {

      player.fuel = 185;
      collected.remove();
    }
  }

  handleCoin(index) {

    cars[index-1].overlap(coins, function(collector, collected)) {

      player.coin += 5;
      player.update();
      collected.remove();
    }
  }
}

