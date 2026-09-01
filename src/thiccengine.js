const PROJECTION_SCALE_PIXELS_PER_UNIT = 100

class FrameBuffer {
    constructor (width = 320, height = 200) {
        this.bytesPerPixel = 4
        this.data = new Uint8ClampedArray(width * height * this.bytesPerPixel)
        this.width = width
        this.height = height
    }
}

function rasterFill (buffer, color) {
    for (let i = 0; i < buffer.data.length; i += 1) {
        buffer.data[i] = color[i % buffer.bytesPerPixel] || 0
    }
}

function rasterPixel (buffer, x, y, color) {
    if (x < 0 || y < 0 || x >= buffer.width || y >= buffer.height) return
    const bufferIndex = (y * buffer.width * buffer.bytesPerPixel) + (x * buffer.bytesPerPixel)
    for(let i = 0; i < buffer.bytesPerPixel; i += 1) {
        buffer.data[bufferIndex + i] = color[i] || 0
    }
}

function rasterLine (buffer, x1, y1, x2, y2, color) {
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
            rasterPixel(buffer, Math.round(x), Math.round(y), color)
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
            rasterPixel(buffer, Math.round(x), Math.round(y), color)
        }
    }
}

function rasterFillRect (buffer, x, y, width, height, color) {
    for (let i = 0; i < height; i += 1) {
        for (let j = 0; j < width; j += 1) {
            rasterPixel(buffer, x + j, y + i, color)
        }
    }
}

// TODO: Break colors out into own file, differentiate raster functions (buffer-space) from rendering operations (scene-space)
// TODO: Ensure vector rotations follow convention for left-handed coordinate system
function renderVector(buffer, vector, origin, color) {
    const centerX = Math.round(buffer.width / 2) // Points at 0, 0, 0 should be drawn in the middle of the buffer
    const centerY = Math.round(buffer.height / 2)
    rasterLine( // Embody left-handed coordinate system where x is rightward, y is upward, z is into screen
        buffer,
        centerX + origin.x * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - origin.y * PROJECTION_SCALE_PIXELS_PER_UNIT, // Y is upward, inverted compared to buffer
        centerX + (origin.x + vector.x) * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - (origin.y + vector.y) * PROJECTION_SCALE_PIXELS_PER_UNIT,
        color
    )
}

export {FrameBuffer}
export default {rasterPixel, rasterLine, renderVector, rasterFillRect, rasterFill}
