import ThiccEngine, {ColorRGB, ColorHSV, FrameBuffer} from "./thiccengine.js"
import WebRenderTarget from "./renderer.js"
import {Tri, Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 300
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30
const ROTATION_PER_FRAME_RADIANS = 2 * Math.PI / 135

let frameBuffer, renderTarget, sceneXRotationRadians, sceneYRotationRadians

function init () {
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    renderTarget = new WebRenderTarget(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    sceneXRotationRadians = 0
    sceneYRotationRadians = 0
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    ThiccEngine.fill(frameBuffer, new ColorRGB(0, 0, 0))
    for (let thetaDegrees = 0; thetaDegrees < 360; thetaDegrees += 5) {
        const origin = new Vector3(150, 150, 0)
        const thetaRadians = (thetaDegrees / 360) * 2 * Math.PI
        const deltaX = Math.cos(thetaRadians) * 100
        const deltaY = Math.sin(thetaRadians) * 100

        const line = new Vector3(origin.x + deltaX, origin.y + deltaY, 0)
        const xRotatedLine = line.getRotatedAboutX(sceneXRotationRadians, origin)
        const xyRotatedLine = xRotatedLine.getRotatedAboutY(sceneYRotationRadians, origin)

        ThiccEngine.drawLine(frameBuffer, origin.x, origin.y, xyRotatedLine.x, xyRotatedLine.y, new ColorHSV(thetaDegrees, 1, 1))
    }
    renderTarget.display(frameBuffer)
    sceneXRotationRadians = (sceneXRotationRadians + ROTATION_PER_FRAME_RADIANS) % (2 * Math.PI)
    sceneYRotationRadians = (sceneXRotationRadians + ROTATION_PER_FRAME_RADIANS * 1.3) % (2 * Math.PI)
}

document.addEventListener("DOMContentLoaded", init)
