let textureLoader = new THREE.TextureLoader();
let material = sphere = null;
let defaultRadius = 80;
let solarBodies = new THREE.Object3D();
let planets = [];
let rotate = null;

// TODO: documents.splice(10) to get the one for the planets
// TODO: send the rest to the constellation

function initSolarBody(data) {
    for (var i = 0; i < data.length; i++) {
        switch (i) {
            case 0:
                var sun = createSun(80, 30, 30)
                sun.userData["id"] = data[i]["id"]
                sun.name = data[i]["topic"]
                sun.userData["words"] = data[i]["words"]
                createText(sun, 80, sun.name)
                solarBodies.add(sun)
                break;
            case 1:
                var mercury = createMercury(23, 35, 35)
                mercury.userData["id"] = data[i]["id"]
                mercury.name = data[i]["topic"]
                mercury.userData["words"] = data[i]["words"]
                createText(mercury, 23, mercury.name)
                solarBodies.add(mercury)
                solarBodies.add(addOrbit(mercury));
                break;
            case 2:
                var venus = createVenus(24, 40, 40)
                venus.userData["id"] = data[i]["id"]
                venus.name = data[i]["topic"]
                venus.userData["words"] = data[i]["words"]
                createText(venus, 24, venus.name)
                solarBodies.add(venus)
                solarBodies.add(addOrbit(venus));
                break;
            case 3:
                var earth = createEarth(25, 45, 45)
                earth.userData["id"] = data[i]["id"]
                earth.name = data[i]["topic"]
                earth.userData["words"] = data[i]["words"]
                createText(earth, 25, earth.name)
                solarBodies.add(earth)
                solarBodies.add(addOrbit(earth));
                break;
            case 4:
                var mars = createMars(20, 30, 30)
                mars.userData["id"] = data[i]["id"]
                mars.name = data[i]["topic"]
                mars.userData["words"] = data[i]["words"]
                createText(mars, 20, mars.name)
                solarBodies.add(mars)
                solarBodies.add(addOrbit(mars));
                break;
            case 5:
                var jupiter = createJupiter(45, 55, 55)
                jupiter.userData["id"] = data[i]["id"]
                jupiter.name = data[i]["topic"]
                jupiter.userData["words"] = data[i]["words"]
                createText(jupiter, 45, jupiter.name)
                solarBodies.add(jupiter)
                solarBodies.add(addOrbit(jupiter));
                break;
            case 6:
                var saturn = createSaturn(35, 45, 45)
                saturn.userData["id"] = data[i]["id"]
                saturn.name = data[i]["topic"]
                saturn.userData["words"] = data[i]["words"]
                createText(saturn, 35, saturn.name)
                solarBodies.add(saturn)
                solarBodies.add(addOrbit(saturn));
                break;
            case 7:
                var uranus = createUranus(25, 40, 40)
                uranus.userData["id"] = data[i]["id"]
                uranus.name = data[i]["topic"]
                uranus.userData["words"] = data[i]["words"]
                createText(uranus, 25, uranus.name)
                solarBodies.add(uranus)
                solarBodies.add(addOrbit(uranus));
                break;
            case 8:
                var neptune = createNeptune(24, 40, 40)
                neptune.userData["id"] = data[i]["id"]
                neptune.name = data[i]["topic"]
                neptune.userData["words"] = data[i]["words"]
                createText(neptune, 24, neptune.name)
                solarBodies.add(neptune)
                solarBodies.add(addOrbit(neptune));
                break;
            case 9:
                var pluto = createPluto(15, 30, 30)
                pluto.userData["id"] = data[i]["id"]
                pluto.name = data[i]["topic"]
                pluto.userData["words"] = data[i]["words"]
                createText(pluto, 15, pluto.name)
                solarBodies.add(pluto)
                solarBodies.add(addOrbit(pluto));
                break;
            default:
                // TODO: Handle error here
                break;
        }
    }

    rotatePlanet()
    // return {solarBodies, planets};
    return solarBodies;

}

