import {ColorRGB} from "./colors.js"

class Vector3 {
    static X = new Vector3(1, 0, 0)
    static Y = new Vector3(0, 1, 0)
    static Z = new Vector3(0, 0, 1)
    static ORIGIN = new Vector3(0, 0, 0)
    static ANGLE_DEGREE = Math.PI / 180
    static ANGLE_45 = Math.PI * 0.25
    static ANGLE_90 = Math.PI * 0.5
    static ANGLE_180 = Math.PI * 1.0
    static ANGLE_270 = Math.PI * 1.5

    constructor (x, y, z) {
        this.x = x, this.y = y, this.z = z
    }

    getScaled (scale) {
        return new Vector3(
            this.x * scale,
            this.y * scale,
            this.z * scale
        )
    } 

    getInverse () {
        return new Vector3(
            -this.x, -this.y, -this.z
        )
    }

    getMagnitude () {
        return Math.sqrt(
            this.x * this.x + this.y * this.y + this.z * this.z
        )
    }

    getTranslated(translation) {
        return new Vector3(
            this.x + translation.x,
            this.y + translation.y,
            this.z + translation.z
        )
    }

    getRotatedAboutX (angle, origin = new Vector3(0, 0, 0)) {
        return new Vector3(
            this.x,
            (this.y - origin.y) * Math.cos(angle) - (this.z - origin.z) * Math.sin(angle) + origin.y,
            (this.z - origin.z) * Math.cos(angle) + (this.y - origin.y) * Math.sin(angle) + origin.z
        )
    }

    getRotatedAboutY (angle, origin = new Vector3(0, 0, 0)) {
        return new Vector3(
            (this.x - origin.x) * Math.cos(angle) + (this.z - origin.z) * Math.sin(angle) + origin.x,
            this.y,
            (this.z - origin.z) * Math.cos(angle) - (this.x - origin.x) * Math.sin(angle) + origin.z,
        )
    }

    getRotatedAboutZ (angle, origin = new Vector3(0, 0, 0)) {
        return new Vector3(
            (this.x - origin.x) * Math.cos(angle) - (this.y - origin.y) * Math.sin(angle) + origin.x,
            (this.y - origin.y) * Math.cos(angle) + (this.x - origin.x) * Math.sin(angle) + origin.y,
            this.z
        )
    }
}

class Tri {
    constructor (p1, p2, p3, color = ColorRGB.WHITE) {
        this.p1 = p1, this.p2 = p2, this.p3 = p3, this.color = color
    }

    getTranslated (translation) {
        return new Tri(
            this.p1.getTranslated(translation),
            this.p2.getTranslated(translation),
            this.p3.getTranslated(translation),
            this.color
        )
    }

    getRotatedAboutX (angle, origin = new Vector3(0, 0, 0)) {
        return new Tri(
            this.p1.getRotatedAboutX(angle, origin),
            this.p2.getRotatedAboutX(angle, origin),
            this.p3.getRotatedAboutX(angle, origin),
            this.color
        )
    }

    getRotatedAboutY (angle, origin = new Vector3(0, 0, 0)) {
        return new Tri(
            this.p1.getRotatedAboutY(angle, origin),
            this.p2.getRotatedAboutY(angle, origin),
            this.p3.getRotatedAboutY(angle, origin),
            this.color
        )
    }

    getRotatedAboutZ (angle, origin = new Vector3(0, 0, 0)) {
        return new Tri(
            this.p1.getRotatedAboutZ(angle, origin),
            this.p2.getRotatedAboutZ(angle, origin),
            this.p3.getRotatedAboutZ(angle, origin),
            this.color
        )
    }
}

export {Vector3, Tri}
