import Rasterer from "./rasterer.js"

const PROJECTION_SCALE_PIXELS_PER_UNIT = 100

function renderBackground (buffer, color) {
    Rasterer.rasterFill(buffer, color)
}

function renderVector(buffer, vector, origin, color) {
    const centerX = Math.round(buffer.width / 2) // Points at 0, 0, 0 should be drawn in the middle of the buffer
    const centerY = Math.round(buffer.height / 2)
    Rasterer.rasterLine( // Embody left-handed coordinate system where x is rightward, y is upward, z is into screen
        buffer,
        centerX + origin.x * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - origin.y * PROJECTION_SCALE_PIXELS_PER_UNIT, // Y is upward, inverted compared to buffer
        centerX + (origin.x + vector.x) * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - (origin.y + vector.y) * PROJECTION_SCALE_PIXELS_PER_UNIT,
        color
    )
}

export default {renderBackground, renderVector}
