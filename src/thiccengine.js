class Color extends Uint8ClampedArray {
    static BYTE_LENGTH = 4
    constructor (r = 0, g = 0, b = 0, a = 255) {
        super([r, g, b, a])
    }
}

class FrameBuffer {
    constructor (width = 320, height = 200) {
        this.bytesPerPixel = Color.BYTE_LENGTH
        this.data = new Uint8ClampedArray(width * height * this.bytesPerPixel)
        this.width = width
        this.height = height
    }
}

function fill (buffer, color) {
    for (let i = 0; i < buffer.data.length; i += 1) {
        buffer.data[i] = color[i % buffer.bytesPerPixel] || 0
    }
}

function drawPixel (buffer, x, y, color) {
    if (x < 0 || y < 0 || x >= buffer.width || y >= buffer.height) return
    const bufferIndex = (y * buffer.width * buffer.bytesPerPixel) + (x * buffer.bytesPerPixel)
    for(let i = 0; i < buffer.bytesPerPixel; i += 1) {
        buffer.data[bufferIndex + i] = color[i] || 0
    }
}

function drawLine (buffer, x1, y1, x2, y2, color) {
    if (Math.abs(x2 - x1) > 0 && Math.abs((y2 - y1)/(x2 - x1)) <= 1) {
        const increasingX = x2 > x1
        const initX = increasingX ? x1 : x2
        const finalX = increasingX ? x2 : x1
        const deltaX = finalX - initX
        const initY = increasingX ? y1 : y2
        const finalY = increasingX ? y2 : y1
        const deltaY = finalY - initY
        const gradient = deltaY/deltaX
        for (let x = initX; x <= finalX; x += 1) {
            let y = (gradient * (x - initX)) + initY
            drawPixel(buffer, x, Math.round(y), color)
        }
    } else if (Math.abs(y2 - y1) > 0 && Math.abs((x2 - x1)/(y2 - y1)) <= 1) {
        const increasingY = y2 > y1
        const initY = increasingY ? y1 : y2
        const finalY = increasingY ? y2 : y1
        const deltaY = finalY - initY
        const initX = increasingY ? x1 : x2
        const finalX = increasingY ? x2 : x1
        const deltaX = finalX - initX
        const gradient = deltaX/deltaY
        for (let y = initY; y <= finalY; y += 1) {
            let x = (gradient * (y - initY)) + initX
            drawPixel(buffer, Math.round(x), y, color)
        }
    }
}

function drawRect (buffer, x, y, width, height, color) {
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            drawPixel(buffer, x + j, y + i, color)
        }
    }
}

function drawScene (buffer, scene, color) {
    // Render just x/y to effectively 2D project from front, treat 1 unit as 1 pixel, round to pixels
    scene.forEach((tri) => {
        drawPixel(buffer, Math.round(tri.p1.x), Math.round(tri.p1.y), color)
        drawPixel(buffer, Math.round(tri.p2.x), Math.round(tri.p2.y), color)
        drawPixel(buffer, Math.round(tri.p3.x), Math.round(tri.p3.y), color)
    })
}

export {Color, FrameBuffer}
export default {drawScene, drawPixel, drawLine, drawRect, fill}
