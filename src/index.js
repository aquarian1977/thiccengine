import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine from "./thiccengine.js"
import {ColorRGB} from "./colors.js"
import {Vector3} from "./geometry.js"
import {Camera} from "./objects.js"
import e1m1Scene from "./e1m1-scene.js"

const FRAME_WIDTH_PIXELS = 400
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30
const ANGLE_INCREMENT_PER_FRAME = Math.PI * (1 / 180)
const COLOR_MID_GREY = new ColorRGB(127, 127, 127)
const COLOR_DARK_GREY = new ColorRGB(110, 110, 110)
const COLOR_SKY_BLUE = new ColorRGB(67, 126, 180)
const COLOR_SAND_BROWN = new ColorRGB(136, 112, 100)

function init () {
    const overheadRenderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const overheadFrameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const mainRenderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const mainFrameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)

    let camera = new Camera(
        new Vector3(-21, 1, 72),
        Vector3.ANGLE_180,
        Vector3.ANGLE_DEGREE * 110,
        FRAME_WIDTH_PIXELS / FRAME_HEIGHT_PIXELS
    )

    const renderInterval = window.setInterval(() => {
        const screenTris = getScreenTris(e1m1Scene, camera)
        renderInspectorView(screenTris, overheadFrameBuffer, overheadRenderTarget)
        renderMainView(screenTris, camera, mainFrameBuffer, mainRenderTarget)
    }, (1000/TARGET_FPS))
    window.addEventListener("error", () => window.clearInterval(renderInterval)) // Stop loop on unhandled exception
}

function getScreenTris (tris, camera) {
    const viewTris = tris.map(tri => {
        return tri.getTranslated(camera.getSceneTranslation()).getRotatedAboutY(camera.getSceneAngle())
    })
    const trisBeyondViewDistanceCulled = viewTris.filter(tri => {
        return tri.p1.z <= 10 && tri.p2.z <= 10 && tri.p3.z <= 10
    })
    const trisBackfaceCulled = trisBeyondViewDistanceCulled.filter(tri => { // getCenter() is a shortcut because camera is at origin in view space
        return tri.getCenter().getAngleWith(tri.getUnitNormal()) > Vector3.ANGLE_90
    })

    const cameraTris = camera.getTris().map(tri => {
        return tri.getRotatedAboutY(camera.getSceneAngle()).getTranslated(camera.getSceneTranslation())
    })

    const subdividedTris = cameraTris.reduce((tris, frustumPlane) => { // Each camera tri is a frustum plane
        return tris.reduce((accum, tri) => { // Pass on the new subdivided list for each plane
            return accum.concat(
                ThiccEngine.getSubdividedByPlane(tri, frustumPlane.p1, frustumPlane.getUnitNormal())
            )
        }, [])
    }, trisBackfaceCulled) // Feed in the tris

    const trisWithCamera = subdividedTris.concat(cameraTris)
    return trisWithCamera
}

function renderInspectorView (tris, frameBuffer, renderTarget) {
    ThiccEngine.renderBackground(frameBuffer, COLOR_MID_GREY)
    ThiccEngine.renderAxes(frameBuffer, COLOR_DARK_GREY)
    const overheadTris = tris.map(tri => tri.getRotatedAboutX(-Vector3.ANGLE_90))
    overheadTris.forEach(tri => ThiccEngine.renderTri(frameBuffer, tri))
    renderTarget.display(frameBuffer)
}

function renderMainView (tris, camera, frameBuffer, renderTarget) {
    ThiccEngine.renderWorldBackground(frameBuffer, COLOR_SKY_BLUE, COLOR_SAND_BROWN)
    tris.forEach(tri => ThiccEngine.renderProjectedTri(frameBuffer, tri, camera))
    renderTarget.display(frameBuffer)
}

window.addEventListener("DOMContentLoaded", init)
