import * as ben from "./bengine.js"

let heldKeys = {}
window.onkeydown = function(e) {
    heldKeys[e.code] = true
    console.log(e.code)
}
window.onkeyup = function(e) {
    heldKeys[e.code] = false
}

const viewport = document.getElementById("viewport")
const camera = new ben.camera(viewport)

viewport.onclick = function() {
    viewport.requestPointerLock()
}

function clamp(n, t, b) {
    return Math.max(Math.min(n, t),b)
}

viewport.onmousemove = function(event) {
    console.log(event)
    if (document.pointerLockElement == viewport) {
        camera.setRot({
            x: clamp(camera.rot.x + event.movementY/-20, 90, -90),
            y: camera.rot.y + event.movementX/20,
            z: 0
        })
    }
}

camera.setPos({
    x: 0,
    y: 0,
    z: 500
})

const all = new ben.sprite({
    pos: {
        x: 0,
        y: -100,
        z: 0
    },
    texture: "pictures/placeholder2.png"
})
camera.append(all)
all.body.append(document.getElementById("all"))

function render() {
    camera.setFov(window.innerHeight/976*500)

    if (document.pointerLockElement == viewport) {
        let walkSpeed = 3
        if (heldKeys["ShiftLeft"]) {walkSpeed *= 2}

        if (heldKeys["KeyW"]) {
            camera.setPos({
                x: camera.pos.x + Math.sin(camera.rot.y*Math.PI/180)*walkSpeed,
                y: 0,
                z: camera.pos.z - Math.cos(camera.rot.y*Math.PI/180)*walkSpeed
            })
        }
        if (heldKeys["KeyS"]) {
            camera.setPos({
                x: camera.pos.x - Math.sin(camera.rot.y*Math.PI/180)*walkSpeed,
                y: 0,
                z: camera.pos.z + Math.cos(camera.rot.y*Math.PI/180)*walkSpeed
            })
        }
        if (heldKeys["KeyD"]) {
            camera.setPos({
                x: camera.pos.x + Math.cos(camera.rot.y*Math.PI/180)*walkSpeed,
                y: 0,
                z: camera.pos.z + Math.sin(camera.rot.y*Math.PI/180)*walkSpeed
            })
        }
        if (heldKeys["KeyA"]) {
            camera.setPos({
                x: camera.pos.x - Math.cos(camera.rot.y*Math.PI/180)*walkSpeed,
                y: 0,
                z: camera.pos.z - Math.sin(camera.rot.y*Math.PI/180)*walkSpeed
            })
        }
    }

    requestAnimationFrame(render)
}

requestAnimationFrame(render)