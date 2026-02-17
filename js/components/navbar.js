/**
 * Common Navbar Component
 * Centralizes the HTML structure, translations, and logic for the navigation bar.
 */

(function () {
  const translations = {
    en: {
      'nav-about': 'ABOUT',
      'nav-work': 'WORK',
      'nav-contact': 'CONTACT',
      'p1': 'Adri Velasco (2002, Málaga) is a multimedia artist, composer, and producer based in Hamburg, Germany, where he is pursuing the Master\'s in Multimedia Composition at the Hochschule für Musik und Theater.',
      'p2': 'His work is characterized by a fragmented and maximalist language that investigates the dialogue between contemporary and pop/urban aesthetics. Attentive to the concerns of his generation, he addresses issues related to Internet culture, multiple identities, and privacy in the digital age.',
      'p3': 'His pieces have been performed in renowned venues such as the Auditorio Nacional, the Ateneo de Madrid, the Museo Reina Sofía, the Teatro de la Zarzuela, the Centro Cultural Villa de Nerja, and the Sala Berlanga, among others. He was awarded the 2nd TZ-RCSMM Composition Prize, which led to the premiere of his piece by the Trío Arbós. In addition, his orchestral work Rumble was performed by the Málaga Symphony Orchestra.',
      'p4': 'He has studied with renowned composers such as Fernando Villanueva, José María Sánchez-Verdú, Óscar Escudero, and Enrique Ruedas.',
      'p5': 'Biography expectations: growing by 20% each year',
      'p6': 'He likes penguins.',
      'cv-btn': 'CURRICULUM VITAE',
      'works-catalogue': 'CATALOGUE',
      'works-foryou': 'FOR YOU',
      'filter-all': 'ALL',
      'filter-sound': 'just SOUND',
      'filter-multimedia': 'MULTIMEDIA',
      'filter-full': 'FULL LENGHT',
      'filter-others': 'others',
      'work-tyoe-desc': '“Three Years of Evolution” showcases the intimate and dynamic relationship established between an individual, represented by the trombonist, and the demanding city that will host him for the next three years.<br><br>Independence, far from being an absolute state, becomes a continuous process of negotiation with existing structures. The trombonist presents a personal experience, where the individual matures through the learning that arises from interaction with expectations.',
      'work-pianogames-desc': 'Dear pianist:<br><br>This musical piece, if that’s what it is, aims to be an amusement for your study sessions. Three minigames have been gently crafted to refine certain aspects of your technique in an unusual, perhaps more enjoyable way, on your path toward the virtuoso you have always wished to become.<br><br>Pianogames lives in two versions. There’s the cozy home version and then there’s the concert version: same mini-games now framed by an introduction, an intermezzo, and a closing gesture worthy of the stage.',
      'work-life-desc': 'Game of Life is an adaptation of John Conway’s traditional game. This cellular automaton evolves deterministically according to its initial configuration, without requiring further intervention.<br><br>In this musical recreation, as the board progresses, the sound system responds to the player’s instructions—whether timbral, harmonic, or related to tempo.',
      'work-rumble-desc': 'Rumble, is a piece for symphony orchestra, its title borrowed from the fourth track of Quest For Fire by Skrillex. A constant loop runs throughout, taking on multiple shapes in its various iterations. This loop aims for a linear evolution over the course of the work’s 113 measures, yet it is occasionally disrupted by musical “pop-ups” that interrupt the main discourse.',
      'work-ebdvp-desc': 'Ok, wait, listen to this: there’s a moment. A moment when everything fits. The light. The shadows. The music. The words. You’re there, in front of the screen, and for one tiny yet infinite instant, you feel… something. Not satisfaction. Something much better.<br><br>A spark of electricity rising from your fingers to the back of your head. The perfect video. You did it. It’s real. Here and now.<br><br>But can the magic lasts?',
      'work-espontanea-desc': 'Some captions published on a private Instagram account were verbalizing many thoughts that I hadn\'t yet been able to formulate.<br><br>This piece collects some writings by @rosello.alba, attempting to find that curious point in her texts where the chaotic nature of the micro manages to balance with the coherent nature of the macro, without taking away the work\'s virtue of spontaneity.',
      'work-amc-desc': 'This is simply about messing with the Madrid Royal Conservatory of Music.',
      'work-osc-desc': 'I. Encoded<br>II. 192.168.20.1<br>III. Node with errors inside<br>IV. Received',
      'contact-title': 'Contact',
      'contact-name': 'Name',
      'contact-email': 'Email Address',
      'contact-subject': 'Subject',
      'contact-message': 'Message',
      'submit-btn': 'Send Message',
      'work-personas-title': 'Personas Que Quizá Conozcas',
      'work-personas-desc': 'A collaborative composition by Adri Velasco, Fran Escobar, Alejandro Mondragón, and Alberto Hijón.<br><br>This piece explores the connections and disconnections in the digital age, represented through a multi-layered acoustic and electronic performance.',
      'work-minuit-desc': 'Winner of the II Composition Prize TZ-RCSMM. Premiered by Trio Arbós at Teatro de la Zarzuela. A work that explores the threshold of dawn and the inevitable arrival of midnight.',
      'work-cisne-desc': 'A performance piece premiered at Sala 400 Museo Reina Sofía. Based on the text by Dionisio Cañas, exploring the duality between the sublime and the grotesque.'
    },
    es: {
      'nav-about': 'BIO',
      'nav-work': 'OBRA',
      'nav-contact': 'CONTACTO',
      'p1': 'Adri Velasco (2002, Málaga) es un artista multimedia, compositor y productor afincado en Hamburgo, Alemania, donde cursa el Máster en Composición Multimedia en la Hochschule für Musik und Theater.',
      'p2': 'Su trabajo se caracteriza por un lenguaje fragmentado y maximalista que investiga el diálogo entre la estética contemporánea y la pop/urbana. Atento a las inquietudes de su generación, aborda temas relacionados con la cultura de Internet, las identidades múltiples y la privacidad en la era digital.',
      'p3': 'Sus piezas han sido interpretadas en espacios de renombre como el Auditorio Nacional, el Ateneo de Madrid, el Museo Reina Sofía, el Teatro de la Zarzuela, el Centro Cultural Villa de Nerja y la Sala Berlanga, entre otros. Fue galardonado con el 2º Premio de Composición TZ-RCSMM, lo que llevó al estreno de su pieza por el Trío Arbós. Además, su obra orquestal Rumble fue interpretada por la Orquesta Sinfónica de Málaga.',
      'p4': 'Ha estudiado con compositores de renombre como Fernando Villanueva, José María Sánchez-Verdú, Óscar Escudero y Enrique Ruedas.',
      'p5': 'Expectativas biográficas: creciendo por un 20% cada año',
      'p6': 'Le gustan los pingüinos.',
      'cv-btn': 'CURRÍCULUM VITAE',
      'works-catalogue': 'CATÁLOGO',
      'works-foryou': 'PARA TI',
      'filter-all': 'TODO',
      'filter-sound': 'solo SONIDO',
      'filter-multimedia': 'MULTIMEDIA',
      'filter-full': 'LARGA DURACIÓN',
      'filter-others': 'otros',
      'work-tyoe-desc': '“Three Years of Evolution” muestra la relación íntima y dinámica establecida entre un individuo, representado por el trombonista, y la exigente ciudad que lo acogerá durante los próximos tres años.<br><br>La independencia no es un estado absoluto, sino una negociación continua con las estructuras existentes. El trombonista presenta una experiencia personal, donde el individuo madura a través del aprendizaje que surge de la interacción con las expectativas.',
      'work-pianogames-desc': 'Querido pianista:<br><br>Esta pieza musical, si es que eso es lo que es, pretende ser un divertimento para tus sesiones de estudio. Tres minijuegos han sido delicadamente diseñados para perfeccionar ciertos aspectos de tu técnica de una manera inusual, quizá más amena, en tu camino hacia el virtuoso que siempre has deseado ser.<br><br>Pianogames vive en dos versiones. Está la acogedora versión doméstica y luego está la versión de concierto: los mismos minijuegos ahora enmarcados por una introducción, un intermezzo y un gesto de cierre digno del escenario.',
      'work-life-desc': 'Game of Life es una adaptación del juego tradicional de John Conway. Este autómata celular evoluciona de forma determinista según su configuración inicial, sin requerir intervención posterior.<br><br>En esta recreación musical, a medida que el tablero progresa, el sistema de sonido responde a las instrucciones del intérprete, ya sean tímbricas, armónicas o relacionadas con el tempo.',
      'work-rumble-desc': 'Rumble es una pieza para orquesta sinfónica, cuyo título proviene del cuarto track de Quest For Fire de Skrillex. Un bucle constante recorre toda la obra, adoptando múltiples formas en sus diversas iteraciones. Este bucle busca una evolución lineal a lo largo de los 113 compases de la obra, pero ocasionalmente se ve interrumpido por “pop-ups” musicales que distorsionan el discurso principal.',
      'work-ebdvp-desc': 'Vale, espera, escucha esto: hay un momento. Un momento en el que todo encaja. La luz. Las sombras. La música. Las palabras. Estás ahí, frente a la pantalla, y por un instante diminuto pero infinito, sientes... algo. No satisfacción. Algo mucho mejor.<br><br>Una chispa de electricidad subiendo por tus dedos hasta la nuca. El vídeo perfecto. Lo lograste. Es real. Aquí y ahora.<br><br>Pero, ¿puede durar la magia?',
      'work-espontanea-desc': 'Algunos pies de foto publicados en una cuenta privada de Instagram verbalizaban muchos pensamientos que yo aún no había sido capaz de formular.<br><br>Esta pieza recoge algunos escritos de @rosello.alba, intentando encontrar ese punto curioso en sus textos donde la naturaleza caótica de lo micro consigue equilibrarse con la naturaleza coherente de lo macro, sin quitarle la virtud de la espontaneidad a la obra.',
      'work-amc-desc': 'Esto se trata simplemente de destruir un poco el Real Conservatorio Superior de Música de Madrid.',
      'work-osc-desc': 'I. Encoded<br>II. 192.168.20.1<br>III. Nodo con errores internos<br>IV. Recibido',
      'contact-title': 'Contacto',
      'contact-name': 'Nombre',
      'contact-email': 'Correo electrónico',
      'contact-subject': 'Asunto',
      'contact-message': 'Mensaje',
      'submit-btn': 'Enviar mensaje',
      'work-personas-title': 'Personas Que Quizá Conozcas',
      'work-personas-desc': 'Una composición colaborativa de Adri Velasco, Fran Escobar, Alejandro Mondragón y Alberto Hijón.<br><br>Esta pieza explora las conexiones y desconexiones en la era digital, representadas a través de una interpretación acústica y electrónica multicapa.',
      'work-minuit-desc': 'Ganador del II Premio de Composición TZ-RCSMM. Estrenado por el Trío Arbós en el Teatro de la Zarzuela. Una obra que explora el umbral del alba y la inevitable llegada de la medianoche.',
      'work-cisne-desc': 'Una pieza de performance estrenada en la Sala 400 del Museo Reina Sofía. Basada en textos de Dionisio Cañas, explora la dualidad entre lo sublime y lo grotesco.'
    }
  };

  function getRootPath() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split(/[#?]/)[0]; // Remove hash/query

    // List of files known to be in the root directory
    const rootFiles = [
      'index.html', 'about.html', 'contact.html', 'trabajos.html',
      'index', 'about', 'contact', 'trabajos',
      '' // For directory root /
    ];

    // If the current page is a root file, or the path is just /, use empty string
    if (rootFiles.includes(page) || path === '/' || path.endsWith('/')) {
      return '';
    }

    // Otherwise, assume we are in a subdirectory (like works/)
    return '../';
  }

  const getNavbarTemplate = (currentPage) => {
    const root = getRootPath();

    return `
    <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease"
      data-doc-height="1" role="banner" class="navbar_container shadow-three w-nav">
      <div class="navbar_container2">
        <div class="navbar_logo" style="position: relative; z-index: 2;">
          <a href="${root}index.html?section=home" class="brand-logo-link w-nav-brand ${currentPage === 'index.html' ? 'w--current' : ''}">
            <img loading="lazy" src="${root}images/Logo.png" alt="Adrian Velasco Logo" class="logo">
          </a>
        </div>
        <canvas id="headerArrowCanvas"></canvas>
        <img loading="lazy" src="${root}images/GIF-Header.gif" alt="" class="penguin-gif">
        <nav role="navigation" class="nav_menu_wrapper w-nav-menu">
          <ul role="list" class="nav-menu-two w-list-unstyled">
            <li>
              <a href="${root}index.html?section=about" class="navbar_links ${currentPage === 'about.html' ? 'w--current' : ''}">
                <span class="nav-link-slot">
                  <span>ABOUT</span>
                  <span>BIO</span>
                  <span>ABOUT</span>
                </span>
              </a>
            </li>
            <li>
              <a href="${root}index.html?section=works" class="navbar_links ${currentPage.includes('#works') ? 'w--current' : ''}">
                <span class="nav-link-slot">
                  <span>WORK</span>
                  <span>OBRA</span>
                  <span>WORK</span>
                </span>
              </a>
            </li>
            <li>
              <a href="${root}index.html?section=contact" class="navbar_links ${currentPage === 'contact.html' ? 'w--current' : ''}">
                <span class="nav-link-slot">
                  <span>CONTACT</span>
                  <span>CONTACTO</span>
                  <span>CONTACT</span>
                </span>
              </a>
            </li>
          </ul>
          <div class="social-links-mobile">
             <a href="https://www.instagram.com/adrivelaasco/" target="_blank" class="social-medias w-nav-brand">
              <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@adrivelaasco" target="_blank" class="social-medias w-nav-brand">
              <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </svg>
            </a>
            <a href="https://soundcloud.com/adrivelaasco" target="_blank" class="social-medias w-nav-brand">
              <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="-271 345.8 256 111.2" fill="currentColor">
                <g>
                  <path d="M-238.4,398.1c-0.8,0-1.4,0.6-1.5,1.5l-2.3,28l2.3,27.1c0.1,0.8,0.7,1.5,1.5,1.5c0.8,0,1.4-0.6,1.5-1.5l2.6-27.1l-2.6-28C-237,398.7-237.7,398.1-238.4,398.1z" />
                  <path d="M-228.2,399.9c-0.9,0-1.7,0.7-1.7,1.7l-2.1,26l2.1,27.3c0.1,1,0.8,1.7,1.7,1.7c0.9,0,1.6-0.7,1.7-1.7l2.4-27.3l-2.4-26C-226.6,400.6-227.3,399.9-228.2,399.9z" />
                  <path d="M-258.6,403.5c-0.5,0-1,0.4-1.1,1l-2.5,23l2.5,22.5c0.1,0.6,0.5,1,1.1,1c0.5,0,1-0.4,1.1-1l2.9-22.5l-2.9-23C-257.7,404-258.1,403.5-258.6,403.5z" />
                  <path d="M-268.1,412.3c-0.5,0-1,0.4-1,1l-1.9,14.3l1.9,14c0.1,0.6,0.5,1,1,1s0.9-0.4,1-1l2.2-14l-2.2-14.2C-267.2,412.8-267.6,412.3-268.1,412.3z" />
                  <path d="M-207.5,373.5c-1.2,0-2.1,0.9-2.2,2.1l-1.9,52l1.9,27.2c0.1,1.2,1,2.1,2.2,2.1s2.1-0.9,2.2-2.1l2.1-27.2l-2.1-52C-205.4,374.4-206.4,373.5-207.5,373.5z" />
                  <path d="M-248.6,399c-0.7,0-1.2,0.5-1.3,1.3l-2.4,27.3l2.4,26.3c0.1,0.7,0.6,1.3,1.3,1.3c0.7,0,1.2-0.5,1.3-1.2l2.7-26.3l-2.7-27.3C-247.4,399.6-247.9,399-248.6,399z" />
                  <path d="M-217.9,383.4c-1,0-1.9,0.8-1.9,1.9l-2,42.3l2,27.3c0.1,1.1,0.9,1.9,1.9,1.9s1.9-0.8,1.9-1.9l2.3-27.3l-2.3-42.3C-216,384.2-216.9,383.4-217.9,383.4z" />
                  <path d="M-154.4,359.3c-1.8,0-3.2,1.4-3.2,3.2l-1.2,65l1.2,26.1c0,1.8,1.5,3.2,3.2,3.2c1.8,0,3.2-1.5,3.2-3.2l1.4-26.1l-1.4-65C-151.1,360.8-152.6,359.3-154.4,359.3z" />
                  <path d="M-197.1,368.9c-1.3,0-2.3,1-2.4,2.4l-1.8,56.3l1.8,26.9c0,1.3,1.1,2.3,2.4,2.3s2.3-1,2.4-2.4l2-26.9l-2-56.3C-194.7,370-195.8,368.9-197.1,368.9z" />
                  <path d="M-46.5,394c-4.3,0-8.4,0.9-12.2,2.4C-61.2,368-85,345.8-114,345.8c-7.1,0-14,1.4-20.1,3.8c-2.4,0.9-3,1.9-3,3.7v99.9c0,1.9,1.5,3.5,3.4,3.7c0.1,0,86.7,0,87.3,0c17.4,0,31.5-14.1,31.5-31.5C-15,408.1-29.1,394-46.5,394z" />
                  <path d="M-143.6,353.2c-1.9,0-3.4,1.6-3.5,3.5l-1.4,70.9l1.4,25.7c0,1.9,1.6,3.4,3.5,3.4c1.9,0,3.4-1.6,3.5-3.5l1.5-25.8l-1.5-70.9C-140.2,354.8-141.7,353.2-143.6,353.2z" />
                  <path d="M-186.5,366.8c-1.4,0-2.5,1.1-2.6,2.6l-1.6,58.2l1.6,26.7c0,1.4,1.2,2.6,2.6,2.6s2.5-1.1,2.6-2.6l1.8-26.7l-1.8-58.2C-184,367.9-185.1,366.8-186.5,366.8z" />
                  <path d="M-175.9,368.1c-1.5,0-2.8,1.2-2.8,2.8l-1.5,56.7l1.5,26.5c0,1.6,1.3,2.8,2.8,2.8s2.8-1.2,2.8-2.8l1.7-26.5l-1.7-56.7C-173.1,369.3-174.3,368.1-175.9,368.1z" />
                  <path d="M-165.2,369.9c-1.7,0-3,1.3-3,3l-1.4,54.7l1.4,26.3c0,1.7,1.4,3,3,3c1.7,0,3-1.3,3-3l1.5-26.3l-1.5-54.7C-162.2,371.3-163.5,369.9-165.2,369.9z" />
                </g>
              </svg>
            </a>
            <a href="https://www.patreon.com/c/adrivelaasco" target="_blank" class="social-medias w-nav-brand">
              <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                <path d="M512 194.8c0 101.3-82.4 183.8-183.8 183.8-101.7 0-184.4-82.4-184.4-183.8 0-101.6 82.7-184.3 184.4-184.3C429.6 10.5 512 93.2 512 194.8zM0 501.5h90v-491H0v491z" />
              </svg>
            </a>
          </div>
        </nav>
        
        <div class="lang-switcher-wrapper">
            <div class="lang-switcher" id="langSwitcher" style="animation: slotIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards; opacity: 0;">
            <div class="lang-slider"></div>
            <div class="lang-option active">EN</div>
            <div class="lang-option">ES</div>
            </div>
        </div>
        
        <div class="header-right-group">
            
            <div class="social-links-desktop">
                <a href="https://www.instagram.com/adrivelaasco/" target="_blank" class="social-medias w-nav-brand">
                    <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                </a>
                <a href="https://www.youtube.com/@adrivelaasco" target="_blank" class="social-medias w-nav-brand">
                    <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                    </svg>
                </a>
                <a href="https://soundcloud.com/adrivelaasco" target="_blank" class="social-medias w-nav-brand">
                    <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="-271 345.8 256 111.2" fill="currentColor">
                    <g>
                        <path d="M-238.4,398.1c-0.8,0-1.4,0.6-1.5,1.5l-2.3,28l2.3,27.1c0.1,0.8,0.7,1.5,1.5,1.5c0.8,0,1.4-0.6,1.5-1.5l2.6-27.1l-2.6-28C-237,398.7-237.7,398.1-238.4,398.1z" />
                        <path d="M-228.2,399.9c-0.9,0-1.7,0.7-1.7,1.7l-2.1,26l2.1,27.3c0.1,1,0.8,1.7,1.7,1.7c0.9,0,1.6-0.7,1.7-1.7l2.4-27.3l-2.4-26C-226.6,400.6-227.3,399.9-228.2,399.9z" />
                        <path d="M-258.6,403.5c-0.5,0-1,0.4-1.1,1l-2.5,23l2.5,22.5c0.1,0.6,0.5,1,1.1,1c0.5,0,1-0.4,1.1-1l2.9-22.5l-2.9-23C-257.7,404-258.1,403.5-258.6,403.5z" />
                        <path d="M-268.1,412.3c-0.5,0-1,0.4-1,1l-1.9,14.3l1.9,14c0.1,0.6,0.5,1,1,1s0.9-0.4,1-1l2.2-14l-2.2-14.2C-267.2,412.8-267.6,412.3-268.1,412.3z" />
                        <path d="M-207.5,373.5c-1.2,0-2.1,0.9-2.2,2.1l-1.9,52l1.9,27.2c0.1,1.2,1,2.1,2.2,2.1s2.1-0.9,2.2-2.1l2.1-27.2l-2.1-52C-205.4,374.4-206.4,373.5-207.5,373.5z" />
                        <path d="M-248.6,399c-0.7,0-1.2,0.5-1.3,1.3l-2.4,27.3l2.4,26.3c0.1,0.7,0.6,1.3,1.3,1.3c0.7,0,1.2-0.5,1.3-1.2l2.7-26.3l-2.7-27.3C-247.4,399.6-247.9,399-248.6,399z" />
                        <path d="M-217.9,383.4c-1,0-1.9,0.8-1.9,1.9l-2,42.3l2,27.3c0.1,1.1,0.9,1.9,1.9,1.9s1.9-0.8,1.9-1.9l2.3-27.3l-2.3-42.3C-216,384.2-216.9,383.4-217.9,383.4z" />
                        <path d="M-154.4,359.3c-1.8,0-3.2,1.4-3.2,3.2l-1.2,65l1.2,26.1c0,1.8,1.5,3.2,3.2,3.2c1.8,0,3.2-1.5,3.2-3.2l1.4-26.1l-1.4-65C-151.1,360.8-152.6,359.3-154.4,359.3z" />
                        <path d="M-197.1,368.9c-1.3,0-2.3,1-2.4,2.4l-1.8,56.3l1.8,26.9c0,1.3,1.1,2.3,2.4,2.3s2.3-1,2.4-2.4l2-26.9l-2-56.3C-194.7,370-195.8,368.9-197.1,368.9z" />
                        <path d="M-46.5,394c-4.3,0-8.4,0.9-12.2,2.4C-61.2,368-85,345.8-114,345.8c-7.1,0-14,1.4-20.1,3.8c-2.4,0.9-3,1.9-3,3.7v99.9c0,1.9,1.5,3.5,3.4,3.7c0.1,0,86.7,0,87.3,0c17.4,0,31.5-14.1,31.5-31.5C-15,408.1-29.1,394-46.5,394z" />
                        <path d="M-143.6,353.2c-1.9,0-3.4,1.6-3.5,3.5l-1.4,70.9l1.4,25.7c0,1.9,1.6,3.4,3.5,3.4c1.9,0,3.4-1.6,3.5-3.5l1.5-25.8l-1.5-70.9C-140.2,354.8-141.7,353.2-143.6,353.2z" />
                        <path d="M-186.5,366.8c-1.4,0-2.5,1.1-2.6,2.6l-1.6,58.2l1.6,26.7c0,1.4,1.2,2.6,2.6,2.6s2.5-1.1,2.6-2.6l1.8-26.7l-1.8-58.2C-184,367.9-185.1,366.8-186.5,366.8z" />
                        <path d="M-175.9,368.1c-1.5,0-2.8,1.2-2.8,2.8l-1.5,56.7l1.5,26.5c0,1.6,1.3,2.8,2.8,2.8s2.8-1.2,2.8-2.8l1.7-26.5l-1.7-56.7C-173.1,369.3-174.3,368.1-175.9,368.1z" />
                        <path d="M-165.2,369.9c-1.7,0-3,1.3-3,3l-1.4,54.7l1.4,26.3c0,1.7,1.4,3,3,3c1.7,0,3-1.3,3-3l1.5-26.3l-1.5-54.7C-162.2,371.3-163.5,369.9-165.2,369.9z" />
                    </g>
                    </svg>
                </a>
                <a href="https://www.patreon.com/c/adrivelaasco" target="_blank" class="social-medias w-nav-brand">
                    <svg class="navbar_links" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M512 194.8c0 101.3-82.4 183.8-183.8 183.8-101.7 0-184.4-82.4-184.4-183.8 0-101.6 82.7-184.3 184.4-184.3C429.6 10.5 512 93.2 512 194.8zM0 501.5h90v-491H0v491z" />
                    </svg>
                </a>
            </div>
            
            <div class="menu_button w-nav-button">
            <div class="icon-2 w-icon-nav-menu"></div>
            </div>
        </div>
      </div>
    </div>

  `;
  };

  /** Internal translation update function **/
  let internalUpdateLanguage;

  function initNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    placeholder.innerHTML = getNavbarTemplate(currentPage);

    // Initialize Language Switcher
    initLanguageSwitcher();

    // Initialize Arrow Animation if canvas exists
    if (document.getElementById('headerArrowCanvas')) {
      initArrowAnimation();
    }
  }

  function initLanguageSwitcher() {
    let isTransitioning = false;

    const updateLanguage = (lang, isInitial = false) => {
      // Prevent overlapping transitions
      if (isTransitioning) return;
      if (!isInitial) isTransitioning = true;

      document.documentElement.setAttribute('lang', lang);
      localStorage.setItem('preferredLanguage', lang);

      document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (translations[lang] && translations[lang][key]) {
          let content = translations[lang][key];
          // Responsive rename for CV button: Use "CV" if screen is narrow (split screen/tablet)
          if (key === 'cv-btn' && window.innerWidth <= 991) {
            content = 'CV';
          }
          el.innerHTML = content;
        }
      });

      const switcher = document.getElementById('langSwitcher');
      const navSlots = document.querySelectorAll('.nav-link-slot');
      const contactSlots = document.querySelectorAll('.contact-title-slot');
      const allSlots = [...navSlots, ...contactSlots];

      if (switcher) {
        const options = switcher.querySelectorAll('.lang-option');
        const slider = switcher.querySelector('.lang-slider');
        const activeOption = lang === 'en' ? options[0] : options[1];

        // Dynamic slider sizing and positioning
        slider.style.width = activeOption.offsetWidth + 'px';
        slider.style.left = activeOption.offsetLeft + 'px';

        options[0].classList.toggle('active', lang === 'en');
        options[1].classList.toggle('active', lang === 'es');
      }

      allSlots.forEach(slot => {
        const spans = slot.querySelectorAll('span');
        const targetSpan = (lang === 'es') ? spans[1] : spans[0];

        const targetWidth = targetSpan.offsetWidth;
        slot.style.width = targetWidth + 'px';

        if (lang === 'es') {
          if (isInitial) {
            slot.classList.add('no-transition', 'to-es');
            setTimeout(() => slot.classList.remove('no-transition'), 50);
          } else {
            slot.classList.remove('no-transition', 'to-en');
            slot.classList.add('to-es');
            setTimeout(() => { isTransitioning = false; }, 650);
          }
        } else {
          if (isInitial) {
            slot.classList.add('no-transition');
            slot.classList.remove('to-es', 'to-en');
            setTimeout(() => slot.classList.remove('no-transition'), 50);
          } else {
            slot.classList.add('to-en');
            setTimeout(() => {
              slot.classList.add('no-transition');
              slot.classList.remove('to-es', 'to-en');
              slot.offsetHeight; // Force reflow
              slot.classList.remove('no-transition');
              isTransitioning = false;
            }, 600);
          }
        }
      });

      // Notify external observers
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

      window.dispatchEvent(new Event('resize'));
    };

    // Save for external use
    internalUpdateLanguage = updateLanguage;

    const savedLang = localStorage.getItem('preferredLanguage') || 'en';

    // Apply immediately to current elements
    updateLanguage(savedLang, true);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => updateLanguage(savedLang, true));
    } else {
      setTimeout(() => updateLanguage(savedLang, true), 300);
    }

    const switcher = document.getElementById('langSwitcher');
    if (switcher) {
      switcher.addEventListener('click', () => {
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const nextLang = currentLang === 'en' ? 'es' : 'en';
        updateLanguage(nextLang);
      });
    }

    // Navigation Link Logic
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.navbar_links');
      if (!link) return;

      const slotText = link.textContent.trim().toUpperCase();
      const isWork = slotText.includes('WORK') || slotText.includes('OBRA');
      const isContact = slotText.includes('CONTACT') || slotText.includes('CONTACTO');

      if (!isWork && !isContact) return;

      const path = window.location.pathname;
      const isIndex = path.endsWith('/index.html') || path === '/' || path.endsWith('/');

      if (isIndex) {
        e.preventDefault();
        e.stopPropagation();
        if (isContact) {
          window.dispatchEvent(new CustomEvent('navigateToContact'));
        } else {
          window.dispatchEvent(new CustomEvent('navigateToWorks'));
        }
      }
    });
  }

  function initArrowAnimation() {
    const canvas = document.getElementById('headerArrowCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const arrowSpeed = 2.5;
    const headSize = 10;
    const trailDuration = 2000;
    const pauseDuration = 1000;
    const startMargin = 40;

    let trail = [];
    let pathPoints = [];
    let totalPathLength = 0;
    let distanceTraveled = 0;
    let isPaused = false;
    let pauseStartTime = 0;
    let lastTime = 0;

    function resize() {
      const container = document.querySelector('.navbar_container2');
      if (container) {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }
      calculatePath();
    }

    function calculatePath() {
      // Select nav links AND elements in the right group (switcher, socials)
      const navItems = Array.from(document.querySelectorAll('.nav-menu-two li a'));
      const rightItems = Array.from(document.querySelectorAll('.header-right-group > *')); // Direct children: switcher wrapper, social links container
      const items = [...navItems, ...rightItems];

      if (!items.length) {
        pathPoints = [
          { x: startMargin, y: canvas.clientHeight / 2 },
          { x: canvas.clientWidth + 100, y: canvas.clientHeight / 2 }
        ];
      } else {
        let minX = Infinity, maxX = -Infinity, minY = Infinity;
        const lang = localStorage.getItem('preferredLanguage') || 'en';

        const containerRect = canvas.getBoundingClientRect();
        items.forEach(item => {
          let rect = item.getBoundingClientRect();

          // If item is a nav link with a slot, find the visible span to get exact text position
          const slot = item.querySelector('.nav-link-slot');
          if (slot) {
            const spans = slot.querySelectorAll('span');
            // 0: EN (ABOUT), 1: ES (BIO), 2: Hover/Extra
            // Check if spans exist before accessing
            if (spans.length >= 2) {
              const visibleSpan = (lang === 'es') ? spans[1] : spans[0];
              if (visibleSpan) {
                rect = visibleSpan.getBoundingClientRect();
              }
            }
          }

          // Ignore items that are not visible (width or height is 0)
          if (rect.width === 0 || rect.height === 0) return;

          const left = rect.left - containerRect.left;

          // Ignore items on the far left (logo area)
          if (left < 150) return;

          const right = rect.right - containerRect.left;
          const top = rect.top - containerRect.top;
          if (left < minX) minX = left;
          if (right > maxX) maxX = right;
          if (top < minY) minY = top;
        });

        const baseY = canvas.clientHeight / 2;
        const jumpY = Math.max(minY - 10, 20);
        const buffer = 15;
        const obsStart = Math.max(minX - buffer, startMargin + 10);
        const obsEnd = maxX + buffer;

        pathPoints = [
          { x: startMargin, y: baseY },
          { x: obsStart, y: baseY },
          { x: obsStart, y: jumpY },
          { x: obsEnd, y: jumpY },
          { x: obsEnd, y: baseY },
          { x: canvas.clientWidth + 100, y: baseY }
        ];
      }

      totalPathLength = 0;
      for (let i = 0; i < pathPoints.length - 1; i++) {
        totalPathLength += Math.hypot(pathPoints[i + 1].x - pathPoints[i].x, pathPoints[i + 1].y - pathPoints[i].y);
      }
    }

    function getPointAtDistance(dist) {
      let currentDist = dist;
      for (let i = 0; i < pathPoints.length - 1; i++) {
        const segLen = Math.hypot(pathPoints[i + 1].x - pathPoints[i].x, pathPoints[i + 1].y - pathPoints[i].y);
        if (currentDist <= segLen) {
          const t = segLen === 0 ? 0 : currentDist / segLen;
          return {
            x: pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * t,
            y: pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * t,
            angle: Math.atan2(pathPoints[i + 1].y - pathPoints[i].y, pathPoints[i + 1].x - pathPoints[i].x)
          };
        }
        currentDist -= segLen;
      }
      return pathPoints.length > 0 ? { ...pathPoints[pathPoints.length - 1], angle: 0 } : { x: 0, y: 0, angle: 0 };
    }

    function animate(time) {
      const now = time || performance.now();
      const dt = (now - lastTime) / 16.666;
      lastTime = now;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      if (pathPoints.length === 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      if (isPaused) {
        if (now - pauseStartTime >= pauseDuration) {
          isPaused = false;
          distanceTraveled = 0;
          trail = [];
        }
        animationId = requestAnimationFrame(animate);
        return;
      }

      distanceTraveled += arrowSpeed * (dt > 2 ? 1 : dt);
      if (distanceTraveled > totalPathLength) {
        isPaused = true;
        pauseStartTime = now;
        animationId = requestAnimationFrame(animate);
        return;
      }

      const currentP = getPointAtDistance(distanceTraveled);
      trail.push({ x: currentP.x, y: currentP.y, time: now });
      trail = trail.filter(p => now - p.time < trailDuration);

      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = '#0000FF';
        ctx.lineWidth = 2;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(currentP.x, currentP.y);
      ctx.rotate(currentP.angle);
      ctx.fillStyle = '#0000FF';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-headSize, -3);
      ctx.lineTo(-headSize + 1.5, 0);
      ctx.lineTo(-headSize, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);

    // Resize listener for responsive text (e.g., CV button)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        updateLanguage(lang, true); // Re-apply current language (isInitial=true to avoid transition triggers)
      }, 100);
    });

    setTimeout(resize, 600);
    animate();
  }

  // Auto-initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }

  // Global Exposed API
  window.navComponent = {
    updatePageTranslations: (animate = false) => {
      if (internalUpdateLanguage) {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        // If animate is false, we pass true (isInitial) which skips transitions
        internalUpdateLanguage(lang, !animate);
      }
    }
  };

})();
