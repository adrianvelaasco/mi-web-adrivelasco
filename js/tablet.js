document.addEventListener("DOMContentLoaded", function () {
    // --- STATE ---
    let currentSectionIndex = 0;
    let isMuted = true; // El audio empieza silenciado
    let preferredWorksView = 'foryou'; // Vista predeterminada
    let isInitialHomeAnimation = true; // Solo para el primer arranque en Home
    const sections = document.querySelectorAll('.section');
    const sectionsIds = ['home', 'about', 'works', 'contact'];

    // --- NAVIGATION LOGIC ---
    function goToSection(index) {
        if (index < 0 || index >= sections.length) return;

        sections.forEach((s, i) => {
            s.classList.remove('active', 'before', 'after');
            if (i < index) s.classList.add('before');
            else if (i > index) s.classList.add('after');
            else s.classList.add('active');
        });
        currentSectionIndex = index;

        // Si salimos de Home, ya no es la animación inicial
        if (index !== 0) isInitialHomeAnimation = false;

        // Actualizar links activos en el header
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, i) => {
            if (i === index - 1) { // El primer link es About (index 1)
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update URL/History if needed
        const sectionId = sectionsIds[index];
        window.history.pushState(null, null, `?section=${sectionId}`);

        // Si entramos en Works, asegurar que la vista activa es la preferida
        if (sectionId === 'works') {
            document.querySelectorAll('.works-nav-item').forEach(i => {
                i.classList.toggle('active', i.getAttribute('data-view') === preferredWorksView);
            });
            document.querySelectorAll('.works-view').forEach(v => {
                v.classList.toggle('active', v.id === `${preferredWorksView}-view`);
            });
            if (preferredWorksView === 'foryou') renderForYou();
            else renderCatalogue();
        }
    }

    // --- CLICK HANDLERS (HEADER) ---
    document.querySelector('.nav-btn-logo').addEventListener('click', (e) => {
        e.preventDefault();
        goToSection(0);
    });

    document.querySelectorAll('.nav-link').forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToSection(index + 1); // index 0 is About, 1 is Works, 2 is Contact
        });
    });

    // --- NAV EVENTS ---
    window.addEventListener('navigateToHome', () => goToSection(0));
    window.addEventListener('navigateToAbout', () => goToSection(1));
    window.addEventListener('navigateToWorks', () => goToSection(2));
    window.addEventListener('navigateToContact', () => goToSection(3));

    // --- LANGUAGE SWITCHER ---
    let currentLang = 'en';
    const translations = {
        en: {
            about: [
                "Adri Velasco (2002, Málaga) is a multimedia artist, composer, and producer based in Hamburg, Germany, where he is pursuing the Master's in Multimedia Composition at the Hochschule für Musik und Theater.",
                "His work is characterized by a fragmented and maximalist language that investigates the dialogue between contemporary and pop/urban aesthetics. Attentive to the concerns of his generation, he addresses issues related to Internet culture, multiple identities, and privacy in the digital age.",
                "His pieces have been performed in renowned venues such as the Auditorio Nacional, the Ateneo de Madrid, the Museo Reina Sofía, the Teatro de la Zarzuela, the Centro Cultural Villa de Nerja, and the Sala Berlanga, among others. He was awarded the 2nd TZ-RCSMM Composition Prize, which led to the premiere of his piece by the Trío Arbós. In addition, his orchestral work Rumble was performed by the Málaga Symphony Orchestra.",
                "He has studied with renowned composers such as Fernando Villanueva, José María Sánchez-Verdú, Óscar Escudero, and Enrique Ruedas."
            ],
            cv: "CURRICULUM VITAE",
            'contact-sayhi': "SAY<br>HI.",
            'contact-name': "Name",
            'contact-email': "Email Address",
            'contact-subject': "Subject",
            'contact-message': "Message",
            'submit-btn': "Send Message",
            'works-foryou': "FOR YOU",
            'works-catalogue': "CATALOGUE",
            'filter-all': "ALL",
            'filter-sound': "just SOUND",
            'filter-multimedia': "MULTIMEDIA",
            'filter-full': "FULL LENGTH",
            'filter-others': "others",
            'work-personas-desc': "A collaborative composition by Adri Velasco, Fran Escobar, Alejandro Mondragón, and Alberto Hijón. This piece explores the connections and disconnections in the digital age.",
            'work-ebdvp-desc': "Ok, wait, listen to this: there’s a moment. A moment when everything fits. The light. The shadows. The music. The words. You’re there, in front of the screen, and for one tiny yet infinite instant, you feel… something.",
            'work-pianogames-desc': "Dear pianist: This musical piece, if that’s what it is, aims to be an amusement for your study sessions. Three minigames have been gently crafted to refine certain aspects of your technique.",
            'work-rumble-desc': "Rumble, is a piece for symphony orchestra, its title borrowed from the fourth track of Quest For Fire by Skrillex.",
            'work-osc-desc': "I. Encoded II. 192.168.20.1 III. Node with errors inside IV. Received",
            'work-tyoe-desc': "“Three Years of Evolution” showcases the intimate and dynamic relationship established between an individual and the demanding city that will host him for the next three years.",
            'work-life-desc': "Game of Life is an adaptation of John Conway’s traditional game. This cellular automaton evolves deterministically according to its initial configuration.",
            'work-amc-desc': "This is simply about messing with the Madrid Royal Conservatory of Music.",
            'work-espontanea-desc': "Some captions published on a private Instagram account were verbalizing many thoughts that I hadn't yet been able to formulate.",
            'work-minuit-desc': "Winner of the II Composition Prize TZ-RCSMM. Premiered by Trio Arbós at Teatro de la Zarzuela.",
            'work-cisne-desc': "A performance piece premiered at Sala 400 Museo Reina Sofía. Based on the text by Dionisio Cañas.",
            cvLink: "CVs/CV_Ingles.pdf"
        },
        es: {
            about: [
                "Adri Velasco (2002, Málaga) es un artista multimedia, compositor y productor afincado en Hamburgo, Alemania, donde cursa el Máster en Composición Multimedia en la Hochschule für Musik und Theater.",
                "Su trabajo se caracteriza por un lenguaje fragmentado y maximalista que investiga el diálogo entre la estética contemporánea y la pop/urbana. Atento a las inquietudes de su generación, aborda temas relacionados con la cultura de Internet, las identidades múltiples y la privacidad en la era digital.",
                "Sus piezas han sido interpretadas en espacios de renombre como el Auditorio Nacional, el Ateneo de Madrid, el Museo Reina Sofía, el Teatro de la Zarzuela, el Centro Cultural Villa de Nerja y la Sala Berlanga, entre otros. Fue galardonado con el 2º Premio de Composición TZ-RCSMM, lo que llevó al estreno de su pieza por el Trío Arbós. Además, su obra orquestal Rumble fue interpretada por la Orquesta Sinfónica de Málaga.",
                "Ha estudiado con compositores de renombre como Fernando Villanueva, José María Sánchez-Verdú, Óscar Escudero y Enrique Ruedas."
            ],
            cv: "CURRÍCULUM VITAE",
            'contact-sayhi': "DI<br>HOLA.",
            'contact-name': "Nombre",
            'contact-email': "Correo Electrónico",
            'contact-subject': "Asunto",
            'contact-message': "Mensaje",
            'submit-btn': "Enviar Mensaje",
            'works-foryou': "PARA TI",
            'works-catalogue': "CATÁLOGO",
            'filter-all': "TODO",
            'filter-sound': "solo SONIDO",
            'filter-multimedia': "MULTIMEDIA",
            'filter-full': "LARGA DUR.",
            'filter-others': "otros",
            'work-personas-desc': "Una composición colaborativa de Adri Velasco, Fran Escobar, Alejandro Mondragón y Alberto Hijón. Esta pieza explora las conexiones y desconexiones en la era digital.",
            'work-ebdvp-desc': "Vale, espera, escucha esto: hay un momento. Un momento en el que todo encaja. La luz. Las sombras. La música. Las palabras.",
            'work-pianogames-desc': "Querido pianista: Esta pieza musical pretende ser un divertimento para tus sesiones de estudio. Tres minijuegos han sido diseñados para perfeccionar tu técnica.",
            'work-rumble-desc': "Rumble es una pieza para orquesta sinfónica, cuyo título proviene del cuarto track de Quest For Fire de Skrillex.",
            'work-osc-desc': "I. Encoded II. 192.168.20.1 III. Nodo con errores internos IV. Recibido",
            'work-tyoe-desc': "“Three Years of Evolution” muestra la relación íntima y dinámica establecida entre un individuo y la exigente ciudad que lo acogerá.",
            'work-life-desc': "Game of Life es una adaptación del juego tradicional de John Conway. Este autómata celular evoluciona de forma determinista.",
            'work-amc-desc': "Esto se trata simplemente de destruir un poco el Real Conservatorio Superior de Música de Madrid.",
            'work-espontanea-desc': "Algunos pies de foto publicados en una cuenta privada de Instagram verbalizaban muchos pensamientos que yo aún no había sido capaz de formular.",
            'work-minuit-desc': "Ganador del II Premio de Composición TZ-RCSMM. Estrenado por el Trío Arbós en el Teatro de la Zarzuela.",
            'work-cisne-desc': "Una pieza de performance estrenada en la Sala 400 del Museo Reina Sofía basada en textos de Dionisio Cañas.",
            cvLink: "CVs/CV_Español.pdf"
        }
    };

    function updateLanguage(lang) {
        if (!lang) return;
        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang); // Guardar preferencia

        const aboutTextDiv = document.querySelector('.about-text');
        const cvBtn = document.querySelector('.btn-cv');
        const switcher = document.getElementById('langSwitcher');

        // Actualizar biografía
        if (aboutTextDiv && translations[lang]) {
            aboutTextDiv.innerHTML = translations[lang].about.map(p => `<p>${p}</p>`).join('');
        }

        // Actualizar botón CV
        if (cvBtn && translations[lang]) {
            cvBtn.textContent = translations[lang].cv;
            cvBtn.href = translations[lang].cvLink;
        }

        // --- Traducir UI de Works ---
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // --- Animación del Switcher (Pill Slider) ---
        if (switcher) {
            const options = switcher.querySelectorAll('.lang-option');
            const slider = switcher.querySelector('.lang-slider');
            const activeOption = lang === 'en' ? options[0] : options[1];

            if (activeOption && slider) {
                slider.style.width = activeOption.offsetWidth + 'px';
                slider.style.left = activeOption.offsetLeft + 'px';

                options[0].classList.toggle('active', lang === 'en');
                options[1].classList.toggle('active', lang === 'es');
            }
        }

        // Si estamos en la sección de works, forzar re-render de las descripciones
        if (document.getElementById('foryou-view')?.classList.contains('active')) {
            renderForYou();
        }
    }

    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', (e) => {
            e.preventDefault();
            const nextLang = currentLang === 'en' ? 'es' : 'en';
            updateLanguage(nextLang);
        });
    }



    // --- FORCE POINTS SPAWNER ---
    let forcePoints = [];
    function manageForcePoints() {
        // Probabilidad del 0.5% por frame de generar un punto de repulsión
        // Aumento de probabilidad al 2% por frame y permitimos hasta 5 puntos simultáneos
        if (Math.random() < 0.02 && forcePoints.length < 5) {
            forcePoints.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: 10 + Math.random() * 15,
                strength: 10 + Math.random() * 10,
                life: 0, // Empieza en 0 para el fade-in
                targetLife: 1.0,
                isFadingIn: true,
                decay: 0.01 + Math.random() * 0.015
            });
        }
        // Actualizar vida y limpiar puntos muertos
        forcePoints = forcePoints.filter(fp => {
            if (fp.isFadingIn) {
                fp.life += 0.1; // Fade in rápido pero suave
                if (fp.life >= fp.targetLife) {
                    fp.life = fp.targetLife;
                    fp.isFadingIn = false;
                }
            } else {
                fp.life -= fp.decay;
            }
            return fp.life > 0;
        });
    }

    class Particle {
        constructor(x, y, targetAlpha) {
            this.targetX = x;
            this.targetY = y;
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = 0;
            this.vy = 0;
            this.size = 1.5;
            this.alpha = 0.01; // Empezar con un poco de alpha para asegurar visibilidad inicial
            this.targetAlpha = targetAlpha;
        }
        update() {
            // Repulsión de los Force Points (solo en Home)
            if (currentSectionIndex === 0) {
                forcePoints.forEach(fp => {
                    const dx = this.x - fp.x;
                    const dy = this.y - fp.y;
                    const distSq = dx * dx + dy * dy;
                    const radSq = fp.radius * fp.radius;

                    if (distSq < radSq) {
                        const dist = Math.sqrt(distSq);
                        const force = (1 - dist / fp.radius) * fp.strength * fp.life;
                        this.vx += (dx / dist) * force;
                        this.vy += (dy / dist) * force;
                    }
                });
            }

            // Aplicar velocidad e inercia
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.9;
            this.vy *= 0.9;

            if (currentSectionIndex === 0) {
                // Si es la primera vez que carga la web en Home, usamos los valores elegantes pero no excesivamente lentos al final
                // Si estamos volviendo de otra sección, usamos los valores rápidos (0.08 y 0.04)
                const easeFactor = isInitialHomeAnimation ? 0.022 : 0.08;
                const alphaIncrement = isInitialHomeAnimation ? 0.01 : 0.04;

                this.x += (this.targetX - this.x) * easeFactor;
                this.y += (this.targetY - this.y) * easeFactor;

                // Fade in
                if (this.alpha < this.targetAlpha) {
                    this.alpha += alphaIncrement;
                    if (this.alpha > this.targetAlpha) this.alpha = this.targetAlpha;
                }
            } else {
                // EFECTO "DESHACERSE": Dispersión y fade out rápido
                // Añadimos una dirección de deriva aleatoria para cada partícula
                this.vx += (Math.random() - 0.5) * 1.5;
                this.vy += (Math.random() - 0.5) * 1.5;

                // Fade out mucho más rápido
                this.alpha -= 0.04;
                if (this.alpha < 0) this.alpha = 0;
            }
        }
        draw() {
            if (this.alpha <= 0) return;

            const drawX = Math.round(this.x);
            const drawY = Math.round(this.y);

            // Modo normal: Punto/Rectángulo nítido
            bgCtx.fillStyle = `rgba(0, 0, 255, ${this.alpha})`;
            bgCtx.fillRect(drawX, drawY, Math.round(this.size), Math.round(this.size * 2));
        }
    }

    function initParticles() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        let fontSize = w / 4.0;
        const fontStr = `900 ${fontSize}px "Climate Crisis"`;

        // Verificación estricta: solo procedemos si la fuente exacta está cargada
        if (!document.fonts.check(fontStr)) {
            document.fonts.load(fontStr).then(() => initParticles());
            return;
        }

        particlesArray = [];
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tCtx = tempCanvas.getContext('2d');

        tCtx.font = fontStr;
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'middle';
        const lineHeight = fontSize * 0.95;
        tCtx.fillStyle = 'blue';

        const totalLines = 6;
        const headerOffset = 30; // Un poco menos de offset para centrar mejor entre header y fondo
        const startY = (h / 2 - (lineHeight * (totalLines - 1)) / 2) + headerOffset;
        for (let i = 0; i < totalLines; i++) {
            tCtx.fillText('ADRI', w / 2, startY + i * lineHeight);
        }

        const data = tCtx.getImageData(0, 0, w, h).data;
        const vpX = w / 2;
        const vpY = h / 10;

        // Definimos las 3 capas: 0 (principal), 1 y 2 (fondo)
        const layers = [
            { step: 4, alpha: 0.5, factor: 0 },    // Capa principal nítida
            { step: 10, alpha: 0.15, factor: 0.2 }, // Fondo 1: menos denso y más transparente
            { step: 18, alpha: 0.08, factor: 0.4 }  // Fondo 2: muy disperso y casi invisible
        ];

        layers.forEach(layer => {
            for (let y = 0; y < h; y += layer.step) {
                for (let x = 0; x < w; x += layer.step) {
                    if (data[(y * 4 * w) + (x * 4) + 3] > 128) {
                        const vecX = vpX - x;
                        const vecY = vpY - y;
                        const finalX = x + vecX * layer.factor;
                        const finalY = y + vecY * layer.factor;
                        particlesArray.push(new Particle(finalX, finalY, layer.alpha));
                    }
                }
            }
        });
    }

    // --- 3D MODEL TEXTURE ---
    const modelViewer = document.getElementById('logo3d');
    if (modelViewer) modelViewer.orientation = "0deg 0deg 80deg";

    function applyModelTexture() {
        if (!modelViewer.model) return;
        const material = modelViewer.model.materials[0];
        const canvas = document.createElement("canvas");
        canvas.width = 1024; canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 400; i++) {
            ctx.beginPath();
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 150 + 20;
            ctx.moveTo(x, y);
            ctx.lineTo(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size);
            ctx.lineTo(x + (Math.random() - 0.5) * size, y + (Math.random() - 0.5) * size);
            ctx.closePath();
            ctx.fillStyle = `rgba(0, 0, 255, ${Math.random() * 0.5 + 0.5})`;
            ctx.fill();
        }

        modelViewer.createTexture(canvas.toDataURL()).then(texture => {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
            material.pbrMetallicRoughness.setRoughnessFactor(0.3);
            material.pbrMetallicRoughness.setMetallicFactor(0.1);
        });
    }

    modelViewer.addEventListener('load', applyModelTexture);

    // --- TOPOLOGICAL WAVES ---
    let topoTime = 0;
    function drawTopoLines() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const numRings = 6; // Mobile-friendly ring count
        bgCtx.save();
        bgCtx.lineWidth = 1.5;

        const centerX = w / 2;
        const centerY = h / 2;

        for (let i = 0; i < numRings; i++) {
            bgCtx.beginPath();
            bgCtx.strokeStyle = `rgba(0, 80, 255, ${0.05 + (i * 0.015)})`;

            const baseRadius = (h / 6) * (i + 1);
            const driftX = Math.sin(topoTime * 0.5 + i) * 40;
            const driftY = Math.cos(topoTime * 0.3 + i * 1.5) * 30;

            const angleStep = 0.3; // Mobile-friendly angle step
            for (let angle = 0; angle <= Math.PI * 2; angle += angleStep) {
                const distortion1 = Math.sin(angle * 3 + topoTime + i) * 20;
                const distortion2 = Math.cos(angle * 5 - topoTime * 0.8) * 15;
                const distortion3 = Math.sin(angle * 2 + topoTime * 0.4 + i * 2) * 30;
                const r = baseRadius + distortion1 + distortion2 + distortion3;
                const x = (centerX + driftX) + Math.cos(angle) * r;
                const y = (centerY + driftY) + Math.sin(angle) * r;
                if (angle === 0) bgCtx.moveTo(x, y);
                else bgCtx.lineTo(x, y);
            }
            bgCtx.closePath();
            bgCtx.stroke();
        }
        bgCtx.restore();
    }

    // --- ANIMATION LOOP ---
    function animate() {
        // Limpiamos el área total para evitar rastros
        bgCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        topoTime += 0.01; // Update wave animation time
        drawTopoLines();
        manageForcePoints(); // Procesar puntos de repulsión esporádicos

        // Renderizar partículas
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // --- WORKS DATA ---
    const worksData = [
        { id: 'personas', title: 'PERSONAS QUE QUIZÁ CONOZCAS', year: 2025, category: 'full-lenght', thumbnail: 'images/PQQC-Thumbnail.png', video: 'videos/compressed/9.mp4', desc: 'work-personas-desc' },
        { id: 'ebdvp', title: 'IN SEARCH OF THE PERFECT VIDEO', year: 2025, category: 'just-sound', thumbnail: 'images/EBDVP-Thumbnail.png', video: 'videos/compressed/5.mp4', desc: 'work-ebdvp-desc' },
        { id: 'pianogames', title: 'PIANOGAMES', year: 2025, category: 'multimedia', thumbnail: 'images/Pianogames-Thumbnail.png', video: 'videos/compressed/2.mp4', desc: 'work-pianogames-desc' },
        { id: 'rumble', title: 'RUMBLE', year: 2025, category: 'just-sound', thumbnail: 'images/Rumble-Thumbnail.png', video: 'videos/compressed/4.mp4', desc: 'work-rumble-desc' },
        { id: 'osc', title: 'OSC PROTOCOL', year: 2024, category: 'just-sound', thumbnail: 'images/OSC-Protocol-Thumbnail.png', video: 'videos/compressed/6.mp4', desc: 'work-osc-desc' },
        { id: 'three-years', title: 'THREE YEARS OF EVOLUTION', year: 2024, category: 'multimedia', thumbnail: 'images/TYoE-Thumbnail.png', video: 'videos/compressed/1.mp4', desc: 'work-tyoe-desc' },
        { id: 'game-of-life', title: 'GAME OF LIFE', year: 2024, category: 'others', thumbnail: 'images/Game-Of-Life-Thumbnail.png', video: 'videos/compressed/3.mp4', desc: 'work-life-desc' },
        { id: 'another-music', title: 'ANOTHER MUSIC CONSERVATORY', year: 2024, category: 'multimedia', thumbnail: 'images/AMC-Thumbnail-1-p-1080.png', video: 'videos/compressed/8.mp4', desc: 'work-amc-desc' },
        { id: 'lespontanea', title: 'lespontanea', year: 2023, category: 'just-sound', thumbnail: 'images/lespontanea-Thumbnail.png', video: 'videos/compressed/7.mp4', desc: 'work-espontanea-desc' },
        { id: 'minuit', title: 'MINUIT TOUJOURS ARRIVE', year: 2023, category: 'just-sound', thumbnail: 'images/Minuit-Toujours-Arrive-Thumbnail.png', video: '', desc: 'work-minuit-desc' },
        { id: 'cisne', title: 'CISNE Y CERDO', year: 2022, category: 'just-sound', thumbnail: 'images/Cisne-y-Cerdo-Thumbnail.png', video: '', desc: 'work-cisne-desc' }
    ];

    const forYouView = document.getElementById('foryou-view');
    const catalogueGrid = document.querySelector('.catalogue-grid');

    function renderForYou() {
        if (!forYouView) return;

        // Sincronizar con el orden exacto del ordenador
        const forYouOrder = [
            'three-years',
            'pianogames',
            'game-of-life',
            'rumble',
            'ebdvp',
            'osc',
            'lespontanea',
            'another-music'
        ];

        // Filtrar y ordenar según la lista anterior
        const videoWorks = forYouOrder
            .map(id => worksData.find(w => w.id === id))
            .filter(w => w && w.video);

        if (videoWorks.length === 0) return;

        // --- OPTIMIZACIÓN: Solo renderizar si está vacío ---
        if (forYouView.children.length > 0) return;

        // Clonamos para el bucle infinito
        const displayWorks = [
            videoWorks[videoWorks.length - 1],
            ...videoWorks,
            videoWorks[0]
        ];

        forYouView.innerHTML = displayWorks.map(work => `
            <div class="foryou-card">
                <div class="video-loader"></div>
                <div class="foryou-video-container">
                    <video data-src="${work.video}" loop ${isMuted ? 'muted' : ''} playsinline preload="auto"></video>
                </div>
                <div class="foryou-content">
                    <h3 class="foryou-title">${work.title}</h3>
                </div>
                <a href="works/viewer_tablet.html?work=${work.id}" class="foryou-link" style="position:absolute; inset:0; z-index:5;"></a>
            </div>
        `).join('');

        // Posicionar en el primer elemento real al inicio (Solo la primera vez)
        setTimeout(() => {
            forYouView.scrollTo({ top: forYouView.clientHeight, behavior: 'instant' });
        }, 10);

        // Intersection Observer con rootMargin para pre-carga predictiva
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                const loader = entry.target.querySelector('.video-loader');

                const isWorksActive = (sectionsIds[currentSectionIndex] === 'works');
                const isForYouActive = isWorksActive && (document.getElementById('foryou-view')?.classList.contains('active'));

                if (entry.isIntersecting) {
                    // 1. CARGA (Pre-load)
                    if (!video.src) {
                        video.onplaying = () => {
                            video.classList.add('playing');
                            if (loader) loader.classList.remove('visible');
                        };

                        video.onwaiting = () => {
                            if (loader) loader.classList.add('visible');
                        };

                        video.oncanplay = () => {
                            if (loader) loader.classList.remove('visible');
                            if (entry.intersectionRatio > 0.6 && isForYouActive) {
                                video.muted = isMuted;
                                video.play().catch(() => {
                                    video.muted = true;
                                    video.play().catch(() => { });
                                });
                            }
                        };

                        video.src = video.getAttribute('data-src');
                        video.load();
                    }

                    // 2. PRIORIDAD (Play)
                    if (entry.intersectionRatio > 0.6 && isForYouActive) {
                        video.muted = isMuted;
                        const playPromise = video.play();

                        if (playPromise !== undefined) {
                            playPromise.catch(() => {
                                if (!video.muted) {
                                    video.muted = true;
                                    video.play().catch(() => { });
                                }
                            });
                        }

                        if (video.readyState < 3 && !video.classList.contains('playing')) {
                            if (loader) loader.classList.add('visible');
                        }
                    } else {
                        video.pause();
                        video.muted = true;
                    }

                    if (video.classList.contains('playing') && loader) {
                        loader.classList.remove('visible');
                    }

                } else {
                    video.pause();
                    video.muted = true;
                }
            });
        }, {
            threshold: [0, 0.6, 0.9],
            rootMargin: '100% 0px'
        });

        document.querySelectorAll('.foryou-card').forEach(card => observer.observe(card));
    }

    // Lógica de bucle infinito (Silenciosa)
    if (forYouView) {
        let scrollTimeout;
        forYouView.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = forYouView;

            // 1. Lógica de bucle
            if (scrollTop >= scrollHeight - clientHeight) {
                forYouView.scrollTo({ top: clientHeight, behavior: 'instant' });
            }
            else if (scrollTop <= 0) {
                forYouView.scrollTo({ top: scrollHeight - 2 * clientHeight, behavior: 'instant' });
            }

            // 2. Sincronizar audio en cada pequeño paso del scroll (si el audio está ON)
            if (!isMuted) {
                // Usamos requestAnimationFrame para no saturar
                cancelAnimationFrame(scrollTimeout);
                scrollTimeout = requestAnimationFrame(() => syncAudioState(isMuted));
            }
        });
    }

    function renderCatalogue(filter = 'all') {
        if (!catalogueGrid) return;

        const filtered = filter === 'all' ? worksData : worksData.filter(w => w.category === filter);

        // Agrupar por año
        const years = [...new Set(filtered.map(w => w.year))].sort((a, b) => b - a);

        let html = '';
        years.forEach(year => {
            html += `<h2 class="year-header">${year}</h2>`;
            filtered.filter(w => w.year === year).forEach(work => {
                html += `
                    <a href="works/viewer_tablet.html?work=${work.id}" class="catalogue-item">
                        <div class="catalogue-thumb">
                            <img src="${work.thumbnail}" alt="${work.title}">
                        </div>
                        <span class="catalogue-title">${work.title}</span>
                    </a>
                `;
            });
        });
        catalogueGrid.innerHTML = html;
    }

    // --- Sub-nav Logic ---
    document.querySelectorAll('.works-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            preferredWorksView = view; // Guardar preferencia para futuras visitas

            document.querySelectorAll('.works-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.works-view').forEach(v => v.classList.remove('active'));
            const viewEl = document.getElementById(`${view}-view`);
            if (viewEl) viewEl.classList.add('active');

            if (view === 'foryou') renderForYou();
            else renderCatalogue();

            // Activar audio al interactuar con el menú si estaba silenciado
            if (isMuted) syncAudioState(false);
        });
    });

    // --- Filter Logic ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalogue(btn.getAttribute('data-filter'));

            // Activar audio al interactuar con filtros
            if (isMuted) syncAudioState(false);
        });
    });

    // --- Audio Logic Centralized ---
    function syncAudioState(muted) {
        isMuted = muted;
        const audioToggle = document.getElementById('audio-toggle');
        if (!audioToggle) return;

        const onIcon = audioToggle.querySelector('.speaker-on-icon');
        const offIcon = audioToggle.querySelector('.speaker-off-icon');

        if (isMuted) {
            onIcon.classList.add('hidden');
            offIcon.classList.remove('hidden');
        } else {
            onIcon.classList.remove('hidden');
            offIcon.classList.add('hidden');
        }

        // --- RESTRICCIÓN DE SECCIÓN ---
        const isWorksActive = (sectionsIds[currentSectionIndex] === 'works');
        const isForYouActive = isWorksActive && (document.getElementById('foryou-view')?.classList.contains('active'));

        // Aplicar a vídeos visibles
        const videos = document.querySelectorAll('#foryou-view video');
        const container = document.getElementById('foryou-view');
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const centerPoint = containerRect.top + (containerRect.height / 2);

        videos.forEach(v => {
            const rect = v.getBoundingClientRect();
            const isExactlyVisible = (rect.top <= centerPoint && rect.bottom >= centerPoint);

            if (isExactlyVisible && isForYouActive) {
                // El vídeo del centro debe seguir el estado global solo si estamos en For You
                if (v.muted !== isMuted) {
                    v.muted = isMuted;
                }

                // Si el usuario quiere audio y el vídeo está pausado (por el observer o por el navegador), intentar play
                if (!isMuted && v.paused) {
                    v.play().catch(() => {
                        const playMuted = () => {
                            v.muted = true;
                            v.play().catch(() => { });
                        };
                        playMuted();
                    });
                }
            } else {
                // Silencio absoluto si no es el vídeo central o no estamos en For You
                v.muted = true;
                if (!isExactlyVisible || !isForYouActive) {
                    v.pause(); // Pausar si no es el central o no estamos en la sección para ahorrar recursos
                }
            }
        });
    }

    // --- Audio Toggle Click ---
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            syncAudioState(!isMuted);
        });
    }

    // --- Global "Unmute on first interaction" ---
    // Esto da permiso al navegador para reproducir audio en adelante
    const unlockAudio = () => {
        if (isMuted) {
            syncAudioState(false);
        }
        // Una vez desbloqueado, podríamos quitar el listener si solo queremos que sea la primera vez,
        // pero el usuario pide "cada botón que se pulse", así que lo dejamos o lo aplicamos a botones específicos.
    };

    // Aplicar a los botones principales de la web
    document.querySelectorAll('.nav-link, .nav-btn-logo, .lang-option, .works-nav-item, .filter-btn').forEach(el => {
        el.addEventListener('click', unlockAudio);
    });

    // Helper global para "bendecir" el audio durante el scroll en Safari/iOS
    document.addEventListener('touchstart', () => {
        if (!isMuted) {
            const videos = document.querySelectorAll('#foryou-view video');
            videos.forEach(v => {
                const rect = v.getBoundingClientRect();
                const container = document.getElementById('foryou-view');
                if (!container) return;
                const cRect = container.getBoundingClientRect();
                const cp = cRect.top + (cRect.height / 2);
                if (rect.top <= cp && rect.bottom >= cp) {
                    if (v.muted) v.muted = false;
                }
            });
        }
    }, { passive: true });

    function updateWorksTranslations() {
        // Esta función se llamará cuando cambie el idioma global
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            // Intentar buscar en la lista de traducciones globales de navbar.js o el local
            // Para simplificar, usamos las keys de works que ya extrajimos
            // NOTA: Las descripciones de works están en navbar.js
        });
    }

    // Inicializar vistas
    renderForYou();
    renderCatalogue();

    // --- KEYBOARD CAROUSEL LOGIC ---
    const keyContainer = document.getElementById('key-carousel');
    if (keyContainer) {
        const keyAssets = [
            { src: 'fotos/500x500 (normales)/q.png' },
            { src: 'fotos/500x500 (normales)/w.png' },
            { src: 'fotos/500x500 (normales)/a.png' },
            { src: 'fotos/500x500 (normales)/s.png' },
            { src: 'fotos/500x500 (normales)/p.png' },
            { src: 'fotos/500x500 (normales)/F1.mp4' },
            { src: 'fotos/500x500 (normales)/x.png' },
            { src: 'fotos/500x500 (normales)/ctrl.mp4' },
            { src: 'fotos/500x500 (normales)/z.mp4' },
            { src: 'fotos/500x500 (normales)/F3.mp4' },
            { src: 'fotos/500x500 (normales)/option right.png' },
            { src: 'fotos/500x500 (normales)/F5.png' },
            { src: 'fotos/500x500 (normales)/F11.mp4' }
        ];

        // Shuffle assets initially for random order every time
        keyAssets.sort(() => Math.random() - 0.5);

        let currentKeyIndex = 0;
        const activeKeys = [];

        function createKeyElement(asset) {
            const div = document.createElement('div');
            div.className = 'key-item';

            const isVideo = asset.src.toLowerCase().endsWith('.mp4');

            if (isVideo) {
                const video = document.createElement('video');
                video.src = asset.src;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('preload', 'auto');
                video.setAttribute('autoplay', 'true');

                // Forzar reproducción después de un pequeño delay para que esté en el DOM
                setTimeout(() => {
                    video.play().catch(e => {
                        console.log("Key video autoplay failed, trying load:", e);
                        video.load();
                    });
                }, 50);

                div.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = asset.src;
                div.appendChild(img);
            }
            return div;
        }

        // Inicializar con 5 teclas aleatorias
        for (let i = 0; i < 5; i++) {
            const el = createKeyElement(keyAssets[i]);
            keyContainer.appendChild(el);
            activeKeys.push(el);
        }
        currentKeyIndex = 5;

        setInterval(() => {
            // 1. Obtener la primera tecla y preparar la siguiente
            const firstKey = activeKeys.shift();
            if (!firstKey) return;

            const nextAsset = keyAssets[currentKeyIndex % keyAssets.length];
            const newKey = createKeyElement(nextAsset);

            // Estado inicial de la nueva tecla (invisible al final)
            newKey.style.opacity = '0';
            newKey.style.transform = 'scale(0.8)';
            keyContainer.appendChild(newKey);
            activeKeys.push(newKey);
            currentKeyIndex++;

            // Forzar reflow para asegurar que las transiciones se apliquen
            void newKey.offsetWidth;

            // 2. PASO ÚNICO: Animación simultánea
            // La primera tecla se desliza a la izquierda y desaparece
            firstKey.style.marginLeft = '-55px'; // Ancho (45) + Gap (10)
            firstKey.style.opacity = '0';
            firstKey.style.transform = 'scale(0.8)';

            // La nueva tecla aparece suavemente
            newKey.style.opacity = '1';
            newKey.style.transform = 'scale(1)';

            // 3. Limpieza: Eliminar el elemento del DOM tras la animación
            setTimeout(() => {
                firstKey.remove();
            }, 600);
        }, 3000); // Frecuencia aumentada a 3 segundos
    }

    // --- INITIALIZE ---
    // Definir variables globales del canvas primero
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
    let particlesArray = [];
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
        if (!bgCanvas || !bgCtx) return;
        bgCanvas.width = window.innerWidth * dpr;
        bgCanvas.height = window.innerHeight * dpr;
        bgCanvas.style.width = window.innerWidth + 'px';
        bgCanvas.style.height = window.innerHeight + 'px';
        bgCtx.setTransform(1, 0, 0, 1, 0, 0);
        bgCtx.scale(dpr, dpr);
        bgCtx.imageSmoothingEnabled = false;
        initParticles();
    }

    // Check URL params on load
    const params = new URLSearchParams(window.location.search);
    const initialSection = params.get('section');
    if (initialSection) {
        const index = sectionsIds.indexOf(initialSection);
        if (index !== -1) {
            if (index !== 0) isInitialHomeAnimation = false;
            goToSection(index);
        }
    } else {
        goToSection(0); // Inicialización para que el resto de secciones estén en 'after'
    }

    // Set initial language from local storage or default
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    updateLanguage(savedLang);

    // Inicializar visuales inmediatamente (el modelo y las ondas pueden cargar)
    resizeCanvas(); // initParticles esperará internamente a la fuente de forma estricta
    animate();

    // Re-chequear idioma cuando las fuentes estén listas para asegurar que el pill slider esté en su sitio
    document.fonts.ready.then(() => {
        updateLanguage(savedLang);
    });

    window.addEventListener('resize', resizeCanvas);

    // --- CONTACT FORM HANDLING ---
    const contactForm = document.getElementById('email-form-tablet');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = document.getElementById('submit-btn-tablet');
            const successMsg = document.getElementById('success-message-tablet');
            const errorMsg = document.getElementById('error-message-tablet');
            const originalBtnValue = submitBtn.value;

            // Cambiar estado del botón
            submitBtn.value = "Sending...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Éxito
                    this.style.display = 'none';
                    if (successMsg) successMsg.style.display = 'block';
                    if (errorMsg) errorMsg.style.display = 'none';
                } else {
                    // Error de respuesta
                    if (errorMsg) errorMsg.style.display = 'block';
                }
            } catch (error) {
                // Error de red
                console.error("Form submission error:", error);
                if (errorMsg) errorMsg.style.display = 'block';
            } finally {
                // Restaurar botón si no hubo éxito (o si queremos permitir re-envío)
                if (this.style.display !== 'none') {
                    submitBtn.value = originalBtnValue;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});