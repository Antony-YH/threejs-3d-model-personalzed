import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer, stats, object, loader, gui;
let mixer;
let currentAction;
const actions = {}; 

const timer = new THREE.Timer();
timer.connect(document);

const params = { asset: 'Brooklyn Uprock' };

const assets = [
    'Brooklyn Uprock',
    'Kettlebell swing',
    'Dancing',
    'Punching Bag',
    'Fall Flat'
];

const keysMap = {
    '1': { name: 'Brooklyn Uprock', uiId: 'ui-anim-1' },
    '2': { name: 'Kettlebell swing', uiId: 'ui-anim-2' },
    '3': { name: 'Dancing', uiId: 'ui-anim-3' },
    '4': { name: 'Punching Bag', uiId: 'ui-anim-4' },
    '5': { name: 'Fall Flat', uiId: 'ui-anim-5' }
};

init();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 150, 300); 

    scene = new THREE.Scene();
    scene.background = null; 
    
    // CORRECCIÓN DE LA NIEBLA:
    // THREE.Fog(color, distancia_inicio, distancia_fin)
    // Empieza a 800 (lejos del modelo) y termina a 1800 (suavizando el horizonte)
    scene.fog = new THREE.Fog(0x444444, 800, 1800); 

    // --- ILUMINACIÓN ESTUDIO GRIS ---
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.2);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add(dirLight);

    // Luces de recorte (Rim Lights) para resaltar la silueta
    const rimLightCool = new THREE.DirectionalLight(0xc0d0f0, 3.5);
    rimLightCool.position.set(-150, 150, -150);
    scene.add(rimLightCool);

    const rimLightWhite = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLightWhite.position.set(150, 100, -150);
    scene.add(rimLightWhite);

    // --- ENTORNO GRIS MATE ---

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(4000, 4000), 
        new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            roughness: 0.8,
            metalness: 0.0, 
            transparent: true,
            opacity: 0.9, 
            depthWrite: false 
        })
    );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const grid = new THREE.GridHelper(2000, 40, 0x666666, 0x222222);
    grid.material.opacity = 0.1;
    grid.material.transparent = true;
    scene.add(grid);

    loader = new FBXLoader();
    loadBaseModelAndAnimations();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.enableDamping = true;
    controls.update();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', onKeyDown);

    stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = 'auto'; 
    stats.dom.style.bottom = '80px'; 
    stats.dom.style.left = '20px';
    stats.dom.style.zIndex = '15';
    document.body.appendChild(stats.dom);
    
    gui = new GUI({ title: 'Configuración 3D' });
    gui.add(params, 'asset', assets).name('Animación').onChange(function (value) {
        fadeToAction(value, 0.5);
        updateUIFromSelect(value);
    });
}

function loadBaseModelAndAnimations() {
    loader.load('./assets/models/fbx/personaje_base.fbx', function (group) {
        object = group;
        mixer = new THREE.AnimationMixer(object);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(object);

        assets.forEach((animName) => {
            loader.load('./assets/models/fbx/' + animName + '.fbx', function (animGroup) {
                const clip = animGroup.animations[0];
                const action = mixer.clipAction(clip);
                actions[animName] = action;
                
                if (animName === params.asset) {
                    currentAction = action;
                    currentAction.play();
                }
            });
        });
    });
}

function onKeyDown(event) {
    const mapEntry = keysMap[event.key];
    
    if (mapEntry && actions[mapEntry.name] && actions[mapEntry.name] !== currentAction) {
        const animName = mapEntry.name;
        
        params.asset = animName; 
        gui.controllersRecursive().forEach(c => c.updateDisplay()); 
        
        updateUI(mapEntry.uiId);
        fadeToAction(animName, 0.5);
    }
}

function updateUI(activeId) {
    document.querySelectorAll('.anim-item').forEach(el => {
        el.classList.remove('active');
    });
    const activeEl = document.getElementById(activeId);
    if(activeEl) activeEl.classList.add('active');
}

function updateUIFromSelect(animName) {
    for (const key in keysMap) {
        if (keysMap[key].name === animName) {
            updateUI(keysMap[key].uiId);
            break;
        }
    }
}

function fadeToAction(name, duration) {
    const previousAction = currentAction;
    currentAction = actions[name];

    if (previousAction && previousAction !== currentAction) {
        previousAction.fadeOut(duration);
        currentAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    timer.update();
    const delta = timer.getDelta();
    if (mixer) mixer.update(delta);
    
    renderer.render(scene, camera);
    stats.update();
}