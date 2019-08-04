'use strict';


class View {
  constructor(canvas) {
    this._cvs = canvas
    this._initView()
    this.background = "#000000"
  }

  _initView() {
    this._ctx = this._cvs.getContext('2d')
  }

  setBounds(x1, y1, x2, y2) {
    this._l = x1
    this._t = y1
    this._r = x2
    this._b = y2
  }

  setTileSheet(tileSheet, tileSize = 16) {
    this.tileSheet = new SpriteSheet(tileSheet, tileSize)

    console.log('spritesheet:',
      `${tileSheet.naturalWidth}x${tileSheet.naturalHeight}`,
      `(${this.tileSheet.numColumns}x${this.tileSheet.numRows})`)
  }

  xywhToCvsXYWH(x, y, w, h) {
    const mw = this._r - this._l
    const mh = this._b - this._t
    return [
      Math.round((x - this._l) / mw * this._w),
      Math.round((y - this._t) / mh * this._h),
      w / mw * this._w,
      h / mh * this._h
    ]
  }

  indexToCvsXYWH(idx, c) {
    const x = idx % c
    const y = Math.floor(idx / c)
    return this.xywhToCvsXYWH(x, y, 1, 1)
  }

  clear() {
    this._ctx.fillStyle = this.background
    this._ctx.fillRect(0, 0, this._w, this._h)
  }

  drawWorld(texIdxs, c) {
    for (let i = 0; i < texIdxs.length; i++) {
      const texIdx = texIdxs[i]
      this._ctx.drawImage(this.tileSheet.img,
        ...this.tileSheet.indexToXYWH(texIdx),
        ...this.indexToCvsXYWH(i, c))
    }
  }

  drawBackground(backgroundImage) {
    this._ctx.drawImage(backgroundImage, 0, 0, this._w, this._h, 0, 0, this._w, this._h)
  }

  drawEntity(x, y, w, h, spriteSheet = null, tick = 0, framesPerState = 20) {
    if (spriteSheet) {
      const numStates = spriteSheet.numSprites
      const animState = Math.floor(tick / framesPerState) % numStates
      const cvsCoords = this.xywhToCvsXYWH(x, y, w, h)
      cvsCoords[0] -= (spriteSheet.spriteSize - cvsCoords[2]) / 2
      cvsCoords[1] -= (spriteSheet.spriteSize - cvsCoords[3]) / 2
      cvsCoords.splice(2, 2, spriteSheet.spriteSize, spriteSheet.spriteSize)
      this._ctx.drawImage(spriteSheet.img,
        ...spriteSheet.indexToXYWH(animState),
        ...cvsCoords)
    } else {
      this._ctx.fillStyle = '#ff00ff'
      this._ctx.fillRect(...this.xywhToCvsXYWH(x, y, w, h))
    }
    // debug mode
    // this._ctx.fillStyle = '#ff00ff'
    // this._ctx.fillRect(...this.xywhToCvsXYWH(x, y, w, h))
  }

  // TODO Cannot for the life of me get the text to look good.
  // might have to make the dialog show up outside the canvas.
  drawDialogue(box, text) {
    this._ctx.drawImage(box.img, box.x, box.y)
    this._ctx.textAlign = 'center'
    if (!text.length) {
      text = [text]
    }
    text.forEach((line, idx) => {
      this._ctx.fillText(line, Math.round(box.textX), box.textY + box.textH * idx)
    })
  }

  resize(modelW, modelH, screenW, screenH) {
    this._w = this._cvs.width = modelW * this.tileSheet.spriteSize
    this._h = this._cvs.height = modelH * this.tileSheet.spriteSize
    this._cvs.style.width = `${screenW}px`
    this._cvs.style.height = `${screenH}px`
  }
}

class SpriteSheet {
  constructor(img, spriteSize) {
    this.img = img
    this._spriteSize = spriteSize
    if (img.naturalWidth % spriteSize != 0) {
      console.log(`bad tile sheet width: ${tileSheet.naturalWidth} % ${spriteSize} != 0`)
    }
    if (img.naturalHeight % spriteSize != 0) {
      console.log(`bad tile sheet height: ${tileSheet.naturalHeight} % ${spriteSize} != 0`)
    }
  }

  get numColumns() {
    return this.img.naturalWidth / this._spriteSize
  }

  get numRows() {
    return this.img.naturalHeight / this._spriteSize
  }

  get numSprites() {
    return this.numRows * this.numColumns
  }

  get spriteSize() {
    return this._spriteSize
  }

  indexToXYWH(idx) {
    return [
      idx % this.numColumns,
      Math.floor(idx / this.numColumns),
      1,
      1
    ].map(_ => _ * this.spriteSize)
  }
}
