const PROJECTION_SCALE_PIXELS_PER_UNIT = 100

class ColorRGB extends Uint8ClampedArray {
    constructor (r = 0, g = 0, b = 0, a = 255) {
        super([r, g, b, a])
    }
}

class ColorHSV extends ColorRGB {
    constructor (rawH = 0, s = 1, v = 1) {
        // Taken from https://www.rapidtables.com/convert/color/hsv-to-rgb.html
        // Conversion decides primary hue then mixes other colors to hit saturation and value
        const h = rawH % 360 // Clamp h to below 360
        const c = s * v
        const m = v - c
        const x = c * (1 - Math.abs(((h/60) % 2) - 1))
        let rprime = 0, gprime = 0, bprime = 0
        if (h >= 0 && h < 60) {
            rprime = c, gprime = x, bprime = 0
        } else if (h >= 60 && h < 120) {
            rprime = x, gprime = c, bprime = 0
        } else if (h >= 120 && h < 180) {
            rprime = 0, gprime = c, bprime = x
        } else if (h >= 180 && h < 240) {
            rprime = 0, gprime = x, bprime = c
        } else if (h >= 240 && h < 300) {
            rprime = x, gprime = 0, bprime = c
        } else if (h >= 300 && h < 360) {
            rprime = c, gprime = 0, bprime = x
        }
        super((rprime + m) * 255, (gprime + m) * 255, (bprime + m) * 255)
    }
}

class FrameBuffer {
    constructor (width = 320, height = 200) {
        this.bytesPerPixel = 4
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
            drawPixel(buffer, Math.round(x), Math.round(y), color)
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
            drawPixel(buffer, Math.round(x), Math.round(y), color)
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

// TODO: Break colors out into own file, differentiate raster functions (buffer-space) from rendering operations (scene-space)
// TODO: Ensure vector rotations follow convention for left-handed coordinate system
function drawVector(buffer, vector, origin, color) {
    const centerX = Math.round(buffer.width / 2) // Points at 0, 0, 0 should be drawn in the middle of the buffer
    const centerY = Math.round(buffer.height / 2)
    drawLine( // Embody left-handed coordinate system where x is rightward, y is upward, z is into screen
        buffer,
        centerX + origin.x * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - origin.y * PROJECTION_SCALE_PIXELS_PER_UNIT, // Y is upward, inverted compared to buffer
        centerX + (origin.x + vector.x) * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - (origin.y + vector.y) * PROJECTION_SCALE_PIXELS_PER_UNIT,
        color
    )
}

function drawScene (buffer, scene, color) {
    // Render just x/y to effectively 2D project from front, treat 1 unit as 1 pixel, round to pixels
    scene.forEach((tri) => {
        drawPixel(buffer, Math.round(tri.p1.x), Math.round(tri.p1.y), color)
        drawPixel(buffer, Math.round(tri.p2.x), Math.round(tri.p2.y), color)
        drawPixel(buffer, Math.round(tri.p3.x), Math.round(tri.p3.y), color)
    })
}

export {ColorRGB, ColorHSV, FrameBuffer}
export default {drawScene, drawPixel, drawLine, drawVector, drawRect, fill}
