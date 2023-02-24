import rapier from "rapier2d-compat";

export default function initRapier2D() {
    return new Promise(resolve => {
        rapier.init().then(() => {
            resolve();
        });
    });
}
