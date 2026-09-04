import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine, {Camera} from "./thiccengine.js"
import {ColorRGB} from "./colors.js"
import {Vector3} from "./geometry.js"
import {Quad, Cube} from "./objects.js"

const FRAME_WIDTH_PIXELS = 400
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30
const ANGLE_INCREMENT_PER_FRAME = Math.PI * (1 / 180)
const COLOR_MID_GREY = new ColorRGB(127, 127, 127)
const COLOR_SKY_BLUE = new ColorRGB(67, 126, 180)
const COLOR_SAND_BROWN = new ColorRGB(136, 112, 100)
const COLOR_LIME = new ColorRGB(108, 227, 73)
const COLOR_FUCHSIA = new ColorRGB(225, 50, 243)
const COLOR_TEAL = new ColorRGB(57, 116, 118)

function init () {
    const overheadRenderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const overheadFrameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)

    let camera = new Camera(new Vector3(0, 1, 0), Vector3.ANGLE_90)
    let angleTicker = 0
    const scene = [
        new Quad(10, 1.5, new Vector3(0, 0.75, 11), COLOR_LIME),

        new Cube(1, new Vector3(0, 0.5, 9.5), COLOR_FUCHSIA),

        new Cube(0.5, new Vector3(-3, 0.25, 2), COLOR_TEAL),
        new Cube(0.5, new Vector3(-3, 0.25, 4), COLOR_TEAL),
        new Cube(0.5, new Vector3(-3, 0.25, 6), COLOR_TEAL),
        new Cube(0.5, new Vector3(-3, 0.25, 8), COLOR_TEAL),

        new Cube(0.5, new Vector3(3, 0.25, 2), COLOR_TEAL),
        new Cube(0.5, new Vector3(3, 0.25, 4), COLOR_TEAL),
        new Cube(0.5, new Vector3(3, 0.25, 6), COLOR_TEAL),
        new Cube(0.5, new Vector3(3, 0.25, 8), COLOR_TEAL)
    ]
    const sceneTris = scene.reduce((accum, sceneObject) => {
        return accum.concat(sceneObject.getTris())
    }, [])

    window.setInterval(() => {
        renderOverheadView(sceneTris, camera, overheadFrameBuffer, overheadRenderTarget)
        angleTicker = (angleTicker + ANGLE_INCREMENT_PER_FRAME) % (2 * Math.PI)
        camera = camera.getTranslated(new Vector3(Math.cos(angleTicker) * 0.1, 0, 0))
    }, (1000/TARGET_FPS))
}

function renderOverheadView (tris, camera, frameBuffer, renderTarget) {
    const sceneTris = tris.concat(camera.getTris())
    const overheadTris = sceneTris.map(tri => tri.getRotatedAboutX(-Vector3.ANGLE_90))
    ThiccEngine.renderBackground(frameBuffer, COLOR_MID_GREY)
    overheadTris.forEach(tri => ThiccEngine.renderTri(frameBuffer, tri))
    renderTarget.display(frameBuffer)
}

document.addEventListener("DOMContentLoaded", init)
