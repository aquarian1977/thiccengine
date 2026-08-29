import ThiccEngine, {Color, FrameBuffer} from "./thiccengine.js"
import WebRenderTarget from "./renderer.js"
import {Tri, Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 640
const FRAME_HEIGHT_PIXELS = 360
const COLOR_DARK_TEAL = new Color(0, 63, 63)
const COLOR_LIME = new Color(0, 255, 0)
const TARGET_FPS = 30
const ANGLE_PER_FRAME = 2 * Math.PI / 90

let frameBuffer, renderTarget, scene, sceneAngle = 0

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
    const transformedScene = scene.map(tri => tri.getRotated(sceneAngle, 100, 100))
    sceneAngle += ANGLE_PER_FRAME

    ThiccEngine.fill(frameBuffer, COLOR_DARK_TEAL)
    ThiccEngine.drawScene(frameBuffer, transformedScene, COLOR_LIME)
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
