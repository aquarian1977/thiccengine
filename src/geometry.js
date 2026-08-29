
class Vector3 {
    constructor (x, y, z) {
        this.x = x, this.y = y, this.z = z
    }

    getRotated (angle, originX = 0, originY = 0) {
        return new Vector3(
            (this.x - originX) * Math.cos(angle) - (this.y - originY) * Math.sin(angle) + originX,
            (this.y - originY) * Math.cos(angle) + (this.x - originX) * Math.sin(angle) + originY,
            this.z
        )
    }
}

class Tri {
    constructor (p1, p2, p3) {
        this.p1 = p1, this.p2 = p2, this.p3 = p3
    }

    getRotated (angle, originX, originY) {
        // return new tri, with each point rotated about which axis and which origin hmmmm
        return new Tri(
            this.p1.getRotated(angle, originX, originY),
            this.p2.getRotated(angle, originX, originY),
            this.p3.getRotated(angle, originX, originY)
        )
    }
}

export {Vector3, Tri}
