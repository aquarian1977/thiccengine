import thiccEngine from "./thiccengine.js"
import renderer from "./renderer.js"

const FRAME_WIDTH_PIXELS = 640
const FRAME_HEIGHT_PIXELS = 480
const CYAN_QUAD = [0, 255, 255, 255]
const LIME_QUAD = [0, 255, 0, 255]

// Create our frame buffer
const frameBuffer = thiccEngine.createFrameBuffer(FRAME_WIDTH_PIXELS, FRAME_HEIGHT_PIXELS)

// ThiccEngine step
thiccEngine.putPixel(frameBuffer, 0, 0, CYAN_QUAD)
thiccEngine.putPixel(frameBuffer, 50, 50, LIME_QUAD)
thiccEngine.putRect(frameBuffer, 600, 450, 50, 50, LIME_QUAD)

// Renderer step
renderer.renderFrame(frameBuffer)
