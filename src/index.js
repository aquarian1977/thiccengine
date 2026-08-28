import ThiccEngine from "./thiccengine.js"
import WebRenderTarget from "./renderer.js"

const FRAME_WIDTH_PIXELS = 640
const FRAME_HEIGHT_PIXELS = 360
const COLOR_DARK_TEAL = [0, 63, 63, 255]
const COLOR_CYAN = [0, 255, 255, 255]
const COLOR_LIME = [0, 255, 0, 255]
const TARGET_FPS = 30

let frameBuffer, renderTarget

function init () {
    frameBuffer = new ThiccEngine.FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    renderTarget = new WebRenderTarget(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    ThiccEngine.fill(frameBuffer, COLOR_DARK_TEAL)
    ThiccEngine.drawPixel(frameBuffer, 0, 0, COLOR_CYAN)
    ThiccEngine.drawPixel(frameBuffer, 50, 50, COLOR_LIME)
    ThiccEngine.drawRect(frameBuffer, 600, 330, 50, 50, COLOR_LIME)
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
