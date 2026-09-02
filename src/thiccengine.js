import Rasterer from "./rasterer.js"
import {ColorRGB} from "./colors.js"

const PROJECTION_SCALE_PIXELS_PER_UNIT = 50

function renderBackground (buffer, color) {
    Rasterer.rasterFill(buffer, color)
}

function renderVector (buffer, vector, origin, color) {
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

function renderLine (buffer, start, end, color) {
    const centerX = Math.round(buffer.width / 2) // Points at 0, 0, 0 should be drawn in the middle of the buffer
    const centerY = Math.round(buffer.height / 2)
    Rasterer.rasterLine(
        buffer,
        centerX + start.x * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - start.y * PROJECTION_SCALE_PIXELS_PER_UNIT, // Y is upward
        centerX + end.x * PROJECTION_SCALE_PIXELS_PER_UNIT,
        centerY - end.y * PROJECTION_SCALE_PIXELS_PER_UNIT,
        color
    )
}

function renderTri (buffer, tri) {
    renderLine(buffer, tri.p1, tri.p2, ColorRGB.RED)
    renderLine(buffer, tri.p2, tri.p3, ColorRGB.GREEN)
    renderLine(buffer, tri.p3, tri.p1, ColorRGB.BLUE)
}

export default {renderBackground, renderVector, renderLine, renderTri}
