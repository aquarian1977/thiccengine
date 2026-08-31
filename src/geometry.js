
class Vector3 {
    constructor (x, y, z) {
        this.x = x, this.y = y, this.z = z
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
