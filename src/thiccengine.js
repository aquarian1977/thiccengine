const BYTES_PER_PIXEL = 4

class FrameBuffer {
    constructor (width = 320, height = 200) {
        this.data = new Uint8ClampedArray(width * height * BYTES_PER_PIXEL)
        this.width = width
        this.heigh = height
        this.colorDepth = BYTES_PER_PIXEL
    }
}

function fill (buffer, colorBytes) {
    for (let i = 0; i < buffer.data.length; i += 1) {
        buffer.data[i] = colorBytes[i % buffer.colorDepth]
    }
}

function drawPixel (buffer, x, y, colorBytes) {
    if (x >= buffer.width || y >= buffer.height) return
    const bufferIndex = (y * buffer.width * buffer.colorDepth) + (x * buffer.colorDepth)
    colorBytes.forEach((colorByte, byteIndex) => {
        buffer.data[bufferIndex + byteIndex] = colorByte
    })
}

function drawRect (buffer, x, y, width, height, colorBytes) {
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            drawPixel(buffer, x + j, y + i, colorBytes)
        }
    }
}

export default {FrameBuffer, drawPixel, drawRect, fill}
