//Space Invaders (prototipo) - Tarea 1 - Computación visual 2024-2
let s;
let ship; // La nave del jugador
let alienGroup; // 
let Type;
let myBullets = [];
let enemyBullets = [];
let powerUps = [];

let imagesShipAlive, imagesShipDead, imagesAlienAAlive, imagesAlienADead, imagesAlienBAlive, imagesAlienBDead, imagesAlienCAlive, imagesAlienCDead;
let fondo;
let shield, cadency, doublepoints, freeze, speed, nobullets, extralife;
let alienShipGrid;
let enemies = 1, maxEnemies = 3, enemyRows = 1, level = 1;
let spritesRootPath;
let audioRootPath;
let doublePoints;
let doublePointsActivation, doublePointsDuration = 5000, time;
let gameStarted = false, gameOver = false, gameConfigurated = true, winner = false;
let actualScore, highScore;
let soundshoot, soundshipdeath, soundinvader, soundpowerup, soundgameover, soundbrokenshield;
let changelevel;

let enemyLevels = new Map();

function preloadAllSounds() {
  soundshoot = loadSound(audioRootPath + "shoot.wav");
  soundshipdeath = loadSound(audioRootPath + "explosion.wav");
  soundinvader = loadSound(audioRootPath + "invaderkilled.wav");
  soundpowerup = loadSound(audioRootPath + "powerup.wav");
  soundgameover = loadSound(audioRootPath + "GameOver.wav");
  soundbrokenshield = loadSound(audioRootPath + "brokenshield.wav");
}

function preloadAllImages() {
  fondo = loadImage(spritesRootPath + "fondo.jpg");
  fondo.resize(width, height);
  imagesShipAlive = loadImages("ship", 1);
  imagesShipDead = loadImages("shipDead", 1);
  imagesAlienAAlive = loadImages("alienA", 2);
  imagesAlienADead = loadImages("alienDead", 1);
  imagesAlienBAlive = loadImages("alienB",2);
  imagesAlienBDead = loadImages("alienDead",1);
  imagesAlienCAlive = loadImages("alienC",2);
  imagesAlienCDead = loadImages("alienDead",1);
  shield = loadImage(spritesRootPath + "shield.png");
  cadency = loadImage(spritesRootPath + "cadency.png");
  doublepoints = loadImage(spritesRootPath + "doublepoints.png");
  freeze = loadImage(spritesRootPath + "freeze.png");
  speed = loadImage(spritesRootPath + "speed.png");
  nobullets = loadImage(spritesRootPath + "nobullets.png");
  extralife = loadImage(spritesRootPath + "extralife.png");
}


function preload() {
  spritesRootPath = "./sprites/";
  audioRootPath = "./sounds/";
  preloadAllSounds();
  preloadAllImages();
}

function setup() {
  createCanvas(1080, 720);
  let volume = 0.01;
  s = new p5.SoundFile();
  s.setVolume(volume);
  setupEnemiesForLevel();
  configNewGame();
}

function draw() {
  if (!gameStarted && !gameOver && !winner) {
    startScreen();
  } else if (gameOver) {
    gameOverScreen();
  } else if (winner) {
    WinScreen();
  } else if (changelevel) {
    showlevel();
    if (millis() - time > 1000) {changelevel = false;}
  } else {
    background(fondo);
    showLifes();
    ship.update();
    ship.render();
    alienGroup.update();
    renderPowerUps();
    myBullets.forEach((bullet) => {
      bullet.update();
      bullet.render();
    });
    myBullets = myBullets.filter(bullet => bullet.pos.y + bullet.b_height >= 0);
    enemyBullets.forEach((bullet) => {
      bullet.update();
      bullet.render();
    });
    enemyBullets = enemyBullets.filter(bullet => bullet.pos.y <= height);
    if (millis() - doublePointsActivation > doublePointsDuration) {
      doublePoints = false;
    }
    ship.catchPower();
    if (ship.isDeath() && ship.isDeathAnimationFinished()) {
      soundgameover.play();
      gameOverFunc();
    }
    showScore();
  }
}

function keyPressed() {
  if (winner) {
    winner = false;
  } else if (!gameStarted || gameOver) {
    soundgameover.stop();
    startGame();
  } else {
    ship.keyFunctions(keyCode, true);
  }
}

function keyReleased() {
  if (gameStarted && !gameOver) {
    ship.keyFunctions(keyCode, false);
  }
}

function startScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Bienvenido a Space Invaders", width / 2, height / 2 - 50);
  textSize(16);
  text("Presiona cualquier tecla para comenzar", width / 2, height / 2 + 50);
}

