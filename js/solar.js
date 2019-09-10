(function () {
    let scene, camera, renderer, canvas, controls;
    let directionalLight, ambientLight, hemiLight;
    let SCREEN_WIDTH = window.innerWidth
    let SCREEN_HEIGHT = window.innerHeight
    let div = document.getElementById('canvas_container');
    let DIV_WIDTH = div.clientWidth
    let raycaster, mouse, INTERSECTED;
    let planetObject;
    let xmlhttp = new XMLHttpRequest();
    let json_url = "js/file.json";
    let documents;
    let zoomAnimation = null;

    let solarEffects = {
        shadows: true,
        exposure: 0.68,
        brightness: 400,
        hemiIrradiance: 1.5
    };

    hideActiveTopic()

    // xmlhttp.onreadystatechange = function () {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         documents = JSON.parse(xmlhttp.responseText);
    //         setupScene();
    //     }
    // }

    // xmlhttp.open("GET", json_url, true);
    // xmlhttp.send();

    const item = window.localStorage.getItem('lda');
    documents = JSON.parse(item)

    setupScene();


    function setupScene() {
        scene = new THREE.Scene();

        // set up camera
        initCamera();

        // set up light
        // ambientLight = new THREE.AmbientLight(0x333333);
        // scene.add(ambientLight);
        // directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // directionalLight.position.set(5, 3, 5);
        // scene.add(directionalLight);
        hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.5);
        hemiLight.intensity = solarEffects.hemiIrradiance
        scene.add( hemiLight );

        // set up renderer
        initRenderer()

        // setup cosmos
        addStars();

        // add planets
        planetObject = initSolarBody(documents.data.topics)
        scene.add(planetObject)

        // load sidebar topics
        showTopics(documents.data.topics)

        // constellation = init()
        // scene.add(constellation)

        // set up controls
        initControls();

        // init raycaster and mouse
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // instantiate eventlistener
        div.addEventListener('mousemove', onDocumentMouseMove, false);
        div.addEventListener('click', onDocumentMouseDown, false);
        window.addEventListener('resize', resize, false);

        animateSolarSystem();
    }

    function reloadScene() {
        cancelAnimationFrame(zoomAnimation);

        // initCamera();reloadScene
        camera.fov = 65;
        camera.position.set(3500, 400, 0);
        camera.lookAt(scene.position);
        camera.updateProjectionMatrix();


        scene.add(planetObject)
        rotatePlanet()

        div.addEventListener('click', onDocumentMouseDown, false);
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(
            65,                                           // Field of view
            DIV_WIDTH / SCREEN_HEIGHT,                   // aspect ratio
            0.1,                                        // Near plane
            4000                                       // Far plane
        );
        camera.position.set(3500, 400, 0);
        camera.lookAt(scene.position);
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('scene'),
            antialias: true
        });
        renderer.setSize(DIV_WIDTH, SCREEN_HEIGHT);
        renderer.setClearColor(0x000000);
        renderer.domElement.style.postion = "fixed"
    }

    function initControls() {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.maxDistance = camera.far / 2;
        controls.dampingFactor = 1;
    }

    function resize() {
        // renderer customization
        DIV_WIDTH = div.clientWidth;
        SCREEN_HEIGHT = window.innerHeight;
        console.log("DIV: ", DIV_WIDTH)
        console.log("SCREEN", SCREEN_HEIGHT)
        renderer.setSize(DIV_WIDTH, SCREEN_HEIGHT);

        // camera customization
        camera.aspect = DIV_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
    }

    function render() {
        renderer.render(scene, camera)
    }

    function addStars() {
        var geometry = new THREE.Geometry();

        for (var i = 0; i < 2500; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = THREE.Math.randFloatSpread(4000);
            vertex.y = THREE.Math.randFloatSpread(3000);
            vertex.z = THREE.Math.randFloatSpread(4000);

            geometry.vertices.push(vertex);

        }

        var particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
        scene.add(particles);
    }

    function onDocumentMouseMove(event) {
        event.preventDefault();

        mouse.x = (event.offsetX / DIV_WIDTH) * 2 - 1;
        mouse.y = - (event.offsetY / SCREEN_HEIGHT) * 2 + 1;
    }

    function onDocumentMouseDown() {

        raycaster.setFromCamera(mouse.clone(), camera);

        var intersects = raycaster.intersectObjects(planetObject.children);

        if (intersects.length > 0) {

            var intersect = intersects[0];
            var objectType = intersect.object.type

            if (objectType == "Mesh") {
                console.log(intersect)
                changeScene(intersect)
            }

        }

    }

    function onWordClick() {
        raycaster.setFromCamera(mouse.clone(), camera);

        var activePlanet = scene.children[scene.children.length - 1]
        var intersects = raycaster.intersectObjects(activePlanet.children);

        if (intersects.length > 0) {

            var intersect = intersects[0];
            var objectType = intersect.object.type

            alert(intersect.object.name)

        }
    }

    function updateCamera(planet) {
        // camera.position.set(100, 700, 100);
        camera.lookAt(planet.position)
        zoom();
    }

    function zoom() {
        zoomAnimation = requestAnimationFrame(zoom)
        if (camera.fov > 15) {
            camera.fov -= 1;
            camera.updateProjectionMatrix();
        }
    }

    $('#back_to_home').click(function () {
        scene.remove(scene.children[scene.children.length - 1])
        div.removeEventListener('click', onWordClick, false);
        reloadScene();
        hideActiveTopic();
    });

    function showActiveTopic(topic) {
        $('.active-topic').toggle()
        $('#selected_topic').text(topic)
    }

    function hideActiveTopic() {
        $('.active-topic').toggle()
        $('#selected_topic').text('')
    }

    function changeScene(planet) {
        div.removeEventListener('click', onDocumentMouseDown, false);
        scene.remove(planetObject)

        var planetCopy = planet.object.clone()

        resetPlanet(planetCopy)
        scene.add(planetCopy)
        div.addEventListener('click', onWordClick, false);

        addWords(planetCopy, getRadius(planetCopy), planetCopy.userData["words"])

        showActiveTopic(planetCopy.name)

        updateCamera(planetCopy);
        // zoom()
    }

    function animateSolarSystem() {
        requestAnimationFrame(animateSolarSystem)
        controls.update();
        render();
    }

}());