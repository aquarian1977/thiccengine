function renderFrame (frameBuffer) {
    const canvas = document.createElement("canvas")
    canvas.width = frameBuffer.width
    canvas.height = frameBuffer.height
    const canvasContext = canvas.getContext("2d")
    const imageData = new ImageData(frameBuffer.data, frameBuffer.width, frameBuffer.height)
    canvasContext.putImageData(imageData, 0, 0)
    document.body.append(canvas)
}

export default {renderFrame}