function addOrbit(planet) {
    var size = 20;
    planet.orbitRadius = Math.random() * 50 + 100 + defaultRadius;
    planet.rotSpeed = 0.005 + Math.random() * 0.01;
    planet.rotSpeed *= Math.random() < .10 ? -1 : 1;
    planet.rot = Math.random();
    planet.orbitSpeed = (0.02 - 3 * 0.0048) * 0.25;
    planet.orbit = Math.random() * Math.PI * 2;
    planet.position.set(planet.orbitRadius, 0, 0);

    defaultRadius = planet.orbitRadius + size;
    planets.push(planet);
    updateGeometry(planet.geometry)

    var orbit = new THREE.Line(
        new THREE.CircleGeometry(planet.orbitRadius, planet.orbitRadius * 10),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: .09,
            side: THREE.BackSide
        })
    );
    orbit.geometry.vertices.shift();
    orbit.rotation.x = THREE.Math.degToRad(90);

    return orbit;
}

function getRadius(planet) {
    return planet.geometry.boundingSphere.radius
}

function updateGeometry(geometry) {
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
}

function rotatePlanet() {
    for (var p in planets) {
        var planet = planets[p];
        planet.rot += planet.rotSpeed
        planet.rotation.set(0, planet.rot, 0);
        planet.orbit += planet.orbitSpeed;
        planet.position.set(Math.cos(planet.orbit) * planet.orbitRadius, 0, Math.sin(planet.orbit) * planet.orbitRadius);
    }
    rotate = requestAnimationFrame(rotatePlanet)
}

function stopPlanetRotation(planet) {
    planet.position.set(0, 0, 0);
    cancelAnimationFrame(rotate)
}

function resetPlanet(planet){
    planet.children = []
    stopPlanetRotation(planet)
}

function createSun(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    var sunLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/sunmap.jpg')
    });

    return new THREE.Mesh(sphere, material);
}

function createMercury(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/mercurymap.jpg'),
        bumpMap: textureLoader.load('../assets/textures/mercurybump.jpg'),
        bumpScale: 0.05
    });

    return new THREE.Mesh(sphere, material);
}

function createVenus(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/venusmap.jpg'),
        bumpMap: textureLoader.load('../assets/textures/venusbump.jpg'),
        bumpScale: 0.03
    });

    return new THREE.Mesh(sphere, material);
}

function createEarth(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/earthmap1k.jpg'),
        bumpMap: textureLoader.load('../assets/textures/earthbump1k.jpg'),
        bumpScale: 0.2,
        specularMap: textureLoader.load('../assets/textures/earthspec1k.jpg'),
        specular: new THREE.Color('grey')
    });

    var earth = new THREE.Mesh(sphere, material);

    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/earthcloudmap.jpg'),
        side: THREE.DoubleSide,
        opacity: 0.1,
        transparent: true,
        depthWrite: false,
    })
    var cloud = new THREE.Mesh(sphere, material)
    earth.add(cloud)

    return earth;

}
function createMars(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/marsmap1k.jpg'),
        bumpMap: textureLoader.load('../assets/textures/marsbump1k.jpg'),
        bumpScale: 0.2
    });

    return new THREE.Mesh(sphere, material);
}

function createJupiter(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/jupitermap.jpg'),
        bumpMap: textureLoader.load('../assets/textures/jupitermap.jpg'),
        bumpScale: 0.05
    });

    return new THREE.Mesh(sphere, material);
}

function createSaturn(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/saturnmap.jpg')
    });

    return new THREE.Mesh(sphere, material);
}
function createUranus(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/uranusmap.jpg')
    });

    return new THREE.Mesh(sphere, material);
}
function createNeptune(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/neptunemap.jpg'),
        bumpMap: textureLoader.load('../assets/textures/neptunemap.jpg'),
        bumpScale: 0.05
    });

    return new THREE.Mesh(sphere, material)
}
function createPluto(radius, widthSegment, heightSegment) {
    sphere = new THREE.SphereGeometry(radius, widthSegment, heightSegment);
    material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/textures/plutomap1k.jpg'),
        bumpMap: textureLoader.load('../assets/textures/plutobump1k.jpg'),
        bumpScale: 0.05
    });

    return new THREE.Mesh(sphere, material)
}