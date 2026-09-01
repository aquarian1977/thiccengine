class FrameBuffer {
    constructor (width, height) {
        this.bytesPerPixel = 4
        this.data = new Uint8ClampedArray(width * height * this.bytesPerPixel)
        this.width = width
        this.height = height
    }
}

export default FrameBuffer
