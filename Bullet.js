class Bullet {
    constructor(pos, vel, b_width, b_height, col) {
      this.pos = pos.copy();
      this.vel = vel.copy().limit(this.maxVelocity);
      this.b_width = b_width;
      this.b_height = b_height;
      this.col = col;
      this.maxVelocity = 12;
    }
  
    // Método render para dibujar la bala
    render() {
      fill(this.col);
      rect(this.pos.x, this.pos.y, this.b_width, this.b_height);
    }
  
    // Método update para actualizar la posición de la bala
    update() {
      this.pos.add(this.vel);
    }
  }