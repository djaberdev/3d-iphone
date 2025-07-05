// Import Three.js
import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three";
import { hightlightsSlides, colors, themes, sizes, footerLinks } from "/src/constants/index.js";

/* -- Show/Hide Navbar Menu -- */
const menu = document.querySelector('.nav__menu');
const openMenu = document.getElementById("open__menu");
const toggleMenu = () => { menu.classList.toggle('active') };
openMenu.addEventListener("click", toggleMenu);

/* -- Set Hero Video Source Depends On Screen Width -- */

function setHeroVideo() {
    
    const heroVideo = document.querySelector('.hero__video video');
    const heroVideoSource = document.querySelector('.hero__video video source');
    const screenWidth = window.innerWidth;

    // Check For The Specific Device
    if (screenWidth < 768) {
        heroVideoSource.src = 'assets/videos/smallHero.mp4';
    } else {
        heroVideoSource.src = 'assets/videos/hero.mp4';
    }

    // Load The Hero Video After Update <source>
    heroVideo.load();

};

// Event Listeners
window.addEventListener('DOMContentLoaded', setHeroVideo);
window.addEventListener('resize', setHeroVideo);

/* -- Video Slider -- */

// Settings & Selecting Elements
const vsContainer = document.querySelector('.video__slider_container');

function setUpVideoCarousel() {

    // Loop Through The Slides Objects 
    hightlightsSlides.forEach(slideObj => {

        // Create The Slide Div
        const slideDiv = document.createElement('div');
        slideDiv.className = 'video__slider_item swiper-slide';
        slideDiv.setAttribute('data-id', slideObj.id);

        // Add Slide Div Childrens
        slideDiv.innerHTML = `
            <video muted autoplay loop>
                <source src="${slideObj.videoPath}" type="video/mp4">
            </video>

            <div class="slide-info">
                ${slideObj.textLists.map(textList => `<p>${textList}</p>`).join('')}
            </div>
        `;

        // Append The Slide Div 
        vsContainer.appendChild(slideDiv);

    });

};

setUpVideoCarousel();

/* -- Set Footer Links -- */
document.querySelector('.footer__links').innerHTML = `
    ${footerLinks.map(link => `<a href="" class="footer__link">${link}</a>`).join('<i class="ri-record-circle-fill separator"></i>')}
`;

/* -- 3D iPhone Model Controls | Colors and Sizes -- */
const phoneInfo = document.querySelector(".phone__info");
const colorsContainer = document.querySelector(".colors");
const sizesContainer = document.querySelector(".sizes");

colors.forEach((colorObj) => {

    const colorBullet = document.createElement("div");
    colorBullet.classList.add("color__bullet");
    colorBullet.setAttribute("data-id", colorObj.id);
    colorBullet.setAttribute("data-theme", colorObj.themeName);

    colorBullet.innerHTML = `
        <img
            src="${colorObj.img}"
            alt="color ${colorObj.id}"
        />
    `;

    colorsContainer.appendChild(colorBullet);

});

sizes.forEach((sizeObj) => {

    const sizeEl = document.createElement("div");
    sizeEl.classList.add("size");
    sizeEl.setAttribute("data-value", sizeObj.value);

    sizeEl.innerHTML = `<span>${sizeObj.label}"</span>`;

    sizesContainer.appendChild(sizeEl);

});

/* -- 3D iPhone Model -- */

// Get <canvas>
const canvasEl = document.getElementById("world");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    canvasEl.clientWidth / canvasEl.clientHeight,
    0.1,
    2000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true
});
renderer.setSize(canvasEl.clientWidth, canvasEl.clientHeight);
renderer.setPixelRatio(2);

// Set Breakpoint
let isInMobile = window.innerWidth <= 600 ? true : false;

// Handle Window Resize
window.addEventListener("resize", () => {

    camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasEl.clientWidth, canvasEl.clientHeight);

    window.innerWidth <= 600 ? isInMobile = true : isInMobile = false;

});

