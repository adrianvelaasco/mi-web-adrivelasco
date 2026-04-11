document.addEventListener('DOMContentLoaded', () => {
    const spots = document.querySelectorAll('.spot');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    const pairedInstruments = {
        'contrabassoon': 'bassoon',
        'bassoon': 'contrabassoon',
        'drum kit': 'percussion',
        'percussion': 'drum kit',
        'theremin': 'piano',
        'piano': 'theremin'
    };

    const textInheritance = {
        'contrabassoon': 'bassoon',
        'drumkit': 'percussion', 
        'theremin': 'piano'
    };

    const musicians = {
        'bassoon': { name: 'Rodrigo Rodrigues', profession: 'Bassoonist' },
        'contrabassoon': { name: 'Rodrigo Rodrigues', profession: 'Contrabassoonist' },
        'flute': { name: 'Giusy Panazador', profession: 'Flutist' },
        'piano': { name: 'Valentina Donato', profession: 'Pianist' },
        'theremin': { name: 'Valentina Donato', profession: 'Thereminist' },
        'percussion': { name: 'Vitalia Agrba', profession: 'Percussionist' },
        'drum kit': { name: 'Vitalia Agrba', profession: 'Drummer' },
        'violin': { name: 'Bahar Erünsal', profession: 'Violinist' }
    };

    const fohProfiles = [
        { id: 'oscar', name: 'Oscar', profession: 'FOH Engineer' },
        { id: 'adri', name: 'Adri', profession: 'System Tech / FOH' },
        { id: 'isay', name: 'Isay', profession: 'Lighting / FOH' }
    ];
    let currentFohIndex = 0;

    const carouselControls = document.getElementById('carousel-controls');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselDots = document.getElementById('carousel-dots');
    
    const btnListening = document.getElementById('btn-listening');
    const btnEnsemble = document.getElementById('btn-ensemble');

    // Real-time synchronization
    let currentFirebaseUnsubscribe = null;

    function formatText(text) {
        if (!text) return "";
        return text.split(/\r?\n+/).filter(p => p.trim() !== '').join('<br><br>');
    }

    function syncBio(id, fallbackFile, targetEl) {
        // Cancel previous listener if any
        if (currentFirebaseUnsubscribe) {
            // Unsubscribe logic depends on SDK version, but here we just overwrite old ones
        }

        const dbId = id.replace(' ', '');

        if (window.firebaseDB && window.firebaseRef && window.firebaseOnValue) {
            const profileRef = window.firebaseRef(window.firebaseDB, 'profiles/' + dbId);
            window.firebaseOnValue(profileRef, (snapshot) => {
                const val = snapshot.val();
                if (val) {
                    targetEl.innerHTML = formatText(val);
                } else {
                    // Fallback to text file if no data in Firebase yet
                    fetchBioFromFile(fallbackFile, targetEl);
                }
            });
        } else {
            fetchBioFromFile(fallbackFile, targetEl);
        }
    }

    async function fetchBioFromFile(filename, targetEl) {
        try {
            const response = await fetch('profiles/' + filename);
            if (response.ok) {
                const text = await response.text();
                targetEl.innerHTML = formatText(text);
            } else {
                targetEl.innerText = "No se encontró descripción técnica.";
            }
        } catch (e) {
            targetEl.innerText = "Error al cargar datos.";
        }
    }

    if (btnListening) {
        btnListening.addEventListener('click', () => {
            openSpecialModal('Listening Not Found', 'listeningnotfound');
        });
    }

    if (btnEnsemble) {
        btnEnsemble.addEventListener('click', () => {
            openSpecialModal('Ensemble 404', 'ensemble404');
        });
    }

    function openSpecialModal(title, id) {
        carouselControls.style.display = 'none';
        modalImage.style.display = 'none';
        modalTitle.textContent = title;
        modalDescription.innerHTML = 'Cargando...';
        modalOverlay.classList.add('active');
        
        syncBio(id, id + '.txt', modalDescription);
    }

    async function showFohProfile(index) {
        currentFohIndex = index;
        const profile = fohProfiles[index];
        
        modalTitle.innerHTML = `${profile.name} <span class="profession">${profile.profession}</span>`;
        modalImage.style.backgroundImage = `url('profiles/${profile.id}.jpg')`;
        modalImage.style.display = 'block';
        carouselControls.style.display = 'flex';
        carouselDots.innerHTML = fohProfiles.map((_, i) => `<span class="dot ${i === index ? 'active' : ''}"></span>`).join('');
        
        modalDescription.innerHTML = 'Cargando...';
        syncBio(profile.id, profile.id + '.txt', modalDescription);
    }

    async function openModal(spot) {
        carouselControls.style.display = 'none';
        const title = spot.getAttribute('title');
        const lowerTitle = title.toLowerCase();
        
        if (musicians[lowerTitle]) {
            modalTitle.innerHTML = `${musicians[lowerTitle].name} <span class="profession">${musicians[lowerTitle].profession}</span>`;
        } else {
            modalTitle.textContent = title;
        }
        
        modalDescription.textContent = 'Cargando detalles...';

        if (spot.classList.contains('has-image')) {
            const bgImage = spot.style.backgroundImage;
            const urlMatch = bgImage.match(/url\(["']?([^"']*)["']?\)/);
            if (urlMatch && urlMatch[1]) {
                const imgUrl = urlMatch[1].includes('/listeningnotfound/') ? urlMatch[1].split('/listeningnotfound/').pop() : urlMatch[1];
                modalImage.style.backgroundImage = `url('${imgUrl}')`;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }
        } else {
            modalImage.style.display = 'none';
        }

        modalOverlay.classList.add('active');

        let fileNameBase = title.toLowerCase().replace(/ /g, '');
        if (textInheritance[fileNameBase]) {
            fileNameBase = textInheritance[fileNameBase];
        }
        
        syncBio(fileNameBase, fileNameBase + '.txt', modalDescription);
    }

    const fohBox = document.querySelector('.foh-box');
    if (fohBox) {
        fohBox.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            showFohProfile(0);
        });
    }

    carouselPrev.addEventListener('click', () => {
        let newIndex = currentFohIndex - 1;
        if (newIndex < 0) newIndex = fohProfiles.length - 1;
        const dynamicContent = document.getElementById('modal-dynamic-content');
        dynamicContent.classList.add('slide-out-left');
        setTimeout(async () => {
            await showFohProfile(newIndex);
            dynamicContent.classList.remove('slide-out-left');
            dynamicContent.classList.add('slide-in-right');
            setTimeout(() => dynamicContent.classList.remove('slide-in-right'), 150);
        }, 150);
    });

    carouselNext.addEventListener('click', () => {
        let newIndex = currentFohIndex + 1;
        if (newIndex >= fohProfiles.length) newIndex = 0;
        const dynamicContent = document.getElementById('modal-dynamic-content');
        dynamicContent.classList.add('slide-out-right');
        setTimeout(async () => {
            await showFohProfile(newIndex);
            dynamicContent.classList.remove('slide-out-right');
            dynamicContent.classList.add('slide-in-left');
            setTimeout(() => dynamicContent.classList.remove('slide-in-left'), 150);
        }, 150);
    });

    spots.forEach(spot => {
        spot.addEventListener('click', () => {
            const title = spot.getAttribute('title');
            const lowerTitle = title.toLowerCase();
            if (pairedInstruments[lowerTitle] && !spot.classList.contains('has-image')) {
                const partnerTitleMatch = pairedInstruments[lowerTitle];
                let partnerElement = Array.from(spots).find(s => s.getAttribute('title').toLowerCase() === partnerTitleMatch);
                if (partnerElement && partnerElement.classList.contains('has-image')) {
                    triggerFlight(partnerElement, spot);
                    return;
                }
            }
            openModal(spot);
        });
    });

    closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); });

    spots.forEach(spot => {
        spot.addEventListener('mouseenter', () => spot.style.transform = 'scale(1.1)');
        spot.addEventListener('mouseleave', () => spot.style.transform = '');
    });

    function triggerFlight(sourceEl, targetEl) {
        const pRect = sourceEl.getBoundingClientRect();
        const cRect = targetEl.getBoundingClientRect();
        const originalBg = sourceEl.style.backgroundImage;
        sourceEl.style.backgroundImage = 'none';
        sourceEl.classList.remove('has-image');
        const flyingPhoto = document.createElement('div');
        Object.assign(flyingPhoto.style, {
            position: 'fixed', top: pRect.top + 'px', left: pRect.left + 'px',
            width: pRect.width + 'px', height: pRect.height + 'px',
            backgroundImage: originalBg, backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: '9999',
            transition: 'all 4s ease-in-out', pointerEvents: 'none'
        });
        document.body.appendChild(flyingPhoto);
        flyingPhoto.offsetWidth;
        const randomRotation = Math.random() > 0.5 ? 360 : -360;
        flyingPhoto.style.transform = `translate(${cRect.left - pRect.left}px, ${cRect.top - pRect.top}px) rotate(${randomRotation}deg) scale(1.2)`;
        targetEl.style.pointerEvents = 'none';
        setTimeout(() => {
            flyingPhoto.remove();
            targetEl.style.backgroundImage = originalBg;
            targetEl.classList.add('has-image');
            targetEl.style.pointerEvents = 'auto';
        }, 4100);
    }

    const automaticPairs = [['bassoon', 'contrabassoon'], ['piano', 'theremin'], ['percussion', 'drum kit']];
    function scheduleRandomFlight(pairArr) {
        setTimeout(() => {
            const spotA = Array.from(spots).find(s => s.getAttribute('title').toLowerCase() === pairArr[0]);
            const spotB = Array.from(spots).find(s => s.getAttribute('title').toLowerCase() === pairArr[1]);
            if (spotA && spotB) {
                if (spotA.classList.contains('has-image') && !spotB.classList.contains('has-image')) triggerFlight(spotA, spotB);
                else if (spotB.classList.contains('has-image') && !spotA.classList.contains('has-image')) triggerFlight(spotB, spotA);
            }
            scheduleRandomFlight(pairArr);
        }, Math.random() * 80000 + 40000);
    }
    automaticPairs.forEach(pair => scheduleRandomFlight(pair));
});
