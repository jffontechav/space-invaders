class AlienShip {
    constructor(type, pos, s_width, s_height, lifes, imagesAlive, imagesDead) {
      this.type = type;
      this.pos = pos.copy();
      this.vel = createVector(1, 0);
      this.lifes = lifes;
      this.s_width = s_width;
      this.s_height = s_height;
      this.imagesAlive = imagesAlive;
      this.imagesDead = imagesDead;
      this.maxImageStates = imagesAlive.length;
      this.isDead = false;
      this.canShoot = false;
      this.deadAnimStartTime = 0;
      this.deadAnimDuration = 1000;
      this.lastShotTime = 0;
      this.shotDelay = random(1500, 3000);
      this.lastMoveTime = 0;
      this.timeToMove = 1;
      this.imageDelay = 1000;
      this.prevMillis = 0;
      this.imageState = 0;
      this.newPowerUp = null;
  
      switch (type) {
        case 'alienA':
          this.scoreValue = 10;
          break;
        case 'alienB':
          this.scoreValue = 30;
          break;
        case 'alienC':
          this.scoreValue = 20;
          break;
        default:
          this.scoreValue = 0;
          break;
      }
    }
  
    isDeath() {
      if (!this.isDead) {
        for (let i = 0; i < myBullets.length; i++) {
          let bullet = myBullets[i];
          if ((bullet.pos.x + bullet.b_width >= this.pos.x && bullet.pos.x <= this.pos.x + this.s_width) &&
            bullet.pos.y <= this.pos.y + this.s_height && bullet.pos.y + bullet.b_height >= this.pos.y) {
            myBullets.splice(i, 1);
            this.startDeathAnimation();
            this.newPowerUp = this.spawnPowerUp();
            if (this.newPowerUp != null) {
              powerUps.push(this.newPowerUp);
            }
  
            if (doublePoints) {
              actualScore += this.scoreValue * 2;
            } else {
              actualScore += this.scoreValue;
            }
            return true;
          }
        }
      }
      return false;
    }
  
    startDeathAnimation() {
      this.isDead = true;
      this.deadAnimStartTime = millis();
      s.setVolume(0.1);
      soundinvader.play();
    }
  
    isDeathAnimationFinished() {
      return millis() - this.deadAnimStartTime > this.deadAnimDuration * this.imagesDead.length;
    }
  
    move() {
      if (millis() - this.lastMoveTime > this.timeToMove) {
        this.pos.add(this.vel);
        this.lastMoveTime = millis();
      }
    }
  
    shoot() {
      if (millis() - this.lastShotTime < this.shotDelay) return;
      let bulletVel = createVector(0, random(2, 4));
      let bulletPos = this.pos.copy().add(this.s_width / 2, 0);
      this.lastShotTime = millis();
      enemyBullets.push(new Bullet(bulletPos, bulletVel, 5, 10, color(200, 0, 50)));
    }
  
    spawnPowerUp() {
      let rand = random();
      let spawnProbability = 0.25;
      if (rand < spawnProbability) {
        let powerUpPos = createVector(this.pos.x, this.pos.y);
        let vel = random(1, 3);
        let powerUpVel = createVector(0, vel);
        let typePowerProb = random();
        let type = 0;
        let selected;
        if (typePowerProb < 0.20) {
          type = 0;
          selected = shield;
        } else if (typePowerProb < 0.34) {
          type = 1;
          selected = cadency;
        } else if (typePowerProb < 0.5) {
          type = 2;
          selected = doublepoints;
        } else if (typePowerProb < 0.7) {
          type = 3;
          selected = freeze;
        } else if (typePowerProb < 0.85) {
          type = 4;
          selected = speed;
        } else if (typePowerProb < 0.95) {
          type = 5;
          selected = nobullets;
        } else {
          type = 6;
          selected = extralife;
        }
        return new PowerUp(PowerUpType[type], powerUpPos, 32, 32, powerUpVel, selected);
      } else {
        return null;
      }
    }
  
    update() {
      this.move();
      if (this.canShoot) {
        this.shoot();
      }
      this.isDeath();
      if (millis() - this.prevMillis > this.imageDelay) {
        this.imageState = (this.imageState + 1) % this.maxImageStates;
        this.prevMillis = millis();
      }
    }
  
    render() {
      if (this.isDead) {
        let elapsedTime = millis() - this.deadAnimStartTime;
        if (elapsedTime < this.deadAnimDuration) {
          image(this.imagesDead[0], this.pos.x, this.pos.y, this.s_width, this.s_height);
        }
      } else {
        image(this.imagesAlive[this.imageState], this.pos.x, this.pos.y, this.s_width, this.s_height);
      }
    }
  }