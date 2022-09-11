import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const loader = new OBJLoader();
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const ericTexture = new THREE.TextureLoader().load('portrait.jpg');

const properties = {
    color: 0xffeded,
    emmisive: 0xff0000,
    shininess: 100,
    specular: 0xffeded,
    refractionRatio: 0.5,
}

const material = new THREE.MeshPhongMaterial(properties)

const textured_properties = {
    color: 0xffeded,
    emmisive: 0xff0000,
    shininess: 100,
    specular: 0xffeded,
    refractionRatio: 0.2,
    map: ericTexture
}
const textured_material = new THREE.MeshPhongMaterial(textured_properties)

// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    textured_material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.32, 100, 20),
    material
)
const mesh4 = new THREE.Mesh(

    new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1, 0, 1),
            new THREE.Vector3(-0.5, 0.5, 0.5),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.5, -0.5, 0.5),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1.5, 0.5, 0.5),
        ]),
        64,
        0.3,
        32,
        false
    ),
    material
)
const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const normalTexture = new THREE.TextureLoader().load('normal.jpg')
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture
    })
);
moon.position.z = 0;
// moon.size.set(3, 3, 3);

scene.add(mesh1, mesh2, mesh3, mesh4, moon)

const objectsDistance = 4

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
mesh4.position.y = - objectsDistance * 5
moon.position.y = - objectsDistance * 6


mesh1.position.x = 2
mesh2.position.x = - 7 // Starts off screen
mesh3.position.x = 2
mesh4.position.x = -2
moon.position.x = 2

let sectionMeshes = [mesh1, mesh2, mesh3, mesh4, moon]

// Load the mustang texture
const mustangTexture = new THREE.TextureLoader().load('./mustang_texture.jpg');

let mustangObj, mustangMesh;
mustangObj = loader.load('./mustang.obj', function (mustang) {
    console.log("This is the mustang: " + mustang.children.forEach(child => {
        console.log(child);
        try {
            child.material = material;
            console.log("Set the texture");
        } catch (err) {
            console.log(err);
        }
    }));

    mustang.position.x = -2
    mustang.position.y = - objectsDistance * 3.2
    let mustangScale = 0.65;
    mustang.scale.set(mustangScale, mustangScale, mustangScale);

    mustang.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            // child.material = new THREE.MeshPhongMaterial(properties);
            child.material = material;
            child.material.map = mustangTexture;
            mustangMesh = child;

            // Save the mesh to section meshes
            sectionMeshes.push(mustangMesh);
            console.log("Section meshes: ", sectionMeshes);
        }

        scene.add(mustang);
        mustangObj = mustang;

    }, function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened');
        console.log(error);
    });
});

// Load the computer chip model
const chipTexture = new THREE.TextureLoader().load('./22V10_label.jpg');
let chipObj, chipMesh;
chipObj = loader.load('./22V10.obj', function (chip) {
    console.log("This is the chip: " + chip.children.forEach(child => {
        console.log(child);
        try {
            child.material = material;
            // child.material.map = chipTexture;
            console.log("Set the chip texture");
        } catch (err) {
            console.log(err);
        }
    }));

    chip.position.x = 2.4
    chip.position.y = - objectsDistance * 4
    let chipScale = 0.5;
    chip.scale.set(chipScale, chipScale, chipScale);
    chip.rotation.set(0, 0.6, 0.25);

    chip.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
            child.material.map = chipTexture;
            chipMesh = child;

            // Save the mesh to section meshes
            sectionMeshes.push(chipMesh);
            console.log("Section meshes: ", sectionMeshes);
        }

        scene.add(chip);
        chipObj = chip;

    }, function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.log('An error happened');
        console.log(error);
    });
});

/**
 * Particles
 */
// Geometry
const particlesCount = 500
const numSections = 4;
const positions = new Float32Array(particlesCount * numSections)

for (let i = 0; i < particlesCount; i++) {
    positions[i * numSections + 0] = (Math.random() - 0.5) * 10
    // y distribution has to cover all the objects
    positions[i * numSections + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * (numSections + 4)
    positions[i * numSections + 2] = (Math.random() - 0.5) * 10
    // positions[i * numSections + 3] = - objectsDistance * 0.5 + Math.random() * objectsDistance * numSections
    // positions[i * numSections + 4] = (Math.random() - 0.5) * 10 * 5
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, numSections))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.03,
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

// Add a directional light pointing at the second mesh
const directionalLight2 = new THREE.DirectionalLight('#ffffff', 0.04)

// Position the second light between the camera and the second mesh
directionalLight2.position.set(1, -1, 5)

// directionalLight2.position.set(2, 4, 2)
scene.add(directionalLight2)

// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.12)
ambientLight.position.set(-1, -1, 0)
scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */

// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

const defaultCameraX = camera.position.x
const defaultCameraY = camera.position.y

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

// State to monitor whether mesh 2 is in view
let mesh2InView = false

