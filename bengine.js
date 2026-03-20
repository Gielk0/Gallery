const startP = 250
function nopx(string) {
    return Number(string.substring(0, string.length-2))
}

export function distance(vec1, vec2) {
    const a = Math.pow((vec2.x - vec1.x), 2)
    const b = Math.pow((vec2.y - vec1.y), 2)
    const c = Math.pow((vec2.z - vec1.z), 2)
    return Math.sqrt(a + b + c)
}
export function magnitude(vec) {
    return Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z)
}
export function normalize(vec) {
    const v = magnitude(vec)
    return {
        x: vec.x / v,
        y: vec.y / v,
        z: vec.z / v
    }
}
export function angToVec(angle) {
    angle.x *= Math.PI / 180
    angle.y *= Math.PI / -180
    const x = Math.cos(angle.y) * Math.cos(angle.x)
    const y = Math.sin(angle.x)
    const z = Math.sin(angle.y) * Math.cos(angle.x)
    return {
        x: x,
        y: y,
        z: z
    }
}

export function camera(element) {
    // HTML element creation
    const scene = document.createElement("div")
    scene.style.width = "0"
    scene.style.height = "0"
    scene.style.position = "absolute"
    scene.style.left = "50%"
    scene.style.top = "50%"
    scene.style.transform = "translateX(-50%) translateY(-50%)"
    scene.style.transformStyle = "preserve-3d"
    element.appendChild(scene)
    element.style.perspective = startP +"px"
    element.style.overflow = "hidden"

    // Variables creation
    this.fov = startP
    this.pos = {
        x: 0,
        y: 0,
        z: 0
    }
    this.offset = {
        x: 0,
        y: 0,
        z: 0
    }
    this.rot = {
        x: 0,
        y: 0,
        z: 0
    }

    this.render = function() {
        scene.style.transformOrigin = "calc(50% + "+ this.pos.x +"px) calc(50% + "+ -this.pos.y +"px) "+ this.pos.z +"px" // Pivot
        
        scene.style.transform = "" // Clears transform
        
        scene.style.transform += "translateX("+ -this.pos.x +"px) " // X pivot offset
        scene.style.transform += "translateY("+ this.pos.y +"px) " // Y pivot offset
        scene.style.transform += "translateZ("+ -this.pos.z +"px) " // Z pivot offset

        scene.style.transform += "translateX(-50%) translateY(-50%) " // Makes element's center go to the real center
        scene.style.transform += "translateZ("+ this.fov +"px) " // Z pos

        scene.style.transform += "translateX("+ -this.offset.x +"px) " // offset
        scene.style.transform += "translateY("+ this.offset.y +"px) " // offset
        scene.style.transform += "translateZ("+ -this.offset.z +"px) " // offset

        scene.style.transform += "rotateZ("+ this.rot.z +"deg) " // Z rot
        scene.style.transform += "rotateX("+ this.rot.x +"deg) " // X rot
        scene.style.transform += "rotateY("+ this.rot.y +"deg) " // Y rot
    }

    this.setFov = function(num) {
        this.fov = num
        element.style.perspective = num +"px"
        this.render()
    }
    this.setPos = function(options) {
        this.pos.x = options.x
        this.pos.y = options.y
        this.pos.z = options.z
        this.render()
    }
    this.setOffset = function(options) {
        this.offset.x = options.x
        this.offset.y = options.y
        this.offset.z = options.z
        this.render()
    }
    this.setRot = function(options) {
        this.rot.x = options.x
        this.rot.y = options.y
        this.rot.z = options.z
        this.render()
    }
    this.setTransition = function(options) {
        const toSet = "transform "+ options.time +"s "+ options.curve
        scene.style.transition = toSet
    }

    this.append = function(sprite) {
        scene.appendChild(sprite.body)
        sprite.parent = this
    }
}

