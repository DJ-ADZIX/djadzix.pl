function reveal() {
    var reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementBottom = reveals[i].getBoundingClientRect().bottom;
        var elementVisible = 150; // margines pojawiania się

        // Sprawdzamy, czy element jest w widocznym obszarze okna
        if (elementTop < windowHeight - elementVisible && elementBottom > 0) {
            reveals[i].classList.add("active");
        } else {
            // Ta linia odpowiada za "zwijanie" animacji przy skrolowaniu w górę
            reveals[i].classList.remove("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal(); // Wywołanie na starcie



function handleScrollEffects() {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // --- 1. LOGIKA ZANIKANIA ZDJĘCIA ---
        const heroImg = document.getElementById("heroImage");
        if (heroImg) {
            // Obliczamy opacity: startujemy od 0.6, zanika do 0 na wysokości 80% ekranu
            let opacity = 0.6 - (scrollPos / (windowHeight * 0.8));
            
            // Dodatkowy efekt lekkiego powiększenia przy skrolowaniu (opcjonalne)
            let scale = 1 + (scrollPos / 5000); 

            if (opacity >= 0) {
                heroImg.style.opacity = opacity;
                heroImg.style.transform = `scale(${scale})`;
            } else {
                heroImg.style.opacity = 0;
            }
        }

        // --- 2. LOGIKA POJAWIANIA SIĘ SEKCJI (REVEAL) ---
        const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
        for (let i = 0; i < reveals.length; i++) {
            let elementTop = reveals[i].getBoundingClientRect().top;
            let elementBottom = reveals[i].getBoundingClientRect().bottom;
            let elementVisible = 150;

            if (elementTop < windowHeight - elementVisible && elementBottom > 0) {
                reveals[i].classList.add("active");
            } else {
                reveals[i].classList.remove("active");
            }
        }
    }

    // Wywołanie przy skrolowaniu
    window.addEventListener("scroll", handleScrollEffects);
    
    // Wywołanie przy starcie strony
    window.addEventListener("load", handleScrollEffects);


function handleHeroEffects() {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const heroImg = document.getElementById("heroImage");
        const welcomeText = document.getElementById("welcomeText");

        // --- FAZA 1 i 2: Rozmycie zdjęcia i pojawianie się tekstu ---
        // Blur rośnie od 0 do 10px na dystansie pierwszych 400px scrolla
        let blurVal = Math.min(scrollPos / 40, 10);
        heroImg.style.filter = `blur(${blurVal}px) brightness(${1 - (blurVal/20)})`;

        // Tekst pojawia się, gdy scroll minie 200px
        if (scrollPos > 200 && scrollPos < windowHeight * 2) {
            welcomeText.style.opacity = "1";
            welcomeText.style.transform = "translateY(0)";
        } else if (scrollPos <= 200) {
            welcomeText.style.opacity = "0";
            welcomeText.style.transform = "translateY(30px)";
        } else {
            // Tekst znika, gdy schodzimy do sekcji niżej
            welcomeText.style.opacity = "0";
        }

        // --- FAZA 3: Całkowite znikanie zdjęcia ---
        // Zdjęcie zaczyna znikać dopiero po przejechaniu 80% wysokości ekranu
        let fadeStart = windowHeight * 0.5;
        let opacity = 1 - ((scrollPos - fadeStart) / (windowHeight * 0.5));
        
        if (scrollPos > fadeStart) {
            heroImg.style.opacity = Math.max(opacity, 0);
        } else {
            heroImg.style.opacity = 1;
        }

        // Pozostałe sekcje reveal (te z dołu strony)
        const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
        reveals.forEach(el => {
            let rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 150 && rect.bottom > 0) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", handleHeroEffects);
    window.addEventListener("load", handleHeroEffects);

    // --- DYNAMICZNE DOŁADOWANIE NAV Z index.html ---
    function includeNavFromIndex() {
        // Jeśli już jest <nav> na stronie, nic nie robimy
        if (document.querySelector('nav')) return;
        // Najpierw próbujemy pobrać nav z index.html (działa gdy strona jest serwowana)
        fetch('index.html')
            .then(response => {
                if (!response.ok) throw new Error('Brak odpowiedzi');
                return response.text();
            })
            .then(html => {
                const tmp = document.createElement('div');
                tmp.innerHTML = html;
                const nav = tmp.querySelector('nav');
                if (nav) insertNavAndMarkActive(nav);
                else throw new Error('Brak <nav> w index.html');
            })
            .catch(err => {
                // Jeśli fetch się nie uda (np. file:// blokuje żądanie), używamy fallbacku
                console.warn('Nie udało się pobrać nav z index.html, używam fallbacku:', err);
                const tmp = document.createElement('div');
                tmp.innerHTML = `
<nav>
    <div class="logo">
        <a href="index.html"><img src="GRAFIKI/PNG/A_LOGO.png" alt="LOGO_ADIZXPL"></a>
    </div>
    <div class="nav-links">
        <a href="index.html">O NAS</a>
        <a href="dj.html">DJ / EVENTY</a>
        <a href="technika.html">TECHNIKA</a>
        <a href="montaz.html">VIDEO</a>
        <a href="oferta.html">OFERTA</a>
        <a href="kontakt.html">KONTAKT</a>
    </div>
</nav>
                `;
                const nav = tmp.querySelector('nav');
                if (nav) insertNavAndMarkActive(nav);
            });
    }

    window.addEventListener('DOMContentLoaded', includeNavFromIndex);

    function insertNavAndMarkActive(nav) {
        document.body.insertBefore(nav, document.body.firstChild);
        const links = nav.querySelectorAll('.nav-links a');
        const path = window.location.pathname.split('/').pop().toLowerCase();

        // Mapowanie podstron do sekcji w menu (np. reels -> VIDEO)
        const subPageMap = {
            'reels.html': 'montaz.html',
            'imprezy.html': 'montaz.html',
            'klasyczne.html': 'montaz.html'
        };

        links.forEach(a => {
            a.classList.remove('active');
            const href = a.getAttribute('href');
            if (href === path || (href === 'index.html' && (path === '' || path === 'index.html')) || subPageMap[path] === href) {
                a.classList.add('active');
            }
        });
    }



// Opcjonalnie: blokada skrótów klawiszowych (np. Ctrl+U, Ctrl+S)
document.addEventListener('keydown', function(e) {
    // Blokuje F12 (Narzędzia deweloperskie)
    if (e.keyCode == 123) {
        e.preventDefault();
    }
    // Blokuje Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (Podgląd kodu)
    if (e.ctrlKey && (e.shiftKey && (e.keyCode == 73 || e.keyCode == 74) || e.keyCode == 85)) {
        e.preventDefault();
    }
}, false);

 // Blokada prawego przycisku myszy
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, false);

// Opcjonalnie: blokada skrótów klawiszowych (np. Ctrl+U, Ctrl+S)
document.addEventListener('keydown', function(e) {
    // Blokuje F12 (Narzędzia deweloperskie)
    if (e.keyCode == 123) {
        e.preventDefault();
    }
    // Blokuje Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (Podgląd kodu)
    if (e.ctrlKey && (e.shiftKey && (e.keyCode == 73 || e.keyCode == 74) || e.keyCode == 85)) {
        e.preventDefault();
    }
}, false);

// Hide the hero section on scroll
window.addEventListener('scroll', () => {
    const heroContainer = document.querySelector('.hero-image-container');
    if (window.scrollY > 50) { // Adjust the scroll threshold as needed
        heroContainer.classList.add('hidden');
    } else {
        heroContainer.classList.remove('hidden');
    }
});

// Dynamically load the footer from a single file
function loadFooter() {
    const footerHTML = `
        <footer>
            <p>&copy; 2026 AdzixPL. Wszelkie prawa zastrzeżone.</p>
        </footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

window.addEventListener('DOMContentLoaded', loadFooter);

// Change hero image to black after scrolling down
function handleHeroImageChange() {
    const heroImg = document.getElementById("heroImage");
    const scrollThreshold = 200; // Adjust the scroll threshold as needed

    if (window.scrollY > scrollThreshold) {
        heroImg.src = "GRAFIKI/PNG/BLACK.jpg"; // Path to the black image
    } else {
        heroImg.src = "GRAFIKI/PNG/BACKGROUND_GŁÓWNY.png"; // Path to the original image
    }
}

window.addEventListener("scroll", handleHeroImageChange);

function handleTextAndImageAnimation() {
    const welcomeText = document.getElementById("welcomeText");
    // Pobieramy wszystkie elementy z klasą .animated-image (np. główny i ten pod nim)
    const animatedImages = document.querySelectorAll(".animated-image");

    if (welcomeText && animatedImages.length > 0) {
        // Konfiguracja początkowa: pierwsza grafika z lewej, druga z prawej z opóźnieniem
        animatedImages.forEach((img, index) => {
            if (!img.classList.contains('pos-set')) {
                img.classList.add('pos-set');
                if (index === 0) {
                    img.classList.add('pos-left');
                    img.parentElement.style.justifyContent = 'flex-start';
                } else {
                    img.classList.add('pos-right', 'delay-500');
                    img.parentElement.style.justifyContent = 'flex-end';
                }
            }
        });

        // Sprawdzamy, czy tekst jest widoczny (opacity ustawione na 1 w handleHeroEffects)
        if (welcomeText.style.opacity === "1") {
            animatedImages.forEach(img => {
                img.classList.add("active");
            });
        } else {
            animatedImages.forEach(img => {
                img.classList.remove("active");
            });
        }
    }
}

// Trigger the animation on scroll and page load
window.addEventListener("scroll", handleTextAndImageAnimation);
window.addEventListener("load", handleTextAndImageAnimation);

// --- SPLASH SCREEN / INTRO ---
function initSplashScreen() {
    // Sprawdzenie czy to strona główna (index.html)
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page !== "index.html" && page !== "") return;

    // Tworzenie kontenera intro dynamicznie
    const splashDiv = document.createElement('div');
    splashDiv.id = 'splash-screen';
    
    const splashImg = document.createElement('img');
    splashImg.src = "GRAFIKI/PNG/ADZIX_TAPETA.png"; // Ścieżka do Twojej grafiki
    splashImg.alt = 'AdzixPL';
    
    splashDiv.appendChild(splashImg);
    document.body.appendChild(splashDiv);
    
    // Blokada scrollowania (body i html)
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0); // Wymuszenie startu od góry

    setTimeout(() => {
        splashDiv.classList.add('hidden'); // Rozpocznij zanikanie
        document.body.style.overflow = ''; // Odblokuj scrollowanie body
        document.documentElement.style.overflow = ''; // Odblokuj scrollowanie html
        window.scrollTo(0, 0); // Upewnij się, że strona jest na górze po animacji
        setTimeout(() => splashDiv.remove(), 3000); // Usuń element z DOM po zakończeniu animacji
    }, 1000); // Czas wyświetlania intro (1 sekunda)
}

window.addEventListener('DOMContentLoaded', initSplashScreen);

// --- AUTOMATYCZNY SLIDESHOW ---
function initSlideshow() {
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach(container => {
        const slides = container.querySelectorAll('.slideshow-slide');
        if (slides.length < 2) return; // Jeśli mniej niż 2 zdjęcia, nie animuj

        let currentIndex = 0;
        
        // Jeśli żaden slajd nie ma klasy active, ustawiamy pierwszy
        if (!container.querySelector('.slideshow-slide.active')) {
            slides[0].classList.add('active');
        }

        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }, 3000); // Zmiana co 3 sekundy
    });
}

window.addEventListener('DOMContentLoaded', initSlideshow);

// --- MANUAL CAROUSEL LOGIC (SLIDER ZE STRZAŁKAMI) ---
function initManualCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextBtn = carousel.querySelector('.next-btn');
        const prevBtn = carousel.querySelector('.prev-btn');
        const dotsNav = carousel.querySelector('.carousel-dots');

        if (slides.length === 0) return;

        // Generowanie kropek na podstawie liczby zdjęć
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dotsNav.appendChild(dot);
            
            // Kliknięcie w kropkę
            dot.addEventListener('click', () => {
                moveToSlide(track, index, dotsNav);
            });
        });

        let currentIndex = 0;

        const moveToSlide = (track, targetIndex, dotsNav) => {
            track.style.transform = 'translateX(-' + (targetIndex * 100) + '%)';
            currentIndex = targetIndex;
            
            // Aktualizacja aktywnej kropki
            const currentDot = dotsNav.querySelector('.active');
            const targetDot = dotsNav.children[targetIndex];
            if(currentDot) currentDot.classList.remove('active');
            if(targetDot) targetDot.classList.add('active');
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0; // Pętla do początku
            }
            moveToSlide(track, nextIndex, dotsNav);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1; // Pętla do końca
            }
            moveToSlide(track, prevIndex, dotsNav);
        });
    });
}

window.addEventListener('DOMContentLoaded', initManualCarousels);
