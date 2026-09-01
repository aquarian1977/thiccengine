import ThiccEngine, {Color, FrameBuffer} from "./thiccengine.js"
import WebRenderTarget from "./renderer.js"
import {Tri, Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 300
const FRAME_HEIGHT_PIXELS = 300
const COLOR_DARK_TEAL = new Color(0, 63, 63)
const COLOR_LIME = new Color(0, 255, 0)
const TARGET_FPS = 30
const ANGLE_PER_FRAME = 2 * Math.PI / 180

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
    ThiccEngine.fill(frameBuffer, new Color(0, 0, 0))
    ThiccEngine.drawLine(frameBuffer, 150, 150, 150, 150, new Color(255, 255, 255))
    renderTarget.display(frameBuffer)

    ThiccEngine.drawLine(frameBuffer, 150, 150, 250, 150, new Color(255, 0, 0))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 221, 221, new Color(0, 0, 255))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 221, 79, new Color(0, 0, 255))
    renderTarget.display(frameBuffer)

    ThiccEngine.drawLine(frameBuffer, 150, 150, 50, 150, new Color(255, 0, 0))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 79, 221, new Color(0, 0, 255))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 79, 79, new Color(0, 0, 255))
    renderTarget.display(frameBuffer)

    ThiccEngine.drawLine(frameBuffer, 150, 150, 150, 250, new Color(255, 0, 0))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 188, 242, new Color(0, 255, 0))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 112, 242, new Color(0, 255, 0))
    renderTarget.display(frameBuffer)

    ThiccEngine.drawLine(frameBuffer, 150, 150, 150, 50, new Color(255, 0, 0))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 188, 58, new Color(0, 255, 0))
    renderTarget.display(frameBuffer)
    ThiccEngine.drawLine(frameBuffer, 150, 150, 112, 58, new Color(0, 255, 0))
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
