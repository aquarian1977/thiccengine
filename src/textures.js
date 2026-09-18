import { ColorRGB } from "./colors.js"

const TEXTURE_PATH = "textures/"
const TEXTURE_EXTENSION = ".tga"
const TARGA_COLOR_MAP_TYPE_BYTE_INDEX = 1
const TARGA_IMAGE_TYPE_BYTE_INDEX = 2
const TARGA_IMAGE_TYPE_UNCOMPRESSED_RGB = 2
const TARGA_WIDTH_BYTES_INDEX = 12
const TARGA_HEIGHT_BYTES_INDEX = 14
const TARGA_PIXEL_DEPTH_BYTE_INDEX = 16
const TARGA_IMAGE_DESCRIPTOR_BYTE_INDEX = 17
const TARGA_IMAGE_DESCRIPTOR_SCREEN_ORIGIN_TOP_BIT = 0b1 << 5
const TARGA_IMAGE_DATA_BYTE_INDEX = 18

class Texture {
    constructor (name, width, height, data) {
        this.name = name, this.width = width, this.height = height, this.data = data
    }

    getColorAt (x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return ColorRGB.BLUE
        const startIndex = (y * this.height + x) * 4
        return new ColorRGB(
            this.data[startIndex + 0],
            this.data[startIndex + 1],
            this.data[startIndex + 2],
            this.data[startIndex + 3]
        )
    }

    getColorAtUV (rawU, rawV) {
        const u = rawU
        const v = rawV
        const x = Math.round(u * (this.width - 1))
        const y = Math.round(v * (this.height - 1))
        return this.getColorAt(x, y)
    }
}

async function loadTextureAsync (textureName) {
    const response = await fetch(TEXTURE_PATH + textureName + TEXTURE_EXTENSION)
    if (!response.ok) {
      throw new Error(`Could not fetch texture ${textureName}: ${response}`)
    }

    const arrayBuffer = await response.arrayBuffer();
    const dataView = new DataView(arrayBuffer);

    const width = dataView.getUint16(TARGA_WIDTH_BYTES_INDEX, true) // Stored as little-endian
    const height = dataView.getUint16(TARGA_HEIGHT_BYTES_INDEX, true)
    const hasNoColorMap = !dataView.getUint8(TARGA_COLOR_MAP_TYPE_BYTE_INDEX)
    const isUncompressedRGB = dataView.getUint8(TARGA_IMAGE_TYPE_BYTE_INDEX) == TARGA_IMAGE_TYPE_UNCOMPRESSED_RGB
    const is32BitRGBA = dataView.getUint8(TARGA_PIXEL_DEPTH_BYTE_INDEX) == 32
    const imageDescriptorFlags = dataView.getUint8(TARGA_IMAGE_DESCRIPTOR_BYTE_INDEX)
    const isBottomUp = !(imageDescriptorFlags & TARGA_IMAGE_DESCRIPTOR_SCREEN_ORIGIN_TOP_BIT)

    if (!hasNoColorMap || !isUncompressedRGB || !is32BitRGBA || !isBottomUp) {
        throw new Error(`Incompatible texture ${textureName}.\
            ThiccEngine requires TGA files with no color map, in uncompressed RGBA, 32-bits per pixel, and bottom-up ordering.`)
    }

    let r, g, b, a, sourceIndexBytes, destIndexBytes
    const data = new Uint8ClampedArray(width * height * 4)
    // Targa is stored bottom-up but we want to write top-down
    for (let sourceY = 0, destY = height - 1; sourceY < height; sourceY += 1, destY -= 1) {
        for (let x = 0; x < width; x += 1) {
            sourceIndexBytes = TARGA_IMAGE_DATA_BYTE_INDEX + (sourceY * width + x) * 4
            destIndexBytes = (destY * width + x) * 4
            b = dataView.getUint8(sourceIndexBytes + 0) // Targa byte order is bgra
            g = dataView.getUint8(sourceIndexBytes + 1)
            r = dataView.getUint8(sourceIndexBytes + 2)
            a = dataView.getUint8(sourceIndexBytes + 3)
            data[destIndexBytes + 0] = r // Our order is rgba
            data[destIndexBytes + 1] = g
            data[destIndexBytes + 2] = b
            data[destIndexBytes + 3] = a
        }
    }

    return new Texture(textureName, width, height, data)
}

export {Texture, loadTextureAsync}
