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
    if (x >= buffer.width || y >= buffer.height) return
    const bufferIndex = (y * buffer.width * buffer.bytesPerPixel) + (x * buffer.bytesPerPixel)
    for(let i = 0; i < buffer.bytesPerPixel; i += 1) {
        buffer.data[bufferIndex + i] = color[i] || 0
    }
}

function drawRect (buffer, x, y, width, height, color) {
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            drawPixel(buffer, x + j, y + i, color)
        }
    }
}

export {Color, FrameBuffer}
export default {drawPixel, drawRect, fill}
