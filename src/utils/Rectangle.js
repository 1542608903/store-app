const gap = 10;
const initValue = 100;

export class Rectangle {
  constructor(imageWidth, imageHeight) {
    const startX = (imageWidth - initValue) / 2;
    const startY = (imageHeight - initValue) / 2;
    this.startX = startX;
    this.startY = startY;
    this.endX = this.startX + initValue;
    this.endY = this.startY + initValue;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
  }

  get minX() {
    return Math.min(this.startX, this.endX);
  }

  get maxX() {
    return Math.max(this.startX, this.endX);
  }

  get minY() {
    return Math.min(this.startY, this.endY);
  }

  get maxY() {
    return Math.max(this.startY, this.endY);
  }

  get width() {
    return this.maxX - this.minX;
  }

  get height() {
    return this.maxY - this.minY;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.minX, this.minY);
    ctx.setLineDash([3, 2]);
    ctx.lineTo(this.maxX, this.minY);
    ctx.lineTo(this.maxX, this.maxY);
    ctx.lineTo(this.minX, this.maxY);
    ctx.lineTo(this.minX, this.minY);
    ctx.strokeStyle = '#409eff';
    ctx.lineWidth = 1;
    ctx.lineCap = 'square';
    ctx.stroke();
  }

  // 上1、下2、左4、右8
  // 得到上1、下2、左4、左上5、左下6、右8、右上9、右下10
  inGap(x, y) {
    let result = 0;
    if (
      Math.abs(this.minY - y) <= gap &&
      this.minX - gap <= x &&
      this.maxX + gap >= x
    ) {
      result += 1;
    }
    if (
      Math.abs(this.maxY - y) <= gap &&
      this.minX - gap <= x &&
      this.maxX + gap >= x
    ) {
      result += 2;
    }
    if (
      Math.abs(this.minX - x) <= gap &&
      this.minY - gap <= y &&
      this.maxY + gap >= y
    ) {
      result += 4;
    }
    if (
      Math.abs(this.maxX - x) <= gap &&
      this.minY - gap <= y &&
      this.maxY + gap >= y
    ) {
      result += 8;
    }
    return result;
  }

  mouseMoveChangePos(
    e,
    rect,
    startX,
    startY,
    endX,
    endY,
    clickX,
    clickY,
    canvas
  ) {
    const disX = e.clientX - rect.left - clickX;
    const disY = e.clientY - rect.top - clickY;
    if (startX + disX >= 0) {
      this.startX = startX + disX;
    }
    if (endX + disX <= this.imageWidth) {
      this.endX = endX + disX;
    }
    if (startY + disY >= 0) {
      this.startY = startY + disY;
    }
    if (endY + disY <= this.imageHeight) {
      this.endY = endY + disY;
    }
    canvas.style.cursor = 'move';
  }

  mouseMoveChangeSize(
    e,
    rect,
    startX,
    startY,
    endX,
    endY,
    clickX,
    clickY,
    inGap,
    canvas
  ) {
    const disX = e.clientX - rect.left - clickX;
    const disY = e.clientY - rect.top - clickY;
    if (
      endX + disX < startX ||
      endY + disY < startY ||
      startX + disX > endX ||
      startY + disY > endY
    ) {
      return;
    }

    switch (inGap) {
      case 1:
        canvas.style.cursor = 'n-resize';
        this.startY = startY + disY;
        break;
      case 2:
        canvas.style.cursor = 's-resize';
        this.endY = endY + disY;
        break;
      case 4:
        canvas.style.cursor = 'w-resize';
        this.startX = startX + disX;
        break;
      case 5:
        canvas.style.cursor = 'nw-resize';
        this.startX = startX + disX;
        this.startY = startY + disY;
        break;
      case 6:
        canvas.style.cursor = 'sw-resize';
        this.startX = startX + disX;
        this.endY = endY + disY;
        break;
      case 8:
        canvas.style.cursor = 'e-resize';
        this.endX = endX + disX;
        break;
      case 9:
        canvas.style.cursor = 'ne-resize';
        this.endX = endX + disX;
        this.startY = startY + disY;
        break;
      case 10:
        canvas.style.cursor = 'se-resize';
        this.endX = endX + disX;
        this.endY = endY + disY;
        break;
      default:
        canvas.style.cursor = 'default';
        break;
    }
  }
}
