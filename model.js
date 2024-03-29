'use strict';

class Model {
  constructor(level) {
    this.world = new World(level)
    this.w = this.world.numColumns
    this.h = this.world.numRows
    this.entities = []
    level.entities.forEach((id, idx) => {
      if(id) {
        this.entities.push(new Entity(
            idx % this.w + 6/16,
            Math.floor(idx / this.w) + 6/16,
            4/16,
            4/16,
            0.004,
            0.03,
            0.001,
            0.002
        ))
      }
    })
    this.gravity = level.gravity || 0.0

    if(level.player) {
      this.player = new Entity(...level.player.location, 10/16, 10/16)
    } else {
      this.player = new Entity(2, 2, 10/16, 10/16)
    }

    this.doors = level.doors
  }

  get ratio() {
    return this.w / this.h
  }
}

class Entity {
  constructor(x, y, w, h, acc=0.01, maxSpeed=0.1, drag=0.005, minDragSpeed=0.01, jumpSpeed=0) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.acc = acc
    this.maxSpeed = maxSpeed
    this.drag = drag
    this.minDragSpeed = minDragSpeed

    this.lx = x
    this.ly = y
    this.jumpSpeed = jumpSpeed
    this._collisionPoints = this.generateCollisionPoints()
  }

  get cx() {
    return this.x + this.w / 2
  }

  get cy() {
    return this.y + this.h / 2
  }

  collisionPoint(idx) {
    return [
      this._collisionPoints[idx][0] + this.x,
      this._collisionPoints[idx][1] + this.y
    ]
  }

  generateCollisionPoints() {
    const array = [
      [0, 0],
      [0, this.h],
      [this.w, 0]
    ]
    for(let i = 1; i < this.w; i++) {
      array.push([i, 0     ])  // along the top
      array.push([i, this.h])  // along the bottom
    }
    for(let j = 1; j < this.h; j++) {
      array.push([     0, j])  // along the left
      array.push([this.w, j])  // along the right
    }
    array.push([this.w, this.h])  // bottom right corner, jic
    return array
  }
}