// Light
const dirLight = new THREE.DirectionalLight(0xf9f9f9, 3);
dirLight.position.set(5, 5, 1);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xf9f9f9, 3);
dirLight2.position.set(-5, 5, 1);
scene.add(dirLight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// orbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;

// Load The 3D iPhone Model
const loaderEL = document.querySelector(".loader");
const progressCount = document.querySelector(".loader .progress-count");
const progressFill = document.querySelector(".loader .progress .progress-fill");

// Settings
let phoneModel = null;
let selectedSize = "small";
let screenTexture = null;
let screenMap = null;
let xlScale = 33; // For Large Select 
let lgScale = 30; // For Large Select
let smScale = 28; // For Small Select
let xsScale = 25; // For Small Select

// Set An Object To Store Colorable Materials
const colorableMaterials = {};

// Set of material names that can't be color changed
const nonColorableMaterials = new Set([
    "zFdeDaGNRwzccye",
    "ujsvqBWRMnqdwPx",
    "hUlRcbieVuIiOXG",
    "jlzuBkUzuJqgiAK",
    "xNrofRCqOXXHVZt"
]);

const colorBullets = Array.from(document.querySelectorAll(".color__bullet"));
const sizeEls = Array.from(document.querySelectorAll(".size"));

if (selectedSize) { sizeEls.find(el => el.getAttribute("data-value") === selectedSize).classList.add("active") };

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/'); // Path to decoder files
loader.setDRACOLoader(dracoLoader);

loader.load(
    "/models/phone.glb",
    (gltf) => {

        // Hide Loader
        loaderEL.classList.remove("show");

        let scaleValue;
        if (selectedSize === "small") {
            scaleValue = isInMobile ? xsScale : smScale;
        } else {
            scaleValue = isInMobile ? lgScale : xlScale;
        }
        phoneModel = gltf.scene;
        phoneModel.scale.setScalar(scaleValue);
        scene.add(phoneModel);

        // Traverse Throw The 3D Phone
        phoneModel.traverse((child) => {

            if (child.isMesh) {

                if (child.material.name === "pIJKfZsazmcpEiU") {
                    child.material = new THREE.MeshStandardMaterial({
                        roughness: 1,
                        map: screenMap,
                        name: "pIJKfZsazmcpEiU"
                    });
                }

                if (!nonColorableMaterials.has(child.material.name)) {
                    colorableMaterials[child.material.name] = child.material;
                }

            };

        });

        // Trigger A Click Event On The Yellow Bullet To Update All The UI
        const yellowBullet = document.querySelector(".color__bullet[data-theme='yellow']");
        if (yellowBullet) yellowBullet.click();

    },
    (xhr) => {
        
        // Show Loader
        loaderEL.classList.add("show");

        let percent = (xhr.loaded / xhr.total) * 100;

        // Update UI
        progressCount.textContent = `${Math.round(percent)}%`;
        progressFill.style.width = `${Math.round(percent)}%`; 

    },
    (error) => console.error(error)
);

// Animation Loop
const loop = () => {
  
    window.requestAnimationFrame(loop);
    
    if (phoneModel) {

        // Handle Responsivness And Size Changing
        if (selectedSize === "small") {
            isInMobile 
            ? phoneModel.scale.setScalar(xsScale)
            : phoneModel.scale.setScalar(smScale)
        } else {
            isInMobile 
            ? phoneModel.scale.setScalar(lgScale)
            : phoneModel.scale.setScalar(xlScale)
        };

    };

    controls.update();

    renderer.render(scene, camera);

};

loop();

// Color Changing
if (colorBullets) {
    colorBullets.forEach((colorBullet) => {
        colorBullet.addEventListener("click", (event) => {

            // Check If The User Choose The Chosen Color
            if (screenTexture !== event.currentTarget.querySelector("img").getAttribute("src")) {

                // Get The Object That Match The Clicked Color
                const colorObj = colors[Number(event.currentTarget.getAttribute("data-id")) - 1];

                // Update Text Info
                phoneInfo.textContent = colorObj.title;

                // Update The "screenTexture"
                screenTexture = colorObj.img;

                // Get The Selected Theme
                const selectedTheme = event.currentTarget.getAttribute("data-theme");

                if (phoneModel) {

                    // Update The Texture On The Model Immediately
                    const newScreenMap = new TextureLoader().load(screenTexture);
                    phoneModel.traverse((child) => {
                        if (child.isMesh && child.material.name === "pIJKfZsazmcpEiU") {
                        
                            // Create Overlay Mesh For Crossfade
                            const overlayMaterial = new THREE.MeshStandardMaterial({
                                map: newScreenMap,
                                transparent: true,
                                opacity: 0,
                                roughness: 1
                            });
                            const overlayMesh = new THREE.Mesh(child.geometry, overlayMaterial);
                            overlayMesh.position.copy(child.position);
                            overlayMesh.rotation.copy(child.rotation);
                            overlayMesh.scale.copy(child.scale);
                            phoneModel.add(overlayMesh);

                            // Animate Opacity
                            gsap.to(overlayMaterial, {
                                opacity: 1,
                                duration: 0.7,
                                onComplete: () => {
                                    // After Fade, Set Main Mesh To New Texture and Remove Overlay
                                    child.material.map = newScreenMap;
                                    child.material.needsUpdate = true;
                                    phoneModel.remove(overlayMesh);
                                    overlayMaterial.dispose();
                                }
                            });

                        }
                    });
                    
                    // Change The Phone Color
                    applyPhoneTheme(selectedTheme);

                };

                // Mark Selected Size Element As Active
                colorBullets.forEach(el => el.classList.remove("active"));
                event.currentTarget.classList.add("active");
            
            } else {
                console.wran("You click the same color !");
            }

        });
    });
};

// Size Selection
if (sizeEls) {
    sizeEls.forEach((sizeEl) => {
        sizeEl.addEventListener("click", (event) => {

            // Check If The User Select The Selected Size 
            if (selectedSize === event.currentTarget.getAttribute("data-value")) {
                console.warn("You click the same size");
            } else {

                // Mark Selected Size Element As Active
                sizeEls.forEach(el => el.classList.remove("active"));
                event.currentTarget.classList.add("active");

                // Update The Selected Size
                selectedSize = event.currentTarget.getAttribute("data-value");

            };

        });
    });
};

// Phone Theme Applying
function applyPhoneTheme(selectedTheme) {

    const themeObject = themes[selectedTheme];

    if (!themeObject) return;

    Object.entries(themeObject).forEach(([matName, matColor]) => {
        const mat = colorableMaterials[matName];
        if (mat) {
            mat.color.set(matColor);
            mat.needsUpdate = true;
        } 
    });

};