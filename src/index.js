import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine from "./thiccengine.js"
import {ColorRGB} from "./colors.js"
import {Vector3} from "./geometry.js"
import {Quad} from "./objects.js"

const FRAME_WIDTH_PIXELS = 400
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30

let renderTarget, frameBuffer, camera, sceneObjects

function init () {
    renderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    frameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    camera = {
        position: new Vector3(0, 0, 0),
        tilt: 0
    }
    sceneObjects = [
        new Quad(1, 1, Vector3.ORIGIN)
    ]
    window.setInterval(renderFrame, (1000/TARGET_FPS))
}

function renderFrame () {
    ThiccEngine.renderBackground(frameBuffer, ColorRGB.BLACK)

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
