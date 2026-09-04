import {ColorRGB} from "./colors.js"
import {Vector3, Tri} from "./geometry.js"

class Camera {
    constructor (position, angle = 0, fov = Vector3.ANGLE_90) {
        this.position = position
        this.angle = angle % (2 * Math.PI)
        this.fov = (fov && fov < Vector3.ANGLE_180) ? fov : Vector3.ANGLE_90
        const leftOffset = -Math.tan(this.fov / 2)
        const rightOffset = Math.tan(this.fov / 2)
        const rawTris = [
            new Tri(
                position,
                position.getTranslated(new Vector3(leftOffset, 0, 1)),
                position.getTranslated(new Vector3(rightOffset, 0, 1)),
                ColorRGB.GREEN
            )
        ]
        this.tris = rawTris.map(tri => tri.getRotatedAboutY(angle))
    }

    getTranslated (translation = Vector3.ORIGIN) {
        return new Camera(
            this.position.getTranslated(translation),
            this.angle,
            this.fov
        )
    }

    getRotatedAboutY (angle) {
        return new Camera(
            this.position, (this.angle + angle) % (2 * Math.PI), this.fov
        )
    }

    getTris () {
        return this.tris
    }

    getSceneTranslation () {
        return this.position.getInverse()
    }

    getSceneAngle () {
        return -1 * this.angle
    }
}

class Quad {
    // NB. Quad constructor currently creates in xy plane
    constructor (width = 1, height = 1, origin = Vector3.ORIGIN, color = ColorRGB.WHITE) {
        this.width = width
        this.height = height
        this.origin = origin
        this.color = color

        const hw = width/2
        const hh = height/2
        this.t1 = new Tri( // Clockwise winding order: top left, top right, bottom left
            new Vector3(-hw, hh, 0),
            new Vector3(hw, hh, 0),
            new Vector3(-hw, -hh, 0),
            color
        ).getTranslated(origin)
        this.t2 = new Tri( // Bottom right, bottom left, top right
            new Vector3(hw, -hh, 0),
            new Vector3(-hw, -hh, 0),
            new Vector3(hw, hh, 0),
            color
        ).getTranslated(origin)
    }

    getTranslated (translation) {
        const quad = new Quad(this.width, this.height, this.origin, this.color)
        quad.t1 = quad.t1.getTranslated(translation)
        quad.t2 = quad.t2.getTranslated(translation)
        return quad
    }

    getRotatedAboutY (angle, origin = Vector3.ORIGIN) {
        const quad = new Quad(this.width, this.height, this.origin, this.color)
        quad.t1 = quad.t1.getRotatedAboutY(angle, origin)
        quad.t2 = quad.t2.getRotatedAboutY(angle, origin)
        return quad
    }

    getRotatedAboutX (angle, origin = Vector3.ORIGIN) {
        const quad = new Quad(this.width, this.height, this.origin, this.color)
        quad.t1 = quad.t1.getRotatedAboutX(angle, origin)
        quad.t2 = quad.t2.getRotatedAboutX(angle, origin)
        return quad
    }

    getTris () {
        return [this.t1, this.t2]
    }
}

class Cube {
    constructor (dimension, origin = Vector3.ORIGIN, color = ColorRGB.WHITE) {
        const displacement = new Vector3(0, 0, -dimension/2)
        const faceQuad = new Quad(dimension, dimension, displacement, color) // Pull it forward in -Z
        const quads = [
            faceQuad.getRotatedAboutY(Vector3.ANGLE_180), // Back
            faceQuad.getRotatedAboutY(Vector3.ANGLE_270), // Right
            faceQuad, // Front
            faceQuad.getRotatedAboutY(Vector3.ANGLE_90), // Left
            faceQuad.getRotatedAboutX(Vector3.ANGLE_90), // Top
            faceQuad.getRotatedAboutX(Vector3.ANGLE_270) // Bottom
        ]
        const rawTris = quads.reduce((accum, quad) => accum.concat(quad.getTris()), [])
        this.tris = rawTris.map(tri => tri.getTranslated(origin))
    }

    getTris () {
        return this.tris
    }
}

export {Camera, Quad, Cube}
