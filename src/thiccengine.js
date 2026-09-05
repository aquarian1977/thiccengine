import { ColorRGB } from "./colors.js"
import { Vector3 } from "./geometry.js"
import Rasterer from "./rasterer.js"

const PROJECTION_SCALE_PIXELS_PER_UNIT = 10

function renderBackground (buffer, color) {
    Rasterer.rasterFill(buffer, color)
}

function renderWorldBackground (buffer, skyColor, groundColor) {
    Rasterer.rasterFillRect(buffer, 0, 0, buffer.width, buffer.centerY, skyColor)
    Rasterer.rasterFillRect(buffer, 0, buffer.centerY, buffer.width, buffer.height, groundColor)
}

function renderAxes (buffer, color) {
    Rasterer.rasterLine(buffer, buffer.centerX, 0, buffer.centerX, buffer.height, color)
    Rasterer.rasterLine(buffer, 0, buffer.centerY, buffer.width, buffer.centerY, color)
}

function renderLine (buffer, start, end, color) { // Assumes start and end are in scene space
    Rasterer.rasterLine(
        buffer,
        buffer.centerX + start.x * PROJECTION_SCALE_PIXELS_PER_UNIT,
        buffer.centerY - start.y * PROJECTION_SCALE_PIXELS_PER_UNIT, // Y is upward
        buffer.centerX + end.x * PROJECTION_SCALE_PIXELS_PER_UNIT,
        buffer.centerY - end.y * PROJECTION_SCALE_PIXELS_PER_UNIT,
        color
    )
}

function renderTri (buffer, tri) {
    renderLine(buffer, tri.p1, tri.p2, tri.color)
    renderLine(buffer, tri.p2, tri.p3, tri.color)
    renderLine(buffer, tri.p3, tri.p1, tri.color)
}

function renderProjectedPoint (buffer, vector, camera, color) {
    const anglePerPixel = buffer.width / camera.fov
    const triCenterX = (vector.x / vector.z) * anglePerPixel
    const triCenterY = (vector.y / vector.z) * anglePerPixel
    Rasterer.rasterPixel(
        buffer,
        Math.round(buffer.centerX + triCenterX),
        Math.round(buffer.centerY - triCenterY),
        color
    )
}

function renderProjectedLine (buffer, start, end, camera, color) {
    const anglePerPixel = buffer.width / camera.fov
    const screenXStart = (start.x / start.z) * anglePerPixel
    const screenYStart = (start.y / start.z) * anglePerPixel
    const screenXEnd = (end.x / end.z) * anglePerPixel
    const screenYEnd = (end.y / end.z) * anglePerPixel

    Rasterer.rasterLine(
        buffer,
        Math.round(buffer.centerX + screenXStart),
        Math.round(buffer.centerY - screenYStart),
        Math.round(buffer.centerX + screenXEnd),
        Math.round(buffer.centerY - screenYEnd),
        color
    )
}

function renderProjectedTri (buffer, tri, camera) {
    [[tri.p1, tri.p2], [tri.p2, tri.p3], [tri.p3, tri.p1]].forEach(([start, end]) => {
        renderProjectedLine(buffer, start, end, camera, tri.color)
    })
    renderProjectedNormal(buffer, tri, camera)
}

function renderProjectedNormal (buffer, tri, camera) {
    const triCenter = tri.getCenter()
    const triNormal = tri.getNormal()
    const mag = triNormal.getMagnitude()
    const unitNormal = triNormal.getUnitized()
    renderProjectedLine(
        buffer,
        triCenter,
        unitNormal.getTranslated(triCenter), // tri.getNormal().getUnitized().getTranslated(triCenter),
        camera,
        ColorRGB.WHITE
    )
}

export default {
    renderBackground,
    renderWorldBackground,
    renderAxes,
    renderLine,
    renderTri,
    renderProjectedPoint,
    renderProjectedLine,
    renderProjectedTri
}
