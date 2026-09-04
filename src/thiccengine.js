import Rasterer from "./rasterer.js"

const PROJECTION_SCALE_PIXELS_PER_UNIT = 10

function renderBackground (buffer, color) {
    Rasterer.rasterFill(buffer, color)
}

function renderAxes (buffer, color) {
    const centerX = Math.round(buffer.width / 2)
    const centerY = Math.round(buffer.height / 2)
    Rasterer.rasterLine(buffer, centerX, 0, centerX, buffer.height, color)
    Rasterer.rasterLine(buffer, 0, centerY, buffer.width, centerY, color)
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
    renderLine(buffer, tri.p1, tri.p2, tri.color)
    renderLine(buffer, tri.p2, tri.p3, tri.color)
    renderLine(buffer, tri.p3, tri.p1, tri.color)
}

export default {renderBackground, renderAxes, renderLine, renderTri}