export function sprite(options) {
    if (options == null) {options = {}}

    // HTML element creation
    this.body = document.createElement("div")
    this.body.style.position = "absolute"
    this.body.style.left = "50%"
    this.body.style.top = "50%"
    this.body.style.transform = "translateX(-50%) translateY(-50%)"
    this.body.style.transformStyle = "preserve-3d"
    this.body.style.imageRendering = "pixelated"
    this.body.style.pointerEvents = "none"

    // Default characteristics and variables creation
    this.pos = options.pos || {
        x: 0,
        y: 0,
        z: 0
    }
    this.rot = options.rot || {
        x: 0,
        y: 0,
        z: 0
    }
    this.scale = options.scale || {
        x: 1,
        y: 1,
        z: 1
    }
    this.pivot = options.pivot || {
        x: 0,
        y: 0,
        z: 0
    }
    this.pivotPercent = options.pivotPercent || {
        x: 0,
        y: 0
    }
    
    this.parent = null

    this.render = function() {
        const pivotX = "calc(50% + "+ this.pivot.x +"px + "+ this.pivotPercent.x +"%)" // X pivot
        const pivotY = "calc(50% + "+ -this.pivot.y +"px + "+ -this.pivotPercent.y +"%)" // Y pivot
        const pivotZ = this.pivot.z +"px" // Z pivot
        this.body.style.transformOrigin = pivotX + pivotY + pivotZ // Joined together for readability

        this.body.style.transform = "" // Clears transform
        this.body.style.transform += "translateX(-50%) translateY(-50%) " // Makes element's center go to the real center

        this.body.style.transform += "translateX("+ -this.pivot.x +"px)" // X pivot compensation
        this.body.style.transform += "translateY("+ this.pivot.y +"px)" // Y pivot compensation
        this.body.style.transform += "translateX("+ -this.pivotPercent.x +"%)" // X pivot percent compensation
        this.body.style.transform += "translateY("+ this.pivotPercent.y +"%)" // Y pivot percent compensation

        this.body.style.transform += "translateX("+ this.pos.x +"px) " // X pos
        this.body.style.transform += "translateY("+ -this.pos.y +"px) " // Y pos
        this.body.style.transform += "translateZ("+ this.pos.z +"px) " // Z pos

        this.body.style.transform += "rotate3d(0, 1, 0, "+ this.rot.y +"deg) " // Y rot
        this.body.style.transform += "rotate3d(1, 0, 0, "+ this.rot.x +"deg) " // X rot
        this.body.style.transform += "rotate3d(0, 0, 1, "+ this.rot.z +"deg) " // Z rot

        this.body.style.transform += "scale3d("+ this.scale.x +", "+ this.scale.y +", "+ this.scale.z +")" // Scale
    }
    this.body.addEventListener("mousedown", (event) => {
        if (this.onClick) {
            event.stopPropagation()
            //console.log(event.offsetX)
            const x = event.offsetX - (nopx(this.body.style.width) / 2)
            const y = (event.offsetY - (nopx(this.body.style.height) / 2)) * -1
            this.onClick(x, y)
            //console.log("clicked at "+ x +" "+ y)
        }
    })

    this.setPos = function(options) {
        this.pos.x = options.x
        this.pos.y = options.y
        this.pos.z = options.z
        this.render()
    }
    this.setRot = function(options) {
        this.rot.x = options.x
        this.rot.y = options.y
        this.rot.z = options.z
        this.render()
    }
    this.setScale = function(options) {
        if (typeof options == "number") {
            this.scale.x = options
            this.scale.y = options
            this.scale.z = options
        } else {
            this.scale.x = options.x
            this.scale.y = options.y
            this.scale.z = options.z
        }
        this.render()
    }
    this.setPivot = function(options) {
        this.pivot.x = options.x
        this.pivot.y = options.y
        this.pivot.z = options.z
        this.render()
    }
    this.setPivotPercent = function(options) {
        this.pivotPercent.x = options.x
        this.pivotPercent.y = options.y
        this.pivotPercent.z = options.z
        this.render()
    }
    this.setTexture = function(url) {
        const body = this.body
        if (url) {
            const img = new Image();
            img.onload = function() {
                body.style.width = img.width +"px"
                body.style.height = img.height +"px"
                body.style.backgroundImage = url
            }
            img.src = url
        } else {
            body.style.width = ""
            body.style.height = ""
            body.style.backgroundImage = ""
        }
    }
    this.setOnClick = function(func) {
        this.onClick = func
        if (func == null) {
            this.body.style.pointerEvents = "none"
        } else {
            this.body.style.pointerEvents = "all"
        }
        
    }
    this.setTransition = function(options) {
        this.body.style.transition = "transform "+ options
    }

    this.append = function(sprite) {
        this.body.appendChild(sprite.body)
        sprite.parent = this
    }
    this.getGlobalRot = function() {
        let myRot = this.rot
        if (this.parent instanceof camera) {
            return myRot
        } else {
            const parentRot = this.parent.getGlobalRot()
            myRot.x += parentRot.x
            myRot.y += parentRot.y
            myRot.z += parentRot.z
        }
        return myRot
    }
    this.getNormal = function() {
        const normal = angToVec({
            x: this.rot.x,
            y: this.rot.y - 90
        })
        return normal
    }

    if (options.texture) {
        this.setTexture(options.texture)
    }
    this.render()
}