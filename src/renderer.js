class WebRenderTarget {
    constructor (width, height) {
        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.canvasContext = this.canvas.getContext("2d")
        document.body.append(this.canvas)
    }

    display (frameBuffer) {
        const imageData = new ImageData(frameBuffer.data, frameBuffer.width, frameBuffer.height)
        this.canvasContext.putImageData(imageData, 0, 0)
    }
}

export default WebRenderTarget