// Use a listener to update the scroll value
window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    // Calculate the current section
    const newSection = Math.round(scrollY / sizes.height)

    // Update currentSection if needed
    if (currentSection != newSection) {

        // Log all the data
        console.log({
            "scrollY": scrollY,
            "currentSection": currentSection,
            "newSection": newSection
        })

        currentSection = newSection

        // If scroll to new section
        if (currentSection != 1) {
            gsap.to(
                // Get the current mesh and rotate it
                sectionMeshes[currentSection].rotation,
                {
                    duration: 3,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3'
                }
            )
        }

        // If scroll to section 2
        if (currentSection == 1) {
            // If mesh 2 is not in view
            if (!mesh2InView) {
                // Set mesh 2 in view
                mesh2InView = true

                // Set rotation to face the camera
                sectionMeshes[currentSection].rotation.y = Math.PI * 0.5

                // Translate mesh 2 to an x position of -2
                gsap.to(
                    sectionMeshes[1].position,
                    {
                        duration: 1.5,
                        ease: 'power2.inOut',
                        x: -2
                    }
                )
            }
        } else {
            // If mesh 2 is in view
            if (mesh2InView) {
                // Set mesh 2 not in view
                mesh2InView = false

                // Translate mesh 2 to an x position of 2
                gsap.to(
                    sectionMeshes[1].position,
                    {
                        duration: 1,
                        ease: 'power2.inOut',
                        x: -7
                    }
                )
            }
        }

        // If scroll to mesh 3
        if (currentSection == 2) {

            cameraGroup.rotation.y = 0
            let currentCameraRotation = cameraGroup.rotation.y

            // Reset rotation of camera
            gsap.to(
                cameraGroup.rotation,
                {
                    duration: 1,
                    ease: 'power2.inOut',
                    x: 0,
                    y: 0
                }
            )

            // Calculate the target rotation
            let targetRotation = currentSection * Math.PI

            // Calculate the rotation difference
            let rotationDifference = targetRotation - currentCameraRotation

            console.log({
                "currentCameraRotation": currentCameraRotation,
                "targetRotation": targetRotation,
                "rotationDifference": rotationDifference
            })

            // Perform the rotation
            gsap.to(
                cameraGroup.rotation,
                {
                    duration: 3,
                    ease: 'power2.inOut',
                    y: currentCameraRotation - rotationDifference
                }
            )
            cameraGroup.rotation.y = currentCameraRotation
        }

        // If scroll to the moon
        if (currentSection == 6) {

            // Have the moon rotate
            gsap.to(
                sectionMeshes[currentSection].rotation,
                {
                    duration: 3,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3'
                }
            )
        }
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

let zoomedOut = false

// Listen for click
window.addEventListener('click', () => {
    // If click on the first mesh
    if (currentSection == 0) {
        // Store the camera's current rotation
        let currentCameraRotation = cameraGroup.rotation.y

        // Calculate the target rotation
        let targetRotation = currentSection * Math.PI * 2

        // Calculate the rotation difference
        let rotationDifference = targetRotation - currentCameraRotation

        // Perform the rotation
        gsap.to(
            cameraGroup.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                y: currentCameraRotation + rotationDifference
            }
        )
    }

    if (currentSection == 1) {
        // Store the current rotation of mesh 2
        let currentMesh2Rotation = sectionMeshes[1].rotation.y

        // Calculate the target rotation
        let targetRotation = currentSection * Math.PI * 2

        // Calculate the rotation difference
        let rotationDifference = targetRotation - currentMesh2Rotation

        // Perform the rotation
        gsap.to(
            sectionMeshes[1].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                y: currentMesh2Rotation + rotationDifference
            }
        )
    }

    if (currentSection == 2) {
        cameraGroup.rotation.y = 0

        // Store the camera's current rotation
        let currentCameraRotation = cameraGroup.rotation.y

        // Calculate the target rotation
        let targetRotation = currentSection * Math.PI

        // Calculate the rotation difference
        let rotationDifference = targetRotation - currentCameraRotation

        // Perform the rotation
        gsap.to(
            cameraGroup.rotation,
            {
                duration: 3,
                ease: 'power2.inOut',
                y: currentCameraRotation + rotationDifference
            }
        )
    }

    if (currentSection == 6) {
        console.log("SECTION 6")
    }


    if (currentSection == 7) {

        if (!zoomedOut) {

            // Zoom the camera out gradually so that the user can see the entire scene
            gsap.to(
                camera.position,
                {
                    duration: 5,
                    ease: 'power2.inOut',
                    z: 50,
                    y: 100,
                    x: 0
                    // onComplete: () => {
                    //     // Reset the camera's position
                    //     camera.position.z = 10
                    // }
                }
            )

            // Move the camera up gradually so that the user can see the entire scene
            gsap.to(
                camera.position,
                {
                    duration: 5,
                    ease: 'power2.inOut',
                    y: 1500 * 5
                }
            )

            // Rotate the camera so that the user can see the entire scene
            // gsap.to(
            //     cameraGroup.rotation,
            //     {
            //         duration: 3,
            //         ease: 'power2.inOut',
            //         y: Math.PI * 2,
            //     }
            // )

            zoomedOut = true

        } else {
            // Reset the camera's position
            gsap.to(
                camera.position,
                {
                    duration: 5,
                    ease: 'power2.inOut',
                    z: 10,
                    y: 0,
                    x: 0,
                    onComplete: () => {
                        // Reset the camera's position
                        camera.position.z = 10,
                            camera.position.y = 0,
                            camera.position.x = 0
                    }
                }
            )

            zoomedOut = false

        }
    }

})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate meshes
    for (const mesh of sectionMeshes) {

        // If not undefined
        if (mesh) {

            // Only rotate if not the second mesh
            if (mesh != sectionMeshes[1]) {
                mesh.rotation.x += deltaTime * 0.1
                mesh.rotation.y += deltaTime * 0.12
            } else {
                // Rotate the second mesh
                mesh.rotation.y += deltaTime * 0.12
            }
        } else {
            console.log('undefined @ ' + mesh)
        }
    }

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    // Parallax
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 4 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 4 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()