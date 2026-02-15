document.addEventListener("DOMContentLoaded", function () {
    // Polyfill
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.moveTo(x + r, y);
            this.arcTo(x + w, y, x + w, y + h, r);
            this.arcTo(x + w, y + h, x, y + h, r);
            this.arcTo(x, y + h, x, y, r);
            this.arcTo(x, y, x + w, y, r);
            this.closePath();
            return this;
        };
    }

    // --- CONSTANTS & STATE ---
    const initUrlParams = new URLSearchParams(window.location.search);
    const initSection = initUrlParams.get('section');

    let globalScroll = 0; // The master scroll value (0 -> infinity)
    let targetGlobalScroll = 0;
    let modelViewer = document.querySelector('model-viewer');
    let isHome = true; // Flag to help logic, basically scroll < 1.0
    let introAlpha = 0; // Global intro alpha to prevent flicker
    let worksLocked = false;
    let slideThrottle = false;
    let isContactOpen = false; // State for slide-in contact section
    let contactFromWork = false; // Whether contact was opened from Work section
    window.isTransitioningToWorks = false;
    window.isTransitioningToAbout = false;
    window.isDirectHomeWork = false;
    window.directProgress = 0;
    let targetDirectProgress = 0;


    // --- 3D MODEL TEXTURE LOGIC ---
    let modelCanvas, modelCtx, modelTexture;
    // Initialize Texture when model loads
    modelViewer.addEventListener("load", async () => {
        const material = modelViewer.model.materials[0];
        modelCanvas = document.createElement("canvas");
        modelCanvas.width = 1024;
        modelCanvas.height = 1024;
        modelCtx = modelCanvas.getContext("2d", { willReadFrequently: true });

        // Background: White
        modelCtx.fillStyle = "#ffffff";
        modelCtx.fillRect(0, 0, modelCanvas.width, modelCanvas.height);

        // Initial Pattern - High density for a "pre-painted" blue look
        const initialTriangles = (window.innerWidth < 768) ? 400 : 150;
        addRandomTriangles(initialTriangles, 1.5);

        // Apply Initial Texture
        modelTexture = await modelViewer.createTexture(modelCanvas.toDataURL());
        material.pbrMetallicRoughness.baseColorTexture.setTexture(modelTexture);
        material.pbrMetallicRoughness.setRoughnessFactor(0.3);
        material.pbrMetallicRoughness.setMetallicFactor(0.1);

        // Initial Animation: Suave Fade In (No rotation)
        const duration = 10000;
        const initialDelay = 2000;
        const startTime = performance.now();
        modelViewer.orientation = `0deg 0deg 0deg`;

        function animateModel(time) {
            const elapsed = time - startTime;

            // Wait for initialDelay before starting fade
            if (elapsed < initialDelay && !initSection) {
                introAlpha = 0;
            } else if (initSection) {
                introAlpha = 1;
            } else {
                introAlpha = Math.min((elapsed - initialDelay) / duration, 1);
            }

            if (introAlpha < 1) {
                requestAnimationFrame(animateModel);
            }
        }
        requestAnimationFrame(animateModel);


        // Check if mouse/touch is over the actual model geometry
        const checkModelHit = (clientX, clientY) => {
            const hit = modelViewer.positionAndNormalFromPoint(clientX, clientY);
            return hit !== null;
        };

        // Intercept mousedown events before they reach camera-controls
        modelViewer.addEventListener('mousedown', (event) => {
            if (!checkModelHit(event.clientX, event.clientY)) {
                // Block event from reaching camera-controls
                event.stopImmediatePropagation();
                event.preventDefault();
            }
            // If hit is valid, let event propagate normally
        }, { capture: true });

        modelViewer.addEventListener('touchstart', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                if (!checkModelHit(touch.clientX, touch.clientY)) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                }
            }
        }, { capture: true });
    });

    // Interactive Painting
    let lastTextureUpdate = 0;
    modelViewer.addEventListener('mousemove', (event) => {
        if (globalScroll > 0.1) return;
        const now = Date.now();
        if (now - lastTextureUpdate < 100) return;

        const hit = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);
        if (hit) {
            lastTextureUpdate = now;
            addRandomTriangles(10);
            requestAnimationFrame(async () => {
                const newTexture = await modelViewer.createTexture(modelCanvas.toDataURL());
                if (modelViewer.model && modelViewer.model.materials[0]) {
                    modelViewer.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(newTexture);
                }
            });
        }
    });

    function addRandomTriangles(count, sizeMultiplier = 1) {
        if (!modelCtx) return;
        for (let i = 0; i < count; i++) {
            modelCtx.beginPath();
            const x = Math.random() * modelCanvas.width;
            const y = Math.random() * modelCanvas.height;
            const size = (Math.random() * 150 + 20) * sizeMultiplier;

            modelCtx.moveTo(x, y);
            modelCtx.lineTo(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size);
            modelCtx.lineTo(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size);
            modelCtx.closePath();

            const blue = 255;
            const randomColor = `rgba(0, 0, ${blue}, ${Math.random() * 0.5 + 0.5})`;
            modelCtx.fillStyle = randomColor;
            modelCtx.fill();
        }
    }

    // Browser Detection (for Safari-specific optimizations)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Keyboard & About Data
    let cvBtn = document.getElementById('cv-button');
    let aboutContainer = document.querySelector('.about-description-desktop');
    let aboutContainerMobile = document.querySelector('.about-description-mobile');
    let paragraphs = Array.from(document.querySelectorAll('.about-description-desktop .paragraph-container'));

    // Canvas Contexts
    const particleCanvas = document.getElementById('particleCanvas');
    const particleCtx = particleCanvas.getContext('2d');
    const keyboardCanvas = document.getElementById('keyboardCanvas');
    const keyboardCtx = keyboardCanvas.getContext('2d', { alpha: true });
    const homeArrow = document.getElementById('home-scroll-arrow');

    if (homeArrow) {
        homeArrow.addEventListener('click', () => {
            window.isTransitioningToAbout = true;
            targetGlobalScroll = 3.0;
        });
    }

    let dpr = window.devicePixelRatio || 1;

    // Special Frame Canvas for Sharp Masking (like about.html)
    const frameCanvas = document.createElement('canvas');
    const frameCtx = frameCanvas.getContext('2d');
    let isFrameReady = false;

    let mouseX = -1, mouseY = -1;
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    let keyStates = {}; // For rotation animations

    // Keyboard Data
    const keyLayout = [
        ['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'power'], // Row 0
        ['<', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', "'", '+', 'delete'],               // Row 1
        ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '`', '=', 'ç'],                   // Row 2
        ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ']', 'return'],                  // Row 3
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', 'shift'],                        // Row 4
        ['fn', 'ctrl', 'opt', 'cmd', 'space', 'cmd', 'opt', 'up/down']                              // Row 5
    ];
    const skipKeys = new Set(['3', '4', '5', '6', '7', '8', '9', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'c', 'v', 'b', 'n', 'm', ',', '.']);

    // Media Map (from about.html)
    const mediaMap = {
        'f1': 'fotos/500x500 (normales)/F1.mp4', 'f2': 'fotos/500x500 (normales)/F2.png', 'f3': 'fotos/500x500 (normales)/F3.mp4',
        'f4': 'fotos/500x500 (normales)/F4.mp4', 'f5': 'fotos/500x500 (normales)/F5.png', 'f6': 'fotos/500x500 (normales)/F6.mp4',
        'f7': 'fotos/500x500 (normales)/F7.png', 'f8': 'fotos/500x500 (normales)/F8.png', 'f9': 'fotos/500x500 (normales)/F9.png',
        'f10': 'fotos/500x500 (normales)/F10.png', 'f11': 'fotos/500x500 (normales)/F11.mp4', 'f12': 'fotos/500x500 (normales)/F12.png',
        'power': 'fotos/500x500 (normales)/power.png', '<': 'fotos/500x500 (normales)/<.png', '1': 'fotos/500x500 (normales)/1.png',
        '2': 'fotos/500x500 (normales)/2.png', '0': 'fotos/500x500 (normales)/0.png', "'": 'fotos/500x500 (normales)/\'.mp4',
        '+': 'fotos/500x500 (normales)/¡.mp4', 'delete': 'fotos/860x500 (tab, esc, delete)/delete.png', 'tab': 'fotos/860x500 (tab, esc, delete)/tab.png',
        'q': 'fotos/500x500 (normales)/q.png', 'w': 'fotos/500x500 (normales)/w.png', 'p': 'fotos/500x500 (normales)/p.png',
        '`': 'fotos/500x500 (normales)/option right.png', '=': 'fotos/500x500 (normales)/+.png', 'ç': 'fotos/500x500 (normales)/ç.png',
        'esc': 'fotos/860x500 (tab, esc, delete)/esc.png', 'a': 'fotos/500x500 (normales)/a.png', 's': 'fotos/500x500 (normales)/s.png',
        ';': 'fotos/500x500 (normales)/ñ.mp4', ']': 'fotos/500x500 (normales)/´.mp4', 'return': 'fotos/1075x500 (capslock, return)/return.mp4',
        'caps': 'fotos/1075x500 (capslock, return)/caps lock.mp4', 'z': 'fotos/500x500 (normales)/z.mp4', 'x': 'fotos/500x500 (normales)/x.png',
        '-': 'fotos/500x500 (normales)/-.png', 'shift': 'fotos/1075x500 (capslock, return)/shift left.png',
        'shift-right': 'fotos/1075x500 (capslock, return)/shift right.mp4', 'fn': 'fotos/500x500 (normales)/fn.png',
        'ctrl': 'fotos/500x500 (normales)/ctrl.mp4', 'opt': 'fotos/500x500 (normales)/option left.mp4',
        'opt-right': 'fotos/500x500 (normales)/option right.png', 'cmd': 'fotos/500x500 (normales)/command left.png',
        'cmd-right': 'fotos/500x500 (normales)/command right.png', 'space': 'fotos/4318x500 (espacio)/espacio.mp4',
        'arrow-up': 'fotos/1600x500 (flechas)/flecha up.mp4',
        'arrow-down': 'fotos/1600x500 (flechas)/flecha down.mp4',
        'arrow-left': 'fotos/1600x500 (flechas)/flecha left.mp4',
        'arrow-right': 'fotos/1600x500 (flechas)/flecha right.mp4'
    };

    const mediaCache = {};
    const mediaOpacities = {};

    function initMediaStructs() {
        Object.keys(mediaMap).forEach(key => {
            mediaOpacities[key] = { val: 0, loaded: false };
        });
    }
    initMediaStructs();

    const rowsLoaded = new Array(7).fill(false); // Updated for 7 rows in mobile


    function loadRowMedia(rowIndex) {
        if (rowsLoaded[rowIndex]) return;
        rowsLoaded[rowIndex] = true;

        // Find all media keys for this row
        const keysInRow = keyDataCache.filter(k => k.rowIndex === rowIndex && k.mKey);

        keysInRow.forEach(k => {
            const key = k.mKey;
            const op = mediaOpacities[key];
            if (!op || op.loaded) return; // Already loaded or struct missing

            const path = mediaMap[key];
            if (!path) return;

            if (path.endsWith('.mp4')) {
                const video = document.createElement('video');
                video.src = path; video.muted = true; video.loop = true; video.playsInline = true; video.autoplay = true;
                video.oncanplay = () => { mediaCache[key] = video; op.loaded = true; video.play().catch(() => { }); };
            } else {
                const img = new Image();
                img.onload = () => { mediaCache[key] = img; op.loaded = true; };
                img.src = path;
            }
        });
    }

    // Row Stagger Map: Which globalScroll value triggers the arrival of each row
    // T=1.0: Transition start
    const rowArrivals = [0.8, 1.0, 1.3, 1.6, 1.9, 2.2, 2.5]; // Row 0 to 6 (mobile has 7 rows now)

    let keyDataCache = [];
    let checkpointLocked = false; // Lock for sticky scroll checkpoint
    let unlockTimer = null; // Timer for debounce unlock

    // --- SCROLL HANDLING ---
    // --- SCROLL HANDLING ---
    window.addEventListener('wheel', (e) => {
        const maxScroll = paragraphs.length + 3.0 + 3.5;

        // --- MOBILE HOME BLOCK ---
        if (window.innerWidth < 768 && targetGlobalScroll < 2.0 && e.deltaY > 0) {
            return;
        }

        // --- WORKS LOCK LOGIC ---
        // If we reach the very end, we lock the master scroll to stay in Works
        if (targetGlobalScroll >= maxScroll - 0.1) {
            worksLocked = true;
        }

        if (worksLocked) {
            targetGlobalScroll = maxScroll;

            // INTERNAL SCROLL: If For You is active, scroll wheel changes slides
            const forYouSection = document.querySelector('.foryou-section');
            if (forYouSection && forYouSection.style.display !== 'none' && !slideThrottle) {
                if (Math.abs(e.deltaY) > 30) {
                    slideThrottle = true;
                    if (e.deltaY > 0) document.getElementById('next-slide')?.click();
                    else document.getElementById('prev-slide')?.click();
                    setTimeout(() => { slideThrottle = false; }, 500);
                }
            }
            // If Catalogue is active, we don't return, allowing default scroll on .mix-container
            return;
        }

        // If locked, consume event and refresh debounce
        if (checkpointLocked) {
            targetGlobalScroll = 3.0;

            // Unlock quicker on reversal or stop
            // 1. Reversal Check
            if ((e.deltaY > 0 && targetGlobalScroll < 3.0) || (e.deltaY < 0 && targetGlobalScroll > 3.0)) {
                // Logic to verify direction change is tricky since we force target to 3.0
                // But we can check e.deltaY sign against where we came from? 
                // Simpler: Just reduce timeout to 40ms for very snappy resume
            }

            // Debounce unlock: Wait for silence (shortened to 40ms for responsiveness)
            clearTimeout(unlockTimer);
            unlockTimer = setTimeout(() => {
                checkpointLocked = false;
            }, 40);

            return;
        }

        // Slow down sensitivity specifically for the Works transition
        let sensitivity = targetGlobalScroll >= 3.0 ? 0.007 : 0.003;
        if (targetGlobalScroll >= 8.0) sensitivity = 0.002;

        const oldTarget = targetGlobalScroll;
        targetGlobalScroll += e.deltaY * sensitivity;

        // --- LIMIT SPEED/ACCUMULATION ---
        // Prevent target from getting too far ahead downward
        if (targetGlobalScroll > globalScroll + 4.0) targetGlobalScroll = globalScroll + 4.0;

        // --- STICKY CHECKPOINT AT 3.0 ---
        // If crossing 3.0 from either direction
        if ((oldTarget < 3.0 && targetGlobalScroll > 3.0) ||
            (oldTarget > 3.0 && targetGlobalScroll < 3.0)) {

            targetGlobalScroll = 3.0;
            checkpointLocked = true;

            // Start debounce timer (shortened)
            clearTimeout(unlockTimer);
            unlockTimer = setTimeout(() => {
                checkpointLocked = false;
            }, 40);
        }

        if (targetGlobalScroll < 0) targetGlobalScroll = 0;
        if (targetGlobalScroll > maxScroll) targetGlobalScroll = maxScroll;
    }, { passive: true });

    // Mobile Touch
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => touchStartY = e.touches[0].clientY, { passive: true });
    window.addEventListener('touchmove', (e) => {
        const maxScroll = paragraphs.length + 3.0 + 3.5;

        // --- MOBILE HOME BLOCK ---
        if (window.innerWidth < 768 && targetGlobalScroll < 2.0) {
            const currentY = e.touches[0].clientY;
            const delta = touchStartY - currentY;
            if (delta > 0) {
                if (e.cancelable) e.preventDefault();
                return;
            }
        }

        if (targetGlobalScroll >= maxScroll - 0.1) {
            worksLocked = true;
        }

        if (worksLocked) {
            targetGlobalScroll = maxScroll;
            // Note: Swipe on slider is handled by Webflow's default touch-action/swipe logic
            return;
        }

        // If locked, force to 3.0 and refresh debounce
        if (checkpointLocked) {
            targetGlobalScroll = 3.0;
            touchStartY = e.touches[0].clientY; // Update start to prevent jump

            clearTimeout(unlockTimer);
            unlockTimer = setTimeout(() => {
                checkpointLocked = false;
            }, 40);

            return;
        }

        const touchEndY = e.touches[0].clientY;
        const delta = touchStartY - touchEndY;
        touchStartY = touchEndY;

        let sensitivity = targetGlobalScroll >= 3.0 ? 0.014 : 0.008;
        if (targetGlobalScroll >= 8.0) sensitivity = 0.005;

        const oldTarget = targetGlobalScroll;
        targetGlobalScroll += delta * sensitivity;

        // --- LIMIT SPEED/ACCUMULATION ---
        if (targetGlobalScroll > globalScroll + 3.0) targetGlobalScroll = globalScroll + 3.0;

        // --- STICKY CHECKPOINT AT 3.0 ---
        if ((oldTarget < 3.0 && targetGlobalScroll > 3.0) ||
            (oldTarget > 3.0 && targetGlobalScroll < 3.0)) {

            targetGlobalScroll = 3.0;
            checkpointLocked = true;


            clearTimeout(unlockTimer);
            unlockTimer = setTimeout(() => {
                checkpointLocked = false;
            }, 40);
        }

        if (targetGlobalScroll < 0) targetGlobalScroll = 0;
        if (targetGlobalScroll > maxScroll) targetGlobalScroll = maxScroll;
    }, { passive: false });


    // --- PARTICLES & HOME LOGIC ---
    let particlesArray = [];
    let topoTime = 0;

    function drawTopoLines() {
        // Draw topological lines behind particles (Home background)
        const isMobile = window.innerWidth < 768;
        const numRings = isMobile ? 6 : 12;
        particleCtx.save();
        particleCtx.lineWidth = 1.5;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < numRings; i++) {
            particleCtx.beginPath();
            particleCtx.strokeStyle = `rgba(0, 80, 255, ${0.05 + (i * 0.015)})`;

            const baseRadius = (window.innerHeight / 6) * (i + 1);
            const driftX = Math.sin(topoTime * 0.5 + i) * 40;
            const driftY = Math.cos(topoTime * 0.3 + i * 1.5) * 30;

            const angleStep = isMobile ? 0.3 : 0.1;
            for (let angle = 0; angle <= Math.PI * 2; angle += angleStep) {
                const distortion1 = Math.sin(angle * 3 + topoTime + i) * 20;
                const distortion2 = Math.cos(angle * 5 - topoTime * 0.8) * 15;
                const distortion3 = Math.sin(angle * 2 + topoTime * 0.4 + i * 2) * 30;
                const r = baseRadius + distortion1 + distortion2 + distortion3;
                const x = (centerX + driftX) + Math.cos(angle) * r;
                const y = (centerY + driftY) + Math.sin(angle) * r;
                if (angle === 0) particleCtx.moveTo(x, y);
                else particleCtx.lineTo(x, y);
            }
            particleCtx.closePath();
            particleCtx.stroke();
        }
        particleCtx.restore();
    }

    class Particle {
        constructor(x, y, depth, isFront) {
            this.initialX = x;
            this.initialY = y;
            this.depth = depth;
            this.isFront = isFront;

            // Random spawn for smooth intro
            this.spawnX = Math.random() * window.innerWidth;
            this.spawnY = Math.random() * window.innerHeight;
            this.x = this.spawnX;
            this.y = this.spawnY;

            this.baseSize = isFront ? 1.4 : Math.max(0.3, 1.4 - (depth * 0.08));
            this.size = this.baseSize;

            const whiteProgress = isFront ? 0 : Math.min(1, (depth / 4));
            const r = Math.floor(255 * whiteProgress);
            const g = Math.floor(255 * whiteProgress);
            this.colorBase = `rgba(${r}, ${g}, 255, `;

            let baseAlpha = (depth < 8) ? 0.7 - (depth * 0.04) : 0.38 - ((depth - 8) * 0.06);
            this.targetAlpha = isFront ? 0.9 : Math.max(0.02, baseAlpha);
            this.currentAlpha = 0;

            this.vx = 0;
            this.vy = 0;
            this.friction = 0.92;
            this.spring = 0.04;
            this.introProgress = 0;
        }

        update(progress, mX, mY, isContact, cs) {
            const p = Math.min(1, Math.max(0, progress));
            const exitEase = p * p;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            // Target position (Home or Exit Center)
            let scrollTargetX = this.initialX + (cx - this.initialX) * exitEase;
            const scrollTargetY = this.initialY + (cy - this.initialY) * exitEase;

            // Floating drift (Prevents them from being "still")
            const time = Date.now() * 0.001;
            const driftX = Math.sin(time + this.depth) * 0.8;
            const driftY = Math.cos(time * 0.7 + this.depth) * 0.8;

            // Handle Contact or Direct Home-Work transition (Dispersion and Fade)
            const isDirect = window.isDirectHomeWork;
            const p_cs = (cs / 100);
            const p_dir = isDirect ? window.directProgress : 0;

            // Visibility Guard: ONLY show particles if we are Home or jumping to/from Work.
            const isHomeCentric = (progress < 1.1 || isDirect) && !contactFromWork;
            const p_trans = Math.max(p_cs, p_dir);

            if ((cs > 0.1 || isDirect) && isHomeCentric) {
                this.introProgress = 1;

                const stableTargetX = this.initialX;
                const stableTargetY = this.initialY;

                // Use physics (disperse) only when opening contact or leaving home
                // Use mapping (assemble) when closing contact or arriving home
                // Leaving Home (to Contact or Work) -> DISPERSE
                // Arriving at Home (from Contact or Work) -> ASSEMBLE
                const isGoingOut = isContact || (isDirect && targetDirectProgress === 1);

                if (isGoingOut) {
                    // --- OUT: DISPERSE (Used for both Contact and Work) ---
                    const pushMultiplier = p_trans * 2.0 + 0.1;
                    this.vx -= (0.5 + Math.random() * 1.5) * pushMultiplier;
                    this.vy += (Math.random() - 0.5) * 2.0 * pushMultiplier;
                    this.vx *= 0.92;
                    this.vy *= 0.92;
                    this.x += this.vx;
                    this.y += this.vy;
                    // Minor slide left to match UI direction
                    if (p_trans > 0.01) this.x -= (p_trans * 5);
                } else {
                    // --- IN: DIRECT ASSEMBLY (Coming back to Home) ---
                    const slideOffset = -p_trans * 200;
                    this.x = stableTargetX + slideOffset + driftX;
                    this.y = stableTargetY + driftY;
                    this.vx = 0;
                    this.vy = 0;
                }

                // Transition alpha should only depend on p_trans here.
                // Using 1.5 multiplier to match the fast fade-out feel of the Contact section.
                const fade = Math.max(0, 1 - p_trans * 1.5);
                this.currentAlpha = this.targetAlpha * fade;
                this.size = this.baseSize * Math.max(0.5, fade);
                return;
            }

            if (!isHomeCentric) {
                this.currentAlpha = 0;
                this.size = 0;
                return;
            }

            // Update intro progress (always increment until 1)
            if (this.introProgress < 1) {
                const introSpeed = (window.innerWidth < 768) ? 0.008 : 0.004;
                this.introProgress += introSpeed;
            }
            const t = this.introProgress;
            const introEase = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            // COMBINED ALPHA: Intro Fade-in * Exit Fade-out
            const introAlpha = Math.min(1, t * 2);
            const exitAlpha = 1 - exitEase;
            this.currentAlpha = this.targetAlpha * introAlpha * exitAlpha;
            this.size = this.baseSize * exitAlpha;

            // POSITION CALCULATION
            const lerpX = this.spawnX + (scrollTargetX - this.spawnX) * introEase;
            const lerpY = this.spawnY + (scrollTargetY - this.spawnY) * introEase;

            if (p > 0.01) {
                // TRANSITION PHASE: Direct placement (No bounce, kills inertia)
                this.x = lerpX + driftX * exitAlpha;
                this.y = lerpY + driftY * exitAlpha;
                this.vx = 0;
                this.vy = 0;
            } else {
                // MOUSE INTERACTION (Always active when not transitioning)
                if (mX !== -1) {
                    const dx = mX - this.x;
                    const dy = mY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = 50;
                    if (dist < force) {
                        const angle = Math.atan2(dy, dx);
                        const push = (force - dist) * 0.12;
                        this.vx -= Math.cos(angle) * push;
                        this.vy -= Math.sin(angle) * push;
                    }
                }

                // Spring return + Drift towards moving target (lerpX/lerpY handles intro fly-in)
                const dxBase = lerpX - this.x + driftX;
                const dyBase = lerpY - this.y + driftY;
                this.vx += dxBase * 0.08;
                this.vy += dyBase * 0.08;
                this.vx *= 0.82;
                this.vy *= 0.82;

                this.x += this.vx;
                this.y += this.vy;

                // Opacity fix for idle
                if (t >= 1) {
                    this.currentAlpha = this.targetAlpha;
                    this.size = this.baseSize;
                }
            }
        }

        draw(ctx) {
            if (this.currentAlpha <= 0) return;
            ctx.fillStyle = this.colorBase + this.currentAlpha + ')';
            ctx.fillRect(this.x, this.y, this.size, this.size * 2);
        }
    }

    function initParticles() {
        // Ensure font is ready before measuring text
        document.fonts.load('10px "Climate Crisis"').then(() => {
            _generateParticles();
        }).catch(() => {
            // Fallback if load fails or not supported
            _generateParticles();
        });
    }

    function _generateParticles() {
        particlesArray = [];
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Create temp canvas
        const tCanvas = document.createElement('canvas');
        tCanvas.width = w; tCanvas.height = h;
        const tCtx = tCanvas.getContext('2d');

        if (w < 768) {
            let fontSize = w / 4.0;
            tCtx.font = fontSize + 'px "Climate Crisis"';
            tCtx.textAlign = 'center';
            tCtx.textBaseline = 'middle';
            const lineHeight = fontSize * 0.95;
            tCtx.fillStyle = 'blue';

            // Draw 6 times "ADRI" vertically centered
            const totalLines = 6;
            const startY = h / 2 - (lineHeight * (totalLines - 1)) / 2;
            for (let i = 0; i < totalLines; i++) {
                tCtx.fillText('ADRI', w / 2, startY + i * lineHeight);
            }
        } else {
            let fontSize = Math.min(w / 5.5, h / 3.5);
            tCtx.font = fontSize + 'px "Climate Crisis"';
            tCtx.textAlign = 'center';
            tCtx.textBaseline = 'middle';
            const lineHeight = fontSize * 0.8;
            tCtx.fillStyle = 'blue';
            tCtx.fillText('ADRI', w / 2, h / 2 - lineHeight * 0.5);
            tCtx.fillText('VELASCO', w / 2, h / 2 + lineHeight * 0.5);
        }

        const data = tCtx.getImageData(0, 0, w, h).data;
        const vpX = w / 2;
        const vpY = h / 10;

        const isMobile = w < 768;
        const maxLayers = isMobile ? 12 : 20;

        for (let d = 0; d < maxLayers; d++) { // Layers
            let step;
            if (isMobile) {
                step = (d === 0) ? 5 : (d < 5 ? 14 : 28);
            } else {
                step = (d === 0) ? 4 : (d < 6 ? 12 : (d < 11 ? 22 : 30));
            }
            for (let y = 0; y < h; y += step) {
                for (let x = 0; x < w; x += step) {
                    if (data[(y * 4 * w) + (x * 4) + 3] > 128) {
                        const vecX = vpX - x;
                        const vecY = vpY - y;
                        const factor = d * 0.25;
                        particlesArray.push(new Particle(x + vecX * factor, y + vecY * factor, d, d === 0));
                    }
                }
            }
        }
    }

    // --- KEYBOARD SETUP ---
    function setupKeyboardLayout() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isMobile = w < 768;

        const currentLayout = isMobile ? [
            ['f1', 'f2', 'f3', 'f4', 'f5', 'f12'],      // Top row - continuous ceiling
            ['esc', 'power'],
            ['1', 'delete'],
            ['tab', 'p'],
            ['caps', 'return'],
            ['shift', 'shift'],
            ['fn', 'ctrl', 'opt', 'cmd', 'space', 'up/down']  // Bottom row - continuous floor
        ] : keyLayout;

        const gap = isMobile ? 12 : 8;
        const maxKeysWidth = isMobile ? 2 : 15;
        const keyboardWidth = w * 0.98;

        let keyWidth, keyHeight;
        if (isMobile) {
            keyWidth = 55;
            keyHeight = 55;
        } else {
            const baseKeySize = (keyboardWidth - (maxKeysWidth * gap)) / maxKeysWidth;
            keyWidth = baseKeySize * 0.94;
            keyHeight = keyWidth;
        }

        const keyboardHeight = (currentLayout.length * keyHeight) + ((currentLayout.length - 1) * gap);
        const startY = isMobile ? (h - keyboardHeight) / 2 + 40 : 100 + ((h - 100 - keyboardHeight) / 2); // Center vertically on mobile with slight offset down


        function getWidth(key) {
            if (isMobile) return keyWidth; // All square on mobile

            if (key === 'delete' || key === 'tab' || key === 'esc') return keyWidth * 1.5;
            if (key === 'caps' || key === 'return') return keyWidth * 1.8;
            if (key === 'shift') return keyWidth * 2.3;
            if (key === 'space') return keyWidth * 7;
            if (key === 'fn' || key === 'ctrl') return keyWidth * 0.9;
            if (key === 'up/down') return keyWidth * 3.2;
            return keyWidth;
        }

        const rowWidths = currentLayout.map(row => {
            let tw = 0;
            row.forEach(k => tw += getWidth(k) + gap);
            return tw - gap;
        });

        const maxRowW = Math.max(...rowWidths);
        const startX = (w - maxRowW) / 2;

        keyDataCache = [];
        rowGapsData = [];

        currentLayout.forEach((row, rowIndex) => {
            let xOffset = startX;
            const rowW = rowWidths[rowIndex];
            const extraGap = row.length > 1 ? (maxRowW - rowW) / (row.length - 1) : 0;

            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            let hasSkips = false;

            row.forEach((key, keyInRow) => {
                const wKey = getWidth(key);
                const yKey = startY + (rowIndex * (keyHeight + gap));


                let kX;
                if (isMobile) {
                    const sideMargin = 10;
                    // Special handling for row 0 (top) and row 6 (bottom) - distribute horizontally
                    if (rowIndex === 0 || rowIndex === 6) {
                        const totalWidth = w - (2 * sideMargin);
                        const totalGap = (row.length - 1) * gap;
                        const availableWidth = totalWidth - totalGap;
                        const keySpacing = availableWidth / row.length;
                        kX = sideMargin + (keyInRow * (keySpacing + gap));
                    } else {
                        // Other rows: only left and right columns
                        if (keyInRow === 0) kX = sideMargin;
                        else kX = w - sideMargin - keyWidth;
                    }
                } else {
                    kX = xOffset;
                }

                const isSkip = !isMobile && skipKeys.has(key.toLowerCase());
                const mKey = (key === 'shift' && keyInRow > 0) ? 'shift-right' :
                    (key === 'cmd' && keyInRow > 4) ? 'cmd-right' :
                        (key === 'opt' && keyInRow > 4) ? 'opt-right' : key;

                const isVideo = mediaMap[mKey] && mediaMap[mKey].endsWith('.mp4');
                const kW = wKey - (isMobile ? 0 : gap); // No double gap on mobile
                const kH = keyHeight - (isMobile ? 0 : gap);

                // Critical: Match ID format for state persistence
                const id = `${rowIndex}-${keyInRow}`;
                const staggerDelay = Math.random() * 0.2;

                if (key === 'up/down') {
                    // Split into arrows
                    const totalW = kW;
                    const totalH = kH;
                    const iGap = 2;
                    const blockX = kX;
                    const blockY = yKey;

                    if (!isMobile) {
                        // Desktop: 4 arrows in inverted T
                        const arrowW = (totalW - 2 * iGap) / 3;
                        const arrowH = (totalH - iGap) / 2;
                        const desktopArrows = [
                            { k: 'LEFT', x: blockX, y: blockY + arrowH + iGap, w: arrowW, h: arrowH },
                            { k: 'DOWN', x: blockX + arrowW + iGap, y: blockY + arrowH + iGap, w: arrowW, h: arrowH },
                            { k: 'RIGHT', x: blockX + 2 * (arrowW + iGap), y: blockY + arrowH + iGap, w: arrowW, h: arrowH },
                            { k: 'UP', x: blockX + arrowW + iGap, y: blockY, w: arrowW, h: arrowH }
                        ];
                        desktopArrows.forEach((arr, idx) => {
                            const subId = `${id}-arrow-${idx}`;
                            const mKey = `arrow-${arr.k.toLowerCase()}`;
                            keyDataCache.push({
                                key: '', x: arr.x, y: arr.y, w: arr.w, h: arr.h,
                                rowIndex, id: subId, mKey, isVideo: true, isSkip: false, staggerDelay
                            });
                            if (!keyStates[subId]) keyStates[subId] = { currentRot: 0, targetRot: 0, lastHover: false };
                        });
                    } else {
                        // Mobile: 3 arrows
                        const arrowW = (totalW - iGap) / 2;
                        const arrowH = (totalH - iGap) / 2;
                        const mobileArrows = [
                            { k: 'LEFT', x: blockX, y: blockY + arrowH + iGap, w: arrowW, h: arrowH },
                            { k: 'RIGHT', x: blockX + arrowW + iGap, y: blockY + arrowH + iGap, w: arrowW, h: arrowH },
                            { k: 'UP', x: blockX + arrowW / 2, y: blockY, w: arrowW, h: arrowH }
                        ];
                        mobileArrows.forEach((arr, idx) => {
                            const subId = `${id}-arrow-${idx}`;
                            const mKey = `arrow-${arr.k.toLowerCase()}`;
                            keyDataCache.push({
                                key: '', x: arr.x, y: arr.y, w: arr.w, h: arr.h,
                                rowIndex, id: subId, mKey, isVideo: true, isSkip: false, staggerDelay
                            });
                            if (!keyStates[subId]) keyStates[subId] = { currentRot: 0, targetRot: 0, lastHover: false };
                        });
                    }
                    // Set skip bounds for paragraph center
                    minX = Math.min(minX, kX); maxX = Math.max(maxX, kX + kW);
                    minY = Math.min(minY, yKey); maxY = Math.max(maxY, yKey + kH);
                    hasSkips = true;

                } else {
                    keyDataCache.push({
                        key: key.toUpperCase(), x: kX, y: yKey, w: kW, h: kH,
                        rowIndex, id, mKey, isVideo, isSkip, staggerDelay
                    });
                    if (!keyStates[id]) keyStates[id] = { currentRot: 0, targetRot: 0, lastHover: false };

                    if (isSkip || isMobile) {
                        // For mobile, every row has a gap in the center
                        if (isMobile) {
                            // On mobile, the gap is between the two side keys
                            const leftKeyEdge = 10 + keyWidth;
                            const rightKeyEdge = w - 10 - keyWidth;
                            minX = leftKeyEdge; maxX = rightKeyEdge;
                        } else {
                            minX = Math.min(minX, kX); maxX = Math.max(maxX, kX + kW);
                        }
                        minY = Math.min(minY, yKey); maxY = Math.max(maxY, yKey + kH);
                        hasSkips = true;
                    }
                }
                xOffset += wKey + gap + extraGap;
            });

            if (hasSkips) {
                let yOffset = (rowIndex === 1 || rowIndex === 2 || rowIndex === 4) ? 20 : 0;
                if (isMobile) yOffset = 0; // Keep horizontal on mobile
                rowGapsData[rowIndex] = {
                    top: ((minY + maxY) / 2) + yOffset,
                    left: ((minX + maxX) / 2),
                    width: (maxX - minX) - 20,
                    height: (maxY - minY) + 10
                };
            } else {
                rowGapsData[rowIndex] = null;
            }
        });

        // Frame rendering (like about.html)
        frameCanvas.width = w * dpr;
        frameCanvas.height = h * dpr;
        frameCtx.resetTransform();
        frameCtx.scale(dpr, dpr);
        frameCtx.clearRect(0, 0, w, h);
        frameCtx.fillStyle = 'rgba(255, 255, 255, 0.0)';
        frameCtx.fillRect(0, 0, w, h);
        frameCtx.globalCompositeOperation = 'destination-out';
        keyDataCache.forEach(meta => {
            if (meta.isSkip) return;
            frameCtx.beginPath();
            frameCtx.roundRect(meta.x, meta.y, meta.w, meta.h, 6);
            frameCtx.fill();
        });
        isFrameReady = true;

        // DYNAMIC MOBILE TEXT CONTAINER SIZING
        if (isMobile) {
            const mobileContainer = document.querySelector('.about-mobile-content');
            if (mobileContainer) {
                // Row 0 Bottom Y
                const row0Bottom = startY + keyHeight;

                // Row 6 Top Y
                const row6Top = startY + (6 * (keyHeight + gap));

                // Calculate safe zone with larger buffers
                // Start 2 gaps below row 0
                const safeTop = row0Bottom + (gap * 1.5);
                // End 1 gap above row 6
                const safeBottom = row6Top - (gap * 1.5);

                const safeHeight = safeBottom - safeTop;

                // Set precise positioning using Height instead of Bottom
                mobileContainer.style.setProperty('top', `${safeTop}px`, 'important');
                mobileContainer.style.setProperty('height', `${safeHeight}px`, 'important');
                mobileContainer.style.setProperty('bottom', 'auto', 'important'); // Reset bottom
            }
        }
    }

    let lastKeyboardScroll = -1;
    let lastKeyboardCS = -1;

    function drawKeyboard(scroll, smoothScroll, isAnimating) {
        const cs = (typeof animate.contactShift !== 'undefined') ? animate.contactShift : 0;

        // Check if any key in the cache is a video and visible. 
        // We use a simple check: if the scroll is in a range where the keyboard is visible,
        // we must redraw every frame to kept videos playing.
        const hasVideos = scroll > 1.0 && scroll < 8.5;

        if (window.isDirectHomeWork) {
            keyboardCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            if (cvBtn) {
                cvBtn.style.display = 'none';
                cvBtn.style.opacity = '0';
                cvBtn.style.pointerEvents = 'none';
            }
            return;
        }

        // Safari gets higher threshold to reduce redraws, Chrome keeps precise values
        const scrollThreshold = isSafari ? 0.002 : 0.0001;
        const csThreshold = isSafari ? 0.02 : 0.01;
        if (Math.abs(scroll - lastKeyboardScroll) < scrollThreshold && Math.abs(cs - lastKeyboardCS) < csThreshold && !isAnimating && !hasVideos) {
            return;
        }

        lastKeyboardScroll = scroll;
        lastKeyboardCS = cs;

        const w = window.innerWidth;
        const h = window.innerHeight;
        keyboardCtx.clearRect(0, 0, w, h);

        // Calculate aboutStep for row 1 upward shift
        // Use frozen state if transitioning to preserve layout, otherwise use current scroll
        const relevantScroll = (window.isTransitioningToWorks || window.isTransitioningToAbout) && window.frozenAboutScroll
            ? window.frozenAboutScroll
            : scroll;
        const layoutAboutStep = Math.max(0, relevantScroll - 3.0);
        const row1UpwardShift = Math.min(60, layoutAboutStep * 60);

        // For exit animation movement, use the actual dynamic scroll
        const movementAboutStep = Math.max(0, scroll - 3.0);

        keyDataCache.forEach(k => {
            if (k.isSkip) return;

            const arrivalTime = rowArrivals[k.rowIndex] + (k.staggerDelay || 0);
            const startMoveTime = arrivalTime - 0.5;
            let yOffset = 0;
            let alpha = 1;

            if (smoothScroll < startMoveTime) {
                yOffset = 1000; alpha = 0;
            } else if (smoothScroll < arrivalTime) {
                const t = (smoothScroll - startMoveTime) / 0.5;
                // EaseInOutCubic
                const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                yOffset = 1000 * (1 - ease);
                alpha = ease;
            }

            // --- EXIT PHASE (Staggered slide-out to Works) ---
            let exitShiftX = 0;
            // Exit happens between aboutStep 5.0 and 6.8
            // Use movementAboutStep so the exit animation actually plays during transition
            const exitProgress = Math.max(0, Math.min(1, (movementAboutStep - 5.0) / 1.8));
            if (exitProgress > 0) {
                // Stagger based on row (bottom-up feel) and personal stagger
                const exitDelay = (5 - k.rowIndex) * 0.1 + (k.staggerDelay || 0);
                // Multiplier 1.6 ensures they finish before exitProgress reaches 1
                const kExitP = Math.max(0, Math.min(1, (exitProgress * 1.6) - exitDelay));
                const exitEase = kExitP < 0.5 ? 4 * kExitP * kExitP * kExitP : 1 - Math.pow(-2 * kExitP + 2, 3) / 2;

                exitShiftX = -exitEase * (w * 1.2); // Slide further left to be sure
                alpha *= (1 - exitEase);
            }

            if (alpha > 0.001) {
                keyboardCtx.save();
                keyboardCtx.globalAlpha = alpha;

                // Apply row 0 (F-keys) upward shift when paragraph 1 is leaving
                // BUT DISABLE ON MOBILE to keep the ceiling fixed
                let additionalYShift = 0;
                if (k.rowIndex === 0 && window.innerWidth >= 768) {
                    additionalYShift = -row1UpwardShift;
                }

                const centerX = k.x + k.w / 2 + exitShiftX;
                const centerY = k.y + yOffset + additionalYShift + k.h / 2;
                keyboardCtx.translate(centerX, centerY);

                // Rotation effect (Y-axis mock)
                const s = keyStates[k.id] || { currentRot: 0 };
                const rad = s.currentRot * Math.PI / 180;
                const scaleX = Math.cos(rad);
                keyboardCtx.scale(scaleX, 1);

                // Shadows are disabled for performance (Safari bottleneck)
                // keyboardCtx.shadowColor = "rgba(0, 0, 0, 0.2)";
                // keyboardCtx.shadowBlur = 12;
                // keyboardCtx.shadowOffsetY = 6;

                keyboardCtx.fillStyle = '#f2f2f5';
                keyboardCtx.beginPath();
                keyboardCtx.roundRect(-k.w / 2, -k.h / 2, k.w, k.h, 6);
                keyboardCtx.fill();

                keyboardCtx.shadowColor = "transparent";

                const mData = mediaCache[k.mKey];
                const opArr = mediaOpacities[k.mKey];
                if (mData && opArr && opArr.loaded) {
                    keyboardCtx.save();
                    keyboardCtx.globalAlpha = opArr.val * alpha;
                    keyboardCtx.beginPath();
                    keyboardCtx.roundRect(-k.w / 2, -k.h / 2, k.w, k.h, 6);
                    keyboardCtx.clip();
                    // Direct drawImage as in about.html (math alignment)
                    keyboardCtx.drawImage(mData, -k.w / 2, -k.h / 2, k.w, k.h);
                    keyboardCtx.restore();
                } else if (!mediaMap[k.mKey]) {
                    keyboardCtx.fillStyle = '#1d1d1f';
                    keyboardCtx.font = `${k.h * 0.25}px Clash Display, sans-serif`;
                    keyboardCtx.textAlign = 'center';
                    keyboardCtx.textBaseline = 'middle';
                    keyboardCtx.fillText(k.key, 0, 0);
                }

                keyboardCtx.strokeStyle = '#d1d1d6';
                keyboardCtx.lineWidth = 1;
                keyboardCtx.beginPath();
                keyboardCtx.roundRect(-k.w / 2, -k.h / 2, k.w, k.h, 6);
                keyboardCtx.stroke();

                keyboardCtx.restore();
            }
        });

        if (isFrameReady) {
            keyboardCtx.drawImage(frameCanvas, 0, 0, w * dpr, h * dpr, 0, 0, w, h);
        }

        updateCVButton(smoothScroll);
    }

    function updateCVButton(scroll) {
        if (!cvBtn) return;
        const windowW = window.innerWidth;
        const isMobile = windowW < 768;

        // Find F12 and Power keys in row 0 (F-keys row)
        const row0 = keyDataCache.filter(k => k.rowIndex === 0);
        const keyF12 = row0.find(k => k.key === 'F12') || row0[row0.length - 2];
        const keyPower = row0.find(k => k.key === 'POWER' || k.mKey === 'power') || row0[row0.length - 1];
        if (!keyF12 || !keyPower) return;

        // Calculate aboutStep (when paragraph 1 starts leaving)
        // Use frozen state if transitioning to preserve layout, otherwise use current scroll
        const relevantScroll = (window.isTransitioningToWorks || window.isTransitioningToAbout) && window.frozenAboutScroll
            ? window.frozenAboutScroll
            : scroll;
        const layoutAboutStep = Math.max(0, relevantScroll - 3.0);

        // Calculate row 0 (F-keys) arrival offset
        const arrivalTime = rowArrivals[0];
        const startMoveTime = arrivalTime - 0.5;
        let row1ArrivalOffset = 0;
        if (scroll < startMoveTime) { // arrival uses real scroll? Yes as keys use real scroll for arrival
            row1ArrivalOffset = 1000;
        } else if (scroll < arrivalTime) {
            const t = (scroll - startMoveTime) / 0.5;
            row1ArrivalOffset = 1000 * (1 - (1 - Math.pow(1 - t, 3)));
        }

        // Apply row 0 upward shift (layout driven)
        const row1UpwardShift = Math.min(60, layoutAboutStep * 60);
        const row0Y = keyF12.y + row1ArrivalOffset - row1UpwardShift;

        // Button dimensions (between F12 and Power)
        const xStart = keyF12.x;
        const btnWidth = (keyPower.x + keyPower.w) - xStart;
        const halfHeight = keyF12.h / 2;
        const gap = 4;


        // Get a key from row 1 to calculate the gap
        const keyFromRow1 = keyDataCache.find(k => k.rowIndex === 1);
        if (!keyFromRow1) return;

        // Button slide-out animation - positioned BETWEEN row 0 and row 1
        const row0Bottom = row0Y + keyF12.h;
        const row1Top = keyFromRow1.y;
        const gapCenter = (row0Bottom + row1Top) / 2;

        const targetYPos = gapCenter;
        const startYPos = gapCenter + halfHeight + 20;

        const appearanceProgress = Math.min(1, Math.max(0, layoutAboutStep * 2.5));

        // --- EXIT PHASE (Horizontal slide-out to Works) ---
        let exitShiftX = 0;
        const movementAboutStep = Math.max(0, scroll - 3.0);
        const exitProgress = Math.max(0, Math.min(1, (movementAboutStep - 5.0) / 1.8));
        if (exitProgress > 0) {
            const exitDelay = (5 - 0.5) * 0.1;
            const kExitP = Math.max(0, Math.min(1, (exitProgress * 1.6) - exitDelay));
            const exitEase = kExitP < 0.5 ? 4 * kExitP * kExitP * kExitP : 1 - Math.pow(-2 * kExitP + 2, 3) / 2;
            exitShiftX = -exitEase * (windowW * 1.2);
        }

        if (appearanceProgress === 0 || window.isDirectHomeWork) {
            cvBtn.style.display = 'none';
            cvBtn.style.opacity = '0';
            cvBtn.style.pointerEvents = 'none';
        } else {
            cvBtn.style.display = 'block';
            const currentY = startYPos + (targetYPos - startYPos) * appearanceProgress;

            const cvWidth = isMobile ? windowW * 0.6 : btnWidth;
            const cvLeft = isMobile ? windowW / 2 : xStart + btnWidth / 2;

            cvBtn.style.width = `${cvWidth}px`;
            cvBtn.style.height = `${halfHeight}px`;
            cvBtn.style.left = `${cvLeft}px`;
            cvBtn.style.top = `${currentY}px`;
            cvBtn.style.transform = `translate(calc(-50% + ${exitShiftX}px), -50%)`;
            cvBtn.style.opacity = appearanceProgress > 0.1 ? '1' : '0';
            cvBtn.style.pointerEvents = (appearanceProgress > 0.8 && exitProgress < 0.1) ? 'auto' : 'none';
        }

        const currentLang = document.documentElement.getAttribute('lang') || localStorage.getItem('preferredLanguage') || 'en';
        cvBtn.href = currentLang === 'es' ? 'CVs/CV_Español.pdf' : 'CVs/CV_Ingles.pdf';
    }

    const paragraphStates = paragraphs.map(() => ({ opacity: -1, x: -9999, y: -9999, scale: -1, w: -1, h: -1 }));

    function updateParagraphs(scroll) {
        if (typeof scroll === 'undefined' || typeof scroll === 'boolean') scroll = globalScroll;
        // "aboutStep" maps globalScroll to the paragraph carousel logic.
        const aboutStep = Math.max(0, scroll - 3.0);

        // Direct Home <-> Work jump: hide all paragraphs
        if (window.isDirectHomeWork) {
            paragraphs.forEach(p => {
                p.style.setProperty('opacity', '0', 'important');
                p.style.setProperty('visibility', 'hidden', 'important');
            });
            aboutContainer.style.setProperty('visibility', 'hidden', 'important');
            return;
        }

        paragraphs.forEach((p, i) => {
            const rel = i - aboutStep;
            let x = 0, y = 0, w = 0, h = 0, opacity = 1, scale = 1, yOffset = 0;

            // ARRIVAL PHASE (while scroll < 3.0)
            // We blend the original arrival logic with the about displacement logic
            const rowIndex = i + 1;
            const arrivalTime = rowArrivals[rowIndex];

            if (scroll < 3.0) {
                // Standard Arrival
                const startFade = arrivalTime - 0.3;
                opacity = Math.max(0, Math.min(1, (scroll - startFade) / 0.3));
                yOffset = scroll < arrivalTime ? (1 - opacity) * 100 : 0;

                const gap = rowGapsData[rowIndex];
                if (gap) {
                    x = gap.left; y = gap.top; w = gap.width; h = gap.height;
                }

                if (window.innerWidth < 768) {
                    // Force center on mobile during arrival
                    x = window.innerWidth / 2;
                }
            } else {
                // DISPLACEMENT PHASE (aboutStep logic)
                if (rel <= -1) {
                    // Far left (pushed out)
                    x = -window.innerWidth * 0.5; y = window.innerHeight * 0.5; opacity = 0; scale = 0.8;
                } else if (rel < 0) {
                    // Leaving to left
                    const t = -rel;
                    const start = rowGapsData[1];
                    if (start) {
                        const moveX = (window.innerWidth < 768) ? window.innerWidth / 2 : start.left + (-window.innerWidth * 0.5 - start.left) * t;
                        x = moveX; y = start.top; w = start.width; h = start.height;
                    }
                    opacity = 1 - t; scale = 1 - 0.2 * t;
                } else if (rel < 3) {
                    // Moving between rows
                    const i1 = Math.floor(rel);
                    const i2 = i1 + 1;
                    const p1 = rowGapsData[i1 + 1];
                    const p2 = rowGapsData[i2 + 1];
                    if (p1 && p2) {
                        const t = rel - i1;
                        x = (window.innerWidth < 768) ? window.innerWidth / 2 : p1.left + (p2.left - p1.left) * t;
                        y = p1.top + (p2.top - p1.top) * t;
                        w = p1.width + (p2.width - p1.width) * t;
                        h = p1.height + (p2.height - p1.height) * t;
                    }
                    opacity = 1; scale = 1;
                } else if (rel < 4) {
                    // Entering from bottom logic (implied next p)
                    const t = 1 - (rel - 3);
                    const end = rowGapsData[4];
                    if (end) {
                        x = (window.innerWidth < 768) ? window.innerWidth / 2 : end.left;
                        y = end.top + 100 * (1 - t); w = end.width; h = end.height;
                    }
                    opacity = t; scale = 0.8 + 0.2 * t;
                } else {
                    opacity = 0;
                }
            }

            // Calculate row offset for this paragraph's corresponding keyboard row
            // Paragraph i corresponds to keyboard row (i + 1)
            // Only apply during arrival phase (scroll < 3.0)
            let rowYOffset = 0;

            if (scroll < 3.0) {
                const paragraphRowIndex = i + 1;
                const rowArrivalTime = rowArrivals[paragraphRowIndex];
                const rowStartMoveTime = rowArrivalTime - 0.5;

                if (scroll < rowStartMoveTime) {
                    rowYOffset = 5000; // Row is far off-screen
                } else if (scroll < rowArrivalTime) {
                    const t = (scroll - rowStartMoveTime) / 0.5;
                    rowYOffset = 5000 * (1 - (1 - Math.pow(1 - t, 3)));
                }
            }
            // After scroll >= 3.0, rowYOffset stays at 0

            // Apply row offset to paragraph position only when visible
            if (opacity > 0) {
                y += rowYOffset;
            }

            // Force hide paragraph 5 (index 4) and 6 (index 5) until checkpoint 3.0
            if (i >= 4 && scroll < 3.0) {
                opacity = 0;
            }

            const pState = paragraphStates[i];
            const hasChanged = pState.opacity !== opacity || pState.x !== x || pState.y !== y || pState.scale !== scale || pState.w !== w || pState.h !== h;

            if (!hasChanged) return;

            pState.opacity = opacity; pState.x = x; pState.y = y; pState.scale = scale; pState.w = w; pState.h = h;

            const referenceW = 800;
            const respScale = w / referenceW;
            const totalScale = scale * respScale;

            p.style.setProperty('opacity', opacity, 'important');
            p.style.setProperty('pointer-events', opacity > 0.1 ? 'auto' : 'none', 'important');
            p.style.setProperty('visibility', opacity > 0 ? 'visible' : 'hidden', 'important');
            p.style.setProperty('width', `${referenceW}px`, 'important'); // Content width is fixed to reference
            p.style.setProperty('height', 'auto', 'important'); // Let height be determined by content
            const finalTransform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0) scale(${totalScale})`;
            p.style.setProperty('transform', finalTransform, 'important');
        });

        if (scroll > 1.0) aboutContainer.style.setProperty('visibility', 'visible', 'important');
        else aboutContainer.style.setProperty('visibility', 'hidden', 'important');

        // Mobile About visibility
        if (aboutContainerMobile) {
            if (scroll > 1.0) {
                aboutContainerMobile.style.setProperty('visibility', 'visible', 'important');
                aboutContainerMobile.style.setProperty('opacity', '1', 'important');
            } else {
                aboutContainerMobile.style.setProperty('visibility', 'hidden', 'important');
                aboutContainerMobile.style.setProperty('opacity', '0', 'important');
            }
        }
    }
    function animate() {
        // --- LAZY LOAD MEDIA ---
        // Check if we need to load any rows based on scroll
        rowArrivals.forEach((arrival, index) => {
            // Buffer of 0.8 means we load slightly before they arrive (around 0.2 scroll units before)
            // arrival is 1.0, 1.3... so at 0.2 scroll we trigger row 0? No, wait.
            // arrival 1.0 -> load at 0.2? That's too early.
            // Let's load when within 1.5 units.
            if (globalScroll > arrival - 1.5) {
                loadRowMedia(index);
            }
        });

        // --- DIRECT PROGRESS LERP ---
        if (window.isDirectHomeWork) {
            // Safari gets faster value, Chrome keeps original smooth value
            const directLerp = isSafari ? 0.22 : 0.15;
            window.directProgress += (targetDirectProgress - window.directProgress) * directLerp;

            // Map directProgress (0-1) to the globalScroll range (0-9.5) 
            // to keep all components in sync and avoid the "snap" at the end.
            globalScroll = window.directProgress * 9.5;

            if (Math.abs(window.directProgress - targetDirectProgress) < 0.001) {
                window.directProgress = targetDirectProgress;
                globalScroll = targetDirectProgress === 1 ? 9.5 : 0;
                window.isDirectHomeWork = false;
                window.isTransitioningToWorks = false;
                window.isTransitioningToAbout = false;
                if (targetDirectProgress === 1) {
                    worksLocked = true;
                    targetGlobalScroll = 12; // Start vertical scroll into works
                } else {
                    worksLocked = false;
                    targetGlobalScroll = 0;
                }
            }
        }

        // --- GLOBAL SCROLL LERP ---
        let isTransitioning = window.isTransitioningToWorks || window.isTransitioningToAbout || window.isDirectHomeWork;

        // Safari-specific optimizations for speed, Chrome keeps original smooth values
        let followFactor = isTransitioning
            ? (isSafari ? 0.15 : 0.08)
            : (isSafari ? 0.22 : 0.15);
        let diff = (targetGlobalScroll - globalScroll) * followFactor;

        // Cap velocity for smooth programmatic movement
        let maxV = isTransitioning
            ? (isSafari ? 0.18 : 0.12)
            : (isSafari ? 0.12 : 0.08);

        if (globalScroll >= 2.9 && globalScroll < 7.8 && !isTransitioning) {
            maxV = isSafari ? 0.5 : 0.4;
        } else if (globalScroll >= 7.8 && !isTransitioning) {
            maxV = isSafari ? 0.1 : 0.07;
        }

        // Easing logic for transitions
        if (isTransitioning) {
            const dist = Math.abs(targetGlobalScroll - globalScroll);
            const minEase = isSafari ? 0.02 : 0.01;
            if (dist < 1.0) maxV = Math.max(minEase, maxV * (dist * 0.8 + 0.2));

            // Complete transition if close enough
            if (dist < 0.01 && !window.isDirectHomeWork) {
                globalScroll = targetGlobalScroll;
                window.isTransitioningToWorks = false;
                window.isTransitioningToAbout = false;
            }
        }

        // --- NORMALIZE PROGRESS (Used for all transitions) ---
        let exitProgress = Math.max(0, Math.min(1, (globalScroll - 8.0) / 1.5));
        let enterProgress = exitProgress;

        if (window.isDirectHomeWork) {
            exitProgress = window.directProgress;
            enterProgress = window.directProgress;
        }
        if (contactFromWork) {
            exitProgress = 1;
            enterProgress = 1;
        }

        // Specialized slowdown for About -> Home transition
        if (targetGlobalScroll === 0 && globalScroll > 0.1) {
            maxV = Math.min(maxV, isSafari ? 0.1 : 0.06);
        }

        // Specialized slowdown for Home -> About transition
        if (targetGlobalScroll === 3.0 && globalScroll < 3.0) {
            maxV = Math.min(maxV, isSafari ? 0.12 : 0.08);
        }


        // Specialized slowdown for About <-> Work transitions
        // Forward: Only when transition visually starts (> 7.9)
        // Backward: Always (if starting from Works)
        if ((targetGlobalScroll > 8.0 && globalScroll >= 7.9) ||
            (targetGlobalScroll === 3.0 && globalScroll >= 8.0)) {
            // Safari gets faster values, Chrome keeps original smooth values
            let peak = isTransitioning
                ? (isSafari ? 0.12 : 0.03)
                : (isSafari ? 0.08 : 0.02);
            let limit = peak;
            // Add easing at the start and end of this long transition
            const dist = Math.abs(targetGlobalScroll - globalScroll);
            const minLimit = isSafari ? 0.02 : 0.005;
            if (dist < 1.0) limit = Math.max(minLimit, peak * (dist / 1.0));

            maxV = Math.min(maxV, limit);
        }
        if (!window.isDirectHomeWork) {
            if (diff > maxV) diff = maxV;
            if (diff < -maxV) diff = -maxV;
            globalScroll += diff;
        }

        // --- TRANSITION PERSISTENCE LOGIC ---
        if (typeof window.frozenAboutScroll === 'undefined') window.frozenAboutScroll = 3.0;

        // Track last known paragraph position if in Bio and not programmatically moving
        if (globalScroll >= 3.0 && globalScroll < 8.0 && !isTransitioning) {
            window.frozenAboutScroll = globalScroll;
        }

        let pScroll = globalScroll;
        if (window.isTransitioningToWorks) {
            pScroll = window.frozenAboutScroll;
            if (globalScroll > 10.5) window.isTransitioningToWorks = false;
        } else if (window.isTransitioningToAbout) {
            pScroll = window.frozenAboutScroll;
            // When the horizontal entry is done (globalScroll back to 8.0 region)
            if (globalScroll <= 8.05) {
                // Snap globalScroll to where paragraphs "actually" are to avoid a vertical jump
                globalScroll = window.frozenAboutScroll;
                window.isTransitioningToAbout = false;
            }
        } else if (window.isDirectHomeWork) {
            // During a direct jump, keep paragraphs at a "hidden" state (3.0 is the start of about, but they're still hidden there)
            // or at 0 if we're closer to Home.
            pScroll = (window.directProgress > 0.5) ? 10.0 : 0.0;
        }

        // Update scroll limits for a slightly longer transition (3.0 instead of 2.5)
        const worksLimit = paragraphs.length + 3.0 + 3.0;
        // This limit is also enforced in wheel/touch but we'll reflect it in calculations

        // --- 1. KEY ROTATION ANIMATION ---
        let keyboardIsAnimating = false;
        keyDataCache.forEach(meta => {
            if (meta.isSkip) return;
            const s = keyStates[meta.id];
            if (!s) return;

            const isHover = mouseX >= meta.x && mouseX <= meta.x + meta.w &&
                mouseY >= meta.y && mouseY <= meta.y + meta.h;

            if (isHover && !s.lastHover) {
                s.targetRot += 360 * (Math.random() > 0.5 ? 1 : -1);
            }
            s.lastHover = isHover;

            if (Math.abs(s.targetRot - s.currentRot) > 0.1) {
                s.currentRot += (s.targetRot - s.currentRot) * 0.12;
                keyboardIsAnimating = true;
            } else {
                s.currentRot = s.targetRot;
            }
        });

        // --- 2. KEY VISIBILITY (Row-based Arrival) ---
        // Pre-calculate stagger if not already done
        keyDataCache.forEach(kd => {
            const o = mediaOpacities[kd.mKey];
            if (!o) return;

            // Determine if key should be visible based on scroll vs row arrival + individual stagger
            const arrivalTime = (rowArrivals[kd.rowIndex] || 0) + (kd.staggerDelay || 0);
            const shouldBeVisible = globalScroll > arrivalTime;

            if (shouldBeVisible) {
                if (o.val < 1) {
                    o.val = Math.min(1, o.val + 0.15); // Faster fade-in
                    keyboardIsAnimating = true;
                }
            } else {
                if (o.val > 0) {
                    o.val = Math.max(0, o.val - 0.15); // Faster fade-out
                    keyboardIsAnimating = true;
                }
            }
        });

        // Clear entire high-res buffer
        particleCtx.save();
        particleCtx.resetTransform();
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particleCtx.restore();

        // Draw topological waves (Global Background)
        topoTime += 0.005;
        drawTopoLines();

        // Draw name particles ONLY when near Home or during direct Home-Work transition
        const cs = (typeof animate.contactShift !== 'undefined') ? animate.contactShift : 0;
        const showNameParticles = (globalScroll < 1.1 || window.isDirectHomeWork) && !contactFromWork;

        if (showNameParticles) {
            particlesArray.forEach(p => {
                p.update(globalScroll, mouseX, mouseY, isContactOpen, cs);
                p.draw(particleCtx);
            });
        }

        // --- 1. MODEL VIEWER ANIMATION (Home / Exit / Contact) ---
        if (isContactOpen) {
            const p = cs / 100;
            const scale = Math.max(0, 1 - p * 3); // Shrink factor
            const alpha = Math.max(0, 1 - p * 4); // Fade out

            // Combine contact fade with exit fade and intro fade
            const finalAlpha = alpha * (1 - exitProgress) * introAlpha;
            modelViewer.style.opacity = finalAlpha;

            const currentTotalShift = (exitProgress * 100) + cs;
            modelViewer.style.transform = `translateX(${currentTotalShift}vw) scale(${scale})`;
            modelViewer.style.pointerEvents = 'none';
        } else {
            // Normal, About or Direct path
            const isDirect = window.isDirectHomeWork || window.isTransitioningToWorks || window.isTransitioningToAbout;
            const alpha = 1 - exitProgress;

            // Only show if we are in Home range or in a direct transition
            // Multiply by introAlpha to prevent flicker on load
            const baseOpacity = (globalScroll < 1.1 || isDirect) ? alpha : 0;
            modelViewer.style.opacity = baseOpacity * introAlpha;

            const mvShift = exitProgress * 100;
            modelViewer.style.transform = `translate3d(-${mvShift}vw, 0, 0) scale(1)`;

            // Model Rotation (360 turnover from Home to About)
            const rotationProgress = Math.max(0, Math.min(1, globalScroll / 3.0));
            const modelRotation = rotationProgress * 360;
            // Eje Z (giro plano como un reloj)
            modelViewer.setAttribute('orientation', `0deg 0deg ${modelRotation}deg`);

            // Enable interaction ONLY when solidly in Home and not transitioning
            modelViewer.style.pointerEvents = (globalScroll < 0.1 && !isDirect) ? 'auto' : 'none';
        }

        // Determine if keyboard is in a visible range. 
        // If so, we MUST call drawKeyboard every frame to keep videos moving.
        const keyboardInView = globalScroll > 1.0 && globalScroll < 9.5;

        drawKeyboard(globalScroll, globalScroll, keyboardIsAnimating);
        updateParagraphs(pScroll);

        // --- HOME ARROW VISIBILITY ---
        if (homeArrow) {
            const arrowAlpha = Math.max(0, 1 - globalScroll * 2);
            homeArrow.style.opacity = arrowAlpha;
            homeArrow.style.pointerEvents = arrowAlpha > 0.5 ? 'auto' : 'none';
        }



        const shiftX = exitProgress * 100;
        const enterX = enterProgress * 100;

        // Contact Slide Logic
        if (typeof animate.contactShift === 'undefined') animate.contactShift = 0;
        const targetCS = isContactOpen ? 100 : 0;
        // Aggressive lerp for contact slide - Increased for snappy response
        animate.contactShift += (targetCS - animate.contactShift) * 0.15;

        // Shift existing elements left (Scroll Shift + Contact Shift)
        const totalShift = shiftX + animate.contactShift;

        const hContainer = document.getElementById('home-container');
        const wContainer = document.getElementById('works-section-container');
        // aboutContainer is already declared globally

        hContainer.style.transform = `translate3d(-${totalShift}vw, 0, 0)`;
        aboutContainer.style.transform = `translate3d(-${totalShift}vw, 0, 0)`;

        // Move KeyboardCanvas along with Home/About
        keyboardCanvas.style.transform = `translate3d(-${totalShift}vw, 0, 0)`;
        // particleCanvas stays FIXED to keep waves continuous behind transitions
        particleCanvas.style.transform = `translate3d(0, 0, 0)`;

        if (cvBtn) cvBtn.style.transform = `translate3d(-50%, -50%, 0) translate3d(-${totalShift}vw, 0, 0)`;

        if (contactFromWork) {
            wContainer.style.left = `${101 - (enterX * 1.01)}vw`;
            wContainer.style.transform = `translate3d(0, ${animate.contactShift}vh, 0)`;
        } else {
            // If we are closing a vertical contact to go horizontal, keep Works fully out 
            const extraShift = (window.isTransitioningToAbout && window.isExitingVerticalContact) ? 101 : 0;
            wContainer.style.left = `${101 - (enterX * 1.01) + extraShift}vw`;
            wContainer.style.transform = `translate3d(${animate.contactShift}vw, 0, 0)`;
        }

        requestAnimationFrame(animate);
    }

    // --- INITIALIZATION ---
    function setupCanvases() {
        dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;

        particleCanvas.width = w * dpr;
        particleCanvas.height = h * dpr;
        particleCanvas.style.width = `${w}px`;
        particleCanvas.style.height = `${h}px`;
        particleCtx.resetTransform();
        particleCtx.scale(dpr, dpr);

        keyboardCanvas.width = w * dpr;
        keyboardCanvas.height = h * dpr;
        keyboardCanvas.style.width = `${w}px`;
        keyboardCanvas.style.height = `${h}px`;
        keyboardCtx.resetTransform();
        keyboardCtx.scale(dpr, dpr);

        lastKeyboardScroll = -1;
        lastKeyboardCS = -1;
        initParticles();
        setupKeyboardLayout();
    }

    window.addEventListener('resize', setupCanvases);

    // Initial URL Check - Synchronous to avoid "home jump" on reload
    if (initSection) {
        if (initSection === 'about') {
            globalScroll = 3.0;
            targetGlobalScroll = 3.0;
        } else if (initSection === 'works') {
            const maxScroll = (paragraphs.length || 0) + 3.0 + 3.5;
            globalScroll = maxScroll;
            targetGlobalScroll = maxScroll;
            worksLocked = true;
        } else if (initSection === 'contact') {
            isContactOpen = true;
            const cc = document.getElementById('contact-section-container');
            if (cc) {
                cc.classList.add('no-transition'); // Prevent slide-in on load
                cc.classList.add('is-open');
                setTimeout(() => cc.classList.remove('no-transition'), 100);
            }
        }
    }

    // Initial Setup
    setupCanvases();
    if (initSection === 'about' || initSection === 'works') {
        disperseParticles();
    }
    animate();

    // --- NAV LINKS INTERCEPTION ---
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href === '#' || href === '' || href.startsWith('javascript:')) return;

        let url;
        try {
            url = new URL(link.href, window.location.origin);
        } catch (err) {
            return;
        }

        const isInternal = url.origin === window.location.origin;
        const isIndex = url.pathname.endsWith('index.html') || url.pathname === '/';

        if (isInternal && isIndex) {
            const section = url.searchParams.get('section');
            // Only intercept if it's a home link or a section link
            // If it's just '#' we already returned, but if it's external or different page, we let it be.
            e.preventDefault();
            const targetEvent = section ? 'navigateTo' + section.charAt(0).toUpperCase() + section.slice(1) : 'navigateToHome';

            // Update URL without reload
            window.history.pushState({}, '', link.href);
            window.dispatchEvent(new CustomEvent(targetEvent));
        }
    });

    const contactContainer = document.getElementById('contact-section-container');
    window.addEventListener('navigateToContact', () => {
        // Reset all aggressive hide styles to ensure visibility
        contactContainer.style.setProperty('opacity', '', '');
        contactContainer.style.setProperty('visibility', '', '');
        contactContainer.style.setProperty('left', '', '');
        contactContainer.style.setProperty('top', '', '');
        contactContainer.style.setProperty('transition', '', '');
        contactContainer.style.setProperty('display', '', '');

        const isWork = globalScroll >= 8.0;
        if (isWork) {
            contactFromWork = true;
            contactContainer.style.setProperty('transition', 'none', 'important');
            contactContainer.classList.add('from-work');
            contactContainer.classList.remove('is-open');
            contactContainer.offsetHeight; // force reflow
            requestAnimationFrame(() => {
                contactContainer.style.setProperty('transition', '', '');
                isContactOpen = true;
                contactContainer.classList.add('is-open');
            });
        } else {
            contactFromWork = false;
            contactContainer.classList.remove('from-work');
            isContactOpen = true;
            contactContainer.classList.add('is-open');
        }
    });

    function closeContact(forceHorizontal = false) {
        const wasOpen = isContactOpen;
        isContactOpen = false;

        if (forceHorizontal) {
            if (wasOpen) {
                // Only do the transition dance if it was actually open
                contactContainer.style.setProperty('transition', 'left 0.6s cubic-bezier(0.16, 1, 0.3, 1)', 'important');
                const wasVertical = contactFromWork;
                if (wasVertical) window.isExitingVerticalContact = true;
                contactFromWork = false;
                contactContainer.classList.remove('from-work');
                contactContainer.style.setProperty('top', '0px', 'important');
            } else {
                // If it was already closed, just snap everything out without transitions
                contactContainer.style.setProperty('transition', 'none', 'important');
                contactFromWork = false;
                contactContainer.classList.remove('from-work');
                contactContainer.style.setProperty('top', '', '');
                contactContainer.style.setProperty('left', '', '');
                window.isExitingVerticalContact = false;
                // Force reflow to ensure styles apply before any potential next open
                contactContainer.offsetHeight;
            }
        }

        contactContainer.classList.remove('is-open');
        setTimeout(() => {
            const isWorkActive = worksLocked || globalScroll >= 8.0;
            if (!isContactOpen) {
                // Clear all inline locks and hide styles after transition
                contactContainer.style.setProperty('top', '', '');
                contactContainer.style.setProperty('left', '', '');
                contactContainer.style.setProperty('transition', '', '');
                contactContainer.style.setProperty('opacity', '', '');
                contactContainer.style.setProperty('visibility', '', '');
                contactContainer.style.setProperty('display', '', '');

                if (!isWorkActive) {
                    contactFromWork = false;
                    contactContainer.classList.remove('from-work');
                }
                window.isExitingVerticalContact = false;
            }
        }, 1300); // Slightly longer than transition (1.2s)
    }

    // --- OBSERVERS AND EVENTS ---


    function disperseParticles() {
        particlesArray.forEach(p => {
            // Simulate the "dispersed" state (mostly kicked left and scattered)
            p.x = p.initialX - (Math.random() * 300 + 100);
            p.y = p.initialY + (Math.random() - 0.5) * 500;
            p.vx = -Math.random() * 10;
            p.vy = (Math.random() - 0.5) * 10;
        });
    }



    // Navigation Listeners
    window.addEventListener('navigateToHome', () => {
        const wasInAbout = globalScroll >= 1.1 && globalScroll <= 8.0;
        const wasInWorks = globalScroll > 8.0;

        if (isContactOpen) {
            globalScroll = 0;
            worksLocked = false;
        }

        closeContact(true);
        window.isTransitioningToWorks = false;
        window.isTransitioningToAbout = false;

        if (wasInAbout || wasInWorks) {
            disperseParticles();
            worksLocked = false;
            if (wasInWorks) {
                window.isDirectHomeWork = true;
                window.directProgress = 1;
                targetDirectProgress = 0;
            }
        }
        targetGlobalScroll = 0;
    });

    window.addEventListener('navigateToAbout', () => {
        const wasInWorks = globalScroll > 8.0 || contactFromWork;

        if (isContactOpen) {
            globalScroll = 3.0;
            worksLocked = false;
        }

        closeContact(true);

        if (wasInWorks && !isContactOpen) {
            window.isTransitioningToAbout = true;
            globalScroll = 9.5;
        }

        worksLocked = false;
        targetGlobalScroll = 3.0;
        checkpointLocked = true;
        setTimeout(() => { checkpointLocked = false; }, 600);
    });

    window.addEventListener('navigateToWorks', () => {
        const wasInContact = isContactOpen;
        const wasInHome = globalScroll < 1.1;

        if (isContactOpen) {
            contactFromWork = true;
            contactContainer.classList.add('from-work');
        }
        closeContact();

        if (wasInContact) {
            if (wasInHome) {
                window.isDirectHomeWork = true;
                window.directProgress = 0;
                targetDirectProgress = 1;
                globalScroll = 0;
            } else {
                globalScroll = 9.5;
            }
        } else {
            if (globalScroll < 1.1) {
                window.isDirectHomeWork = true;
                window.directProgress = 0;
                targetDirectProgress = 1;
            } else if (globalScroll < 7.8) {
                window.frozenAboutScroll = Math.max(3.0, globalScroll);
                window.isTransitioningToWorks = true;
                globalScroll = 8.0;
            }
        }

        worksLocked = true;
        const maxScroll = paragraphs.length + 3.0 + 3.5;
        targetGlobalScroll = maxScroll;
    });




    // --- WORKS INITIALIZATION (MixItUp & Buttons) ---
    const mixer = mixitup('.mix-container', {
        selectors: {
            target: '.mix'
        },
        animation: {
            duration: 200,
            effects: 'fade scale(0.95)',
            enable: true
        },
        callbacks: {
            onMixEnd: function (state) {
                const yearHeaders = document.querySelectorAll('.year-header');
                yearHeaders.forEach(header => {
                    // Find all siblings until the next header or end of container
                    let hasVisibleItems = false;
                    let sibling = header.nextElementSibling;

                    while (sibling && !sibling.classList.contains('year-header')) {
                        if (sibling.classList.contains('mix') && sibling.style.display !== 'none') {
                            hasVisibleItems = true;
                            break;
                        }
                        sibling = sibling.nextElementSibling;
                    }

                    if (hasVisibleItems) {
                        header.style.display = 'block';
                    } else {
                        header.style.display = 'none';
                    }
                });
            }
        }
    });

    const worksButtons = document.querySelectorAll('#works-section-container .link-btn');
    const catalogueSection = document.querySelector('.catalogue-section');
    const forYouSection = document.querySelector('.foryou-section');
    const navActiveBox = document.querySelector('.nav-active-box');

    function updateNavBox() {
        const activeBtn = document.querySelector('#works-section-container .link-btn[aria-selected="true"]');
        if (activeBtn && navActiveBox) {
            navActiveBox.style.width = activeBtn.offsetWidth + 'px';
            navActiveBox.style.left = activeBtn.offsetLeft + 'px';
        }
    }

    function setWorksTab(target) {
        if (!target || !catalogueSection || !forYouSection) return;
        const btns = document.querySelectorAll('#works-section-container .link-btn');
        btns.forEach(b => b.setAttribute('aria-selected', b.getAttribute('data-target') === target ? 'true' : 'false'));
        if (target === 'Catalog-Section') {
            forYouSection.classList.remove('is-active');
            catalogueSection.classList.add('is-active');
        } else {
            catalogueSection.classList.remove('is-active');
            forYouSection.classList.add('is-active');
        }
        localStorage.setItem('preferredWorksTab', target);
        setTimeout(updateNavBox, 50);
    }

    const savedWorksTab = localStorage.getItem('preferredWorksTab') || 'For-You-Section';
    setWorksTab(savedWorksTab);

    worksButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            setWorksTab(btn.getAttribute('data-target'));
        });
    });


    // --- RESIZE LOGIC ---
    function handleResizeUpdates() {
        updateNavBox();

        // Update CV Button Text
        const width = window.innerWidth;
        const cvButton = document.getElementById('cv-button');
        if (cvButton) {
            if (width < 1024) {
                cvButton.textContent = "CV";
            } else {
                cvButton.textContent = "CURRICULUM VITAE";
            }
        }
    }

    window.addEventListener('resize', handleResizeUpdates);
    // Initial Call
    handleResizeUpdates();

    const filterButtons = document.querySelectorAll('#works-section-container .filter-button');

    // Select 'ALL' by default
    const allButton = document.querySelector('.filter-button[data-filter="all"]');
    if (allButton) {
        allButton.setAttribute('aria-selected', 'true');
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterButtons.forEach(b => b.setAttribute('aria-selected', 'false'));
            btn.setAttribute('aria-selected', 'true');

            if (typeof mixer !== 'undefined') {
                const filter = btn.getAttribute('data-filter');
                mixer.filter(filter);
            }
        });
    });

    // Simple slide navigation for integrated Works
    const nextSlide = document.getElementById('next-slide');
    const prevSlide = document.getElementById('prev-slide');

    // KEYBOARD NAVIGATION FOR SLIDER
    window.addEventListener('keydown', (e) => {
        // Only active if we are in Works section & For You is visible
        const forYouVisible = document.querySelector('.foryou-section.is-active');
        if (!worksLocked || !forYouVisible) return;

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!slideThrottle) {
                // Highlighting top arrow (prev-slide) and moving to PREV slide
                prevSlide.classList.add('is-active');
                prevSlide.click();
                setTimeout(() => prevSlide.classList.remove('is-active'), 200);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!slideThrottle) {
                // Highlighting bottom arrow (next-slide) and moving to NEXT slide
                nextSlide.classList.add('is-active');
                nextSlide.click();
                setTimeout(() => nextSlide.classList.remove('is-active'), 200);
            }
        }
    });

    // --- VIDEO OPTIMIZATION ---
    // --- VIDEO OPTIMIZATION & AUDIO HANDLING ---
    // --- VIDEO OPTIMIZATION & AUDIO HANDLING ---
    let audioEnabled = false;
    const audioBtn = document.getElementById('audio-toggle-btn');
    const allVideos = document.querySelectorAll('.tiktok-video video, .tiktok-videocontainer video');

    function updateAudioUI() {
        if (!audioBtn) return;
        if (audioEnabled) {
            audioBtn.textContent = "SOUND ON";
            audioBtn.classList.remove('is-muted');
        } else {
            audioBtn.textContent = "SOUND OFF";
            audioBtn.classList.add('is-muted');
        }
    }

    // Initialize UI
    updateAudioUI();

    // Store intervals/animations for fading
    const fadeAnimations = new Map();

    function fadeAudio(video, targetVol, duration = 300, onComplete = null) {
        // Clear any existing fade for this video
        if (fadeAnimations.has(video)) {
            cancelAnimationFrame(fadeAnimations.get(video));
            fadeAnimations.delete(video);
        }

        // If fading in, unmute first
        if (targetVol > 0) {
            video.muted = false;
        }

        const startVol = video.volume;
        const startTime = performance.now();

        // If difference is small, just set it
        if (Math.abs(targetVol - startVol) < 0.01) {
            video.volume = targetVol;
            if (targetVol === 0) video.muted = true;
            if (onComplete) onComplete();
            return;
        }

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Linear interpolation
            let newVol = startVol + (targetVol - startVol) * progress;

            // Limit checks
            if (newVol < 0) newVol = 0;
            if (newVol > 1) newVol = 1;

            try {
                video.volume = newVol;
            } catch (e) { /* ignore */ }

            if (progress < 1) {
                fadeAnimations.set(video, requestAnimationFrame(step));
            } else {
                fadeAnimations.delete(video);
                if (targetVol === 0) {
                    video.muted = true;
                }
                if (onComplete) onComplete();
            }
        }

        fadeAnimations.set(video, requestAnimationFrame(step));
    }

    function syncVideos() {
        allVideos.forEach(video => {
            if (!video.paused) {
                if (audioEnabled) {
                    fadeAudio(video, 1, 100);
                } else {
                    fadeAudio(video, 0, 100);
                }
            } else {
                video.volume = 0;
                video.muted = true;
            }
        });
    }

    function toggleButtonClick(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        audioEnabled = !audioEnabled;
        updateAudioUI();
        syncVideos();
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', toggleButtonClick);
    }

    function enableAudio() {
        if (audioEnabled) {
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
            return;
        }

        audioEnabled = true;
        updateAudioUI();
        syncVideos();

        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
    }

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    function initVideoObservers() {
        // Init volume to 0 for all
        const videos = document.querySelectorAll('.tiktok-video video, .tiktok-videocontainer video');
        videos.forEach(v => { v.volume = 0; v.muted = true; });

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;

                    if (entry.isIntersecting) {
                        // Ensure volume starts at 0 if play was paused or just loading
                        if (video.paused || video.volume > 0.1) {
                            video.volume = 0;
                            video.muted = false; // Prepare for fade
                        }

                        video.play().catch(e => console.log("Auto-play prevented", e));

                        // Sync audio state
                        if (audioEnabled) {
                            fadeAudio(video, 1, 100);
                        } else {
                            // If user disabled sound, ensure it stays at 0
                            fadeAudio(video, 0, 100);
                        }
                    } else {
                        // Fade OUT quickly then pause
                        fadeAudio(video, 0, 100, () => {
                            if (!entry.isIntersecting) {
                                video.pause();
                                video.muted = true;
                            }
                        });
                    }
                });
            }, { threshold: 0.5 });

            videos.forEach(video => observer.observe(video));
        }
    }
    initVideoObservers();

    // --- CONTACT FORM SUBMISSION (FORMSPREE AJAX) ---
    const contactForm = document.getElementById('email-form-contact');
    const successMsg = document.querySelector('.w-form-done');
    const errorMsg = document.querySelector('.w-form-fail');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get data from form
            const formData = new FormData(this);
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnValue = submitBtn.value;

            // Change button state
            submitBtn.value = submitBtn.getAttribute('data-wait') || "Sending...";
            submitBtn.disabled = true;

            try {
                // IMPORTANT: Replace 'XXXXXX' in the index.html action with your Formspree ID
                // or you can set it here directly. We'll use the one from the action attribute.
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    this.style.display = 'none';
                    if (successMsg) successMsg.style.display = 'block';
                    if (errorMsg) errorMsg.style.display = 'none';
                } else {
                    // Error response from server
                    const data = await response.json();
                    if (data.errors) {
                        console.error(data.errors.map(error => error.message).join(", "));
                    }
                    if (errorMsg) errorMsg.style.display = 'block';
                }
            } catch (error) {
                // Network error
                console.error("Form submission error:", error);
                if (errorMsg) errorMsg.style.display = 'block';
            } finally {
                // Restore button state if not successful
                if (contactForm.style.display !== 'none') {
                    submitBtn.value = originalBtnValue;
                    submitBtn.disabled = false;
                }
            }
        });
    }

});