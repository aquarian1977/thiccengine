class FrameBuffer {
    constructor (width, height) {
        this.bytesPerPixel = 4
        this.data = new Uint8ClampedArray(width * height * this.bytesPerPixel)
        this.width = width
        this.height = height
        this.centerX = Math.round(width / 2)
        this.centerY = Math.round(height / 2)
    }
}

export default FrameBuffer
