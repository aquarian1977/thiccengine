import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine from "./thiccengine.js"
import {ColorRGB, ColorHSV} from "./colors.js"
import {Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 400
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30
const SCENE_ROTATION_PER_FRAME = 2 * Math.PI * (0.5 / 360)

let renderTarget, frameBuffer, sceneAngle, scene

function init () {
    renderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    scene = [
        Vector3.X,
        Vector3.Y,
        Vector3.Z,
        new Vector3(0.57735, 0.57735, 0.57735)
    ]
    sceneAngle = 0
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    ThiccEngine.renderBackground(frameBuffer, ColorRGB.BLACK)
    scene.forEach((vector, i) => {
        const transformedVector = vector.getRotatedAboutY(sceneAngle)
        const backOnVector = transformedVector // Looking from the back into +Z
        ThiccEngine.renderVector(frameBuffer, backOnVector, new Vector3(-2.5, 0, 0), new ColorHSV(i * 90, 1, 1))
    })
    scene.forEach((vector, i) => {
        const transformedVector = vector.getRotatedAboutY(sceneAngle)
        const overheadVector = transformedVector.getRotatedAboutX(-1 * Vector3.ANGLE_90)
        ThiccEngine.renderVector(frameBuffer, overheadVector, new Vector3(0, 0, 0), new ColorHSV(i * 90, 1, 1))
    })
    scene.forEach((vector, i) => {
        const transformedVector = vector.getRotatedAboutY(sceneAngle)
        const sideOnVector = transformedVector.getRotatedAboutY(Vector3.ANGLE_90)
        ThiccEngine.renderVector(frameBuffer, sideOnVector, new Vector3(2.5, 0, 0), new ColorHSV(i * 90, 1, 1))
    })
    renderTarget.display(frameBuffer)

    sceneAngle = (sceneAngle + SCENE_ROTATION_PER_FRAME) % (2 * Math.PI)
}

document.addEventListener("DOMContentLoaded", init)
