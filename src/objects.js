import {Vector3, Tri} from "./geometry.js"

class Quad {
    constructor (width = 1, height = 1, origin = new Vector3(0, 0, 0)) {
        const hw = width/2
        const hh = height/2
        this.t1 = new Tri( // Clockwise winding order: top left, top right, bottom left
            new Vector3(-hw, hh, 0),
            new Vector3(hw, hh, 0),
            new Vector3(-hw, -hh, 0)
        ).getTranslated(origin)
        this.t2 = new Tri( // Bottom right, bottom left, top right
            new Vector3(hw, -hh, 0),
            new Vector3(-hw, -hh, 0),
            new Vector3(hw, hh, 0)
        ).getTranslated(origin)
    }

    getTris () {
        return [this.t1, this.t2]
    }
}

export {Quad}
