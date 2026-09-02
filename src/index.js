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
        new Vector3(0.57735, 0.57735, 0.57735)
    ]
    sceneAngle = 0

    const epsilon = 0.000001
    const degreesPerIteration = 2
    const radsPerIteration = Math.PI * (degreesPerIteration / 180)

    // Order XYZ: PASS
    // Order YZX: PASS
    // Order ZXY: PASS
    // Order ZYX: PASS
    // Order YXZ: PASS
    // Order XZY: PASS

    console.log("=== Beginning gauntlet ===")
    for (let i = 0; i <= Math.PI * 2; i += radsPerIteration) {
        for (let j = 0; j <= Math.PI * 2; j += radsPerIteration) {
            for (let k = 0; k <= Math.PI * 2; k += radsPerIteration) {
                for (let l = 0; l < scene.length; l += 1) {
                    const originalMagnitude = scene[l].getMagnitude()
                    const vector = (scene[l].getRotatedAboutX(i)
                        .getRotatedAboutZ(j)
                        .getRotatedAboutY(k)
                    )
                    const transformedMagnitude = vector.getMagnitude()
                    if (transformedMagnitude > (originalMagnitude + epsilon)) {
                        console.log("Longer than vector length: " + transformedMagnitude + ", " + originalMagnitude)
                    } else if (transformedMagnitude < (originalMagnitude - epsilon)) {
                        console.log("Shorter than vector length: " + transformedMagnitude + ", " + originalMagnitude)
                    }
                }
            }
        }
    }
    console.log("=== Ended gauntlet ===")

    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

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
