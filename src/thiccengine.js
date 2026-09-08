import { ColorRGB } from "./colors.js"
import { Vector3, Tri } from "./geometry.js"
import Rasterer from "./rasterer.js"

const PROJECTION_SCALE_PIXELS_PER_UNIT = 8
const NORMAL_LENGTH_UNITS = 0.25

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
    renderProjectedLine(
        buffer,
        triCenter,
        tri.getUnitNormal().getScaled(NORMAL_LENGTH_UNITS).getTranslated(triCenter),
        camera,
        tri.color
    )
}

function getSubdividedByPlane (tri, planeOrigin, planeNormal) {
    const points = [tri.p1, tri.p2, tri.p3]
    const pointsInFront = points.filter(point =>
        getAngleToPlane(point, planeOrigin, planeNormal) < Vector3.ANGLE_90
    )
    const pointsBehind = points.filter(point =>
        getAngleToPlane(point, planeOrigin, planeNormal) >= Vector3.ANGLE_90
    )

    if (pointsInFront.length == 3) {
        return [tri]
    } else if (pointsInFront.length == 2 && pointsBehind.length == 1) {
        const pf1 = pointsInFront[0], pf2 = pointsInFront[1], pb = pointsBehind[0]
        const p1Intersection = getIntersectionPoint(pf1, pb, planeOrigin, planeNormal)
        const p2Intersection = getIntersectionPoint(pf2, pb, planeOrigin, planeNormal)
        return [
            new Tri(pf1, p1Intersection, p2Intersection, tri.color),
            new Tri(p2Intersection, pf2, pf1, tri.color)
        ]
    } else if (pointsInFront.length == 1 && pointsBehind.length == 2) {
        const pf = pointsInFront[0], pb1 = pointsBehind[0], pb2 = pointsBehind[1]
        const p1Intersection = getIntersectionPoint(pf, pb1, planeOrigin, planeNormal)
        const p2Intersection = getIntersectionPoint(pf, pb2, planeOrigin, planeNormal)
        return [
            new Tri(pf, p1Intersection, p2Intersection, tri.color)
        ]
    } else { // Cull if behind plane
        return []
    }
}

function getAngleToPlane (vector, planeOrigin, planeNormal) {
    return planeNormal.getAngleWith(planeOrigin.getVectorTo(vector))
}

function getIntersectionPoint (start, end, planeOrigin, planeNormal) {
    const edge = start.getVectorTo(end)
    const dotStart = planeNormal.getDotProduct(start.getVectorTo(planeOrigin))
    const dotEnd = planeNormal.getDotProduct(end.getVectorTo(planeOrigin))
    const intersectionFactor = dotStart / (dotStart - dotEnd)
    return start.getTranslated(edge.getScaled(intersectionFactor))
}

export default {
    renderBackground,
    renderWorldBackground,
    renderAxes,
    renderLine,
    renderTri,
    renderProjectedPoint,
    renderProjectedLine,
    renderProjectedTri,
    getAngleToPlane,
    getSubdividedByPlane
}
