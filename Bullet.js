class Bullet {
  constructor(pos, vel, b_width, b_height, col) {
    this.pos = pos.copy();
    this.vel = vel.copy().limit(this.maxVelocity);
    this.b_width = b_width;
    this.b_height = b_height;
    this.col = col;
    this.maxVelocity = 12;
    this.isActive = true; // Nueva propiedad para manejar estado activo
  }

  render() {
    if (this.isActive) {
      fill(this.col);
      rect(this.pos.x, this.pos.y, this.b_width, this.b_height);
    }
  }

  update() {
    this.pos.add(this.vel);
    if (this.isOutOfBounds()) {
      this.isActive = false; // Desactiva la bala si está fuera de pantalla
    }
  }

  isOutOfBounds() {
    return (
      this.pos.y + this.b_height < 0 || // Fuera por arriba
      this.pos.y > height || // Fuera por abajo
      this.pos.x + this.b_width < 0 || // Fuera por izquierda
      this.pos.x > width // Fuera por derecha
    );
  }
}
