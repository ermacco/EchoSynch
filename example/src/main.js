import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Load GLB model
const loader = new GLTFLoader();
let model;

loader.load(
    // URL to your GLB file
    'Alfa.glb',
    
    // onLoad callback
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
        
        // Adjust model position if needed
        model.position.set(0, 0, 0);
        
        // If your model is too big/small, adjust scale:
        // model.scale.set(0.5, 0.5, 0.5);
    },
    
    // onProgress callback (optional)
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    
    // onError callback
    (error) => {
        console.error('Error loading model', error);
    }
);

// Position camera
camera.position.z = 5;
camera.position.y = 2;

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Add any animations or rotations here
    if (model) {
        // model.rotation.y += 0.01;
    }
    
    renderer.render(scene, camera);
}
animate();