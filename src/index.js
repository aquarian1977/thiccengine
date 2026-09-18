import FrameBuffer from "./frame-buffer.js"
import RenderTarget from "./render-target.js"
import ThiccEngine from "./thiccengine.js"
import {ColorRGB} from "./colors.js"
import {Vector3, Tri} from "./geometry.js"
import {Camera} from "./objects.js"
import {loadTextureAsync} from "./textures.js"

const FRAME_WIDTH_PIXELS = 400
const FRAME_HEIGHT_PIXELS = 300
const TARGET_FPS = 30
const TRANSLATION_PER_FRAME = 0.1
const ROTATION_PER_FRAME = Math.PI * (2.5 / 180)
const COLOR_MID_GREY = new ColorRGB(127, 127, 127)
const COLOR_DARK_GREY = new ColorRGB(110, 110, 110)

async function init () {
    // const inspectorRenderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    // const inspectorFrameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const mainRenderTarget = new RenderTarget.Web(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const mainFrameBuffer = new FrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)
    const zBuffer = new Float64Array(FRAME_WIDTH_PIXELS * FRAME_HEIGHT_PIXELS)
    const keysByPressedStatus = {}
    const doorTexture = await loadTextureAsync("BIGDOOR2")
    const scene = [
        new Tri(
            new Vector3(0, 0, 0, 0, 0),
            new Vector3(1, 0, 0, 1, 0),
            new Vector3(0, -1, 0, 0, 1),
            doorTexture
        ),
        new Tri(
            new Vector3(1, -1, 0, 1, 1),
            new Vector3(0, -1, 0, 0, 1),
            new Vector3(1, 0, 0, 1, 0),
            doorTexture
        )
    ]

    let camera = new Camera(
        new Vector3(0.5, -0.5, -2),
        0,
        Vector3.ANGLE_DEGREE * 110,
        FRAME_WIDTH_PIXELS / FRAME_HEIGHT_PIXELS
    )

    const renderInterval = window.setInterval(() => {
        camera = getTransformedCamera(keysByPressedStatus, camera)
        const screenTris = getScreenTris(scene, camera)
        renderMainView(screenTris, camera, mainFrameBuffer, mainRenderTarget, zBuffer)
        // window.clearInterval(renderInterval)
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

    const trisDistanceOrdered = subdividedTris.sort((a, b) => {
        // Sort so the ones at the back come first
        return b.getCenter().getMagnitude() - a.getCenter().getMagnitude()
    })

    return trisDistanceOrdered
}

function renderInspectorView (tris, frameBuffer, renderTarget) {
    ThiccEngine.renderBackground(frameBuffer, COLOR_MID_GREY)
    ThiccEngine.renderAxes(frameBuffer, COLOR_DARK_GREY)
    const overheadTris = tris.map(tri => tri.getRotatedAboutY(-Vector3.ANGLE_30).getRotatedAboutX(-Vector3.ANGLE_30))
    overheadTris.forEach(tri => ThiccEngine.renderTri(frameBuffer, tri))
    renderTarget.display(frameBuffer)
}

function renderMainView (tris, camera, frameBuffer, renderTarget, zBuffer) {
    ThiccEngine.renderBackground(frameBuffer, ColorRGB.BLACK)
    zBuffer.fill(0)
    tris.forEach(tri => ThiccEngine.renderProjectedTexturedTri(frameBuffer, tri, camera, zBuffer))
    renderTarget.display(frameBuffer)
}

window.addEventListener("DOMContentLoaded", init)
