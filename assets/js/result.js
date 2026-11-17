
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".results__slider");
    const track = document.querySelector(".results__track");
    const prevButton = document.querySelector(".results__arrow--prev");
    const nextButton = document.querySelector(".results__arrow--next");
    const pagination = document.querySelector(".results__pagination");

    if (!slider || !track || !pagination || !prevButton || !nextButton) {
        return;
    }

    const items = Array.from(track.querySelectorAll(".results__item"));

    if (!items.length) return;

    let currentIndex = 0;
    let maxIndex = 0;
    let itemStep = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let activePointerId = null;
    let suppressClick = false;
    let clickTimer = null;

    // ==============================
    // CALCULATE SLIDER
    // ==============================

    function calculateSlider() {
        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap) || 0;
        const itemWidth = items[0].getBoundingClientRect().width;

        if (!itemWidth) return;

        itemStep = itemWidth + gap;

        const visibleItems = Math.max(
            1,
            Math.min(
                Math.round((slider.clientWidth + gap) / itemStep),
                items.length
            )
        );

        maxIndex = Math.max(0, items.length - visibleItems);

        currentIndex = Math.min(currentIndex, maxIndex);

        createPagination();
        updateSlider();
    }

    // ==============================
    // CREATE PAGINATION
    // ==============================

    function createPagination() {
        pagination.innerHTML = "";

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("button");

            dot.className = "results__dot";
            dot.type = "button";
            dot.setAttribute("aria-label", `Перейти к слайду ${i + 1}`);

            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
            });

            pagination.appendChild(dot);
        }
    }

    // ==============================
    // UPDATE SLIDER
    // ==============================

    function updateSlider() {
        track.style.transform = `translate3d(-${currentIndex * itemStep}px, 0, 0)`;

        const dots = pagination.querySelectorAll(".results__dot");

        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;

            dot.classList.toggle("is-active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === maxIndex;
    }

    // ==============================
    // NEXT / PREVIOUS
    // ==============================

    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);

    // ==============================
    // SWIPE / DRAG
    // ==============================

    const swipeThreshold = 50;

    slider.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        if (event.target.closest("button")) return;

        if (event.target.closest("a")) return;

        if (event.target.closest(".results__lightbox")) return;

        isDragging = true;
        activePointerId = event.pointerId;

        startX = event.clientX;
        startY = event.clientY;

        suppressClick = false;

        try {
            slider.setPointerCapture(event.pointerId);
        } catch (error) {
            // Pointer capture may be unavailable.
        }
    });

    slider.addEventListener("pointerup", (event) => {
        if (!isDragging || event.pointerId !== activePointerId) {
            return;
        }

        const diffX = event.clientX - startX;
        const diffY = event.clientY - startY;

        isDragging = false;
        activePointerId = null;

        // Игнорируем вертикальное движение
        if (Math.abs(diffX) < Math.abs(diffY)) {
            return;
        }

        // Игнорируем короткое движение
        if (Math.abs(diffX) < swipeThreshold) {
            return;
        }

        suppressClick = true;

        clearTimeout(clickTimer);

        clickTimer = setTimeout(() => {
            suppressClick = false;
        }, 400);

        if (diffX < 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    });

    function cancelSwipe(event) {
        if (!isDragging || event.pointerId !== activePointerId) {
            return;
        }

        isDragging = false;
        activePointerId = null;
    }

    slider.addEventListener("pointercancel", cancelSwipe);

    slider.addEventListener("lostpointercapture", () => {
        isDragging = false;
        activePointerId = null;
    });

    // ==============================
    // PREVENT CLICK AFTER SWIPE
    // ==============================

    slider.addEventListener("click", (event) => {
        if (!suppressClick) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        suppressClick = false;
        clearTimeout(clickTimer);
    }, true);

    // ==============================
    // IMAGE LIGHTBOX
    // ==============================

    let lightbox = null;
    let previousFocus = null;
    let previousBodyOverflow = "";

    function openLightbox(image) {
        if (lightbox) return;

        previousFocus = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;

        lightbox = document.createElement("div");
        lightbox.className = "results__lightbox";

        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Imagen del resultado");

        const closeButton = document.createElement("button");

        closeButton.className = "results__lightbox-close";
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Cerrar imagen");
        closeButton.textContent = "×";

        const enlargedImage = document.createElement("img");

        enlargedImage.className = "results__lightbox-image";
        enlargedImage.src = image.src;
        enlargedImage.alt = image.alt;

        lightbox.append(closeButton, enlargedImage);

        document.body.appendChild(lightbox);

        document.body.style.overflow = "hidden";

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        closeButton.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.remove();
        lightbox = null;

        document.body.style.overflow = previousBodyOverflow;

        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus();
        }
    }

    // OPEN IMAGE
    track.addEventListener("click", (event) => {
        if (suppressClick) return;

        const image = event.target.closest(".results__image");

        if (image) {
            openLightbox(image);
        }
    });

    // CLOSE WITH ESCAPE
    document.addEventListener("keydown", (event) => {
        if (lightbox && event.key === "Escape") {
            closeLightbox();
        }
    });

    // ==============================
    // RESIZE
    // ==============================

    let resizeTimeout;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            calculateSlider();
        }, 150);
    });

    // ==============================
    // INITIALIZE
    // ==============================

    calculateSlider();
});
