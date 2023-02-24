import rapier from "rapier2d-compat";
import { gl, initWebGLContext } from "./webgl-context.js";
import initRapier2D from "./init-rapier2d.js";

let world, playerRigidBody, debugRender;

const maxTimeStepMs = 1 / 60 * 1000;

function step(deltaMs) {
    const dt = Math.min(deltaMs, maxTimeStepMs) / 1000;
    world.step();
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    const vtx = debugRender.vertices;
    console.log(vtx);
}

async function init() {
	if (!initWebGLContext("renderCanvas")) return;
    gl.clearColor(0.2, 0.2, 0.2, 1);

    await initRapier2D();
    console.log(`Rapier2D version: ${rapier.version()}`);

    const gravity = new rapier.Vector2(0, -9.8);
    world = new rapier.World(gravity);

    debugRender = world.debugRender();

    // Ground
    const groundColliderDesc = rapier.ColliderDesc.cuboid(5, 0.2);
    world.createCollider(groundColliderDesc);

    // Player
    const playerBodyDesc = rapier.RigidBodyDesc.dynamic()
        .setTranslation(0, 0);
    playerRigidBody = world.createRigidBody(playerBodyDesc);
    const playerColliderDesc = rapier.ColliderDesc.ball(0.5);
    world.createCollider(playerColliderDesc, playerRigidBody);

    (function animationLoop(prevMs) {
        const nowMs = window.performance.now()
        window.requestAnimationFrame(animationLoop.bind(null, nowMs));
        const deltaMs = nowMs - prevMs;
        step(deltaMs);
        draw();
    })(window.performance.now());
}

init();
