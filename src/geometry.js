import {ColorRGB} from "./colors.js"

class Vector3 {
    static X = new Vector3(1, 0, 0)
    static Y = new Vector3(0, 1, 0)
    static Z = new Vector3(0, 0, 1)
    static ORIGIN = new Vector3(0, 0, 0)
    static ANGLE_DEGREE = Math.PI / 180
    static ANGLE_30 = Math.PI / 6
    static ANGLE_45 = Math.PI * 0.25
    static ANGLE_90 = Math.PI * 0.5
    static ANGLE_180 = Math.PI * 1.0
    static ANGLE_270 = Math.PI * 1.5

    constructor (x, y, z, u = 0, v = 0) {
        this.x = x, this.y = y, this.z = z, this.u = u, this.v = v
    }

    getDotProduct (vector) {
        return (
            this.x * vector.x + this.y * vector.y + this.z * vector.z
        )
    }

    getAngleWith (vector) { // Angle between this and other vector between 0 and Math.PI
        const dotProduct = this.getDotProduct(vector)
        const magThis = this.getMagnitude()
        const magVector = vector.getMagnitude()
        return Math.acos(dotProduct/(magThis * magVector))
    }

    getCrossProduct (vector) {
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x,
            0,
            0
        )
    }

    getScaled (scale) {
        return new Vector3(
            this.x * scale,
            this.y * scale,
            this.z * scale,
            this.u,
            this.v
        )
    } 

    getInverse () {
        return new Vector3(
            -this.x, -this.y, -this.z, this.u, this.v
        )
    }

    getMagnitude () {
        return Math.sqrt(
            this.x * this.x + this.y * this.y + this.z * this.z
        )
    }

    getUnitized () {
        const mag = this.getMagnitude()
        return new Vector3(
            this.x / mag,
            this.y / mag,
            this.z / mag,
            this.u,
            this.v
        )
    }

    getVectorTo (vector) {
        return new Vector3(
            vector.x - this.x,
            vector.y - this.y,
            vector.z - this.z,
            this.u,
            this.v
        )
    }

    getTranslated(translation) {
        return new Vector3(
            this.x + translation.x,
            this.y + translation.y,
            this.z + translation.z,
            this.u,
            this.v
        )
    }

    getRotatedAboutX (angle, origin = new Vector3(0, 0, 0)) {
        return new Vector3(
            this.x,
            (this.y - origin.y) * Math.cos(angle) - (this.z - origin.z) * Math.sin(angle) + origin.y,
            (this.z - origin.z) * Math.cos(angle) + (this.y - origin.y) * Math.sin(angle) + origin.z,
            this.u,
            this.v
        )
    }

    getRotatedAboutY (angle, origin = new Vector3(0, 0, 0)) {
        return new Vector3(
            (this.x - origin.x) * Math.cos(angle) + (this.z - origin.z) * Math.sin(angle) + origin.x,
            this.y,
            (this.z - origin.z) * Math.cos(angle) - (this.x - origin.x) * Math.sin(angle) + origin.z,
            this.u,
            this.v
        )
    }

    getRotatedAboutZ (angle, origin = new Vector3(0, 0, 0)) {
        return new Vector3(
            (this.x - origin.x) * Math.cos(angle) - (this.y - origin.y) * Math.sin(angle) + origin.x,
            (this.y - origin.y) * Math.cos(angle) + (this.x - origin.x) * Math.sin(angle) + origin.y,
            this.z,
            this.u,
            this.v
        )
    }
}

class Tri {
    constructor (p1, p2, p3, color = ColorRGB.WHITE) {
        this.p1 = p1, this.p2 = p2, this.p3 = p3, this.color = color
    }

    getCenter () {
        return new Vector3(
            (this.p1.x + this.p2.x + this.p3.x) / 3, 
            (this.p1.y + this.p2.y + this.p3.y) / 3, 
            (this.p1.z + this.p2.z + this.p3.z) / 3
        )
    }

    getNormal () {
        const a = this.p1.getVectorTo(this.p2)
        const b = this.p1.getVectorTo(this.p3)
        return a.getCrossProduct(b)
    }

    getUnitNormal () {
        return this.getNormal().getUnitized()
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

    getBarycentricCoordsFor (x, y) {
        const a = this.p1, b = this.p2, c = this.p3

        const doubledArea = ( // Cross product of two main edge vectors gives doubled area
            (b.y - c.y) * (a.x - c.x) +
            (c.x - b.x) * (a.y - c.y)
        )

        // Use same cross product shortcut for barycentric lambdas
        const l1 = ((b.y - c.y) * (x - c.x) + (c.x - b.x) * (y - c.y)) / doubledArea
        const l2 = ((c.y - a.y) * (x - c.x) + (a.x - c.x) * (y - c.y)) / doubledArea
        const l3 = 1 - l1 - l2

        return [l1, l2, l3] // May wish to divide by p1/p2/p3 z for each to do perspective correction?
    }

    getPerspectiveCorrectZFor (x, y) {
        const [l1, l2, l3] = this.getBarycentricCoordsFor(x, y)
        // To interpolate given perspective, correct lambdas via z division
        return ((l1 / this.p1.z) + (l2 / this.p2.z) + (l3 / this.p3.z))
    }

    getPerspectiveCorrectColorAt (x, y) {
        const [l1, l2, l3] = this.getBarycentricCoordsFor(x, y)
        const p1uz = this.p1.u/this.p1.z
        const p2uz = this.p2.u/this.p2.z
        const p3uz = this.p3.u/this.p3.z
        const p1vz = this.p1.v/this.p1.z
        const p2vz = this.p2.v/this.p2.z
        const p3vz = this.p3.v/this.p3.z
        const p1iz = 1/this.p1.z
        const p2iz = 1/this.p2.z
        const p3iz = 1/this.p3.z
        const uz = p1uz * l1 + p2uz * l2 + p3uz * l3
        const vz = p1vz * l1 + p2vz * l2 + p3vz * l3
        const iz = p1iz * l1 + p2iz * l2 + p3iz * l3
        const z = 1 / iz
        return this.color.getColorAtUV(uz * z, vz * z)
    }
}

class TriSimple extends Tri {
    constructor (x1, y1, z1, x2, y2, z2, x3, y3, z3, red, green, blue) {
        super(
            new Vector3(x1, y1, z1),
            new Vector3(x2, y2, z2),
            new Vector3(x3, y3, z3),
            new ColorRGB(red, green, blue)
        )
    }
}

export {Vector3, Tri, TriSimple}
