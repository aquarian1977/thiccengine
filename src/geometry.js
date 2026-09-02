
class Vector3 {
    static X = new Vector3(1, 0, 0)
    static Y = new Vector3(0, 1, 0)
    static Z = new Vector3(0, 0, 1)
    static ANGLE_45 = Math.PI * 0.25
    static ANGLE_90 = Math.PI * 0.5
    static ANGLE_180 = Math.PI * 1.0
    static ANGLE_270 = Math.PI * 1.5

    constructor (x, y, z) {
        this.x = x, this.y = y, this.z = z
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
    constructor (p1, p2, p3) {
        this.p1 = p1, this.p2 = p2, this.p3 = p3
    }

    getRotatedAboutZ (angle, origin = new Vector3(0, 0, 0)) {
        // return new tri, with each point rotated about which axis and which origin hmmmm
        return new Tri(
            this.p1.getRotatedAboutZ(angle, origin),
            this.p2.getRotatedAboutZ(angle, origin),
            this.p3.getRotatedAboutZ(angle, origin)
        )
    }
}

export {Vector3, Tri}
