import ThiccEngine, {Color, FrameBuffer} from "./thiccengine.js"
import WebRenderTarget from "./renderer.js"
import {Tri, Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 640
const FRAME_HEIGHT_PIXELS = 360
const COLOR_DARK_TEAL = new Color(0, 63, 63)
const COLOR_LIME = new Color(0, 255, 0)
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
    ThiccEngine.fill(frameBuffer, COLOR_DARK_TEAL)
    ThiccEngine.drawScene(frameBuffer, scene, COLOR_LIME)
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
