//Space Invaders (prototipo) - Tarea 1 - Computación visual 2024-2

// Variables globales principales
let ship; // La nave del jugador
let alienGroup; // Grupo de alienígenas
let myBullets = []; // Balas del jugador
let enemyBullets = []; // Balas de los enemigos

// Recursos gráficos y sonoros
let fondo; // Imagen de fondo
let imagesShip = [], imagesAliens = []; // Imágenes para la nave y alienígenas
// let soundShoot, soundExplosion; // Efectos de sonido

// Estado del juego
let gameStarted = false; // Si el juego ha comenzado
let gameOver = false; // Si el jugador perdió
let winner = false; // Si el jugador ganó
let score = 0; // Puntaje actual

function preload() {
  // Cargar imágenes y sonidos con loadImage() y loadSound()
  // fondo
  // imagesShip
  // imagesAliens
  // soundShoot
  // soundExplosion
}

function setup() {
  // Configuración inicial del juego
  createCanvas(800, 600);
  loadResources(); // Cargar imágenes y sonidos
  initGame(); // Configurar el estado inicial del juego
}

function draw() {   // Bucle principal del juego
  if (!gameStarted) {
    // Mostrar la pantalla de inicio
    startScreen();
  } else if (gameOver) {
    // Mostrar la pantalla de "Game Over"
    gameOverScreen();
  } else if (winner) {
    // Mostrar la pantalla de victoria
    winScreen();
  } else {
    // Dibujar el juego en curso
    background(fondo || 0); // Dibujar fondo
    renderShip(); // Dibujar la nave del jugador
    renderAliens(); // Dibujar los alienígenas
    renderBullets(); // Dibujar las balas
    checkCollisions(); // Verificar colisiones
    updateScore(); // Actualizar puntaje
  }
}

function keyPressed() {
  // Manejar interacciones del jugador con el teclado
  if (!gameStarted || gameOver) {
    // Comenzar o reiniciar el juego
    startGame();
  } else {
    // Controlar la nave del jugador
    shipControl(keyCode, true);
  }
}

function keyReleased() {
  // Manejar liberación de teclas
  if (gameStarted) {
    shipControl(keyCode, false);
  }
}

function loadResources() {
  // Placeholder para cargar imágenes y sonidos
}

function initGame() {
  // Configurar variables iniciales
  ship = new Ship(width / 2, height - 50); // Posicionar la nave
  alienGroup = new AlienShipGroup(5, 3); // Configurar una cuadrícula de alienígenas
  myBullets = [];
  enemyBullets = [];
  score = 0;
  gameStarted = true;
  gameOver = false;
  winner = false;
}

function startScreen() {
  // Dibujar la pantalla de inicio
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("Space Invaders", width / 2, height / 2 - 50);
  textSize(16);
  text("Presiona cualquier tecla para continuar", width / 2, height / 2 + 50);
}

function startGame() {  //Reiniciar variables y comenzar el juego
  initGame();
}

function gameOverScreen() {
  // Dibujar la pantalla de "Game Over"
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("GAME OVER", width / 2, height / 2 - 50);
  textSize(16);
  text("Presiona cualquier tecla para reiniciar", width / 2, height / 2 + 50);
}

function winScreen() {
  // Dibujar la pantalla de victoria
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("VICTORIA", width / 2, height / 2 - 50);
  textSize(16);
  text("Presiona cualquier tecla para jugar de nuevo", width / 2, height / 2 + 50);
}

function renderShip() {
  // Dibujar la nave del jugador
  ship.render();
}

function renderAliens() {
  // Dibujar los alienígenas
  alienGroup.render();
}

function renderBullets() {
  // Dibujar las balas
  for (let b of myBullets) {
    b.render();
  }
  for (let b of enemyBullets) {
    b.render();
  }
}

function checkCollisions() {
  // Verificar colisiones entre balas y alienígenas o la nave del jugador
}

function updateScore() {
  // Actualizar y mostrar el puntaje
  fill(255);
  textAlign(LEFT);
  textSize(16);
  text("Score: " + score, 10, 20);
}
