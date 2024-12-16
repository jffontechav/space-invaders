class PowerUp {
    constructor(type, pos, s_width, s_height, vel, image) {
      this.type = type;
      this.pos = pos.copy();
      this.s_width = s_width;
      this.s_height = s_height;
      this.vel = vel;
      this.image = image;
      this.active = true;
    }
  
    // Método render para dibujar el power-up
    render() {
      image(this.image, this.pos.x, this.pos.y, this.s_width, this.s_height);
    }
  
    // Método update para actualizar el power-up
    update() {
      this.pos.add(this.vel);
    }
  }