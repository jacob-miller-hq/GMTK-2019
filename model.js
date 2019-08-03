'use strict';

class Model {
  constructor(w, h) {
    this.w = w
    this.h = h

    this.gravity = 0.4

    this.playerX = 2
    this.playerY = 2
    this.playerW = 1
    this.playerH = 1
    this.playerVX = 0
    this.playerVY = 0
    this.playerAcc = 0.5
    this.playerMaxSpeed = 1.6
    this.playerDrag = 0.2

    this.level = new Level()
  }

  get ratio() {
    return this.w / this.h
  }

  tick(buttonMap) {
    if('up' in buttonMap && buttonMap['up']) {
      this.playerVY -= this.playerAcc
    }
    if('down' in buttonMap && buttonMap['down']) {
      this.playerVY += this.playerAcc
    }
    if('left' in buttonMap && buttonMap['left']) {
      this.playerVX -= this.playerAcc
    }
    if('right' in buttonMap && buttonMap['right']) {
      this.playerVX += this.playerAcc
    }
    if('jump' in buttonMap && buttonMap['jump']) {
      // TODO
    }

    const unlimitedSpeed = Math.sqrt(this.playerVX * this.playerVX + this.playerVY * this.playerVY)
    if(unlimitedSpeed != 0) {
      let speed = unlimitedSpeed - this.playerDrag
      if(speed < 0) {
        speed = 0
      } else if(speed > this.playerMaxSpeed) {
        speed = this.playerMaxSpeed
      }
      this.playerVX = speed * this.playerVX / unlimitedSpeed
      this.playerVY = speed * this.playerVY / unlimitedSpeed
    }

    // add gravity after limiting speed
    // and jump? Not quite enjoyable yet.
    // this.playerVY += this.gravity

    this.playerX += this.playerVX
    this.playerY += this.playerVY

    if(this.playerX < 0) {
      this.playerX = 0
      this.playerVX = Math.max(this.playerVX, 0)
    }
    if(this.playerX + this.playerW > this.w) {
      this.playerX = this.w - this.playerW
      this.playerVX = Math.min(this.playerVX, 0)
    }
    if(this.playerY < 0) {
      this.playerY = 0
      this.playerVY = Math.max(this.playerVY, 0)
    }
    if(this.playerY + this.playerH > this.h) {
      this.playerY = this.h - this.playerH
      this.playerVY = Math.min(this.playerVY, 0)
    }
  }
}