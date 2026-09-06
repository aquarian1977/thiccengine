import {ColorRGB} from "./colors.js"
import {Vector3, Tri} from "./geometry.js"

class Camera {
    constructor (position, angle = 0, fov = Vector3.ANGLE_90, aspectRatio = (16 / 9)) {
        this.position = position
        this.angle = angle % (2 * Math.PI)
        this.fov = (fov && fov < Vector3.ANGLE_180) ? fov : Vector3.ANGLE_90
        this.aspectRatio = aspectRatio

        const leftOffset = -Math.tan(this.fov / 2)
        const rightOffset = Math.tan(this.fov / 2)
        const topOffset = Math.tan(this.fov / 2) / aspectRatio
        const bottomOffset = -Math.tan(this.fov / 2) / aspectRatio
        const rawTris = [
            new Tri( // Left. Clockwise winding so normal is inward.
                Vector3.ORIGIN,
                new Vector3(leftOffset, topOffset, 1),
                new Vector3(leftOffset, bottomOffset, 1),
                ColorRGB.GREEN
            ),
            new Tri( // Right
                Vector3.ORIGIN,
                new Vector3(rightOffset, bottomOffset, 1),
                new Vector3(rightOffset, topOffset, 1),
                ColorRGB.GREEN
            ),
            new Tri( // Top
                Vector3.ORIGIN,
                new Vector3(rightOffset, topOffset, 1),
                new Vector3(leftOffset, topOffset, 1),
                ColorRGB.GREEN
            ),
            new Tri( //
                Vector3.ORIGIN,
                new Vector3(leftOffset, bottomOffset, 1),
                new Vector3(rightOffset, bottomOffset, 1),
                ColorRGB.GREEN
            )
        ]
        this.tris = rawTris.map(tri => tri.getTranslated(position).getRotatedAboutY(angle))
    }

    getTranslated (translation = Vector3.ORIGIN) {
        return new Camera(
            this.position.getTranslated(translation),
            this.angle,
            this.fov,
            this.aspectRatio
        )
    }

    getRotatedAboutY (angle) { // TODO: This rotates about the position rather than about itself
        return new Camera(
            this.position, (this.angle + angle) % (2 * Math.PI), this.fov, this.aspectRatio
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

class Oblong {
    constructor (width, height, depth, origin = Vector3.ORIGIN, color = ColorRGB.WHITE) {
        // Pull each quad forward toward camera then flip into place
        const frontQuad = new Quad(width, height, Vector3.Z.getScaled(-depth / 2), color)
        const backQuad = new Quad(width, height, Vector3.Z.getScaled(-depth / 2), color)
        const leftQuad = new Quad(depth, height, Vector3.Z.getScaled(-width / 2), color)
        const rightQuad = new Quad(depth, height, Vector3.Z.getScaled(-width / 2), color)
        const topQuad = new Quad(width, depth, Vector3.Z.getScaled(-height / 2), color)
        const bottomQuad = new Quad(width, depth, Vector3.Z.getScaled(-height / 2), color)
        const quads = [
            frontQuad.getRotatedAboutY(Vector3.ANGLE_180),
            backQuad,
            leftQuad.getRotatedAboutY(Vector3.ANGLE_90),
            rightQuad.getRotatedAboutY(Vector3.ANGLE_270),
            topQuad.getRotatedAboutX(Vector3.ANGLE_90),
            bottomQuad.getRotatedAboutX(Vector3.ANGLE_270)
        ]
        const rawTris = quads.reduce((accum, quad) => accum.concat(quad.getTris()), [])
        this.tris = rawTris.map(tri => tri.getTranslated(origin))
    }

    getTris () {
        return this.tris
    }
}

class Cube extends Oblong {
    constructor (dimension, origin = Vector3.ORIGIN, color = ColorRGB.WHITE) {
        super(dimension, dimension, dimension, origin, color)
    }
}

export {Camera, Quad, Oblong, Cube}
