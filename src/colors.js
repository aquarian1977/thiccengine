class ColorRGB extends Uint8ClampedArray {
    static BLACK = new ColorRGB(0, 0, 0)
    static WHITE = new ColorRGB(255, 255, 255)
    static RED = new ColorRGB(255, 0, 0)
    static GREEN = new ColorRGB(0, 255, 0)
    static BLUE = new ColorRGB(0, 0, 255)

    constructor (r = 0, g = 0, b = 0, a = 255) {
        super([r, g, b, a])
    }
}

class ColorHSV extends ColorRGB {
    constructor (rawH = 0, s = 1, v = 1) {
        // Taken from https://www.rapidtables.com/convert/color/hsv-to-rgb.html
        // Conversion decides primary hue then mixes other colors to hit saturation and value
        const h = rawH % 360 // Clamp h to below 360
        const c = s * v
        const m = v - c
        const x = c * (1 - Math.abs(((h/60) % 2) - 1))
        let rprime = 0, gprime = 0, bprime = 0
        if (h >= 0 && h < 60) {
            rprime = c, gprime = x, bprime = 0
        } else if (h >= 60 && h < 120) {
            rprime = x, gprime = c, bprime = 0
        } else if (h >= 120 && h < 180) {
            rprime = 0, gprime = c, bprime = x
        } else if (h >= 180 && h < 240) {
            rprime = 0, gprime = x, bprime = c
        } else if (h >= 240 && h < 300) {
            rprime = x, gprime = 0, bprime = c
        } else if (h >= 300 && h < 360) {
            rprime = c, gprime = 0, bprime = x
        }
        super((rprime + m) * 255, (gprime + m) * 255, (bprime + m) * 255)
    }
}

export {ColorRGB, ColorHSV}