function startGame() {
  if (gameOver) {
    gameConfigurated = false;
    gameOver = false;
  }
  if (!gameConfigurated) {
    configNewGame();
    gameConfigurated = true;
  }
  gameStarted = true;
}

function configNewGame() {
  actualScore = 0;
  ship = new Ship(createVector(width / 2, height * 0.85), 32, 32, 3, imagesShipAlive, imagesShipDead);
  confignewlevel();
}

function confignewlevel() {
  myBullets = [];
  enemyBullets = [];
  powerUps = [];
  let levelConfig = enemyLevels.get(level);
  enemies = levelConfig[0];
  enemyRows = levelConfig[1];

  alienShipGrid = Array.from({ length: enemyRows }, () => Array(enemies).fill(null));
  for (let j = 0; j < enemyRows; j++) {
    let imagesAlive;
    let imagesDead;
    if (j < 2) {
      imagesAlive = imagesAlienBAlive;
      imagesDead = imagesAlienBDead;
    } else if (j < 4) {
      imagesAlive = imagesAlienCAlive;
      imagesDead = imagesAlienCDead;
    } else {
      imagesAlive = imagesAlienAAlive;
      imagesDead = imagesAlienADead;
    }
    for (let i = 0; i < enemies; i++) {
      if (imagesAlive === imagesAlienAAlive) {
        Type = Object.values(alienType)[0];
      } else if (imagesAlive === imagesAlienBAlive) {
        Type = Object.values(alienType)[1];
      } else {
        Type = Object.values(alienType)[2];
      }
      alienShipGrid[j][i] = new AlienShip(Type, createVector(100 + i * 80, 100 + j * 50), 32, 32, 3, imagesAlive, imagesDead);
    }
  }
  alienGroup = new AlienShipGroup(alienShipGrid);
}

function setupEnemiesForLevel() {
  enemyLevels.set(1, [4, 3]);
  enemyLevels.set(2, [5, 4]);
  enemyLevels.set(3, [6, 5]);
  enemyLevels.set(4, [7, 6]);
  enemyLevels.set(5, [8, 7]);
}

function renderPowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let power = powerUps[i];
    power.update();
    power.render();

    // Eliminar power-ups consumidos o fuera de pantalla
    if (power.pos.y > height || !power.active) {
      powerUps.splice(i, 1);
    }
  }
}

function showLifes() {
  textSize(20);
  fill(255);
  let shipX = width * 0.02 + 40;
  let shipY = height * 0.92;
  let textX = shipX - 20;
  let textY = shipY + 15;
  image(imagesShipAlive[0], shipX, shipY, 30, 30);
  text("x" + ship.lifes, textX, textY);
}

function showScore() {
  textAlign(CENTER, CENTER);
  textSize(24);
  text("SCORE: " + actualScore, width * 0.05, height * 0.01);
  textSize(16);
  text("HIGH-SCORE: " + highScore, width / 2, height * 0.01);
  text("LEVEL " + level, width * 0.95, height * 0.01);

  // Mostrar indicador visual de puntos dobles
  if (doublePoints) {
    fill(255, 215, 0); // Color dorado para destacar
    text("POINTS X2!", width * 0.25, height * 0.01);
  }
}

function showlevel() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("LEVEL " + level, width / 2, height / 2 - 50);
}

function gameOverFunc() {
  if (highScore < actualScore) {highScore = actualScore;}
  gameOver = true;
  gameStarted = false;
  gameConfigurated = false;
  level = 1;
}

function win() {
  if (level === enemyLevels.size) {
    winner = true;
    if (highScore < actualScore) {highScore = actualScore;}
    gameStarted = false;
    gameConfigurated = false;
    level = 1;
  } else {
    level++;
    changelevel = true;
    time = millis();
    confignewlevel();
  }
}

function gameOverScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Game Over", width / 2, height / 2 - 50);
  textSize(24);
  text("Score: " + actualScore, width / 2, height / 2);
  textSize(16);
  text("Presiona cualquier tecla para volver al inicio", width / 2, height / 2 + 50);
}

function WinScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("¡YOU WIN!", width / 2, height / 2 - 50);
  textSize(24);
  text("Score: " + actualScore, width / 2, height / 2);
  textSize(16);
  text("Presiona cualquier tecla para volver al inicio", width / 2, height / 2 + 50);
}

function loadImages(spriteName, n_images, i = 0, images = []) {
  if(i == n_images){
    return images;
  }
  let imagePath = spritesRootPath + spriteName + "_" + (i+1) + ".png";
  loadImage(imagePath, 
    (img) => {
      images.push(img);
      images = loadImages(spriteName, n_images, i+1, images);
    },
    () => "is this fails the whole thing breaks :)");
  return images
}