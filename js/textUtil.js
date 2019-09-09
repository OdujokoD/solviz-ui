var loader = new THREE.FontLoader();
var font = loader.load('assets/fonts/Montserrat_Regular.json');

function createText(planet, radius, text, position) {

    geometry = planet.geometry

    let redrawInterval = 1;
    let sprite = new THREE.TextSprite({
        textSize: radius * 1.5,
        redrawInterval,
        material: {
            color: 0xffffff,
        },
        texture: {
            text: text,
            fontFamily: "Arial", //'Verdana, Geneva, sans-serif',
        },
    });

    if (position === undefined) {
        let centroid = getCentroid(geometry)
        center = new THREE.Vector3(centroid.x, centroid.y + (radius * 1.5), centroid.z)
        sprite.position.copy(center)
    } else {
        sprite.position.copy(position)
    }
    planet.add(sprite);
}

function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 150;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r: 17, g: 17, b: 17, a: 1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness / 2, borderThickness / 2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 6);

    context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture}); // , useScreenCoordinates: false 
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    sprite.name = message
    // sprite.scale.set(0.002 * canvas.width, 0.0025 * canvas.height);
    // sprite.scale.set(0.05 * canvas.width, 0.25 * canvas.height);
    return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


function getCentroid(geometry) {
    geometry.centroid = new THREE.Vector3();

    for (let i = 0; i < geometry.vertices.length; i++) {
        geometry.centroid.add(geometry.vertices[i]);
    }

    return geometry.centroid.divideScalar(geometry.vertices.length);
}

function randomSpherePoint(x0, y0, z0, radius) {
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);
    var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
    var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
    var z = z0 + (radius * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
}

function addWords(planet, radius, word_list) {
    geometry = planet.geometry
    let centroid = getCentroid(geometry)

    for (word in word_list) {
        position = randomSpherePoint(centroid.x, centroid.y, centroid.z, radius * 1.5)
        // createText(planet, radius, word_list[word], position)
        let sprite = makeTextSprite( word_list[word], 
        { fontsize: radius * 1.1, fontface: "Arial", borderColor: {r:255, g:255, b:255, a:1.0} } );
    
        sprite.position.copy(position)
        planet.add(sprite);
    }
}