document.addEventListener('DOMContentLoaded', () => {
    const pagesData = ['pages/1.png', 'pages/2.png', 'pages/3.png', 'pages/4.png', 'pages/5.png', 'pages/6.png', 'pages/7.png', 'pages/8.png', 'pages/9.png', 'pages/10.png', 'pages/11.png', 'pages/12.png', 'pages/13.png', 'pages/14.png', 'pages/15.png', 'pages/16.jpg'];
    const book = document.getElementById('book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageIndicator = document.getElementById('page-indicator');
    const flipSound = document.getElementById('flip-sound');

    const MOBILE_BREAKPOINT = 768;
    let isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;
    let isFlipping = false;
    let desktopPages = [], mobilePages = [];
    let currentSheet = 0, currentPageMobile = 0;
    const numSheets = pagesData.length / 2;

    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    function playFlipSound() { flipSound.currentTime = 0; flipSound.play().catch(e => { }); }

    function goNextPage() { isMobileView ? goNextPageMobile() : goNextPageDesktop(); }
    function goPrevPage() { isMobileView ? goPrevPageMobile() : goPrevPageDesktop(); }

    function createDesktopBook() { book.innerHTML = ''; for (let i = 0; i < numSheets; i++) { const pageElement = document.createElement('div'); pageElement.classList.add('page'); pageElement.style.zIndex = numSheets - i; const frontContent = document.createElement('div'); frontContent.classList.add('page-content', 'front'); const frontImg = document.createElement('img'); frontImg.src = pagesData[i * 2]; frontContent.appendChild(frontImg); const backContent = document.createElement('div'); backContent.classList.add('page-content', 'back'); if (pagesData[i * 2 + 1]) { const backImg = document.createElement('img'); backImg.src = pagesData[i * 2 + 1]; backContent.appendChild(backImg); } pageElement.appendChild(frontContent); pageElement.appendChild(backContent); book.appendChild(pageElement); } desktopPages = Array.from(book.querySelectorAll('.page')); }
    function updateDesktopUI() { if (currentSheet === 0) { pageIndicator.textContent = 'Cover'; } else if (currentSheet === numSheets) { pageIndicator.textContent = 'Back Cover'; } else { pageIndicator.textContent = `Pages ${currentSheet * 2} - ${currentSheet * 2 + 1}`; } prevBtn.disabled = currentSheet === 0 || isFlipping; nextBtn.disabled = currentSheet === numSheets || isFlipping; }
    function goNextPageDesktop() { if (isFlipping || currentSheet >= numSheets) return; isFlipping = true; const pageToFlip = desktopPages[currentSheet]; pageToFlip.style.zIndex = numSheets + 1; pageToFlip.classList.add('flipped'); currentSheet++; if (currentSheet === 1) book.classList.add('open'); if (currentSheet === numSheets) book.classList.replace('open', 'closed-at-end'); playFlipSound(); updateDesktopUI(); setTimeout(() => { isFlipping = false; pageToFlip.style.zIndex = currentSheet; updateDesktopUI(); }, 1200); }
    function goPrevPageDesktop() { if (isFlipping || currentSheet <= 0) return; isFlipping = true; currentSheet--; const pageToUnflip = desktopPages[currentSheet]; pageToUnflip.style.zIndex = numSheets + 1; pageToUnflip.classList.remove('flipped'); if (currentSheet === 0) book.classList.remove('open'); if (currentSheet === numSheets - 1) book.classList.replace('closed-at-end', 'open'); playFlipSound(); updateDesktopUI(); setTimeout(() => { isFlipping = false; pageToUnflip.style.zIndex = numSheets - currentSheet; updateDesktopUI(); }, 1200); }

    function createMobileBook() { book.innerHTML = ''; mobilePages = []; pagesData.forEach((src) => { const page = document.createElement('div'); page.classList.add('mobile-page'); const img = document.createElement('img'); img.src = src; page.appendChild(img); book.appendChild(page); mobilePages.push(page); }); mobilePages[0].classList.add('active'); }
    function updateMobileUI() { prevBtn.disabled = currentPageMobile === 0 || isFlipping; nextBtn.disabled = currentPageMobile === pagesData.length - 1 || isFlipping; }
    function goNextPageMobile() { if (isFlipping || currentPageMobile >= pagesData.length - 1) return; isFlipping = true; const outgoingPage = mobilePages[currentPageMobile]; const incomingPage = mobilePages[currentPageMobile + 1]; playFlipSound(); outgoingPage.classList.add('flip-out'); incomingPage.classList.add('active', 'flip-in'); setTimeout(() => { outgoingPage.classList.remove('active', 'flip-out'); incomingPage.classList.remove('flip-in'); isFlipping = false; updateMobileUI(); }, 1000); currentPageMobile++; updateMobileUI(); }
    function goPrevPageMobile() { if (isFlipping || currentPageMobile <= 0) return; isFlipping = true; const outgoingPage = mobilePages[currentPageMobile]; const incomingPage = mobilePages[currentPageMobile - 1]; playFlipSound(); outgoingPage.classList.add('flip-out-prev'); incomingPage.classList.add('active', 'flip-in-prev'); setTimeout(() => { outgoingPage.classList.remove('active', 'flip-out-prev'); incomingPage.classList.remove('flip-in-prev'); isFlipping = false; updateMobileUI(); }, 1000); currentPageMobile--; updateMobileUI(); }

    function initialize() {
        if (isTouchDevice()) {
            document.body.classList.add('touch-device');
        } else {
            const cursorDot = document.querySelector('.cursor-dot'); const cursorOutline = document.querySelector('.cursor-outline'); let targetX = 0, targetY = 0, outlineX = 0, outlineY = 0;
            window.addEventListener('mousemove', e => { targetX = e.clientX; targetY = e.clientY; });
            const animateCursor = () => { outlineX += (targetX - outlineX) * 0.1; outlineY += (targetY - outlineY) * 0.1; cursorDot.style.transform = `translate(-50%, -50%) translate3d(${targetX}px, ${targetY}px, 0)`; cursorOutline.style.transform = `translate(-50%, -50%) translate3d(${outlineX}px, ${outlineY}px, 0)`; requestAnimationFrame(animateCursor); };
            requestAnimationFrame(animateCursor);
            document.querySelectorAll('.book, .nav-btn, .social-links a').forEach(el => { el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); cursorOutline.classList.add('hover'); }); el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hover'); cursorOutline.classList.remove('hover'); }); });
        }

        if (isMobileView) { book.classList.remove('open', 'closed-at-end'); createMobileBook(); updateMobileUI(); }
        else { createDesktopBook(); updateDesktopUI(); }

        prevBtn.addEventListener('click', goPrevPage);
        nextBtn.addEventListener('click', goNextPage);

        window.addEventListener('resize', () => {
            const newIsMobile = window.innerWidth <= MOBILE_BREAKPOINT;
            if (newIsMobile !== isMobileView) location.reload();
        });
    }

    initialize();
});