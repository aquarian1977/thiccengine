import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine from "./thiccengine.js"
import {ColorRGB} from "./colors.js"
import {Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 300
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30

let renderTarget, frameBuffer

// TODO: Differentiate raster functions (buffer-space) from rendering operations (scene-space)
// TODO: Ensure vector rotations follow convention for left-handed coordinate system
function init () {
    renderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    const sceneOrigin = new Vector3(0, 0, 0)
    ThiccEngine.renderBackground(frameBuffer, ColorRGB.BLACK)
    ThiccEngine.renderVector(frameBuffer, new Vector3(1, 0, 0), sceneOrigin, ColorRGB.RED)
    ThiccEngine.renderVector(frameBuffer, new Vector3(0, 1, 0), sceneOrigin, ColorRGB.GREEN)
    ThiccEngine.renderVector(frameBuffer, new Vector3(0, 0, 1), sceneOrigin, ColorRGB.BLUE)
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
