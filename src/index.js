import ThiccEngine, {ColorRGB, ColorHSV, FrameBuffer} from "./thiccengine.js"
import WebRenderTarget from "./renderer.js"
import {Tri, Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 300
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30

let frameBuffer, renderTarget, scene

function init () {
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    renderTarget = new WebRenderTarget(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    scene = [
        new Tri(
            new Vector3(100, 100, 0),
            new Vector3(100, 0, 100),
            new Vector3(0, 100, 100)
        )
    ]
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    ThiccEngine.fill(frameBuffer, new ColorRGB(0, 0, 0))
    for (let thetaDegrees = 0; thetaDegrees < 360; thetaDegrees += 5) {
        const thetaRadians = (thetaDegrees / 360) * 2 * Math.PI
        const deltaX = Math.cos(thetaRadians) * 100
        const deltaY = Math.sin(thetaRadians) * 100
        ThiccEngine.drawLine(frameBuffer, 150, 150, 150 + deltaX, 150 + deltaY, new ColorHSV(thetaDegrees, 1, 1))
    }
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
