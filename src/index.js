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
const TRANSLATION_PER_FRAME = 0.1
const ROTATION_PER_FRAME = Math.PI * (2.5 / 180)
const RENDER_CUTOFF_DISTANCE = 20
const COLOR_MID_GREY = new ColorRGB(127, 127, 127)
const COLOR_DARK_GREY = new ColorRGB(110, 110, 110)
const COLOR_SKY_BLUE = new ColorRGB(67, 126, 180)
const COLOR_SAND_BROWN = new ColorRGB(136, 112, 100)

function init () {
    const inspectorRenderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const inspectorFrameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const mainRenderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const mainFrameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const keysByPressedStatus = {}

    let camera = new Camera(
        new Vector3(-21, 1, 72),
        Vector3.ANGLE_180,
        Vector3.ANGLE_DEGREE * 110,
        FRAME_WIDTH_PIXELS / FRAME_HEIGHT_PIXELS
    )

    const renderInterval = window.setInterval(() => {
        camera = getTransformedCamera(keysByPressedStatus, camera)
        const screenTris = getScreenTris(e1m1Scene, camera)
        renderInspectorView(screenTris, inspectorFrameBuffer, inspectorRenderTarget)
        renderMainView(screenTris, camera, mainFrameBuffer, mainRenderTarget)
    }, (1000/TARGET_FPS))
    window.addEventListener("keydown", (event) => handleKeyPress(keysByPressedStatus, event))
    window.addEventListener("keyup", (event) => handleKeyUp(keysByPressedStatus, event))
    window.addEventListener("error", () => window.clearInterval(renderInterval)) // Stop loop on unhandled exception
}

function handleKeyPress (keysByPressedStatus, event) {
    keysByPressedStatus[event.key] = true
}

function handleKeyUp (keysByPressedStatus, event) {
    keysByPressedStatus[event.key] = false
}

function getTransformedCamera (keysByPressedStatus, camera) {
    const forwardTranslation = (
        keysByPressedStatus.w ? TRANSLATION_PER_FRAME : (
            keysByPressedStatus.s ? -TRANSLATION_PER_FRAME : 0
    ))
    const upTranslation = (
        keysByPressedStatus.e ? TRANSLATION_PER_FRAME : (
            keysByPressedStatus.q ? -TRANSLATION_PER_FRAME : 0
    ))
    const rotation = (
        keysByPressedStatus.d ? ROTATION_PER_FRAME : (
            keysByPressedStatus.a ? -ROTATION_PER_FRAME : 0
    ))

    // Move the camera along its forward direction by translation
    const translation = (new Vector3(0, upTranslation, forwardTranslation)
        .getRotatedAboutY(camera.angle))
    return camera.getTranslated(translation).getRotatedAboutY(rotation)
}

function getScreenTris (tris, camera) {
    const viewTris = tris.map(tri => {
        return tri.getTranslated(camera.getSceneTranslation()).getRotatedAboutY(camera.getSceneAngle())
    })
    const trisBackfaceCulled = viewTris.filter(tri => { // getCenter() is a shortcut because camera is at origin in view space
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

    const trisZOrdered = subdividedTris.sort((a, b) => {
        // Sort so the ones at the back (greatest z) come first
        return (b.p1.z + b.p2.z + b.p3.z)/3 - (a.p1.z + a.p2.z + a.p3.z)/3
    })

    return trisZOrdered
}

function renderInspectorView (tris, frameBuffer, renderTarget) {
    ThiccEngine.renderBackground(frameBuffer, COLOR_MID_GREY)
    ThiccEngine.renderAxes(frameBuffer, COLOR_DARK_GREY)
    const overheadTris = tris.map(tri => tri.getRotatedAboutY(-Vector3.ANGLE_30).getRotatedAboutX(-Vector3.ANGLE_30))
    overheadTris.forEach(tri => ThiccEngine.renderTri(frameBuffer, tri))
    renderTarget.display(frameBuffer)
}

function renderMainView (tris, camera, frameBuffer, renderTarget) {
    ThiccEngine.renderBackground(frameBuffer, ColorRGB.BLACK)
    tris.forEach(tri => ThiccEngine.renderProjectedFilledTri(frameBuffer, tri, camera))
    renderTarget.display(frameBuffer)
}

window.addEventListener("DOMContentLoaded", init)
