import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine from "./thiccengine.js"
import {ColorRGB, ColorHSV} from "./colors.js"
import {Vector3} from "./geometry.js"

const FRAME_WIDTH_PIXELS = 400
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30
const SCENE_ROTATION_PER_FRAME = 2 * Math.PI * (1 / 360)

let renderTarget, frameBuffer, sceneAngle, scene

// TODO: Ensure vector rotations follow convention for left-handed coordinate system
function init () {
    renderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)

    scene = [
        Vector3.X,
        Vector3.Y,
        Vector3.Z,
        new Vector3(0.5, 0.5, 0.5)
    ]
    sceneAngle = 0

    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

// TODO: Applying Y rotation after X rotation screws up the numbers, so that's a good lead
function renderFrame () {
    ThiccEngine.renderBackground(frameBuffer, ColorRGB.BLACK)
    scene.forEach((vector, i) => {
        ThiccEngine.renderVector(frameBuffer, vector.getRotatedAboutY(sceneAngle), new Vector3(-2.5, 1, 0), new ColorHSV(i * 90, 1, 1))
    })
    scene.forEach((vector, i) => {
        const overheadVector = vector.getRotatedAboutY(sceneAngle).getRotatedAboutX(-1 * Vector3.ANGLE_90)
        ThiccEngine.renderVector(frameBuffer, overheadVector, new Vector3(0, 1, 0), new ColorHSV(i * 90, 1, 1))
    })
    scene.forEach((vector, i) => {
        const sideOnVector = vector.getRotatedAboutY(sceneAngle).getRotatedAboutY(Vector3.ANGLE_90)
        ThiccEngine.renderVector(frameBuffer, sideOnVector, new Vector3(2.5, 1, 0), new ColorHSV(i * 90, 1, 1))
    })
    scene.forEach((vector, i) => {
        const perspectiveVector = vector.getRotatedAboutX(sceneAngle).getRotatedAboutY(sceneAngle).getRotatedAboutZ(sceneAngle)
        ThiccEngine.renderVector(frameBuffer, perspectiveVector, new Vector3(0, -2, 0), new ColorHSV(i * 90, 1, 1))
    })

    renderTarget.display(frameBuffer)

    sceneAngle = (sceneAngle + SCENE_ROTATION_PER_FRAME) % (2 * Math.PI)
}

document.addEventListener("DOMContentLoaded", init)
