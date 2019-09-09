var mouseX = 0, mouseY = 0;
let particles = new THREE.Object3D();

function init() {

    var material = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(generateSprite()),
        blending: THREE.AdditiveBlending
    });

    for (var i = 0; i < 2000; i++) {

        particle = new THREE.Sprite(material);

        initParticle(particle, i * 10);

        particles.add(particle)
    }

    return particles
}

function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2,
         0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;

}

function initParticle(particle, delay) {

    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;

    // particle.position.set( 0, 0, 0 );
    particle.position.set(Math.random() * 4000 - 2000, Math.random() * 1000 - 400, Math.random() * 3000 - 2000);
    particle.scale.x = particle.scale.y = Math.random() * 16 + 16;

}

function animate() {

    requestAnimationFrame(animate);

    // render();

}
