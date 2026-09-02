import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine from "./thiccengine.js"
import {ColorRGB} from "./colors.js"
import {Vector3} from "./geometry.js"
import {Quad, Cube} from "./objects.js"

const FRAME_WIDTH_PIXELS = 400
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30
const COLOR_MID_GREY = new ColorRGB(127, 127, 127)
const COLOR_SKY_BLUE = new ColorRGB(67, 126, 180)
const COLOR_SAND_BROWN = new ColorRGB(136, 112, 100)
const COLOR_LIME = new ColorRGB(108, 227, 73)
const COLOR_FUCHSIA = new ColorRGB(225, 50, 243)
const COLOR_TEAL = new ColorRGB(57, 116, 118)

let renderTarget, frameBuffer, camera, sceneObjects

function init () {
    renderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    camera = {
        position: new Vector3(0, 0, 0),
        tilt: Vector3.ANGLE_90
    }
    sceneObjects = [
        new Cube(1, Vector3.Z.getScaled(2), COLOR_TEAL)
    ]
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    ThiccEngine.renderBackground(frameBuffer, COLOR_MID_GREY)

    const tris = sceneObjects.reduce((accum, sceneObject) => {
        return accum.concat(sceneObject.getTris())
    }, [])
    const cameraSpaceTris = tris.map(tri => {
        return tri.getTranslated(camera.position.getInverse()).getRotatedAboutX(-camera.tilt)
    })
    cameraSpaceTris.forEach(tri => {
        ThiccEngine.renderTri(frameBuffer, tri)
    })

    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
