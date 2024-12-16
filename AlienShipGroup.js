class AlienShipGroup {
    constructor(alienShipGrid) {
      this.alienShipGrid = alienShipGrid;
      this.movingRight = true;
      this.isFrozen = false;
      this.moveSpeed = -1;
      this.velu = 0;
      this.maxSpeed = 10;
      this.freezeActivation = 0;
      this.freezeDuration = 5000;
      this.oldvelocity = 0;
      this.alienShoot = [];
  
      for (let j = 0; j < alienShipGrid[alienShipGrid.length - 1].length; j++) {
        alienShipGrid[alienShipGrid.length - 1][j].canShoot = true;
      }
    }
  
    update() {
      let aliensAlive = false;
      if (millis() - this.freezeActivation > this.freezeDuration && this.isFrozen) {
        this.restorevelocity();
      }
  
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alienShip = this.alienShipGrid[i][j];
          if (alienShip != null) {
            aliensAlive = true;
            if (!ship.isDead) {
              alienShip.update();
            }
            push();
            if (this.isFrozen) {
              tint(0, 0, 200);
            }
            alienShip.render();
            pop();
            if (alienShip.isDeathAnimationFinished() && alienShip.isDead) {
              if (this.alienShipGrid[i][j].canShoot) {
                this.alienShipGrid[i][j].canShoot = false;
                this.lastShoot(this.alienShipGrid[i][j], j);
              }
              this.alienShipGrid[i][j] = null;
            }
          }
        }
      }
      if (!aliensAlive) win();
  
      if ((this.reachedRightEdge() && this.movingRight) || (this.reachedLeftEdge() && !this.movingRight)) {
        this.movingRight = !this.movingRight;
        this.change_direction();
        this.moveDown();
      }
      if (this.reachedSpaceCraftPos()) {
        gameOver();
      }
    }
  
    freezealienshipgorup() {
      this.isFrozen = true;
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alien = this.alienShipGrid[i][j];
          if (alien != null) {
            if (this.oldvelocity == 0) this.oldvelocity = alien.vel.x;
            alien.vel.x = 0;
          }
        }
      }
    }
  
    restorevelocity() {
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alien = this.alienShipGrid[i][j];
          if (alien != null) {
            alien.vel.x = this.oldvelocity;
          }
        }
      }
      this.oldvelocity = 0;
      this.isFrozen = false;
    }
  
    alienShoots(alien2) {
      for (let alien of this.alienShoot) {
        if (alien === alien2) {
          return true;
        }
      }
      return false;
    }
  
    lastShoot(alien2, currentColumnIndex) {
      if (currentColumnIndex !== -1) {
        for (let i = this.alienShipGrid.length - 1; i >= 0; i--) {
          let nextAlien = this.alienShipGrid[i][currentColumnIndex];
          if (nextAlien != null && nextAlien !== alien2) {
            nextAlien.canShoot = true;
            return;
          }
        }
      }
    }
  
    change_direction() {
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alienShip = this.alienShipGrid[i][j];
          if (alienShip != null) {
            alienShip.vel.x *= this.moveSpeed;
          }
        }
      }
    }
  
    reachedRightEdge() {
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alienShip = this.alienShipGrid[i][j];
          if (alienShip != null) {
            if (alienShip.pos.x + alienShip.s_width >= width) {
              return true;
            }
          }
        }
      }
      return false;
    }
  
    reachedLeftEdge() {
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alienShip = this.alienShipGrid[i][j];
          if (alienShip != null) {
            if (alienShip.pos.x <= 0) {
              return true;
            }
          }
        }
      }
      return false;
    }
  
    reachedSpaceCraftPos() {
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alienShip = this.alienShipGrid[i][j];
          if (alienShip != null) {
            if (alienShip.pos.y + alienShip.s_height >= height * 0.85) {
              return true;
            }
          }
        }
      }
      return false;
    }
  
    moveDown() {
      for (let i = 0; i < this.alienShipGrid.length; i++) {
        for (let j = 0; j < this.alienShipGrid[i].length; j++) {
          let alien = this.alienShipGrid[i][j];
          if (alien != null) {
            alien.pos.y += alien.s_height / 2;
            if (abs(alien.vel.x) < 3) {
              alien.vel.x *= 1.2;
            } else if (abs(alien.vel.x) < 6) {
              alien.vel.x *= 1.15;
            } else if (abs(alien.vel.x) < this.maxSpeed) {
              alien.vel.x *= 1.08;
            }
          }
        }
      }
    }
  }