const BYTES_PER_PIXEL = 4

function createFrameBuffer (width, height) {
    return {
        data: new Uint8ClampedArray(width * height * BYTES_PER_PIXEL),
        width: width,
        height: height,
        colorDepth: BYTES_PER_PIXEL
    }
}

function putPixel (buffer, x, y, colorBytes) {
    if (x >= buffer.width || y >= buffer.height) return
    const bufferIndex = (y * buffer.width * buffer.colorDepth) + (x * buffer.colorDepth)
    colorBytes.forEach((colorByte, byteIndex) => {
        buffer.data[bufferIndex + byteIndex] = colorByte
    })
}

function putRect (buffer, x, y, width, height, colorBytes) {
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            putPixel(buffer, x + j, y + i, colorBytes)
        }
    }
}

export default {createFrameBuffer, putPixel, putRect}
