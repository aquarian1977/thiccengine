import ThiccEngine, {FrameBuffer} from "./thiccengine.js"
import WebRenderTarget from "./renderer.js"
import {ColorRGB, ColorHSV} from "./colors.js"
import {Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 300
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30

let frameBuffer, renderTarget

function init () {
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    renderTarget = new WebRenderTarget(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    ThiccEngine.fill(frameBuffer, ColorRGB.BLACK)
    // Three vectors, unit length, in +x, +y, +z, centered on the origin
    const sceneOrigin = new Vector3(0, 0, 0)
    ThiccEngine.drawVector(frameBuffer, new Vector3(1, 0, 0), sceneOrigin, ColorRGB.RED)
    ThiccEngine.drawVector(frameBuffer, new Vector3(0, 1, 0), sceneOrigin, ColorRGB.GREEN)
    ThiccEngine.drawVector(frameBuffer, new Vector3(0, 0, 1), sceneOrigin, ColorRGB.BLUE)
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
