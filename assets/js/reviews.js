
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".reviews__slider");
    const track = document.querySelector(".reviews__track");
    const items = document.querySelectorAll(".reviews__item");

    const prevButton = document.querySelector(".reviews__arrow--prev");
    const nextButton = document.querySelector(".reviews__arrow--next");
    const pagination = document.querySelector(".reviews__pagination");

    if (!slider || !track || !items.length || !prevButton || !nextButton || !pagination) {
        return;
    }

    let currentIndex = 0;
    let visibleItems = 2;
    let itemWidth = 0;
    let gap = 0;
    let maxIndex = 0;

    // Определяем количество видимых карточек
    function getVisibleItems() {
        return window.innerWidth <= 768 ? 1 : 2;
    }

    // Рассчитываем размеры слайдера
    function updateSlider() {
        visibleItems = getVisibleItems();

        const trackStyles = window.getComputedStyle(track);

        gap = parseFloat(trackStyles.columnGap) || 0;
        itemWidth = items[0].getBoundingClientRect().width;

        maxIndex = Math.max(0, items.length - visibleItems);

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        updatePosition();
        createPagination();
        updateControls();
    }

    // Перемещение слайдов
    function updatePosition() {
        const offset = currentIndex * (itemWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;
    }

    // Создание точек пагинации
    function createPagination() {
        pagination.innerHTML = "";

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("button");

            dot.classList.add("reviews__dot");
            dot.type = "button";
            dot.setAttribute("aria-label", `Перейти к отзыву ${i + 1}`);

            if (i === currentIndex) {
                dot.classList.add("is-active");
                dot.setAttribute("aria-current", "true");
            }

            dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
            });

            pagination.appendChild(dot);
        }
    }

    // Обновление стрелок и пагинации
    function updateControls() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;

        const dots = pagination.querySelectorAll(".reviews__dot");

        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;

            dot.classList.toggle("is-active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    // Следующий слайд
    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updatePosition();
            updateControls();
        }
    }

    // Предыдущий слайд
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updatePosition();
            updateControls();
        }
    }

    // Обработчики стрелок
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    // Свайп
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].clientX;

        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < 50) return;

        if (difference > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }, { passive: true });

    // Пересчет при изменении размера окна
    let resizeTimer;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            updateSlider();
        }, 150);
    });

    // Инициализация
    updateSlider();
});
